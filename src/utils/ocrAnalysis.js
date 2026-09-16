import { extractTextFromImage, isSupported } from "expo-text-extractor";
import bannedIngredients from "./bannedIngredients.json";

const SEVERITY_SCORE = {
  high: 90,
  medium: 60,
  low: 30,
};

const normalizeText = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s%-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const termMatches = (normalizedText, term) => {
  const normalizedTerm = normalizeText(term);
  if (!normalizedTerm || normalizedTerm.length < 2) {
    return false;
  }

  if (normalizedTerm.length <= 3) {
    const pattern = new RegExp(`\\b${escapeRegex(normalizedTerm)}\\b`, "i");
    return pattern.test(normalizedText);
  }

  return normalizedText.includes(normalizedTerm);
};

export const analyzeTextForHarmfulIngredients = (rawText) => {
  const normalizedText = normalizeText(rawText);
  const matches = [];

  bannedIngredients.ingredients.forEach((ingredient) => {
    const searchTerms = [ingredient.name, ...ingredient.aliases];
    const matchedTerm = searchTerms.find((term) => termMatches(normalizedText, term));

    if (matchedTerm) {
      matches.push({
        Ingredient: ingredient.name,
        Reason: ingredient.reason,
        Severity: ingredient.severity,
        Percentage: SEVERITY_SCORE[ingredient.severity] ?? 50,
        MatchedTerm: matchedTerm,
      });
    }
  });

  matches.sort((a, b) => b.Percentage - a.Percentage);

  return {
    harmful: matches,
    isClean: matches.length === 0,
    extractedText: rawText.trim(),
  };
};

export const scanImageForHarmfulIngredients = async (imageUri) => {
  if (!isSupported) {
    throw new Error(
      "On-device text recognition is not supported on this device. Use a development build on iOS or Android."
    );
  }

  const textBlocks = await extractTextFromImage(imageUri);
  const extractedText = textBlocks.join("\n");

  if (!extractedText.trim()) {
    return {
      harmful: [],
      isClean: true,
      extractedText: "",
      noTextFound: true,
    };
  }

  return {
    ...analyzeTextForHarmfulIngredients(extractedText),
    noTextFound: false,
  };
};
