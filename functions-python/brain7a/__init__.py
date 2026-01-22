"""
Luna Brain 7A: Neural Personality Fusion Module

P2 + P3 Implementation for GENESIS AI Soul Partner System.

Modules:
- neural_fusion: P2 Neural Network (PyTorch)
- training_data: P3.1 Bootstrap Dataset + P3.3 Continuous Learning
- feedback_service: P3.2 User Feedback Collection
"""

# P2: Neural Network
from .neural_fusion import (
    Brain7AEmbedding,
    MultiSourceAttention,
    Brain7AFusion,
    HybridPersonalityModel,
    train_hybrid_model,
    encode_constitutional_data,
    NEO_FACET_ORDER
)

# P3.1 + P3.3: Training Data Pipeline
from .training_data import (
    generate_training_dataset,
    save_dataset,
    load_dataset,
    merge_feedback_data,
    TrainingSample,
    ConstitutionalProfile
)

# P3.2: Feedback Service
from .feedback_service import (
    local_submit_feedback,
    local_get_training_queue,
    local_get_stats,
    calculate_quality_score,
    is_training_eligible
)

__all__ = [
    # P2 Neural Network
    'Brain7AEmbedding',
    'MultiSourceAttention',
    'Brain7AFusion',
    'HybridPersonalityModel',
    'train_hybrid_model',
    'encode_constitutional_data',
    'NEO_FACET_ORDER',
    # P3 Training Pipeline
    'generate_training_dataset',
    'save_dataset',
    'load_dataset',
    'merge_feedback_data',
    'TrainingSample',
    'ConstitutionalProfile',
    # P3 Feedback Service
    'local_submit_feedback',
    'local_get_training_queue',
    'local_get_stats',
    'calculate_quality_score',
    'is_training_eligible'
]

__version__ = '3.0.0'
