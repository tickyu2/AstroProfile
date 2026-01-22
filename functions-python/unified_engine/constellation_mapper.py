"""
unified_engine/constellation_mapper.py

ConstellationMapper - Maps unified vectors into similarity graphs and clusters.

Creates "soul family" constellations by:
1. Computing pairwise similarities between unified vectors
2. Building similarity graphs with configurable thresholds
3. Detecting clusters of highly compatible profiles
4. Identifying central/peripheral positions in the constellation

This enables:
- Soul family discovery
- Match recommendations
- Group compatibility analysis
- Network visualization data
"""

from typing import Dict, List, Tuple, Optional, Any, Set
from dataclasses import dataclass, field
from collections import defaultdict
import math

from .unified_expression import (
    UnifiedExpressionVector,
    unified_expression_similarity,
)


# =============================================================================
# CONSTANTS
# =============================================================================

# Default similarity thresholds
DEFAULT_STRONG_THRESHOLD = 0.80   # Strong connection
DEFAULT_MODERATE_THRESHOLD = 0.65  # Moderate connection
DEFAULT_WEAK_THRESHOLD = 0.50      # Weak connection

# Cluster detection parameters
MIN_CLUSTER_SIZE = 2
MAX_CLUSTER_DEPTH = 5


# =============================================================================
# DATA STRUCTURES
# =============================================================================

@dataclass
class Edge:
    """An edge in the constellation graph."""
    source_id: str
    target_id: str
    similarity: float
    strength: str  # "strong", "moderate", "weak"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "source": self.source_id,
            "target": self.target_id,
            "similarity": round(self.similarity, 4),
            "strength": self.strength,
        }


@dataclass
class Node:
    """A node in the constellation graph."""
    id: str
    label: str
    sign: str
    day_master: str
    degree: int  # Number of connections
    weighted_degree: float  # Sum of edge similarities
    cluster_id: Optional[int]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "label": self.label,
            "sign": self.sign,
            "day_master": self.day_master,
            "degree": self.degree,
            "weighted_degree": round(self.weighted_degree, 4),
            "cluster_id": self.cluster_id,
        }


@dataclass
class Cluster:
    """A cluster of highly connected profiles."""
    id: int
    member_ids: List[str]
    center_id: str  # Most connected member
    average_similarity: float
    label: str  # e.g., "Fire-dominant cluster"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "members": self.member_ids,
            "center": self.center_id,
            "average_similarity": round(self.average_similarity, 4),
            "label": self.label,
            "size": len(self.member_ids),
        }


@dataclass
class ConstellationGraph:
    """Complete constellation graph with nodes, edges, and clusters."""
    nodes: List[Node]
    edges: List[Edge]
    clusters: List[Cluster]

    # Statistics
    total_profiles: int
    total_edges: int
    average_similarity: float
    density: float  # Ratio of actual to possible edges

    def to_dict(self) -> Dict[str, Any]:
        return {
            "nodes": [n.to_dict() for n in self.nodes],
            "edges": [e.to_dict() for e in self.edges],
            "clusters": [c.to_dict() for c in self.clusters],
            "statistics": {
                "total_profiles": self.total_profiles,
                "total_edges": self.total_edges,
                "average_similarity": round(self.average_similarity, 4),
                "density": round(self.density, 4),
            },
        }


@dataclass
class MatchRecommendation:
    """A match recommendation from the constellation."""
    profile_id: str
    profile_label: str
    similarity: float
    strength: str
    reasons: List[str]  # Why this match
    shared_cluster: bool

    def to_dict(self) -> Dict[str, Any]:
        return {
            "profile_id": self.profile_id,
            "label": self.profile_label,
            "similarity": round(self.similarity, 4),
            "strength": self.strength,
            "reasons": self.reasons,
            "shared_cluster": self.shared_cluster,
        }


# =============================================================================
# CONSTELLATION MAPPER
# =============================================================================

class ConstellationMapper:
    """
    Maps unified vectors into similarity graphs and clusters.

    Usage:
        mapper = ConstellationMapper()
        mapper.add_profile("alice", expr_alice, "Alice")
        mapper.add_profile("bob", expr_bob, "Bob")
        graph = mapper.build_graph()
        recommendations = mapper.get_recommendations("alice", limit=5)
    """

    def __init__(
        self,
        strong_threshold: float = DEFAULT_STRONG_THRESHOLD,
        moderate_threshold: float = DEFAULT_MODERATE_THRESHOLD,
        weak_threshold: float = DEFAULT_WEAK_THRESHOLD,
    ):
        """
        Initialize the constellation mapper.

        Args:
            strong_threshold: Similarity for strong connection
            moderate_threshold: Similarity for moderate connection
            weak_threshold: Minimum similarity to include edge
        """
        self.strong_threshold = strong_threshold
        self.moderate_threshold = moderate_threshold
        self.weak_threshold = weak_threshold

        # Profile storage
        self.profiles: Dict[str, UnifiedExpressionVector] = {}
        self.labels: Dict[str, str] = {}

        # Cached similarity matrix
        self._similarity_matrix: Dict[Tuple[str, str], float] = {}
        self._matrix_dirty = True

    def add_profile(
        self,
        profile_id: str,
        expr: UnifiedExpressionVector,
        label: Optional[str] = None,
    ) -> None:
        """
        Add a profile to the constellation.

        Args:
            profile_id: Unique identifier for the profile
            expr: UnifiedExpressionVector for the profile
            label: Optional human-readable label
        """
        self.profiles[profile_id] = expr
        self.labels[profile_id] = label or profile_id
        self._matrix_dirty = True

    def remove_profile(self, profile_id: str) -> bool:
        """
        Remove a profile from the constellation.

        Args:
            profile_id: ID of profile to remove

        Returns:
            True if removed, False if not found
        """
        if profile_id in self.profiles:
            del self.profiles[profile_id]
            del self.labels[profile_id]
            self._matrix_dirty = True
            return True
        return False

    def get_similarity(
        self,
        id_a: str,
        id_b: str,
    ) -> Optional[float]:
        """
        Get similarity between two profiles.

        Args:
            id_a: First profile ID
            id_b: Second profile ID

        Returns:
            Similarity score or None if profiles not found
        """
        if id_a not in self.profiles or id_b not in self.profiles:
            return None

        self._ensure_matrix_computed()

        key = (min(id_a, id_b), max(id_a, id_b))
        return self._similarity_matrix.get(key, 0.5)

    def _ensure_matrix_computed(self) -> None:
        """Compute similarity matrix if needed."""
        if not self._matrix_dirty:
            return

        self._similarity_matrix = {}
        profile_ids = list(self.profiles.keys())

        for i, id_a in enumerate(profile_ids):
            for id_b in profile_ids[i+1:]:
                sim = unified_expression_similarity(
                    self.profiles[id_a],
                    self.profiles[id_b]
                )
                key = (min(id_a, id_b), max(id_a, id_b))
                self._similarity_matrix[key] = sim

        self._matrix_dirty = False

    def _classify_strength(self, similarity: float) -> str:
        """Classify similarity into strength category."""
        if similarity >= self.strong_threshold:
            return "strong"
        elif similarity >= self.moderate_threshold:
            return "moderate"
        elif similarity >= self.weak_threshold:
            return "weak"
        else:
            return "none"

    def build_graph(
        self,
        min_threshold: Optional[float] = None,
    ) -> ConstellationGraph:
        """
        Build the constellation graph from all profiles.

        Args:
            min_threshold: Minimum similarity for edge (default: weak_threshold)

        Returns:
            ConstellationGraph with nodes, edges, and clusters
        """
        self._ensure_matrix_computed()

        threshold = min_threshold or self.weak_threshold

        # Build edges
        edges = []
        node_degrees: Dict[str, int] = defaultdict(int)
        node_weighted: Dict[str, float] = defaultdict(float)

        for (id_a, id_b), sim in self._similarity_matrix.items():
            if sim >= threshold:
                strength = self._classify_strength(sim)
                edges.append(Edge(
                    source_id=id_a,
                    target_id=id_b,
                    similarity=sim,
                    strength=strength,
                ))
                node_degrees[id_a] += 1
                node_degrees[id_b] += 1
                node_weighted[id_a] += sim
                node_weighted[id_b] += sim

        # Build nodes
        nodes = []
        for profile_id, expr in self.profiles.items():
            nodes.append(Node(
                id=profile_id,
                label=self.labels.get(profile_id, profile_id),
                sign=expr.sign,
                day_master=expr.day_master,
                degree=node_degrees.get(profile_id, 0),
                weighted_degree=node_weighted.get(profile_id, 0.0),
                cluster_id=None,  # Will be assigned later
            ))

        # Detect clusters
        clusters = self._detect_clusters(nodes, edges)

        # Assign cluster IDs to nodes
        node_cluster_map = {}
        for cluster in clusters:
            for member_id in cluster.member_ids:
                node_cluster_map[member_id] = cluster.id

        for node in nodes:
            node.cluster_id = node_cluster_map.get(node.id)

        # Calculate statistics
        n = len(self.profiles)
        max_edges = n * (n - 1) // 2 if n > 1 else 1
        avg_sim = (
            sum(self._similarity_matrix.values()) / len(self._similarity_matrix)
            if self._similarity_matrix else 0.0
        )

        return ConstellationGraph(
            nodes=nodes,
            edges=edges,
            clusters=clusters,
            total_profiles=n,
            total_edges=len(edges),
            average_similarity=avg_sim,
            density=len(edges) / max_edges if max_edges > 0 else 0.0,
        )

    def _detect_clusters(
        self,
        nodes: List[Node],
        edges: List[Edge],
    ) -> List[Cluster]:
        """
        Detect clusters of highly connected profiles.

        Uses simple connected components on strong edges.
        """
        # Build adjacency for strong edges only
        adjacency: Dict[str, Set[str]] = defaultdict(set)
        for edge in edges:
            if edge.strength == "strong":
                adjacency[edge.source_id].add(edge.target_id)
                adjacency[edge.target_id].add(edge.source_id)

        # Find connected components
        visited = set()
        clusters = []
        cluster_id = 0

        for node in nodes:
            if node.id in visited:
                continue
            if node.id not in adjacency:
                continue

            # BFS to find component
            component = set()
            queue = [node.id]

            while queue:
                current = queue.pop(0)
                if current in visited:
                    continue
                visited.add(current)
                component.add(current)

                for neighbor in adjacency.get(current, []):
                    if neighbor not in visited:
                        queue.append(neighbor)

            # Create cluster if large enough
            if len(component) >= MIN_CLUSTER_SIZE:
                members = list(component)

                # Find center (highest weighted degree)
                center = max(
                    members,
                    key=lambda m: sum(
                        self._similarity_matrix.get(
                            (min(m, n), max(m, n)), 0
                        )
                        for n in members if n != m
                    )
                )

                # Calculate average internal similarity
                internal_sims = [
                    self._similarity_matrix.get((min(a, b), max(a, b)), 0)
                    for i, a in enumerate(members)
                    for b in members[i+1:]
                ]
                avg_sim = sum(internal_sims) / len(internal_sims) if internal_sims else 0

                # Generate label
                label = self._generate_cluster_label(members)

                clusters.append(Cluster(
                    id=cluster_id,
                    member_ids=members,
                    center_id=center,
                    average_similarity=avg_sim,
                    label=label,
                ))
                cluster_id += 1

        return clusters

    def _generate_cluster_label(self, member_ids: List[str]) -> str:
        """Generate a descriptive label for a cluster."""
        # Count dominant signs
        signs = [self.profiles[m].sign for m in member_ids if self.profiles[m].sign]
        if signs:
            dominant_sign = max(set(signs), key=signs.count)
            return f"{dominant_sign}-anchored cluster"

        # Count dominant day masters
        dms = [self.profiles[m].day_master for m in member_ids if self.profiles[m].day_master]
        if dms:
            dominant_dm = max(set(dms), key=dms.count)
            return f"{dominant_dm}-element cluster"

        return f"Cluster of {len(member_ids)}"

    def get_recommendations(
        self,
        profile_id: str,
        limit: int = 5,
        min_similarity: Optional[float] = None,
    ) -> List[MatchRecommendation]:
        """
        Get match recommendations for a profile.

        Args:
            profile_id: ID of profile to get recommendations for
            limit: Maximum number of recommendations
            min_similarity: Minimum similarity (default: moderate_threshold)

        Returns:
            List of MatchRecommendation sorted by similarity
        """
        if profile_id not in self.profiles:
            return []

        self._ensure_matrix_computed()

        threshold = min_similarity or self.moderate_threshold
        recommendations = []

        # Get all similarities for this profile
        for other_id in self.profiles:
            if other_id == profile_id:
                continue

            key = (min(profile_id, other_id), max(profile_id, other_id))
            sim = self._similarity_matrix.get(key, 0)

            if sim >= threshold:
                strength = self._classify_strength(sim)
                reasons = self._generate_match_reasons(profile_id, other_id, sim)

                # Check if in same cluster
                graph = self.build_graph()
                shared_cluster = False
                for cluster in graph.clusters:
                    if profile_id in cluster.member_ids and other_id in cluster.member_ids:
                        shared_cluster = True
                        break

                recommendations.append(MatchRecommendation(
                    profile_id=other_id,
                    profile_label=self.labels.get(other_id, other_id),
                    similarity=sim,
                    strength=strength,
                    reasons=reasons,
                    shared_cluster=shared_cluster,
                ))

        # Sort by similarity descending
        recommendations.sort(key=lambda r: r.similarity, reverse=True)
        return recommendations[:limit]

    def _generate_match_reasons(
        self,
        id_a: str,
        id_b: str,
        similarity: float,
    ) -> List[str]:
        """Generate reasons for a match recommendation."""
        reasons = []
        expr_a = self.profiles[id_a]
        expr_b = self.profiles[id_b]

        # Sign compatibility
        if expr_a.sign and expr_b.sign:
            reasons.append(f"{expr_a.sign}-{expr_b.sign} connection")

        # Day Master compatibility
        if expr_a.day_master and expr_b.day_master:
            reasons.append(f"{expr_a.day_master}-{expr_b.day_master} elemental dynamic")

        # Similarity level
        if similarity >= self.strong_threshold:
            reasons.append("Deep soul resonance")
        elif similarity >= self.moderate_threshold:
            reasons.append("Natural understanding")

        return reasons


# =============================================================================
# CONVENIENCE FUNCTIONS
# =============================================================================

def build_constellation(
    profiles: Dict[str, Tuple[UnifiedExpressionVector, str]],
    min_threshold: float = DEFAULT_WEAK_THRESHOLD,
) -> ConstellationGraph:
    """
    Convenience function to build constellation from profile dict.

    Args:
        profiles: Dict mapping ID to (expression, label) tuple
        min_threshold: Minimum similarity for edges

    Returns:
        ConstellationGraph
    """
    mapper = ConstellationMapper()
    for profile_id, (expr, label) in profiles.items():
        mapper.add_profile(profile_id, expr, label)
    return mapper.build_graph(min_threshold)


def find_soul_family(
    target_expr: UnifiedExpressionVector,
    pool: Dict[str, UnifiedExpressionVector],
    min_similarity: float = DEFAULT_MODERATE_THRESHOLD,
    limit: int = 10,
) -> List[Tuple[str, float]]:
    """
    Find soul family members from a pool of profiles.

    Args:
        target_expr: Expression to find family for
        pool: Dict of profile_id -> expression
        min_similarity: Minimum similarity threshold
        limit: Maximum results

    Returns:
        List of (profile_id, similarity) tuples sorted by similarity
    """
    results = []

    for profile_id, expr in pool.items():
        sim = unified_expression_similarity(target_expr, expr)
        if sim >= min_similarity:
            results.append((profile_id, sim))

    results.sort(key=lambda x: x[1], reverse=True)
    return results[:limit]


# =============================================================================
# EXPORTS
# =============================================================================

__all__ = [
    # Main class
    "ConstellationMapper",

    # Data structures
    "ConstellationGraph",
    "Node",
    "Edge",
    "Cluster",
    "MatchRecommendation",

    # Convenience functions
    "build_constellation",
    "find_soul_family",

    # Constants
    "DEFAULT_STRONG_THRESHOLD",
    "DEFAULT_MODERATE_THRESHOLD",
    "DEFAULT_WEAK_THRESHOLD",
]
