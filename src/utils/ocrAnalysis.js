import { extractTextFromImage, isSupported } from "expo-text-extractor";
import { analyzeTextForHarmfulIngredients } from "./ingredientMatcher";
import miniLMEmbedder from "@app/ai/miniLMEmbedder";

export { analyzeTextForHarmfulIngredients } from "./ingredientMatcher";

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

  try {
    const semanticResult = await miniLMEmbedder.analyzeText(extractedText);
    return {
      ...semanticResult,
      noTextFound: false,
    };
  } catch {
    return {
      ...analyzeTextForHarmfulIngredients(extractedText),
      noTextFound: false,
      matchMode: "fuzzy",
      semanticAvailable: false,
    };
  }
};
