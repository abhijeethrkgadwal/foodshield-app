import bannedIngredients from "./ingredientLists_2026_formatted.json";

const SEVERITY_SCORE = {
  high: 90,
  medium: 60,
  low: 30,
};

const CATEGORY_LABEL = {
  banned: "Banned",
  restricted: "Restricted",
  harmful: "Harmful",
};

// Additive codes and short tokens must match exactly to avoid E171 ≈ E172 false positives.
const isExactOnlyTerm = (normalizedTerm) => {
  if (normalizedTerm.length <= 4) return true;
  return /^(e|ins)\s*\d+[a-z]?$/.test(normalizedTerm);
};

// Max edit distance for OCR typos, by term length. Kept strict on purpose.
const fuzzyThreshold = (termLength) => {
  if (termLength <= 5) return 0;
  if (termLength <= 8) return 1;
  if (termLength <= 14) return 2;
  return 3;
};

const isWindowClaimed = (window, claimedWindows) => {
  if (claimedWindows.has(window)) return true;
  for (const claimed of claimedWindows) {
    if (claimed.includes(window) || window.includes(claimed)) return true;
  }
  return false;
};

export const normalizeText = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s%-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const levenshtein = (a, b) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
};

const tokenize = (text) => text.split(" ").filter(Boolean);

const hasExactTerm = (normalizedText, normalizedTerm) => {
  if (!normalizedTerm) return false;
  const pattern = new RegExp(`\\b${escapeRegex(normalizedTerm)}\\b`, "i");
  return pattern.test(normalizedText);
};

const findBestFuzzyMatch = (normalizedText, normalizedTerm, claimedWindows) => {
  if (isExactOnlyTerm(normalizedTerm)) return null;

  const tokens = tokenize(normalizedText);
  const termTokens = tokenize(normalizedTerm);
  const windowSize = Math.max(termTokens.length, 1);
  const threshold = fuzzyThreshold(normalizedTerm.length);

  let best = null;

  for (let size = Math.max(1, windowSize - 1); size <= windowSize + 1; size += 1) {
    for (let i = 0; i <= tokens.length - size; i += 1) {
      const window = tokens.slice(i, i + size).join(" ");

      // Skip windows already claimed by an exact ingredient match
      // (prevents sodium nitrite → sodium nitrate via token "nitrite").
      if (isWindowClaimed(window, claimedWindows)) continue;

      const distance = levenshtein(window, normalizedTerm);
      const ratio = distance / normalizedTerm.length;

      if (
        distance > 0 &&
        distance <= threshold &&
        ratio <= 0.25 &&
        (!best || distance < best.distance)
      ) {
        best = {
          matchedText: window,
          distance,
          exact: false,
        };
      }
    }
  }

  return best;
};

const matchExactTerm = (normalizedText, term) => {
  const normalizedTerm = normalizeText(term);
  if (!normalizedTerm || normalizedTerm.length < 2) return null;

  if (!hasExactTerm(normalizedText, normalizedTerm)) return null;

  return {
    matchedTerm: term,
    matchedText: normalizedTerm,
    exact: true,
    distance: 0,
  };
};

const matchFuzzyTerm = (normalizedText, term, claimedWindows) => {
  const normalizedTerm = normalizeText(term);
  if (!normalizedTerm || normalizedTerm.length < 2) return null;

  const fuzzy = findBestFuzzyMatch(normalizedText, normalizedTerm, claimedWindows);
  if (!fuzzy) return null;

  return {
    matchedTerm: term,
    matchedText: fuzzy.matchedText,
    exact: false,
    distance: fuzzy.distance,
  };
};

export const flattenIngredientLists = (data = bannedIngredients) => {
  // Supports both the new schema ({ lists: { banned, restricted, harmful } })
  // and the older flat schema ({ ingredients: [...] }).
  if (Array.isArray(data.ingredients)) {
    return data.ingredients.map((item) => ({
      ...item,
      category: item.category ?? "harmful",
    }));
  }

  const lists = data.lists ?? {};
  return ["banned", "restricted", "harmful"].flatMap((category) =>
    (lists[category] ?? []).map((item) => ({
      ...item,
      category,
    }))
  );
};

export const analyzeTextForHarmfulIngredients = (rawText, data = bannedIngredients) => {
  const normalizedText = normalizeText(rawText);
  const ingredients = flattenIngredientLists(data);
  const matches = [];
  const seen = new Set();
  const claimedWindows = new Set();

  // Pass 1: exact matches only (highest confidence).
  ingredients.forEach((ingredient) => {
    const searchTerms = [ingredient.name, ...(ingredient.aliases ?? [])];
    let bestMatch = null;

    searchTerms.forEach((term) => {
      const result = matchExactTerm(normalizedText, term);
      if (!result) return;
      if (!bestMatch || result.matchedText.length > bestMatch.matchedText.length) {
        bestMatch = result;
      }
    });

    if (!bestMatch) return;

    const key = ingredient.name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    claimedWindows.add(bestMatch.matchedText);
    tokenize(bestMatch.matchedText).forEach((token) => {
      if (token.length > 3) claimedWindows.add(token);
    });

    matches.push({
      Ingredient: ingredient.name,
      Reason: ingredient.reason,
      Severity: ingredient.severity,
      Category: CATEGORY_LABEL[ingredient.category] ?? ingredient.category,
      CategoryKey: ingredient.category,
      Percentage: SEVERITY_SCORE[ingredient.severity] ?? 50,
      MatchedTerm: bestMatch.matchedTerm,
      MatchedText: bestMatch.matchedText,
      ExactMatch: true,
      FuzzyDistance: 0,
      MatchType: "exact",
      Regions: ingredient.regions ?? [],
    });
  });

  // Pass 2: fuzzy OCR matches for ingredients not already found.
  ingredients.forEach((ingredient) => {
    const key = ingredient.name.toLowerCase();
    if (seen.has(key)) return;

    const searchTerms = [ingredient.name, ...(ingredient.aliases ?? [])];
    let bestMatch = null;

    searchTerms.forEach((term) => {
      const result = matchFuzzyTerm(normalizedText, term, claimedWindows);
      if (!result) return;
      if (!bestMatch || result.distance < bestMatch.distance) {
        bestMatch = result;
      }
    });

    if (!bestMatch) return;

    seen.add(key);
    claimedWindows.add(bestMatch.matchedText);

    matches.push({
      Ingredient: ingredient.name,
      Reason: ingredient.reason,
      Severity: ingredient.severity,
      Category: CATEGORY_LABEL[ingredient.category] ?? ingredient.category,
      CategoryKey: ingredient.category,
      Percentage: SEVERITY_SCORE[ingredient.severity] ?? 50,
      MatchedTerm: bestMatch.matchedTerm,
      MatchedText: bestMatch.matchedText,
      ExactMatch: false,
      FuzzyDistance: bestMatch.distance,
      MatchType: "fuzzy",
      Regions: ingredient.regions ?? [],
    });
  });

  matches.sort((a, b) => {
    if (b.Percentage !== a.Percentage) return b.Percentage - a.Percentage;
    return a.FuzzyDistance - b.FuzzyDistance;
  });

  return {
    harmful: matches,
    isClean: matches.length === 0,
    extractedText: rawText.trim(),
  };
};
