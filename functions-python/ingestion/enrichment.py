"""
Topic Extraction and Enrichment for GENESIS

Uses AI to auto-tag chunks with:
- Topics (e.g., "Loyalty", "Leadership", "Marriage")
- Sentiment (positive/negative/neutral)
- Entities (people, places, events mentioned)
- Constitutional themes (for relationship insights)

Based on Gemini's Hello History enrichment, enhanced for Constitutional AI.
"""

import os
import json
import logging
from typing import Dict, List, Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class EnrichedChunk:
    """A chunk with AI-generated metadata"""
    text: str
    chunk_index: int
    topics: List[str]
    sentiment: str
    entities: List[str]
    constitutional_themes: List[str]
    relationship_dynamics: List[str]
    original_metadata: Dict


# Constitutional themes relevant to GENESIS
CONSTITUTIONAL_THEMES = [
    "loyalty",
    "devotion",
    "protection",
    "partnership",
    "sacrifice",
    "ambition",
    "conflict",
    "reconciliation",
    "grief",
    "celebration",
    "legacy",
    "power_dynamics",
    "emotional_support",
    "independence",
    "interdependence",
    "communication",
    "trust",
    "betrayal",
    "forgiveness",
    "growth"
]

# Relationship dynamics for couple profiles
RELATIONSHIP_DYNAMICS = [
    "fire_protects_earth",
    "water_tempers_fire",
    "earth_grounds_fire",
    "metal_refines_wood",
    "equal_partnership",
    "devoted_protection",
    "separate_worlds",
    "unified_front",
    "complementary_strengths",
    "opposing_forces",
    "anchor_and_sail",
    "star_and_shadow"
]


class TopicEnricher:
    """
    Enriches text chunks with AI-generated metadata.

    Uses OpenAI/Anthropic for intelligent tagging.
    Falls back to keyword-based extraction if AI unavailable.
    """

    def __init__(
        self,
        api_key: str = None,
        model: str = "gpt-4o-mini",
        use_anthropic: bool = False
    ):
        """
        Initialize enricher.

        Args:
            api_key: API key (or use OPENAI_API_KEY / ANTHROPIC_API_KEY env var)
            model: Model to use (default: gpt-4o-mini for cost efficiency)
            use_anthropic: Use Anthropic Claude instead of OpenAI
        """
        self.use_anthropic = use_anthropic

        if use_anthropic:
            self.api_key = api_key or os.environ.get("ANTHROPIC_API_KEY")
            self.model = model or "claude-3-haiku-20240307"
        else:
            self.api_key = api_key or os.environ.get("OPENAI_API_KEY")
            self.model = model

        self._client = None

    def _get_client(self):
        """Lazy load the API client"""
        if self._client is None:
            # Don't try to create client if no API key
            if not self.api_key:
                logger.info("No API key provided, will use keyword-based enrichment")
                return None

            if self.use_anthropic:
                try:
                    import anthropic
                    self._client = anthropic.Anthropic(api_key=self.api_key)
                except ImportError:
                    logger.warning("anthropic package not installed")
                    return None
            else:
                try:
                    from openai import OpenAI
                    self._client = OpenAI(api_key=self.api_key)
                except ImportError:
                    logger.warning("openai package not installed")
                    return None
        return self._client

    def enrich_chunk(
        self,
        text: str,
        existing_metadata: Dict = None,
        profile_context: str = None
    ) -> EnrichedChunk:
        """
        Enrich a single chunk with AI-generated metadata.

        Args:
            text: Chunk text to analyze
            existing_metadata: Metadata already present (speaker, dates, etc.)
            profile_context: Context about the profile (e.g., "Ronald Reagan, president")

        Returns:
            EnrichedChunk with topics, sentiment, entities, and themes
        """
        existing_metadata = existing_metadata or {}

        # Try AI enrichment first
        client = self._get_client()
        if client and self.api_key:
            try:
                return self._ai_enrich(text, existing_metadata, profile_context)
            except Exception as e:
                logger.warning(f"AI enrichment failed: {e}, falling back to keyword extraction")

        # Fallback to keyword-based extraction
        return self._keyword_enrich(text, existing_metadata)

    def _ai_enrich(
        self,
        text: str,
        existing_metadata: Dict,
        profile_context: str = None
    ) -> EnrichedChunk:
        """Use AI to enrich chunk"""
        client = self._get_client()

        system_prompt = """You are a biographical analyzer for GENESIS, an AI relationship wisdom platform.
Analyze the following text chunk and return a JSON object with these fields:

1. "topics": List of 2-4 topic keywords (e.g., ["leadership", "marriage", "Cold War"])
2. "sentiment": One of "positive", "negative", "neutral", or "mixed"
3. "entities": List of people, places, or events mentioned (e.g., ["Nancy Reagan", "White House", "assassination attempt"])
4. "constitutional_themes": List from these options that apply:
   loyalty, devotion, protection, partnership, sacrifice, ambition, conflict, reconciliation,
   grief, celebration, legacy, power_dynamics, emotional_support, independence,
   interdependence, communication, trust, betrayal, forgiveness, growth
5. "relationship_dynamics": List from these options if relevant:
   fire_protects_earth, water_tempers_fire, earth_grounds_fire, equal_partnership,
   devoted_protection, separate_worlds, unified_front, complementary_strengths,
   anchor_and_sail, star_and_shadow

Return ONLY valid JSON, no additional text."""

        user_prompt = f"""Profile Context: {profile_context or 'Historical figure biography'}

Text to analyze:
{text[:2000]}"""  # Limit to first 2000 chars for cost

        if self.use_anthropic:
            response = client.messages.create(
                model=self.model,
                max_tokens=500,
                messages=[
                    {"role": "user", "content": f"{system_prompt}\n\n{user_prompt}"}
                ]
            )
            result_text = response.content[0].text
        else:
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=500
            )
            result_text = response.choices[0].message.content

        # Parse JSON response
        try:
            result = json.loads(result_text)
        except json.JSONDecodeError:
            # Try to extract JSON from response
            import re
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
            else:
                raise ValueError(f"Could not parse AI response: {result_text}")

        return EnrichedChunk(
            text=text,
            chunk_index=existing_metadata.get('chunk_index', 0),
            topics=result.get('topics', []),
            sentiment=result.get('sentiment', 'neutral'),
            entities=result.get('entities', []),
            constitutional_themes=result.get('constitutional_themes', []),
            relationship_dynamics=result.get('relationship_dynamics', []),
            original_metadata=existing_metadata
        )

    def _keyword_enrich(
        self,
        text: str,
        existing_metadata: Dict
    ) -> EnrichedChunk:
        """Fallback keyword-based enrichment"""
        text_lower = text.lower()

        # Simple topic detection
        topics = []
        topic_keywords = {
            'leadership': ['led', 'leader', 'president', 'governor', 'chief'],
            'marriage': ['married', 'wedding', 'wife', 'husband', 'spouse'],
            'family': ['children', 'son', 'daughter', 'family', 'mother', 'father'],
            'politics': ['campaign', 'election', 'vote', 'congress', 'senate'],
            'career': ['career', 'job', 'work', 'professional', 'business'],
            'health': ['health', 'illness', 'disease', 'hospital', 'doctor'],
            'conflict': ['war', 'battle', 'conflict', 'fight', 'opposition'],
            'achievement': ['won', 'achieved', 'success', 'accomplished', 'award']
        }

        for topic, keywords in topic_keywords.items():
            if any(kw in text_lower for kw in keywords):
                topics.append(topic)

        # Simple sentiment detection
        positive_words = ['love', 'happy', 'success', 'joy', 'wonderful', 'great', 'best']
        negative_words = ['sad', 'death', 'loss', 'pain', 'difficult', 'tragic', 'worst']

        pos_count = sum(1 for w in positive_words if w in text_lower)
        neg_count = sum(1 for w in negative_words if w in text_lower)

        if pos_count > neg_count:
            sentiment = 'positive'
        elif neg_count > pos_count:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'

        # Simple entity extraction (capitalized words)
        import re
        entities = list(set(re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text)))[:10]

        # Constitutional themes
        themes = []
        theme_keywords = {
            'loyalty': ['loyal', 'loyalty', 'devoted', 'faithful'],
            'protection': ['protect', 'shield', 'guard', 'defend'],
            'partnership': ['partner', 'together', 'team', 'joint'],
            'sacrifice': ['sacrifice', 'gave up', 'surrendered'],
            'legacy': ['legacy', 'remembered', 'history', 'heritage']
        }

        for theme, keywords in theme_keywords.items():
            if any(kw in text_lower for kw in keywords):
                themes.append(theme)

        return EnrichedChunk(
            text=text,
            chunk_index=existing_metadata.get('chunk_index', 0),
            topics=topics[:4],
            sentiment=sentiment,
            entities=entities,
            constitutional_themes=themes,
            relationship_dynamics=[],
            original_metadata=existing_metadata
        )

    def enrich_batch(
        self,
        chunks: List[Dict],
        profile_context: str = None,
        progress_callback=None
    ) -> List[EnrichedChunk]:
        """
        Enrich multiple chunks.

        Args:
            chunks: List of chunk dictionaries with 'text' and 'metadata' keys
            profile_context: Context about the profile
            progress_callback: Optional callback(current, total) for progress

        Returns:
            List of EnrichedChunk objects
        """
        enriched = []
        total = len(chunks)

        for i, chunk in enumerate(chunks):
            enriched_chunk = self.enrich_chunk(
                text=chunk.get('text', ''),
                existing_metadata=chunk.get('metadata', {}),
                profile_context=profile_context
            )
            enriched.append(enriched_chunk)

            if progress_callback:
                progress_callback(i + 1, total)

        return enriched


def enrich_chunk_to_dict(enriched: EnrichedChunk) -> Dict:
    """Convert EnrichedChunk to dictionary for storage"""
    return {
        'text': enriched.text,
        'chunk_index': enriched.chunk_index,
        'topics': enriched.topics,
        'sentiment': enriched.sentiment,
        'entities': enriched.entities,
        'constitutional_themes': enriched.constitutional_themes,
        'relationship_dynamics': enriched.relationship_dynamics,
        'metadata': enriched.original_metadata
    }
