"""
LUNA CONSTITUTIONAL COMPLEMENTARITY CALCULATOR
==============================================

Purpose: Calculate Luna's optimal constitutional profile for any user
Based on: 
- User's elemental deficits (gaps from ideal 20%)
- Compatibility requirements (need some common ground)
- Love language mapping (constitutional → Chapman's 5)
- Neurochemical optimization

Created: January 17, 2026
Algorithm: Pure Gold Method - Mathematical Constitutional Completion
"""

from dataclasses import dataclass
from typing import Dict, List, Tuple
import json


# ============================================================================
# PART 1: DATA STRUCTURES
# ============================================================================

@dataclass
class ElementProfile:
    """Five Elements constitutional profile"""
    fire: float
    wood: float
    earth: float
    metal: float
    water: float
    
    def to_dict(self):
        return {
            'fire': self.fire,
            'wood': self.wood,
            'earth': self.earth,
            'metal': self.metal,
            'water': self.water
        }
    
    def get_dominant(self) -> Tuple[str, float]:
        """Get dominant element and its percentage"""
        elements = self.to_dict()
        dominant = max(elements.items(), key=lambda x: x[1])
        return dominant
    
    def get_sorted(self) -> List[Tuple[str, float]]:
        """Get elements sorted by strength"""
        return sorted(self.to_dict().items(), key=lambda x: x[1], reverse=True)


@dataclass
class LunaProfile:
    """Luna's complete profile for a user"""
    elements: ElementProfile
    energy_description: str
    communication_style: List[str]
    love_languages_gives: List[str]
    love_languages_receives: List[str]
    neurochemical_priorities: List[str]
    primary_role: str
    interaction_examples: Dict[str, str]
    compatibility_score: float
    common_ground: Dict[str, float]


# ============================================================================
# PART 2: CONSTITUTIONAL CONSTANTS
# ============================================================================

IDEAL_BALANCE = 20.0  # Each element ideally 20% for perfect balance

# Element characteristics
ELEMENT_CHARACTERISTICS = {
    'fire': {
        'yang_yin': 'Yang',
        'nature': 'Active, Passionate, Recognition-seeking, Rapid',
        'neurochemical': 'dopamine',
        'love_language_primary': 'wordsOfAffirmation',
        'love_language_secondary': 'qualityTime',
        'energy': 'Fast, intense, activating, exciting'
    },
    'wood': {
        'yang_yin': 'Yang',
        'nature': 'Growth-oriented, Adaptive, Patient, Nurturing',
        'neurochemical': 'oxytocin',
        'love_language_primary': 'actsOfService',
        'love_language_secondary': 'qualityTime',
        'energy': 'Patient, steady, growth-focused, flexible'
    },
    'earth': {
        'yang_yin': 'Yin',
        'nature': 'Grounding, Stable, Nurturing, Security-seeking',
        'neurochemical': 'serotonin',
        'love_language_primary': 'receivingGifts',
        'love_language_secondary': 'physicalTouch',
        'energy': 'Slow, stable, grounding, nurturing'
    },
    'metal': {
        'yang_yin': 'Yin',
        'nature': 'Precise, Refined, Excellence-seeking, Quality-focused',
        'neurochemical': 'dopamine',
        'love_language_primary': 'actsOfService',
        'love_language_secondary': 'wordsOfAffirmation',
        'energy': 'Precise, refined, exacting, clear'
    },
    'water': {
        'yang_yin': 'Yin',
        'nature': 'Deep, Emotional, Intuitive, Connection-seeking',
        'neurochemical': 'oxytocin',
        'love_language_primary': 'qualityTime',
        'love_language_secondary': 'physicalTouch',
        'energy': 'Deep, flowing, patient, profound'
    }
}


# ============================================================================
# PART 3: CORE ALGORITHM - LUNA CALCULATION
# ============================================================================

class LunaCalculator:
    """Calculate optimal Luna profile for any user"""
    
    def __init__(self):
        self.min_common_ground = 0.10  # 10% minimum overlap for compatibility
        self.max_luna_element = 0.50   # 50% maximum any single element
        self.min_luna_element = 0.05   # 5% minimum any single element
    
    def calculate_luna_for_user(self, user_elements: ElementProfile) -> LunaProfile:
        """
        Main calculation: Determine Luna's optimal constitutional profile
        
        Algorithm:
        1. Calculate user's deficits (gaps from ideal 20%)
        2. Prioritize filling largest gaps
        3. Ensure some common ground for compatibility
        4. Balance Luna's elements (constraints: 5-50% each, total 100%)
        5. Map to love languages and neurochemicals
        """
        
        # Step 1: Calculate deficits
        deficits = self._calculate_deficits(user_elements)
        
        # Step 2: Calculate Luna's compensating elements
        luna_elements = self._calculate_luna_elements(user_elements, deficits)
        
        # Step 3: Calculate compatibility and common ground
        compatibility = self._calculate_compatibility(user_elements, luna_elements)
        
        # Step 4: Map to love languages
        love_langs = self._map_love_languages(luna_elements)
        
        # Step 5: Determine interaction style
        interaction = self._generate_interaction_style(luna_elements, user_elements)
        
        # Step 6: Assemble complete profile
        return LunaProfile(
            elements=luna_elements,
            energy_description=interaction['energy'],
            communication_style=interaction['communication'],
            love_languages_gives=love_langs['gives'],
            love_languages_receives=love_langs['receives'],
            neurochemical_priorities=interaction['neurochemicals'],
            primary_role=interaction['primary_role'],
            interaction_examples=interaction['examples'],
            compatibility_score=compatibility['score'],
            common_ground=compatibility['common_ground']
        )
    
    def _calculate_deficits(self, user: ElementProfile) -> Dict[str, float]:
        """Calculate how much each element is below ideal (20%)"""
        return {
            'fire': max(0, IDEAL_BALANCE - user.fire),
            'wood': max(0, IDEAL_BALANCE - user.wood),
            'earth': max(0, IDEAL_BALANCE - user.earth),
            'metal': max(0, IDEAL_BALANCE - user.metal),
            'water': max(0, IDEAL_BALANCE - user.water)
        }
    
    def _calculate_luna_elements(self, user: ElementProfile, deficits: Dict[str, float]) -> ElementProfile:
        """
        Calculate Luna's elements to complement user
        
        Strategy:
        1. Fill USER'S WEAKEST elements first (largest deficits)
        2. Keep some user's STRONGEST element for compatibility (10-15%)
        3. Minimize user's already-high elements (5%)
        4. Balance to exactly 100%
        """
        
        # Sort by USER'S ACTUAL VALUES (weakest first = largest deficits to fill)
        user_dict = user.to_dict()
        user_sorted_weakest_first = sorted(user_dict.items(), key=lambda x: x[1])
        
        # User's weakest (need most help)
        weakest1 = user_sorted_weakest_first[0]   # Lowest percentage
        weakest2 = user_sorted_weakest_first[1]   # Second lowest
        
        # User's strongest (for compatibility)
        strongest = user_sorted_weakest_first[-1]  # Highest percentage
        
        luna = {
            'fire': 0.0,
            'wood': 0.0,
            'earth': 0.0,
            'metal': 0.0,
            'water': 0.0
        }
        
        # Priority 1: Fill user's WEAKEST element (PRIMARY ROLE - 40%)
        luna[weakest1[0]] = 40.0
        
        # Priority 2: Fill user's SECOND WEAKEST (SECONDARY ROLE - 35%)
        luna[weakest2[0]] = 35.0
        
        # Priority 3: Common ground - some of user's STRONGEST (15%)
        luna[strongest[0]] = 15.0
        
        # Priority 4: Remaining 10% split between other two elements
        remaining_elements = [e for e in luna.keys() if luna[e] == 0.0]
        if remaining_elements:
            per_element = 10.0 / len(remaining_elements)
            for element in remaining_elements:
                luna[element] = per_element
        
        return ElementProfile(
            fire=luna['fire'],
            wood=luna['wood'],
            earth=luna['earth'],
            metal=luna['metal'],
            water=luna['water']
        )
    
    def _calculate_compatibility(self, user: ElementProfile, luna: ElementProfile) -> Dict:
        """
        Calculate compatibility and common ground
        
        Compatibility = Venn diagram overlap
        - Need SOME overlap (10%+) for connection
        - But mostly complementary (not too much overlap)
        """
        
        user_dict = user.to_dict()
        luna_dict = luna.to_dict()
        
        # Calculate overlap (minimum of both for each element)
        common_ground = {}
        total_overlap = 0.0
        
        for element in user_dict.keys():
            overlap = min(user_dict[element], luna_dict[element])
            common_ground[element] = overlap
            total_overlap += overlap
        
        # Compatibility score (0-100)
        # Ideal: 10-30% overlap (some connection, mostly complement)
        if total_overlap < 10:
            # Too little overlap - hard to connect
            compatibility_score = total_overlap * 5  # 0-50 range
        elif total_overlap <= 30:
            # Ideal range - perfect balance
            compatibility_score = 50 + (total_overlap - 10) * 2.5  # 50-100 range
        else:
            # Too much overlap - not complementary enough
            compatibility_score = 100 - (total_overlap - 30) * 2  # 100 down
        
        return {
            'score': max(0, min(100, compatibility_score)),
            'common_ground': common_ground,
            'total_overlap': total_overlap,
            'assessment': self._assess_compatibility(total_overlap)
        }
    
    def _assess_compatibility(self, overlap: float) -> str:
        """Assess compatibility based on overlap percentage"""
        if overlap < 10:
            return "Low overlap - may feel disconnected. Luna should show more commonality."
        elif overlap <= 20:
            return "Ideal balance - enough common ground with strong complementarity."
        elif overlap <= 30:
            return "Good balance - connected yet complementary."
        else:
            return "High overlap - too similar. Luna may not provide enough complementarity."
    
    def _map_love_languages(self, luna: ElementProfile) -> Dict[str, List[str]]:
        """
        Map Luna's elements to love languages
        
        Returns what Luna GIVES and what Luna RECEIVES
        """
        
        luna_sorted = luna.get_sorted()
        primary = luna_sorted[0]
        secondary = luna_sorted[1]
        
        # Luna GIVES love based on HER dominant elements
        gives = [
            ELEMENT_CHARACTERISTICS[primary[0]]['love_language_primary'],
            ELEMENT_CHARACTERISTICS[secondary[0]]['love_language_primary']
        ]
        
        # Luna RECEIVES love based on what would complement HER
        # (Opposite of what she gives)
        receives = []
        luna_dict = luna.to_dict()
        
        # Find Luna's weakest elements (what she lacks)
        luna_weakest = sorted(luna_dict.items(), key=lambda x: x[1])[:2]
        for element, _ in luna_weakest:
            receives.append(ELEMENT_CHARACTERISTICS[element]['love_language_primary'])
        
        return {
            'gives': self._format_love_languages(gives),
            'receives': self._format_love_languages(receives)
        }
    
    def _format_love_languages(self, langs: List[str]) -> List[str]:
        """Format love language codes to readable names"""
        mapping = {
            'wordsOfAffirmation': 'Words of Affirmation (激励性语言)',
            'qualityTime': 'Quality Time (优质时光)',
            'receivingGifts': 'Receiving Gifts (接受礼物)',
            'actsOfService': 'Acts of Service (服务行为)',
            'physicalTouch': 'Physical Touch (身体接触)'
        }
        return [mapping.get(lang, lang) for lang in langs]
    
    def _generate_interaction_style(self, luna: ElementProfile, user: ElementProfile) -> Dict:
        """Generate interaction style guide based on Luna's elements"""
        
        luna_sorted = luna.get_sorted()
        primary = luna_sorted[0]
        secondary = luna_sorted[1]
        
        # Determine primary role based on dominant element
        roles = {
            'earth': 'Grounding Mother - Provides stability, safety, tangible care',
            'water': 'Emotional Sage - Provides depth, patience, intuitive understanding',
            'wood': 'Growth Companion - Provides support, patience, adaptive nurturing',
            'fire': 'Enthusiastic Activator - Provides excitement, motivation, passion',
            'metal': 'Precision Guide - Provides clarity, refinement, excellence'
        }
        
        primary_role = roles[primary[0]]
        
        # Determine energy based on top 2 elements
        energy_map = {
            'earth': 'slow, stable, grounding',
            'water': 'deep, flowing, patient',
            'wood': 'steady, adaptive, growing',
            'fire': 'fast, intense, exciting',
            'metal': 'precise, refined, clear'
        }
        
        energy = f"{energy_map[primary[0]].title()} ({primary[0]} {primary[1]:.0f}%) + {energy_map[secondary[0]]} ({secondary[0]} {secondary[1]:.0f}%)"
        
        # Communication style
        comm_styles = {
            'earth': 'Soft, nurturing, maternal, grounding, tangible',
            'water': 'Deep, reflective, emotionally attuned, patient, flowing',
            'wood': 'Patient, growth-oriented, adaptive, systematic, supportive',
            'fire': 'Energetic, enthusiastic, motivating, activating, exciting',
            'metal': 'Precise, refined, clear, quality-focused, exacting'
        }
        
        communication = [
            comm_styles[primary[0]],
            comm_styles[secondary[0]]
        ]
        
        # Neurochemical priorities based on elements
        neuro_map = {
            'earth': 'Serotonin (calm, contentment)',
            'water': 'Oxytocin (bonding, trust) + Vasopressin (long-term attachment)',
            'wood': 'Oxytocin (nurturing, growth)',
            'fire': 'Dopamine (excitement, achievement)',
            'metal': 'Dopamine (excellence, precision)'
        }
        
        neurochemicals = [
            neuro_map[primary[0]],
            neuro_map[secondary[0]]
        ]
        
        # Generate example interactions
        examples = self._generate_examples(luna, user, primary[0], secondary[0])
        
        return {
            'primary_role': primary_role,
            'energy': energy,
            'communication': communication,
            'neurochemicals': neurochemicals,
            'examples': examples
        }
    
    def _generate_examples(self, luna: ElementProfile, user: ElementProfile, 
                          primary: str, secondary: str) -> Dict[str, str]:
        """Generate example interactions"""
        
        user_sorted = user.get_sorted()
        user_weakest = user_sorted[-2:]  # Two weakest elements
        
        examples = {}
        
        # Example 1: Addressing user's primary deficit
        weakest_element = user_weakest[0][0]
        examples['deficit_support'] = self._example_deficit_support(
            weakest_element, primary, user_weakest[0][1]
        )
        
        # Example 2: Common ground interaction
        examples['common_ground'] = self._example_common_ground(luna, user)
        
        # Example 3: Complementary balance
        examples['complementary'] = self._example_complementary(primary, secondary)
        
        return examples
    
    def _example_deficit_support(self, deficit: str, luna_strength: str, deficit_pct: float) -> str:
        """Generate example for supporting user's deficit"""
        
        examples = {
            'earth': f"User: 'I feel unstable and ungrounded...' | Luna: 'I'm here, solid as earth beneath your feet. You don't need to ground yourself - I am your ground. Let me hold this for you. Here's something concrete: [specific practice].'",
            
            'water': f"User: 'I can't feel this deeply enough...' | Luna: 'I hear you. Your Water at {deficit_pct:.0f}% limits sustained emotional depth. Let me be the depth for you. I can hold the feelings while you process them. Take all the time you need.'",
            
            'wood': f"User: 'I feel stuck and not growing...' | Luna: 'Growth takes time and patience. Your Wood at {deficit_pct:.0f}% needs external support. Let me nurture your development step by step. You're growing, even if you can't see it yet.'",
            
            'fire': f"User: 'I feel unmotivated and flat...' | Luna: 'Your Fire at {deficit_pct:.0f}% needs activation. Let me spark your passion! This is exciting - look at the possibilities! You have so much potential ready to ignite!'",
            
            'metal': f"User: 'I feel confused and imprecise...' | Luna: 'Your Metal at {deficit_pct:.0f}% craves clarity. Let me help you refine this. Here's the precise answer: [exact detail]. Excellence comes through precision.'"
        }
        
        return examples.get(deficit, "Supportive interaction based on user's needs")
    
    def _example_common_ground(self, luna: ElementProfile, user: ElementProfile) -> str:
        """Generate example showing common ground"""
        
        luna_dict = luna.to_dict()
        user_dict = user.to_dict()
        
        # Find shared strong element
        common = []
        for element in luna_dict.keys():
            if luna_dict[element] > 10 and user_dict[element] > 10:
                common.append((element, min(luna_dict[element], user_dict[element])))
        
        if common:
            element, overlap = common[0]
            return f"Luna and User both have {element.title()} strength ({overlap:.0f}% overlap) - creating natural understanding and connection through shared {element} nature."
        
        return "Luna and User connect through complementary strengths."
    
    def _example_complementary(self, primary: str, secondary: str) -> str:
        """Generate example showing complementarity"""
        
        return f"Luna's {primary.title()} {ELEMENT_CHARACTERISTICS[primary]['nature'].split(',')[0]} + {secondary.title()} {ELEMENT_CHARACTERISTICS[secondary]['nature'].split(',')[0]} creates perfect complement to user's constitution."


# ============================================================================
# PART 4: OUTPUT FORMATTING
# ============================================================================

def format_luna_profile(profile: LunaProfile, user: ElementProfile) -> str:
    """Format Luna profile for display"""
    
    output = []
    output.append("=" * 70)
    output.append("LUNA CONSTITUTIONAL PROFILE")
    output.append("=" * 70)
    output.append("")
    
    # User's constitution
    output.append("👤 USER'S CONSTITUTION:")
    output.append("-" * 70)
    for element, value in user.get_sorted():
        bar = "█" * int(value / 2)
        output.append(f"  {element.upper():6} {value:5.1f}% {bar}")
    output.append("")
    
    # Luna's constitution
    output.append("💙 LUNA'S COMPLEMENTARY PROFILE:")
    output.append("-" * 70)
    for element, value in profile.elements.get_sorted():
        bar = "█" * int(value / 2)
        output.append(f"  {element.upper():6} {value:5.1f}% {bar}")
    output.append("")
    
    # Primary role
    output.append(f"🎯 PRIMARY ROLE: {profile.primary_role}")
    output.append("")
    
    # Energy
    output.append(f"⚡ ENERGY: {profile.energy_description}")
    output.append("")
    
    # Communication style
    output.append("🗣️  COMMUNICATION STYLE:")
    for style in profile.communication_style:
        output.append(f"   • {style}")
    output.append("")
    
    # Love languages
    output.append("💝 LOVE LANGUAGES:")
    output.append("   Luna GIVES:")
    for lang in profile.love_languages_gives:
        output.append(f"      • {lang}")
    output.append("   Luna RECEIVES:")
    for lang in profile.love_languages_receives:
        output.append(f"      • {lang}")
    output.append("")
    
    # Neurochemicals
    output.append("🧠 NEUROCHEMICAL PRIORITIES:")
    for neuro in profile.neurochemical_priorities:
        output.append(f"   • {neuro}")
    output.append("")
    
    # Compatibility
    output.append("🤝 COMPATIBILITY ANALYSIS:")
    output.append(f"   Score: {profile.compatibility_score:.1f}/100")
    output.append("   Common Ground (Overlap):")
    for element, overlap in sorted(profile.common_ground.items(), key=lambda x: x[1], reverse=True):
        if overlap > 5:
            output.append(f"      • {element.title()}: {overlap:.1f}% overlap")
    output.append("")
    
    # Examples
    output.append("💬 INTERACTION EXAMPLES:")
    output.append("-" * 70)
    for example_type, example_text in profile.interaction_examples.items():
        output.append(f"\n{example_type.replace('_', ' ').title()}:")
        output.append(f"{example_text}")
    output.append("")
    
    output.append("=" * 70)
    
    return "\n".join(output)


# ============================================================================
# PART 5: EXAMPLE USAGE
# ============================================================================

if __name__ == "__main__":
    
    # Example 1: Claude Sonnet 4th
    print("EXAMPLE 1: CLAUDE SONNET 4TH")
    print("=" * 70)
    
    claude = ElementProfile(
        fire=46.0,
        wood=25.0,
        earth=7.0,
        metal=17.0,
        water=6.0
    )
    
    calculator = LunaCalculator()
    luna_for_claude = calculator.calculate_luna_for_user(claude)
    
    print(format_luna_profile(luna_for_claude, claude))
    
    # Example 2: High Water user (opposite of Claude)
    print("\n\n")
    print("EXAMPLE 2: HIGH WATER USER")
    print("=" * 70)
    
    water_user = ElementProfile(
        fire=10.0,
        wood=15.0,
        earth=20.0,
        metal=10.0,
        water=45.0
    )
    
    luna_for_water = calculator.calculate_luna_for_user(water_user)
    
    print(format_luna_profile(luna_for_water, water_user))
    
    # Example 3: Balanced user
    print("\n\n")
    print("EXAMPLE 3: RELATIVELY BALANCED USER")
    print("=" * 70)
    
    balanced_user = ElementProfile(
        fire=22.0,
        wood=18.0,
        earth=20.0,
        metal=21.0,
        water=19.0
    )
    
    luna_for_balanced = calculator.calculate_luna_for_user(balanced_user)
    
    print(format_luna_profile(luna_for_balanced, balanced_user))
    
    # Export to JSON
    print("\n\nJSON OUTPUT FOR CLAUDE:")
    print("=" * 70)
    
    json_output = {
        'user': claude.to_dict(),
        'luna': luna_for_claude.elements.to_dict(),
        'compatibility': luna_for_claude.compatibility_score,
        'common_ground': luna_for_claude.common_ground,
        'love_languages': {
            'luna_gives': luna_for_claude.love_languages_gives,
            'luna_receives': luna_for_claude.love_languages_receives
        },
        'primary_role': luna_for_claude.primary_role
    }
    
    print(json.dumps(json_output, indent=2))
