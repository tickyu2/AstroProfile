"""
Admin and health check endpoints.
Handles health checks, Neo4j schema initialization, and Neo4j status.
"""

from firebase_functions import https_fn, options
import json
import os
from datetime import datetime
from graph.schema import initialize_schema, verify_schema
from routes.shared import (
    NEO4J_URI_SECRET,
    NEO4J_PASSWORD_SECRET,
    BAZI_ENGINE_AVAILABLE,
    BAZI_ENGINE_ERROR,
    BAZI_SYNASTRY_AVAILABLE,
    BAZI_SYNASTRY_ERROR,
    LUNA_FUSION_AVAILABLE,
    LUNA_FUSION_ERROR,
    BIOGRAPHER_AVAILABLE,
    BIOGRAPHER_ERROR,
)

# Import has_sxtwl from shared (which gets it from bazi_engine)
# Only available when bazi_engine is importable
try:
    from routes.shared import has_sxtwl
except ImportError:
    has_sxtwl = None


# =============================================================================
# HEALTH CHECK
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET"]),
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def python_health(req: https_fn.Request) -> https_fn.Response:
    """Health check endpoint for Python functions"""
    neo4j_configured = bool(os.environ.get("NEO4J_URI") and os.environ.get("NEO4J_PASSWORD"))

    # Check BaZi engine status
    bazi_status = {
        "available": BAZI_ENGINE_AVAILABLE,
        "sxtwl_available": has_sxtwl() if BAZI_ENGINE_AVAILABLE else False,
        "error": BAZI_ENGINE_ERROR if not BAZI_ENGINE_AVAILABLE else None
    }

    # Check BaZi Synastry status
    bazi_synastry_status = {
        "available": BAZI_SYNASTRY_AVAILABLE,
        "error": BAZI_SYNASTRY_ERROR if not BAZI_SYNASTRY_AVAILABLE else None
    }

    # Check Luna Fusion status
    luna_status = {
        "available": LUNA_FUSION_AVAILABLE,
        "error": LUNA_FUSION_ERROR if not LUNA_FUSION_AVAILABLE else None
    }

    # Check Biographer status
    biographer_status = {
        "available": BIOGRAPHER_AVAILABLE,
        "error": BIOGRAPHER_ERROR if not BIOGRAPHER_AVAILABLE else None
    }

    capabilities = [
        "Swiss Ephemeris calculations",
        "Neo4j graph queries",
        "Soul Family matching",
        "Synastry calculations"
    ]

    if BAZI_ENGINE_AVAILABLE:
        capabilities.extend([
            "BaZi Joey Yap analysis",
            "Four Pillars calculation",
            "Ten Gods derivation",
            "DaYun Luck Pillars",
            "Symbolic Stars detection"
        ])

    if BAZI_SYNASTRY_AVAILABLE:
        capabilities.extend([
            "BaZi Compatibility Analysis (P6)",
            "Six Harmonies (六合) Detection",
            "Three Harmonies (三合) Detection",
            "Six Clashes (沖) Detection",
            "Relationship Axes Scoring"
        ])

    if LUNA_FUSION_AVAILABLE:
        capabilities.extend([
            "Luna 30-Facet Fusion",
            "Natal Aspects (P4)",
            "Transits (P5)",
            "Synastry Fusion (P6)",
            "Archetypes (P7)",
            "Progressions (P8)"
        ])

    if BIOGRAPHER_AVAILABLE:
        capabilities.extend([
            "Biographic Extraction (Brain 1B → 2)",
            "Life Event Detection",
            "Relationship Mapping",
            "Emotional Signature Analysis",
            "Core Value Detection",
            "Speech Nuance Capture"
        ])

    return https_fn.Response(
        json.dumps({
            "status": "healthy",
            "service": "GENESIS Python Functions",
            "version": "1.3.0",
            "capabilities": capabilities,
            "neo4j_configured": neo4j_configured,
            "bazi_engine": bazi_status,
            "bazi_synastry": bazi_synastry_status,
            "luna_fusion": luna_status,
            "biographer": biographer_status,
            "timestamp": datetime.utcnow().isoformat()
        }),
        status=200,
        headers={"Content-Type": "application/json"}
    )


# =============================================================================
# ADMIN ENDPOINTS
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"]),
    memory=options.MemoryOption.MB_256,
    timeout_sec=120,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def init_neo4j_schema(req: https_fn.Request) -> https_fn.Response:
    """
    Initialize Neo4j schema with constraints, indexes, and base data.
    Run once after setting up Neo4j AuraDB.

    POST body:
    {
        "adminKey": "your-admin-key"  // Simple protection for admin endpoints
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        # Simple admin key check (set via environment variable)
        admin_key = os.environ.get("ADMIN_KEY", "genesis-admin-2024")
        if data.get("adminKey") != admin_key:
            return https_fn.Response(
                json.dumps({"error": "Unauthorized"}),
                status=401,
                headers={"Content-Type": "application/json"}
            )

        # Get Neo4j credentials
        uri = os.environ.get("NEO4J_URI")
        user = os.environ.get("NEO4J_USER", "neo4j")
        password = os.environ.get("NEO4J_PASSWORD")

        if not uri or not password:
            return https_fn.Response(
                json.dumps({"error": "Neo4j credentials not configured"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Initialize schema
        results = initialize_schema(uri, user, password)

        # Verify schema
        verification = verify_schema(uri, user, password)

        return https_fn.Response(
            json.dumps({
                "success": True,
                "initialization": results,
                "verification": verification
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET"]),
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def neo4j_status(req: https_fn.Request) -> https_fn.Response:
    """Check Neo4j connection status and schema"""
    try:
        uri = os.environ.get("NEO4J_URI")
        user = os.environ.get("NEO4J_USER", "neo4j")
        password = os.environ.get("NEO4J_PASSWORD")

        if not uri or not password:
            return https_fn.Response(
                json.dumps({
                    "configured": False,
                    "message": "Neo4j credentials not set"
                }),
                status=200,
                headers={"Content-Type": "application/json"}
            )

        verification = verify_schema(uri, user, password)

        return https_fn.Response(
            json.dumps({
                "configured": True,
                "connected": verification.get("success", False),
                "schema": verification
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({
                "configured": True,
                "connected": False,
                "error": str(e)
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )
