# Translation catalogs

Each language has its own dictionary:

- `languages/en.ts`: English source text and the canonical key set.
- `languages/ps.ts`: Pashto translations.
- `languages/fa-af.ts`: Dari translations.

`translations.ts` registers the dictionaries. The localization service handles lookup, language selection, formatting, and direction.

When adding text, add the same English key to all three dictionaries. TypeScript checks Pashto and Dari against the English keys. Keep placeholders such as `{name}` unchanged in translated values. Templates continue to use English source text with the `localize` pipe; unknown text falls back to the original source.
