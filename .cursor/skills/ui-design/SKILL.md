---
name: ui-design
description: Apply Syrtag's existing visual system when changing public pages, layout, empty states, or responsive behavior. Use for UI polish, header and footer navigation, catalog empty states, focus and touch targets, or questions about spacing, type, and brand consistency.
---

# Syrtag UI design

Use the tokens and components already in the app. Do not introduce a second visual system, an icon set, or a new component library for a one-page tweak.

## Brand

- Warm paper background, ink text, and one blue accent. Tokens live in `src/app/globals.css` (`--bg-page`, `--text-primary`, `--accent-primary`, `--control-height`).
- Headings use the serif display font. Body uses the sans font loaded in `src/app/layout.tsx`.
- Surfaces are quiet: warm paper, hairline borders, soft cards. No glass blur, hue washes, glowing marks, or neon graph chrome on reading pages. The blue accent marks links, the primary action, and the flat node beside the wordmark.
- Advertising UI stays invisible while ads are off. Do not design ad placeholders into a page.

## Layout

- Reading prose stays near 68 characters. Theory and trust pages use the article column.
- Catalog indexes may use the wider page container so cards can sit in a row. The introductory paragraph still stays narrow.
- The primary header lists real routes only: topics, theories, scholars, works, concepts, disciplines, fields, about, pricing, and search. Collapse that list into the menu once it no longer fits (currently 1100px).
- Framework Builder is planned and `noindex`. Do not add it to the primary navigation.
- Controls that a person taps use at least `--control-height` (44px), including icon buttons, search submits, and retry buttons.
- Keep a skip link to `#main-content` and a visible `:focus-visible` ring.

## States

- Empty, unavailable, and not-found states say what happened and offer a real next link: search, a catalog index, the homepage, or About.
- Do not label a recovery link as a knowledge graph unless that graph is on the page.
- The development demo graph is labeled as demo data. Production empty and unavailable states never show it.
- An empty catalog is a publication-status message. It is not an error banner and not a teaser for unpublished articles.

## Before finishing a UI change

- Check the changed page at a narrow width (about 375px) and at a width just below and above the header collapse.
- Confirm keyboard focus can reach the new control and that Escape closes the mobile menu.
- Reuse `PageFrame`, `StaticPage`, and `EntityIndexPage` instead of a one-off shell.
