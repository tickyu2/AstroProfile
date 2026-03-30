"""
GENESIS Python Cloud Functions
Wood House Architecture - Swiss Ephemeris + Neo4j Integration

Firebase Cloud Functions (2nd Gen) with Python support.

This file is the entry point — Firebase discovers all decorated functions
as module-level attributes. The actual endpoint logic lives in routes/*.py.
"""

from firebase_admin import initialize_app

# Initialize Firebase Admin (must happen before route imports)
initialize_app()

# =============================================================================
# ASTROLOGY CALCULATION ENDPOINTS (5)
# =============================================================================
from routes.astro import (
    calculate_natal_chart,
    calculate_vedic_chart,
    calculate_planetary_positions,
    seasonal_ingresses,
    calculate_elemental_balance,
)

# =============================================================================
# BAZI JOEY YAP ENGINE ENDPOINTS (4)
# =============================================================================
from routes.bazi import (
    bazi_joey_yap,
    bazi_four_pillars,
    bazi_dayun,
    bazi_compatibility,
)

# =============================================================================
# NEO4J GRAPH + GRAPHRAG ENDPOINTS (11)
# =============================================================================
from routes.graph import (
    find_soul_family,
    calculate_synastry,
    store_profile_node,
    graphrag_context,
    graphrag_topic_context,
    graphrag_entity_connections,
    graphrag_sentiment_patterns,
    graphrag_shared_themes,
    graphrag_timeline,
    seed_reagan_universe,
    query_person_relationships,
)

# =============================================================================
# LUNA FUSION ENDPOINTS (10)
# =============================================================================
from routes.luna import (
    luna_fusion,
    luna_complete_profile,
    luna_natal_aspects,
    luna_transits,
    luna_synastry_fusion,
    luna_composite_chart,
    luna_composite_transits,
    luna_archetypes,
    luna_progressions,
    luna_personality,
)

# =============================================================================
# BIOGRAPHY / DIARY / EXTRACTION ENDPOINTS (7+1 disabled)
# =============================================================================
from routes.biography import (
    ingest_biography,
    ingest_sample_reagan,
    ingest_diary_epub,
    ingest_diary_complete,
    query_diary_entries,
    extract_biographic_data,
    consolidate_session,
)

# =============================================================================
# WESTERN CUSP ENGINE ENDPOINTS (3)
# =============================================================================
from routes.western import (
    calculate_western_expression_vector,
    calculate_western_compatibility,
    western_engine_status,
)

# =============================================================================
# UNIFIED API ENDPOINTS (3)
# =============================================================================
from routes.unified import (
    compute_unified_profile,
    compute_unified_compatibility,
    unified_api_status,
)

# =============================================================================
# BIRTH TIME TUNING LAB ENDPOINT (1)
# =============================================================================
from routes.tuning_lab import (
    birth_time_tuning_lab,
)

# =============================================================================
# BATCH CHART POSITIONS (Playback Animation)
# =============================================================================
from routes.batch_positions import (
    batch_chart_positions,
)

# =============================================================================
# ADMIN / HEALTH ENDPOINTS (3)
# =============================================================================
from routes.admin import (
    python_health,
    init_neo4j_schema,
    neo4j_status,
)


# Universal Compatibility Engine endpoints
from routes.matchmaking import (
    compatibility_engine_status,
    compatibility_upsert_profile,
    compatibility_match_user,
)


# Match opt-in endpoints
from routes.match_optin import (
    match_opt_in,
    match_opt_out,
    match_run_now,
)


# Compatibility pair explain endpoint
from routes.compat_explain import (
    compatibility_explain_pair,
)


# Zone debug endpoint
from routes.compat_zone_debug import (
    compatibility_zone_debug_pair,
)

