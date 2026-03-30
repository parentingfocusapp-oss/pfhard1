import { AgeBand, CapacityLevel, IntensityLevel } from "./experiment";

export type OfficialGuidanceItem = {
  id: string;
  topic: string;
  problem?: string;
  moments: string[];
  triedPatterns?: string[];
  hopedFor?: string[];

  title: string;
  action: string;
  why: string;

  scripts?: {
    id: string;
    label: string;
    text: string;
    ageBands?: AgeBand[];
    capacity?: CapacityLevel[];
  }[];

  ageBands: AgeBand[];
  parentCapacity?: CapacityLevel[];
  goals?: string[];
  tags?: string[];

  warmthLevel?: IntensityLevel;
  structureLevel?: IntensityLevel;

  source: {
    type: "official-guidance";
    name: string;
    citation?: string;
    url?: string;
  };

  notes?: string;
};
