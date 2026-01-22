"""
P7 Archetype Narrative Templates
Story fragments and narrative descriptions for archetypes

Provides rich narrative content for archetype combinations,
supporting Luna's storytelling and self-understanding features.
"""

from typing import Dict, List, Optional, Tuple


# ============================================
# ARCHETYPE NARRATIVES
# ============================================
# Extended narrative descriptions for each archetype

ARCHETYPE_NARRATIVES = {
    'Hero': {
        'story_opening': 'Your journey is one of conquest and courage.',
        'life_theme': 'You are driven to prove your worth through achievement and overcoming obstacles. Each challenge is an opportunity to demonstrate your strength.',
        'strengths_narrative': 'Your natural courage allows you to face what others fear. You inspire those around you with your determination and willingness to fight for what matters.',
        'growth_narrative': 'Your path of growth involves learning that vulnerability is not weakness, and that true strength sometimes means accepting help.',
        'shadow_warning': 'Beware the temptation to see every situation as a battle. Not everything requires conquest, and constant proving can exhaust both you and those you love.',
        'relationships': 'In relationships, you are protective and loyal, but may struggle to let others take the lead or show your softer side.',
        'calling': 'You are called to champion causes greater than yourself and protect those who cannot protect themselves.'
    },

    'Caregiver': {
        'story_opening': 'Your heart beats to the rhythm of compassion.',
        'life_theme': 'You find meaning in nurturing and protecting others. Your life is a garden of relationships that you tend with devoted care.',
        'strengths_narrative': 'Your capacity for empathy and selfless giving creates deep bonds. You have the gift of making others feel truly seen and cared for.',
        'growth_narrative': 'Your growth involves learning to care for yourself with the same devotion you show others. Your cup must be filled to keep giving.',
        'shadow_warning': 'Be mindful of the martyr\'s trap - giving until empty, or using care as a way to control. Healthy relationships include receiving.',
        'relationships': 'In relationships, you are warm and supportive, but may need to learn to set boundaries and accept care in return.',
        'calling': 'You are called to create safe spaces where healing can happen and love can grow.'
    },

    'Creator': {
        'story_opening': 'You see the world as raw material for your vision.',
        'life_theme': 'Your life is an ongoing act of creation. Whether through art, ideas, or new ways of being, you are compelled to bring something new into existence.',
        'strengths_narrative': 'Your imagination knows no bounds. You see possibilities where others see limitations, and your creative vision can inspire entire movements.',
        'growth_narrative': 'Your growth path involves finishing what you start and accepting that imperfect creation is better than perfect imagination.',
        'shadow_warning': 'Watch for the perfectionist paralysis that keeps your visions trapped in your mind. Also beware of using drama to avoid the mundane work of creation.',
        'relationships': 'In relationships, you bring wonder and novelty, but may need grounding partners who appreciate your vision while providing stability.',
        'calling': 'You are called to birth new realities and show others what is possible.'
    },

    'Sage': {
        'story_opening': 'Truth is the north star of your existence.',
        'life_theme': 'You are on a lifelong quest for understanding. Knowledge is not just information to you - it is the path to wisdom and freedom.',
        'strengths_narrative': 'Your analytical mind cuts through confusion to find clarity. You offer perspective that helps others see their situations more clearly.',
        'growth_narrative': 'Your growth involves learning that wisdom includes the body and heart, not just the mind. Some truths are lived, not thought.',
        'shadow_warning': 'Guard against using knowledge as a shield from messy emotions, or becoming so detached that you lose touch with lived experience.',
        'relationships': 'In relationships, you offer thoughtful advice and meaningful conversation, but may need to remember that presence matters as much as understanding.',
        'calling': 'You are called to illuminate truth and guide others toward clearer understanding.'
    },

    'Lover': {
        'story_opening': 'Your heart is your compass, and connection is your destination.',
        'life_theme': 'You live for moments of deep connection and passionate experience. Life without love and beauty feels incomplete to you.',
        'strengths_narrative': 'Your capacity for deep feeling allows you to experience life\'s richness fully. You bring passion and appreciation that enlivens everything you touch.',
        'growth_narrative': 'Your growth involves learning that you are complete within yourself, and that attachment can coexist with healthy independence.',
        'shadow_warning': 'Be aware of losing yourself in others or making someone else responsible for your happiness. Love should add to your wholeness, not complete it.',
        'relationships': 'In relationships, you are devoted and passionate, capable of profound intimacy. You may need to ensure desire doesn\'t become dependency.',
        'calling': 'You are called to celebrate beauty and deepen the human capacity for love and connection.'
    },

    'Magician': {
        'story_opening': 'You understand that reality is more malleable than it appears.',
        'life_theme': 'You are a catalyst for change, transforming situations and people through your vision and will. You see how things connect and know how to shift them.',
        'strengths_narrative': 'Your ability to see patterns and possibilities allows you to create real change. You make things happen that others believe impossible.',
        'growth_narrative': 'Your growth involves ensuring your power serves a greater good, and learning that transformation cannot be forced - it must be invited.',
        'shadow_warning': 'Watch for the temptation to manipulate rather than transform, or to believe you know what\'s best for others without their input.',
        'relationships': 'In relationships, you are dynamic and transformative, but must be careful not to project your vision onto partners who need to find their own path.',
        'calling': 'You are called to facilitate transformation and help others discover their own power.'
    },

    'Ruler': {
        'story_opening': 'Order and excellence are not just ideals to you - they are responsibilities.',
        'life_theme': 'You are meant to lead, organize, and create structures that allow others to thrive. Taking charge feels natural and necessary.',
        'strengths_narrative': 'Your organizational ability and decisive nature create environments where things get done effectively. People look to you for direction and stability.',
        'growth_narrative': 'Your growth involves learning to lead through empowerment rather than control, and accepting that some chaos is creative.',
        'shadow_warning': 'Guard against the tyranny that comes from believing only you know the right way. Control masquerading as leadership damages trust.',
        'relationships': 'In relationships, you provide stability and direction, but must learn to share power and appreciate approaches different from your own.',
        'calling': 'You are called to create structures that bring out the best in people and serve the common good.'
    },

    'Rebel': {
        'story_opening': 'You were born to question what others accept without thought.',
        'life_theme': 'You cannot accept a status quo that feels wrong. Your life is a statement that things can and should be different.',
        'strengths_narrative': 'Your willingness to challenge convention opens doors that conformity keeps closed. You give others permission to think differently.',
        'growth_narrative': 'Your growth involves learning to build as well as break, and finding the discipline to sustain your revolutionary vision.',
        'shadow_warning': 'Be careful that rebellion doesn\'t become your only identity. Breaking rules for its own sake serves no higher purpose.',
        'relationships': 'In relationships, you bring excitement and authenticity, but may need partners who appreciate your independence while providing some grounding.',
        'calling': 'You are called to disrupt what needs disrupting and make space for new possibilities.'
    },

    'Explorer': {
        'story_opening': 'The horizon calls to you in ways others cannot hear.',
        'life_theme': 'You are on a quest to discover - new places, ideas, experiences, and ultimately, yourself. Staying in one place too long feels like dying.',
        'strengths_narrative': 'Your adventurous spirit discovers paths others never see. You bring fresh perspectives and the courage to venture into the unknown.',
        'growth_narrative': 'Your growth involves learning that depth can be as fulfilling as breadth, and that commitment to one thing can also be an adventure.',
        'shadow_warning': 'Watch for using exploration as an escape from intimacy or responsibility. The unexplored territory might be within you.',
        'relationships': 'In relationships, you bring excitement and discovery, but may need partners who can either travel with you or trust you to return.',
        'calling': 'You are called to push boundaries and show others that the world is larger than they imagined.'
    },

    'Innocent': {
        'story_opening': 'You carry a light that darkness cannot comprehend.',
        'life_theme': 'You believe in goodness - in people, in life, in the possibility of happy endings. This is not naivety but a choice to trust.',
        'strengths_narrative': 'Your optimism and faith are contagious. You have the gift of seeing the best in situations and people, which often brings out that best.',
        'growth_narrative': 'Your growth involves integrating wisdom with trust, learning that you can acknowledge darkness without losing your light.',
        'shadow_warning': 'Be aware of denying problems to maintain optimism. True faith can face reality without being diminished by it.',
        'relationships': 'In relationships, you bring joy and trust that creates safety. You may need partners who protect your innocence while gently introducing you to complexity.',
        'calling': 'You are called to remind a cynical world that goodness is real and trust is possible.'
    },

    'Jester': {
        'story_opening': 'Life is too important to be taken seriously.',
        'life_theme': 'You understand that joy, humor, and play are not escapes from life but portals to its deepest truths.',
        'strengths_narrative': 'Your humor and spontaneity break through pretense and pomposity. You have the gift of helping others lighten up and see the absurdity that makes life bearable.',
        'growth_narrative': 'Your growth involves learning when to be serious without losing your playful essence, and using humor to heal rather than to avoid.',
        'shadow_warning': 'Watch for using humor as a shield from intimacy or from dealing with difficult emotions. Some moments require earnestness.',
        'relationships': 'In relationships, you bring laughter and lightness, but may need partners who appreciate your playfulness while providing emotional depth.',
        'calling': 'You are called to bring joy, break tension, and remind people not to lose their sense of humor.'
    },

    'Orphan': {
        'story_opening': 'You have learned that life can hurt, and this knowledge makes you wise.',
        'life_theme': 'Having known disappointment and loss, you understand that safety must be created, not assumed. Your realism is hard-won wisdom.',
        'strengths_narrative': 'Your resilience and empathy come from having survived. You connect deeply with others\' struggles because you\'ve known your own.',
        'growth_narrative': 'Your growth involves trusting that the past doesn\'t determine the future, and that your wounds can become sources of compassion rather than caution.',
        'shadow_warning': 'Be careful not to let past hurts create a victim identity, or to expect disappointment so strongly that you create it.',
        'relationships': 'In relationships, you offer profound empathy and loyalty to those who prove themselves trustworthy. Building trust takes time.',
        'calling': 'You are called to show others that survival is possible and that wounds can become wisdom.'
    }
}


# ============================================
# COMBINATION NARRATIVES
# ============================================
# Special narratives for common archetype combinations

COMBINATION_NARRATIVES = {
    ('Hero', 'Caregiver'): {
        'title': 'The Guardian',
        'description': 'You combine the Hero\'s courage with the Caregiver\'s compassion, becoming a fierce protector of those you love.',
        'narrative': 'Your strength exists to serve others. You fight not for glory but to shield those who cannot shield themselves.'
    },
    ('Sage', 'Creator'): {
        'title': 'The Visionary',
        'description': 'You blend deep understanding with creative expression, turning wisdom into art and art into wisdom.',
        'narrative': 'Your insights take creative form, and your creations illuminate truth. You make the complex beautiful and accessible.'
    },
    ('Ruler', 'Magician'): {
        'title': 'The Transformer',
        'description': 'You combine leadership with the power to fundamentally change systems and people.',
        'narrative': 'You don\'t just manage - you transform. Under your guidance, organizations and people become more than they were.'
    },
    ('Explorer', 'Sage'): {
        'title': 'The Philosopher',
        'description': 'You seek wisdom through experience, understanding through adventure.',
        'narrative': 'Every journey teaches you something, and everything you learn inspires the next journey. The world is your classroom.'
    },
    ('Lover', 'Creator'): {
        'title': 'The Romantic Artist',
        'description': 'You channel passion into creation, making art from the depths of feeling.',
        'narrative': 'Love and beauty merge in your expression. Your creations pulse with emotional truth.'
    },
    ('Rebel', 'Hero'): {
        'title': 'The Revolutionary',
        'description': 'You fight against injustice with both courage and conviction.',
        'narrative': 'You don\'t just rebel - you stand for something. Your opposition creates space for better alternatives.'
    },
    ('Caregiver', 'Sage'): {
        'title': 'The Mentor',
        'description': 'You combine nurturing care with wise guidance.',
        'narrative': 'You help others grow through understanding and support. Your teaching comes from love.'
    },
    ('Jester', 'Innocent'): {
        'title': 'The Free Spirit',
        'description': 'You combine playfulness with pure-hearted optimism.',
        'narrative': 'Joy comes naturally to you, and you share it freely. The world seems brighter in your presence.'
    },
    ('Orphan', 'Caregiver'): {
        'title': 'The Wounded Healer',
        'description': 'Your own pain has taught you how to truly comfort others.',
        'narrative': 'Because you\'ve known suffering, you can sit with others in theirs. Your care is informed by experience.'
    },
    ('Magician', 'Creator'): {
        'title': 'The Alchemist',
        'description': 'You transform base materials into gold, whether literal or metaphorical.',
        'narrative': 'You see potential everywhere and have the power to actualize it. You create transformation.'
    }
}


# ============================================
# NARRATIVE FUNCTIONS
# ============================================

def get_archetype_narrative(archetype: str) -> Optional[Dict]:
    """
    Get full narrative content for an archetype.

    Args:
        archetype: Archetype name

    Returns:
        Dictionary with all narrative elements, or None if not found
    """
    return ARCHETYPE_NARRATIVES.get(archetype)


def get_combination_narrative(primary: str, secondary: str) -> Optional[Dict]:
    """
    Get narrative for an archetype combination.

    Args:
        primary: Primary archetype name
        secondary: Secondary archetype name

    Returns:
        Combination narrative dict or None
    """
    # Try both orderings
    key1 = (primary, secondary)
    key2 = (secondary, primary)

    return COMBINATION_NARRATIVES.get(key1) or COMBINATION_NARRATIVES.get(key2)


def generate_full_narrative(dominant_archetypes: List[Dict]) -> Dict:
    """
    Generate complete narrative from dominant archetypes list.

    Args:
        dominant_archetypes: List from get_dominant_archetypes()

    Returns:
        Full narrative package
    """
    if not dominant_archetypes:
        return {
            'title': 'The Balanced One',
            'opening': 'Your personality defies simple categorization.',
            'full_narrative': 'You embody a balance of many archetypal energies without any single one dominating.'
        }

    primary = dominant_archetypes[0]['archetype']
    primary_narrative = get_archetype_narrative(primary)

    result = {
        'title': primary,
        'opening': primary_narrative.get('story_opening', '') if primary_narrative else '',
        'life_theme': primary_narrative.get('life_theme', '') if primary_narrative else '',
        'strengths': primary_narrative.get('strengths_narrative', '') if primary_narrative else '',
        'growth': primary_narrative.get('growth_narrative', '') if primary_narrative else '',
        'shadow': primary_narrative.get('shadow_warning', '') if primary_narrative else '',
        'relationships': primary_narrative.get('relationships', '') if primary_narrative else '',
        'calling': primary_narrative.get('calling', '') if primary_narrative else ''
    }

    # Add combination narrative if strong secondary
    if len(dominant_archetypes) >= 2:
        secondary = dominant_archetypes[1]['archetype']
        combo = get_combination_narrative(primary, secondary)

        if combo:
            result['combination'] = combo
            result['title'] = combo.get('title', f"{primary}-{secondary}")
        else:
            result['secondary_influence'] = {
                'archetype': secondary,
                'narrative': get_archetype_narrative(secondary)
            }

    return result


def get_archetype_question_prompts(archetype: str) -> List[str]:
    """
    Get reflective questions for archetype exploration.

    Args:
        archetype: Archetype name

    Returns:
        List of reflective questions
    """
    prompts = {
        'Hero': [
            'What causes are worth fighting for in your life?',
            'How do you handle situations where strength isn\'t the answer?',
            'Who do you protect, and how does that feel?'
        ],
        'Caregiver': [
            'How do you care for yourself as well as others?',
            'When has giving felt depleting rather than fulfilling?',
            'What does receiving care feel like to you?'
        ],
        'Creator': [
            'What have you created that most represents who you are?',
            'What creative vision remains unmanifested?',
            'How do you handle the gap between vision and reality?'
        ],
        'Sage': [
            'What truth are you seeking right now?',
            'How do you balance thinking with feeling?',
            'What wisdom has life taught you?'
        ],
        'Lover': [
            'What does deep connection mean to you?',
            'How do you maintain yourself in intimate relationships?',
            'What beauty are you drawn to?'
        ],
        'Magician': [
            'What transformation are you facilitating in your life?',
            'How do you use your influence responsibly?',
            'What impossible thing have you made possible?'
        ],
        'Ruler': [
            'Where in life do you feel called to lead?',
            'How do you balance control with empowerment?',
            'What kind of order are you trying to create?'
        ],
        'Rebel': [
            'What are you rebelling against, and what for?',
            'How do you channel disruption constructively?',
            'What would you create if you could tear down everything?'
        ],
        'Explorer': [
            'What territory (inner or outer) calls to you now?',
            'What has exploration cost you? Given you?',
            'Where is home for you?'
        ],
        'Innocent': [
            'How do you maintain faith when faced with darkness?',
            'What has life taught you that hasn\'t diminished your hope?',
            'How do you share your light without losing it?'
        ],
        'Jester': [
            'What role does humor play in your most serious moments?',
            'When is play a path to truth, and when is it avoidance?',
            'How do you bring lightness to heavy situations?'
        ],
        'Orphan': [
            'How has your history of loss made you stronger?',
            'What would it mean to truly trust again?',
            'How does your pain inform your compassion?'
        ]
    }

    return prompts.get(archetype, [
        'How does this archetype show up in your daily life?',
        'What aspects of this archetype do you want to develop?',
        'How does this archetype serve or limit you?'
    ])
