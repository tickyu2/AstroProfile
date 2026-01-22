#!/usr/bin/env python3
"""
GENESIS Profile Converter - JavaScript Profiles to RAG Chunks

Converts existing JavaScript profile data from src/profiles/ into
text chunks suitable for RAG ingestion, without needing external PDFs.

Usage:
    python convert_profiles_to_chunks.py --output json
    python convert_profiles_to_chunks.py --output database
    python convert_profiles_to_chunks.py --profile ronaldReagan --dry-run
"""

import os
import re
import sys
import json
import hashlib
import argparse
from pathlib import Path
from typing import List, Dict, Optional, Any
from dataclasses import dataclass

# Add parent directory for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from ingestion.chunking import SemanticChunker, Chunk


@dataclass
class ProfileSection:
    """A section extracted from a profile"""
    title: str
    content: str
    section_type: str
    source_field: str


class ProfileConverter:
    """
    Converts JavaScript profile objects into text chunks for RAG.

    Parses JS objects, extracts narrative content, and generates
    semantically meaningful chunks with metadata.
    """

    def __init__(
        self,
        profiles_dir: str = None,
        chunk_size: int = 1000,
        chunk_overlap: int = 200
    ):
        """
        Initialize the converter.

        Args:
            profiles_dir: Path to src/profiles directory
            chunk_size: Target chunk size in characters
            chunk_overlap: Overlap between chunks (20% = 200)
        """
        if profiles_dir is None:
            # Default to src/profiles from project root
            project_root = Path(__file__).parent.parent.parent
            profiles_dir = project_root / "src" / "profiles"

        self.profiles_dir = Path(profiles_dir)
        self.chunker = SemanticChunker(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            respect_paragraphs=True,
            detect_speakers=True
        )

        # Sections to extract from profiles
        self.extraction_config = {
            'biographical': [
                'personality.core_traits',
                'personality.communication_style',
                'personality.leadership_style',
                'personality.expertise',
                'personality.historical_context',
                'personality.quirks',
                'personality.emotional_depth',
                'personality.values'
            ],
            'constitutional': [
                'constitutional.bazi',
                'constitutional.western_chart'
            ],
            'relationship': [
                'relationship.their_love_story',
                'relationship.complementary_strengths',
                'relationship.how_they_complement',
                'relationship.shared_values',
                'relationship.signature_interactions'
            ],
            'couple_themes': [
                'couple_themes'
            ]
        }

    def parse_js_object(self, js_content: str) -> Dict:
        """
        Parse a JavaScript object literal into Python dict.

        Handles:
        - Template literals (backticks)
        - Single and double quoted strings
        - Arrays and nested objects
        - Comments
        """
        # Remove JS comments
        content = re.sub(r'//.*$', '', js_content, flags=re.MULTILINE)
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)

        # Find the main export object
        match = re.search(
            r'export\s+(?:const|let|var)\s+\w+\s*=\s*(\{.*\});?\s*(?:export\s+default|\Z)',
            content,
            re.DOTALL
        )

        if not match:
            # Try simpler pattern
            match = re.search(r'=\s*(\{.*\})\s*;?\s*$', content, re.DOTALL)

        if not match:
            raise ValueError("Could not find export object in file")

        obj_str = match.group(1)

        # Convert JS to JSON-compatible format
        # Handle template literals (backticks) - convert to regular strings
        obj_str = self._convert_template_literals(obj_str)

        # Handle single quotes -> double quotes (but not in strings)
        obj_str = self._convert_quotes(obj_str)

        # Handle trailing commas
        obj_str = re.sub(r',(\s*[}\]])', r'\1', obj_str)

        # Handle unquoted keys
        obj_str = re.sub(r'(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1 "\2":', obj_str)

        try:
            return json.loads(obj_str)
        except json.JSONDecodeError as e:
            # If JSON parsing fails, try a more lenient approach
            return self._lenient_parse(obj_str)

    def _convert_template_literals(self, content: str) -> str:
        """Convert backtick template literals to regular strings"""
        result = []
        i = 0
        while i < len(content):
            if content[i] == '`':
                # Find matching closing backtick
                j = i + 1
                while j < len(content) and content[j] != '`':
                    if content[j] == '\\':
                        j += 2
                    else:
                        j += 1

                # Extract template content
                template = content[i+1:j]
                # Escape for JSON
                template = template.replace('\\', '\\\\')
                template = template.replace('"', '\\"')
                template = template.replace('\n', '\\n')
                template = template.replace('\r', '\\r')
                template = template.replace('\t', '\\t')

                result.append('"' + template + '"')
                i = j + 1
            else:
                result.append(content[i])
                i += 1

        return ''.join(result)

    def _convert_quotes(self, content: str) -> str:
        """Convert single quotes to double quotes (outside of strings)"""
        result = []
        in_string = False
        string_char = None
        i = 0

        while i < len(content):
            char = content[i]

            if not in_string:
                if char == '"':
                    in_string = True
                    string_char = '"'
                    result.append(char)
                elif char == "'":
                    in_string = True
                    string_char = "'"
                    result.append('"')  # Convert to double quote
                else:
                    result.append(char)
            else:
                if char == '\\' and i + 1 < len(content):
                    result.append(char)
                    result.append(content[i + 1])
                    i += 1
                elif char == string_char:
                    in_string = False
                    result.append('"' if string_char == "'" else char)
                    string_char = None
                else:
                    result.append(char)
            i += 1

        return ''.join(result)

    def _lenient_parse(self, obj_str: str) -> Dict:
        """Lenient parsing using regex extraction for key fields"""
        result = {}

        # Extract profile_id
        match = re.search(r'"?profile_id"?\s*:\s*["\']([^"\']+)["\']', obj_str)
        if match:
            result['profile_id'] = match.group(1)

        # Extract profile_name
        match = re.search(r'"?profile_name"?\s*:\s*["\']([^"\']+)["\']', obj_str)
        if match:
            result['profile_name'] = match.group(1)

        # Extract profile_type
        match = re.search(r'"?profile_type"?\s*:\s*["\']([^"\']+)["\']', obj_str)
        if match:
            result['profile_type'] = match.group(1)

        # For the full content, just store the raw string
        result['_raw_content'] = obj_str

        return result

    def extract_text_from_profile(self, profile: Dict) -> List[ProfileSection]:
        """
        Extract narrative text content from a profile object.

        Returns list of ProfileSection objects with title, content, and metadata.
        """
        sections = []
        profile_id = profile.get('profile_id', 'unknown')
        profile_name = profile.get('profile_name', 'Unknown')
        profile_type = profile.get('profile_type', 'unknown')

        # Extract personality sections
        if 'personality' in profile:
            personality = profile['personality']

            # Core traits
            if 'core_traits' in personality:
                traits = personality['core_traits']
                if isinstance(traits, list):
                    content = f"{profile_name} - Core Personality Traits:\n"
                    content += "\n".join(f"• {trait}" for trait in traits)
                    sections.append(ProfileSection(
                        title=f"{profile_name} Core Traits",
                        content=content,
                        section_type="personality",
                        source_field="personality.core_traits"
                    ))

            # Communication style
            if 'communication_style' in personality:
                comm = personality['communication_style']
                content = f"{profile_name} - Communication Style:\n"
                if isinstance(comm, dict):
                    if 'tone' in comm:
                        content += f"Tone: {comm['tone']}\n"
                    if 'pace' in comm:
                        content += f"Pace: {comm['pace']}\n"
                    if 'vocabulary' in comm and isinstance(comm['vocabulary'], list):
                        content += f"Key vocabulary: {', '.join(comm['vocabulary'])}\n"
                    if 'signature_phrases' in comm and isinstance(comm['signature_phrases'], list):
                        content += "\nSignature phrases:\n"
                        content += "\n".join(f'• "{phrase}"' for phrase in comm['signature_phrases'])
                    if 'great_communicator_secrets' in comm:
                        secrets = comm['great_communicator_secrets']
                        if isinstance(secrets, dict):
                            content += "\n\nCommunication secrets:\n"
                            for key, value in secrets.items():
                                content += f"• {key.replace('_', ' ').title()}: {value}\n"
                sections.append(ProfileSection(
                    title=f"{profile_name} Communication Style",
                    content=content,
                    section_type="communication",
                    source_field="personality.communication_style"
                ))

            # Leadership style
            if 'leadership_style' in personality:
                lead = personality['leadership_style']
                content = f"{profile_name} - Leadership Style:\n"
                if isinstance(lead, dict):
                    if 'approach' in lead:
                        content += f"Approach: {lead['approach']}\n"
                    if 'method_order' in lead and isinstance(lead['method_order'], list):
                        content += "\nMethod:\n"
                        content += "\n".join(f"• {method}" for method in lead['method_order'])
                    if 'communication_lessons' in lead and isinstance(lead['communication_lessons'], list):
                        content += "\n\nKey lessons:\n"
                        content += "\n".join(f"• {lesson}" for lesson in lead['communication_lessons'])
                    if 'crisis_leadership' in lead and isinstance(lead['crisis_leadership'], dict):
                        content += "\n\nCrisis leadership:\n"
                        for crisis, response in lead['crisis_leadership'].items():
                            content += f"• {crisis.replace('_', ' ').title()}: {response}\n"
                sections.append(ProfileSection(
                    title=f"{profile_name} Leadership Style",
                    content=content,
                    section_type="leadership",
                    source_field="personality.leadership_style"
                ))

            # Historical context
            if 'historical_context' in personality:
                hist = personality['historical_context']
                content = f"{profile_name} - Historical Context:\n"
                if isinstance(hist, dict):
                    if 'life_span' in hist:
                        content += f"Life span: {hist['life_span']}\n"
                    if 'key_periods' in hist and isinstance(hist['key_periods'], list):
                        content += "\nKey life periods:\n"
                        for period in hist['key_periods']:
                            if isinstance(period, dict):
                                content += f"• {period.get('period', '')}: {period.get('notes', '')}\n"
                    if 'major_achievements' in hist and isinstance(hist['major_achievements'], list):
                        content += "\nMajor achievements:\n"
                        for achieve in hist['major_achievements']:
                            if isinstance(achieve, dict):
                                content += f"• {achieve.get('achievement', '')} ({achieve.get('year', '')}): {achieve.get('impact', '')}\n"
                sections.append(ProfileSection(
                    title=f"{profile_name} Historical Context",
                    content=content,
                    section_type="biography",
                    source_field="personality.historical_context"
                ))

            # Emotional depth
            if 'emotional_depth' in personality:
                emo = personality['emotional_depth']
                content = f"{profile_name} - Emotional Depth:\n"
                if isinstance(emo, dict):
                    if 'vulnerabilities' in emo and isinstance(emo['vulnerabilities'], list):
                        content += "\nVulnerabilities:\n"
                        content += "\n".join(f"• {v}" for v in emo['vulnerabilities'])
                    if 'joys' in emo and isinstance(emo['joys'], list):
                        content += "\n\nJoys:\n"
                        content += "\n".join(f"• {j}" for j in emo['joys'])
                    if 'defining_moments' in emo and isinstance(emo['defining_moments'], list):
                        content += "\n\nDefining moments:\n"
                        content += "\n".join(f"• {m}" for m in emo['defining_moments'])
                    if 'personal_philosophy' in emo and isinstance(emo['personal_philosophy'], dict):
                        content += "\n\nPersonal philosophy:\n"
                        for topic, quote in emo['personal_philosophy'].items():
                            content += f"• On {topic.replace('_', ' ')}: \"{quote}\"\n"
                sections.append(ProfileSection(
                    title=f"{profile_name} Emotional Depth",
                    content=content,
                    section_type="emotional",
                    source_field="personality.emotional_depth"
                ))

            # Quirks
            if 'quirks' in personality and isinstance(personality['quirks'], list):
                content = f"{profile_name} - Personal Quirks:\n"
                content += "\n".join(f"• {q}" for q in personality['quirks'])
                sections.append(ProfileSection(
                    title=f"{profile_name} Quirks",
                    content=content,
                    section_type="personality",
                    source_field="personality.quirks"
                ))

            # Values
            if 'values' in personality:
                vals = personality['values']
                content = f"{profile_name} - Core Values:\n"
                if isinstance(vals, dict):
                    if 'core_beliefs' in vals and isinstance(vals['core_beliefs'], list):
                        content += "\n".join(f"• {b}" for b in vals['core_beliefs'])
                sections.append(ProfileSection(
                    title=f"{profile_name} Values",
                    content=content,
                    section_type="values",
                    source_field="personality.values"
                ))

            # Expertise
            if 'expertise' in personality:
                exp = personality['expertise']
                content = f"{profile_name} - Areas of Expertise:\n"
                if isinstance(exp, dict):
                    if 'primary' in exp and isinstance(exp['primary'], list):
                        content += "Primary expertise:\n"
                        content += "\n".join(f"• {e}" for e in exp['primary'])
                    if 'secondary' in exp and isinstance(exp['secondary'], list):
                        content += "\n\nSecondary expertise:\n"
                        content += "\n".join(f"• {e}" for e in exp['secondary'])
                    if 'era' in exp:
                        content += f"\n\nEra: {exp['era']}"
                sections.append(ProfileSection(
                    title=f"{profile_name} Expertise",
                    content=content,
                    section_type="expertise",
                    source_field="personality.expertise"
                ))

        # Extract constitutional data
        if 'constitutional' in profile:
            const = profile['constitutional']

            # BaZi
            if 'bazi' in const:
                bazi = const['bazi']
                content = f"{profile_name} - BaZi (Chinese Astrology):\n"
                if isinstance(bazi, dict):
                    if 'day_master' in bazi and isinstance(bazi['day_master'], dict):
                        dm = bazi['day_master']
                        content += f"Day Master: {dm.get('stem', '')} ({dm.get('element', '')} {dm.get('polarity', '')})\n"
                        content += f"Description: {dm.get('description', '')}\n"

                    for pillar in ['year_pillar', 'month_pillar', 'day_pillar', 'hour_pillar']:
                        if pillar in bazi and isinstance(bazi[pillar], dict):
                            p = bazi[pillar]
                            content += f"\n{pillar.replace('_', ' ').title()}: "
                            content += f"{p.get('stem', '')}-{p.get('branch', '')} ({p.get('element', '')})\n"
                            content += f"  {p.get('description', '')}\n"

                    # Additional BaZi insights
                    for key in ['sunny_optimism', 'communication_power', 'leadership_strength', 'connecting_ability']:
                        if key in bazi:
                            content += f"\n{key.replace('_', ' ').title()}: {bazi[key]}"

                sections.append(ProfileSection(
                    title=f"{profile_name} BaZi Chart",
                    content=content,
                    section_type="constitutional",
                    source_field="constitutional.bazi"
                ))

            # Western chart
            if 'western_chart' in const:
                west = const['western_chart']
                content = f"{profile_name} - Western Astrology:\n"
                if isinstance(west, dict):
                    for planet in ['sun', 'moon', 'rising', 'mercury', 'venus', 'mars']:
                        if planet in west and isinstance(west[planet], dict):
                            p = west[planet]
                            content += f"\n{planet.title()}: {p.get('sign', '')} "
                            if 'degree' in p:
                                content += f"at {p['degree']}° "
                            if 'house' in p:
                                content += f"(House {p['house']})"
                            content += f"\n  {p.get('description', '')}\n"

                sections.append(ProfileSection(
                    title=f"{profile_name} Western Chart",
                    content=content,
                    section_type="constitutional",
                    source_field="constitutional.western_chart"
                ))

        # Extract relationship data (for couple profiles)
        if 'relationship' in profile:
            rel = profile['relationship']

            # Love story
            if 'their_love_story' in rel:
                content = f"{profile_name} - Love Story:\n\n{rel['their_love_story']}"
                sections.append(ProfileSection(
                    title=f"{profile_name} Love Story",
                    content=content,
                    section_type="relationship",
                    source_field="relationship.their_love_story"
                ))

            # How they complement
            if 'how_they_complement' in rel:
                content = f"{profile_name} - How They Complement Each Other:\n\n{rel['how_they_complement']}"
                sections.append(ProfileSection(
                    title=f"{profile_name} Complementary Dynamics",
                    content=content,
                    section_type="relationship",
                    source_field="relationship.how_they_complement"
                ))

            # Shared values
            if 'shared_values' in rel and isinstance(rel['shared_values'], list):
                content = f"{profile_name} - Shared Values:\n"
                content += "\n".join(f"• {v}" for v in rel['shared_values'])
                sections.append(ProfileSection(
                    title=f"{profile_name} Shared Values",
                    content=content,
                    section_type="relationship",
                    source_field="relationship.shared_values"
                ))

            # Signature interactions
            if 'signature_interactions' in rel and isinstance(rel['signature_interactions'], list):
                content = f"{profile_name} - Signature Interactions:\n"
                for interaction in rel['signature_interactions']:
                    if isinstance(interaction, dict):
                        content += f"\n{interaction.get('type', '').replace('_', ' ').title()}:\n"
                        content += f"  {interaction.get('description', '')}\n"
                        if 'example' in interaction:
                            content += f"  Example: {interaction['example']}\n"
                sections.append(ProfileSection(
                    title=f"{profile_name} Signature Interactions",
                    content=content,
                    section_type="relationship",
                    source_field="relationship.signature_interactions"
                ))

            # Dynamic
            if 'dynamic' in rel and isinstance(rel['dynamic'], dict):
                dyn = rel['dynamic']
                content = f"{profile_name} - Relationship Dynamic:\n"
                if 'primary' in dyn:
                    content += f"Primary: {dyn['primary']}\n"
                if 'reciprocal' in dyn:
                    content += f"Reciprocal: {dyn['reciprocal']}\n"
                if 'metaphor' in dyn:
                    content += f"Metaphor: {dyn['metaphor']}\n"
                if 'balance' in dyn:
                    content += f"Balance: {dyn['balance']}\n"
                sections.append(ProfileSection(
                    title=f"{profile_name} Relationship Dynamic",
                    content=content,
                    section_type="relationship",
                    source_field="relationship.dynamic"
                ))

        # Extract couple themes
        if 'couple_themes' in profile and isinstance(profile['couple_themes'], dict):
            for theme_name, theme_data in profile['couple_themes'].items():
                if isinstance(theme_data, dict):
                    content = f"{profile_name} - {theme_name.replace('_', ' ').title()}:\n"
                    if 'explanation' in theme_data:
                        content += f"\n{theme_data['explanation']}\n"
                    if 'examples' in theme_data and isinstance(theme_data['examples'], list):
                        content += "\nExamples:\n"
                        content += "\n".join(f"• {ex}" for ex in theme_data['examples'])
                    if 'key_message' in theme_data:
                        content += f"\n\nKey message: {theme_data['key_message']}"
                    if 'what_it_teaches' in theme_data and isinstance(theme_data['what_it_teaches'], list):
                        content += "\n\nLessons:\n"
                        content += "\n".join(f"• {lesson}" for lesson in theme_data['what_it_teaches'])

                    sections.append(ProfileSection(
                        title=f"{profile_name} - {theme_name.replace('_', ' ').title()}",
                        content=content,
                        section_type="couple_theme",
                        source_field=f"couple_themes.{theme_name}"
                    ))

        return sections

    def convert_profile_to_chunks(
        self,
        profile: Dict,
        include_raw: bool = False
    ) -> List[Dict]:
        """
        Convert a profile to RAG-ready chunks.

        Args:
            profile: Parsed profile dictionary
            include_raw: Include raw profile data in metadata

        Returns:
            List of chunk dictionaries ready for storage
        """
        profile_id = profile.get('profile_id', 'unknown')
        profile_name = profile.get('profile_name', 'Unknown')
        profile_type = profile.get('profile_type', 'unknown')

        # Extract text sections
        sections = self.extract_text_from_profile(profile)

        all_chunks = []

        for section in sections:
            # Create base metadata for this section
            base_metadata = {
                'profile_id': profile_id,
                'profile_name': profile_name,
                'profile_type': profile_type,
                'source_type': 'profile_js',
                'section_type': section.section_type,
                'source_field': section.source_field,
                'section_title': section.title
            }

            # Chunk the section content
            chunks = self.chunker.chunk_text(section.content, base_metadata=base_metadata)

            # Convert Chunk objects to dictionaries
            for chunk in chunks:
                chunk_dict = {
                    'text': chunk.text,
                    'chunk_index': chunk.index,
                    'metadata': chunk.metadata,
                    'chunk_hash': hashlib.sha256(
                        f"{profile_id}:{section.source_field}:{chunk.index}:{chunk.text[:100]}".encode()
                    ).hexdigest()[:16]
                }
                all_chunks.append(chunk_dict)

        return all_chunks

    def find_profile_files(self) -> List[Path]:
        """Find all profile JS files in the profiles directory"""
        profile_files = []

        for subdir in ['historical', 'modern', 'couples']:
            subdir_path = self.profiles_dir / subdir
            if subdir_path.exists():
                for js_file in subdir_path.glob('*.js'):
                    if js_file.name != 'index.js':
                        profile_files.append(js_file)

        return profile_files

    def convert_all_profiles(
        self,
        dry_run: bool = False,
        verbose: bool = True
    ) -> List[Dict]:
        """
        Convert all profile files to chunks.

        Args:
            dry_run: If True, don't process, just list files
            verbose: Print progress information

        Returns:
            List of all chunks from all profiles
        """
        profile_files = self.find_profile_files()

        if verbose:
            print(f"Found {len(profile_files)} profile files")

        if dry_run:
            for f in profile_files:
                print(f"  - {f.relative_to(self.profiles_dir)}")
            return []

        all_chunks = []
        errors = []

        for profile_file in profile_files:
            try:
                if verbose:
                    print(f"Processing: {profile_file.name}...")

                with open(profile_file, 'r', encoding='utf-8') as f:
                    js_content = f.read()

                profile = self.parse_js_object(js_content)
                chunks = self.convert_profile_to_chunks(profile)

                all_chunks.extend(chunks)

                if verbose:
                    print(f"  -> {len(chunks)} chunks")

            except Exception as e:
                errors.append((profile_file.name, str(e)))
                if verbose:
                    print(f"  -> ERROR: {e}")

        if verbose:
            print(f"\nTotal: {len(all_chunks)} chunks from {len(profile_files)} profiles")
            if errors:
                print(f"Errors: {len(errors)}")
                for name, err in errors:
                    print(f"  - {name}: {err}")

        return all_chunks

    def convert_single_profile(
        self,
        profile_name: str,
        verbose: bool = True
    ) -> List[Dict]:
        """Convert a single profile by name (e.g., 'ronaldReagan')"""
        # Find matching file
        profile_files = self.find_profile_files()

        matching = None
        for pf in profile_files:
            if profile_name.lower() in pf.stem.lower():
                matching = pf
                break

        if not matching:
            raise ValueError(f"Profile '{profile_name}' not found")

        if verbose:
            print(f"Processing: {matching.name}")

        with open(matching, 'r', encoding='utf-8') as f:
            js_content = f.read()

        profile = self.parse_js_object(js_content)
        chunks = self.convert_profile_to_chunks(profile)

        if verbose:
            print(f"Generated {len(chunks)} chunks")

        return chunks


def main():
    parser = argparse.ArgumentParser(
        description="Convert GENESIS JavaScript profiles to RAG chunks"
    )
    parser.add_argument(
        '--profiles-dir',
        type=str,
        help="Path to src/profiles directory"
    )
    parser.add_argument(
        '--profile',
        type=str,
        help="Convert single profile by name (e.g., ronaldReagan)"
    )
    parser.add_argument(
        '--output',
        type=str,
        choices=['json', 'database', 'preview'],
        default='preview',
        help="Output format: json (file), database (PostgreSQL), preview (console)"
    )
    parser.add_argument(
        '--output-file',
        type=str,
        default='profile_chunks.json',
        help="Output JSON file path (when --output=json)"
    )
    parser.add_argument(
        '--chunk-size',
        type=int,
        default=1000,
        help="Target chunk size in characters"
    )
    parser.add_argument(
        '--overlap',
        type=int,
        default=200,
        help="Overlap between chunks (20%% = 200)"
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help="List files without processing"
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        default=True,
        help="Verbose output"
    )

    args = parser.parse_args()

    converter = ProfileConverter(
        profiles_dir=args.profiles_dir,
        chunk_size=args.chunk_size,
        chunk_overlap=args.overlap
    )

    # Process profiles
    if args.profile:
        chunks = converter.convert_single_profile(args.profile, verbose=args.verbose)
    else:
        chunks = converter.convert_all_profiles(
            dry_run=args.dry_run,
            verbose=args.verbose
        )

    if args.dry_run:
        return

    # Output
    if args.output == 'json':
        output_path = Path(args.output_file)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(chunks, f, indent=2, ensure_ascii=False)
        print(f"\nSaved {len(chunks)} chunks to {output_path}")

    elif args.output == 'database':
        print("\nDatabase ingestion requires additional setup.")
        print("Use the BiographyIngester from ingestion/biography_ingester.py")
        print("Or run: python -m ingestion.biography_ingester --from-json profile_chunks.json")

    elif args.output == 'preview':
        print("\n" + "="*60)
        print("PREVIEW: First 3 chunks")
        print("="*60)
        for i, chunk in enumerate(chunks[:3]):
            print(f"\n--- Chunk {i+1} ---")
            print(f"Profile: {chunk['metadata'].get('profile_name')}")
            print(f"Section: {chunk['metadata'].get('section_title')}")
            print(f"Text preview: {chunk['text'][:200]}...")
            print(f"Word count: {chunk['metadata'].get('word_count')}")


if __name__ == "__main__":
    main()
