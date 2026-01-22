"""
Semantic Chunking for GENESIS Biography Ingestion

Implements:
- Sliding window chunking with overlap
- Semantic/paragraph-aware chunking
- Speaker-aware chunking for transcripts
- Metadata injection for Constitutional AI

Based on Gemini's Hello History tutorial, enhanced for GENESIS.
"""

import re
from typing import List, Dict, Optional
from dataclasses import dataclass


@dataclass
class Chunk:
    """A single chunk of text with metadata"""
    text: str
    index: int
    start_char: int
    end_char: int
    metadata: Dict


def create_sliding_chunks(
    text: str,
    chunk_size: int = 200,
    overlap: int = 50
) -> List[str]:
    """
    Basic sliding window chunking by word count.

    Args:
        text: Raw text to chunk
        chunk_size: Number of words per chunk
        overlap: Number of words to overlap between chunks

    Returns:
        List of text chunks
    """
    words = text.split()
    chunks = []
    step = chunk_size - overlap

    for i in range(0, len(words), step):
        chunk_words = words[i:i + chunk_size]
        chunk_text = " ".join(chunk_words)
        if chunk_text:
            chunks.append(chunk_text)

    return chunks


class SemanticChunker:
    """
    Advanced semantic chunking for biographies and historical documents.

    Features:
    - Paragraph-aware splitting
    - Speaker detection for transcripts
    - Era/date detection for chronological context
    - Constitutional metadata injection
    """

    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
        respect_paragraphs: bool = True,
        detect_speakers: bool = True
    ):
        """
        Initialize semantic chunker.

        Args:
            chunk_size: Target chunk size in characters
            chunk_overlap: Overlap between chunks in characters
            respect_paragraphs: Try to keep paragraphs together
            detect_speakers: Detect speaker changes in transcripts
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.respect_paragraphs = respect_paragraphs
        self.detect_speakers = detect_speakers

        # Speaker patterns for transcript detection
        self.speaker_patterns = [
            r'^([A-Z][A-Za-z\s\.]+):',  # "John Smith:" or "Dr. Smith:"
            r'^\[([^\]]+)\]',            # "[John Smith]"
            r'^([A-Z]{2,}):',            # "LBJ:" or "JFK:"
        ]

        # Date/era patterns for chronological context
        self.date_patterns = [
            r'\b(19\d{2}|20\d{2})\b',                    # Years: 1952, 2004
            r'\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4}\b',
            r'\b(early|mid|late)\s+(19\d{2}s|20\d{2}s)\b',  # "early 1960s"
        ]

    def clean_text(self, text: str) -> str:
        """
        Clean raw text by removing artifacts.

        Removes:
        - Page numbers
        - Headers/footers
        - Excessive whitespace
        - Common OCR artifacts
        """
        # Remove standalone page numbers
        text = re.sub(r'\n\s*\d+\s*\n', '\n', text)
        text = re.sub(r'\n\s*Page\s+\d+\s*\n', '\n', text, flags=re.IGNORECASE)

        # Remove common headers/footers (all caps, widely spaced)
        text = re.sub(r'\n\s*[A-Z][A-Z\s]{10,}\s*\n', '\n', text)

        # Remove copyright notices
        text = re.sub(r'Copyright\s*©?\s*\d{4}[^\n]*\n', '', text, flags=re.IGNORECASE)

        # Normalize whitespace
        text = re.sub(r'\n{3,}', '\n\n', text)  # Max 2 newlines
        text = re.sub(r'[ \t]+', ' ', text)      # Single spaces

        return text.strip()

    def detect_speaker(self, text: str) -> Optional[str]:
        """Detect speaker name from text beginning"""
        for pattern in self.speaker_patterns:
            match = re.match(pattern, text.strip())
            if match:
                return match.group(1).strip()
        return None

    def extract_dates(self, text: str) -> List[str]:
        """Extract date references from text"""
        dates = []
        for pattern in self.date_patterns:
            matches = re.findall(pattern, text)
            if matches:
                # Handle both simple matches (strings) and group matches (tuples)
                if isinstance(matches[0], str):
                    dates.extend(matches)
                else:
                    dates.extend([m[0] for m in matches])
        return list(set(dates))

    def split_by_paragraphs(self, text: str) -> List[str]:
        """Split text into paragraphs"""
        paragraphs = re.split(r'\n\s*\n', text)
        return [p.strip() for p in paragraphs if p.strip()]

    def chunk_text(
        self,
        text: str,
        base_metadata: Dict = None
    ) -> List[Chunk]:
        """
        Chunk text with semantic awareness.

        Args:
            text: Text to chunk
            base_metadata: Base metadata to include in all chunks
                          (speaker, source_file, profile_id, etc.)

        Returns:
            List of Chunk objects with text and metadata
        """
        # Clean the text first
        clean = self.clean_text(text)

        if not clean:
            return []

        base_metadata = base_metadata or {}
        chunks = []

        if self.respect_paragraphs:
            # Split by paragraphs first
            paragraphs = self.split_by_paragraphs(clean)

            current_chunk = ""
            current_start = 0

            for para in paragraphs:
                # Check if adding this paragraph exceeds chunk size
                if len(current_chunk) + len(para) > self.chunk_size and current_chunk:
                    # Save current chunk
                    chunks.append(self._create_chunk(
                        current_chunk,
                        len(chunks),
                        current_start,
                        current_start + len(current_chunk),
                        base_metadata
                    ))

                    # Start new chunk with overlap
                    overlap_text = current_chunk[-self.chunk_overlap:] if len(current_chunk) > self.chunk_overlap else current_chunk
                    current_chunk = overlap_text + "\n\n" + para
                    current_start = current_start + len(current_chunk) - len(overlap_text) - len(para) - 2
                else:
                    if current_chunk:
                        current_chunk += "\n\n" + para
                    else:
                        current_chunk = para

            # Don't forget the last chunk
            if current_chunk:
                chunks.append(self._create_chunk(
                    current_chunk,
                    len(chunks),
                    current_start,
                    current_start + len(current_chunk),
                    base_metadata
                ))
        else:
            # Simple character-based chunking with overlap
            for i in range(0, len(clean), self.chunk_size - self.chunk_overlap):
                chunk_text = clean[i:i + self.chunk_size]
                if chunk_text:
                    chunks.append(self._create_chunk(
                        chunk_text,
                        len(chunks),
                        i,
                        i + len(chunk_text),
                        base_metadata
                    ))

        return chunks

    def _create_chunk(
        self,
        text: str,
        index: int,
        start: int,
        end: int,
        base_metadata: Dict
    ) -> Chunk:
        """Create a Chunk with enriched metadata"""
        metadata = base_metadata.copy()

        # Detect speaker if enabled
        if self.detect_speakers:
            speaker = self.detect_speaker(text)
            if speaker:
                metadata['detected_speaker'] = speaker

        # Extract dates
        dates = self.extract_dates(text)
        if dates:
            metadata['mentioned_dates'] = dates
            # Try to identify the primary year
            years = [d for d in dates if re.match(r'^\d{4}$', str(d))]
            if years:
                metadata['primary_year'] = min(int(y) for y in years)

        # Word and character counts
        metadata['word_count'] = len(text.split())
        metadata['char_count'] = len(text)
        metadata['chunk_index'] = index

        return Chunk(
            text=text,
            index=index,
            start_char=start,
            end_char=end,
            metadata=metadata
        )

    def chunk_transcript(
        self,
        text: str,
        speakers: Dict[str, str] = None,
        base_metadata: Dict = None
    ) -> List[Chunk]:
        """
        Chunk a transcript while preserving speaker context.

        Args:
            text: Transcript text
            speakers: Optional mapping of speaker abbreviations to full names
                     e.g., {"LBJ": "Lyndon B. Johnson", "LB": "Lady Bird Johnson"}
            base_metadata: Base metadata for all chunks

        Returns:
            List of chunks with speaker attribution
        """
        speakers = speakers or {}
        base_metadata = base_metadata or {}

        # Split by speaker turns
        lines = text.split('\n')
        current_speaker = None
        current_turn = []
        turns = []

        for line in lines:
            detected = self.detect_speaker(line)
            if detected:
                # Save previous turn
                if current_turn:
                    turns.append({
                        'speaker': current_speaker,
                        'text': '\n'.join(current_turn)
                    })
                current_speaker = speakers.get(detected, detected)
                # Remove speaker prefix from line
                for pattern in self.speaker_patterns:
                    line = re.sub(pattern, '', line).strip()
                current_turn = [line] if line else []
            else:
                current_turn.append(line)

        # Don't forget last turn
        if current_turn:
            turns.append({
                'speaker': current_speaker,
                'text': '\n'.join(current_turn)
            })

        # Now chunk, keeping speaker turns together when possible
        chunks = []
        current_chunk_text = ""
        current_chunk_speakers = set()

        for turn in turns:
            turn_text = f"[{turn['speaker']}]: {turn['text']}" if turn['speaker'] else turn['text']

            if len(current_chunk_text) + len(turn_text) > self.chunk_size and current_chunk_text:
                # Save current chunk
                metadata = base_metadata.copy()
                metadata['speakers'] = list(current_chunk_speakers)
                chunks.append(self._create_chunk(
                    current_chunk_text,
                    len(chunks),
                    0, 0,  # Positions not tracked for transcripts
                    metadata
                ))

                # Start new chunk
                current_chunk_text = turn_text
                current_chunk_speakers = {turn['speaker']} if turn['speaker'] else set()
            else:
                current_chunk_text += "\n\n" + turn_text if current_chunk_text else turn_text
                if turn['speaker']:
                    current_chunk_speakers.add(turn['speaker'])

        # Last chunk
        if current_chunk_text:
            metadata = base_metadata.copy()
            metadata['speakers'] = list(current_chunk_speakers)
            chunks.append(self._create_chunk(
                current_chunk_text,
                len(chunks),
                0, 0,
                metadata
            ))

        return chunks


# Convenience function for simple use cases
def chunk_biography(
    text: str,
    profile_id: str,
    profile_name: str,
    chunk_size: int = 1000,
    overlap: int = 200
) -> List[Dict]:
    """
    Quick helper to chunk a biography with standard settings.

    Args:
        text: Biography text
        profile_id: GENESIS profile ID (e.g., "historical_ronald_reagan")
        profile_name: Display name (e.g., "Ronald Reagan")
        chunk_size: Target chunk size in characters
        overlap: Overlap between chunks

    Returns:
        List of dictionaries ready for storage
    """
    chunker = SemanticChunker(
        chunk_size=chunk_size,
        chunk_overlap=overlap,
        respect_paragraphs=True,
        detect_speakers=True
    )

    chunks = chunker.chunk_text(text, base_metadata={
        'profile_id': profile_id,
        'profile_name': profile_name,
        'source_type': 'biography'
    })

    return [
        {
            'text': chunk.text,
            'chunk_index': chunk.index,
            'metadata': chunk.metadata
        }
        for chunk in chunks
    ]
