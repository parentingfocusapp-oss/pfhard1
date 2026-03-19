import { getExperimentCards } from "./experiments";

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
  return (
    getExperimentCards(topic, moment)[0]?.whatToDo ||
    "Try one small calm shift that makes the next moment easier to handle."
  );
}
