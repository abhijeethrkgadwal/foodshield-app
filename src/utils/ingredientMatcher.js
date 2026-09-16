import bannedIngredients from "./bannedIngredients.json";

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

// Max edit distance allowed for OCR typos, by term length.
const fuzzyThreshold = (termLength) => {
  if (termLength <= 3) return 0;
  if (termLength <= 6) return 1;
  if (termLength <= 12) return 2;
  return 3;
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

const findBestFuzzyMatch = (normalizedText, normalizedTerm) => {
  const tokens = tokenize(normalizedText);
  const termTokens = tokenize(normalizedTerm);
  const windowSize = Math.max(termTokens.length, 1);
  const threshold = fuzzyThreshold(normalizedTerm.length);

  let best = null;

  for (let size = Math.max(1, windowSize - 1); size <= windowSize + 1; size += 1) {
    for (let i = 0; i <= tokens.length - size; i += 1) {
      const window = tokens.slice(i, i + size).join(" ");
      const distance = levenshtein(window, normalizedTerm);

      if (distance <= threshold && (!best || distance < best.distance)) {
        best = {
          matchedText: window,
          distance,
          exact: distance === 0,
        };
      }
    }
  }

  return best;
};

const termMatches = (normalizedText, term) => {
  const normalizedTerm = normalizeText(term);
  if (!normalizedTerm || normalizedTerm.length < 2) {
    return null;
  }

  // Exact match first (faster + more reliable for short codes like E250).
  if (normalizedTerm.length <= 3) {
    const pattern = new RegExp(`\\b${escapeRegex(normalizedTerm)}\\b`, "i");
    if (pattern.test(normalizedText)) {
      return {
        matchedTerm: term,
        matchedText: normalizedTerm,
        exact: true,
        distance: 0,
      };
    }
    return null;
  }

  if (normalizedText.includes(normalizedTerm)) {
    return {
      matchedTerm: term,
      matchedText: normalizedTerm,
      exact: true,
      distance: 0,
    };
  }

  // Fuzzy match for OCR typos (e.g. "aspartarne" ≈ "aspartame").
  const fuzzy = findBestFuzzyMatch(normalizedText, normalizedTerm);
  if (!fuzzy) {
    return null;
  }

  return {
    matchedTerm: term,
    matchedText: fuzzy.matchedText,
    exact: fuzzy.exact,
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
  const matches = [];
  const seen = new Set();

  flattenIngredientLists(data).forEach((ingredient) => {
    const searchTerms = [ingredient.name, ...(ingredient.aliases ?? [])];
    let bestMatch = null;

    searchTerms.forEach((term) => {
      const result = termMatches(normalizedText, term);
      if (!result) return;
      if (!bestMatch || result.distance < bestMatch.distance) {
        bestMatch = result;
      }
    });

    if (!bestMatch) return;

    const key = ingredient.name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    matches.push({
      Ingredient: ingredient.name,
      Reason: ingredient.reason,
      Severity: ingredient.severity,
      Category: CATEGORY_LABEL[ingredient.category] ?? ingredient.category,
      CategoryKey: ingredient.category,
      Percentage: SEVERITY_SCORE[ingredient.severity] ?? 50,
      MatchedTerm: bestMatch.matchedTerm,
      MatchedText: bestMatch.matchedText,
      ExactMatch: bestMatch.exact,
      FuzzyDistance: bestMatch.distance,
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
