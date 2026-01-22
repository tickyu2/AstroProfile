"""
Biographic Extraction Engine - The Digital Biographer

This module transforms raw conversations into structured "Soul Data":
- Life Events (dates, locations, significance)
- People & Relationships (family, friends, mentors)
- Emotional Signatures (recurring feelings)
- Core Values (principles, beliefs)
- Speech Nuances (for future User LLM training)

Part of GENESIS 8-Brain Memory Architecture
- Brain 1B (STM) → Brain 2 (LTM) via Nightly Consolidation
- Brain 3/5 (Conversation STM) → Brain 4/6 (Vectorized LTM)
- Neo4j Knowledge Graph for Soul Connections

Created: January 2026
Architecture: Gemini + Claude Opus Collaboration
"""

import json
import os
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================
# DATA CLASSES - Structured Soul Data
# ============================================================

@dataclass
class LifeEvent:
    """A significant event in the user's life"""
    description: str
    year: Optional[int] = None
    date_text: Optional[str] = None
    location: Optional[str] = None
    significance: str = "medium"  # low, medium, high, pivotal
    emotional_context: Optional[str] = None
    source: str = "text_chat"  # text_chat, voice_chat, manual

@dataclass
class PersonRelationship:
    """A person in the user's life"""
    name: str
    relationship_type: str  # family, friend, mentor, colleague, partner
    sentiment: str = "positive"  # positive, negative, complex, neutral
    first_mentioned: Optional[str] = None
    context: Optional[str] = None

@dataclass
class EmotionalSignature:
    """A recurring emotional pattern"""
    emotion: str
    intensity: float = 0.5  # 0-1 scale
    triggers: List[str] = None
    frequency: str = "occasional"  # rare, occasional, frequent, constant

@dataclass
class CoreValue:
    """A principle or belief the user holds"""
    value: str
    strength: float = 0.7  # 0-1 scale
    evidence: Optional[str] = None

@dataclass
class SpeechNuance:
    """Speech patterns for User LLM training"""
    catchphrases: List[str]
    tone: str
    communication_style: str
    question_patterns: List[str]
    turn_taking_rhythm: str  # short_bursts, long_paragraphs, mixed

@dataclass
class BiographicExtraction:
    """Complete extraction result"""
    events: List[LifeEvent]
    people: List[PersonRelationship]
    emotions: List[EmotionalSignature]
    values: List[CoreValue]
    nuances: Optional[SpeechNuance] = None
    raw_insights: Optional[str] = None
    extraction_timestamp: str = None
    source_session_id: Optional[str] = None

# ============================================================
# EXTRACTION PROMPT - The Digital Biographer's Instructions
# ============================================================

BIOGRAPHER_SYSTEM_PROMPT = """
You are an Expert Biographer and Psychologist for the GENESIS Soul System.
Your goal is to analyze a conversation and extract structured "Life Data" to update the user's permanent soul record.

IMPORTANT CONTEXT:
- This is a conversation between a user and their AI companion (SoulPartner/Luna/Brother Sonnet)
- The user may share personal stories, memories, feelings, or life events
- Extract ONLY information the USER shares about themselves (not the AI's responses)
- Be precise with dates, names, and locations when mentioned

EXTRACT THE FOLLOWING:

1. **Life Events** (events array):
   - Concrete events with dates/years/locations when available
   - Each event needs: description, year (if mentioned), location (if mentioned), significance (low/medium/high/pivotal)
   - Example: {"description": "Moved to Austin for engineering studies", "year": 1982, "location": "Austin, Texas", "significance": "pivotal"}

2. **People & Relationships** (people array):
   - Who did they mention? Include relationship type
   - Types: family, friend, mentor, colleague, partner, historical_figure
   - Example: {"name": "Father", "relationship_type": "family", "sentiment": "positive", "context": "Mentioned with respect"}

3. **Emotional Signatures** (emotions array):
   - How did they feel during this conversation?
   - Include: emotion name, intensity (0-1), triggers (what caused it)
   - Example: {"emotion": "Nostalgia", "intensity": 0.8, "triggers": ["discussing 1982", "Reagan memories"]}

4. **Core Values** (values array):
   - What principles did they express or demonstrate?
   - Include: value name, strength (0-1), evidence (quote or paraphrase)
   - Example: {"value": "Precision", "strength": 0.9, "evidence": "Emphasized importance of exact details"}

5. **Speech Nuances** (nuances object) - FOR USER LLM TRAINING:
   - catchphrases: Array of repeated phrases (e.g., ["do you agree?", "soul connection"])
   - tone: Overall communication tone (e.g., "Contemplative and precise")
   - communication_style: How they express ideas
   - question_patterns: How they ask questions
   - turn_taking_rhythm: "short_bursts", "long_paragraphs", or "mixed"

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "events": [...],
  "people": [...],
  "emotions": [...],
  "values": [...],
  "nuances": {
    "catchphrases": [...],
    "tone": "...",
    "communication_style": "...",
    "question_patterns": [...],
    "turn_taking_rhythm": "..."
  },
  "raw_insights": "Any additional observations about the user's personality or life not captured above"
}

If nothing was shared for a category, return an empty array [].
"""

# ============================================================
# BIOGRAPHIC EXTRACTOR CLASS
# ============================================================

class BiographicExtractor:
    """
    The Digital Biographer - extracts structured soul data from conversations.

    Usage:
        extractor = BiographicExtractor()
        result = await extractor.extract(conversation_text)
        # result is a BiographicExtraction dataclass
    """

    def __init__(self, model: str = "claude-3-5-sonnet-20241022"):
        """
        Initialize the extractor.

        Args:
            model: The LLM model to use for extraction.
                   Options: claude-3-5-sonnet, gpt-4o, gemini-1.5-pro
        """
        self.model = model
        self._anthropic_client = None
        self._openai_client = None

    def _get_anthropic_client(self):
        """Lazy load Anthropic client"""
        if self._anthropic_client is None:
            try:
                from anthropic import Anthropic
                api_key = os.environ.get("ANTHROPIC_API_KEY")
                if not api_key:
                    raise ValueError("ANTHROPIC_API_KEY not configured")
                self._anthropic_client = Anthropic(api_key=api_key)
            except ImportError:
                raise ImportError("anthropic package not installed. Run: pip install anthropic")
        return self._anthropic_client

    def _get_openai_client(self):
        """Lazy load OpenAI client"""
        if self._openai_client is None:
            try:
                from openai import OpenAI
                api_key = os.environ.get("OPENAI_API_KEY")
                if not api_key:
                    raise ValueError("OPENAI_API_KEY not configured")
                self._openai_client = OpenAI(api_key=api_key)
            except ImportError:
                raise ImportError("openai package not installed. Run: pip install openai")
        return self._openai_client

    async def extract(self, conversation_text: str, source: str = "text_chat") -> BiographicExtraction:
        """
        Extract biographic data from conversation text.

        Args:
            conversation_text: The raw conversation to analyze
            source: Source type - "text_chat" or "voice_chat"

        Returns:
            BiographicExtraction dataclass with all extracted data
        """
        logger.info(f"Extracting biography from {len(conversation_text)} chars of {source}")

        try:
            # Call LLM for extraction
            if self.model.startswith("claude"):
                raw_result = await self._extract_with_claude(conversation_text)
            elif self.model.startswith("gpt"):
                raw_result = await self._extract_with_openai(conversation_text)
            else:
                # Default to Claude
                raw_result = await self._extract_with_claude(conversation_text)

            # Parse and structure the result
            extraction = self._parse_extraction(raw_result, source)

            logger.info(f"Extracted: {len(extraction.events)} events, {len(extraction.people)} people, "
                       f"{len(extraction.emotions)} emotions, {len(extraction.values)} values")

            return extraction

        except Exception as e:
            logger.error(f"Extraction failed: {e}")
            # Return empty extraction on failure
            return BiographicExtraction(
                events=[],
                people=[],
                emotions=[],
                values=[],
                extraction_timestamp=datetime.utcnow().isoformat()
            )

    async def _extract_with_claude(self, text: str) -> Dict:
        """Extract using Claude"""
        client = self._get_anthropic_client()

        response = client.messages.create(
            model=self.model,
            max_tokens=4096,
            system=BIOGRAPHER_SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": f"Analyze this conversation and extract biographic data:\n\n{text}"}
            ]
        )

        # Parse JSON from response
        content = response.content[0].text

        # Try to extract JSON from the response
        try:
            # Look for JSON block
            if "```json" in content:
                json_start = content.find("```json") + 7
                json_end = content.find("```", json_start)
                content = content[json_start:json_end].strip()
            elif "```" in content:
                json_start = content.find("```") + 3
                json_end = content.find("```", json_start)
                content = content[json_start:json_end].strip()

            return json.loads(content)
        except json.JSONDecodeError:
            logger.warning("Failed to parse JSON, attempting repair")
            # Try to find JSON object in response
            start = content.find("{")
            end = content.rfind("}") + 1
            if start != -1 and end > start:
                return json.loads(content[start:end])
            raise

    async def _extract_with_openai(self, text: str) -> Dict:
        """Extract using OpenAI GPT-4"""
        client = self._get_openai_client()

        response = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": BIOGRAPHER_SYSTEM_PROMPT},
                {"role": "user", "content": f"Analyze this conversation and extract biographic data:\n\n{text}"}
            ],
            response_format={"type": "json_object"}
        )

        return json.loads(response.choices[0].message.content)

    def _parse_extraction(self, raw: Dict, source: str) -> BiographicExtraction:
        """Parse raw LLM output into structured dataclass"""

        # Parse events
        events = []
        for e in raw.get("events", []):
            events.append(LifeEvent(
                description=e.get("description", ""),
                year=e.get("year"),
                date_text=e.get("date_text"),
                location=e.get("location"),
                significance=e.get("significance", "medium"),
                emotional_context=e.get("emotional_context"),
                source=source
            ))

        # Parse people
        people = []
        for p in raw.get("people", []):
            people.append(PersonRelationship(
                name=p.get("name", "Unknown"),
                relationship_type=p.get("relationship_type", "unknown"),
                sentiment=p.get("sentiment", "neutral"),
                first_mentioned=datetime.utcnow().isoformat(),
                context=p.get("context")
            ))

        # Parse emotions
        emotions = []
        for em in raw.get("emotions", []):
            emotions.append(EmotionalSignature(
                emotion=em.get("emotion", ""),
                intensity=em.get("intensity", 0.5),
                triggers=em.get("triggers", []),
                frequency=em.get("frequency", "occasional")
            ))

        # Parse values
        values = []
        for v in raw.get("values", []):
            values.append(CoreValue(
                value=v.get("value", ""),
                strength=v.get("strength", 0.7),
                evidence=v.get("evidence")
            ))

        # Parse nuances
        nuances = None
        if raw.get("nuances"):
            n = raw["nuances"]
            nuances = SpeechNuance(
                catchphrases=n.get("catchphrases", []),
                tone=n.get("tone", ""),
                communication_style=n.get("communication_style", ""),
                question_patterns=n.get("question_patterns", []),
                turn_taking_rhythm=n.get("turn_taking_rhythm", "mixed")
            )

        return BiographicExtraction(
            events=events,
            people=people,
            emotions=emotions,
            values=values,
            nuances=nuances,
            raw_insights=raw.get("raw_insights"),
            extraction_timestamp=datetime.utcnow().isoformat()
        )

# ============================================================
# CONSOLIDATION FUNCTIONS
# ============================================================

async def extract_biography(conversation_text: str, source: str = "text_chat") -> BiographicExtraction:
    """
    Convenience function to extract biography from conversation text.

    Args:
        conversation_text: Raw conversation to analyze
        source: "text_chat" or "voice_chat"

    Returns:
        BiographicExtraction with structured soul data
    """
    extractor = BiographicExtractor()
    return await extractor.extract(conversation_text, source)


def ingest_into_graph(user_id: str, profile_id: str, extraction: BiographicExtraction, driver) -> Dict:
    """
    Ingest extracted biography data into Neo4j knowledge graph.

    Args:
        user_id: Firebase user ID
        profile_id: AstroProfile ID (for compartmentalization)
        extraction: The BiographicExtraction to ingest
        driver: Neo4j driver instance

    Returns:
        Dict with counts of ingested nodes/relationships
    """
    stats = {"events": 0, "people": 0, "emotions": 0, "values": 0}

    with driver.session() as session:
        # Ensure user node exists
        session.run("""
            MERGE (u:Person {id: $profile_id})
            ON CREATE SET u.user_id = $user_id, u.created_at = datetime()
            ON MATCH SET u.last_updated = datetime()
        """, {"profile_id": profile_id, "user_id": user_id})

        # A. Ingest Life Events
        for event in extraction.events:
            result = session.run("""
                MATCH (u:Person {id: $profile_id})
                CREATE (e:LifeEvent {
                    description: $desc,
                    year: $year,
                    date_text: $date,
                    significance: $sig,
                    source: $source,
                    created_at: datetime()
                })
                MERGE (u)-[:EXPERIENCED]->(e)

                // Link Location if present
                WITH e
                WHERE $location IS NOT NULL
                MERGE (l:Location {name: $location})
                MERGE (e)-[:HAPPENED_AT]->(l)

                RETURN id(e) as event_id
            """, {
                "profile_id": profile_id,
                "desc": event.description,
                "year": event.year,
                "date": event.date_text,
                "sig": event.significance,
                "source": event.source,
                "location": event.location
            })
            stats["events"] += 1

        # B. Ingest People & Relationships
        for person in extraction.people:
            session.run("""
                MATCH (u:Person {id: $profile_id})
                MERGE (p:PersonInLife {name: $name})
                ON CREATE SET p.relationship_type = $rel_type, p.first_mentioned = datetime()
                MERGE (u)-[r:KNOWS]->(p)
                ON CREATE SET r.relationship_type = $rel_type, r.sentiment = $sentiment
                ON MATCH SET r.last_mentioned = datetime()
            """, {
                "profile_id": profile_id,
                "name": person.name,
                "rel_type": person.relationship_type,
                "sentiment": person.sentiment
            })
            stats["people"] += 1

        # C. Ingest Emotional Signatures
        for emotion in extraction.emotions:
            session.run("""
                MATCH (u:Person {id: $profile_id})
                MERGE (em:Emotion {name: $emotion})
                MERGE (u)-[r:FELT]->(em)
                ON CREATE SET r.intensity = $intensity, r.first_felt = datetime()
                ON MATCH SET r.intensity = (r.intensity + $intensity) / 2,
                             r.times_felt = COALESCE(r.times_felt, 1) + 1
            """, {
                "profile_id": profile_id,
                "emotion": emotion.emotion,
                "intensity": emotion.intensity
            })
            stats["emotions"] += 1

        # D. Ingest Core Values
        for value in extraction.values:
            session.run("""
                MATCH (u:Person {id: $profile_id})
                MERGE (v:Value {name: $value})
                MERGE (u)-[r:HOLDS_VALUE]->(v)
                ON CREATE SET r.strength = $strength, r.first_expressed = datetime()
                ON MATCH SET r.strength = GREATEST(r.strength, $strength),
                             r.times_expressed = COALESCE(r.times_expressed, 1) + 1
            """, {
                "profile_id": profile_id,
                "value": value.value,
                "strength": value.strength
            })
            stats["values"] += 1

    logger.info(f"Neo4j ingestion complete: {stats}")
    return stats


async def consolidate_memory(
    user_id: str,
    profile_id: str,
    session_id: str,
    conversation_text: str,
    source: str = "text_chat",
    db=None,
    neo4j_driver=None
) -> Dict:
    """
    Main consolidation function - orchestrates the full pipeline.

    This function:
    1. Extracts biographic data using LLM
    2. Stores in Firestore (Brain 2 - LTM Profile)
    3. Ingests into Neo4j (Knowledge Graph)

    Args:
        user_id: Firebase Auth UID
        profile_id: AstroProfile ID
        session_id: Conversation session ID
        conversation_text: Raw conversation to consolidate
        source: "text_chat" or "voice_chat"
        db: Firestore client (optional, will initialize if None)
        neo4j_driver: Neo4j driver (optional)

    Returns:
        Dict with consolidation results
    """
    logger.info(f"=== Consolidating Session {session_id} for Profile {profile_id} ===")

    # 1. EXTRACT BIOGRAPHIC DATA
    extraction = await extract_biography(conversation_text, source)

    if not any([extraction.events, extraction.people, extraction.emotions, extraction.values]):
        logger.info("No biographic data extracted, skipping consolidation")
        return {
            "success": True,
            "extracted": False,
            "reason": "no_biographic_content"
        }

    # 2. STORE IN FIRESTORE (Brain 2 - The Readable Profile)
    if db is not None:
        try:
            doc_ref = db.collection('profiles').document(profile_id)\
                       .collection('brain2_biography').document(session_id)

            doc_ref.set({
                'extracted_data': {
                    'events': [asdict(e) for e in extraction.events],
                    'people': [asdict(p) for p in extraction.people],
                    'emotions': [asdict(em) for em in extraction.emotions],
                    'values': [asdict(v) for v in extraction.values],
                    'nuances': asdict(extraction.nuances) if extraction.nuances else None,
                    'raw_insights': extraction.raw_insights
                },
                'source_session': session_id,
                'source_type': source,
                'timestamp': datetime.utcnow().isoformat()
            })
            logger.info(f"Stored extraction in Firestore: profiles/{profile_id}/brain2_biography/{session_id}")
        except Exception as e:
            logger.error(f"Firestore storage failed: {e}")

    # 3. STORE IN NEO4J (The Knowledge Graph)
    graph_stats = None
    if neo4j_driver is not None:
        try:
            graph_stats = ingest_into_graph(user_id, profile_id, extraction, neo4j_driver)
        except Exception as e:
            logger.error(f"Neo4j ingestion failed: {e}")

    logger.info("=== Consolidation Complete ===")

    return {
        "success": True,
        "extracted": True,
        "profile_id": profile_id,
        "session_id": session_id,
        "source": source,
        "counts": {
            "events": len(extraction.events),
            "people": len(extraction.people),
            "emotions": len(extraction.emotions),
            "values": len(extraction.values)
        },
        "graph_stats": graph_stats,
        "timestamp": extraction.extraction_timestamp
    }


# ============================================================
# REAL-TIME EXTRACTION (For AI SoulPartner)
# ============================================================

async def extract_and_store_realtime(
    user_id: str,
    profile_id: str,
    user_message: str,
    ai_response: str,
    db=None
) -> Dict:
    """
    Real-time extraction for AI SoulPartner chats.

    This is a lighter-weight extraction that runs after each message
    to capture important facts immediately (not waiting for nightly consolidation).

    Args:
        user_id: Firebase Auth UID
        profile_id: AstroProfile ID
        user_message: The user's message
        ai_response: The AI's response (for context)
        db: Firestore client

    Returns:
        Dict with extraction results
    """
    # Only extract from user messages (not AI responses)
    conversation = f"USER: {user_message}"

    # Quick extraction with focused prompt
    extractor = BiographicExtractor()
    extraction = await extractor.extract(conversation, "text_chat")

    # If we found something significant, store it immediately in b1b_learned
    if extraction.events or extraction.people:
        if db is not None:
            # Store in the same path as guestChat uses
            # This ensures facts are available to ALL partners
            partner_id = "soulpartner_luna"  # Or derive from context

            doc_ref = db.collection('profiles').document(profile_id)\
                       .collection('b1b_learned').document(partner_id)

            # Convert to the fact format used by guestChat
            new_facts = []
            for event in extraction.events:
                new_facts.append({
                    "fact": event.description,
                    "learned_at": datetime.utcnow().isoformat(),
                    "source": "realtime_extraction",
                    "context_tags": [event.location, str(event.year)] if event.location or event.year else [],
                    "significance": event.significance
                })

            for person in extraction.people:
                new_facts.append({
                    "fact": f"User has a {person.relationship_type} named {person.name}",
                    "learned_at": datetime.utcnow().isoformat(),
                    "source": "realtime_extraction",
                    "context_tags": [person.relationship_type],
                    "sentiment": person.sentiment
                })

            if new_facts:
                # Append to existing facts
                from google.cloud.firestore import ArrayUnion
                doc_ref.set({
                    "learned_facts": ArrayUnion(new_facts),
                    "last_updated": datetime.utcnow().isoformat()
                }, merge=True)

                logger.info(f"Real-time extraction: stored {len(new_facts)} facts for profile {profile_id}")

    return {
        "extracted": bool(extraction.events or extraction.people),
        "events_count": len(extraction.events),
        "people_count": len(extraction.people)
    }
