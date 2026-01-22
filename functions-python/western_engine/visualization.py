"""
western_engine/visualization.py

Visualization utilities for Western astrology pattern strengths.

Uses matplotlib to create charts for:
- Pattern strength bar charts
- Aspect wheel visualizations
- Compatibility radar charts
"""

from typing import List, Dict, Optional
from .models import PatternStrengths, DetectedAspect, PlanetPosition


def plot_pattern_strengths(
    pattern_strengths: PatternStrengths,
    title: str = "Aspect Pattern Strengths",
    save_path: Optional[str] = None
) -> None:
    """
    Plot aspect pattern strengths as a bar chart.

    Args:
        pattern_strengths: PatternStrengths object with strength values
        title: Chart title
        save_path: Optional path to save the figure (PNG, PDF, SVG)

    Example:
        >>> from western_engine import detect_patterns_from_swiss, plot_pattern_strengths
        >>> patterns = detect_patterns_from_swiss(swiss_planets, planets)
        >>> plot_pattern_strengths(patterns, title="Ronald Reagan's Aspect Patterns")
    """
    try:
        import matplotlib.pyplot as plt
    except ImportError:
        print("matplotlib not installed. Install with: pip install matplotlib")
        return

    labels = [
        "Grand Trine",
        "T-Square",
        "Stellium",
        "Yod",
        "Kite",
        "Opposition Chain",
    ]

    values = pattern_strengths.to_vector()

    # Color code by pattern type
    colors = [
        '#4CAF50',  # Green - Grand Trine (harmonious)
        '#F44336',  # Red - T-Square (challenging)
        '#2196F3',  # Blue - Stellium (concentrated)
        '#9C27B0',  # Purple - Yod (karmic)
        '#FF9800',  # Orange - Kite (creative flow)
        '#795548',  # Brown - Opposition Chain (tension)
    ]

    fig, ax = plt.subplots(figsize=(10, 5))

    bars = ax.bar(range(len(labels)), values, color=colors, edgecolor='black', linewidth=0.5)

    # Add value labels on top of bars
    for bar, val in zip(bars, values):
        if val > 0:
            ax.text(
                bar.get_x() + bar.get_width() / 2,
                bar.get_height() + 0.02,
                f'{val:.2f}',
                ha='center',
                va='bottom',
                fontsize=10,
                fontweight='bold'
            )

    ax.set_xticks(range(len(labels)))
    ax.set_xticklabels(labels, rotation=30, ha='right', fontsize=11)
    ax.set_ylim(0, 1.1)
    ax.set_ylabel("Strength (0-1)", fontsize=12)
    ax.set_title(title, fontsize=14, fontweight='bold')
    ax.axhline(y=0.5, color='gray', linestyle='--', alpha=0.5, label='Moderate threshold')
    ax.legend(loc='upper right')

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        print(f"Saved to {save_path}")
    else:
        plt.show()

    plt.close()


def plot_pattern_comparison(
    patterns_a: PatternStrengths,
    patterns_b: PatternStrengths,
    label_a: str = "Person A",
    label_b: str = "Person B",
    title: str = "Pattern Strength Comparison",
    save_path: Optional[str] = None
) -> None:
    """
    Compare pattern strengths between two charts as grouped bar chart.

    Args:
        patterns_a: PatternStrengths for first person
        patterns_b: PatternStrengths for second person
        label_a: Label for first person
        label_b: Label for second person
        title: Chart title
        save_path: Optional path to save the figure
    """
    try:
        import matplotlib.pyplot as plt
        import numpy as np
    except ImportError:
        print("matplotlib/numpy not installed")
        return

    labels = [
        "Grand Trine",
        "T-Square",
        "Stellium",
        "Yod",
        "Kite",
        "Opp Chain",
    ]

    values_a = patterns_a.to_vector()
    values_b = patterns_b.to_vector()

    x = np.arange(len(labels))
    width = 0.35

    fig, ax = plt.subplots(figsize=(10, 5))

    bars_a = ax.bar(x - width/2, values_a, width, label=label_a, color='#2196F3', alpha=0.8)
    bars_b = ax.bar(x + width/2, values_b, width, label=label_b, color='#FF5722', alpha=0.8)

    ax.set_ylabel('Strength')
    ax.set_title(title, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(labels, rotation=30, ha='right')
    ax.legend()
    ax.set_ylim(0, 1.1)

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
    else:
        plt.show()

    plt.close()


def plot_aspect_network(
    detected_aspects: List[DetectedAspect],
    planets: List[PlanetPosition],
    title: str = "Aspect Network",
    save_path: Optional[str] = None
) -> None:
    """
    Plot aspects as a network graph.

    Planets are nodes, aspects are edges with color/width based on type/tightness.

    Args:
        detected_aspects: List of DetectedAspect objects
        planets: List of PlanetPosition objects
        title: Chart title
        save_path: Optional path to save the figure
    """
    try:
        import matplotlib.pyplot as plt
        import numpy as np
    except ImportError:
        print("matplotlib/numpy not installed")
        return

    # Map aspect types to colors
    aspect_colors = {
        'conjunction': '#FFD700',  # Gold
        'opposition': '#FF0000',   # Red
        'trine': '#00FF00',        # Green
        'square': '#FF4500',       # Orange-Red
        'sextile': '#00BFFF',      # Sky Blue
        'quincunx': '#9932CC',     # Purple
    }

    # Get unique planet names
    planet_names = list(set(
        [a.planet1 for a in detected_aspects] +
        [a.planet2 for a in detected_aspects]
    ))

    if not planet_names:
        print("No aspects to plot")
        return

    n = len(planet_names)

    # Arrange planets in a circle
    angles = np.linspace(0, 2 * np.pi, n, endpoint=False)
    x = np.cos(angles)
    y = np.sin(angles)
    pos = {name: (x[i], y[i]) for i, name in enumerate(planet_names)}

    fig, ax = plt.subplots(figsize=(10, 10))

    # Draw edges (aspects)
    for asp in detected_aspects:
        if asp.planet1 in pos and asp.planet2 in pos:
            x_vals = [pos[asp.planet1][0], pos[asp.planet2][0]]
            y_vals = [pos[asp.planet1][1], pos[asp.planet2][1]]
            color = aspect_colors.get(asp.aspect_type, '#808080')
            width = 1 + asp.tightness * 3  # Thicker = tighter
            alpha = 0.3 + asp.tightness * 0.7
            ax.plot(x_vals, y_vals, color=color, linewidth=width, alpha=alpha)

    # Draw nodes (planets)
    for name, (px, py) in pos.items():
        ax.scatter(px, py, s=500, c='white', edgecolors='black', linewidth=2, zorder=5)
        ax.annotate(
            name[:3],  # First 3 chars
            (px, py),
            ha='center',
            va='center',
            fontsize=9,
            fontweight='bold',
            zorder=6
        )

    # Legend for aspect types
    from matplotlib.lines import Line2D
    legend_elements = [
        Line2D([0], [0], color=color, linewidth=2, label=asp_type.capitalize())
        for asp_type, color in aspect_colors.items()
        if any(a.aspect_type == asp_type for a in detected_aspects)
    ]
    ax.legend(handles=legend_elements, loc='upper right')

    ax.set_xlim(-1.5, 1.5)
    ax.set_ylim(-1.5, 1.5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title(title, fontsize=14, fontweight='bold')

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
    else:
        plt.show()

    plt.close()


def print_pattern_summary(
    pattern_strengths: PatternStrengths,
    name: str = "Chart"
) -> str:
    """
    Generate a text summary of pattern strengths.

    Args:
        pattern_strengths: PatternStrengths object
        name: Name for the chart

    Returns:
        Formatted text summary
    """
    lines = [
        f"═══════════════════════════════════════════",
        f"  ASPECT PATTERN ANALYSIS: {name}",
        f"═══════════════════════════════════════════",
        ""
    ]

    patterns = [
        ("Grand Trine", pattern_strengths.grand_trine, "Harmonious flow, natural talents"),
        ("T-Square", pattern_strengths.t_square, "Dynamic tension, drive for achievement"),
        ("Stellium", pattern_strengths.stellium, "Concentrated energy, focus area"),
        ("Yod", pattern_strengths.yod, "Karmic mission, special purpose"),
        ("Kite", pattern_strengths.kite, "Creative potential, directed flow"),
        ("Opposition Chain", pattern_strengths.opposition_chain, "Polarity integration needed"),
    ]

    for name, strength, meaning in patterns:
        if strength > 0:
            bar = "█" * int(strength * 20) + "░" * (20 - int(strength * 20))
            level = "STRONG" if strength > 0.7 else "MODERATE" if strength > 0.4 else "WEAK"
            lines.append(f"  {name:18} [{bar}] {strength:.2f} ({level})")
            lines.append(f"    → {meaning}")
            lines.append("")

    if all(s == 0 for s in pattern_strengths.to_vector()):
        lines.append("  No major aspect patterns detected.")

    lines.append("═══════════════════════════════════════════")

    return "\n".join(lines)
