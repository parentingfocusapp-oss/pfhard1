export const momentOptions: { [key: string]: string[] } = {
  "Morning routine": [
    "Getting dressed",
    "Brushing teeth",
    "Leaving the house",
    "Arguments before school",
    "Refusing breakfast",
    "Lost things at the door",
  ],
  "Screen time": [
    "Stopping the device",
    "Asking repeatedly for more time",
    "Arguing about what to watch",
    "Sneaking extra screen time",
    "Big reaction when it ends",
    "Wanting screens at the wrong time",
  ],
  Bedtime: [
    "Refusing to go upstairs",
    "Delaying tactics",
    "Arguments at lights out",
    "Repeatedly getting out of bed",
    "Needing you to stay in the room",
    "Extra snack or water requests",
  ],
  Homework: [
    "Refusing to start",
    "Getting distracted",
    "Arguing about help",
    "Meltdown over mistakes",
    "Saying it is too hard",
    "Avoiding with excuses",
  ],
};

export function getExperiment(topic: string, moment: string) {
  if (topic === "Morning routine") {
    if (moment === "Getting dressed") {
      return "Reduce the talking and focus on one clear next step: 'Socks first.'";
    }
    if (moment === "Brushing teeth") {
      return "Try using a short countdown and keeping your words brief and neutral.";
    }
    if (moment === "Leaving the house") {
      return "Use one short leaving-the-house script and repeat it calmly instead of adding more words.";
    }
    if (moment === "Refusing breakfast") {
      return "Keep breakfast simple and offer one easy option instead of turning it into a bigger discussion.";
    }
    if (moment === "Lost things at the door") {
      return "Choose one place for essentials and do a calm one-minute check before it is time to leave.";
    }
    return "Try keeping the morning to one calm step at a time.";
  }

  if (topic === "Screen time") {
    if (moment === "Stopping the device") {
      return "Try giving a 5-minute warning and then using one clear stopping phrase.";
    }
    if (moment === "Asking repeatedly for more time") {
      return "Choose one neutral phrase and use it consistently instead of re-explaining.";
    }
    if (moment === "Sneaking extra screen time") {
      return "Focus on calm follow-through rather than a long discussion about the rule.";
    }
    if (moment === "Big reaction when it ends") {
      return "Acknowledge the disappointment once, then move straight into the next step.";
    }
    if (moment === "Wanting screens at the wrong time") {
      return "Name clearly when screen time is available again instead of reopening the discussion.";
    }
    return "Try setting the limit before the screen starts and avoiding negotiation once it ends.";
  }

  if (topic === "Bedtime") {
    if (moment === "Refusing to go upstairs") {
      return "Make the first bedtime step very clear and easy to begin.";
    }
    if (moment === "Delaying tactics") {
      return "Try naming the bedtime steps in advance and sticking to the same order.";
    }
    if (moment === "Repeatedly getting out of bed") {
      return "Return your child calmly with as few words as possible each time.";
    }
    if (moment === "Needing you to stay in the room") {
      return "Decide in advance how long you will stay and keep that ending calm and predictable.";
    }
    if (moment === "Extra snack or water requests") {
      return "Decide on one final check before lights out so you are not reopening bedtime over and over.";
    }
    return "Try making the routine more predictable and keeping your response calm and repetitive.";
  }

  if (topic === "Homework") {
    if (moment === "Refusing to start") {
      return "Try agreeing to do just 5 minutes first, rather than focusing on the whole task.";
    }
    if (moment === "Getting distracted") {
      return "Try setting a short timer for one focused chunk before a small break.";
    }
    if (moment === "Meltdown over mistakes") {
      return "Try praising effort first and helping your child correct just one part at a time.";
    }
    if (moment === "Saying it is too hard") {
      return "Start with the easiest or shortest part first so the task feels possible.";
    }
    if (moment === "Avoiding with excuses") {
      return "Choose one clear starting ritual and return to it calmly each time the task gets sidetracked.";
    }
    return "Try shrinking the task and focusing on one calm starting point.";
  }

  return "Try one small calm shift that makes the next moment easier to handle.";
}
