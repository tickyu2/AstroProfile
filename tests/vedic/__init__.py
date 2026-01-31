"""
Vedic Astrology Test Suite

Comprehensive test coverage for Vedic astrological calculations:
- Lagna (Ascendant) calculations
- Nakshatra (lunar mansion) calculations
- Graha (planetary) positions
- Dignity (exaltation/debilitation) states
- Vimshottari Dasha timelines
- Vedic compatibility analysis
- Polarity archetype classification

Test Vectors: 108+ canonical cases
Coverage Targets:
- Lagna sign and nakshatra determination
- Moon nakshatra (Janma Nakshatra) with pada and lord
- 9 Graha positions across all dignities
- Complete Vimshottari Dasha sequence (120 years)
- Guna, Dosha, and Nakshatra compatibility
- Polarity archetype classification and evolution

Run tests:
    pytest tests/vedic/ -v

Run specific module:
    pytest tests/vedic/test_nakshatra.py -v

Run with coverage:
    pytest tests/vedic/ --cov=functions_python --cov-report=html
"""

__version__ = "1.0.0"
