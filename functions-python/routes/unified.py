"""
Unified API endpoints (Phase 1 - Python-First Architecture).
Handles unified profile computation, compatibility, and API status.
"""

from firebase_functions import https_fn, options
import json
from routes.shared import (
    ALLOWED_ORIGINS,
    UNIFIED_API_AVAILABLE,
    UNIFIED_API_ERROR,
    BAZI_ENGINE_AVAILABLE,
    WESTERN_ENGINE_AVAILABLE,
    BAZI_SYNASTRY_AVAILABLE,
    verify_auth,
    error_response,
)

if UNIFIED_API_AVAILABLE:
    from routes.shared import (
        api_compute_profile,
        api_compute_compatibility,
        ComputeProfileRequest,
        ComputeCompatibilityRequest,
        BirthDataInput,
    )


# =============================================================================
# UNIFIED API ENDPOINTS (Phase 1 - Python-First Architecture)
# =============================================================================
# These endpoints use the canonical schema - output stored directly in Firebase,
# read directly by frontend. No transformations.

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.GB_1,
    timeout_sec=120
)
def compute_unified_profile(req: https_fn.Request) -> https_fn.Response:
    """
    Compute complete profile: BaZi + Western + Vedic + Unified vector.

    This is the main endpoint for the Python-First Architecture.
    Output is canonical schema - store directly in Firebase, read directly in frontend.

    POST body:
    {
        "birth": {
            "birthDate": "1983-07-06",
            "birthTime": "08:40",
            "latitude": 13.7563,
            "longitude": 100.5018,
            "timezone": "Asia/Bangkok",
            "gender": "female"
        },
        "profileId": "optional-profile-id",
        "computeOptions": {
            "includeBazi": true,
            "includeWestern": true,
            "includeVedic": true,
            "includeUnified": true
        }
    }

    Returns: ComputedProfileSchema (canonical output - store directly in Firebase)
    """
    if not UNIFIED_API_AVAILABLE:
        return https_fn.Response(
            json.dumps({
                "error": f"Unified API not available: {UNIFIED_API_ERROR}",
                "hint": "Check that api module is properly installed"
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
        if "birth" not in data:
            return https_fn.Response(
                json.dumps({"error": "Missing required field: birth"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        birth_data = data["birth"]
        required = ["birthDate", "birthTime", "latitude", "longitude"]
        for field in required:
            if field not in birth_data:
                return https_fn.Response(
                    json.dumps({"error": f"Missing required field in birth: {field}"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )

        # Build request object
        request = ComputeProfileRequest(
            birth=BirthDataInput(
                birthDate=birth_data["birthDate"],
                birthTime=birth_data["birthTime"],
                latitude=birth_data["latitude"],
                longitude=birth_data["longitude"],
                timezone=birth_data.get("timezone", "UTC"),
                gender=birth_data.get("gender", "male")
            ),
            profileId=data.get("profileId"),
            computeOptions=data.get("computeOptions")
        )

        # Compute profile
        result = api_compute_profile(request)

        # Return canonical output (diagnostics only when ?debug=true)
        response_data = result.model_dump()
        if req.args.get("debug") == "true":
            try:
                from astro.calculator import get_ephe_diagnostics
                response_data['_ephe_diag'] = get_ephe_diagnostics()
                import swisseph as swe
                from astro.calculator import _EPHE_DIR
                if _EPHE_DIR:
                    swe.set_ephe_path(_EPHE_DIR)
                jd = swe.julday(1911, 2, 6, 10.2667)
                asteroid_test = {}
                for name, body_id in [('chiron', 15), ('ceres', 17), ('pallas', 18), ('juno', 19), ('vesta', 20)]:
                    try:
                        res, flag = swe.calc_ut(jd, body_id, swe.FLG_SPEED)
                        asteroid_test[name] = f"OK lon={res[0]:.4f}"
                    except Exception as e:
                        asteroid_test[name] = f"ERROR: {str(e)}"
                response_data['_asteroid_test'] = asteroid_test
            except Exception as ex:
                response_data['_diag_error'] = str(ex)
        return https_fn.Response(
            json.dumps(response_data),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return error_response(e)


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.GB_1,
    timeout_sec=180
)
def compute_unified_compatibility(req: https_fn.Request) -> https_fn.Response:
    """
    Compute complete compatibility: BaZi + Western + Unified.

    This endpoint computes compatibility between two birth profiles across
    all systems (BaZi, Western, Unified vector space).

    POST body:
    {
        "profileA": {
            "birthDate": "1983-07-06",
            "birthTime": "08:40",
            "latitude": 13.7563,
            "longitude": 100.5018,
            "timezone": "Asia/Bangkok",
            "gender": "female"
        },
        "profileB": {
            "birthDate": "1960-05-25",
            "birthTime": "09:30",
            "latitude": 13.7563,
            "longitude": 100.5018,
            "timezone": "Asia/Bangkok",
            "gender": "male"
        },
        "options": {
            "weights": {
                "bazi": 0.35,
                "western": 0.25,
                "unified": 0.40
            }
        }
    }

    Returns: CompatibilityResultSchema (canonical output)
    """
    if not UNIFIED_API_AVAILABLE:
        return https_fn.Response(
            json.dumps({
                "error": f"Unified API not available: {UNIFIED_API_ERROR}",
                "hint": "Check that api module is properly installed"
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
        for profile_key in ["profileA", "profileB"]:
            if profile_key not in data:
                return https_fn.Response(
                    json.dumps({"error": f"Missing required field: {profile_key}"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )

            profile_data = data[profile_key]
            required = ["birthDate", "birthTime", "latitude", "longitude"]
            for field in required:
                if field not in profile_data:
                    return https_fn.Response(
                        json.dumps({"error": f"Missing required field in {profile_key}: {field}"}),
                        status=400,
                        headers={"Content-Type": "application/json"}
                    )

        # Build request object
        request = ComputeCompatibilityRequest(
            profileA=BirthDataInput(
                birthDate=data["profileA"]["birthDate"],
                birthTime=data["profileA"]["birthTime"],
                latitude=data["profileA"]["latitude"],
                longitude=data["profileA"]["longitude"],
                timezone=data["profileA"].get("timezone", "UTC"),
                gender=data["profileA"].get("gender", "male")
            ),
            profileB=BirthDataInput(
                birthDate=data["profileB"]["birthDate"],
                birthTime=data["profileB"]["birthTime"],
                latitude=data["profileB"]["latitude"],
                longitude=data["profileB"]["longitude"],
                timezone=data["profileB"].get("timezone", "UTC"),
                gender=data["profileB"].get("gender", "male")
            ),
            options=data.get("options")
        )

        # Compute compatibility
        result = api_compute_compatibility(request)

        # Return canonical output
        return https_fn.Response(
            json.dumps(result.model_dump()),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return error_response(e)


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["GET"]),
    memory=options.MemoryOption.MB_256,
    timeout_sec=10
)
def unified_api_status(req: https_fn.Request) -> https_fn.Response:
    """Check Unified API availability and version."""
    return https_fn.Response(
        json.dumps({
            "available": UNIFIED_API_AVAILABLE,
            "error": UNIFIED_API_ERROR if not UNIFIED_API_AVAILABLE else None,
            "version": "2.0.0",
            "architecture": "Python-First",
            "features": [
                "Canonical Schema (store directly in Firebase)",
                "BaZi Joey Yap Engine",
                "Western Swiss Ephemeris",
                "Vedic Jyotish (Sidereal)",
                "90-dim Unified Vector Space",
                "Unified Compatibility Scoring",
                "Third Chart (Relationship Being)"
            ] if UNIFIED_API_AVAILABLE else [],
            "engines": {
                "bazi": BAZI_ENGINE_AVAILABLE,
                "western": WESTERN_ENGINE_AVAILABLE,
                "synastry": BAZI_SYNASTRY_AVAILABLE
            }
        }),
        status=200,
        headers={"Content-Type": "application/json"}
    )
