const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(process.cwd(), ".env"));
loadEnvFile(path.join(process.cwd(), "backend", ".env"));

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large."));
      }
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    req.on("error", reject);
  });
}

function cleanText(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function clampCapacity(value) {
  return value === 1 || value === 2 || value === 3 ? value : 1;
}

function normalizeReflectionResponse(value) {
  const source = value && typeof value === "object" ? value : {};
  const suggested =
    Array.isArray(source.suggestedExperimentIds) &&
    source.suggestedExperimentIds.every((item) => typeof item === "string")
      ? source.suggestedExperimentIds.slice(0, 3)
      : [];
  const themes =
    Array.isArray(source.themes) && source.themes.every((item) => typeof item === "string")
      ? source.themes.slice(0, 3)
      : [];

  const summary = cleanText(
    source.summary,
    "It sounds like this moment quickly becomes tense for both of you."
  );
  const encouragement = cleanText(source.encouragement, "Small changes count.");

  return {
    summary,
    themes,
    recommendedCapacityLevel: clampCapacity(source.recommendedCapacityLevel),
    suggestedExperimentIds: suggested,
    encouragement,
  };
}

const TOPIC_VALUES = new Set([
  "Morning routine",
  "Screen time",
  "Bedtime",
  "Homework",
  "Unknown",
]);

function normalizeInterpretedMoment(value, fallbackText = "") {
  const source = value && typeof value === "object" ? value : {};
  const topic = TOPIC_VALUES.has(source.topic) ? source.topic : "Unknown";
  const themes =
    Array.isArray(source.themes) && source.themes.every((item) => typeof item === "string")
      ? source.themes.slice(0, 3)
      : [];

  return {
    label: cleanText(source.label, fallbackText),
    topic,
    matchedMoment: cleanText(source.matchedMoment, "custom"),
    summary: cleanText(source.summary),
    themes,
  };
}

function normalizeParentOptions(value, fallbackOptions) {
  const source = value && typeof value === "object" ? value : {};

  const cleanedOptions =
    Array.isArray(source.cleanedOptions) && source.cleanedOptions.every((item) => typeof item === "string")
      ? source.cleanedOptions.map((item) => item.trim()).filter(Boolean).slice(0, 3)
      : fallbackOptions;

  const suggestedCarryForward =
    Array.isArray(source.suggestedCarryForward) &&
    source.suggestedCarryForward.every((item) => typeof item === "string")
      ? source.suggestedCarryForward.map((item) => item.trim()).filter(Boolean).slice(0, 2)
      : cleanedOptions.slice(0, 2);

  return {
    cleanedOptions,
    suggestedCarryForward,
  };
}

function normalizeAppliedExperiment(value, fallbackExample) {
  const source = value && typeof value === "object" ? value : {};

  return {
    example: cleanText(source.example, fallbackExample),
  };
}

function normalizeShortExperiment(value, fallback) {
  const source = value && typeof value === "object" ? value : {};

  return {
    title: cleanText(source.title, fallback.title),
    whatToDo: cleanText(source.whatToDo, fallback.whatToDo),
    script: cleanText(source.script, fallback.script),
    whyItWorks: cleanText(source.whyItWorks, fallback.whyItWorks),
  };
}

function isOlderChildBand(ageBand) {
  return ageBand === "11-16" || ageBand === "13-16";
}

function normalizeForComparison(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleLooksTooCloseToSource(title, experimentOptions) {
  const normalizedTitle = normalizeForComparison(title);
  if (!normalizedTitle) return false;

  return experimentOptions.some((option) => {
    const sourceTitle = normalizeForComparison(option.title);
    return sourceTitle && (normalizedTitle === sourceTitle || normalizedTitle.includes(sourceTitle));
  });
}

function looksTooYoungForOlderChild(result, ageBand) {
  if (!isOlderChildBand(ageBand)) return false;

  const combinedText = normalizeForComparison(
    `${result.title} ${result.whatToDo} ${result.script} ${result.whyItWorks}`
  );

  const tooYoungPhrases = [
    "little kid",
    "little one",
    "toddler",
    "preschool",
    "sticker chart",
    "star chart",
    "toy",
    "stuffed animal",
    "count to three",
    "time out",
  ];

  return tooYoungPhrases.some((phrase) => combinedText.includes(phrase));
}

function buildShortExperimentPrompt(input) {
  const {
    topic,
    moment,
    ageBand,
    tried,
    goal,
    sourceCardIds,
    experimentOptions,
    extraGuidance,
  } = input;

  return `
Create one tailored parenting experiment for this exact moment.

Return only this JSON:
{
  "title": "string",
  "whatToDo": "string",
  "script": "string",
  "whyItWorks": "string"
}

Rules:
- Keep it suitable for a fast 2-minute route
- Use the experiment options as guardrails and ingredients, not as the final answer
- Use the parent's moment and goal as stronger signals than the source card titles
- Do not copy a source card verbatim
- Do not return a title that is just a source-card label rewritten minimally
- Create a natural coaching title
- Match the child's age band closely if available
- Take account of what has already been tried
- Take account of what the parent is hoping for
- Give one small practical next step
- Keep tone warm, direct, and useful
- Keep every field brief

Age guidance:
- For ageBand 11-16, avoid advice framed like it is for a very young child
- For ageBand 11-16, respect autonomy more and use calm boundaries, collaboration, and follow-through
- Do not use toddler-style framing, sticker-chart energy, or overly controlling language for older children

Goal guidance:
- Treat the parent goal as a core constraint, not a side note
- If the goal is "listen first time", interpret that as wanting clearer follow-through, less arguing, and a more reliable response
- Do not frame the goal as blind obedience
- Make the experiment help the parent move toward the goal realistically for the child's age

Writing guidance:
- The title should sound like direct coaching, not like a library card label
- The "whatToDo" should be specific to the parent's moment
- The script should sound natural for the age band
- The "whyItWorks" should be short and concrete

${extraGuidance ? `Extra guidance:\n- ${extraGuidance}\n` : ""}
Parent context:
${JSON.stringify({
    topic,
    moment,
    ageBand,
    tried,
    goal,
    sourceCardIds,
    experimentOptions,
  })}
`.trim();
}

async function callOpenAiJson({ systemPrompt, userPrompt, fallback }) {
  if (!OPENAI_API_KEY) {
    console.warn("[AI backend] OPENAI_API_KEY is missing. Using fallback response.");
    return fallback;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.warn(
      `[AI backend] OpenAI request failed (${response.status}): ${errorBody.slice(
        0,
        300
      )}`
    );
    return fallback;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    console.warn("[AI backend] OpenAI response missing message content. Using fallback.");
    return fallback;
  }

  try {
    return JSON.parse(content);
  } catch {
    console.warn(
      "[AI backend] Could not parse model JSON content. Using fallback."
    );
    return fallback;
  }
}

async function handleReflect(req, res) {
  const body = await readJsonBody(req);

  const fallback = {
    summary: "It sounds like this moment quickly becomes tense for both of you.",
    themes: ["tension", "stuck pattern"],
    recommendedCapacityLevel: 1,
    suggestedExperimentIds: [],
    encouragement: "Small changes count.",
  };

  const aiResult = await callOpenAiJson({
    systemPrompt:
      "You are a calm parenting coach. Return strict JSON only and do not include markdown.",
    userPrompt: `
Given this reflection context, generate a short reflective response.
Output JSON with:
{
  "summary": "string under 18 words",
  "themes": ["up to 3 short themes"],
  "recommendedCapacityLevel": 1 | 2 | 3,
  "suggestedExperimentIds": ["up to 3 ids"],
  "encouragement": "short supportive line"
}

Context:
${JSON.stringify(body)}
`.trim(),
    fallback,
  });

  sendJson(res, 200, normalizeReflectionResponse(aiResult));
}

function inferTopicFromText(text) {
  const lower = text.toLowerCase();
  if (lower.includes("morning")) return "Morning routine";
  if (lower.includes("screen") || lower.includes("tablet") || lower.includes("phone")) {
    return "Screen time";
  }
  if (lower.includes("bed") || lower.includes("sleep") || lower.includes("night")) {
    return "Bedtime";
  }
  if (lower.includes("homework") || lower.includes("school")) return "Homework";
  return "Unknown";
}

async function handleInterpretMoment(req, res) {
  const body = await readJsonBody(req);
  const momentText = cleanText(body.momentText);
  const knownMoments = Array.isArray(body.knownMoments)
    ? body.knownMoments.filter((item) => typeof item === "string")
    : [];

  const fallback = {
    label: momentText || "Custom moment",
    topic: inferTopicFromText(momentText),
    matchedMoment: "custom",
    summary: "The parent described a challenging moment.",
    themes: ["tension"],
  };

  const aiResult = await callOpenAiJson({
    systemPrompt:
      "Return strict JSON only. No markdown. No extra keys. Keep it neutral and concise.",
    userPrompt: `
Interpret this parenting moment.
Known moments: ${knownMoments.join(", ") || "None"}

Return:
{
  "label": "string",
  "topic": "Morning routine" | "Screen time" | "Bedtime" | "Homework" | "Unknown",
  "matchedMoment": "string",
  "summary": "string",
  "themes": ["up to 3 strings"]
}

Topic hint: ${cleanText(body.topic)}
Parent text: ${momentText}
`.trim(),
    fallback,
  });

  sendJson(res, 200, normalizeInterpretedMoment(aiResult, momentText));
}

async function handleInterpretParentOptions(req, res) {
  const body = await readJsonBody(req);
  const parentOptions = Array.isArray(body.parentOptions)
    ? body.parentOptions.filter((item) => typeof item === "string").map((item) => item.trim())
    : [];
  const cleaned = parentOptions.filter(Boolean).slice(0, 3);

  const fallback = {
    cleanedOptions: cleaned,
    suggestedCarryForward: cleaned.slice(0, 2),
  };

  const aiResult = await callOpenAiJson({
    systemPrompt:
      "Return strict JSON only. Keep wording close to parent's intent and avoid inventing details.",
    userPrompt: `
Clean and prioritize parent ideas.
Return:
{
  "cleanedOptions": ["up to 3 concise option strings"],
  "suggestedCarryForward": ["up to 2 options from cleanedOptions"]
}

Context:
${JSON.stringify({
  topic: cleanText(body.topic),
  moment: cleanText(body.moment),
  balance: cleanText(body.balance),
  warmth: cleanText(body.warmth),
  structure: cleanText(body.structure),
  parentOptions: cleaned,
})}
`.trim(),
    fallback,
  });

  sendJson(res, 200, normalizeParentOptions(aiResult, cleaned));
}

async function handleApplyExperiment(req, res) {
  const body = await readJsonBody(req);

  const topic = cleanText(body.topic);
  const moment = cleanText(body.moment);
  const rawMoment = cleanText(body.rawMoment);
  const experimentTitle = cleanText(body.experimentTitle);
  const experimentAction = cleanText(body.experimentAction);
  const experimentWhy = cleanText(body.experimentWhy);

  const situation =
    rawMoment || moment || topic || "the difficult moment";

  const fallback = {
    example: `When your child does ${situation}, you ${experimentAction}. Keep your words calm and brief, and do not add lots of extra explanation in the moment.`,
  };

  const aiResult = await callOpenAiJson({
    systemPrompt:
      "You are a calm parenting coach. Return strict JSON only. Write in plain, practical language. Make the example concrete and easy to picture.",
    userPrompt: `
Apply this parenting experiment to the parent's exact moment.

Return:
{
  "example": "2 to 4 short sentences in this style: When your child does..., you do... Keep it concrete, supportive, and realistic."
}

Rules:
- Make it specific to the chosen topic and moment
- Explain what the parent would actually say or do
- Use different wording from the original experiment text
- Avoid jargon
- Avoid sounding abstract
- Do not mention AI

Context:
${JSON.stringify({
  topic,
  moment,
  rawMoment,
  experimentTitle,
  experimentAction,
  experimentWhy,
})}
`.trim(),
    fallback,
  });

  sendJson(res, 200, normalizeAppliedExperiment(aiResult, fallback.example));
}

async function handleShortExperiment(req, res) {
  const body = await readJsonBody(req);

  const topic = cleanText(body.topic);
  const moment = cleanText(body.moment);
  const ageBand = cleanText(body.ageBand);
  const sourceCardIds = Array.isArray(body.sourceCardIds)
    ? body.sourceCardIds
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];
  const tried = Array.isArray(body.tried)
    ? body.tried.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 3)
    : [];
  const goal = Array.isArray(body.goal)
    ? body.goal.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 3)
    : [];
  const experimentOptions = Array.isArray(body.experimentOptions)
    ? body.experimentOptions
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          id: cleanText(item.id),
          title: cleanText(item.title),
          whatToDo: cleanText(item.whatToDo),
          whyItWorks: cleanText(item.whyItWorks),
          script: cleanText(item.script),
          ageBands: Array.isArray(item.ageBands)
            ? item.ageBands.filter((entry) => typeof entry === "string").slice(0, 4)
            : [],
          parentCapacity: Array.isArray(item.parentCapacity)
            ? item.parentCapacity.filter((entry) => typeof entry === "string").slice(0, 3)
            : [],
          goals: Array.isArray(item.goals)
            ? item.goals.filter((entry) => typeof entry === "string").slice(0, 4)
            : [],
          tags: Array.isArray(item.tags)
            ? item.tags.filter((entry) => typeof entry === "string").slice(0, 5)
            : [],
        }))
        .filter((item) => item.title && item.whatToDo)
        .slice(0, 3)
    : [];

  const firstOption = experimentOptions[0] || {};

  const fallback = {
    title: firstOption.title || "One small calm step",
    whatToDo:
      firstOption.whatToDo ||
      "Pick one small next step, keep your words brief, and stay steady.",
    script:
      firstOption.script ||
      "I'm keeping this simple. Here's the next step.",
    whyItWorks:
      firstOption.whyItWorks ||
      "A smaller, steadier response is often easier for both of you to follow.",
  };

  const systemPrompt =
    "You are a calm parenting coach helping a parent in a very short 2-minute route. Return strict JSON only. Use the library experiments as source material and safety guardrails, not as text to copy directly. Give one small, safe, concrete experiment. Be specific, emotionally attuned, and brief. Avoid generic advice, long explanations, multiple suggestions, vague reassurance without action, or simply echoing a source-card title.";

  const firstPass = normalizeShortExperiment(
    await callOpenAiJson({
      systemPrompt,
      userPrompt: buildShortExperimentPrompt({
        topic,
        moment,
        ageBand,
        tried,
        goal,
        sourceCardIds,
        experimentOptions,
      }),
      fallback,
    }),
    fallback
  );

  const shouldRetry =
    titleLooksTooCloseToSource(firstPass.title, experimentOptions) ||
    looksTooYoungForOlderChild(firstPass, ageBand);

  if (!shouldRetry) {
    sendJson(res, 200, firstPass);
    return;
  }

  const retryReason = looksTooYoungForOlderChild(firstPass, ageBand)
    ? "The first draft sounded too young for this age band. Rewrite it to sound appropriate for an older child or teenager while keeping it brief and practical."
    : "The first draft title stayed too close to the source-card wording. Rewrite it so it sounds like natural coaching, not a reused library label.";

  const secondPass = normalizeShortExperiment(
    await callOpenAiJson({
      systemPrompt,
      userPrompt: buildShortExperimentPrompt({
        topic,
        moment,
        ageBand,
        tried,
        goal,
        sourceCardIds,
        experimentOptions,
        extraGuidance: retryReason,
      }),
      fallback: firstPass,
    }),
    firstPass
  );

  sendJson(res, 200, secondPass);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      sendJson(res, 204, {});
      return;
    }

    if (req.method === "GET" && req.url === "/api/health") {
      sendJson(res, 200, {
        ok: true,
        service: "ai-backend",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (req.method === "GET" && req.url === "/api/debug/source") {
      sendJson(res, 200, {
        ok: true,
        backendReachable: true,
        openAiConfigured: Boolean(OPENAI_API_KEY),
        model: OPENAI_MODEL,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (req.method === "POST" && req.url === "/api/ai/reflect") {
      console.log("[AI backend] /api/ai/reflect");
      await handleReflect(req, res);
      return;
    }

    if (req.method === "POST" && req.url === "/api/ai/interpret-moment") {
      console.log("[AI backend] /api/ai/interpret-moment");
      await handleInterpretMoment(req, res);
      return;
    }

    if (req.method === "POST" && req.url === "/api/ai/interpret-parent-options") {
      console.log("[AI backend] /api/ai/interpret-parent-options");
      await handleInterpretParentOptions(req, res);
      return;
    }

    if (req.method === "POST" && req.url === "/api/ai/apply-experiment") {
      console.log("[AI backend] /api/ai/apply-experiment");
      await handleApplyExperiment(req, res);
      return;
    }

    if (req.method === "POST" && req.url === "/api/ai/short-experiment") {
      console.log("[AI backend] /api/ai/short-experiment");
      await handleShortExperiment(req, res);
      return;
    }

    console.warn(`[AI backend] 404 ${req.method} ${req.url}`);
    sendJson(res, 404, { error: "Not found." });
  } catch (error) {
    sendJson(res, 500, {
      error: "Internal server error.",
      details: error instanceof Error ? error.message : "Unknown error.",
    });
  }
});

function getLanIp() {
  const interfaces = os.networkInterfaces();
  for (const network of Object.values(interfaces)) {
    if (!network) continue;
    for (const address of network) {
      if (address.family === "IPv4" && !address.internal) {
        return address.address;
      }
    }
  }
  return null;
}

server.listen(PORT, HOST, () => {
  const lanIp = getLanIp();
  const lanUrl = lanIp ? `http://${lanIp}:${PORT}` : `http://<LAN-IP>:${PORT}`;

  console.log(`AI backend listening on http://localhost:${PORT}`);
  console.log(`AI backend LAN URL: ${lanUrl}`);
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    console.log(`Expo app API base URL: ${process.env.EXPO_PUBLIC_API_BASE_URL}`);
  }
});
