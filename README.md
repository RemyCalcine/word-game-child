# Les Mots Blocs

A lightweight, Minecraft-themed web game that helps a child revise their French
spelling words (*mots de dictée*). For each word the child discovers it, plays
with its syllables, types it letter by letter, and gets a celebratory reward.
An optional **Nether** mode is a from-memory recall challenge.

The game is in **French** (sounds, syllables and spelling rules are
French-specific). Built with **Vite + React**, no backend and no account.

## Requirements

- [Node.js](https://nodejs.org/) **20.19+ or 22.12+** (required by Vite 8)
- npm (bundled with Node)

## Install & run locally

```bash
npm install      # install dependencies
npm run dev      # start the dev server → http://localhost:5173
```

Open the printed URL (default <http://localhost:5173>) in your browser.

### Other scripts

```bash
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run test     # run the unit tests (Vitest)
npm run lint     # run ESLint
```

> The production build uses ES modules, so `dist/index.html` must be served over
> HTTP (e.g. `npm run preview`) — opening it directly via `file://` won't work.

## Customizing the words

Two ways to set the word list:

- **In the app (recommended):** click the **⚙️** button on the start screen.
  You can add/remove/reorder words (drag-and-drop or ▲/▼), set an optional hint,
  toggle the 🔥 Nether bonus per word, and enter the child's first name. Changes
  are saved in the browser (`localStorage`) and survive reloads.
- **In code (default list):** edit the `MOTS` array in [`src/words.js`](src/words.js).
  This is the seed used on first launch and by the editor's "Reset" button.

Each entry can be:

- `"ciel"` — just the word (syllables are split automatically);
- `"mi-lieu"` — add a hyphen where you want to cut syllables (only needed when
  the automatic split is wrong);
- `{ mot: "milieu", indice: "Le centre de quelque chose", nether: true }` — with
  an optional hint and/or the `nether: true` flag (recall challenge at the end).

## Project layout

See [`CLAUDE.md`](CLAUDE.md) for the architecture (screens, state machine, voice
synthesis, syllable logic) and [`CHANGELOG.md`](CHANGELOG.md) for the history of
changes.
