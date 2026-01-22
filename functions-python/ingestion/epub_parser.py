"""
ePub Parser for GENESIS Biography Ingestion

Extracts text from ePub files with special handling for:
- Diary entries (date-based splitting)
- Letters (recipient-based)
- Standard biographies (chapter-based)

Based on Hello History tutorial, enhanced for Reagan Diaries.
"""

import re
import logging
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime
import io

# Import perspective system for Rashomon Effect prevention
try:
    from .perspective import Perspective, PerspectiveMetadata, get_known_source, infer_perspective_from_title
    PERSPECTIVE_AVAILABLE = True
except ImportError:
    PERSPECTIVE_AVAILABLE = False
    Perspective = None

logger = logging.getLogger(__name__)

@dataclass
class DiaryEntry:
    """A single diary entry with date and content"""
    date_text: str          # Original date text (e.g., "Monday, January 26")
    date_parsed: Optional[str]  # ISO date if parseable (e.g., "1981-01-26")
    year: Optional[int]
    text: str
    word_count: int
    sentiment_hint: Optional[str] = None  # e.g., "worried", "optimistic"
    mentioned_people: List[str] = None
    mentioned_topics: List[str] = None
    # Perspective fields (Rashomon Effect prevention)
    perspective: str = "SELF"              # SELF, SPOUSE, INNER_CIRCLE, ALLY, ADVERSARY, JOURNALIST, HISTORIAN
    perspective_subject: str = None        # Who the content is ABOUT (e.g., "ronald_reagan")
    source_author: str = None              # Who WROTE the content (e.g., "Ronald Reagan")
    source_title: str = None               # Book title (e.g., "The Reagan Diaries")
    reliability_weight: float = 1.0        # Trust weight (SELF=1.0, others lower)


class EpubParser:
    """
    Parse ePub files for GENESIS ingestion.

    Handles:
    - The Reagan Diaries (date-based entries)
    - Letters to Nancy (letter format)
    - Standard biographies (chapter-based)
    """

    def __init__(self):
        # Date pattern for Reagan's diary format: "DayOfWeek, Month Day"
        self.diary_date_pattern = re.compile(
            r"^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+"
            r"(January|February|March|April|May|June|July|August|September|October|November|December)\s+"
            r"(\d{1,2})(?:st|nd|rd|th)?(?:,?\s*(\d{4}))?",
            re.IGNORECASE
        )

        # Alternative date patterns
        self.iso_date_pattern = re.compile(r"(\d{4})-(\d{2})-(\d{2})")
        self.us_date_pattern = re.compile(r"(\d{1,2})/(\d{1,2})/(\d{4})")

        # Month name to number mapping
        self.months = {
            'january': 1, 'february': 2, 'march': 3, 'april': 4,
            'may': 5, 'june': 6, 'july': 7, 'august': 8,
            'september': 9, 'october': 10, 'november': 11, 'december': 12
        }

        # People detection patterns (for Reagan context)
        self.people_patterns = [
            r'\b(Nancy|Mommy)\b',
            r'\b(Gorbachev|Mikhail)\b',
            r'\b(Margaret Thatcher|Thatcher)\b',
            r'\b(George Bush|Bush)\b',
            r'\b(Tip O\'Neill|O\'Neill)\b',
            r'\b(Don Regan|Regan)\b',
            r'\b(Mike Deaver|Deaver)\b',
            r'\b(Ed Meese|Meese)\b',
            r'\b(Cap Weinberger|Weinberger)\b',
            r'\b(George Shultz|Shultz)\b',
            r'\b(Patti|Ron Jr\.?|Maureen|Michael)\b',
        ]

        # Topic detection keywords
        self.topic_keywords = {
            'cold_war': ['soviet', 'russia', 'gorbachev', 'communism', 'nuclear', 'arms', 'missile'],
            'economy': ['budget', 'deficit', 'tax', 'inflation', 'unemployment', 'economy'],
            'nancy': ['nancy', 'mommy', 'my wife'],
            'health': ['doctor', 'hospital', 'surgery', 'cancer', 'tired', 'sick'],
            'staff': ['staff', 'cabinet', 'meeting', 'briefing'],
            'travel': ['trip', 'flight', 'travel', 'visit', 'summit'],
            'media': ['press', 'media', 'reporters', 'interview'],
        }

    def parse_epub(self, epub_path: str) -> Tuple[str, List[Dict]]:
        """
        Parse an ePub file and return raw text and metadata.

        Returns:
            Tuple of (full_text, chapters_list)
        """
        try:
            import ebooklib
            from ebooklib import epub
            from bs4 import BeautifulSoup
        except ImportError:
            raise ImportError(
                "ebooklib and beautifulsoup4 required. "
                "Install with: pip install ebooklib beautifulsoup4"
            )

        logger.info(f"Opening ePub: {epub_path}")
        book = epub.read_epub(epub_path)

        chapters = []
        full_text_parts = []

        for item in book.get_items():
            if item.get_type() == ebooklib.ITEM_DOCUMENT:
                # Parse HTML to text
                soup = BeautifulSoup(item.get_content(), 'html.parser')
                text = soup.get_text(separator='\n')

                # Clean up text
                text = self._clean_text(text)

                if text.strip():
                    chapters.append({
                        'id': item.get_id(),
                        'name': item.get_name(),
                        'text': text
                    })
                    full_text_parts.append(text)

        full_text = '\n\n'.join(full_text_parts)
        logger.info(f"Extracted {len(chapters)} chapters, {len(full_text)} characters")

        return full_text, chapters

    def parse_epub_bytes(self, epub_bytes: bytes) -> Tuple[str, List[Dict]]:
        """
        Parse ePub from bytes (for Cloud Function uploads).
        """
        try:
            import ebooklib
            from ebooklib import epub
            from bs4 import BeautifulSoup
        except ImportError:
            raise ImportError(
                "ebooklib and beautifulsoup4 required."
            )

        # Write bytes to temp file-like object
        book = epub.read_epub(io.BytesIO(epub_bytes))

        chapters = []
        full_text_parts = []

        for item in book.get_items():
            if item.get_type() == ebooklib.ITEM_DOCUMENT:
                soup = BeautifulSoup(item.get_content(), 'html.parser')
                text = soup.get_text(separator='\n')
                text = self._clean_text(text)

                if text.strip():
                    chapters.append({
                        'id': item.get_id(),
                        'name': item.get_name(),
                        'text': text
                    })
                    full_text_parts.append(text)

        return '\n\n'.join(full_text_parts), chapters

    def extract_diary_entries(
        self,
        text: str,
        default_year: int = 1981,
        perspective: str = "SELF",
        perspective_subject: str = "ronald_reagan",
        source_author: str = "Ronald Reagan",
        source_title: str = "The Reagan Diaries",
        reliability_weight: float = 1.0
    ) -> List[DiaryEntry]:
        """
        Extract diary entries from text (for Reagan Diaries format).

        Args:
            text: Full text from ePub
            default_year: Year to use if not specified in entry
            perspective: SELF, SPOUSE, INNER_CIRCLE, ALLY, ADVERSARY, JOURNALIST, HISTORIAN
            perspective_subject: Who the content is ABOUT (e.g., "ronald_reagan")
            source_author: Who WROTE the content
            source_title: Book/source title
            reliability_weight: Trust weight (0.0-1.0)

        Returns:
            List of DiaryEntry objects
        """
        entries = []
        current_date_text = "Unknown"
        current_date_parsed = None
        current_year = default_year
        current_text = []

        lines = text.split('\n')

        for line in lines:
            clean_line = line.strip()
            if not clean_line:
                continue

            # Check if this line is a date header
            date_match = self.diary_date_pattern.match(clean_line)

            if date_match:
                # Save previous entry if exists
                if current_text:
                    entry_text = ' '.join(current_text)
                    entries.append(DiaryEntry(
                        date_text=current_date_text,
                        date_parsed=current_date_parsed,
                        year=current_year,
                        text=entry_text,
                        word_count=len(entry_text.split()),
                        mentioned_people=self._extract_people(entry_text),
                        mentioned_topics=self._extract_topics(entry_text),
                        # Perspective fields (Rashomon Effect prevention)
                        perspective=perspective,
                        perspective_subject=perspective_subject,
                        source_author=source_author,
                        source_title=source_title,
                        reliability_weight=reliability_weight
                    ))

                # Parse new date
                current_date_text = clean_line
                day_of_week = date_match.group(1)
                month_name = date_match.group(2).lower()
                day = int(date_match.group(3))
                year = date_match.group(4)

                if year:
                    current_year = int(year)

                month_num = self.months.get(month_name, 1)
                current_date_parsed = f"{current_year}-{month_num:02d}-{day:02d}"

                current_text = []
            else:
                # Check for year headers (e.g., "1981" or "The Year 1981")
                year_match = re.match(r'^(?:The\s+Year\s+)?(\d{4})\s*$', clean_line)
                if year_match:
                    current_year = int(year_match.group(1))
                else:
                    current_text.append(clean_line)

        # Don't forget the last entry
        if current_text:
            entry_text = ' '.join(current_text)
            entries.append(DiaryEntry(
                date_text=current_date_text,
                date_parsed=current_date_parsed,
                year=current_year,
                text=entry_text,
                word_count=len(entry_text.split()),
                mentioned_people=self._extract_people(entry_text),
                mentioned_topics=self._extract_topics(entry_text),
                # Perspective fields (Rashomon Effect prevention)
                perspective=perspective,
                perspective_subject=perspective_subject,
                source_author=source_author,
                source_title=source_title,
                reliability_weight=reliability_weight
            ))

        logger.info(f"Extracted {len(entries)} diary entries")
        return entries

    def _clean_text(self, text: str) -> str:
        """Clean extracted text"""
        # Remove multiple newlines
        text = re.sub(r'\n{3,}', '\n\n', text)
        # Remove tabs
        text = text.replace('\t', ' ')
        # Remove multiple spaces
        text = re.sub(r' {2,}', ' ', text)
        # Remove page numbers
        text = re.sub(r'\n\s*\d+\s*\n', '\n', text)
        return text.strip()

    def _extract_people(self, text: str) -> List[str]:
        """Extract mentioned people from text"""
        people = set()
        for pattern in self.people_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    people.add(match[0])
                else:
                    people.add(match)
        return list(people)

    def _extract_topics(self, text: str) -> List[str]:
        """Extract topics from text based on keywords"""
        text_lower = text.lower()
        topics = []
        for topic, keywords in self.topic_keywords.items():
            if any(kw in text_lower for kw in keywords):
                topics.append(topic)
        return topics


def parse_reagan_diaries(
    epub_path: str,
    perspective: str = "SELF",
    perspective_subject: str = "ronald_reagan",
    source_author: str = "Ronald Reagan",
    source_title: str = "The Reagan Diaries",
    reliability_weight: float = 1.0
) -> List[Dict]:
    """
    Convenience function to parse The Reagan Diaries ePub.

    Args:
        epub_path: Path to the ePub file
        perspective: SELF, SPOUSE, INNER_CIRCLE, ALLY, ADVERSARY, JOURNALIST, HISTORIAN
        perspective_subject: Who the content is ABOUT (e.g., "ronald_reagan")
        source_author: Who WROTE the content
        source_title: Book title
        reliability_weight: Trust weight (0.0-1.0)

    Returns:
        List of diary entries ready for ingestion with perspective metadata.
    """
    parser = EpubParser()
    full_text, chapters = parser.parse_epub(epub_path)
    entries = parser.extract_diary_entries(
        full_text,
        perspective=perspective,
        perspective_subject=perspective_subject,
        source_author=source_author,
        source_title=source_title,
        reliability_weight=reliability_weight
    )

    # Convert to dicts for JSON serialization
    return [
        {
            'date_text': e.date_text,
            'date_parsed': e.date_parsed,
            'year': e.year,
            'text': e.text,
            'word_count': e.word_count,
            'mentioned_people': e.mentioned_people or [],
            'mentioned_topics': e.mentioned_topics or [],
            # Perspective fields (Rashomon Effect prevention)
            'perspective': e.perspective,
            'perspective_subject': e.perspective_subject,
            'source_author': e.source_author,
            'source_title': e.source_title,
            'source': e.source_title,  # Backward compatibility
            'reliability_weight': e.reliability_weight
        }
        for e in entries
    ]


if __name__ == '__main__':
    # Test with local file
    import sys
    if len(sys.argv) > 1:
        entries = parse_reagan_diaries(sys.argv[1])
        print(f"Extracted {len(entries)} entries")

        # Show sample
        if entries:
            print("\nSample entry:")
            print(f"  Date: {entries[0]['date_text']}")
            print(f"  Parsed: {entries[0]['date_parsed']}")
            print(f"  Text: {entries[0]['text'][:200]}...")
            print(f"  People: {entries[0]['mentioned_people']}")
            print(f"  Topics: {entries[0]['mentioned_topics']}")
