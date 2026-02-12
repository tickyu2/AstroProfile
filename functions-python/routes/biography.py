"""
Biography ingestion and biographic extraction endpoints.
Handles RAG migration, diary ingestion, and Brain 1B → Brain 2 consolidation.
"""

from firebase_functions import https_fn, options
import json
import os
from datetime import datetime
from firebase_admin import firestore
from routes.shared import (
    ALLOWED_ORIGINS,
    NEO4J_URI_SECRET,
    NEO4J_PASSWORD_SECRET,
    OPENAI_API_KEY_SECRET,
    ANTHROPIC_API_KEY_SECRET,
    ADMIN_KEY_SECRET,
    get_neo4j_service,
    verify_auth,
    error_response,
    BIOGRAPHER_AVAILABLE,
    BIOGRAPHER_ERROR,
)

if BIOGRAPHER_AVAILABLE:
    from routes.shared import (
        BiographicExtractor,
        consolidate_memory,
        ingest_into_graph,
    )


# =============================================================================
# RAG DATABASE MIGRATION ENDPOINT
# =============================================================================

# Define Cloud SQL secrets - TEMPORARILY COMMENTED OUT until PG_PASSWORD secret is set
# PG_PASSWORD_SECRET = SecretParam("PG_PASSWORD")


# TEMPORARILY COMMENTED OUT - set PG_PASSWORD secret first: firebase functions:secrets:set PG_PASSWORD
# @https_fn.on_request(
#     cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["POST"]),
#     memory=options.MemoryOption.MB_512,
#     timeout_sec=120,
#     secrets=[PG_PASSWORD_SECRET]
# )
def _run_rag_migration_disabled(req: https_fn.Request) -> https_fn.Response:
    """
    Run RAG database migration - creates biography_chunks table with pgvector.
    Run once after setting up Cloud SQL.

    POST body:
    {
        "adminKey": "your-admin-key"
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        user, err = verify_auth(req)
        if err:
            return err

        data = req.get_json() or {}

        # Admin key check
        admin_key = os.environ.get("ADMIN_KEY")
        if not admin_key:
            return https_fn.Response(
                json.dumps({"error": "ADMIN_KEY not configured"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )
        if data.get("adminKey") != admin_key:
            return https_fn.Response(
                json.dumps({"error": "Unauthorized"}),
                status=401,
                headers={"Content-Type": "application/json"}
            )

        # Import pg8000 and sqlalchemy
        try:
            import pg8000
            import sqlalchemy
            from sqlalchemy import text
        except ImportError as e:
            return https_fn.Response(
                json.dumps({"error": f"Database libraries not available: {e}"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Get connection params
        db_user = os.environ.get("PG_USER", "postgres")
        db_pass = os.environ.get("PG_PASSWORD", "")
        db_name = os.environ.get("PG_DATABASE", "genesis_memory")
        instance_connection_name = os.environ.get("CLOUD_SQL_CONNECTION_NAME")

        if not instance_connection_name:
            return https_fn.Response(
                json.dumps({"error": "CLOUD_SQL_CONNECTION_NAME not configured"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        unix_socket_path = f"/cloudsql/{instance_connection_name}"

        # Create connection
        pool = sqlalchemy.create_engine(
            sqlalchemy.engine.url.URL.create(
                drivername="postgresql+pg8000",
                username=db_user,
                password=db_pass,
                database=db_name,
                query={"unix_sock": f"{unix_socket_path}/.s.PGSQL.5432"}
            ),
            pool_size=1,
            max_overflow=0
        )

        # Migration SQL
        migration_sql = """
        -- Enable pgvector extension
        CREATE EXTENSION IF NOT EXISTS vector;

        -- Biography chunks table for RAG
        CREATE TABLE IF NOT EXISTS biography_chunks (
            id SERIAL PRIMARY KEY,
            chunk_hash VARCHAR(64) UNIQUE,
            profile_id VARCHAR(255) NOT NULL,
            profile_name VARCHAR(255),
            chunk_index INTEGER DEFAULT 0,
            content TEXT NOT NULL,
            topics TEXT[],
            sentiment VARCHAR(50),
            entities TEXT[],
            constitutional_themes TEXT[],
            relationship_dynamics TEXT[],
            metadata JSONB,
            embedding vector(1536),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Indexes
        CREATE INDEX IF NOT EXISTS idx_biography_chunks_profile_id ON biography_chunks(profile_id);
        CREATE INDEX IF NOT EXISTS idx_biography_chunks_topics ON biography_chunks USING GIN(topics);
        CREATE INDEX IF NOT EXISTS idx_biography_chunks_entities ON biography_chunks USING GIN(entities);
        CREATE INDEX IF NOT EXISTS idx_biography_chunks_themes ON biography_chunks USING GIN(constitutional_themes);

        -- Update timestamp trigger
        CREATE OR REPLACE FUNCTION update_biography_chunks_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS trigger_update_biography_chunks_timestamp ON biography_chunks;
        CREATE TRIGGER trigger_update_biography_chunks_timestamp
            BEFORE UPDATE ON biography_chunks
            FOR EACH ROW
            EXECUTE FUNCTION update_biography_chunks_timestamp();
        """

        with pool.connect() as conn:
            conn.execute(text(migration_sql))
            conn.commit()

            # Verify
            result = conn.execute(text("""
                SELECT
                    (SELECT COUNT(*) FROM biography_chunks) as row_count,
                    (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'biography_chunks') as index_count
            """))
            row = result.fetchone()

        return https_fn.Response(
            json.dumps({
                "success": True,
                "message": "RAG migration completed successfully",
                "table": "biography_chunks",
                "rows": row[0] if row else 0,
                "indexes": row[1] if row else 0
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return error_response(e)


# =============================================================================
# BIOGRAPHY INGESTION ENDPOINTS
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["POST"]),
    memory=options.MemoryOption.GB_1,
    timeout_sec=300,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET, OPENAI_API_KEY_SECRET]
)
def ingest_biography(req: https_fn.Request) -> https_fn.Response:
    """
    Ingest biography text into Neo4j for GraphRAG.

    POST body:
    {
        "profileId": "historical_ronald_reagan",
        "profileName": "Ronald Reagan",
        "text": "Ronald Wilson Reagan was the 40th President...",
        "context": "Ronald Reagan, 40th President of the United States"
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        user, err = verify_auth(req)
        if err:
            return err

        data = req.get_json()

        # Validate required fields
        if not data.get("profileId") or not data.get("text"):
            return https_fn.Response(
                json.dumps({"error": "profileId and text are required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        # Import ingester
        try:
            from ingestion.biography_ingester import BiographyIngester
        except ImportError as e:
            return https_fn.Response(
                json.dumps({"error": f"Biography ingester not available: {e}"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Initialize ingester with Neo4j credentials from environment
        ingester = BiographyIngester(
            neo4j_uri=os.environ.get("NEO4J_URI"),
            neo4j_user=os.environ.get("NEO4J_USER", "neo4j"),
            neo4j_password=os.environ.get("NEO4J_PASSWORD"),
            openai_api_key=os.environ.get("OPENAI_API_KEY")
        )

        # Run ingestion
        from dataclasses import asdict
        result = ingester.ingest_text(
            text=data["text"],
            profile_id=data["profileId"],
            profile_name=data.get("profileName", data["profileId"]),
            profile_context=data.get("context"),
            source_file="api_ingestion"
        )

        ingester.close()

        return https_fn.Response(
            json.dumps(asdict(result)),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return error_response(e)


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["POST"]),
    memory=options.MemoryOption.GB_1,
    timeout_sec=300,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET, OPENAI_API_KEY_SECRET, ADMIN_KEY_SECRET]
)
def ingest_sample_reagan(req: https_fn.Request) -> https_fn.Response:
    """
    Ingest a sample Ronald Reagan biography for testing GraphRAG.

    POST body:
    {
        "adminKey": "your-admin-key"
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        user, err = verify_auth(req)
        if err:
            return err

        data = req.get_json() or {}

        # Admin key check
        admin_key = os.environ.get("ADMIN_KEY")
        if not admin_key:
            return https_fn.Response(
                json.dumps({"error": "ADMIN_KEY not configured"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )
        if data.get("adminKey") != admin_key:
            return https_fn.Response(
                json.dumps({"error": "Unauthorized"}),
                status=401,
                headers={"Content-Type": "application/json"}
            )

        # Sample Reagan biography for testing
        REAGAN_SAMPLE_TEXT = """
Ronald Wilson Reagan was the 40th President of the United States, serving from 1981 to 1989.
Born on February 6, 1911, in Tampico, Illinois, Reagan's journey from small-town America to
the White House is a quintessential American success story.

Before entering politics, Reagan had a successful career in Hollywood, appearing in over 50 films.
His experience as an actor gave him exceptional communication skills, earning him the nickname
"The Great Communicator." His ability to connect with the American public was unparalleled.

Reagan married Nancy Davis in 1952, and their partnership became one of the most devoted
marriages in presidential history. Nancy was fiercely protective of her husband, serving as
his closest advisor and confidante. Their bond was described as "a love affair that lasted
a lifetime."

During his presidency, Reagan faced numerous challenges, including the Cold War with the Soviet Union.
His leadership style emphasized optimism, American exceptionalism, and a strong stance against
communism. He famously challenged Soviet leader Mikhail Gorbachev to "tear down this wall"
at the Berlin Wall in 1987.

The assassination attempt on March 30, 1981, tested both Reagan's resilience and the Reagans'
marriage. Nancy's devotion during his recovery became legendary, and she never left his side
during his hospital stay. Reagan's humor in the face of danger - telling Nancy "Honey, I forgot
to duck" - revealed his character and their intimate partnership.

Reagan's economic policies, known as "Reaganomics," focused on tax cuts, deregulation, and
reduced government spending. While controversial, these policies shaped American economic
policy for decades.

In his later years, Reagan was diagnosed with Alzheimer's disease. He disclosed his diagnosis
in a handwritten letter to the American people in 1994, displaying the same grace that had
defined his public life. Nancy became his devoted caregiver until his death on June 5, 2004.

Their love story endures as a testament to partnership, loyalty, and devotion. As Nancy
once said, "My life really began when I married my husband."
"""

        # Import ingester
        try:
            from ingestion.biography_ingester import BiographyIngester
        except ImportError as e:
            return https_fn.Response(
                json.dumps({"error": f"Biography ingester not available: {e}"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Initialize ingester
        ingester = BiographyIngester(
            neo4j_uri=os.environ.get("NEO4J_URI"),
            neo4j_user=os.environ.get("NEO4J_USER", "neo4j"),
            neo4j_password=os.environ.get("NEO4J_PASSWORD"),
            openai_api_key=os.environ.get("OPENAI_API_KEY")
        )

        # Run ingestion
        from dataclasses import asdict
        result = ingester.ingest_text(
            text=REAGAN_SAMPLE_TEXT,
            profile_id="historical_ronald_reagan",
            profile_name="Ronald Reagan",
            profile_context="Ronald Reagan, 40th President of the United States, married to Nancy Reagan",
            source_file="sample_test"
        )

        ingester.close()

        return https_fn.Response(
            json.dumps({
                **asdict(result),
                "message": "Sample Reagan biography ingested successfully"
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return error_response(e)


# =============================================================================
# DIARY INGESTION ENDPOINTS (Reagan Diaries ePub)
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["POST"]),
    memory=options.MemoryOption.GB_2,
    timeout_sec=540,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET, OPENAI_API_KEY_SECRET]
)
def ingest_diary_epub(req: https_fn.Request) -> https_fn.Response:
    """
    Ingest a diary ePub file (e.g., The Reagan Diaries) into Neo4j.

    Creates DiaryEntry nodes with relationships:
    - (Person)-[:WROTE]->(DiaryEntry)
    - (DiaryEntry)-[:ON_DATE]->(Date)
    - (DiaryEntry)-[:MENTIONS]->(Person)
    - (DiaryEntry)-[:DISCUSSES]->(Topic)

    NOW WITH PERSPECTIVE LABELS (Rashomon Effect Prevention):
    - SELF: Subject's own words (Reagan Diaries)
    - SPOUSE: Nancy Reagan memoirs
    - INNER_CIRCLE: Don Regan, staff memoirs
    - ALLY: Thatcher, allied memoirs
    - ADVERSARY: Gorbachev, Soviet accounts
    - JOURNALIST: News reporting
    - HISTORIAN: Academic analysis

    POST body (multipart/form-data):
    - file: ePub file
    - authorName: "Ronald Reagan" (default)
    - sourceTitle: "The Reagan Diaries" (default)
    - perspective: "SELF" (default) - SELF, SPOUSE, INNER_CIRCLE, ALLY, ADVERSARY, JOURNALIST, HISTORIAN
    - perspectiveSubject: "ronald_reagan" (default) - who the content is ABOUT

    OR POST body (JSON):
    {
        "epubBase64": "base64 encoded epub",
        "authorName": "Ronald Reagan",
        "sourceTitle": "The Reagan Diaries",
        "perspective": "SELF",
        "perspectiveSubject": "ronald_reagan"
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        user, err = verify_auth(req)
        if err:
            return err

        # Import diary ingester
        try:
            from ingestion.diary_ingester import DiaryIngester
            from neo4j import GraphDatabase
        except ImportError as e:
            return https_fn.Response(
                json.dumps({"error": f"Diary ingester not available: {e}"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Get Neo4j credentials
        neo4j_uri = os.environ.get("NEO4J_URI")
        neo4j_password = os.environ.get("NEO4J_PASSWORD")
        openai_api_key = os.environ.get("OPENAI_API_KEY")

        if not neo4j_uri or not neo4j_password:
            return https_fn.Response(
                json.dumps({"error": "Neo4j credentials not configured"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Create Neo4j driver
        driver = GraphDatabase.driver(
            neo4j_uri,
            auth=(os.environ.get("NEO4J_USER", "neo4j"), neo4j_password)
        )

        # Determine content type and extract epub bytes
        content_type = req.content_type or ""
        epub_bytes = None
        author_name = "Ronald Reagan"
        source_title = "The Reagan Diaries"
        # Perspective fields (Rashomon Effect prevention)
        perspective = "SELF"
        perspective_subject = "ronald_reagan"

        if "multipart" in content_type:
            # Handle file upload
            files = req.files
            if "file" not in files:
                return https_fn.Response(
                    json.dumps({"error": "No file uploaded. Use 'file' field."}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )
            epub_bytes = files["file"].read()
            author_name = req.form.get("authorName", author_name)
            source_title = req.form.get("sourceTitle", source_title)
            perspective = req.form.get("perspective", perspective)
            perspective_subject = req.form.get("perspectiveSubject", perspective_subject)
        else:
            # Handle JSON with base64 encoded epub
            data = req.get_json()
            if not data or "epubBase64" not in data:
                return https_fn.Response(
                    json.dumps({"error": "Must provide 'epubBase64' field or upload file"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )
            import base64
            epub_bytes = base64.b64decode(data["epubBase64"])
            author_name = data.get("authorName", author_name)
            source_title = data.get("sourceTitle", source_title)
            perspective = data.get("perspective", perspective)
            perspective_subject = data.get("perspectiveSubject", perspective_subject)

        # Create ingester and process with perspective
        ingester = DiaryIngester(driver, openai_api_key)
        result = ingester.ingest_epub_bytes(
            epub_bytes=epub_bytes,
            author_name=author_name,
            source_title=source_title,
            perspective=perspective,
            perspective_subject=perspective_subject
        )

        driver.close()

        return https_fn.Response(
            json.dumps({
                "success": True,
                "message": f"Diary ingestion complete: {result['entries_stored']}/{result['entries_parsed']} entries",
                **result
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return error_response(e)


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["POST"]),
    memory=options.MemoryOption.GB_2,
    timeout_sec=540,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET, OPENAI_API_KEY_SECRET]
)
def ingest_diary_complete(req: https_fn.Request) -> https_fn.Response:
    """
    Complete multi-database ingestion: ePub → Firebase + pgvector + Neo4j

    This is the ONE endpoint to call for full Reagan Diaries ingestion.
    Stores chunks in all three databases simultaneously.

    NOW WITH PERSPECTIVE LABELS (Rashomon Effect Prevention):
    - SELF: Subject's own words (Reagan Diaries) - reliability 1.0
    - SPOUSE: Nancy Reagan memoirs - reliability 0.9
    - INNER_CIRCLE: Don Regan, staff memoirs - reliability 0.7
    - ALLY: Thatcher, allied memoirs - reliability 0.6
    - ADVERSARY: Gorbachev, Soviet accounts - reliability 0.5
    - JOURNALIST: News reporting - reliability 0.5
    - HISTORIAN: Academic analysis - reliability 0.6

    POST body (multipart/form-data):
    - file: ePub file
    - authorName: "Ronald Reagan" (default)
    - sourceTitle: "The Reagan Diaries" (default)
    - profileId: "historical_ronald_reagan" (default)
    - perspective: "SELF" (default) - SELF, SPOUSE, INNER_CIRCLE, ALLY, ADVERSARY, JOURNALIST, HISTORIAN
    - perspectiveSubject: "ronald_reagan" (default) - who the content is ABOUT

    OR POST body (JSON):
    {
        "epubBase64": "base64 encoded epub",
        "authorName": "Ronald Reagan",
        "sourceTitle": "The Reagan Diaries",
        "profileId": "historical_ronald_reagan",
        "perspective": "SELF",
        "perspectiveSubject": "ronald_reagan"
    }

    Returns:
    {
        "parsing": {"entries_found": 1000, "total_words": 150000, "perspective": "SELF"},
        "chunking": {"chunks_created": 2500, "overlap_enabled": true},
        "ingestion": {
            "firebase": {"success": 2500, "errors": []},
            "postgres": {"success": 2500, "errors": []},
            "neo4j": {"success": 2500, "errors": []}
        },
        "perspective": "SELF",
        "reliability_weight": 1.0
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        user, err = verify_auth(req)
        if err:
            return err

        # Import multi-database ingester
        try:
            from ingestion.multi_database_ingester import (
                IngestionConfig,
                ingest_reagan_diaries_complete
            )
        except ImportError as e:
            return https_fn.Response(
                json.dumps({"error": f"Multi-DB ingester not available: {e}"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Get credentials from environment
        neo4j_uri = os.environ.get("NEO4J_URI")
        neo4j_password = os.environ.get("NEO4J_PASSWORD")
        openai_api_key = os.environ.get("OPENAI_API_KEY")

        # Extract ePub and parameters
        content_type = req.content_type or ""
        epub_bytes = None
        author_name = "Ronald Reagan"
        source_title = "The Reagan Diaries"
        profile_id = "historical_ronald_reagan"
        # Perspective fields (Rashomon Effect prevention)
        perspective = "SELF"
        perspective_subject = "ronald_reagan"

        if "multipart" in content_type:
            files = req.files
            if "file" not in files:
                return https_fn.Response(
                    json.dumps({"error": "No file uploaded. Use 'file' field."}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )
            epub_bytes = files["file"].read()
            author_name = req.form.get("authorName", author_name)
            source_title = req.form.get("sourceTitle", source_title)
            profile_id = req.form.get("profileId", profile_id)
            perspective = req.form.get("perspective", perspective)
            perspective_subject = req.form.get("perspectiveSubject", perspective_subject)
        else:
            data = req.get_json()
            if not data or "epubBase64" not in data:
                return https_fn.Response(
                    json.dumps({"error": "Must provide 'epubBase64' field or upload file"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )
            import base64
            epub_bytes = base64.b64decode(data["epubBase64"])
            author_name = data.get("authorName", author_name)
            source_title = data.get("sourceTitle", source_title)
            profile_id = data.get("profileId", profile_id)
            perspective = data.get("perspective", perspective)
            perspective_subject = data.get("perspectiveSubject", perspective_subject)

        # Create config for multi-database ingestion with perspective
        config = IngestionConfig(
            # Firebase - uses default app credentials
            profile_id=profile_id,
            firestore_collection="profiles",
            firestore_subcollection="b2_memories",

            # PostgreSQL - optional (may not be configured)
            postgres_conn_string=os.environ.get("DATABASE_URL"),

            # Neo4j
            neo4j_uri=neo4j_uri,
            neo4j_password=neo4j_password,

            # OpenAI for embeddings
            openai_api_key=openai_api_key,

            # Processing
            batch_size=50,
            generate_embeddings=bool(openai_api_key),

            # Perspective (Rashomon Effect prevention)
            perspective=perspective,
            perspective_subject=perspective_subject,
            source_author=author_name,
            source_title=source_title
        )

        # Run complete pipeline with perspective
        results = ingest_reagan_diaries_complete(
            epub_path_or_bytes=epub_bytes,
            config=config,
            author_name=author_name,
            source_title=source_title,
            perspective=perspective,
            perspective_subject=perspective_subject
        )

        return https_fn.Response(
            json.dumps({
                "success": True,
                "message": f"Multi-DB ingestion complete: {results['chunking']['chunks_created']} chunks to 3 databases",
                **results
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return error_response(e)


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def query_diary_entries(req: https_fn.Request) -> https_fn.Response:
    """
    Query diary entries from Neo4j.

    POST body:
    {
        "queryType": "by_date_range" | "by_person" | "by_topic" | "statistics",
        "startDate": "1981-01-01",  // for by_date_range
        "endDate": "1981-12-31",    // for by_date_range
        "personName": "Nancy Reagan", // for by_person
        "topic": "cold_war",         // for by_topic
        "authorName": "Ronald Reagan" // for statistics
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        user, err = verify_auth(req)
        if err:
            return err

        # Import query helpers
        try:
            from ingestion.diary_ingester import (
                get_entries_by_date_range,
                get_entries_mentioning_person,
                get_entries_by_topic,
                get_diary_statistics
            )
            from neo4j import GraphDatabase
        except ImportError as e:
            return https_fn.Response(
                json.dumps({"error": f"Diary ingester not available: {e}"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()
        query_type = data.get("queryType", "statistics")

        # Get Neo4j driver
        neo4j_uri = os.environ.get("NEO4J_URI")
        neo4j_password = os.environ.get("NEO4J_PASSWORD")

        driver = GraphDatabase.driver(
            neo4j_uri,
            auth=(os.environ.get("NEO4J_USER", "neo4j"), neo4j_password)
        )

        result = {}

        if query_type == "by_date_range":
            if not data.get("startDate") or not data.get("endDate"):
                return https_fn.Response(
                    json.dumps({"error": "startDate and endDate required for by_date_range"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )
            result = {
                "entries": get_entries_by_date_range(
                    driver,
                    data["startDate"],
                    data["endDate"]
                )
            }

        elif query_type == "by_person":
            if not data.get("personName"):
                return https_fn.Response(
                    json.dumps({"error": "personName required for by_person"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )
            result = {
                "entries": get_entries_mentioning_person(driver, data["personName"])
            }

        elif query_type == "by_topic":
            if not data.get("topic"):
                return https_fn.Response(
                    json.dumps({"error": "topic required for by_topic"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )
            result = {
                "entries": get_entries_by_topic(driver, data["topic"])
            }

        elif query_type == "statistics":
            result = get_diary_statistics(
                driver,
                data.get("authorName", "Ronald Reagan")
            )

        else:
            return https_fn.Response(
                json.dumps({"error": f"Unknown queryType: {query_type}"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        driver.close()

        return https_fn.Response(
            json.dumps(result),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return error_response(e)


# =============================================================================
# BIOGRAPHIC EXTRACTION ENDPOINTS (Brain 1B → Brain 2 Consolidation)
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=120,
    secrets=[ANTHROPIC_API_KEY_SECRET, NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def extract_biographic_data(req: https_fn.Request) -> https_fn.Response:
    """
    Extract biographic data from conversation text using LLM.

    This is the real-time extraction endpoint for AI SoulPartner.
    Called after each meaningful exchange to capture Life Events,
    People, Emotions, Values, and Speech Nuances.

    POST body:
    {
        "userId": "firebase-uid",
        "profileId": "astroprofile-id",
        "conversationText": "USER: I arrived in Austin in 1982...\nAI: That sounds...",
        "source": "text_chat",  // or "voice_chat"
        "sessionId": "optional-session-id",
        "storeToFirestore": true,  // Whether to persist to Brain 2
        "ingestToNeo4j": false     // Whether to add to Knowledge Graph
    }

    Returns:
    {
        "success": true,
        "extraction": {
            "events": [...],
            "people": [...],
            "emotions": [...],
            "values": [...],
            "nuances": {...}
        },
        "stored": true,
        "graphIngested": false
    }
    """
    if not BIOGRAPHER_AVAILABLE:
        return https_fn.Response(
            json.dumps({
                "error": "Biographer not available",
                "details": BIOGRAPHER_ERROR
            }),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        user, err = verify_auth(req)
        if err:
            return err

        data = req.get_json()

        # Validate required fields
        if not data.get("conversationText"):
            return https_fn.Response(
                json.dumps({"error": "conversationText is required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        user_id = data.get("userId", "anonymous")
        profile_id = data.get("profileId", "default")
        conversation_text = data["conversationText"]
        source = data.get("source", "text_chat")
        session_id = data.get("sessionId", datetime.utcnow().strftime("%Y%m%d_%H%M%S"))
        store_to_firestore = data.get("storeToFirestore", True)
        ingest_to_neo4j = data.get("ingestToNeo4j", False)

        # Run the async extraction
        import asyncio

        async def run_extraction():
            extractor = BiographicExtractor()
            return await extractor.extract(conversation_text, source)

        # Run async in sync context
        extraction = asyncio.run(run_extraction())

        # Prepare response
        result = {
            "success": True,
            "extraction": {
                "events": [
                    {
                        "description": e.description,
                        "year": e.year,
                        "location": e.location,
                        "significance": e.significance
                    } for e in extraction.events
                ],
                "people": [
                    {
                        "name": p.name,
                        "relationship_type": p.relationship_type,
                        "sentiment": p.sentiment
                    } for p in extraction.people
                ],
                "emotions": [
                    {
                        "emotion": em.emotion,
                        "intensity": em.intensity,
                        "triggers": em.triggers
                    } for em in extraction.emotions
                ],
                "values": [
                    {
                        "value": v.value,
                        "strength": v.strength,
                        "evidence": v.evidence
                    } for v in extraction.values
                ],
                "nuances": {
                    "catchphrases": extraction.nuances.catchphrases if extraction.nuances else [],
                    "tone": extraction.nuances.tone if extraction.nuances else "",
                    "communication_style": extraction.nuances.communication_style if extraction.nuances else "",
                    "turn_taking_rhythm": extraction.nuances.turn_taking_rhythm if extraction.nuances else ""
                } if extraction.nuances else None,
                "raw_insights": extraction.raw_insights
            },
            "stored": False,
            "graphIngested": False
        }

        # Store to Firestore (Brain 2 - LTM Profile)
        if store_to_firestore and (extraction.events or extraction.people):
            try:
                db = firestore.client()
                doc_ref = db.collection('profiles').document(profile_id)\
                           .collection('brain2_biography').document(session_id)

                from dataclasses import asdict
                doc_ref.set({
                    'extracted_data': {
                        'events': [asdict(e) for e in extraction.events],
                        'people': [asdict(p) for p in extraction.people],
                        'emotions': [asdict(em) for em in extraction.emotions],
                        'values': [asdict(v) for v in extraction.values],
                        'nuances': asdict(extraction.nuances) if extraction.nuances else None,
                        'raw_insights': extraction.raw_insights
                    },
                    'source_session': session_id,
                    'source_type': source,
                    'timestamp': datetime.utcnow().isoformat()
                })
                result["stored"] = True

                # Also store as b1b_learned facts for immediate availability
                if extraction.events or extraction.people:
                    partner_id = "soulpartner_luna"
                    fact_ref = db.collection('profiles').document(profile_id)\
                                 .collection('b1b_learned').document(partner_id)

                    new_facts = []
                    for event in extraction.events:
                        new_facts.append({
                            "fact": event.description,
                            "learned_at": datetime.utcnow().isoformat(),
                            "source": "biographic_extraction",
                            "context_tags": [event.location, str(event.year)] if event.location or event.year else [],
                            "significance": event.significance
                        })

                    for person in extraction.people:
                        new_facts.append({
                            "fact": f"User has a {person.relationship_type} named {person.name}",
                            "learned_at": datetime.utcnow().isoformat(),
                            "source": "biographic_extraction",
                            "context_tags": [person.relationship_type],
                            "sentiment": person.sentiment
                        })

                    if new_facts:
                        # Get existing and append
                        existing_doc = fact_ref.get()
                        existing_facts = existing_doc.to_dict().get('learned_facts', []) if existing_doc.exists else []
                        fact_ref.set({
                            "learned_facts": existing_facts + new_facts,
                            "last_updated": datetime.utcnow().isoformat()
                        }, merge=True)

            except Exception as fs_error:
                result["firestoreError"] = str(fs_error)

        # Ingest to Neo4j (Knowledge Graph)
        if ingest_to_neo4j and (extraction.events or extraction.people):
            try:
                neo4j_service = get_neo4j_service()
                graph_stats = ingest_into_graph(
                    user_id, profile_id, extraction, neo4j_service.driver
                )
                neo4j_service.close()
                result["graphIngested"] = True
                result["graphStats"] = graph_stats
            except Exception as neo4j_error:
                result["neo4jError"] = str(neo4j_error)

        return https_fn.Response(
            json.dumps(result),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return error_response(e)


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=300,  # 5 minutes for batch consolidation
    secrets=[ANTHROPIC_API_KEY_SECRET, NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def consolidate_session(req: https_fn.Request) -> https_fn.Response:
    """
    Nightly Consolidation - Batch process a full session.

    Extracts biographic data from a complete conversation session,
    stores in Firestore Brain 2 (LTM), and ingests into Neo4j.

    POST body:
    {
        "userId": "firebase-uid",
        "profileId": "astroprofile-id",
        "sessionId": "conversation-session-id",
        "conversationText": "Full conversation text...",
        "source": "text_chat"
    }
    """
    if not BIOGRAPHER_AVAILABLE:
        return https_fn.Response(
            json.dumps({
                "error": "Biographer not available",
                "details": BIOGRAPHER_ERROR
            }),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        user, err = verify_auth(req)
        if err:
            return err

        data = req.get_json()

        user_id = data.get("userId")
        profile_id = data.get("profileId")
        session_id = data.get("sessionId")
        conversation_text = data.get("conversationText")
        source = data.get("source", "text_chat")

        if not all([user_id, profile_id, session_id, conversation_text]):
            return https_fn.Response(
                json.dumps({"error": "userId, profileId, sessionId, and conversationText are required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        # Get services
        db = firestore.client()
        neo4j_driver = None
        try:
            neo4j_service = get_neo4j_service()
            neo4j_driver = neo4j_service.driver
        except Exception:
            pass  # Continue without Neo4j if not configured

        # Run consolidation
        import asyncio

        async def run_consolidation():
            return await consolidate_memory(
                user_id=user_id,
                profile_id=profile_id,
                session_id=session_id,
                conversation_text=conversation_text,
                source=source,
                db=db,
                neo4j_driver=neo4j_driver
            )

        result = asyncio.run(run_consolidation())

        # Cleanup
        if neo4j_driver:
            try:
                neo4j_service.close()
            except Exception:
                pass

        return https_fn.Response(
            json.dumps(result),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return error_response(e)
