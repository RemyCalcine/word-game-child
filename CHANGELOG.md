# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project loosely follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.2.0] - 2026-06-21

### Added
- **In-app word editor** (⚙️ on the start screen): edit the word list without
  touching the code — per-word fields (word, optional hint, Nether toggle,
  delete), reorder by drag-and-drop or ▲/▼ buttons, live syllable-split preview,
  add a row, and reset to the default list.
- **Local persistence**: the word list and the child's first name are saved in
  the browser (`localStorage`); `src/words.js` is the default seed.
- **Personalized messages** using the child's name (start greeting, spoken
  praise, end recap).
- **Randomized praise and encouragement** messages (with or without the name)
  for a more natural, less repetitive feel.
- **Nether**: after a wrong attempt the child can retry or skip; the recall
  test never displays a "lose".
- Recap screen now shows a cumulative diamond total and a "Quitter la partie"
  button that returns to the start screen to reconfigure the words.

### Fixed
- Each new word was spoken twice on every screen (removed the React
  `StrictMode` double-invoke of mount effects in dev).
- The full word is now spoken on the writing step (previously only the last
  syllable from the previous step could be heard).
- In the syllable puzzle, the last syllable now finishes before the praise
  plays (the praise no longer cuts it off).

### Changed
- The end of the Nether now leads to a **shared recap** that returns to the main
  recap, enriched with the Nether result and the combined total.
- Replaced the separate `EndScreen` / `NetherEndScreen` with a single shared
  `RecapScreen`.

## [0.1.0] - 2026-06-20

### Added
- Initial **Vite + React** app ("Les Mots Blocs"), a Minecraft-themed game to
  help a child revise spelling words.
- Per-word flow: **Discover → Syllables → Write → Win**, with French syllable
  auto-splitting and a hyphen override in the word list.
- Optional **Nether** recall mode for words tagged `nether: true`.
- French speech synthesis (`speechSynthesis`, fr-FR) with Chrome workarounds.
- Design-system visuals (pixel theme, CSS tokens, fonts, letter/syllable tiles,
  HUD).
- Unit tests (Vitest) for the pure syllable-splitting logic.

[Unreleased]: https://github.com/RemyCalcine/word-game-child/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/RemyCalcine/word-game-child/releases/tag/v0.2.0
[0.1.0]: https://github.com/RemyCalcine/word-game-child/releases/tag/v0.1.0
