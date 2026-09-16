import { extractTextFromImage, isSupported } from "expo-text-extractor";
import { analyzeTextForHarmfulIngredients } from "./ingredientMatcher";

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

  return {
    ...analyzeTextForHarmfulIngredients(extractedText),
    noTextFound: false,
  };
};
