/**
 * Robustly parse AI JSON returned as either:
 * - a JSON string (possibly markdown-fenced or double-encoded)
 * - an already-parsed object
 * - an object nested under common wrapper keys
 */
export function parseAIResult<T extends Record<string, unknown>>(
  raw: unknown,
  options?: { requireKeys?: string[] },
): T {
  const parsed = coerceToObject(raw);
  const normalized = unwrapNested(parsed);

  if (options?.requireKeys?.length) {
    const missing = options.requireKeys.filter((key) => {
      const value = normalized[key];
      return value === undefined || value === null || value === '';
    });
    if (missing.length > 0) {
      throw new Error(
        `AI returned incomplete data (missing: ${missing.join(', ')}). Please try again.`,
      );
    }
  }

  return normalized as T;
}

function coerceToObject(raw: unknown): Record<string, unknown> {
  if (raw == null) {
    throw new Error('AI returned an empty response. Please try again.');
  }

  if (typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }

  if (typeof raw !== 'string') {
    throw new Error('AI returned an unexpected response format. Please try again.');
  }

  let text = raw.trim();
  if (!text || text === '{}' || text === 'null') {
    throw new Error('AI returned an empty response. Please try again.');
  }

  // Strip markdown fences
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();

  // Extract first JSON object/array if prose surrounds it
  if (!text.startsWith('{') && !text.startsWith('[')) {
    const extracted = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (extracted) text = extracted[1];
  }

  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error('Could not parse AI response. Please try again.');
  }

  // Handle double-encoded JSON: "\"{...}\"" or a string that is itself JSON
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value.trim());
    } catch {
      throw new Error('Could not parse AI response. Please try again.');
    }
  }

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('AI returned an unexpected response format. Please try again.');
  }

  return value as Record<string, unknown>;
}

function unwrapNested(obj: Record<string, unknown>): Record<string, unknown> {
  const wrappers = ['result', 'data', 'analysis', 'response', 'output'];
  for (const key of wrappers) {
    const inner = obj[key];
    if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
      const candidate = inner as Record<string, unknown>;
      // Only unwrap if the outer object looks like a thin wrapper
      const outerKeys = Object.keys(obj);
      if (outerKeys.length <= 2) return candidate;
    }
  }
  return obj;
}

/** Normalize Job Match fields when Gemini uses alternate key names */
export function normalizeJobMatch(data: Record<string, unknown>): Record<string, unknown> {
  const score = firstNumber(data, [
    'matchScore',
    'match_score',
    'score',
    'overallScore',
    'overall_score',
  ]);

  return {
    ...data,
    matchScore: score,
    fitLevel: String(
      firstValue(data, ['fitLevel', 'fit_level', 'fit', 'level']) ?? 'FAIR',
    ).toUpperCase(),
    matchedRequirements: toStringArray(
      firstValue(data, [
        'matchedRequirements',
        'matched_requirements',
        'requirementsMet',
        'requirements_met',
        'metRequirements',
      ]),
    ),
    unmatchedRequirements: toStringArray(
      firstValue(data, [
        'unmatchedRequirements',
        'unmatched_requirements',
        'requirementsMissing',
        'requirements_missing',
        'missingRequirements',
      ]),
    ),
    strengths: toStringArray(firstValue(data, ['strengths', 'yourStrengths', 'your_strengths'])),
    improvements: toStringArray(
      firstValue(data, [
        'improvements',
        'areasToImprove',
        'areas_to_improve',
        'improvementAreas',
      ]),
    ),
    recommendation: String(
      firstValue(data, ['recommendation', 'summary', 'advice']) ?? '',
    ),
  };
}

/** Normalize ATS fields when Gemini uses alternate key names */
export function normalizeAtsResult(data: Record<string, unknown>): Record<string, unknown> {
  const sectionRaw =
    (firstValue(data, ['sectionScores', 'section_scores', 'sections']) as Record<
      string,
      unknown
    >) || {};

  return {
    ...data,
    atsScore: firstNumber(data, ['atsScore', 'ats_score', 'score', 'overallScore']),
    keywordsFound: toStringArray(
      firstValue(data, ['keywordsFound', 'keywords_found', 'foundKeywords', 'matchedKeywords']),
    ),
    keywordsMissing: toStringArray(
      firstValue(data, [
        'keywordsMissing',
        'keywords_missing',
        'missingKeywords',
        'absentKeywords',
      ]),
    ),
    suggestions: toStringArray(firstValue(data, ['suggestions', 'improvements', 'tips'])),
    sectionScores: {
      skills: firstNumber(sectionRaw, ['skills', 'Skills']) ?? 0,
      experience: firstNumber(sectionRaw, ['experience', 'Experience']) ?? 0,
      education: firstNumber(sectionRaw, ['education', 'Education']) ?? 0,
      formatting: firstNumber(sectionRaw, ['formatting', 'Formatting']) ?? 0,
    },
    summary: String(firstValue(data, ['summary', 'analysis', 'recommendation']) ?? ''),
  };
}

function firstValue(obj: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}

function firstNumber(obj: Record<string, unknown>, keys: string[]): number | undefined {
  const value = firstValue(obj, keys);
  if (value === undefined || value === null || value === '') return undefined;
  const num = typeof value === 'number' ? value : Number(String(value).replace('%', ''));
  return Number.isFinite(num) ? num : undefined;
}

function toStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'skill' in (item as object)) {
          return String((item as { skill: unknown }).skill);
        }
        if (item && typeof item === 'object' && 'name' in (item as object)) {
          return String((item as { name: unknown }).name);
        }
        return String(item);
      })
      .filter(Boolean);
  }
  if (typeof value === 'string') return value.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
  return [];
}
