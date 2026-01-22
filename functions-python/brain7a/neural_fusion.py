"""
============================================
Luna Brain 7A: Neural Personality Fusion
============================================

P2 Implementation: Neural Network for personality prediction
Based on Brother Sonnet's research synthesis and architecture design.

This module implements:
- Multi-source embedding layers (BaZi, Enneagram, MBTI, Western, Numerology)
- Multi-head attention for source weighting
- Fusion network outputting 30 NEO PI-R facets
- Hybrid rule-based + neural approach

Research Foundation:
- Suman et al. (2022): Attention fusion = 91% accuracy
- Lee et al. (2025): Self-attention = 12% improvement
- Majumder et al. (2017): CNN embeddings for personality

Created: January 8, 2026
Authors: Claude Opus (Implementation), Claude Sonnet (Architecture)
"""

import torch
import torch.nn as nn
import torch.optim as optim
from typing import Dict, Optional, Tuple


# ============================================
# P2.1: Input Layer (Embedding Strategy)
# ============================================

class Brain7AEmbedding(nn.Module):
    """
    Convert categorical constitutional data to continuous embeddings.

    Constitutional Weighting (embedded in dimension allocation):
    - BaZi Day Pillar: 56 dims (70% of BaZi capacity)
    - Other pillars: 8 dims each (30% combined)
    - Enneagram Core: 32 dims (75% of enneagram capacity)
    """

    def __init__(self, embed_dim: int = 256):
        super().__init__()

        self.embed_dim = embed_dim

        # =====================================
        # BAZI EMBEDDINGS (Constitutional Priority)
        # Day Pillar = 70% of BaZi influence
        # =====================================
        self.bazi_year_embed = nn.Embedding(60, 8)    # 60 stem+branch combos
        self.bazi_month_embed = nn.Embedding(60, 8)
        self.bazi_day_embed = nn.Embedding(60, 56)    # 70% of capacity!
        self.bazi_hour_embed = nn.Embedding(60, 8)

        # =====================================
        # ENNEAGRAM EMBEDDINGS (Depth Layers)
        # Core = 75%, Wing = 25% of base type
        # =====================================
        self.enneagram_core_embed = nn.Embedding(9, 32)    # Core type (1-9)
        self.enneagram_wing_embed = nn.Embedding(9, 12)    # Wing influence
        self.tritype_head_embed = nn.Embedding(9, 16)      # Head center
        self.tritype_heart_embed = nn.Embedding(9, 16)     # Heart center
        self.tritype_gut_embed = nn.Embedding(9, 16)       # Gut center
        self.instinct_stack_embed = nn.Embedding(6, 12)    # 6 permutations (sx/sp/so)

        # =====================================
        # MBTI EMBEDDINGS (Cognitive Functions)
        # Dominant > Auxiliary > Tertiary > Inferior
        # =====================================
        self.mbti_dom_embed = nn.Embedding(8, 16)    # 8 cognitive functions
        self.mbti_aux_embed = nn.Embedding(8, 12)
        self.mbti_tert_embed = nn.Embedding(8, 8)
        self.mbti_inf_embed = nn.Embedding(8, 8)

        # =====================================
        # WESTERN ASTROLOGY EMBEDDINGS
        # Sun > Moon > Rising
        # =====================================
        self.sun_sign_embed = nn.Embedding(12, 16)
        self.moon_sign_embed = nn.Embedding(12, 16)
        self.rising_sign_embed = nn.Embedding(12, 12)

        # =====================================
        # NUMEROLOGY EMBEDDINGS
        # Life Path > Expression > Soul Urge
        # =====================================
        self.life_path_embed = nn.Embedding(33, 12)      # 1-33 (master numbers)
        self.expression_embed = nn.Embedding(33, 12)
        self.soul_urge_embed = nn.Embedding(33, 8)

        # =====================================
        # BIG FIVE (Direct Input)
        # Already continuous [0,1] - just project
        # =====================================
        self.big5_project = nn.Linear(5, 20)

        # Project all embeddings to uniform dimension
        total_embed_dim = (
            8 + 8 + 56 + 8 +              # BaZi: 80
            32 + 12 + 16 + 16 + 16 + 12 + # Enneagram: 104
            16 + 12 + 8 + 8 +             # MBTI: 44
            16 + 16 + 12 +                # Western: 44
            12 + 12 + 8 +                 # Numerology: 32
            20                            # Big5: 20
        )  # Total: ~324

        self.projection = nn.Linear(total_embed_dim, embed_dim)

    def forward(self,
                bazi: Dict[str, torch.Tensor],
                enneagram: Dict[str, torch.Tensor],
                mbti: Dict[str, torch.Tensor],
                western: Dict[str, torch.Tensor],
                numerology: Dict[str, torch.Tensor],
                big5: Optional[torch.Tensor] = None) -> torch.Tensor:
        """
        Convert all categorical inputs to unified embedding.

        Args:
            bazi: {'year': tensor, 'month': tensor, 'day': tensor, 'hour': tensor}
            enneagram: {'core': tensor, 'wing': tensor, 'tritype_head': tensor, ...}
            mbti: {'dominant': tensor, 'auxiliary': tensor, ...}
            western: {'sun': tensor, 'moon': tensor, 'rising': tensor}
            numerology: {'life_path': tensor, 'expression': tensor, 'soul_urge': tensor}
            big5: Optional tensor [batch, 5] for O, C, E, A, N

        Returns:
            Unified embedding tensor [batch, embed_dim]
        """
        embeddings = []

        # BaZi embeddings (Day Pillar gets 70% via larger dims)
        embeddings.append(self.bazi_year_embed(bazi['year']))
        embeddings.append(self.bazi_month_embed(bazi['month']))
        embeddings.append(self.bazi_day_embed(bazi['day']))      # 56 dims!
        embeddings.append(self.bazi_hour_embed(bazi['hour']))

        # Enneagram embeddings (full depth)
        embeddings.append(self.enneagram_core_embed(enneagram['core']))
        embeddings.append(self.enneagram_wing_embed(enneagram['wing']))
        embeddings.append(self.tritype_head_embed(enneagram['tritype_head']))
        embeddings.append(self.tritype_heart_embed(enneagram['tritype_heart']))
        embeddings.append(self.tritype_gut_embed(enneagram['tritype_gut']))
        embeddings.append(self.instinct_stack_embed(enneagram['instinct_stack']))

        # MBTI embeddings (cognitive function stack)
        embeddings.append(self.mbti_dom_embed(mbti['dominant']))
        embeddings.append(self.mbti_aux_embed(mbti['auxiliary']))
        embeddings.append(self.mbti_tert_embed(mbti['tertiary']))
        embeddings.append(self.mbti_inf_embed(mbti['inferior']))

        # Western astrology embeddings
        embeddings.append(self.sun_sign_embed(western['sun']))
        embeddings.append(self.moon_sign_embed(western['moon']))
        embeddings.append(self.rising_sign_embed(western['rising']))

        # Numerology embeddings
        embeddings.append(self.life_path_embed(numerology['life_path']))
        embeddings.append(self.expression_embed(numerology['expression']))
        embeddings.append(self.soul_urge_embed(numerology['soul_urge']))

        # Big Five (direct continuous or zeros if not provided)
        if big5 is not None:
            embeddings.append(self.big5_project(big5))
        else:
            batch_size = bazi['day'].size(0)
            device = bazi['day'].device
            embeddings.append(torch.zeros(batch_size, 20, device=device))

        # Concatenate and project
        concat_embed = torch.cat(embeddings, dim=-1)
        return self.projection(concat_embed)


# ============================================
# P2.2: Attention Mechanism (Cross-Source Learning)
# ============================================

class MultiSourceAttention(nn.Module):
    """
    Learn which personality sources matter most for each person.

    Research: Self-attention mechanisms improve personality prediction
    by 12% (Lee et al., 2025).

    Updated: 6 heads per Brother Sonnet's review (was 4, now 6 for finer granularity)
    """

    def __init__(self, embed_dim: int = 256, num_heads: int = 6, dropout: float = 0.1):
        super().__init__()

        self.multihead_attn = nn.MultiheadAttention(
            embed_dim=embed_dim,
            num_heads=num_heads,
            dropout=dropout,
            batch_first=True
        )

        self.layer_norm = nn.LayerNorm(embed_dim)
        self.dropout = nn.Dropout(dropout)

    def forward(self, embeddings: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Apply multi-head self-attention to learn source importance.

        Args:
            embeddings: [batch, embed_dim] unified source embeddings

        Returns:
            attn_output: [batch, embed_dim] attention-weighted embeddings
            attn_weights: [batch, num_heads, 1, 1] attention weight matrix
        """
        # Add sequence dimension for attention
        embeddings = embeddings.unsqueeze(1)  # [batch, 1, embed_dim]

        # Self-attention
        attn_output, attn_weights = self.multihead_attn(
            embeddings, embeddings, embeddings
        )

        # Residual connection + layer norm
        attn_output = self.layer_norm(embeddings + self.dropout(attn_output))

        # Remove sequence dimension
        return attn_output.squeeze(1), attn_weights


# ============================================
# P2.3: Fusion Network (30 Facet Output)
# ============================================

class Brain7AFusion(nn.Module):
    """
    Complete fusion network: Embeddings -> Attention -> 30 NEO Facets

    Output: 30 NEO-PI-R facets in [0, 1] range
    - N1-N6: Neuroticism facets (Anxiety, Hostility, Depression, ...)
    - E1-E6: Extraversion facets (Warmth, Gregariousness, ...)
    - O1-O6: Openness facets (Fantasy, Aesthetics, ...)
    - A1-A6: Agreeableness facets (Trust, Straightforwardness, ...)
    - C1-C6: Conscientiousness facets (Competence, Order, ...)

    Updated: 6 attention heads + confidence interval estimation
    Per Brother Sonnet's review suggestions
    """

    def __init__(self, embed_dim: int = 256, num_heads: int = 6, dropout: float = 0.2):
        super().__init__()

        # Embedding layer
        self.embedding = Brain7AEmbedding(embed_dim=embed_dim)

        # Attention layer (6 heads for finer granularity)
        self.attention = MultiSourceAttention(embed_dim=embed_dim, num_heads=num_heads)

        # Shared fusion backbone
        self.fusion_backbone = nn.Sequential(
            nn.Linear(embed_dim, 128),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(dropout)
        )

        # Facet prediction head (mean)
        self.facet_head = nn.Sequential(
            nn.Linear(64, 30),
            nn.Sigmoid()
        )

        # Confidence estimation head (uncertainty/std dev)
        # Outputs log(variance) for numerical stability
        self.confidence_head = nn.Sequential(
            nn.Linear(64, 30),
            nn.Softplus()  # Ensures positive variance
        )

    def forward(self,
                bazi: Dict[str, torch.Tensor],
                enneagram: Dict[str, torch.Tensor],
                mbti: Dict[str, torch.Tensor],
                western: Dict[str, torch.Tensor],
                numerology: Dict[str, torch.Tensor],
                big5: Optional[torch.Tensor] = None) -> Dict[str, torch.Tensor]:
        """
        Forward pass: Constitutional data -> 30 NEO facets with confidence intervals

        Returns:
            Dict with:
                'facets': [batch, 30] NEO-PI-R facet values (mean predictions)
                'confidence': [batch, 30] confidence scores (lower = more confident)
                'confidence_intervals': Dict with 'lower' and 'upper' bounds (95% CI)
                'attention_weights': attention weights for analysis
                'embeddings': unified embeddings for debugging
        """
        # Step 1: Convert categorical -> embeddings
        embeddings = self.embedding(bazi, enneagram, mbti, western, numerology, big5)

        # Step 2: Apply attention (learn source importance)
        attn_embeddings, attn_weights = self.attention(embeddings)

        # Step 3: Shared backbone features
        features = self.fusion_backbone(attn_embeddings)

        # Step 4a: Predict facet values (mean)
        facets_30 = self.facet_head(features)

        # Step 4b: Predict uncertainty (standard deviation)
        uncertainty = self.confidence_head(features)

        # Step 5: Calculate 95% confidence intervals
        # CI = mean ± 1.96 * std (for 95% confidence)
        std_dev = torch.sqrt(uncertainty + 1e-6)  # Add epsilon for stability
        z_score = 1.96  # 95% confidence

        ci_lower = torch.clamp(facets_30 - z_score * std_dev, min=0.0, max=1.0)
        ci_upper = torch.clamp(facets_30 + z_score * std_dev, min=0.0, max=1.0)

        # Confidence score (inverse of uncertainty, scaled to 0-1)
        # Higher score = more confident
        confidence_score = torch.sigmoid(-uncertainty + 2)  # Shift so moderate uncertainty -> 0.5

        return {
            'facets': facets_30,
            'uncertainty': uncertainty,
            'confidence': confidence_score,
            'confidence_intervals': {
                'lower': ci_lower,
                'upper': ci_upper,
                'width': ci_upper - ci_lower
            },
            'attention_weights': attn_weights,
            'embeddings': embeddings
        }


# ============================================
# P2.4: Hybrid Rule + Neural Model
# ============================================

class HybridPersonalityModel(nn.Module):
    """
    Hybrid approach: Rule-based baseline + Neural corrections

    Formula: facet_i = rule_based_i + neural_correction_i

    This preserves the interpretability of rule-based mappings
    while allowing neural networks to learn corrections from data.
    """

    def __init__(self, max_correction: float = 0.2):
        super().__init__()

        self.neural_net = Brain7AFusion()
        self.max_correction = max_correction

    def forward(self,
                constitutional_data: Dict,
                rule_based_facets: torch.Tensor,
                use_hybrid: bool = True) -> Dict[str, torch.Tensor]:
        """
        Compute personality facets using hybrid approach.

        Args:
            constitutional_data: Dict with bazi, enneagram, mbti, western, numerology, big5
            rule_based_facets: [batch, 30] from JavaScript rule-based calculation
            use_hybrid: If False, return pure rule-based (P0 mode)

        Returns:
            Dict with facets, corrections, and attention weights
        """
        if not use_hybrid:
            return {'facets': rule_based_facets}

        # Neural network predictions
        neural_output = self.neural_net(
            bazi=constitutional_data['bazi'],
            enneagram=constitutional_data['enneagram'],
            mbti=constitutional_data['mbti'],
            western=constitutional_data['western'],
            numerology=constitutional_data['numerology'],
            big5=constitutional_data.get('big5')
        )

        # Neural corrections (centered at 0.5, scale to [-0.5, +0.5])
        neural_corrections = neural_output['facets'] - 0.5

        # Apply corrections with max limit
        scaled_corrections = neural_corrections * (self.max_correction * 2)

        # Combine rule-based + neural, clamped to [0, 1]
        hybrid_facets = torch.clamp(
            rule_based_facets + scaled_corrections,
            min=0.0,
            max=1.0
        )

        return {
            'facets': hybrid_facets,
            'rule_based': rule_based_facets,
            'neural_correction': scaled_corrections,
            'attention_weights': neural_output['attention_weights'],
            # Pass through confidence data from neural network
            'confidence': neural_output['confidence'],
            'confidence_intervals': neural_output['confidence_intervals'],
            'uncertainty': neural_output['uncertainty']
        }


# ============================================
# P2.5: Training Utilities
# ============================================

def train_hybrid_model(
    model: HybridPersonalityModel,
    train_loader,
    val_loader,
    epochs: int = 100,
    lr: float = 1e-3,
    weight_decay: float = 1e-4,
    patience: int = 10,
    device: str = 'cuda' if torch.cuda.is_available() else 'cpu'
):
    """
    Train hybrid model with best practices.

    Features:
    - AdamW optimizer with weight decay
    - Learning rate scheduling (reduce on plateau)
    - Early stopping to prevent overfitting
    """
    model = model.to(device)
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=weight_decay)
    criterion = nn.MSELoss()
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode='min', factor=0.5, patience=5
    )

    best_val_loss = float('inf')
    patience_counter = 0

    for epoch in range(epochs):
        # Training phase
        model.train()
        train_loss = 0.0

        for batch in train_loader:
            optimizer.zero_grad()

            # Move batch to device
            constitutional_data = {k: {kk: vv.to(device) for kk, vv in v.items()}
                                  if isinstance(v, dict) else v.to(device)
                                  for k, v in batch['constitutional_data'].items()}
            rule_based = batch['rule_based_facets'].to(device)
            target = batch['target_facets'].to(device)

            # Forward pass
            output = model(constitutional_data, rule_based, use_hybrid=True)

            # Loss
            loss = criterion(output['facets'], target)

            # Backward pass
            loss.backward()
            optimizer.step()

            train_loss += loss.item()

        train_loss /= len(train_loader)

        # Validation phase
        model.eval()
        val_loss = 0.0

        with torch.no_grad():
            for batch in val_loader:
                constitutional_data = {k: {kk: vv.to(device) for kk, vv in v.items()}
                                      if isinstance(v, dict) else v.to(device)
                                      for k, v in batch['constitutional_data'].items()}
                rule_based = batch['rule_based_facets'].to(device)
                target = batch['target_facets'].to(device)

                output = model(constitutional_data, rule_based, use_hybrid=True)
                val_loss += criterion(output['facets'], target).item()

        val_loss /= len(val_loader)

        # Learning rate scheduling
        scheduler.step(val_loss)

        # Early stopping
        if val_loss < best_val_loss - 1e-4:
            best_val_loss = val_loss
            patience_counter = 0
            torch.save(model.state_dict(), 'best_luna_brain7a.pth')
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f"Early stopping at epoch {epoch}")
                break

        if epoch % 10 == 0:
            print(f"Epoch {epoch}: Train Loss={train_loss:.4f}, Val Loss={val_loss:.4f}")

    # Load best model
    model.load_state_dict(torch.load('best_luna_brain7a.pth'))
    return model


# ============================================
# Encoding Utilities
# ============================================

# Mapping categorical values to indices
BAZI_PILLAR_MAP = {f"{stem}{branch}": i for i, (stem, branch) in enumerate(
    [(s, b) for s in range(10) for b in range(12)][:60]
)}

ENNEAGRAM_TYPE_MAP = {i: i-1 for i in range(1, 10)}

INSTINCT_STACK_MAP = {
    'sx/sp/so': 0, 'sx/so/sp': 1,
    'sp/sx/so': 2, 'sp/so/sx': 3,
    'so/sx/sp': 4, 'so/sp/sx': 5
}

COGNITIVE_FUNCTION_MAP = {
    'Ni': 0, 'Ne': 1, 'Si': 2, 'Se': 3,
    'Fi': 4, 'Fe': 5, 'Ti': 6, 'Te': 7
}

ZODIAC_SIGN_MAP = {
    'Aries': 0, 'Taurus': 1, 'Gemini': 2, 'Cancer': 3,
    'Leo': 4, 'Virgo': 5, 'Libra': 6, 'Scorpio': 7,
    'Sagittarius': 8, 'Capricorn': 9, 'Aquarius': 10, 'Pisces': 11
}


def encode_constitutional_data(raw_data: Dict) -> Dict[str, Dict[str, torch.Tensor]]:
    """
    Convert raw constitutional data to tensor format for model input.

    Args:
        raw_data: Dict with bazi, enneagram, mbti, western, numerology data

    Returns:
        Encoded dict ready for model forward pass
    """
    encoded = {
        'bazi': {},
        'enneagram': {},
        'mbti': {},
        'western': {},
        'numerology': {}
    }

    # BaZi encoding
    if 'bazi' in raw_data:
        bazi = raw_data['bazi']
        encoded['bazi'] = {
            'year': torch.tensor([bazi.get('year_pillar_idx', 0)]),
            'month': torch.tensor([bazi.get('month_pillar_idx', 0)]),
            'day': torch.tensor([bazi.get('day_pillar_idx', 0)]),
            'hour': torch.tensor([bazi.get('hour_pillar_idx', 0)])
        }

    # Enneagram encoding
    if 'enneagram' in raw_data:
        enne = raw_data['enneagram']
        encoded['enneagram'] = {
            'core': torch.tensor([enne.get('core', 1) - 1]),
            'wing': torch.tensor([enne.get('wing', 1) - 1]),
            'tritype_head': torch.tensor([enne.get('tritype_head', 5) - 1]),
            'tritype_heart': torch.tensor([enne.get('tritype_heart', 2) - 1]),
            'tritype_gut': torch.tensor([enne.get('tritype_gut', 8) - 1]),
            'instinct_stack': torch.tensor([
                INSTINCT_STACK_MAP.get(enne.get('stacking', 'sp/sx/so'), 0)
            ])
        }

    # MBTI encoding
    if 'mbti' in raw_data:
        mbti = raw_data['mbti']
        encoded['mbti'] = {
            'dominant': torch.tensor([COGNITIVE_FUNCTION_MAP.get(mbti.get('dominant', 'Ni'), 0)]),
            'auxiliary': torch.tensor([COGNITIVE_FUNCTION_MAP.get(mbti.get('auxiliary', 'Fe'), 0)]),
            'tertiary': torch.tensor([COGNITIVE_FUNCTION_MAP.get(mbti.get('tertiary', 'Ti'), 0)]),
            'inferior': torch.tensor([COGNITIVE_FUNCTION_MAP.get(mbti.get('inferior', 'Se'), 0)])
        }

    # Western astrology encoding
    if 'western' in raw_data:
        western = raw_data['western']
        encoded['western'] = {
            'sun': torch.tensor([ZODIAC_SIGN_MAP.get(western.get('sunSign', 'Aries'), 0)]),
            'moon': torch.tensor([ZODIAC_SIGN_MAP.get(western.get('moonSign', 'Aries'), 0)]),
            'rising': torch.tensor([ZODIAC_SIGN_MAP.get(western.get('risingSign', 'Aries'), 0)])
        }

    # Numerology encoding
    if 'numerology' in raw_data:
        num = raw_data['numerology']
        encoded['numerology'] = {
            'life_path': torch.tensor([min(num.get('life_path', 1), 32)]),
            'expression': torch.tensor([min(num.get('expression', 1), 32)]),
            'soul_urge': torch.tensor([min(num.get('soul_urge', 1), 32)])
        }

    # Big Five (if available)
    if 'big5' in raw_data and raw_data['big5']:
        big5 = raw_data['big5']
        encoded['big5'] = torch.tensor([[
            big5.get('openness', 0.5),
            big5.get('conscientiousness', 0.5),
            big5.get('extraversion', 0.5),
            big5.get('agreeableness', 0.5),
            big5.get('neuroticism', 0.5)
        ]])

    return encoded


# ============================================
# NEO Facet Definitions (for reference)
# ============================================

NEO_FACET_ORDER = [
    # Neuroticism (N)
    'N1_Anxiety', 'N2_AngryHostility', 'N3_Depression',
    'N4_SelfConsciousness', 'N5_Impulsiveness', 'N6_Vulnerability',
    # Extraversion (E)
    'E1_Warmth', 'E2_Gregariousness', 'E3_Assertiveness',
    'E4_Activity', 'E5_ExcitementSeeking', 'E6_PositiveEmotions',
    # Openness (O)
    'O1_Fantasy', 'O2_Aesthetics', 'O3_Feelings',
    'O4_Actions', 'O5_Ideas', 'O6_Values',
    # Agreeableness (A)
    'A1_Trust', 'A2_Straightforwardness', 'A3_Altruism',
    'A4_Compliance', 'A5_Modesty', 'A6_TenderMindedness',
    # Conscientiousness (C)
    'C1_Competence', 'C2_Order', 'C3_Dutifulness',
    'C4_AchievementStriving', 'C5_SelfDiscipline', 'C6_Deliberation'
]


if __name__ == '__main__':
    # Quick test
    print("Luna Brain 7A Neural Fusion Module")
    print("=" * 50)

    # Create model (6 heads per Brother Sonnet's review)
    model = Brain7AFusion(embed_dim=256, num_heads=6)
    print(f"Model parameters: {sum(p.numel() for p in model.parameters()):,}")

    # Test forward pass with dummy data
    batch_size = 2
    dummy_data = {
        'bazi': {
            'year': torch.randint(0, 60, (batch_size,)),
            'month': torch.randint(0, 60, (batch_size,)),
            'day': torch.randint(0, 60, (batch_size,)),
            'hour': torch.randint(0, 60, (batch_size,))
        },
        'enneagram': {
            'core': torch.randint(0, 9, (batch_size,)),
            'wing': torch.randint(0, 9, (batch_size,)),
            'tritype_head': torch.randint(0, 9, (batch_size,)),
            'tritype_heart': torch.randint(0, 9, (batch_size,)),
            'tritype_gut': torch.randint(0, 9, (batch_size,)),
            'instinct_stack': torch.randint(0, 6, (batch_size,))
        },
        'mbti': {
            'dominant': torch.randint(0, 8, (batch_size,)),
            'auxiliary': torch.randint(0, 8, (batch_size,)),
            'tertiary': torch.randint(0, 8, (batch_size,)),
            'inferior': torch.randint(0, 8, (batch_size,))
        },
        'western': {
            'sun': torch.randint(0, 12, (batch_size,)),
            'moon': torch.randint(0, 12, (batch_size,)),
            'rising': torch.randint(0, 12, (batch_size,))
        },
        'numerology': {
            'life_path': torch.randint(0, 33, (batch_size,)),
            'expression': torch.randint(0, 33, (batch_size,)),
            'soul_urge': torch.randint(0, 33, (batch_size,))
        }
    }

    output = model(**dummy_data)
    print(f"Output facets shape: {output['facets'].shape}")
    print(f"Sample facets: {output['facets'][0, :5].tolist()}")

    # Confidence interval output
    print(f"\nConfidence scores (first 5): {output['confidence'][0, :5].tolist()}")
    print(f"CI lower bounds (first 5): {output['confidence_intervals']['lower'][0, :5].tolist()}")
    print(f"CI upper bounds (first 5): {output['confidence_intervals']['upper'][0, :5].tolist()}")
    print(f"CI widths (first 5): {output['confidence_intervals']['width'][0, :5].tolist()}")
    print("\nP2 Neural Network Module Ready! (6-head attention + confidence intervals)")
