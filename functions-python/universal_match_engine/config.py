from dataclasses import dataclass
import os

@dataclass
class EngineConfig:
    pg_dsn: str = os.getenv("MATCH_PG_DSN", "postgresql://postgres:postgres@localhost:5432/astroprofile")
    pg_vector_table: str = os.getenv("MATCH_PG_VECTOR_TABLE", "compatibility_vectors")
    neo4j_uri: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    neo4j_user: str = os.getenv("NEO4J_USER", "neo4j")
    neo4j_password: str = os.getenv("NEO4J_PASSWORD", "password")
    vector_dim: int = int(os.getenv("MATCH_VECTOR_DIM", "64"))
    shortlist_k: int = int(os.getenv("MATCH_SHORTLIST_K", "300"))
    top_n: int = int(os.getenv("MATCH_TOP_N", "20"))

    # v2 mechanics weights
    w_angles: float = float(os.getenv("MATCH_W_ANGLES", "0.14"))
    w_houses: float = float(os.getenv("MATCH_W_HOUSES", "0.14"))
    w_rulership: float = float(os.getenv("MATCH_W_RULERSHIP", "0.14"))
    w_degree_theory: float = float(os.getenv("MATCH_W_DEGREE_THEORY", "0.12"))
    w_sabian: float = float(os.getenv("MATCH_W_SABIAN", "0.10"))
    w_elements_modality: float = float(os.getenv("MATCH_W_ELEMENTS_MODALITY", "0.10"))
