export type AgeBand =
  | "2-3"
  | "3-5"
  | "4-5"
  | "6-8"
  | "6-10"
  | "9-12"
  | "11-16"
  | "13-16";

export type CapacityLevel = "low" | "medium" | "high";

export type IntensityLevel = "low" | "medium" | "high";

export type ScriptVariant = {
  id: string;
  label: string;
  text: string;
  ageBands?: AgeBand[];
  capacity?: CapacityLevel[];
};

export type ExperimentCard = {
  id: string;
  topic: string;
  moments: string[];
  title: string;
  whatToDo: string;
  whyItWorks: string;
  scripts: ScriptVariant[];
  whenToUse?: string;
  lowCapacityTip?: string;
  commonMistake?: string;
  ageBands: AgeBand[];
  parentCapacity: CapacityLevel[];
  goals?: string[];
  warmthLevel?: IntensityLevel;
  structureLevel?: IntensityLevel;
  tags?: string[];
  source?: {
    type?: string;
    name: string;
    citation?: string;
    url?: string;
  };
};

export type ExperimentAIPayload = {
  id: string;
  title: string;
  whatToDo: string;
  whyItWorks: string;
  ageBands: AgeBand[];
  parentCapacity: CapacityLevel[];
  goals?: string[];
};
