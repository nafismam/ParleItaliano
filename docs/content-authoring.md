# Grammar content and notes rendering

The curated catalog is maintained in `packages/content/src/catalog.ts` and `packages/content/src/additional-catalog.ts`. The suggested roadmap and mapping to the learner's requested scope are in [curriculum.md](curriculum.md). Lesson wording and exercises are original; the initial lessons cite their source pages, and the expanded-course references checked to date are listed below. `npm run seed` validates every topic with the shared Zod contract before it reaches MongoDB. Seeding upserts stable topic slugs and stable exercise UUIDs, so repeating a content refresh preserves progress references. It never clears learner data.

## Editorial shape

A lesson uses a short orientation, a sequence of numbered steps, contrast and conjugation tables, a focused rule callout, expand-and-collapse `<details>` sections, an audio cue for natural examples, a short active-recall checklist, and a flashcard. These blocks keep the notes readable on narrow screens as well as on a wide split-screen learning view.

The shared reader uses React Markdown and GFM for tables, callouts, and checklists. A small allowlist maps `AudioButton` and `Flashcard` data declarations and native `<details>` blocks to local React components. Raw HTML and arbitrary JSX are skipped; no stored MDX is compiled or evaluated. Audio uses browser Italian speech synthesis where available, with visible text and an unavailable status when synthesis fails. Disclosures, checklists, flashcards, and audio controls support keyboard interaction.

Lesson records are authored and deployed trusted content; do not accept learner-provided MDX. The renderer must parse Markdown/MDX into an allowlisted syntax tree and map the few declared component names to local UI primitives. It must never evaluate compiled MDX, `eval` code, remote imports, scripts, event attributes, or arbitrary JSX read from the database. Answer and explanation fields stay on the server until an exercise is submitted and graded.

## References checked

- Treccani, _La grammatica italiana_ (2012), [Articoli determinativi](https://www.treccani.it/enciclopedia/articoli-determinativi_%28La-grammatica-italiana%29/). Checked for gender/number forms, _lo/gli_ sound rules, vowel elision, and plural feminine _le_.
- Treccani, [Genere dei nomi](https://www.treccani.it/enciclopedia/genere-dei-nomi_%28La-grammatica-italiana%29/), [Plurale dei nomi](https://www.treccani.it/enciclopedia/plurale-dei-nomi_%28La-grammatica-italiana%29/), and [Articoli indeterminativi](https://www.treccani.it/enciclopedia/articoli-indeterminativi_%28La-grammatica-italiana%29/). Page titles were checked for the corresponding noun and article lessons.
- Treccani, _La grammatica italiana_ (2012), [Tempi verbali](https://www.treccani.it/enciclopedia/tempi-verbali_%28La-grammatica-italiana%29/). Checked for the organization of simple and compound tenses. The examples and auxiliary guidance are original teaching prose.
- Treccani, _La grammatica italiana_ (2012), [Pronomi personali](https://www.treccani.it/enciclopedia/pronomi-personali_%28La-grammatica-italiana%29/). Checked for direct-object and dative functions, unstressed forms, and combinations of clitics.
- Treccani, [Andare](https://www.treccani.it/vocabolario/andare/). Checked as a verb-entry reference while editing the compound-tense lesson.

I could not check the Accademia della Crusca website because it denied access from this cloud environment. The lesson references are linked directly so an editor can check them again when needed.
