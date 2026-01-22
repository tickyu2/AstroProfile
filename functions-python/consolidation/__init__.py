# Biographic Extraction & Nightly Consolidation Module
# Part of GENESIS 8-Brain Memory Architecture

from .biographer import (
    consolidate_memory,
    extract_biography,
    ingest_into_graph,
    BiographicExtractor
)

__all__ = [
    'consolidate_memory',
    'extract_biography',
    'ingest_into_graph',
    'BiographicExtractor'
]
