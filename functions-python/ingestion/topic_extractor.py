"""
Real-Time Topic Extraction for GENESIS

Extracts topics, entities, and intent from user messages in real-time.
Used to query GraphRAG for relevant context.

Features:
- Fast keyword-based extraction (no API call)
- AI-powered deep extraction (with API call)
- Constitutional theme detection
- Query intent classification
"""

import os
import re
import json
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class ExtractedQuery:
    """Extracted components from a user query"""
    topics: List[str]
    entities: List[str]
    themes: List[str]
    intent: str  # 'question', 'advice', 'comparison', 'story', 'other'
    sentiment: str  # 'curious', 'concerned', 'excited', 'neutral'
    time_reference: Optional[str]  # 'past', 'present', 'future', None
    relationship_focus: bool  # Is this about relationships?


# Topic keyword mappings for fast extraction
TOPIC_KEYWORDS = {
    'leadership': ['lead', 'leader', 'leading', 'command', 'chief', 'boss', 'president', 'governor', 'ceo'],
    'marriage': ['married', 'marriage', 'wedding', 'wife', 'husband', 'spouse', 'wed', 'union'],
    'love': ['love', 'loved', 'loving', 'romance', 'romantic', 'heart', 'passion', 'devotion'],
    'family': ['family', 'children', 'kids', 'son', 'daughter', 'mother', 'father', 'parent'],
    'career': ['career', 'job', 'work', 'professional', 'business', 'occupation'],
    'politics': ['political', 'politics', 'campaign', 'election', 'vote', 'congress', 'senate', 'government'],
    'conflict': ['war', 'battle', 'conflict', 'fight', 'struggle', 'opposition', 'enemy', 'cold war'],
    'success': ['success', 'successful', 'won', 'achieved', 'victory', 'accomplish', 'triumph'],
    'failure': ['failed', 'failure', 'lost', 'defeat', 'mistake', 'wrong'],
    'health': ['health', 'illness', 'disease', 'sick', 'hospital', 'doctor', 'alzheimer'],
    'death': ['death', 'died', 'dying', 'passed', 'funeral', 'burial', 'grief', 'loss'],
    'legacy': ['legacy', 'remembered', 'history', 'heritage', 'memory', 'lasting'],
    'communication': ['communicate', 'communication', 'speech', 'talk', 'spoke', 'said', 'words'],
    'trust': ['trust', 'trusted', 'faith', 'believe', 'reliable', 'dependable'],
    'loyalty': ['loyal', 'loyalty', 'devoted', 'faithful', 'allegiance', 'commitment'],
    'protection': ['protect', 'protection', 'shield', 'guard', 'defend', 'safe', 'safety'],
    'sacrifice': ['sacrifice', 'sacrificed', 'gave up', 'surrendered', 'cost'],
    'advice': ['advice', 'advise', 'recommend', 'suggest', 'wisdom', 'guidance'],
    'crisis': ['crisis', 'emergency', 'urgent', 'critical', 'danger', 'threat'],
    'happiness': ['happy', 'happiness', 'joy', 'joyful', 'content', 'satisfied', 'pleased']
}

# Constitutional themes from GENESIS
CONSTITUTIONAL_THEMES = {
    'devotion': ['devoted', 'devotion', 'dedicate', 'dedicated'],
    'protection': ['protect', 'protective', 'guardian', 'shield'],
    'partnership': ['partner', 'partnership', 'together', 'team', 'unite'],
    'sacrifice': ['sacrifice', 'give up', 'surrender', 'cost'],
    'legacy': ['legacy', 'heritage', 'remembered', 'lasting'],
    'power_dynamics': ['power', 'control', 'dominant', 'submissive', 'equal'],
    'emotional_support': ['support', 'encourage', 'comfort', 'help'],
    'independence': ['independent', 'separate', 'own', 'individual'],
    'interdependence': ['depend', 'need', 'mutual', 'together'],
    'communication': ['communicate', 'talk', 'express', 'share'],
    'trust': ['trust', 'faith', 'believe', 'honest'],
    'forgiveness': ['forgive', 'forgiveness', 'pardon', 'let go'],
    'growth': ['grow', 'growth', 'develop', 'evolve', 'change']
}

# Known entities in GENESIS
KNOWN_ENTITIES = [
    'Ronald Reagan', 'Nancy Reagan', 'Reagan',
    'Jimmy Carter', 'Rosalynn Carter', 'Carter',
    'Barack Obama', 'Michelle Obama', 'Obama',
    'Dolly Parton', 'Carl Dean', 'Dolly',
    'David Beckham', 'Victoria Beckham', 'Beckham', 'Posh',
    'Cristiano Ronaldo', 'Georgina Rodriguez', 'Ronaldo',
    'Margaret Thatcher', 'Thatcher',
    'Mikhail Gorbachev', 'Gorbachev',
    'Albert Einstein', 'Einstein',
    'Cleopatra',
    'White House', 'Hollywood', 'California',
    'Cold War', 'Berlin Wall', 'Soviet Union',
    'Alzheimer', "Alzheimer's"
]

# Intent patterns
INTENT_PATTERNS = {
    'question': [r'^(what|who|when|where|why|how|did|was|is|are|do|does|can|could|would|will)\b', r'\?$'],
    'advice': [r'\b(advice|help|should|recommend|suggest|what.*do|how.*handle)\b'],
    'comparison': [r'\b(compare|versus|vs|difference|similar|like|unlike|better|worse)\b'],
    'story': [r'\b(tell|story|happened|history|describe|explain)\b']
}


class TopicExtractor:
    """
    Extracts topics, entities, and intent from user queries.

    Supports:
    - Fast mode: Keyword-based extraction (no API call)
    - Deep mode: AI-powered extraction (API call)
    """

    def __init__(
        self,
        api_key: str = None,
        use_ai: bool = False,
        model: str = "gpt-4o-mini"
    ):
        """
        Initialize topic extractor.

        Args:
            api_key: OpenAI API key (or use OPENAI_API_KEY env var)
            use_ai: Use AI for deep extraction (slower but more accurate)
            model: Model to use for AI extraction
        """
        self.api_key = api_key or os.environ.get("OPENAI_API_KEY")
        self.use_ai = use_ai
        self.model = model
        self._client = None

    def _get_client(self):
        """Lazy load OpenAI client"""
        if self._client is None and self.api_key:
            try:
                from openai import OpenAI
                self._client = OpenAI(api_key=self.api_key)
            except ImportError:
                logger.warning("OpenAI package not installed")
        return self._client

    def extract(self, text: str, deep: bool = None) -> ExtractedQuery:
        """
        Extract topics, entities, and intent from text.

        Args:
            text: User message or query
            deep: Override use_ai setting for this call

        Returns:
            ExtractedQuery with extracted components
        """
        use_deep = deep if deep is not None else self.use_ai

        if use_deep and self.api_key:
            try:
                return self._extract_with_ai(text)
            except Exception as e:
                logger.warning(f"AI extraction failed: {e}, falling back to keyword extraction")

        return self._extract_keywords(text)

    def _extract_keywords(self, text: str) -> ExtractedQuery:
        """Fast keyword-based extraction"""
        text_lower = text.lower()

        # Extract topics
        topics = []
        for topic, keywords in TOPIC_KEYWORDS.items():
            if any(kw in text_lower for kw in keywords):
                topics.append(topic)

        # Extract constitutional themes
        themes = []
        for theme, keywords in CONSTITUTIONAL_THEMES.items():
            if any(kw in text_lower for kw in keywords):
                themes.append(theme)

        # Extract known entities
        entities = []
        for entity in KNOWN_ENTITIES:
            if entity.lower() in text_lower:
                entities.append(entity)

        # Also extract capitalized words as potential entities
        potential_entities = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text)
        for pe in potential_entities:
            if pe not in entities and pe not in ['I', 'The', 'A', 'An']:
                entities.append(pe)

        # Detect intent
        intent = 'other'
        for intent_type, patterns in INTENT_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, text, re.IGNORECASE):
                    intent = intent_type
                    break
            if intent != 'other':
                break

        # Detect sentiment
        sentiment = 'neutral'
        curious_words = ['curious', 'wonder', 'interested', 'fascinating']
        concerned_words = ['worried', 'concerned', 'afraid', 'nervous']
        excited_words = ['excited', 'amazing', 'love', 'great', 'wonderful']

        if any(w in text_lower for w in curious_words):
            sentiment = 'curious'
        elif any(w in text_lower for w in concerned_words):
            sentiment = 'concerned'
        elif any(w in text_lower for w in excited_words):
            sentiment = 'excited'

        # Detect time reference
        time_reference = None
        if any(w in text_lower for w in ['was', 'were', 'did', 'happened', 'history', 'past']):
            time_reference = 'past'
        elif any(w in text_lower for w in ['will', 'going to', 'future', 'next']):
            time_reference = 'future'
        elif any(w in text_lower for w in ['is', 'are', 'now', 'today', 'current']):
            time_reference = 'present'

        # Is this about relationships?
        relationship_focus = any(t in themes for t in ['devotion', 'partnership', 'trust', 'communication']) or \
                           any(t in topics for t in ['marriage', 'love', 'family'])

        return ExtractedQuery(
            topics=topics[:5],
            entities=entities[:10],
            themes=themes[:5],
            intent=intent,
            sentiment=sentiment,
            time_reference=time_reference,
            relationship_focus=relationship_focus
        )

    def _extract_with_ai(self, text: str) -> ExtractedQuery:
        """AI-powered deep extraction"""
        client = self._get_client()
        if not client:
            return self._extract_keywords(text)

        system_prompt = """You are a query analyzer for GENESIS, a constitutional AI relationship wisdom platform.

Analyze the user's message and extract:
1. "topics": List of 1-5 relevant topics from: leadership, marriage, love, family, career, politics, conflict, success, failure, health, death, legacy, communication, trust, loyalty, protection, sacrifice, advice, crisis, happiness
2. "entities": List of people, places, or events mentioned
3. "themes": Constitutional themes from: devotion, protection, partnership, sacrifice, legacy, power_dynamics, emotional_support, independence, interdependence, communication, trust, forgiveness, growth
4. "intent": One of: question, advice, comparison, story, other
5. "sentiment": One of: curious, concerned, excited, neutral
6. "time_reference": One of: past, present, future, or null
7. "relationship_focus": Boolean - is this about relationships?

Return ONLY valid JSON."""

        response = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyze: {text}"}
            ],
            response_format={"type": "json_object"},
            max_tokens=300
        )

        result = json.loads(response.choices[0].message.content)

        return ExtractedQuery(
            topics=result.get('topics', []),
            entities=result.get('entities', []),
            themes=result.get('themes', []),
            intent=result.get('intent', 'other'),
            sentiment=result.get('sentiment', 'neutral'),
            time_reference=result.get('time_reference'),
            relationship_focus=result.get('relationship_focus', False)
        )

    def extract_for_graphrag(self, text: str) -> Tuple[List[str], List[str]]:
        """
        Quick extraction for GraphRAG queries.

        Returns:
            Tuple of (topics, entities) for use with GraphRAGService
        """
        extracted = self.extract(text, deep=False)
        return extracted.topics, extracted.entities


# Convenience function
def quick_extract(text: str) -> Dict:
    """
    Quick topic extraction without initialization.

    Returns dictionary with topics, entities, themes, and intent.
    """
    extractor = TopicExtractor(use_ai=False)
    result = extractor.extract(text)
    return {
        'topics': result.topics,
        'entities': result.entities,
        'themes': result.themes,
        'intent': result.intent,
        'sentiment': result.sentiment,
        'time_reference': result.time_reference,
        'relationship_focus': result.relationship_focus
    }


# Integration with GraphRAG
def extract_and_query_graph(
    text: str,
    profile_id: str = None
) -> Dict:
    """
    Extract topics from text and query Neo4j for context.

    Combines TopicExtractor with GraphRAGService.

    Args:
        text: User query
        profile_id: Optional profile filter

    Returns:
        Dictionary with extracted info and graph context
    """
    from ..graph.graphrag_queries import GraphRAGService

    # Extract topics and entities
    extractor = TopicExtractor(use_ai=False)
    extracted = extractor.extract(text)

    # Query graph
    graph_service = GraphRAGService()
    context = graph_service.get_rag_context(
        query_topics=extracted.topics,
        query_entities=extracted.entities,
        profile_id=profile_id
    )
    formatted_context = graph_service.format_context_for_prompt(context)
    graph_service.close()

    return {
        'extracted': {
            'topics': extracted.topics,
            'entities': extracted.entities,
            'themes': extracted.themes,
            'intent': extracted.intent,
            'relationship_focus': extracted.relationship_focus
        },
        'graph_context': formatted_context
    }
