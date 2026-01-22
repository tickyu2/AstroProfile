#!/usr/bin/env python3
"""
Biography Ingestion Script for GENESIS

Ingests PDF biographies into pgvector + Neo4j for RAG retrieval.

Usage:
    python ingest_biography.py reagan_biography.pdf historical_ronald_reagan "Ronald Reagan"
    python ingest_biography.py --batch biographies/  # Ingest all PDFs in folder

Environment Variables Required:
    DATABASE_URL=postgresql://user:pass@host:5432/genesis
    OPENAI_API_KEY=sk-...
    NEO4J_URI=bolt://...
    NEO4J_USER=neo4j
    NEO4J_PASSWORD=...
"""

import os
import sys
import argparse
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from ingestion import BiographyIngester, quick_ingest_biography


def ingest_single(pdf_path: str, profile_id: str, profile_name: str, dry_run: bool = False):
    """Ingest a single biography PDF."""

    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}")
        return False

    print(f"\n{'='*60}")
    print(f"GENESIS Biography Ingestion")
    print(f"{'='*60}")
    print(f"File: {pdf_path}")
    print(f"Profile ID: {profile_id}")
    print(f"Profile Name: {profile_name}")
    print(f"Dry Run: {dry_run}")
    print(f"{'='*60}\n")

    if dry_run:
        print("[DRY RUN] Would ingest with these settings. Use --execute to run.")
        return True

    try:
        # Initialize ingester
        ingester = BiographyIngester(
            neo4j_uri=os.environ.get("NEO4J_URI"),
            neo4j_user=os.environ.get("NEO4J_USER", "neo4j"),
            neo4j_password=os.environ.get("NEO4J_PASSWORD"),
            postgres_connection=os.environ.get("DATABASE_URL"),
            openai_api_key=os.environ.get("OPENAI_API_KEY")
        )

        # Ingest PDF
        result = ingester.ingest_pdf(
            pdf_path=pdf_path,
            profile_id=profile_id,
            profile_name=profile_name
        )

        print(f"\n{'='*60}")
        print("INGESTION COMPLETE")
        print(f"{'='*60}")
        print(f"Chunks created: {result.chunks_created}")
        print(f"Stored in pgvector: {result.chunks_stored_pgvector}")
        print(f"Stored in Neo4j: {result.chunks_stored_neo4j}")
        print(f"Errors: {len(result.errors)}")

        if result.errors:
            print("\nErrors encountered:")
            for err in result.errors[:5]:
                print(f"  - {err}")

        ingester.close()
        return True

    except Exception as e:
        print(f"\nError during ingestion: {e}")
        return False


def ingest_batch(folder_path: str, dry_run: bool = False):
    """Ingest all PDFs in a folder."""

    folder = Path(folder_path)
    if not folder.exists():
        print(f"Error: Folder not found: {folder_path}")
        return False

    pdfs = list(folder.glob("*.pdf"))
    if not pdfs:
        print(f"No PDF files found in: {folder_path}")
        return False

    print(f"\n{'='*60}")
    print(f"BATCH INGESTION")
    print(f"{'='*60}")
    print(f"Folder: {folder_path}")
    print(f"PDFs found: {len(pdfs)}")
    print(f"{'='*60}\n")

    # Map filename patterns to profile info
    PROFILE_MAP = {
        "reagan": ("historical_ronald_reagan", "Ronald Reagan"),
        "nancy": ("historical_nancy_reagan", "Nancy Reagan"),
        "carter": ("historical_jimmy_carter", "Jimmy Carter"),
        "rosalynn": ("historical_rosalynn_carter", "Rosalynn Carter"),
        "obama": ("historical_barack_obama", "Barack Obama"),
        "michelle": ("historical_michelle_obama", "Michelle Obama"),
        "thatcher": ("historical_margaret_thatcher", "Margaret Thatcher"),
        "gorbachev": ("historical_mikhail_gorbachev", "Mikhail Gorbachev"),
        "einstein": ("historical_albert_einstein", "Albert Einstein"),
        "dolly": ("modern_dolly_parton", "Dolly Parton"),
        "ronaldo": ("modern_cristiano_ronaldo", "Cristiano Ronaldo"),
        "beckham": ("modern_david_beckham", "David Beckham"),
    }

    results = []

    for pdf in pdfs:
        filename = pdf.stem.lower()

        # Try to match filename to profile
        profile_id = None
        profile_name = None

        for key, (pid, pname) in PROFILE_MAP.items():
            if key in filename:
                profile_id = pid
                profile_name = pname
                break

        if not profile_id:
            print(f"Skipping {pdf.name} - no matching profile (add to PROFILE_MAP)")
            continue

        print(f"\nProcessing: {pdf.name} -> {profile_name}")

        if dry_run:
            print(f"  [DRY RUN] Would ingest as {profile_id}")
            results.append((pdf.name, True, "dry run"))
        else:
            success = ingest_single(str(pdf), profile_id, profile_name, dry_run=False)
            results.append((pdf.name, success, None))

    # Summary
    print(f"\n{'='*60}")
    print("BATCH SUMMARY")
    print(f"{'='*60}")

    succeeded = sum(1 for _, s, _ in results if s)
    failed = len(results) - succeeded

    print(f"Processed: {len(results)}")
    print(f"Succeeded: {succeeded}")
    print(f"Failed: {failed}")

    return failed == 0


def main():
    parser = argparse.ArgumentParser(
        description="Ingest biography PDFs into GENESIS RAG system",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Single file
  python ingest_biography.py reagan.pdf historical_ronald_reagan "Ronald Reagan"

  # Batch (auto-detect profiles from filenames)
  python ingest_biography.py --batch biographies/

  # Dry run (preview without ingesting)
  python ingest_biography.py --dry-run reagan.pdf historical_ronald_reagan "Ronald Reagan"

Environment:
  DATABASE_URL       PostgreSQL connection string
  OPENAI_API_KEY     OpenAI API key for embeddings
  NEO4J_URI          Neo4j connection URI
  NEO4J_USER         Neo4j username
  NEO4J_PASSWORD     Neo4j password
        """
    )

    parser.add_argument("pdf_path", nargs="?", help="Path to PDF file")
    parser.add_argument("profile_id", nargs="?", help="Profile ID (e.g., historical_ronald_reagan)")
    parser.add_argument("profile_name", nargs="?", help="Profile name (e.g., Ronald Reagan)")
    parser.add_argument("--batch", metavar="FOLDER", help="Batch ingest all PDFs in folder")
    parser.add_argument("--dry-run", action="store_true", help="Preview without ingesting")
    parser.add_argument("--execute", action="store_true", help="Actually execute (default is dry-run)")

    args = parser.parse_args()

    # Validate environment
    required_env = ["DATABASE_URL", "OPENAI_API_KEY"]
    missing = [e for e in required_env if not os.environ.get(e)]

    if missing and not args.dry_run:
        print(f"Error: Missing environment variables: {', '.join(missing)}")
        print("Set these or use --dry-run to preview")
        sys.exit(1)

    dry_run = args.dry_run or not args.execute

    if args.batch:
        success = ingest_batch(args.batch, dry_run=dry_run)
    elif args.pdf_path and args.profile_id and args.profile_name:
        success = ingest_single(args.pdf_path, args.profile_id, args.profile_name, dry_run=dry_run)
    else:
        parser.print_help()
        sys.exit(1)

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
