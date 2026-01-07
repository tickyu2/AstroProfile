"""
GENESIS Python Cloud Functions
Wood House Architecture - Swiss Ephemeris + Neo4j Integration

Firebase Cloud Functions (2nd Gen) with Python support
"""

from firebase_functions import https_fn, options
from firebase_functions.params import SecretParam
from firebase_admin import initialize_app, firestore
import json
import os
from datetime import datetime

# Initialize Firebase Admin
initialize_app()

# Import our modules
from astro.calculator import SwissEphemerisCalculator
from graph.neo4j_service import Neo4jService
from graph.schema import initialize_schema, verify_schema

# Define secrets
NEO4J_URI_SECRET = SecretParam("NEO4J_URI")
NEO4J_PASSWORD_SECRET = SecretParam("NEO4J_PASSWORD")


def get_neo4j_service():
    """Get Neo4j service with credentials from environment/secrets"""
    return Neo4jService(
        uri=os.environ.get("NEO4J_URI"),
        user=os.environ.get("NEO4J_USER", "neo4j"),
        password=os.environ.get("NEO4J_PASSWORD")
    )


# =============================================================================
# ASTROLOGY CALCULATION ENDPOINTS
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=60
)
def calculate_natal_chart(req: https_fn.Request) -> https_fn.Response:
    """
    Calculate a complete natal chart using Swiss Ephemeris

    POST body:
    {
        "birthDate": "1990-05-15",
        "birthTime": "14:30",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "timezone": "America/New_York"
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

        # Validate required fields
        required = ["birthDate", "birthTime", "latitude", "longitude"]
        for field in required:
            if field not in data:
                return https_fn.Response(
                    json.dumps({"error": f"Missing required field: {field}"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )

        # Calculate natal chart
        calculator = SwissEphemerisCalculator()
        chart = calculator.calculate_natal_chart(
            birth_date=data["birthDate"],
            birth_time=data["birthTime"],
            latitude=data["latitude"],
            longitude=data["longitude"],
            timezone=data.get("timezone", "UTC")
        )

        return https_fn.Response(
            json.dumps(chart),
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
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_256
)
def calculate_planetary_positions(req: https_fn.Request) -> https_fn.Response:
    """
    Calculate planetary positions for a specific date/time

    POST body:
    {
        "datetime": "2024-01-15T14:30:00",
        "latitude": 40.7128,
        "longitude": -74.0060
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

        calculator = SwissEphemerisCalculator()
        positions = calculator.get_planetary_positions(
            dt=data.get("datetime", datetime.utcnow().isoformat()),
            latitude=data.get("latitude", 0),
            longitude=data.get("longitude", 0)
        )

        return https_fn.Response(
            json.dumps(positions),
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
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_256
)
def calculate_elemental_balance(req: https_fn.Request) -> https_fn.Response:
    """
    Calculate Western elemental balance (Fire, Earth, Air, Water)

    POST body:
    {
        "planets": {
            "sun": {"sign": "Taurus", "degree": 15.5},
            "moon": {"sign": "Cancer", "degree": 22.3},
            ...
        }
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

        calculator = SwissEphemerisCalculator()
        elements = calculator.calculate_elemental_balance(data.get("planets", {}))

        return https_fn.Response(
            json.dumps(elements),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


# =============================================================================
# NEO4J GRAPH ENDPOINTS
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def find_soul_family(req: https_fn.Request) -> https_fn.Response:
    """
    Find Soul Family connections using Neo4j graph queries

    POST body:
    {
        "userId": "user123",
        "elementalProfile": {
            "fire": 25,
            "earth": 30,
            "air": 20,
            "water": 25
        },
        "limit": 10
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

        neo4j_service = get_neo4j_service()
        matches = neo4j_service.find_soul_family(
            user_id=data.get("userId"),
            elemental_profile=data.get("elementalProfile", {}),
            limit=data.get("limit", 10)
        )
        neo4j_service.close()

        return https_fn.Response(
            json.dumps(matches),
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
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=60
)
def calculate_synastry(req: https_fn.Request) -> https_fn.Response:
    """
    Calculate synastry (compatibility) between two natal charts

    POST body:
    {
        "chart1": { ... natal chart data ... },
        "chart2": { ... natal chart data ... }
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

        calculator = SwissEphemerisCalculator()
        synastry = calculator.calculate_synastry(
            chart1=data.get("chart1", {}),
            chart2=data.get("chart2", {})
        )

        return https_fn.Response(
            json.dumps(synastry),
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
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_256,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def store_profile_node(req: https_fn.Request) -> https_fn.Response:
    """
    Store a user profile as a node in Neo4j graph

    POST body:
    {
        "userId": "user123",
        "profile": {
            "sunSign": "Taurus",
            "moonSign": "Cancer",
            "risingSign": "Leo",
            "elements": { "fire": 25, "earth": 30, "air": 20, "water": 25 }
        }
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

        neo4j_service = get_neo4j_service()
        result = neo4j_service.create_profile_node(
            user_id=data.get("userId"),
            profile=data.get("profile", {})
        )
        neo4j_service.close()

        return https_fn.Response(
            json.dumps(result),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


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

    return https_fn.Response(
        json.dumps({
            "status": "healthy",
            "service": "GENESIS Python Functions",
            "version": "1.0.0",
            "capabilities": [
                "Swiss Ephemeris calculations",
                "Neo4j graph queries",
                "Soul Family matching",
                "Synastry calculations"
            ],
            "neo4j_configured": neo4j_configured,
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
