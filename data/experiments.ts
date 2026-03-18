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
    "Refusing breakfast": [
      {
        id: "morning-breakfast-one-option",
        title: "Offer one easy option",
        action: "Keep breakfast simple and offer one easy option instead of turning it into a bigger discussion.",
        why: "Lowering the decision load can reduce friction in a rushed moment.",
        capacityLevel: 1,
      },
      {
        id: "morning-breakfast-pre-decide",
        title: "Decide breakfast the night before",
        action: "Choose breakfast the night before so the morning starts with less decision-making.",
        why: "Planning ahead can take pressure out of the moment.",
        capacityLevel: 2,
      },
      {
        id: "morning-breakfast-protect-connection",
        title: "Protect the connection first",
        action: "Keep the tone warm and move on if breakfast becomes a power struggle, rather than letting it shape the whole morning.",
        why: "Protecting the relationship can matter more than winning one small moment.",
        capacityLevel: 3,
      },
    ],
    "Lost things at the door": [
      {
        id: "morning-door-one-check",
        title: "Do one calm check",
        action: "Choose one place for essentials and do a calm one-minute check before it is time to leave.",
        why: "A simple check can reduce last-minute panic and blame.",
        capacityLevel: 1,
      },
      {
        id: "morning-door-landing-spot",
        title: "Create a landing spot",
        action: "Create one visible landing spot for shoes, bags, or keys and return everything there after school.",
        why: "A predictable home for essentials makes rushed mornings easier.",
        capacityLevel: 2,
      },
      {
        id: "morning-door-prep-night-before",
        title: "Prepare the doorway the night before",
        action: "Prepare one part of the doorway setup the night before so leaving needs less thinking in the morning.",
        why: "Less scrambling in the morning helps everyone stay steadier.",
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
    "Big reaction when it ends": [
      {
        id: "screen-end-acknowledge-once",
        title: "Acknowledge once, then move on",
        action: "Acknowledge the disappointment once, then move straight into the next step.",
        why: "Brief understanding can help without reopening the limit.",
        capacityLevel: 1,
      },
      {
        id: "screen-end-prepare-transition",
        title: "Prepare the next step",
        action: "Have the next step ready before screen time ends so the transition is easier to hold.",
        why: "A clear next step can make the ending feel less abrupt.",
        capacityLevel: 2,
      },
      {
        id: "screen-end-practise-regular-ending",
        title: "Practise a regular ending",
        action: "Use the same ending pattern each time so the finish becomes more predictable and less personal.",
        why: "Predictability can reduce the emotional charge around endings.",
        capacityLevel: 3,
      },
    ],
    "Wanting screens at the wrong time": [
      {
        id: "screen-wrong-time-name-next-time",
        title: "Name when screens are next available",
        action: "Name clearly when screen time is next available instead of reopening the discussion now.",
        why: "A clear future answer can feel steadier than repeated no's.",
        capacityLevel: 1,
      },
      {
        id: "screen-wrong-time-repeat-boundary",
        title: "Repeat the same boundary",
        action: "Choose one calm boundary phrase and repeat it instead of changing your explanation each time.",
        why: "Consistency often works better than extra talking.",
        capacityLevel: 2,
      },
      {
        id: "screen-wrong-time-clarify-routine",
        title: "Clarify the screen-time routine",
        action: "Make screen-time windows more visible in the family routine so the limit feels less negotiable in the moment.",
        why: "A known routine can lower friction about timing.",
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
    "Needing you to stay in the room": [
      {
        id: "bedtime-stay-predictable-ending",
        title: "Keep the ending predictable",
        action: "Decide in advance how long you will stay and keep that ending calm and predictable.",
        why: "A steady ending can feel safer than an open-ended negotiation.",
        capacityLevel: 1,
      },
      {
        id: "bedtime-stay-step-down",
        title: "Step down gradually",
        action: "Reduce your presence by one small step rather than changing the whole routine at once.",
        why: "Small shifts are often easier to tolerate than sudden change.",
        capacityLevel: 2,
      },
      {
        id: "bedtime-stay-reassuring-script",
        title: "Use one reassuring script",
        action: "Choose one reassuring sentence you will repeat each night as you leave, rather than creating a new response every time.",
        why: "A consistent script can make separation feel more predictable.",
        capacityLevel: 3,
      },
    ],
    "Extra snack or water requests": [
      {
        id: "bedtime-extra-final-check",
        title: "Do one final check",
        action: "Decide on one final check before lights out so you are not reopening bedtime over and over.",
        why: "A clear last call can reduce repeated negotiations.",
        capacityLevel: 1,
      },
      {
        id: "bedtime-extra-name-what-is-finished",
        title: "Name what is finished",
        action: "At the end of the routine, name calmly what is finished and what happens next.",
        why: "A simple closing statement can make the boundary clearer.",
        capacityLevel: 2,
      },
      {
        id: "bedtime-extra-build-into-routine",
        title: "Build needs into the routine",
        action: "Bring snack, water, or toilet into the routine earlier so those needs are less likely to reopen bedtime later.",
        why: "Planning ahead can prevent bedtime from turning into repeated re-entry.",
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
    "Saying it is too hard": [
      {
        id: "homework-hard-start-easiest-bit",
        title: "Start with the easiest bit",
        action: "Start with the easiest or shortest part first so the task feels possible.",
        why: "A manageable start can reduce the sense of overwhelm.",
        capacityLevel: 1,
      },
      {
        id: "homework-hard-work-side-by-side",
        title: "Stay side by side briefly",
        action: "Stay beside your child for the first small part, then step back once momentum begins.",
        why: "A little support at the start can make the work feel less daunting.",
        capacityLevel: 2,
      },
      {
        id: "homework-hard-shrink-the-demand",
        title: "Shrink the demand first",
        action: "Shrink the task before pushing harder, so the first success comes sooner.",
        why: "Lowering the bar at the start can help effort restart.",
        capacityLevel: 3,
      },
    ],
    "Avoiding with excuses": [
      {
        id: "homework-excuses-one-starting-ritual",
        title: "Use one starting ritual",
        action: "Choose one clear starting ritual and return to it calmly each time the task gets sidetracked.",
        why: "A repeated entry point can reduce drift and delay.",
        capacityLevel: 1,
      },
      {
        id: "homework-excuses-name-the-plan",
        title: "Name the plan once",
        action: "Name the order of what happens first, next, and after, instead of debating each excuse as it comes up.",
        why: "A simple plan can keep the task from fragmenting.",
        capacityLevel: 2,
      },
      {
        id: "homework-excuses-protect-the-start",
        title: "Protect the start of homework",
        action: "Protect the first few minutes from side trips, extra requests, or new discussions so starting gets easier.",
        why: "A cleaner start often reduces the chain of avoidance.",
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
  {
    id: "short-default-one-sentence",
    title: "Use one steady sentence",
    action: "Pick one short sentence you can repeat calmly instead of adding more explanation.",
    why: "One steady message is often easier to hold in a tense moment.",
    capacityLevel: 1,
  },
  {
    id: "short-default-protect-connection",
    title: "Protect the connection",
    action: "Aim to lower the tension first, then come back to the limit or task in one smaller step.",
    why: "Calmer emotions usually make the next step more possible.",
    capacityLevel: 2,
  },
  {
    id: "short-default-prep-one-thing",
    title: "Prepare one thing earlier",
    action: "Choose one part of the routine to prepare earlier so the hard moment carries less pressure.",
    why: "Small preparation can reduce friction before it starts.",
    capacityLevel: 3,
  },
];

const keywordExperimentLibraries: Array<{
  keywords: string[];
  experiments: Experiment[];
}> = [
  {
    keywords: ["sibling", "brother", "sister", "fighting", "sharing"],
    experiments: [
      {
        id: "siblings-separate-first",
        title: "Separate first, talk later",
        action: "Separate the children calmly first, then keep your words brief until everyone is calmer.",
        why: "Safety and calm usually need to come before problem-solving.",
        capacityLevel: 1,
      },
      {
        id: "siblings-one-clear-rule",
        title: "Use one clear rule",
        action: "Choose one simple rule for conflict moments and repeat that instead of narrating the whole argument.",
        why: "A clear repeated rule can steady a chaotic moment.",
        capacityLevel: 2,
      },
      {
        id: "siblings-practise-repair-later",
        title: "Practise repair later",
        action: "Once things are calm, practise one short repair step with the children rather than revisiting the whole conflict.",
        why: "A small repair can teach more than a long post-mortem.",
        capacityLevel: 3,
      },
    ],
  },
  {
    keywords: ["meal", "dinner", "breakfast", "lunch", "eating", "food"],
    experiments: [
      {
        id: "mealtime-keep-table-calm",
        title: "Keep the table calm",
        action: "Choose one calm response you will use at mealtime instead of escalating around eating.",
        why: "Less pressure can lower conflict and keep the meal more settled.",
        capacityLevel: 1,
      },
      {
        id: "mealtime-one-boundary",
        title: "Hold one boundary only",
        action: "Pick one mealtime boundary to hold steadily rather than trying to fix everything at once.",
        why: "One clear focus is easier to carry through consistently.",
        capacityLevel: 2,
      },
      {
        id: "mealtime-lower-pressure",
        title: "Lower the pressure",
        action: "Reduce pressure around eating and focus instead on a calmer shared mealtime routine.",
        why: "A calmer atmosphere can help everyone stay regulated.",
        capacityLevel: 3,
      },
    ],
  },
  {
    keywords: ["chore", "tidy", "clean", "room", "toys", "mess"],
    experiments: [
      {
        id: "chores-one-visible-step",
        title: "Name one visible step",
        action: "Give one visible first step for the chore instead of talking about the whole mess.",
        why: "A smaller ask is often easier to start.",
        capacityLevel: 1,
      },
      {
        id: "chores-start-together",
        title: "Start together briefly",
        action: "Begin the chore together for one minute, then step back once it has started.",
        why: "Shared starting can lower resistance.",
        capacityLevel: 2,
      },
      {
        id: "chores-create-simple-routine",
        title: "Create a simple tidy routine",
        action: "Choose one regular moment for the chore so it feels less like a sudden demand.",
        why: "Routine can reduce pushback and repeated reminders.",
        capacityLevel: 3,
      },
    ],
  },
  {
    keywords: ["shop", "store", "supermarket", "public", "restaurant", "playground", "car"],
    experiments: [
      {
        id: "public-one-plan",
        title: "State one simple plan",
        action: "Before the outing, state one simple plan for what is about to happen and what you expect.",
        why: "Clear expectations can make public moments feel less unpredictable.",
        capacityLevel: 1,
      },
      {
        id: "public-prepare-transition",
        title: "Prepare the transition early",
        action: "Give an early warning before leaving or changing activity so the transition is less abrupt.",
        why: "A little preparation can reduce public conflict.",
        capacityLevel: 2,
      },
      {
        id: "public-reduce-demands",
        title: "Reduce one demand",
        action: "Reduce one unnecessary demand during the outing so you can stay steadier on the most important boundary.",
        why: "Fewer competing demands can help everyone cope better.",
        capacityLevel: 3,
      },
    ],
  },
  {
    keywords: ["tantrum", "meltdown", "screaming", "yelling", "hitting", "aggressive", "angry"],
    experiments: [
      {
        id: "big-feelings-slow-yourself",
        title: "Slow yourself first",
        action: "In the next big-feelings moment, focus first on slowing your voice and body before saying much.",
        why: "Your steadiness can help lower the intensity of the moment.",
        capacityLevel: 1,
      },
      {
        id: "big-feelings-fewer-words",
        title: "Use fewer words",
        action: "Say less in the heated moment and return to explanation once everyone is calmer.",
        why: "Too many words can raise the temperature when feelings are already high.",
        capacityLevel: 2,
      },
      {
        id: "big-feelings-protect-safety",
        title: "Protect safety, talk later",
        action: "Focus on safety and calm containment first, then revisit what happened later in a shorter conversation.",
        why: "Safety and regulation usually come before teaching.",
        capacityLevel: 3,
      },
    ],
  },
  {
    keywords: ["ignore", "won't listen", "not listening", "defiant", "arguing back", "backtalk"],
    experiments: [
      {
        id: "listening-one-clear-direction",
        title: "Give one clear direction",
        action: "Give one clear direction and pause, rather than repeating or adding extra layers straight away.",
        why: "Clarity and space can work better than piling on more words.",
        capacityLevel: 1,
      },
      {
        id: "listening-repeat-same-message",
        title: "Repeat the same message",
        action: "Choose one sentence you can repeat calmly instead of changing your wording each time.",
        why: "A consistent message can reduce back-and-forth.",
        capacityLevel: 2,
      },
      {
        id: "listening-follow-through-smaller",
        title: "Make follow-through smaller",
        action: "Shrink the instruction to one smaller follow-through step that you can hold more steadily.",
        why: "A more manageable step is easier to carry through calmly.",
        capacityLevel: 3,
      },
    ],
  },
];

function getKeywordExperiments(topic: string, moment: string): Experiment[] | null {
  const haystack = `${topic} ${moment}`.toLowerCase();

  for (const library of keywordExperimentLibraries) {
    if (library.keywords.some((keyword) => haystack.includes(keyword))) {
      return library.experiments;
    }
  }

  return null;
}

export function getExperiments(topic: string, moment: string): Experiment[] {
  return (
    shortRouteExperiments[topic]?.[moment] ||
    getKeywordExperiments(topic, moment) ||
    defaultShortRouteExperiments
  );
}

export function getDeepDiveExperiments(balance: string): Experiment[] {
  return deepDiveExperiments[balance] || deepDiveExperiments.default;
}
