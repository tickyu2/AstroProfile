"""
============================================
Luna Brain 7A: Feedback Service (P3.2)
============================================

Backend service for collecting and processing user feedback
on personality predictions. Enables continuous learning.

Cloud Function Endpoints:
- submit_personality_feedback: Store user feedback
- get_training_queue: Retrieve high-quality feedback for training

Created: January 8, 2026
Authors: Claude Opus (Implementation), Claude Sonnet (Architecture)
"""

import json
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict

# Firebase imports (for Cloud Function deployment)
try:
    from firebase_functions import https_fn, options
    from firebase_admin import firestore
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False
    print("Firebase SDK not available - running in local mode")


# ============================================
# Data Structures
# ============================================

@dataclass
class PersonalityFeedback:
    """User feedback on personality prediction."""
    user_id: str
    constitutional_data: Dict[str, Any]
    calculated_facets: List[float]
    adjusted_facets: List[float]
    overall_rating: int  # 1-10
    comment: str
    timestamp: str
    adjustments_count: int
    quality_score: float  # Computed quality metric

    def to_dict(self) -> Dict:
        return asdict(self)


@dataclass
class FeedbackStats:
    """Statistics for feedback collection."""
    total_submissions: int
    high_quality_count: int  # rating >= 8
    average_rating: float
    average_adjustments: float
    by_enneagram_type: Dict[int, int]


# ============================================
# Quality Scoring
# ============================================

def calculate_quality_score(feedback: Dict) -> float:
    """
    Calculate quality score for training data eligibility.

    Factors:
    - Overall rating (primary)
    - Number of adjustments (more adjustments = more effort = higher quality)
    - Comment length (engagement indicator)

    Returns: 0.0 to 1.0 quality score
    """
    score = 0.0

    # Rating contribution (60% weight)
    rating = feedback.get('rating', 5)
    score += (rating / 10) * 0.6

    # Adjustment effort (25% weight)
    adjustments = feedback.get('adjustments_made', 0)
    adjustment_score = min(adjustments / 10, 1.0)  # Cap at 10 adjustments
    score += adjustment_score * 0.25

    # Comment engagement (15% weight)
    comment = feedback.get('comment', '')
    comment_score = min(len(comment) / 200, 1.0)  # Cap at 200 chars
    score += comment_score * 0.15

    return round(score, 3)


def is_training_eligible(feedback: Dict) -> bool:
    """
    Determine if feedback qualifies for training data.

    Criteria:
    - Rating >= 8 (high confidence in accuracy)
    - OR rating <= 3 with adjustments (learning from corrections)
    """
    rating = feedback.get('rating', 5)

    # High confidence accurate
    if rating >= 8:
        return True

    # Low rating with corrections (valuable negative signal)
    if rating <= 3 and feedback.get('adjustments_made', 0) >= 5:
        return True

    return False


# ============================================
# Local Storage (for development)
# ============================================

class LocalFeedbackStore:
    """Local file-based storage for development."""

    def __init__(self, filepath: str = 'feedback_store.json'):
        self.filepath = filepath
        self._load()

    def _load(self):
        try:
            with open(self.filepath, 'r') as f:
                self.data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            self.data = {
                'feedback': [],
                'training_queue': []
            }

    def _save(self):
        with open(self.filepath, 'w') as f:
            json.dump(self.data, f, indent=2)

    def add_feedback(self, feedback: Dict) -> str:
        """Add feedback and return ID."""
        feedback_id = f"fb_{len(self.data['feedback'])}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        feedback['id'] = feedback_id
        feedback['quality_score'] = calculate_quality_score(feedback)

        self.data['feedback'].append(feedback)

        # Add to training queue if eligible
        if is_training_eligible(feedback):
            self.data['training_queue'].append(feedback)

        self._save()
        return feedback_id

    def get_feedback(self, limit: int = 100) -> List[Dict]:
        return self.data['feedback'][-limit:]

    def get_training_queue(self, limit: int = 1000) -> List[Dict]:
        return self.data['training_queue'][-limit:]

    def get_stats(self) -> FeedbackStats:
        feedback = self.data['feedback']

        if not feedback:
            return FeedbackStats(0, 0, 0.0, 0.0, {})

        ratings = [f.get('rating', 5) for f in feedback]
        adjustments = [f.get('adjustments_made', 0) for f in feedback]

        # Count by Enneagram type
        by_type = {}
        for f in feedback:
            enne = f.get('input', {}).get('enneagram', {}).get('core', 0)
            by_type[enne] = by_type.get(enne, 0) + 1

        return FeedbackStats(
            total_submissions=len(feedback),
            high_quality_count=len(self.data['training_queue']),
            average_rating=sum(ratings) / len(ratings),
            average_adjustments=sum(adjustments) / len(adjustments),
            by_enneagram_type=by_type
        )


# Global local store instance
_local_store = None

def get_local_store() -> LocalFeedbackStore:
    global _local_store
    if _local_store is None:
        _local_store = LocalFeedbackStore()
    return _local_store


# ============================================
# Firebase Cloud Functions
# ============================================

if FIREBASE_AVAILABLE:

    @https_fn.on_call(
        cors=options.CorsOptions(
            cors_origins=["*"],
            cors_methods=["GET", "POST"]
        )
    )
    def submit_personality_feedback(req: https_fn.CallableRequest) -> Dict:
        """
        Cloud Function: Submit personality feedback.

        Request data:
        {
            "user_id": "user123",
            "input": { constitutional_data },
            "calculated_facets": [30 floats],
            "adjusted_facets": [30 floats],
            "rating": 8,
            "comment": "optional comment"
        }

        Response:
        {
            "success": true,
            "feedback_id": "fb_xxx",
            "quality_score": 0.85,
            "training_eligible": true
        }
        """
        try:
            data = req.data

            # Validate required fields
            if not data.get('calculated_facets') or len(data['calculated_facets']) != 30:
                return {'success': False, 'error': 'Invalid calculated_facets'}

            # Build feedback object
            feedback = {
                'user_id': data.get('user_id', 'anonymous'),
                'input': data.get('input', {}),
                'calculated_facets': data['calculated_facets'],
                'adjusted_facets': data.get('adjusted_facets', data['calculated_facets']),
                'rating': data.get('rating', 5),
                'comment': data.get('comment', ''),
                'timestamp': datetime.now().isoformat(),
                'adjustments_made': data.get('adjustments_made', 0)
            }

            # Calculate quality score
            feedback['quality_score'] = calculate_quality_score(feedback)

            # Store in Firestore
            db = firestore.client()
            doc_ref = db.collection('personality_feedback').add(feedback)
            feedback_id = doc_ref[1].id

            # Add to training queue if eligible
            training_eligible = is_training_eligible(feedback)
            if training_eligible:
                feedback['id'] = feedback_id
                db.collection('training_queue').add(feedback)

            return {
                'success': True,
                'feedback_id': feedback_id,
                'quality_score': feedback['quality_score'],
                'training_eligible': training_eligible
            }

        except Exception as e:
            return {'success': False, 'error': str(e)}


    @https_fn.on_call()
    def get_training_queue(req: https_fn.CallableRequest) -> Dict:
        """
        Cloud Function: Get training-eligible feedback.

        Request data:
        {
            "limit": 1000,
            "min_quality": 0.7
        }

        Response:
        {
            "success": true,
            "samples": [...],
            "count": 250
        }
        """
        try:
            data = req.data
            limit = data.get('limit', 1000)
            min_quality = data.get('min_quality', 0.7)

            db = firestore.client()

            # Query high-quality feedback
            query = (
                db.collection('training_queue')
                .where('quality_score', '>=', min_quality)
                .order_by('timestamp', direction=firestore.Query.DESCENDING)
                .limit(limit)
            )

            docs = query.stream()
            samples = [doc.to_dict() for doc in docs]

            return {
                'success': True,
                'samples': samples,
                'count': len(samples)
            }

        except Exception as e:
            return {'success': False, 'error': str(e)}


    @https_fn.on_call()
    def get_feedback_stats(req: https_fn.CallableRequest) -> Dict:
        """
        Cloud Function: Get feedback collection statistics.
        """
        try:
            db = firestore.client()

            # Count total feedback
            feedback_ref = db.collection('personality_feedback')
            total = len(list(feedback_ref.stream()))

            # Count training eligible
            queue_ref = db.collection('training_queue')
            eligible = len(list(queue_ref.stream()))

            # Calculate average rating (sample last 100)
            recent = list(feedback_ref.order_by('timestamp', direction=firestore.Query.DESCENDING).limit(100).stream())
            ratings = [doc.to_dict().get('rating', 5) for doc in recent]
            avg_rating = sum(ratings) / len(ratings) if ratings else 0

            return {
                'success': True,
                'total_submissions': total,
                'training_eligible': eligible,
                'average_rating': round(avg_rating, 2),
                'sample_size': len(ratings)
            }

        except Exception as e:
            return {'success': False, 'error': str(e)}


# ============================================
# Local API (for development/testing)
# ============================================

def local_submit_feedback(feedback_data: Dict) -> Dict:
    """Submit feedback to local store."""
    store = get_local_store()

    feedback = {
        'user_id': feedback_data.get('user_id', 'anonymous'),
        'input': feedback_data.get('input', {}),
        'calculated_facets': feedback_data['calculated_facets'],
        'adjusted_facets': feedback_data.get('adjusted_facets', feedback_data['calculated_facets']),
        'rating': feedback_data.get('rating', 5),
        'comment': feedback_data.get('comment', ''),
        'timestamp': datetime.now().isoformat(),
        'adjustments_made': feedback_data.get('adjustments_made', 0)
    }

    feedback_id = store.add_feedback(feedback)

    return {
        'success': True,
        'feedback_id': feedback_id,
        'quality_score': feedback.get('quality_score', 0),
        'training_eligible': is_training_eligible(feedback)
    }


def local_get_training_queue(limit: int = 1000) -> Dict:
    """Get training queue from local store."""
    store = get_local_store()
    samples = store.get_training_queue(limit)

    return {
        'success': True,
        'samples': samples,
        'count': len(samples)
    }


def local_get_stats() -> Dict:
    """Get stats from local store."""
    store = get_local_store()
    stats = store.get_stats()

    return {
        'success': True,
        **asdict(stats)
    }


# ============================================
# Main Entry Point
# ============================================

if __name__ == '__main__':
    print("=" * 60)
    print("Luna Brain 7A: Feedback Service")
    print("=" * 60)

    # Test local feedback submission
    test_feedback = {
        'user_id': 'test_user_001',
        'input': {
            'enneagram': {'core': 4, 'wing': 5},
            'mbti': 'INFJ',
            'western': {'sun': 'Gemini'}
        },
        'calculated_facets': [0.5] * 30,
        'adjusted_facets': [0.55 if i < 6 else 0.5 for i in range(30)],
        'rating': 8,
        'comment': 'Pretty accurate for Neuroticism, slight adjustment needed.',
        'adjustments_made': 6
    }

    result = local_submit_feedback(test_feedback)
    print(f"\nSubmitted feedback: {result}")

    stats = local_get_stats()
    print(f"\nFeedback stats: {stats}")

    queue = local_get_training_queue(10)
    print(f"\nTraining queue: {queue['count']} samples")

    print("\nP3.2 Feedback Service Ready!")
