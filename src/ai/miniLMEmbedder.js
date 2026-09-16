import {
  analyzeTextForHarmfulIngredients,
  flattenIngredientLists,
  normalizeText,
} from "@app/utils/ingredientMatcher";

const SEMANTIC_THRESHOLD = 0.58;
const MAX_OCR_PHRASES = 40;

let executorchModulePromise = null;

const loadExecutorch = () => {
  if (!executorchModulePromise) {
    executorchModulePromise = import("react-native-executorch");
  }
  return executorchModulePromise;
};

export const cosineSimilarity = (a, b) => {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    sum += a[i] * b[i];
  }
  return sum;
};

const extractCandidatePhrases = (rawText) => {
  const normalized = normalizeText(rawText);
  const chunks = rawText
    .split(/[\n,;•·|/]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const phrases = new Set();
  chunks.forEach((chunk) => {
    const cleaned = normalizeText(chunk);
    if (cleaned.length >= 3) phrases.add(cleaned);
  });

  // Sliding windows over words catch multi-word ingredients inside long lines.
  const words = normalized.split(" ").filter(Boolean);
  for (let size = 1; size <= 4; size += 1) {
    for (let i = 0; i <= words.length - size; i += 1) {
      const window = words.slice(i, i + size).join(" ");
      if (window.length >= 3) phrases.add(window);
    }
  }

  return [...phrases].slice(0, MAX_OCR_PHRASES);
};

class MiniLMEmbedderService {
  constructor() {
    this.embedder = null;
    this.index = [];
    this.isReady = false;
    this.isLoading = false;
    this.downloadProgress = 0;
    this.error = null;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  getState() {
    return {
      isReady: this.isReady,
      isLoading: this.isLoading,
      downloadProgress: this.downloadProgress,
      error: this.error,
      indexedCount: this.index.length,
    };
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  async ensureReady({ force = false } = {}) {
    if (this.isReady && !force) return this.getState();
    if (this.isLoading) {
      return new Promise((resolve) => {
        const unsubscribe = this.subscribe((state) => {
          if (state.isReady || state.error) {
            unsubscribe();
            resolve(state);
          }
        });
      });
    }

    this.isLoading = true;
    this.error = null;
    this.downloadProgress = 0;
    this.notify();

    try {
      const { createTextEmbedder, download, models } = await loadExecutorch();
      const modelConfig = await download(
        models.textEmbeddings.ALL_MINILM_L6_V2.DEFAULT,
        {
          onProgress: (progress) => {
            this.downloadProgress = Math.round(progress * 100);
            this.notify();
          },
        }
      );

      this.embedder = await createTextEmbedder(modelConfig);
      await this.buildIngredientIndex();
      this.isReady = true;
      this.isLoading = false;
      this.downloadProgress = 100;
      this.notify();
      return this.getState();
    } catch (error) {
      this.isReady = false;
      this.isLoading = false;
      this.error = error;
      this.notify();
      throw error;
    }
  }

  async buildIngredientIndex() {
    const ingredients = flattenIngredientLists();
    const entries = [];

    for (const ingredient of ingredients) {
      const terms = [ingredient.name, ...(ingredient.aliases ?? [])].filter(
        (term) => normalizeText(term).length >= 3
      );

      for (const term of terms) {
        const vector = await this.embedder.embed(term);
        entries.push({
          ingredient,
          term,
          vector,
        });
      }
    }

    this.index = entries;
  }

  async findSemanticMatches(rawText) {
    if (!this.isReady || !this.embedder) {
      return [];
    }

    const phrases = extractCandidatePhrases(rawText);
    const phraseVectors = [];

    for (const phrase of phrases) {
      const vector = await this.embedder.embed(phrase);
      phraseVectors.push({ phrase, vector });
    }

    const bestByIngredient = new Map();

    phraseVectors.forEach(({ phrase, vector }) => {
      this.index.forEach((entry) => {
        const score = cosineSimilarity(vector, entry.vector);
        if (score < SEMANTIC_THRESHOLD) return;

        const key = entry.ingredient.name.toLowerCase();
        const current = bestByIngredient.get(key);
        if (!current || score > current.score) {
          bestByIngredient.set(key, {
            ingredient: entry.ingredient,
            term: entry.term,
            phrase,
            score,
          });
        }
      });
    });

    return [...bestByIngredient.values()];
  }

  async analyzeText(rawText) {
    const base = analyzeTextForHarmfulIngredients(rawText);

    try {
      await this.ensureReady();
    } catch {
      return {
        ...base,
        matchMode: "fuzzy",
        semanticAvailable: false,
      };
    }

    const semanticHits = await this.findSemanticMatches(rawText);
    const seen = new Set(base.harmful.map((item) => item.Ingredient.toLowerCase()));
    const merged = [...base.harmful];

    semanticHits.forEach((hit) => {
      const key = hit.ingredient.name.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);

      const severity = hit.ingredient.severity ?? "medium";
      const severityScore = { high: 90, medium: 60, low: 30 }[severity] ?? 50;

      merged.push({
        Ingredient: hit.ingredient.name,
        Reason: hit.ingredient.reason,
        Severity: severity,
        Category:
          hit.ingredient.category === "banned"
            ? "Banned"
            : hit.ingredient.category === "restricted"
              ? "Restricted"
              : "Harmful",
        CategoryKey: hit.ingredient.category,
        Percentage: severityScore,
        MatchedTerm: hit.term,
        MatchedText: hit.phrase,
        ExactMatch: false,
        FuzzyDistance: null,
        SemanticScore: Number(hit.score.toFixed(3)),
        MatchType: "semantic",
        Regions: hit.ingredient.regions ?? [],
      });
    });

    merged.sort((a, b) => {
      if (b.Percentage !== a.Percentage) return b.Percentage - a.Percentage;
      const aScore = a.SemanticScore ?? (a.ExactMatch ? 1 : 0.7);
      const bScore = b.SemanticScore ?? (b.ExactMatch ? 1 : 0.7);
      return bScore - aScore;
    });

    return {
      harmful: merged,
      isClean: merged.length === 0,
      extractedText: rawText.trim(),
      matchMode: "minilm+fuzzy",
      semanticAvailable: true,
      semanticHits: semanticHits.length,
    };
  }

  dispose() {
    this.embedder?.dispose?.();
    this.embedder = null;
    this.index = [];
    this.isReady = false;
    this.notify();
  }
}

const miniLMEmbedder = new MiniLMEmbedderService();

export default miniLMEmbedder;
