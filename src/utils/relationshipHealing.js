/**
 * Relationship Healing Engine
 * ===========================
 *
 * Based on Liz Greene's "Relating" - Chapter on Healing Relational Wounds
 *
 * "Every wound in relationship is an invitation to consciousness.
 * The place where we hurt each other most deeply is also the place
 * where we can heal each other most profoundly—if we choose awareness
 * over reactivity, compassion over blame."
 *
 * This engine provides:
 * - Luna-guided healing prompts for specific wounds
 * - Repair rituals tailored to planetary patterns
 * - Shadow integration practices
 * - Communication frameworks for difficult conversations
 * - Forgiveness pathways
 */

// ============================================================================
// WOUND PATTERNS BY PLANETARY CONFIGURATION
// ============================================================================

const WOUND_PATTERNS = {
  // Saturn wounds - Fear, Control, Restriction
  saturn: {
    sunSaturn: {
      wound: 'Identity Suppression',
      description: 'One or both partners feel their essential self is dimmed or controlled in the relationship',
      symptoms: [
        'Feeling unable to shine or be seen',
        'One partner dominates or criticizes',
        'Fear of being yourself fully',
        'Achievement/success feels blocked'
      ],
      rootCause: 'Father wound projection, authority complex, fear of failure',
      lunaHealing: `This wound says: "I can only be loved if I'm small." But your partner fell in love with your light. The control comes from fear—theirs or yours. Real safety comes not from making yourself smaller, but from both of you learning that bigness doesn't threaten love.`
    },

    moonSaturn: {
      wound: 'Emotional Coldness',
      description: 'Emotional needs feel unmet, intimacy blocked by walls',
      symptoms: [
        'Feeling emotionally starved',
        'Partner seems cold or unavailable',
        'Difficulty expressing vulnerability',
        'Nurturing feels conditional'
      ],
      rootCause: 'Mother wound, early emotional deprivation, fear of dependency',
      lunaHealing: `The walls between you aren't punishment—they're protection from very old pain. Someone here learned that being emotionally open meant being hurt. The healing isn't demanding the walls come down, but creating enough safety that they become unnecessary.`
    },

    venusSaturn: {
      wound: 'Love Blockage',
      description: 'Difficulty receiving or expressing love freely',
      symptoms: [
        'Love feels earned not given',
        'Physical affection is sparse',
        'Feeling unloved despite evidence',
        'Fear of expressing affection'
      ],
      rootCause: 'Conditional love in childhood, unworthiness core wound',
      lunaHealing: `There's a part of one of you that doesn't believe they deserve love. Every act of love feels suspicious because the inner voice says "If they really knew me, they wouldn't love me." The healing is radical acceptance—not of behavior, but of being.`
    },

    marsSaturn: {
      wound: 'Desire Suppression',
      description: 'Sexual energy or personal desires feel blocked or shamed',
      symptoms: [
        'Low sexual connection',
        'Anger turned inward as depression',
        'Feeling unable to assert needs',
        'Action feels forbidden'
      ],
      rootCause: 'Desire was punished in childhood, shame around wanting',
      lunaHealing: `Somewhere, someone learned that wanting things was dangerous. Desire itself became the enemy. But desire is life force. The healing is permission—true permission—to want, to ask, to reach for what you need without shame.`
    }
  },

  // Pluto wounds - Power, Control, Transformation
  pluto: {
    sunPluto: {
      wound: 'Power Struggle',
      description: 'Constant battle for control and dominance',
      symptoms: [
        'Everything becomes a fight',
        'Manipulation and control tactics',
        'Fear of vulnerability',
        'Cycles of destruction and intensity'
      ],
      rootCause: 'Powerlessness trauma, betrayal wounds, survival adaptations',
      lunaHealing: `The power struggle isn't about winning—it's about safety. Someone here learned that the only way to survive was to control everything. But there's another kind of power: the power of surrender, of trust, of choosing vulnerability. That's the power that heals.`
    },

    moonPluto: {
      wound: 'Emotional Manipulation',
      description: 'Deep emotional control dynamics, fear of being consumed',
      symptoms: [
        'Emotional blackmail patterns',
        'Possessiveness and jealousy',
        'Fear of emotional annihilation',
        'Intense cycles of closeness and distance'
      ],
      rootCause: 'Enmeshment trauma, mother wound, emotional boundary violations',
      lunaHealing: `The intensity here is both the wound and the medicine. Someone experienced love as consuming, overwhelming, dangerous. The healing is learning that closeness doesn't have to mean losing yourself—that two souls can touch without one disappearing.`
    },

    venusPluto: {
      wound: 'Obsessive Love',
      description: 'Love becomes possession, jealousy, or addiction',
      symptoms: [
        'Jealousy and possessiveness',
        'Love that feels like addiction',
        'Fear of abandonment driving control',
        'Intensity mistaken for depth'
      ],
      rootCause: 'Abandonment trauma, love-withdrawal punishment, insecure attachment',
      lunaHealing: `This love burns because it's trying to fill an unfillable void. The grip tightens because letting go feels like death. But here's the secret: what you're really afraid of losing isn't your partner—it's your own sense of worth. Heal that, and love becomes holding with open hands.`
    },

    marsPluto: {
      wound: 'Destructive Anger',
      description: 'Rage, violence, or destructive confrontations',
      symptoms: [
        'Explosive anger episodes',
        'Desire to hurt or be hurt',
        'Sexual aggression issues',
        'Power dynamics in physical intimacy'
      ],
      rootCause: 'Violence exposure, powerlessness rage, fight-or-flight stuck on',
      lunaHealing: `This rage is ancient. It comes from helplessness, from times when fighting was the only way to survive. The healing isn't suppression—that only builds pressure. The healing is finding safe containers for this fire, ways to honor the warrior without destruction.`
    }
  },

  // Neptune wounds - Illusion, Escapism, Idealization
  neptune: {
    sunNeptune: {
      wound: 'Identity Confusion',
      description: 'Losing oneself in the other, unclear boundaries',
      symptoms: [
        'Not knowing who you are in the relationship',
        'Taking on partner\'s identity',
        'Feeling like a chameleon',
        'Difficulty with individual expression'
      ],
      rootCause: 'Dissolved boundaries in childhood, spiritual bypassing, identity wounds',
      lunaHealing: `You learned to disappear to be loved. To become what others needed. But you can't truly connect from a dissolved self—there's no "you" there to connect. The healing is becoming solid enough to truly merge, separate enough to truly love.`
    },

    moonNeptune: {
      wound: 'Emotional Confusion',
      description: 'Unable to distinguish own feelings from partner\'s',
      symptoms: [
        'Absorbing partner\'s emotions',
        'Emotional overwhelm',
        'Difficulty knowing what you feel',
        'Rescuer-victim dynamics'
      ],
      rootCause: 'Emotional enmeshment, empathic overload, boundary dissolution',
      lunaHealing: `Your heart is so open it forgets which feelings are yours. This is a gift and a wound. The healing isn't closing your heart—it's learning the edges of your own soul so you can feel deeply without drowning.`
    },

    venusNeptune: {
      wound: 'Idealization/Disillusionment',
      description: 'Cycles of putting partner on pedestal and crashing down',
      symptoms: [
        'Partner can never live up to expectations',
        'Chasing a fantasy rather than real person',
        'Perpetual disappointment',
        'Longing for unavailable love'
      ],
      rootCause: 'Idealization as defense, disappointment avoidance, anima/animus projection',
      lunaHealing: `You fell in love with a dream. And dreams are beautiful, but they can't hold you at night. The human before you is flawed, limited, mortal—and therefore real, warm, present. Can you love what IS rather than what you imagined?`
    },

    marsNeptune: {
      wound: 'Passive Aggression',
      description: 'Anger expressed sideways, victimhood, or escapism',
      symptoms: [
        'Indirect expression of frustration',
        'Substance escape from conflict',
        'Playing victim in fights',
        'Disappearing rather than confronting'
      ],
      rootCause: 'Direct anger was punished, conflict phobia, martyrdom pattern',
      lunaHealing: `You learned that fighting back was forbidden, so your anger went underground. It comes out sideways, or drowns in substances, or plays the suffering saint. The healing is learning that anger expressed directly and cleanly is actually less destructive than anger denied.`
    }
  },

  // Uranus wounds - Freedom, Detachment, Disruption
  uranus: {
    sunUranus: {
      wound: 'Commitment Phobia',
      description: 'Fear of being trapped, need for constant freedom',
      symptoms: [
        'Running when things get close',
        'Needing excessive space',
        'Sabotaging stability',
        'Fear of losing individuality'
      ],
      rootCause: 'Engulfment trauma, freedom-love dichotomy, individuation wounds',
      lunaHealing: `Every commitment feels like a cage because somewhere you learned that being close meant losing yourself. But here's the truth: real freedom isn't running—it's being so secure in who you are that closeness doesn't threaten you. That's the freedom worth finding.`
    },

    moonUranus: {
      wound: 'Emotional Unavailability',
      description: 'Present one moment, gone the next, unable to sustain connection',
      symptoms: [
        'Hot and cold emotional patterns',
        'Disappearing during emotional needs',
        'Intellectualizing feelings',
        'Creating drama to escape intimacy'
      ],
      rootCause: 'Inconsistent early nurturing, emotional unpredictability trauma',
      lunaHealing: `Consistency feels dangerous because you never knew what you'd get. So you learned to not need, to leave before being left, to keep one foot out the door. The healing is risking consistency—showing up even when it's scary, staying even when you want to run.`
    },

    venusUranus: {
      wound: 'Love Instability',
      description: 'Attraction to unavailable love, boredom with stability',
      symptoms: [
        'Only attracted to what you can\'t have',
        'Bored once relationship is stable',
        'Seeking excitement over depth',
        'Multiple simultaneous attractions'
      ],
      rootCause: 'Love-freedom confusion, excitement addiction, unavailable parent pattern',
      lunaHealing: `Stability feels like death because you've confused aliveness with chaos. But there's another kind of excitement—the excitement of depth, of going further with one person than you've ever gone before. That adventure doesn't require leaving.`
    },

    marsUranus: {
      wound: 'Erratic Action',
      description: 'Unpredictable behavior, sudden departures, shock tactics',
      symptoms: [
        'Impulsive destructive actions',
        'Sudden unexplained exits',
        'Using shock to maintain control',
        'Inability to follow through'
      ],
      rootCause: 'Chaos as normalcy, unpredictability as survival, rebellion wounds',
      lunaHealing: `Predictability feels vulnerable because in chaos, no one can pin you down. But your partner isn't your enemy, and consistency isn't a trap. The healing is choosing to be reliable not from duty but from love—showing up because you want to, not because you have to.`
    }
  }
};

// ============================================================================
// REPAIR RITUALS
// ============================================================================

const REPAIR_RITUALS = {
  afterConflict: {
    name: 'The Repair Ritual',
    description: 'Restoring connection after a fight or rupture',
    when: 'After any significant conflict, when both parties have cooled down',
    steps: [
      {
        name: 'The Cooling Period',
        duration: '20+ minutes',
        instruction: 'Separate physically. Breathe. Let nervous system settle. No texting during this time.',
        purpose: 'Allow fight-or-flight to subside so wisdom can return'
      },
      {
        name: 'The Return Signal',
        duration: '1 minute',
        instruction: 'One person gives agreed-upon signal that they\'re ready (hand on heart, specific phrase)',
        purpose: 'Consent to reconnect, avoiding premature repair attempts'
      },
      {
        name: 'The Witness Round',
        duration: '10 minutes each',
        instruction: 'Each person shares their experience without interruption. Use "I felt..." not "You did..."',
        purpose: 'Being truly heard dissolves much of the charge'
      },
      {
        name: 'The Ownership',
        duration: '5 minutes each',
        instruction: 'Each person names one thing they could have done differently. No "but" allowed.',
        purpose: 'Taking responsibility breaks the blame cycle'
      },
      {
        name: 'The Bridge',
        duration: '5 minutes',
        instruction: 'Physical reconnection—hold hands, hug, eye contact. Let bodies remember love.',
        purpose: 'Nervous system co-regulation, embodied repair'
      }
    ],
    lunaGuidance: 'Repair isn\'t about who was right. It\'s about remembering that you\'re on the same team. The goal isn\'t winning the argument—it\'s winning back your connection.'
  },

  weeklyMaintenance: {
    name: 'The Weekly State of the Union',
    description: 'Regular maintenance to prevent buildup of resentments',
    when: 'Same time each week, non-negotiable appointment',
    steps: [
      {
        name: 'Appreciation Round',
        duration: '5 minutes each',
        instruction: 'Share three specific appreciations from the week. Be concrete: "I appreciated when you..."',
        purpose: 'Positive ratio maintenance, noticing the good'
      },
      {
        name: 'Weather Report',
        duration: '5 minutes each',
        instruction: 'Share your internal weather. "I\'ve been feeling..." No problem-solving, just witnessing.',
        purpose: 'Staying current with each other\'s inner life'
      },
      {
        name: 'Irritations Check',
        duration: '5 minutes each',
        instruction: 'Name any small irritations before they become big resentments. Receive without defense.',
        purpose: 'Clearing the pipe, preventing buildup'
      },
      {
        name: 'Desires/Requests',
        duration: '5 minutes each',
        instruction: 'Make one request for the coming week. Partner can negotiate but default is yes.',
        purpose: 'Keeping desires flowing rather than suppressing'
      },
      {
        name: 'Closing Ritual',
        duration: '2 minutes',
        instruction: 'End with a hug lasting at least 20 seconds (when oxytocin releases)',
        purpose: 'Embodied closure and bonding'
      }
    ],
    lunaGuidance: 'Small regular maintenance prevents the big breakdowns. It\'s easier to clear a clogged pipe than to replace it. This hour a week is your relationship\'s immune system.'
  },

  deepWoundHealing: {
    name: 'The Wound Healing Ceremony',
    description: 'For processing a significant betrayal or deep hurt',
    when: 'When something major has happened that shook the foundation',
    steps: [
      {
        name: 'Create Sacred Space',
        duration: '5 minutes',
        instruction: 'Light a candle. Turn off phones. This is ceremony, not conversation.',
        purpose: 'Signals to psyche that something important is happening'
      },
      {
        name: 'The Hurt Person Speaks',
        duration: 'As needed',
        instruction: 'The wounded party shares the full impact. The other only witnesses. No defense, no explanation.',
        purpose: 'Full expression and witnessing of the wound'
      },
      {
        name: 'The Impact Reflection',
        duration: '5-10 minutes',
        instruction: 'The one who caused harm reflects back what they heard. "I hear that my action caused you to feel..."',
        purpose: 'Proof of being heard, validation of experience'
      },
      {
        name: 'The Responsibility',
        duration: '5-10 minutes',
        instruction: 'The one who caused harm takes full responsibility without excuse. "I did this. It was wrong. I\'m sorry."',
        purpose: 'Clean accountability without defense'
      },
      {
        name: 'The Repair Offer',
        duration: '5 minutes',
        instruction: 'Ask: "What do you need from me now? What would help you heal?"',
        purpose: 'Agency returns to the wounded party'
      },
      {
        name: 'The Closing',
        duration: '5 minutes',
        instruction: 'If ready, wounded party shares what they\'re willing to move toward (not instant forgiveness, but willingness to try)',
        purpose: 'Bridge to rebuilding, however tentative'
      }
    ],
    lunaGuidance: 'Deep wounds take time to heal. This ceremony isn\'t the end of healing—it\'s the beginning. True repair often takes many conversations, much time. But it starts with being fully witnessed in your pain.'
  },

  forgivenessProcess: {
    name: 'The Forgiveness Practice',
    description: 'Working toward releasing resentment (for oneself, not the other)',
    when: 'When you\'re ready to put down the burden of anger, not before',
    steps: [
      {
        name: 'Acknowledge You\'re Not Ready',
        duration: 'As needed',
        instruction: 'If you\'re not ready, honor that. Premature forgiveness is suppression, not healing.',
        purpose: 'Forgiveness can\'t be forced'
      },
      {
        name: 'Feel the Full Weight',
        duration: '15-20 minutes',
        instruction: 'Write out everything—the rage, the hurt, the desire for revenge. Get it all out.',
        purpose: 'What\'s not expressed can\'t be released'
      },
      {
        name: 'The Cost Accounting',
        duration: '10 minutes',
        instruction: 'Write: What has holding this resentment cost me? Energy, peace, joy, health?',
        purpose: 'Recognizing the burden you carry'
      },
      {
        name: 'The Human Complexity',
        duration: '10 minutes',
        instruction: 'Write: What was their pain, their history, their wound that led to this action? (Not excuse, but context)',
        purpose: 'Seeing the other as human, not monster'
      },
      {
        name: 'The Release Statement',
        duration: '5 minutes',
        instruction: 'Write and speak: "I release you from the debt of my pain. Not because you deserve it, but because I deserve peace."',
        purpose: 'Forgiveness as self-liberation'
      },
      {
        name: 'The Ongoing Practice',
        duration: 'Daily',
        instruction: 'When resentment returns (and it will), repeat: "I have chosen to put this down."',
        purpose: 'Forgiveness is often a process, not an event'
      }
    ],
    lunaGuidance: 'Forgiveness is not saying what they did was okay. It\'s saying you refuse to carry the poison anymore. It\'s a gift you give yourself, not them. And it often comes in layers—you may need to forgive the same thing many times.'
  }
};

// ============================================================================
// COMMUNICATION FRAMEWORKS
// ============================================================================

const COMMUNICATION_FRAMEWORKS = {
  nonviolentCommunication: {
    name: 'NVC Framework',
    description: 'Marshall Rosenberg\'s Nonviolent Communication adapted for couples',
    structure: {
      observation: {
        description: 'State what you observed without judgment',
        example: 'When I see dishes left in the sink for three days...',
        avoid: 'When you\'re so lazy and don\'t clean up...'
      },
      feeling: {
        description: 'Name your feeling (not your interpretation)',
        example: 'I feel frustrated and overwhelmed...',
        avoid: 'I feel like you don\'t care about me...'
      },
      need: {
        description: 'Identify the underlying need',
        example: 'Because I need order and shared responsibility...',
        avoid: 'Because you should do your fair share...'
      },
      request: {
        description: 'Make a specific, doable request',
        example: 'Would you be willing to do dishes before bed each night?',
        avoid: 'I need you to be more considerate.'
      }
    },
    lunaGuidance: 'The magic of NVC is that it separates observation from judgment, feeling from interpretation. Most fights happen in the land of interpretation. Come back to raw experience and suddenly there\'s nothing to fight about.'
  },

  gottmanRepair: {
    name: 'Gottman Repair Attempts',
    description: 'Phrases that de-escalate conflict (from relationship research)',
    categories: {
      selfSoothing: [
        'I need to calm down.',
        'Can we take a break?',
        'I\'m feeling flooded right now.',
        'Let me try again more gently.'
      ],
      appreciation: [
        'I know this isn\'t your fault.',
        'I can see your point here.',
        'You\'re making sense.',
        'Thank you for listening to me.'
      ],
      responsibility: [
        'My part in this was...',
        'I could have done that differently.',
        'I\'m sorry for...',
        'Let me start over.'
      ],
      weAreTeam: [
        'We\'ll get through this.',
        'We\'re on the same side.',
        'I love you, even when we fight.',
        'This is hard, but we\'ve survived harder.'
      ],
      deEscalation: [
        'Can we slow down?',
        'I\'m starting to feel defensive.',
        'I don\'t want to fight.',
        'Can I hear that again?'
      ]
    },
    lunaGuidance: 'These phrases are relationship first-aid. Use them when you feel the conversation spiraling. The goal isn\'t to "win" the fight—it\'s to land the plane safely so you can try again.'
  },

  imago: {
    name: 'Imago Dialogue',
    description: 'Deep listening technique from Harville Hendrix',
    structure: {
      mirroring: {
        description: 'Repeat back what you heard',
        prompt: 'Let me see if I got that. You said...',
        followUp: 'Did I get that? Is there more?'
      },
      validation: {
        description: 'Affirm the logic of their perspective',
        prompt: 'That makes sense because...',
        note: 'You don\'t have to agree to validate'
      },
      empathy: {
        description: 'Imagine their feeling',
        prompt: 'I imagine you might be feeling...',
        followUp: 'Is that what you\'re feeling?'
      }
    },
    lunaGuidance: 'Most of the time we listen to respond, not to understand. Imago slows everything down. By the time you\'ve truly heard your partner, often the fight is over—because what they really needed was to be understood.'
  }
};

// ============================================================================
// HEALING BY COMPOSITE PATTERN
// ============================================================================

const HEALING_BY_COMPOSITE = {
  // Healing for challenging composite aspects
  sunSquareMoon: {
    pattern: 'Sun square Moon in composite',
    wound: 'Core tension between identity and emotional needs',
    healing: {
      understanding: 'Your relationship has built-in creative tension. This isn\'t a flaw—it\'s fuel for growth.',
      practice: 'Each week, alternate who leads (Sun) and who supports (Moon). Neither role is permanent.',
      mantra: 'Our tension creates diamonds.',
      lunaGuidance: 'You chose each other precisely because this tension forces you both to grow. Easy relationships are comfortable but often stagnant. Yours is a forge.'
    }
  },

  moonSquareSaturn: {
    pattern: 'Moon square Saturn in composite',
    wound: 'Emotional needs feel blocked or judged',
    healing: {
      understanding: 'There\'s fear around vulnerability here. Safety must be consciously built.',
      practice: 'Daily 5-minute vulnerability practice: share one feeling without editing.',
      mantra: 'We create safety through presence, not protection.',
      lunaGuidance: 'Saturn guards the heart because the heart was hurt. The walls aren\'t punishment—they\'re protection. Your job isn\'t to tear them down but to make them unnecessary.'
    }
  },

  venusOppositionSaturn: {
    pattern: 'Venus opposite Saturn in composite',
    wound: 'Love feels conditional, withheld, or earned',
    healing: {
      understanding: 'One of you shows love through structure, the other through affection. Both are love.',
      practice: 'Learn each other\'s love language. The one who feels unloved probably isn\'t reading the signals.',
      mantra: 'Your structure is love. My affection is love. Both are real.',
      lunaGuidance: 'Saturn love looks different from Venus love. It shows up as reliability, commitment, showing up day after day. If you\'re looking for flowers, you might miss the foundation being built.'
    }
  },

  marsSquarePluto: {
    pattern: 'Mars square Pluto in composite',
    wound: 'Power struggles, control issues, intensity',
    healing: {
      understanding: 'This is enormous transformative energy. The question is: destruction or creation?',
      practice: 'Channel the intensity outward—shared challenges, physical exertion, creative projects.',
      mantra: 'Our power transforms, not destroys.',
      lunaGuidance: 'You have nuclear energy in your relationship. You can use it to power a city or blow it up. The energy itself is neutral—it\'s your consciousness that determines the outcome.'
    }
  },

  sunConjunctNeptune: {
    pattern: 'Sun conjunct Neptune in composite',
    wound: 'Identity confusion, savior dynamics, disillusionment',
    healing: {
      understanding: 'You share a dream—beautiful and dangerous. Ground the vision in daily reality.',
      practice: 'Daily reality checks: "What is true today?" without idealization or catastrophizing.',
      mantra: 'We are both human. We are both enough.',
      lunaGuidance: 'Neptune wants to merge into bliss. But you can\'t truly merge without two solid selves to merge. Keep your feet on the ground and your head can touch the stars.'
    }
  }
};

// ============================================================================
// LUNA HEALING DIALOGUES
// ============================================================================

const LUNA_HEALING_DIALOGUES = {
  afterBetrayal: {
    context: 'When trust has been broken',
    dialogue: `I know you're in pain. I know the ground beneath your relationship has shifted.

What happened was real. The wound is real. And I won't tell you to just "get over it" or "forgive and move on."

But I will tell you this: trust, once broken, can be rebuilt stronger than before—if both of you are willing to do the work. It's not about pretending the betrayal didn't happen. It's about building something new on the ashes of what was.

This will take time. Real time, not calendar time. There will be setbacks. There will be days when you think you've healed and then the pain comes flooding back. That's normal.

The question isn't whether you can ever trust again. The question is: Is this person showing you, through consistent action over time, that they've changed? Not words—anyone can apologize. Actions, repeated, consistent, even when no one's watching.

And for you, the work is learning to stay open even when closing feels safer. Because if you close your heart completely, you're not protecting yourself—you're imprisoning yourself.`
  },

  duringPowerStruggle: {
    context: 'When caught in escalating conflict',
    dialogue: `Stop. Both of you, stop.

You're not fighting about what you think you're fighting about. Underneath this argument is fear. Fear of not mattering. Fear of being controlled. Fear of being abandoned. Fear of being invisible.

The words coming out of your mouths are weapons, but the wounds they're aimed at are ancient. Your partner isn't your enemy—they're just the closest target when old pain gets triggered.

Here's what I want you to try: Instead of defending or attacking, say out loud: "I'm scared right now." That's it. Just those words.

Not "I'm scared because you..." That's still attacking. Just "I'm scared."

And then listen. What is your partner afraid of in this moment? Can you see past the armor to the frightened heart underneath?

You both want the same thing: to feel safe, to feel loved, to feel like you matter. You're just terrible at asking for it.`
  },

  feelingUnloved: {
    context: 'When love feels absent or withdrawn',
    dialogue: `You're starving in the middle of a banquet, aren't you? Love is all around you, but you can't seem to take it in.

There are two possibilities here, and probably both are true:

One: Your partner is expressing love in a language you don't speak. They might be loving you through acts of service, through presence, through reliability—while you're waiting for words or touch. Ask them: "How do you show me you love me?" Then listen, really listen.

Two: There's a part of you that can't receive love. An old wound that says "I don't deserve this" or "If they really knew me, they wouldn't love me." So even when love is offered, you can't take it in.

The healing is both: learning to read your partner's love language AND doing the inner work to become receptive.

Love is like rain. It's falling all the time. The question is: is your cup right-side up?`
  },

  lostConnection: {
    context: 'When you feel like roommates instead of lovers',
    dialogue: `You used to look at each other across a room and feel electricity. Now you look at each other and see chores, schedules, the accumulation of small disappointments.

This is normal. And this is dangerous.

The passion didn't die—it got buried under the weight of life. Mortgages and children and careers and exhaustion. The urgent always crowds out the important.

But here's the truth: you're not going to "find time" for each other. You have to make it. Prioritize it like you prioritize everything else that matters.

Date nights aren't cute—they're essential maintenance. Physical touch isn't optional—it's how nervous systems co-regulate. Looking into each other's eyes isn't cheesy—it's how you remember you're not alone.

You didn't fall in love with a co-parent or a co-homeowner. You fell in love with a PERSON. When did you last see them? Really see them?`
  },

  consideringLeaving: {
    context: 'When one or both are thinking about ending it',
    dialogue: `You're standing at a crossroads. Every direction looks painful.

I won't tell you to stay. I won't tell you to go. But I will ask you some questions:

Have you actually tried? Not just endured, but actively worked on this relationship? Therapy, workshops, books, conscious effort?

Is the person you're thinking of leaving the person they actually are, or the person they were five years ago? People change. Sometimes we don't let them.

Are you running TO something, or just running AWAY? Because running away doesn't work. You bring yourself with you everywhere you go.

And finally: If you leave, can you honestly say you gave this your full effort? Not for them—for you. So you can move forward without the weight of "what if."

Sometimes relationships end. Sometimes they should. But make sure you're making a conscious choice, not an escape.`
  }
};

// ============================================================================
// MAIN HEALING ENGINE FUNCTION
// ============================================================================

/**
 * Build the relationship healing analysis
 *
 * @param {Object} compositeData - Composite chart data
 * @param {Object} synastryData - Synastry analysis data
 * @param {Object} currentChallenges - User-reported current challenges
 * @returns {Object} Complete healing analysis and guidance
 */
export function buildRelationshipHealing(compositeData, synastryData, currentChallenges = {}) {
  // Identify wound patterns from composite aspects
  const identifiedWounds = identifyWoundPatterns(compositeData, synastryData);

  // Select relevant repair rituals
  const relevantRituals = selectRelevantRituals(currentChallenges);

  // Get composite-specific healing guidance
  const compositeHealing = getCompositeHealing(compositeData);

  // Select Luna dialogue based on situation
  const lunaDialogue = selectLunaDialogue(currentChallenges);

  return {
    woundAnalysis: {
      primaryWounds: identifiedWounds.primary,
      secondaryWounds: identifiedWounds.secondary,
      rootPatterns: identifiedWounds.rootPatterns
    },

    healingPrescription: {
      rituals: relevantRituals,
      communicationFrameworks: selectCommunicationFrameworks(identifiedWounds),
      dailyPractices: generateDailyPractices(identifiedWounds),
      weeklyPractices: generateWeeklyPractices(identifiedWounds)
    },

    compositeHealingPath: compositeHealing,

    lunaGuidance: {
      currentSituation: lunaDialogue,
      woundSpecific: identifiedWounds.primary.map(w => w.lunaHealing),
      generalWisdom: generateGeneralWisdom(compositeData)
    },

    emergencyToolkit: {
      inConflict: [
        'Stop. Breathe. Say: "I need a 20-minute break."',
        'Put hand on heart. Feel your feet on the ground.',
        'Remember: This person is not your enemy.',
        'Ask yourself: What am I really afraid of right now?'
      ],
      feelingFlooded: [
        'Splash cold water on your face (activates dive reflex)',
        'Breathe out longer than you breathe in',
        'Name 5 things you can see, 4 you can hear, 3 you can touch',
        'Say: "I am safe. My nervous system is overreacting."'
      ],
      aboutToSaySomethingHurtful: [
        'Don\'t. Just don\'t.',
        'Words said in anger leave scars.',
        'What you\'re about to say is about your pain, not their character.',
        'Walk away. Come back when you can speak from love.'
      ]
    },

    healingResources: {
      books: [
        'Hold Me Tight - Sue Johnson',
        'Getting the Love You Want - Harville Hendrix',
        'Mating in Captivity - Esther Perel',
        'The Seven Principles for Making Marriage Work - John Gottman',
        'Attached - Amir Levine'
      ],
      approaches: [
        'Emotionally Focused Therapy (EFT)',
        'Imago Relationship Therapy',
        'Gottman Method Couples Therapy',
        'Internal Family Systems for Couples'
      ]
    },

    metadata: {
      generatedAt: new Date().toISOString(),
      framework: 'Liz Greene Relationship Healing',
      version: '1.0.0'
    }
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function identifyWoundPatterns(composite, synastry) {
  const wounds = { primary: [], secondary: [], rootPatterns: [] };

  // Check for Saturn aspects
  if (hasAspect(composite, 'sun', 'saturn')) {
    wounds.primary.push(WOUND_PATTERNS.saturn.sunSaturn);
    wounds.rootPatterns.push('Authority/identity wound');
  }
  if (hasAspect(composite, 'moon', 'saturn')) {
    wounds.primary.push(WOUND_PATTERNS.saturn.moonSaturn);
    wounds.rootPatterns.push('Nurturing/emotional wound');
  }
  if (hasAspect(composite, 'venus', 'saturn')) {
    wounds.secondary.push(WOUND_PATTERNS.saturn.venusSaturn);
  }

  // Check for Pluto aspects
  if (hasAspect(composite, 'sun', 'pluto')) {
    wounds.primary.push(WOUND_PATTERNS.pluto.sunPluto);
    wounds.rootPatterns.push('Power/control wound');
  }
  if (hasAspect(composite, 'moon', 'pluto')) {
    wounds.primary.push(WOUND_PATTERNS.pluto.moonPluto);
  }
  if (hasAspect(composite, 'venus', 'pluto')) {
    wounds.secondary.push(WOUND_PATTERNS.pluto.venusPluto);
  }

  // Check for Neptune aspects
  if (hasAspect(composite, 'sun', 'neptune')) {
    wounds.secondary.push(WOUND_PATTERNS.neptune.sunNeptune);
    wounds.rootPatterns.push('Boundary/illusion wound');
  }
  if (hasAspect(composite, 'venus', 'neptune')) {
    wounds.secondary.push(WOUND_PATTERNS.neptune.venusNeptune);
  }

  // Check for Uranus aspects
  if (hasAspect(composite, 'sun', 'uranus') || hasAspect(composite, 'moon', 'uranus')) {
    wounds.secondary.push(WOUND_PATTERNS.uranus.sunUranus);
    wounds.rootPatterns.push('Freedom/commitment wound');
  }

  // Default if no specific wounds found
  if (wounds.primary.length === 0) {
    wounds.primary.push({
      wound: 'General Relationship Maintenance',
      description: 'Normal challenges of long-term relating',
      lunaHealing: 'Every relationship requires maintenance. The absence of major wounds doesn\'t mean the absence of work. Keep showing up, keep communicating, keep choosing each other.'
    });
  }

  return wounds;
}

function hasAspect(composite, planet1, planet2) {
  // Simplified aspect checker - in real implementation would check actual orbs
  const aspects = composite?.aspects || [];
  return aspects.some(a =>
    (a.planet1?.toLowerCase() === planet1 && a.planet2?.toLowerCase() === planet2) ||
    (a.planet1?.toLowerCase() === planet2 && a.planet2?.toLowerCase() === planet1)
  );
}

function selectRelevantRituals(challenges) {
  const rituals = [];

  // Always include weekly maintenance
  rituals.push(REPAIR_RITUALS.weeklyMaintenance);

  if (challenges.recentConflict) {
    rituals.push(REPAIR_RITUALS.afterConflict);
  }
  if (challenges.majorBetrayal) {
    rituals.push(REPAIR_RITUALS.deepWoundHealing);
  }
  if (challenges.ongoingResentment) {
    rituals.push(REPAIR_RITUALS.forgivenessProcess);
  }

  return rituals;
}

function getCompositeHealing(composite) {
  const healings = [];

  // Check for specific patterns
  Object.entries(HEALING_BY_COMPOSITE).forEach(([key, value]) => {
    if (hasPatternMatch(composite, key)) {
      healings.push(value);
    }
  });

  return healings;
}

function hasPatternMatch(composite, patternKey) {
  // Simplified pattern matching
  const patterns = {
    sunSquareMoon: () => hasAspect(composite, 'sun', 'moon'),
    moonSquareSaturn: () => hasAspect(composite, 'moon', 'saturn'),
    venusOppositionSaturn: () => hasAspect(composite, 'venus', 'saturn'),
    marsSquarePluto: () => hasAspect(composite, 'mars', 'pluto'),
    sunConjunctNeptune: () => hasAspect(composite, 'sun', 'neptune')
  };

  return patterns[patternKey]?.() || false;
}

function selectLunaDialogue(challenges) {
  if (challenges.betrayal) return LUNA_HEALING_DIALOGUES.afterBetrayal;
  if (challenges.powerStruggle) return LUNA_HEALING_DIALOGUES.duringPowerStruggle;
  if (challenges.feelingUnloved) return LUNA_HEALING_DIALOGUES.feelingUnloved;
  if (challenges.lostConnection) return LUNA_HEALING_DIALOGUES.lostConnection;
  if (challenges.consideringLeaving) return LUNA_HEALING_DIALOGUES.consideringLeaving;

  return {
    context: 'General relationship support',
    dialogue: 'Every relationship is a journey. Some days are easy, some are hard. The question isn\'t whether you\'ll face challenges—you will. The question is whether you face them together, with honesty, compassion, and commitment to growth.'
  };
}

function selectCommunicationFrameworks(wounds) {
  // Select based on wound patterns
  const frameworks = [COMMUNICATION_FRAMEWORKS.nonviolentCommunication];

  if (wounds.primary.some(w => w.wound?.includes('Power'))) {
    frameworks.push(COMMUNICATION_FRAMEWORKS.gottmanRepair);
  }
  if (wounds.primary.some(w => w.wound?.includes('Emotional'))) {
    frameworks.push(COMMUNICATION_FRAMEWORKS.imago);
  }

  return frameworks;
}

function generateDailyPractices(wounds) {
  return [
    'Morning: 2-minute eye contact without speaking',
    'Afternoon: Text one appreciation',
    'Evening: 5-minute feelings check-in',
    'Bedtime: Physical touch without expectation'
  ];
}

function generateWeeklyPractices(wounds) {
  return [
    'State of the Union meeting (scheduled, non-negotiable)',
    'Date night (phones away, full presence)',
    'Physical intimacy time (scheduled if necessary)',
    'Individual reflection: What do I need to own this week?'
  ];
}

function generateGeneralWisdom(composite) {
  return `Your composite chart is your relationship's soul. It has its own needs, its own wounds, its own path to wholeness. When you work on your relationship, you're not just improving communication—you're helping a third entity evolve. That entity is bigger than either of you, and it has wisdom to teach you both.`;
}

// ============================================================================
// ADDITIONAL REPAIR RITUALS
// ============================================================================

const EXTENDED_RITUALS = {
  reconnectionAfterDistance: {
    name: 'The Reconnection Ritual',
    description: 'Rebuilding connection after a period of distance or disconnection',
    when: 'After travel, busy periods, illness, or emotional withdrawal',
    steps: [
      {
        name: 'The Return Acknowledgment',
        duration: '5 minutes',
        instruction: 'Face each other. One says: "I\'ve been away (physically/emotionally). I\'m coming back now."',
        purpose: 'Naming the distance makes the return conscious'
      },
      {
        name: 'The Catch-Up',
        duration: '15 minutes each',
        instruction: 'Each person shares what happened while disconnected. Not just events—feelings, thoughts, struggles.',
        purpose: 'Bridging the gap of unknown experience'
      },
      {
        name: 'The Missing',
        duration: '5 minutes each',
        instruction: 'Share: "What I missed about us while we were disconnected was..."',
        purpose: 'Reminding each other of value'
      },
      {
        name: 'The Reconnection Touch',
        duration: '10 minutes',
        instruction: 'Extended physical contact without sexual expectation. Holding, stroking hair, massage.',
        purpose: 'Bodies need to remember each other'
      },
      {
        name: 'The Re-commitment',
        duration: '2 minutes',
        instruction: 'Look in eyes. Say: "I choose you. I choose us. I\'m here now."',
        purpose: 'Conscious re-choosing after distance'
      }
    ],
    lunaGuidance: 'Distance happens. Life pulls you apart. The question isn\'t whether you\'ll drift—you will. The question is whether you have rituals to bring you back.'
  },

  sexualReconnection: {
    name: 'Intimate Reconnection Practice',
    description: 'Rebuilding physical intimacy when it has faded',
    when: 'When sex has become rare, routine, or disconnected',
    steps: [
      {
        name: 'The Conversation',
        duration: '30 minutes',
        instruction: 'Outside the bedroom, discuss intimacy. No blame. Use "I feel..." and "I wish..." statements.',
        purpose: 'Creating safety to discuss the undiscussable'
      },
      {
        name: 'Sensate Focus (Week 1-2)',
        duration: '30 minutes, 3x/week',
        instruction: 'Non-sexual touch only. Full body massage, no genitals. Focus on sensation, not arousal.',
        purpose: 'Removing performance pressure, rediscovering touch'
      },
      {
        name: 'Expanded Touch (Week 3-4)',
        duration: '30 minutes, 3x/week',
        instruction: 'Expand to include all areas but with no goal of orgasm. Explore, communicate.',
        purpose: 'Building arousal without pressure'
      },
      {
        name: 'Full Connection (Week 5+)',
        duration: 'As feels right',
        instruction: 'Allow full intimacy to return, maintaining communication and presence.',
        purpose: 'Integrating all that\'s been learned'
      }
    ],
    lunaGuidance: 'Physical intimacy is a language. When you stop speaking it, you become strangers. These practices aren\'t about sex—they\'re about remembering how to speak to each other through touch.'
  },

  trustRebuilding: {
    name: 'Trust Reconstruction Process',
    description: 'Systematic rebuilding of trust after it has been damaged',
    when: 'After betrayal, lies, or broken promises',
    phases: [
      {
        name: 'Phase 1: Transparency',
        duration: '4-8 weeks',
        instruction: 'The one who broke trust practices radical transparency. No secrets, open devices, proactive sharing.',
        purpose: 'Demonstrating trustworthiness through visibility'
      },
      {
        name: 'Phase 2: Consistency',
        duration: '3-6 months',
        instruction: 'The one who broke trust focuses on keeping every promise, no matter how small.',
        purpose: 'Building track record of reliability'
      },
      {
        name: 'Phase 3: Autonomy Return',
        duration: 'Gradual',
        instruction: 'The wounded partner gradually returns freedoms as trust rebuilds.',
        purpose: 'Moving from monitoring to trusting'
      },
      {
        name: 'Phase 4: New Foundation',
        duration: 'Ongoing',
        instruction: 'Create new relationship agreements based on what you\'ve learned.',
        purpose: 'Building something stronger than before'
      }
    ],
    lunaGuidance: 'Trust broken is not trust lost forever. But it cannot be rebuilt with words—only actions, repeated over time. The one who broke trust must do the work. The one who was hurt must risk opening again. Both are hard. Both are necessary.'
  },

  anniversaryReflection: {
    name: 'Anniversary Reflection Ritual',
    description: 'Deep reflection on the relationship\'s journey',
    when: 'On relationship anniversaries or significant dates',
    steps: [
      {
        name: 'The Memory Walk',
        duration: '30 minutes',
        instruction: 'Look through photos or visit significant places from your relationship. Share memories.',
        purpose: 'Reconnecting with the journey you\'ve traveled'
      },
      {
        name: 'The Year in Review',
        duration: '20 minutes each',
        instruction: 'Share: "This past year, the hardest thing was... The best thing was... I grew by..."',
        purpose: 'Honoring the complexity of another year together'
      },
      {
        name: 'The Gratitude',
        duration: '10 minutes each',
        instruction: 'Name 5 specific things you\'re grateful for in your partner from this past year.',
        purpose: 'Anchoring appreciation'
      },
      {
        name: 'The Intention',
        duration: '10 minutes each',
        instruction: 'Share: "In the coming year, I want to offer you..." and "I want us to..."',
        purpose: 'Setting intention for the future'
      },
      {
        name: 'The Renewal',
        duration: '5 minutes',
        instruction: 'Hold hands. Each say: "I choose you again. For another year. For as long as we both keep choosing."',
        purpose: 'Conscious re-commitment'
      }
    ],
    lunaGuidance: 'Every anniversary is a choice. Not a passive marking of time, but an active decision: "Do I choose this person again?" Let your anniversaries be conscious recommitments, not mere calendar events.'
  },

  dailyGratitude: {
    name: 'Daily Gratitude Practice',
    description: 'Building appreciation as a habit',
    when: 'Daily, ideally same time each day',
    structure: {
      morning: {
        instruction: 'Before getting out of bed, share one thing you appreciate about each other.',
        duration: '1 minute'
      },
      evening: {
        instruction: 'Before sleep, share one thing from the day that made you glad to be with this person.',
        duration: '2 minutes'
      }
    },
    lunaGuidance: 'Gratitude is the antidote to resentment. When you practice noticing what\'s good, the bad doesn\'t disappear—but it loses its power. What you appreciate, appreciates.'
  },

  conflictPrevention: {
    name: 'Weekly Resentment Clearing',
    description: 'Preventing buildup of small irritations',
    when: 'Once a week, same time',
    steps: [
      {
        name: 'Temperature Check',
        duration: '2 minutes each',
        instruction: 'Rate your relationship satisfaction 1-10 this week. Share without discussion.',
        purpose: 'Getting honest baseline'
      },
      {
        name: 'Small Irritations',
        duration: '5 minutes each',
        instruction: 'Share 1-2 small things that bothered you this week. Partner just listens, no defense.',
        purpose: 'Clearing the pipe before blockage'
      },
      {
        name: 'Acknowledgment',
        duration: '2 minutes each',
        instruction: 'Partner says: "I hear that [x] bothered you. I\'ll be more mindful."',
        purpose: 'Validation and commitment to adjust'
      },
      {
        name: 'Positive Closing',
        duration: '5 minutes total',
        instruction: 'End with something you appreciated this week and a hug.',
        purpose: 'Maintaining positive ratio'
      }
    ],
    lunaGuidance: 'Big explosions come from small pressures that were never released. This weekly practice is like a pressure valve—it lets steam out before the whole thing blows.'
  }
};

// ============================================================================
// SHADOW INTEGRATION PRACTICES
// ============================================================================

const SHADOW_INTEGRATION = {
  projectionWork: {
    name: 'Projection Recognition Practice',
    description: 'Identifying when you\'re projecting onto your partner',
    signs: [
      'Intense emotional reaction disproportionate to the trigger',
      'Feeling "they ALWAYS do this" or "they NEVER do that"',
      'The same issue keeps coming up regardless of their behavior',
      'You see in them exactly what you deny in yourself'
    ],
    practice: {
      step1: 'Notice the intensity. Ask: "Is this reaction proportionate?"',
      step2: 'Ask: "What does this remind me of from my past?"',
      step3: 'Ask: "What would I have to admit about myself if this wasn\'t about them?"',
      step4: 'Separate the projection from the real person in front of you.'
    },
    lunaGuidance: 'Your partner is a screen onto which you project your unfinished business. The work isn\'t changing the screen—it\'s recognizing what you\'re projecting.'
  },

  triggerMapping: {
    name: 'Trigger Map Creation',
    description: 'Mapping each partner\'s triggers for mutual understanding',
    process: [
      {
        name: 'Individual Work',
        instruction: 'Each person lists their top 5 emotional triggers—the things that reliably set them off.',
        example: 'Being interrupted, feeling dismissed, raised voices, lateness, etc.'
      },
      {
        name: 'Root Tracing',
        instruction: 'For each trigger, trace it back: "This bothers me because..."',
        example: 'Being interrupted triggers me because as a child my voice was constantly silenced.'
      },
      {
        name: 'Sharing',
        instruction: 'Share your trigger maps with each other. Listen without defending.',
        example: 'Now you both know where the landmines are buried.'
      },
      {
        name: 'Agreement',
        instruction: 'Make agreements about how to handle each other\'s triggers.',
        example: '"When I see you getting triggered by interruption, I\'ll pause and let you finish."'
      }
    ],
    lunaGuidance: 'You cannot avoid all triggers—nor should you. But you can know where they are and step more carefully. This isn\'t about tiptoeing; it\'s about consciousness.'
  },

  shadowDialogue: {
    name: 'Shadow Dialogue Practice',
    description: 'Having conversations with disowned parts',
    process: [
      {
        name: 'Identify the Shadow',
        instruction: 'Notice what you criticize most in your partner. This often points to your shadow.',
        example: 'If you hate their "selfishness," where are you selfish?'
      },
      {
        name: 'Give It Voice',
        instruction: 'Write a dialogue with this part. Let it speak without censorship.',
        example: '"I\'m the part of you that wants what you want without apologizing."'
      },
      {
        name: 'Find the Gift',
        instruction: 'Every shadow has a gift. What is this part trying to offer you?',
        example: 'The "selfish" part might be offering healthy boundaries and self-care.'
      },
      {
        name: 'Integration',
        instruction: 'How can you integrate this part in a healthy way?',
        example: 'Practice asking for what you need without guilt.'
      }
    ],
    lunaGuidance: 'What you cannot accept in yourself, you will attack in your partner. Shadow work isn\'t just self-improvement—it\'s an act of love for your relationship.'
  }
};

// ============================================================================
// HEALING BY ATTACHMENT STYLE
// ============================================================================

const ATTACHMENT_HEALING = {
  anxiousSecure: {
    name: 'Anxious Attachment Healing',
    pattern: 'Fear of abandonment, need for constant reassurance, hypervigilance',
    inRelationship: [
      'May text/call excessively when partner is away',
      'Interprets neutral signals as rejection',
      'Needs constant proof of love',
      'May sacrifice self to keep partner'
    ],
    healingPractices: [
      {
        name: 'Self-Soothing Protocol',
        instruction: 'When anxiety spikes, practice: "I am safe. My partner\'s distance is not abandonment. I can handle this feeling."',
        purpose: 'Building internal security'
      },
      {
        name: 'Delay Response',
        instruction: 'When urge to seek reassurance arises, wait 20 minutes. Often the urge passes.',
        purpose: 'Breaking the cycle of reactive seeking'
      },
      {
        name: 'Secure Base Visualization',
        instruction: 'Visualize your partner as a secure base you can return to, not escape from.',
        purpose: 'Rewiring internal attachment system'
      }
    ],
    partnerSupport: 'Consistent reassurance helps, but the anxious partner must also do internal work. Endless reassurance feeds the pattern; gradual self-soothing breaks it.',
    lunaGuidance: 'Your fear of abandonment is ancient. It comes from a time when being left meant death. But you are not that helpless child anymore. You can survive being alone—and paradoxically, knowing this makes connection safer.'
  },

  avoidantSecure: {
    name: 'Avoidant Attachment Healing',
    pattern: 'Discomfort with closeness, valuing independence, emotional distance',
    inRelationship: [
      'Pulls away when things get intimate',
      'Values independence to the point of isolation',
      'Shuts down during emotional conversations',
      'May mentally check out while physically present'
    ],
    healingPractices: [
      {
        name: 'Leaning In',
        instruction: 'When the urge to pull away arises, lean slightly toward your partner instead.',
        purpose: 'Rewiring the escape response'
      },
      {
        name: 'Feeling Tolerance',
        instruction: 'Practice sitting with uncomfortable emotions for increasing periods.',
        purpose: 'Building emotional capacity'
      },
      {
        name: 'Vulnerability Practice',
        instruction: 'Share one vulnerable thing per day, no matter how small.',
        purpose: 'Making vulnerability familiar'
      }
    ],
    partnerSupport: 'Give space while staying present. Pursuit increases avoidance. Patient presence allows gradual approach.',
    lunaGuidance: 'You learned that needing people was dangerous. So you built walls and called them freedom. But true freedom isn\'t needing no one—it\'s being able to need someone without losing yourself.'
  },

  disorganizedSecure: {
    name: 'Disorganized Attachment Healing',
    pattern: 'Fear of both intimacy and abandonment, chaotic relating',
    inRelationship: [
      'Wants closeness but fears it too',
      'May push partner away then desperately want them back',
      'Difficulty regulating emotions in relationship',
      'May recreate chaotic dynamics from childhood'
    ],
    healingPractices: [
      {
        name: 'Grounding First',
        instruction: 'Before any relationship discussion, ground physically: feet on floor, breath deep.',
        purpose: 'Regulating nervous system before engagement'
      },
      {
        name: 'Dual Awareness',
        instruction: 'Practice noticing both the desire for connection AND the fear. Hold both.',
        purpose: 'Integrating conflicting impulses'
      },
      {
        name: 'Slow Intimacy',
        instruction: 'Approach intimacy in small doses. Pull back before overwhelm, approach again.',
        purpose: 'Building tolerance for closeness'
      }
    ],
    partnerSupport: 'Extreme patience required. Predictability and consistency are medicine. Avoid drama that feeds the chaos pattern.',
    lunaGuidance: 'You learned that the same person who was supposed to protect you was also dangerous. So your system got confused: approach or avoid? The healing is learning that these two impulses can coexist—and that not everyone is both savior and threat.'
  }
};

// ============================================================================
// ENHANCED MAIN FUNCTION
// ============================================================================

/**
 * Get extended ritual by name
 */
export function getExtendedRitual(ritualName) {
  return EXTENDED_RITUALS[ritualName] || REPAIR_RITUALS[ritualName] || null;
}

/**
 * Get shadow integration practice
 */
export function getShadowPractice(practiceName) {
  return SHADOW_INTEGRATION[practiceName] || null;
}

/**
 * Get attachment healing guidance
 */
export function getAttachmentHealing(attachmentStyle) {
  const styleMap = {
    anxious: 'anxiousSecure',
    avoidant: 'avoidantSecure',
    disorganized: 'disorganizedSecure',
    'fearful-avoidant': 'disorganizedSecure'
  };

  const key = styleMap[attachmentStyle?.toLowerCase()] || attachmentStyle;
  return ATTACHMENT_HEALING[key] || null;
}

/**
 * Build complete healing toolkit
 */
export function buildCompleteHealingToolkit(compositeData, synastryData, userContext = {}) {
  const baseHealing = buildRelationshipHealing(compositeData, synastryData, userContext);

  return {
    ...baseHealing,

    extendedRituals: EXTENDED_RITUALS,

    shadowWork: {
      projectionWork: SHADOW_INTEGRATION.projectionWork,
      triggerMapping: SHADOW_INTEGRATION.triggerMapping,
      shadowDialogue: SHADOW_INTEGRATION.shadowDialogue
    },

    attachmentHealing: userContext.attachmentStyles ? {
      personA: getAttachmentHealing(userContext.attachmentStyles.personA),
      personB: getAttachmentHealing(userContext.attachmentStyles.personB)
    } : null,

    recommendedSequence: generateHealingSequence(userContext),

    lunaClosing: `Healing a relationship is not a single act but a daily practice. Some days you will succeed brilliantly; other days you will fail completely. Both are part of the path. The only true failure is giving up on consciousness, on growth, on each other.`
  };
}

/**
 * Generate recommended healing sequence based on context
 */
function generateHealingSequence(context) {
  const sequence = [];

  // Always start with connection
  sequence.push({
    week: 1,
    focus: 'Reconnection',
    practices: ['Daily Gratitude Practice', 'Weekly State of the Union'],
    lunaNote: 'Before healing wounds, establish safety and connection.'
  });

  // Address presenting issues
  if (context.recentConflict) {
    sequence.push({
      week: 2,
      focus: 'Repair',
      practices: ['The Repair Ritual', 'NVC Framework'],
      lunaNote: 'Clean up recent ruptures before digging deeper.'
    });
  }

  if (context.lostConnection) {
    sequence.push({
      week: 2,
      focus: 'Intimacy Rebuild',
      practices: ['Reconnection Ritual', 'Sensate Focus'],
      lunaNote: 'Bodies need to remember each other.'
    });
  }

  // Deeper work
  sequence.push({
    week: 3,
    focus: 'Shadow Work',
    practices: ['Trigger Map Creation', 'Projection Recognition'],
    lunaNote: 'Now you\'re ready to see what you\'ve been avoiding.'
  });

  // Integration
  sequence.push({
    week: 4,
    focus: 'Integration',
    practices: ['Weekly Maintenance', 'Ongoing Practices'],
    lunaNote: 'Healing is not an event but a lifestyle.'
  });

  return sequence;
}

// Export constants for external use
export {
  WOUND_PATTERNS,
  REPAIR_RITUALS,
  EXTENDED_RITUALS,
  COMMUNICATION_FRAMEWORKS,
  HEALING_BY_COMPOSITE,
  LUNA_HEALING_DIALOGUES,
  SHADOW_INTEGRATION,
  ATTACHMENT_HEALING
};
