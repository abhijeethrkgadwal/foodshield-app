# FoodShield

**Eat smart. Stay healthy. Scan, analyse, and choose better — even offline.**

FoodShield is an open-source mobile application that helps people detect **harmful, banned, and restricted ingredients** on packaged food labels using **on-device OCR and local AI**. It is designed to work in **remote places with no internet connection**, where cloud APIs are unavailable and network reliability cannot be assumed.

> **Mission:** Put food-safety awareness in everyone’s pocket — villages, travel routes, disaster zones, and everyday grocery aisles — without requiring a live network.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)](#getting-started)
[![Expo](https://img.shields.io/badge/Expo-SDK%2057-000020.svg)](https://expo.dev/)
[![Offline-first](https://img.shields.io/badge/mode-offline--first-brightgreen.svg)](#how-it-works)

---

## Table of contents

- [Why FoodShield](#why-foodshield)
- [What works today](#what-works-today)
- [How it works](#how-it-works)
- [AI & OCR capabilities](#ai--ocr-capabilities)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Ingredient lists](#ingredient-lists)
- [Roadmap](#roadmap)
- [Community contributions](#community-contributions)
- [AI collaboration opportunities](#ai-collaboration-opportunities)
- [Safety & medical disclaimer](#safety--medical-disclaimer)
- [License](#license)

---

## Why FoodShield

Millions of people buy packaged foods in places where:

- mobile data is expensive, intermittent, or absent
- label language and additive codes (E-numbers / INS) are hard to interpret
- harmful or banned ingredients still appear in local supply chains

FoodShield’s core promise is **offline-first detection**:

1. Point the camera at an ingredients label  
2. Extract text with **on-device OCR** (no cloud upload required for analysis)  
3. Match against **local banned / restricted / harmful lists** using exact, fuzzy, and semantic (MiniLM) matching  
4. Show a clear consume / caution / avoid style result with reasons  

Longer term, the same camera + local AI foundation expands to **spoilage and poison cues**, **produce/animal/fish risk detection**, **barcode scanning**, **community product knowledge**, and **personalized dietary recommendations**.

---

## What works today

### Product experience (shipped)

| Area | Status | Notes |
|------|--------|--------|
| Onboarding & branding | Done | FoodShield intro, “eat smart, stay healthy” |
| Home | Done | Scan CTA; MiniLM model download / ready status |
| Camera scan flow | Done | Permission handling, capture, analysis loader |
| Results screen | Done | Avoid / clean verdict, category, severity, reasons, match mode |
| Ingredient breakdown UI | Done | Banned / restricted / harmful presentation |
| Recommended alternatives sheet | Scaffolded | UI for healthier / vegan alternatives (data-driven ranking planned) |
| Bottom tabs (History, Cart, Profile) | Scaffolded | Navigation shells for future features |

### Offline intelligence (shipped)

| Capability | Status | Detail |
|------------|--------|--------|
| On-device OCR | Done | `expo-text-extractor` on iOS / Android development builds |
| Local ingredient lists (2026) | Done | **23 banned**, **113 restricted**, **22 harmful** entries with aliases, severity, reasons, regions |
| Exact + fuzzy matching | Done | Levenshtein OCR typo tolerance; E/INS codes are exact-only |
| On-device MiniLM embeddings | Done | `all-MiniLM-L6-v2` via React Native ExecuTorch (~86 MB, cached after first download) |
| Semantic merge | Done | Cosine similarity (threshold ~0.58) merged with fuzzy hits; fuzzy-only fallback if MiniLM unavailable |
| No backend required for scan | Done | Analysis path is frontend-only / on-device |

### Platform & engineering (shipped)

| Item | Status |
|------|--------|
| Expo SDK **57**, React Native **0.86**, React **19** | Done |
| Continuous Native Generation (`expo prebuild`) | Done — committed `android/` / `ios/` removed |
| Lightweight UI layer replacing NativeBase | Done (`src/ui`) |
| New Architecture enabled (SDK 57 default) | Done |
| Security / package compliance pass (`expo-doctor`) | Done |
| Open-source Apache License 2.0 | Done (this release) |

### Explicitly not done yet (see [Roadmap](#roadmap))

- Barcode / QR product lookup  
- Community FMCG upload & feedback network  
- Spoilage / decay / poison visual detection  
- Harmful fruit, animal, or fish camera classifiers  
- Full preference-based recommendation engine (weight goals, allergies, vegan/veg/non-veg)  
- Cloud sync (optional, always secondary to offline mode)

---

## How it works

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────────────┐
│  Camera      │────▶│  On-device OCR    │────▶│  Exact + fuzzy matcher      │
│  (label)     │     │  expo-text-       │     │  (local JSON lists)         │
└─────────────┘     │  extractor        │     └──────────────┬──────────────┘
                    └──────────────────┘                    │
                                                            │ merge
                    ┌──────────────────┐     ┌──────────────▼──────────────┐
                    │  MiniLM (local)  │────▶│  Semantic phrase matching   │
                    │  ExecuTorch      │     │  cosine ≥ 0.58              │
                    └──────────────────┘     └──────────────┬──────────────┘
                                                            │
                                                            ▼
                                                 Results: banned /
                                                 restricted / harmful
                                                 + severity + reason
```

**Offline by design:** label images and OCR text are processed on the device for matching. The MiniLM model is downloaded once (when connectivity is available) and then reused from cache so subsequent scans can run without a network.

> **Note:** OCR and ExecuTorch require a **development build** (`npx expo prebuild` + `expo run:android` / `run:ios`). They do **not** run inside Expo Go.

---

## AI & OCR capabilities

### Current

- **OCR:** native on-device text recognition for ingredient panels  
- **Fuzzy recovery:** OCR typos such as `aspartarne` → Aspartame, `high fructose corn syrp` → HFCS  
- **Code safety:** short tokens and E/INS numbers match exactly (avoids `E171` ≈ `E172`)  
- **Semantic understanding:** MiniLM embeddings catch paraphrases and near-synonyms that pure string match misses  
- **Graceful degradation:** if MiniLM is not ready, fuzzy OCR matching still works  

### Planned for collaboration (see also [AI collaboration opportunities](#ai-collaboration-opportunities))

- Multilingual OCR (regional languages on labels)  
- Vision models for freshness / mold / bruising / spoilage  
- Species / produce classifiers (toxic look-alikes, unsafe catch)  
- Barcode + OCR fusion for higher confidence product identity  
- On-device ranking models for dietary alternatives  
- Federated / privacy-preserving learning from community corrections  

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Expo SDK 57 + React Native 0.86 |
| Language | JavaScript (React 19) |
| Navigation | React Navigation (stack + bottom tabs) |
| Camera | `expo-camera` |
| OCR | `expo-text-extractor` |
| Local AI | `react-native-executorch` + MiniLM (`all-MiniLM-L6-v2`) |
| UI | Custom lightweight primitives in `src/ui` |
| Lists | Versioned JSON schema (`src/utils/ingredientLists_2026_formatted.json`) |

**Requirements:** Node.js `>= 20.19.4`, Xcode (iOS) or Android SDK, physical device or emulator for camera testing.

---

## Getting started

```bash
git clone https://github.com/abhijeethrkgadwal/foodshield-app.git
cd foodshield-app
npm install

# Generate native projects (Continuous Native Generation)
npx expo prebuild

# Run on a device / emulator (required for OCR + MiniLM)
npx expo run:android
# or
npx expo run:ios
```

Useful scripts:

```bash
npm start          # Expo Metro
npm run doctor     # expo-doctor health check
npm run lint       # ESLint
```

On first launch with network, MiniLM (~86 MB) downloads and caches. After that, scans are intended to work **without internet**.

---

## Project structure

```
foodshield-app/
├── App.js
├── app.json
├── LICENSE                 # Apache License 2.0
├── NOTICE
├── README.md
└── src/
    ├── ai/                 # MiniLM embedder + React provider
    ├── assets/             # Fonts, images, SVGs
    ├── components/         # Header, Ingredients, Loader, Product, Recommended
    ├── constants/          # Screen names
    ├── navigation/         # Stack + bottom tabs
    ├── screens/            # Onboarding, Home, Scan, Result
    ├── theme/              # Colors / typography theme
    ├── ui/                 # Lightweight RN UI primitives
    └── utils/
        ├── ingredientLists_2026_formatted.json
        ├── ingredientList.schema.example.json
        ├── ingredientMatcher.js
        └── ocrAnalysis.js
```

---

## Ingredient lists

Canonical data: `src/utils/ingredientLists_2026_formatted.json`

| Category | Count (2026 list) | Meaning |
|----------|-------------------|---------|
| **Banned** | 23 | Not permitted in one or more major jurisdictions |
| **Restricted** | 113 | Allowed only under limits / contexts |
| **Harmful** | 22 | Associated with elevated health risk; advise caution |

Each entry may include `name`, `aliases`, `severity`, `reason`, and `regions`.  
Duplicates across lists prefer the stricter category: **banned → restricted → harmful**.

Schema example: `src/utils/ingredientList.schema.example.json`.

Community PRs that improve regional coverage, aliases (including local-language spellings), and evidence-backed reasons are strongly encouraged — see [Community contributions](#community-contributions).

---

## Roadmap

Roadmap items are expectations for contributors and collaborators, not delivery dates.

### Phase 1 — Harden the offline core *(in progress / near-term)*

- [x] Camera label scan  
- [x] On-device OCR  
- [x] Local banned / restricted / harmful lists  
- [x] Fuzzy OCR matching  
- [x] On-device MiniLM semantic matching  
- [ ] Multilingual OCR & alias packs (Hindi, Telugu, Tamil, Spanish, etc.)  
- [ ] Scan history persisted on device  
- [ ] Offline explainability (“why flagged”) with citations  
- [ ] Accessibility (screen readers, high-contrast results)  

### Phase 2 — Camera intelligence beyond labels

- [ ] **Poisonous / unsafe food cues** from visual appearance  
- [ ] **Decay / spoilage / mold detection** for produce and leftovers  
- [ ] **Harmful fruit** look-alike detection (toxic vs edible species guidance)  
- [ ] **Animal / fish risk signals** (unsafe handling cues, known high-risk species hints)  
- [ ] All of the above runnable **without local internet**, using on-device vision models  

### Phase 3 — Identity: barcode + product graph

- [ ] Barcode / QR scan to identify FMCG / consumable products  
- [ ] Hybrid barcode + OCR confirmation when packaging is damaged  
- [ ] Local cache of frequent products for fully offline repeat scans  
- [ ] Optional sync when connectivity returns  

### Phase 4 — Community communication layer

- [ ] In-app feedback on scan quality (“false positive / false negative”)  
- [ ] Community ability to **add new FMCG / consumable products**  
- [ ] Crowd ratings: consume / caution / avoid, with transparency on sample size  
- [ ] Moderation workflow for safety-critical claims  
- [ ] Privacy-first contribution model (minimal PII; prefer on-device aggregation)  

### Phase 5 — Personalization & recommendations

- [ ] User preferences: lose weight, gain weight, maintain  
- [ ] Dietary patterns: vegetarian, non-vegetarian, vegan  
- [ ] Health restrictions & allergies  
- [ ] Recommend **safer alternative products** matching preferences  
- [ ] Ranking that balances safety score + preference fit + local availability hints  

### Phase 6 — Long-term vision

An application that can:

1. Scan a **barcode** *or* an ingredients panel *or* (later) food itself  
2. Detect harmful ingredients / products with **OCR + local AI** offline  
3. Collect community knowledge about new consumables  
4. Rate whether to consume based on evidence + user preferences  
5. Suggest alternatives aligned with health goals and dietary restrictions  

---

## Community contributions

FoodShield is public so researchers, mobile engineers, nutritionists, regulators, and field volunteers can improve it together.

### Ways to help

| Contribution type | Examples |
|-------------------|----------|
| **Ingredient intelligence** | New banned/restricted entries, aliases, regional spellings, E/INS crosswalks |
| **OCR robustness** | Harder label photosets, language packs, preprocessing tips |
| **On-device AI** | Smaller/faster embedding models, vision classifiers, quantization |
| **Product UX** | Clearer verdicts, accessibility, low-literacy UI modes |
| **Community data** | Product schemas, moderation rules, rating aggregation design |
| **Localization** | App strings + ingredient aliases in local languages |
| **Field testing** | Offline tests in low-connectivity regions; report failure modes |
| **Documentation** | Setup guides, model cards, safety evaluation write-ups |

### How to contribute

1. Fork the repository and create a branch: `git checkout -b feature/your-change`  
2. Keep PRs focused (one concern per PR)  
3. For list changes, follow `ingredientList.schema.example.json` and cite a public regulatory or scientific source in the PR description  
4. Run `npm run doctor` and exercise the scan flow on a development build when touching OCR/AI  
5. Open a pull request with: problem → approach → offline impact → screenshots / sample labels if UI  

### Contribution guidelines (safety-critical)

- Do **not** claim medical diagnosis or treatment.  
- Prefer primary sources (FDA, EFSA, FSSAI, Codex, peer-reviewed reviews) for ingredient reasons.  
- Mark uncertain community claims clearly; never silently override regulatory “banned” entries.  
- Avoid shipping large binary models in git; document download URLs, hashes, and license terms.  
- By contributing, you agree your contributions are licensed under the **Apache License 2.0**.

### Code of conduct expectation

Be respectful, evidence-based, and mindful that FoodShield may be used by people with limited alternatives. Harassment and unsafe advice will not be accepted.

---

## AI collaboration opportunities

We welcome collaboration on:

1. **On-device NLP** — better ingredient NER from noisy OCR; multilingual tokenizers  
2. **Embedding search** — improved thresholds, hard-negative mining, region-aware indices  
3. **Vision models** — spoilage, mold, bruise, packaging damage; toxic look-alike produce  
4. **Multimodal fusion** — barcode + OCR + vision confidence scoring  
5. **Recommendation ML** — constrained optimization under allergies / vegan / calorie goals  
6. **Evaluation** — public benchmarks for label OCR → ingredient F1; spoilage detection datasets  
7. **Privacy ML** — federated updates from community corrections without centralizing photos  
8. **Edge performance** — INT8/FP16 quantization, Core ML / NNAPI / ExecuTorch backends  

If you want to propose a model or dataset partnership, open a GitHub Discussion / Issue with: goal, on-device constraints (RAM / size / latency), license of weights/data, and offline behavior when the model is missing.

---

## Safety & medical disclaimer

FoodShield is an **informational tool**, not a medical device and not a substitute for professional dietary, toxicology, or regulatory advice. Ingredient lists and AI matches can be incomplete or wrong. Always verify critical decisions with packaging, manufacturers, and qualified professionals. Use at your own risk. See the [License](./LICENSE) for warranty disclaimer and limitation of liability.

---

## License

Copyright © 2024–2026 Abhijeeth Gadwal and FoodShield contributors.

This project is licensed under the **Apache License, Version 2.0**.

You may use, reproduce, modify, and distribute FoodShield (including commercially) under the terms of the License. Patent grants and contribution terms follow Apache-2.0. See the full text in [`LICENSE`](./LICENSE) and attribution notes in [`NOTICE`](./NOTICE).

```
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
```

Third-party libraries and model weights remain under their own licenses.

---

## Maintainers

- **Abhijeeth Gadwal** — product & project lead  
- Community contributors — welcome via pull requests and issues  

**Repository:** [github.com/abhijeethrkgadwal/foodshield-app](https://github.com/abhijeethrkgadwal/foodshield-app)

---

*FoodShield — harmful ingredient awareness with OCR and local AI, built for places where the internet is optional.*
