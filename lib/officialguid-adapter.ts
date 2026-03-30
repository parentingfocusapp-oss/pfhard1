import { officialGuidLibrary } from "../data/officialguidlibrary";
import { OfficialGuidanceItem } from "../types/officialguidance";
import { ExperimentCard } from "../types/experiment";

function normalizeTag(value: string) {
  return value.trim().toLowerCase();
}

function dedupe(values: string[]) {
  return [...new Set(values.map(normalizeTag).filter(Boolean))];
}

export function officialGuidanceToExperimentCard(
  item: OfficialGuidanceItem
): ExperimentCard {
  return {
    id: item.id,
    topic: item.topic,
    moments: item.moments,
    title: item.title,
    whatToDo: item.action,
    whyItWorks: item.why,
    scripts:
      item.scripts?.map((script) => ({
        id: script.id,
        label: script.label,
        text: script.text,
        ageBands: script.ageBands,
        capacity: script.capacity,
      })) || [],
    ageBands: item.ageBands,
    parentCapacity: item.parentCapacity || ["low"],
    goals:
      item.goals && item.goals.length > 0
        ? item.goals
        : item.hopedFor && item.hopedFor.length > 0
        ? item.hopedFor
        : [],
    warmthLevel: item.warmthLevel,
    structureLevel: item.structureLevel,
    tags: dedupe([
      ...(item.tags || []),
      ...(item.triedPatterns || []),
      ...(item.hopedFor || []),
    ]),
    source: {
      type: item.source.type,
      name: item.source.name,
      citation: item.source.citation,
      url: item.source.url,
    },
  };
}

export function getOfficialExperimentCards(): ExperimentCard[] {
  return officialGuidLibrary.map(officialGuidanceToExperimentCard);
}
