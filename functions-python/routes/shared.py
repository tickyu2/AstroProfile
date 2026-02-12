"""
Shared configuration for all route modules.
Secrets, helpers, and engine availability flags.
"""

import os
import json
from firebase_functions import https_fn
from firebase_functions.params import SecretParam
from firebase_admin import auth as firebase_auth
from graph.neo4j_service import Neo4jService
from graph.graphrag_queries import GraphRAGService

# =============================================================================
# SECRETS
# =============================================================================

NEO4J_URI_SECRET = SecretParam("NEO4J_URI")
NEO4J_PASSWORD_SECRET = SecretParam("NEO4J_PASSWORD")
OPENAI_API_KEY_SECRET = SecretParam("OPENAI_API_KEY")
ANTHROPIC_API_KEY_SECRET = SecretParam("ANTHROPIC_API_KEY")
ADMIN_KEY_SECRET = SecretParam("ADMIN_KEY")

# =============================================================================
# CORS ALLOWED ORIGINS
# =============================================================================
# Add custom domains here (e.g. "https://yourdomain.com")

ALLOWED_ORIGINS = [
    "https://astroprofile-391e6.web.app",
    "https://astroprofile-391e6.firebaseapp.com",
    "http://localhost:5173",
    "http://localhost:5174",
]

# =============================================================================
# FIREBASE AUTH VERIFICATION
# =============================================================================

def verify_auth(req):
    """Verify Firebase ID token from Authorization: Bearer <token> header.

    Returns (decoded_token, None) on success.
    Returns (None, https_fn.Response) on failure — caller should return the Response.

    Usage in endpoints:
        user, err = verify_auth(req)
        if err:
            return err
    """
    auth_header = req.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None, https_fn.Response(
            json.dumps({"error": "Authentication required"}),
            status=401,
            headers={"Content-Type": "application/json"}
        )

    token = auth_header.split("Bearer ", 1)[1]
    try:
        decoded = firebase_auth.verify_id_token(token)
        return decoded, None
    except firebase_auth.ExpiredIdTokenError:
        return None, https_fn.Response(
            json.dumps({"error": "Token expired"}),
            status=401,
            headers={"Content-Type": "application/json"}
        )
    except firebase_auth.RevokedIdTokenError:
        return None, https_fn.Response(
            json.dumps({"error": "Token revoked"}),
            status=401,
            headers={"Content-Type": "application/json"}
        )
    except Exception:
        return None, https_fn.Response(
            json.dumps({"error": "Invalid token"}),
            status=401,
            headers={"Content-Type": "application/json"}
        )


# =============================================================================
# HELPERS
# =============================================================================

def get_neo4j_service():
    """Get Neo4j service with credentials from environment/secrets"""
    return Neo4jService(
        uri=os.environ.get("NEO4J_URI"),
        user=os.environ.get("NEO4J_USER", "neo4j"),
        password=os.environ.get("NEO4J_PASSWORD")
    )


def get_graphrag_service():
    """Get GraphRAG service with credentials from environment"""
    return GraphRAGService(
        uri=os.environ.get("NEO4J_URI"),
        user=os.environ.get("NEO4J_USER", "neo4j"),
        password=os.environ.get("NEO4J_PASSWORD")
    )


# =============================================================================
# ENGINE AVAILABILITY FLAGS
# =============================================================================

# BaZi Joey Yap Engine
try:
    from bazi_engine import (
        analyze_bazi,
        four_pillars_from_datetime,
        derive_ten_gods,
        detect_symbolic_stars,
        element_distribution,
        day_master_strength,
        dayun_for_birth,
        has_sxtwl,
        ELEMENT_MAP
    )
    BAZI_ENGINE_AVAILABLE = True
    BAZI_ENGINE_ERROR = None
except ImportError as e:
    BAZI_ENGINE_AVAILABLE = False
    BAZI_ENGINE_ERROR = str(e)

# BaZi Synastry Module
try:
    from luna_fusion.synastry.bazi_synastry import (
        compute_bazi_compatibility,
        synastry_matrix,
        synastry_insights,
        calculate_relationship_axes,
        explain_synastry_cell,
        is_liu_he, is_san_he, is_chong, is_hai, is_xing
    )
    BAZI_SYNASTRY_AVAILABLE = True
    BAZI_SYNASTRY_ERROR = None
except ImportError as e:
    BAZI_SYNASTRY_AVAILABLE = False
    BAZI_SYNASTRY_ERROR = str(e)

# Biographic Extraction Engine
try:
    from consolidation import (
        extract_biography,
        consolidate_memory,
        ingest_into_graph,
        BiographicExtractor
    )
    BIOGRAPHER_AVAILABLE = True
    BIOGRAPHER_ERROR = None
except ImportError as e:
    BIOGRAPHER_AVAILABLE = False
    BIOGRAPHER_ERROR = str(e)

# Western Cusp Engine
try:
    from western_engine import (
        analyze_western,
        build_western_expression_vector,
        calculate_porphyry_houses,
        calculate_aspects,
        detect_aspect_patterns,
        detect_chart_shape,
        calculate_planetary_psychology,
        WesternExpressionVector,
        WesternChart,
        SynastryResult,
        WesternCompatibilityScore
    )
    from western_engine.synastry import (
        calculate_synastry as calculate_western_synastry,
        western_compatibility_detailed
    )
    from western_engine.explainability import (
        explain_western_chart,
        explain_synastry as explain_western_synastry,
        explain_compatibility
    )
    WESTERN_ENGINE_AVAILABLE = True
    WESTERN_ENGINE_ERROR = None
except ImportError as e:
    WESTERN_ENGINE_AVAILABLE = False
    WESTERN_ENGINE_ERROR = str(e)

# Luna Fusion Engine
try:
    from luna_fusion.core.fusion_engine import (
        fuse_to_30_facets, get_luna_personality,
        adapt_luna_to_user, generate_complete_profile
    )
    from luna_fusion.sources.aspects import (
        calculate_natal_aspects as _calculate_natal_aspects,
        aspects_to_30_facets,
        detect_aspect_patterns as _detect_aspect_patterns
    )
    from luna_fusion.transits.transits_engine import (
        calculate_transit_aspects, transits_to_30_facets,
        get_active_transits, get_transit_forecast
    )
    from luna_fusion.synastry.synastry_engine import (
        compute_synastry_fusion, generate_insights, get_behavioral_adjustments
    )
    from luna_fusion.synastry.composite_engine import (
        calculate_composite_chart, composite_to_30_facets, get_composite_interpretation
    )
    from luna_fusion.archetypes.archetype_engine import (
        vector_to_archetypes, get_dominant_archetypes, get_archetype_profile
    )
    from luna_fusion.archetypes.narrative_templates import (
        generate_full_narrative, get_archetype_question_prompts
    )
    from luna_fusion.progressions.progressions_engine import (
        calculate_progressions, progressions_to_30_facets, get_progression_interpretation
    )
    from luna_fusion.core.constants import LUNA_PRESETS, ACCURACY_TIERS
    LUNA_FUSION_AVAILABLE = True
    LUNA_FUSION_ERROR = None
except ImportError as e:
    LUNA_FUSION_AVAILABLE = False
    LUNA_FUSION_ERROR = str(e)

# Unified API Module
try:
    from api import (
        compute_profile as api_compute_profile,
        compute_compatibility as api_compute_compatibility,
        ComputeProfileRequest,
        ComputeCompatibilityRequest,
        BirthDataInput,
    )
    UNIFIED_API_AVAILABLE = True
    UNIFIED_API_ERROR = None
except ImportError as e:
    UNIFIED_API_AVAILABLE = False
    UNIFIED_API_ERROR = str(e)


# =============================================================================
# ERROR RESPONSE HELPER
# =============================================================================

import logging
logger = logging.getLogger(__name__)

def error_response(e, context=""):
    """Return a safe 500 response — logs the full error server-side,
    returns a generic message to the client to avoid leaking internals."""
    logger.exception("Internal error%s: %s", f" in {context}" if context else "", e)
    return https_fn.Response(
        json.dumps({"error": "Internal server error"}),
        status=500,
        headers={"Content-Type": "application/json"}
    )


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def _numpy_to_list(obj):
    """Convert numpy arrays to lists for JSON serialization"""
    import numpy as np
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: _numpy_to_list(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_numpy_to_list(item) for item in obj]
    return obj
