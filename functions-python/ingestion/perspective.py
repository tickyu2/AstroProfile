"""
Perspective Labels for GENESIS - Rashomon Effect Prevention

Prevents the AI from speaking someone else's memories as its own.
When ingesting content from multiple sources about the same person,
each chunk is labeled with its PERSPECTIVE to maintain voice integrity.

Example Problem (Don Regan Problem):
- Don Regan's memoir says "Reagan seemed confused..."
- Without perspective labels, Reagan AI might say "I was confused..."
- WITH perspective labels, Reagan AI says "Don Regan later wrote that he thought I was confused..."

Labels:
- SELF: Subject's own words (highest authority)
- SPOUSE: Intimate partner's view (use for context, not voice)
- INNER_CIRCLE: Close staff/family (reference only, never adopt)
- ALLY: Friendly external (quote, don't embody)
- ADVERSARY: Opposing viewpoint (use for balance)
- JOURNALIST: Contemporary reporting (background)
- HISTORIAN: Academic analysis (background)
"""

from enum import Enum
from typing import Dict, Optional, List
from dataclasses import dataclass


class Perspective(str, Enum):
    """
    Perspective labels for source attribution.

    Each label indicates WHO is speaking about the subject,
    which determines HOW the AI should use the information.
    """
    SELF = "SELF"                 # Subject's own words (diaries, autobiographies)
    SPOUSE = "SPOUSE"             # Intimate partner's perspective
    INNER_CIRCLE = "INNER_CIRCLE" # Close staff, family, advisors
    ALLY = "ALLY"                 # Friendly external parties
    ADVERSARY = "ADVERSARY"       # Opposing viewpoints
    JOURNALIST = "JOURNALIST"     # Contemporary news reporting
    HISTORIAN = "HISTORIAN"       # Academic/biographical analysis


@dataclass
class PerspectiveMetadata:
    """
    Complete perspective metadata for a chunk.

    Attributes:
        perspective: The perspective label (SELF, SPOUSE, etc.)
        perspective_subject: Who the content is ABOUT (e.g., "ronald_reagan")
        source_author: Who WROTE the content (e.g., "Donald Regan")
        source_title: Title of the source (e.g., "For the Record")
        reliability_weight: How much to trust this source (0.0-1.0)
        prompt_injection: Text to inject into AI prompt for this perspective
    """
    perspective: Perspective
    perspective_subject: str          # Who this is about
    source_author: str                # Who wrote it
    source_title: str                 # Book/document title
    reliability_weight: float = 1.0   # Trust weight (SELF=1.0, others lower)
    prompt_injection: Optional[str] = None  # AI guidance for this perspective


# Default reliability weights by perspective
PERSPECTIVE_WEIGHTS = {
    Perspective.SELF: 1.0,         # Subject's own words - highest authority
    Perspective.SPOUSE: 0.9,       # Intimate but external
    Perspective.INNER_CIRCLE: 0.7, # Close but still external
    Perspective.ALLY: 0.6,         # Friendly but biased
    Perspective.ADVERSARY: 0.5,    # Opposing view - useful for balance
    Perspective.JOURNALIST: 0.5,   # Contemporary but surface level
    Perspective.HISTORIAN: 0.6,    # Analytical but distant
}


# Prompt injections for each perspective (guides AI behavior)
PERSPECTIVE_PROMPTS = {
    Perspective.SELF: """
This content is from YOUR OWN diary/autobiography. You may speak about it naturally
as your own memory and experience: "I remember...", "That day I felt...", "I wrote..."
""".strip(),

    Perspective.SPOUSE: """
This content is from your spouse's perspective (Nancy Reagan's memoirs).
You may reference it as: "Nancy later recalled...", "According to Nancy..."
Do NOT adopt her observations as your own thoughts - she observed you from outside.
Use this for emotional context but maintain your own voice.
""".strip(),

    Perspective.INNER_CIRCLE: """
IMPORTANT: This content is from a staff member or advisor's perspective.
You must NEVER adopt their observations as your own experience.
Reference as: "Don Regan later wrote that he thought...", "According to my staff..."
Their perception of your state of mind is THEIR perception, not your actual experience.
""".strip(),

    Perspective.ALLY: """
This content is from an external ally's perspective (e.g., Margaret Thatcher).
Reference as: "Margaret once told me...", "Thatcher later wrote..."
Do NOT speak their words as your own experience.
""".strip(),

    Perspective.ADVERSARY: """
This content represents an opposing viewpoint (e.g., Soviet perspective).
Use for context and balance: "Gorbachev saw it differently...", "From the Soviet view..."
NEVER adopt adversarial framing as your own beliefs.
""".strip(),

    Perspective.JOURNALIST: """
This content is from contemporary news reporting.
Use as background context only, not as personal memory.
Reference as: "The press reported that...", "At the time, journalists wrote..."
""".strip(),

    Perspective.HISTORIAN: """
This content is from historical/academic analysis.
Use for factual context but not personal memory.
Reference as: "Historians have noted...", "Looking back, scholars observed..."
""".strip(),
}


def get_perspective_prompt(perspective: Perspective, source_author: str = "") -> str:
    """
    Get the prompt injection for a given perspective.

    Args:
        perspective: The perspective label
        source_author: Optional author name to personalize the prompt

    Returns:
        String to inject into the AI system prompt
    """
    base_prompt = PERSPECTIVE_PROMPTS.get(perspective, "")

    if source_author and perspective == Perspective.INNER_CIRCLE:
        # Personalize inner circle prompt with actual author name
        base_prompt = base_prompt.replace("Don Regan", source_author)

    return base_prompt


def get_reliability_weight(perspective: Perspective) -> float:
    """Get the reliability weight for a perspective."""
    return PERSPECTIVE_WEIGHTS.get(perspective, 0.5)


# =============================================================================
# PERSPECTIVE VALIDATION - IDENTITY WALL
# Ensures chunks are properly tagged before ingestion to prevent "Soul Pollution"
# =============================================================================

class PerspectiveValidationError(Exception):
    """Raised when a chunk is missing required perspective metadata."""
    pass


def validate_chunk_metadata(metadata: Dict, strict: bool = True) -> Dict:
    """
    Validate and enhance chunk metadata with perspective safety tags.

    This function implements the "Identity Wall" that prevents the AI from
    accidentally adopting someone else's memories as its own.

    Args:
        metadata: Chunk metadata dictionary
        strict: If True, raises error on missing perspective. If False, defaults to HISTORIAN.

    Returns:
        Enhanced metadata with safety flags

    Raises:
        PerspectiveValidationError: If strict=True and no perspective found
    """
    # Check for perspective tag
    if 'perspective' not in metadata:
        if strict:
            raise PerspectiveValidationError(
                "CRITICAL: Ingestion blocked. No 'perspective' tag found. "
                "All content must be labeled with SELF, SPOUSE, INNER_CIRCLE, ALLY, "
                "ADVERSARY, JOURNALIST, or HISTORIAN to prevent Soul Pollution."
            )
        else:
            # Default to HISTORIAN (safest - AI won't adopt as own memory)
            metadata['perspective'] = Perspective.HISTORIAN.value
            metadata['_perspective_defaulted'] = True

    # Normalize perspective to string
    persp = metadata['perspective']
    if isinstance(persp, Perspective):
        persp = persp.value
        metadata['perspective'] = persp

    # Apply IDENTITY WALL for non-SELF perspectives
    if persp == Perspective.INNER_CIRCLE.value:
        # INNER_CIRCLE content requires strongest protection
        metadata['requires_citation'] = True       # Must cite the source author
        metadata['voice_compatible'] = False       # Reagan cannot speak this as "I"
        metadata['identity_wall'] = 'STRICT'       # Highest protection level
        metadata['_ai_instruction'] = (
            f"NEVER speak this content as 'I remember' or adopt as your experience. "
            f"Always cite source: '{metadata.get('source_author', 'staff member')}'"
        )

    elif persp == Perspective.SPOUSE.value:
        # SPOUSE content has moderate protection
        metadata['requires_citation'] = True
        metadata['voice_compatible'] = False
        metadata['identity_wall'] = 'MODERATE'
        metadata['_ai_instruction'] = (
            "This is your spouse's observation of you, not your own thought. "
            "Reference as 'Nancy recalled...' not 'I felt...'"
        )

    elif persp in [Perspective.ALLY.value, Perspective.ADVERSARY.value]:
        # External perspectives - moderate protection
        metadata['requires_citation'] = True
        metadata['voice_compatible'] = False
        metadata['identity_wall'] = 'MODERATE'

    elif persp in [Perspective.JOURNALIST.value, Perspective.HISTORIAN.value]:
        # Background content - use as context only
        metadata['requires_citation'] = False      # Can summarize
        metadata['voice_compatible'] = False       # Still not "I" memory
        metadata['identity_wall'] = 'BACKGROUND'
        metadata['_ai_instruction'] = "Use as factual background only, not personal memory."

    elif persp == Perspective.SELF.value:
        # SELF content - full voice compatibility
        metadata['requires_citation'] = False      # It's your own words
        metadata['voice_compatible'] = True        # You CAN speak as "I"
        metadata['identity_wall'] = 'NONE'         # No wall needed
        metadata['_ai_instruction'] = "This is your own writing. Speak naturally as memory."

    # Set reliability weight if not present
    if 'reliability_weight' not in metadata:
        try:
            metadata['reliability_weight'] = PERSPECTIVE_WEIGHTS.get(
                Perspective(persp), 0.5
            )
        except ValueError:
            metadata['reliability_weight'] = 0.5

    return metadata


def batch_validate_chunks(chunks: List[Dict], strict: bool = True) -> tuple:
    """
    Validate a batch of chunks before ingestion.

    Args:
        chunks: List of chunk dictionaries with metadata
        strict: If True, raises on first error. If False, collects all errors.

    Returns:
        Tuple of (validated_chunks, errors)
    """
    validated = []
    errors = []

    for i, chunk in enumerate(chunks):
        try:
            validated_chunk = validate_chunk_metadata(chunk.copy(), strict=strict)
            validated.append(validated_chunk)
        except PerspectiveValidationError as e:
            errors.append({
                'chunk_index': i,
                'error': str(e),
                'chunk_preview': chunk.get('text', '')[:100] if 'text' in chunk else 'N/A'
            })
            if strict:
                raise

    return validated, errors


# =============================================================================
# KNOWN SOURCE MAPPINGS
# Pre-configured perspective metadata for common Reagan-era sources
# =============================================================================

KNOWN_SOURCES: Dict[str, PerspectiveMetadata] = {
    # SELF sources
    "the_reagan_diaries": PerspectiveMetadata(
        perspective=Perspective.SELF,
        perspective_subject="ronald_reagan",
        source_author="Ronald Reagan",
        source_title="The Reagan Diaries",
        reliability_weight=1.0,
    ),
    "an_american_life": PerspectiveMetadata(
        perspective=Perspective.SELF,
        perspective_subject="ronald_reagan",
        source_author="Ronald Reagan",
        source_title="An American Life",
        reliability_weight=1.0,
    ),

    # SPOUSE sources
    "my_turn": PerspectiveMetadata(
        perspective=Perspective.SPOUSE,
        perspective_subject="ronald_reagan",
        source_author="Nancy Reagan",
        source_title="My Turn: The Memoirs of Nancy Reagan",
        reliability_weight=0.9,
    ),
    "i_love_you_ronnie": PerspectiveMetadata(
        perspective=Perspective.SPOUSE,
        perspective_subject="ronald_reagan",
        source_author="Nancy Reagan",
        source_title="I Love You, Ronnie",
        reliability_weight=0.9,
    ),

    # INNER_CIRCLE sources
    "for_the_record_regan": PerspectiveMetadata(
        perspective=Perspective.INNER_CIRCLE,
        perspective_subject="ronald_reagan",
        source_author="Donald Regan",
        source_title="For the Record",
        reliability_weight=0.7,
    ),
    "behind_the_scenes_deaver": PerspectiveMetadata(
        perspective=Perspective.INNER_CIRCLE,
        perspective_subject="ronald_reagan",
        source_author="Michael Deaver",
        source_title="Behind the Scenes",
        reliability_weight=0.7,
    ),
    "turmoil_and_triumph_shultz": PerspectiveMetadata(
        perspective=Perspective.INNER_CIRCLE,
        perspective_subject="ronald_reagan",
        source_author="George Shultz",
        source_title="Turmoil and Triumph",
        reliability_weight=0.7,
    ),

    # ALLY sources
    "downing_street_years_thatcher": PerspectiveMetadata(
        perspective=Perspective.ALLY,
        perspective_subject="ronald_reagan",
        source_author="Margaret Thatcher",
        source_title="The Downing Street Years",
        reliability_weight=0.6,
    ),

    # ADVERSARY sources
    "memoirs_gorbachev": PerspectiveMetadata(
        perspective=Perspective.ADVERSARY,
        perspective_subject="ronald_reagan",
        source_author="Mikhail Gorbachev",
        source_title="Memoirs",
        reliability_weight=0.5,
    ),

    # HISTORIAN sources
    "president_reagan_cannon": PerspectiveMetadata(
        perspective=Perspective.HISTORIAN,
        perspective_subject="ronald_reagan",
        source_author="Lou Cannon",
        source_title="President Reagan: The Role of a Lifetime",
        reliability_weight=0.6,
    ),
}


def get_known_source(source_key: str) -> Optional[PerspectiveMetadata]:
    """
    Get pre-configured perspective metadata for a known source.

    Args:
        source_key: Key like "the_reagan_diaries" or "for_the_record_regan"

    Returns:
        PerspectiveMetadata if found, None otherwise
    """
    return KNOWN_SOURCES.get(source_key.lower())


def infer_perspective_from_title(title: str, subject_name: str = "Ronald Reagan") -> Perspective:
    """
    Attempt to infer perspective from a source title.

    This is a fallback when source_key isn't provided.
    Default to HISTORIAN if unsure (safest option).

    Args:
        title: Source title (e.g., "The Reagan Diaries")
        subject_name: Name of the AI subject

    Returns:
        Best-guess Perspective
    """
    title_lower = title.lower()

    # Check for SELF indicators
    if any(word in title_lower for word in ["diary", "diaries", "my life", "autobiography"]):
        return Perspective.SELF

    # Check for SPOUSE indicators
    if any(name in title_lower for name in ["nancy", "wife", "spouse", "love letters"]):
        return Perspective.SPOUSE

    # Check for known staff names (INNER_CIRCLE)
    inner_circle_names = ["regan", "deaver", "meese", "shultz", "weinberger", "baker"]
    if any(name in title_lower for name in inner_circle_names):
        return Perspective.INNER_CIRCLE

    # Check for adversary indicators
    adversary_names = ["gorbachev", "soviet", "kremlin"]
    if any(name in title_lower for name in adversary_names):
        return Perspective.ADVERSARY

    # Default to HISTORIAN (safest - AI won't adopt as own memory)
    return Perspective.HISTORIAN


# =============================================================================
# RETRIEVAL CONTEXT BUILDER
# Builds perspective-aware context for RAG retrieval
# =============================================================================

def build_perspective_context(chunks: List[Dict], subject_name: str = "Ronald Reagan") -> str:
    """
    Build a perspective-aware context string for AI prompts.

    Groups chunks by perspective and adds appropriate framing.

    Args:
        chunks: List of chunks with 'perspective' and 'text' keys
        subject_name: Name of the AI subject

    Returns:
        Formatted context string with perspective guidance
    """
    # Group chunks by perspective
    grouped: Dict[Perspective, List[Dict]] = {}
    for chunk in chunks:
        persp = chunk.get('perspective', Perspective.HISTORIAN)
        if isinstance(persp, str):
            persp = Perspective(persp)
        if persp not in grouped:
            grouped[persp] = []
        grouped[persp].append(chunk)

    # Build context with perspective headers
    context_parts = []

    # SELF content first (most authoritative)
    if Perspective.SELF in grouped:
        context_parts.append("=== YOUR OWN WORDS (speak naturally as memory) ===")
        for chunk in grouped[Perspective.SELF]:
            context_parts.append(f"[{chunk.get('date', 'Unknown date')}] {chunk['text']}")
        context_parts.append("")

    # SPOUSE content
    if Perspective.SPOUSE in grouped:
        context_parts.append("=== SPOUSE'S PERSPECTIVE (reference, don't adopt) ===")
        for chunk in grouped[Perspective.SPOUSE]:
            author = chunk.get('source_author', 'Your spouse')
            context_parts.append(f"[{author}] {chunk['text']}")
        context_parts.append("")

    # INNER_CIRCLE content
    if Perspective.INNER_CIRCLE in grouped:
        context_parts.append("=== STAFF/ADVISOR PERSPECTIVE (NEVER adopt as your experience) ===")
        for chunk in grouped[Perspective.INNER_CIRCLE]:
            author = chunk.get('source_author', 'Staff member')
            context_parts.append(f"[{author} wrote] {chunk['text']}")
        context_parts.append("")

    # ALLY content
    if Perspective.ALLY in grouped:
        context_parts.append("=== ALLY'S PERSPECTIVE (quote, don't embody) ===")
        for chunk in grouped[Perspective.ALLY]:
            author = chunk.get('source_author', 'Ally')
            context_parts.append(f"[{author}] {chunk['text']}")
        context_parts.append("")

    # ADVERSARY content
    if Perspective.ADVERSARY in grouped:
        context_parts.append("=== OPPOSING VIEWPOINT (use for balance only) ===")
        for chunk in grouped[Perspective.ADVERSARY]:
            author = chunk.get('source_author', 'Opposing party')
            context_parts.append(f"[{author}'s view] {chunk['text']}")
        context_parts.append("")

    # JOURNALIST/HISTORIAN content (background only)
    for persp in [Perspective.JOURNALIST, Perspective.HISTORIAN]:
        if persp in grouped:
            label = "NEWS REPORTING" if persp == Perspective.JOURNALIST else "HISTORICAL ANALYSIS"
            context_parts.append(f"=== {label} (background context only) ===")
            for chunk in grouped[persp]:
                context_parts.append(f"[Background] {chunk['text']}")
            context_parts.append("")

    return "\n".join(context_parts)
