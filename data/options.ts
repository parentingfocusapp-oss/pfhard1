export const momentOptions: { [key: string]: string[] } = {
  "Morning routine": [
    "Getting dressed",
    "Brushing teeth",
    "Leaving the house",
    "Arguments before school",
  ],
  "Screen time": [
    "Stopping the device",
    "Asking repeatedly for more time",
    "Arguing about what to watch",
    "Sneaking extra screen time",
  ],
  "Bedtime": [
    "Refusing to go upstairs",
    "Delaying tactics",
    "Arguments at lights out",
    "Repeatedly getting out of bed",
  ],
  "Homework": [
    "Refusing to start",
    "Getting distracted",
    "Arguing about help",
    "Meltdown over mistakes",
  ],
};

export function getExperiment(topic: string, moment: string) {
  if (topic === "Morning routine") {
    if (moment === "Getting dressed") {
      return "Try offering two clothing choices and then give one calm instruction.";
    }
    if (moment === "Brushing teeth") {
      return "Try using a short countdown and keeping your words brief and neutral.";
    }
    if (moment === "Leaving the house") {
      return "Try preparing one step earlier and giving a 5-minute warning before shoes and coats.";
    }
    return "Try giving one small choice and keeping the routine to one calm step at a time.";
  }

  if (topic === "Screen time") {
    if (moment === "Stopping the device") {
      return "Try giving a 5-minute warning and then using one clear stopping phrase.";
    }
    if (moment === "Asking repeatedly for more time") {
      return "Try agreeing the limit in advance and repeating the same calm answer each time.";
    }
    if (moment === "Sneaking extra screen time") {
      return "Try moving the device out of reach after use and restating the rule briefly.";
    }
    return "Try setting the limit before the screen starts and avoiding negotiation once it ends.";
  }

  if (topic === "Bedtime") {
    if (moment === "Refusing to go upstairs") {
      return "Try giving a 10-minute warning and offering a choice about the first bedtime step.";
    }
    if (moment === "Delaying tactics") {
      return "Try naming the bedtime steps in advance and sticking to the same order.";
    }
    if (moment === "Repeatedly getting out of bed") {
      return "Try returning your child calmly with as few words as possible each time.";
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
    return "Try shrinking the task and focusing on one calm starting point.";
  }

  return "Try one small choice, one calm instruction, and one predictable next step.";
}