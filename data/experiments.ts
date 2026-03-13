import { Experiment } from "../types/experiment";

const shortRouteExperiments: Record<string, Record<string, Experiment[]>> = {
  "Morning routine": {
    "Getting dressed": [
      {
        id: "morning-dressed-one-step",
        title: "Focus on one next step",
        action: "Reduce the talking and focus on one clear next step: 'Socks first.'",
        why: "Clear, simple instructions are often easier to follow than lots of words.",
        capacityLevel: 1,
      },
      {
        id: "morning-dressed-two-choices",
        title: "Offer two choices",
        action: "Try offering two clothing choices and then give one calm instruction.",
        why: "Limited choice can reduce pushback while keeping you calmly in charge.",
        capacityLevel: 2,
      },
      {
        id: "morning-dressed-lay-out",
        title: "Lay outfits out in advance",
        action: "Lay out two acceptable outfits in advance and ask your child to choose one.",
        why: "Reducing decisions in the moment can make the routine smoother and calmer.",
        capacityLevel: 3,
      },
    ],
    "Brushing teeth": [
      {
        id: "morning-teeth-countdown",
        title: "Use a short countdown",
        action: "Try using a short countdown and keeping your words brief and neutral.",
        why: "A predictable cue can help the moment move forward without building tension.",
        capacityLevel: 1,
      },
      {
        id: "morning-teeth-playful-then-calm",
        title: "Playful first, calm second",
        action: "Try one playful prompt first, then one calm instruction without extra discussion.",
        why: "A light start can help engagement, while a calm follow-up keeps the boundary clear.",
        capacityLevel: 2,
      },
      {
        id: "morning-teeth-predictable-step",
        title: "Make it predictable",
        action: "Make toothbrushing the same predictable step each day, with fewer reminders.",
        why: "Routine reduces negotiation and helps children know what to expect.",
        capacityLevel: 3,
      },
    ],
    "Leaving the house": [
      {
        id: "morning-leaving-script",
        title: "Use one calm script",
        action: "Use one short leaving-the-house script and repeat it calmly instead of adding more words.",
        why: "Repeating one clear message is often more effective than expanding the discussion.",
        capacityLevel: 1,
      },
      {
        id: "morning-leaving-warning",
        title: "Give a 5-minute warning",
        action: "Try preparing one step earlier and giving a 5-minute warning before shoes and coats.",
        why: "Transitions often go better when children have a little time to adjust.",
        capacityLevel: 2,
      },
      {
        id: "morning-leaving-night-before",
        title: "Prepare one part earlier",
        action: "Choose one part of the routine to get ready earlier the night before.",
        why: "Reducing pressure in the morning can lower friction for everyone.",
        capacityLevel: 3,
      },
    ],
    "Arguments before school": [
      {
        id: "morning-school-essentials-only",
        title: "Stick to essentials",
        action: "Try keeping the morning focused on essentials only and postpone non-urgent discussions.",
        why: "Protecting the routine can prevent the conflict from spreading into the whole morning.",
        capacityLevel: 1,
      },
      {
        id: "morning-school-repeat-sentence",
        title: "Repeat one sentence",
        action: "Choose one sentence you will repeat calmly instead of getting pulled into the argument.",
        why: "A steady repeated message can help you stay regulated and reduce back-and-forth.",
        capacityLevel: 2,
      },
      {
        id: "morning-school-lower-temperature",
        title: "Lower the emotional temperature",
        action: "Aim to lower the emotional temperature first, then guide the next practical step.",
        why: "Calmer emotions make it easier to move into cooperation.",
        capacityLevel: 3,
      },
    ],
  },

  "Screen time": {
    "Stopping the device": [
      {
        id: "screen-stop-warning",
        title: "Give a 5-minute warning",
        action: "Try giving a 5-minute warning and then using one clear stopping phrase.",
        why: "Warnings can make endings feel less sudden and support follow-through.",
        capacityLevel: 1,
      },
      {
        id: "screen-stop-next-step",
        title: "Move straight to the next step",
        action: "When time is up, keep your words short and move straight into the next routine step.",
        why: "A clear transition can help avoid long negotiations at the stopping point.",
        capacityLevel: 2,
      },
      {
        id: "screen-stop-agree-before",
        title: "Agree the stopping point first",
        action: "Agree the stopping point before the screen starts and stick to it calmly.",
        why: "Clear expectations before starting can reduce arguments when it is time to stop.",
        capacityLevel: 3,
      },
    ],
    "Asking repeatedly for more time": [
      {
        id: "screen-more-time-neutral-phrase",
        title: "Use one neutral phrase",
        action: "Choose one neutral phrase and use it consistently instead of re-explaining.",
        why: "Short, repeated answers can keep you from getting drawn into debate.",
        capacityLevel: 1,
      },
      {
        id: "screen-more-time-acknowledge-and-hold",
        title: "Acknowledge and hold the boundary",
        action: "Acknowledge disappointment briefly, then hold the boundary without negotiating.",
        why: "Feeling understood can help, but the limit still stays clear.",
        capacityLevel: 2,
      },
      {
        id: "screen-more-time-limit-in-advance",
        title: "Set the limit in advance",
        action: "Try agreeing the limit in advance and repeating the same calm answer each time.",
        why: "Consistency often reduces the energy of repeated asking over time.",
        capacityLevel: 3,
      },
    ],
    "Arguing about what to watch": [
      {
        id: "screen-watch-two-approved",
        title: "Offer two approved choices",
        action: "Offer two pre-approved choices instead of opening up a wider debate.",
        why: "A narrower choice can keep things calmer while still giving some control.",
        capacityLevel: 1,
      },
      {
        id: "screen-watch-pause-decision",
        title: "Pause if arguing starts",
        action: "If arguing starts, pause the decision and return once things are calmer.",
        why: "Stepping out of the conflict can stop the disagreement from escalating.",
        capacityLevel: 2,
      },
      {
        id: "screen-watch-options-before",
        title: "Decide options beforehand",
        action: "Try deciding the options before screen time starts, not during the disagreement.",
        why: "Pre-deciding reduces conflict in the heat of the moment.",
        capacityLevel: 3,
      },
    ],
    "Sneaking extra screen time": [
      {
        id: "screen-sneak-calm-follow-through",
        title: "Focus on follow-through",
        action: "Focus on calm follow-through rather than a long discussion about the rule.",
        why: "Calm consistency often teaches more than repeated talking.",
        capacityLevel: 1,
      },
      {
        id: "screen-sneak-move-device",
        title: "Move the device after use",
        action: "Try moving the device out of reach after use and restating the rule briefly.",
        why: "Changing the setup can support the boundary without a long confrontation.",
        capacityLevel: 2,
      },
      {
        id: "screen-sneak-finishing-routine",
        title: "Create a clear finish",
        action: "Make the end of screen time more visible by creating one clear finishing routine.",
        why: "A visible ending can make the boundary feel more concrete and predictable.",
        capacityLevel: 3,
      },
    ],
  },

  Bedtime: {
    "Refusing to go upstairs": [
      {
        id: "bedtime-upstairs-clear-first-step",
        title: "Make the first step clear",
        action: "Make the first bedtime step very clear and easy to begin.",
        why: "Starting is often the hardest part, so a simple entry point can help.",
        capacityLevel: 1,
      },
      {
        id: "bedtime-upstairs-warm-firm",
        title: "Warm tone, firm next step",
        action: "Use a warm tone with a firm next step instead of stretching the discussion.",
        why: "Combining calm warmth with clarity can reduce bedtime power struggles.",
        capacityLevel: 2,
      },
      {
        id: "bedtime-upstairs-warning-choice",
        title: "Warning plus first-step choice",
        action: "Try giving a 10-minute warning and offering a choice about the first bedtime step.",
        why: "A warning and a small choice can ease a difficult transition.",
        capacityLevel: 3,
      },
    ],
    "Delaying tactics": [
      {
        id: "bedtime-delay-name-steps",
        title: "Name the bedtime steps",
        action: "Try naming the bedtime steps in advance and sticking to the same order.",
        why: "Predictability can reduce opportunities for delay and negotiation.",
        capacityLevel: 1,
      },
      {
        id: "bedtime-delay-predictable-not-negotiable",
        title: "Keep bedtime repetitive",
        action: "Keep bedtime repetitive and predictable rather than inventive and negotiable.",
        why: "A stable routine can lower bedtime friction over time.",
        capacityLevel: 2,
      },
      {
        id: "bedtime-delay-decide-requests",
        title: "Decide what you will not reopen",
        action: "Decide in advance which extra requests you will not reopen once bedtime begins.",
        why: "Pre-deciding helps you stay steady when delay tactics appear.",
        capacityLevel: 3,
      },
    ],
    "Arguments at lights out": [
      {
        id: "bedtime-lightsout-less-discussion",
        title: "Reduce discussion at the end",
        action: "Lower the amount of discussion at the end and keep your response steady and brief.",
        why: "Less talking at lights out can help stop the moment from becoming a bigger conflict.",
        capacityLevel: 1,
      },
      {
        id: "bedtime-lightsout-acknowledge-once",
        title: "Acknowledge once, then hold",
        action: "Acknowledge feelings once, then return to the same calm bedtime boundary.",
        why: "This balances emotional understanding with consistency.",
        capacityLevel: 2,
      },
      {
        id: "bedtime-lightsout-soothing-routine",
        title: "Repeat one calming close",
        action: "Choose one soothing but predictable closing routine and repeat it consistently.",
        why: "A consistent closing pattern can help bedtime feel safer and less activating.",
        capacityLevel: 3,
      },
    ],
    "Repeatedly getting out of bed": [
      {
        id: "bedtime-out-of-bed-calm-return",
        title: "Return calmly each time",
        action: "Try returning your child calmly with as few words as possible each time.",
        why: "A brief, calm response reduces attention on the behaviour and keeps you regulated.",
        capacityLevel: 1,
      },
      {
        id: "bedtime-out-of-bed-boring-brief",
        title: "Keep it boring and brief",
        action: "Keep the response boring, brief, and consistent rather than escalating.",
        why: "Low-drama repetition often works better than bigger reactions.",
        capacityLevel: 2,
      },
      {
        id: "bedtime-out-of-bed-repeat-for-days",
        title: "Repeat for a few nights",
        action: "Focus on calm repetition for a few nights instead of trying many different responses.",
        why: "Consistency over several days gives one approach a fair chance to work.",
        capacityLevel: 3,
      },
    ],
  },

  Homework: {
    "Refusing to start": [
      {
        id: "homework-start-five-minutes",
        title: "Start with 5 minutes",
        action: "Try agreeing to do just 5 minutes first, rather than focusing on the whole task.",
        why: "A smaller starting point can make the task feel more manageable.",
        capacityLevel: 1,
      },
      {
        id: "homework-start-shrink-entry",
        title: "Shrink the starting point",
        action: "Shrink the starting point so success feels more reachable.",
        why: "Reducing the first hurdle can build momentum.",
        capacityLevel: 2,
      },
      {
        id: "homework-start-presence-first",
        title: "Begin with presence and encouragement",
        action: "Begin with presence and encouragement, then move to one very small first step.",
        why: "Support at the start can lower resistance and make action easier.",
        capacityLevel: 3,
      },
    ],
    "Getting distracted": [
      {
        id: "homework-distracted-timer",
        title: "Use a short focus timer",
        action: "Try setting a short timer for one focused chunk before a small break.",
        why: "Short work periods can make concentration feel more achievable.",
        capacityLevel: 1,
      },
      {
        id: "homework-distracted-stay-nearby",
        title: "Stay nearby briefly",
        action: "Stay nearby briefly at the start, then step back once momentum begins.",
        why: "A little presence can help get the task off the ground.",
        capacityLevel: 2,
      },
      {
        id: "homework-distracted-reduce-distractions",
        title: "Reduce distractions",
        action: "Reduce distractions around the task and agree one clear focus goal.",
        why: "A simpler environment can support attention.",
        capacityLevel: 3,
      },
    ],
    "Arguing about help": [
      {
        id: "homework-help-agree-kind-of-help",
        title: "Agree what help means",
        action: "Agree first what kind of help you will give, so expectations are clearer.",
        why: "Clear expectations can reduce frustration on both sides.",
        capacityLevel: 1,
      },
      {
        id: "homework-help-limited-part",
        title: "Help with one part only",
        action: "Try offering help in one limited part rather than taking over the whole task.",
        why: "Bounded support can feel helpful without undermining independence.",
        capacityLevel: 2,
      },
      {
        id: "homework-help-calm-bounded",
        title: "Keep support calm and bounded",
        action: "Keep support calm and bounded, especially if frustration rises quickly.",
        why: "Steady limits around help can stop the task becoming another conflict.",
        capacityLevel: 3,
      },
    ],
    "Meltdown over mistakes": [
      {
        id: "homework-mistakes-effort-first",
        title: "Praise effort first",
        action: "Try praising effort first and helping your child correct just one part at a time.",
        why: "Reducing pressure can make mistakes feel more manageable.",
        capacityLevel: 1,
      },
      {
        id: "homework-mistakes-one-correction",
        title: "Correct one part only",
        action: "Slow the task down and focus on one manageable correction rather than the whole page.",
        why: "Breaking the work down can reduce overwhelm.",
        capacityLevel: 2,
      },
      {
        id: "homework-mistakes-respond-upset-first",
        title: "Respond to the upset first",
        action: "Respond to the upset first, then return to the work in a smaller chunk.",
        why: "Regulation usually comes before learning can restart.",
        capacityLevel: 3,
      },
    ],
  },
};

const deepDiveExperiments: Record<string, Experiment[]> = {
  warmth: [
    {
      id: "deep-warmth-one-understanding-sentence",
      title: "Start with understanding",
      action: "Pick one daily friction point and begin with one sentence that shows understanding before you give direction.",
      why: "Feeling understood can make it easier for children to take in guidance.",
      capacityLevel: 1,
    },
    {
      id: "deep-warmth-calm-available",
      title: "Be calm and available first",
      action: "When your child is upset this week, focus first on staying calm and emotionally available before trying to solve the problem.",
      why: "Emotional availability can lower tension and create space for cooperation.",
      capacityLevel: 2,
    },
    {
      id: "deep-warmth-slow-down-daily",
      title: "Slow down and soften first",
      action: "This week, choose one tense moment each day where you slow down, soften your tone, and show understanding before trying to guide your child.",
      why: "This helps strengthen connection before direction in moments that easily become tense.",
      capacityLevel: 3,
    },
  ],
  structure: [
    {
      id: "deep-structure-one-expectation",
      title: "State one expectation simply",
      action: "Pick one household expectation and state it once, simply and clearly, instead of repeating or negotiating.",
      why: "Simple expectations are often easier to hold and follow through on.",
      capacityLevel: 1,
    },
    {
      id: "deep-structure-clear-instruction",
      title: "One calm clear instruction",
      action: "This week, choose one repeated friction point and give one calm, clear instruction with fewer words and a clear follow-through.",
      why: "Clarity and consistency can reduce confusion and repeated negotiation.",
      capacityLevel: 2,
    },
    {
      id: "deep-structure-calm-authority",
      title: "Practise calm authority",
      action: "Choose one moment each day to practise calm authority: clear instruction, brief pause, then follow-through.",
      why: "This builds steadiness without raising intensity.",
      capacityLevel: 3,
    },
  ],
  both: [
    {
      id: "deep-both-kind-and-clear",
      title: "Be kind and clear together",
      action: "Choose one stress point and practise being kind and clear at the same time: warm tone, short words, clear boundary.",
      why: "A balanced response can reduce conflict without becoming too soft or too sharp.",
      capacityLevel: 1,
    },
    {
      id: "deep-both-acknowledge-then-limit",
      title: "Acknowledge, then guide",
      action: "This week, in one predictable difficult moment, combine warmth and structure: acknowledge your child's feeling briefly, then give a clear limit or next step.",
      why: "Some moments need both connection and clarity at the same time.",
      capacityLevel: 2,
    },
    {
      id: "deep-both-connection-and-clarity",
      title: "Aim for connection and clarity",
      action: "Once a day, notice a tense moment and aim for both connection and clarity rather than only one or the other.",
      why: "This helps build a more balanced parenting response over time.",
      capacityLevel: 3,
    },
  ],
  depends: [
    {
      id: "deep-depends-notice-pattern",
      title: "Notice the pattern first",
      action: "For one week, make your experiment simply to notice the pattern before responding: connection, clarity, or both?",
      why: "Observation first can help you choose more effectively later.",
      capacityLevel: 1,
    },
    {
      id: "deep-depends-decide-deliberately",
      title: "Decide deliberately",
      action: "Pick one recurring situation and pause before reacting, deciding deliberately whether warmth or structure is most needed in that moment.",
      why: "A short pause can make your response more thoughtful and better matched to the situation.",
      capacityLevel: 2,
    },
    {
      id: "deep-depends-notice-what-is-needed",
      title: "Pause and ask what is needed",
      action: "This week, notice one difficult moment each day and ask yourself first: does this child need connection, clarity, or both right now? Then respond on purpose.",
      why: "The right response may vary, and this builds more deliberate choices.",
      capacityLevel: 3,
    },
  ],
  default: [
    {
      id: "deep-default-intentional-moment",
      title: "Choose one intentional moment",
      action: "This week, choose one small moment to respond a little more intentionally, with attention to both connection and clarity.",
      why: "A small intentional shift is often the best place to start.",
      capacityLevel: 1,
    },
  ],
};

const defaultShortRouteExperiments: Experiment[] = [
  {
    id: "short-default-choice-instruction-step",
    title: "One small calm step",
    action: "Try one small choice, one calm instruction, and one predictable next step.",
    why: "A simple, steady response can be a good starting point when the moment is unclear.",
    capacityLevel: 1,
  },
];

export function getExperiments(topic: string, moment: string): Experiment[] {
  return shortRouteExperiments[topic]?.[moment] || defaultShortRouteExperiments;
}

export function getDeepDiveExperiments(balance: string): Experiment[] {
  return deepDiveExperiments[balance] || deepDiveExperiments.default;
}
