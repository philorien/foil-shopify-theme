# Foil

A Shopify 2.0 theme purpose-built for Trading Card Game shops. Dark-mode-first, dense catalog layouts, TCG-specific variant handling, and a component architecture using native Web Components.

Built for stores selling Magic: The Gathering, Pokemon, Yu-Gi-Oh!, One Piece, Lorcana, and similar products.

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/543c7836-f0fe-4f65-8399-5a3dc9c15125" />

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/8079d04a-9d8d-47b0-9bc6-42d8d2d5afaf" />

## Tech Stack

- **Shopify Liquid** — Shopify 2.0 architecture (JSON templates, sections everywhere)
- **Tailwind CSS v3** — compiled via Vite, purged against all `.liquid` files
- **Vanilla JS + Web Components** — no frameworks, `tcg-` prefixed custom elements
- **Vite + vite-plugin-shopify** — asset pipeline with HMR

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)
- A Shopify development store

### Setup

```bash
git clone <repo-url> && cd foil
npm install
cp .env.example .env
```

Edit `.env` and set your store:

```
SHOPIFY_FLAG_STORE=your-store.myshopify.com
```

### Development

```bash
npm run build    # compile assets once
npm run dev      # run Vite + Shopify CLI in parallel
```

`npm run dev` starts two processes:
1. **Vite** — watches `src/` and compiles JS/CSS to `assets/`
2. **Shopify CLI** — syncs theme files to your dev store and serves a preview

### Deploy

```bash
npx shopify theme push --store your-store.myshopify.com
```

## Project Structure

```
assets/              compiled JS/CSS (Vite output) + static assets
config/              settings_schema.json, settings_data.json
layout/              theme.liquid, password.liquid
locales/             en.default.json
sections/            all section .liquid files
snippets/            reusable partials
templates/           JSON templates for all page types
src/
  entrypoints/       theme.js, theme.css (Vite entry points)
  css/               dark-mode.css, animations.css
  js/
    components/      Web Component definitions (tcg-*.js)
    cart-api.js      Shopify AJAX Cart API wrapper
    money.js         Money formatting utility
    recently-viewed.js  localStorage product tracking
    focus-trap.js    Focus trap for modals/drawers
```

## Adding Products

### Required Fields

Every product needs these core Shopify fields:

| Field | Example | Notes |
|---|---|---|
| **Title** | Charizard ex | Card name — shows on card, product page, cart, search |
| **Featured Image** | card scan | Portrait orientation (2.5:3.5 aspect ratio) crops best |
| **Price** | 12.99 | Set on each variant |
| **Product type** | Single | Used for filtering. Other types: `Booster Box`, `Booster Pack`, `Accessory` |
| **Vendor** | Pokemon | Shown above title on product page |

### Variants (for singles with conditions)

The variant picker renders option names as visual badge groups. Standard TCG pattern:

- **Option 1 — Condition:** `Near Mint`, `Lightly Played`, `Moderately Played`, `Heavily Played`, `Damaged`
- **Option 2 — Finish** (optional): `Normal`, `Foil`, `Reverse Foil`

Each variant combination gets its own price, compare-at price, and inventory quantity.

How the theme uses variants:
- Conditions are color-coded as badges (NM = green, LP = indigo, MP = amber, HP/D = red)
- Unavailable combinations show as strikethrough (not hidden — buyers want to know what exists)
- The foil shimmer CSS effect triggers when the variant title contains "Foil"
- "Only X left" appears when inventory is at or below the low stock threshold (default: 3, configurable in theme settings)

### Metafields

These power the metadata badges on product cards and the info block on the product page. **All are optional** — the theme degrades gracefully when any are missing.

| Namespace.Key | Type | Example | Where It Shows |
|---|---|---|---|
| `tcg.condition` | Single line text | `NM` | Condition badge overlay on product card, condition guide trigger on product page |
| `tcg.set_name` | Single line text | `Surging Sparks` | Set badge on product card, product page info block |
| `tcg.set_symbol` | File reference (image) | set symbol PNG | Inline icon next to set name on product page |
| `tcg.rarity` | Single line text | `Rare` | Color-coded rarity dot on product card + badge on product page |
| `tcg.card_number` | Single line text | `006/191` | "#006/191" badge on product page |
| `tcg.language` | Single line text | `Japanese` | Badge on product page (only shown if not "English") |
| `tcg.release_date` | Single line text | `2025-01-17` | Small date text on product page |

**Rarity values the theme recognizes for color-coding:**
- `Common` — default text color dot
- `Uncommon` — silver dot
- `Rare` — accent/gold dot
- `Mythic Rare`, `Ultra Rare`, `Secret Rare` — red dot

#### How to Set Up Metafields in Shopify

Before you can fill in metafield values on products, you need to create the **definitions** first. This tells Shopify what fields exist and what type of data they hold.

**Step 1 — Go to metafield definitions:**

```
Shopify Admin → Settings (bottom-left gear icon) → Custom data → Products → Add definition
```

Or navigate directly to:
`https://your-store.myshopify.com/admin/settings/custom_data/product/metafields`

**Step 2 — Create each definition:**

For each metafield, fill in the "Add definition" form:

| Form Field | What to Enter |
|---|---|
| **Name** | A human-readable label (e.g. "Set Name") |
| **Namespace and key** | The `namespace.key` value from the table above (e.g. `tcg.set_name`) |
| **Description** | Optional — helpful for other store admins |
| **Type** | Select from the dropdown — use "Single line text" for most, "File" for set_symbol |

Create all seven definitions:

| Name | Namespace and key | Type |
|---|---|---|
| Condition | `tcg.condition` | Single line text |
| Set Name | `tcg.set_name` | Single line text |
| Set Symbol | `tcg.set_symbol` | File |
| Rarity | `tcg.rarity` | Single line text |
| Card Number | `tcg.card_number` | Single line text |
| Language | `tcg.language` | Single line text |
| Release Date | `tcg.release_date` | Single line text |

**Step 3 — Fill in values on a product:**

Once definitions exist, go to any product page in the admin:

```
Shopify Admin → Products → [click a product] → scroll to bottom
```

You'll see a **Metafields** section with input fields for each definition you created. Type in the values:

- Condition → `NM`
- Set Name → `Surging Sparks`
- Rarity → `Rare`
- Card Number → `006/191`
- Language → `English`
- Release Date → `2025-01-17`
- Set Symbol → upload a small PNG of the set icon

Hit **Save** and the theme picks them up automatically.

### Images

- **Featured image** — main card scan (required for the product to display well)
- **Additional images** — shown as a thumbnail gallery on the product page (back of card, close-ups, etc.)
- Use clean scans or photos, not stock art. Shopify handles all resizing automatically.

### Collections

Products should be assigned to collections for the homepage and navigation to work:

| Collection | Purpose | Used By |
|---|---|---|
| Game collection (e.g. "Pokemon") | Groups all products for a game | Game selector section, navigation |
| Set collection (e.g. "Surging Sparks") | Groups products from a specific set/expansion | Set spotlight section, set landing pages |
| "New Arrivals" | Recent inventory | Featured products section |

**No collection handles are hardcoded in the theme.** You wire collections to homepage sections through the Shopify theme editor. Even one collection with a few products is enough to see cards rendering.

The **Related Cards** section on the product page pulls from `product.collections.first`, so a product needs to be in at least one collection for related cards to appear.

### Tags

No tags are required by the theme, but Shopify's native filtering (Search & Discovery app) uses tags as filter values. Useful patterns:

```
game:pokemon
rarity:rare
set:surging-sparks
finish:foil
```

### Minimal Test Product

To quickly verify the theme is working, create one product with:

1. **Title** — any card name
2. **Featured image** — one card scan
3. **Vendor** — game name (e.g. "Pokemon")
4. **Product type** — "Single"
5. **One variant** with Condition option set to "Near Mint", a price, and inventory
6. **Metafields** — `tcg.set_name` and `tcg.rarity` (optional but shows off the badges)
7. **Add to a collection** — so it appears in homepage sections and has related cards

## Theme Settings

All visual tokens are controllable from the Shopify theme editor under **Theme Settings**:

| Group | What It Controls |
|---|---|
| **Colors** | Primary, secondary, accent, background, surface, text, border, error, success |
| **Typography** | Heading font, body font, base font size, heading scale |
| **Layout** | Max content width, section spacing, border radius |
| **Product Cards** | Show condition badge, set badge, rarity indicator, foil shimmer, low stock threshold |
| **Cart** | Cart type, upsell slot |
| **Search** | Predictive search, collection results, page results |
| **Dark Mode** | Default mode (dark/light), allow user toggle |
| **TCG Settings** | Default game filter, condition guide style, show card number |
| **Social + Footer** | Social media handles, footer link columns |

## Web Components

All interactive UI is built as native Web Components with the `tcg-` prefix:

| Component | File | What It Does |
|---|---|---|
| `<tcg-cart-drawer>` | `tcg-cart-drawer.js` | Slide-in cart drawer with AJAX updates |
| `<tcg-search-modal>` | `tcg-search-modal.js` | Predictive search overlay with keyboard nav |
| `<tcg-variant-picker>` | `tcg-variant-picker.js` | Visual condition/finish selector with per-variant pricing |
| `<tcg-product-gallery>` | `tcg-product-gallery.js` | Image gallery with thumbnail nav and hover zoom |
| `<tcg-quantity-input>` | `tcg-quantity-input.js` | +/- stepper input |
| `<tcg-dark-mode-toggle>` | `tcg-dark-mode-toggle.js` | Theme toggle with localStorage persistence |
| `<tcg-mobile-menu>` | `tcg-mobile-menu.js` | Slide-in mobile navigation |
| `<tcg-recently-viewed>` | `tcg-recently-viewed.js` | localStorage-driven recently viewed products |

## Page Templates

| Template | File | Sections |
|---|---|---|
| Homepage | `index.json` | Hero banner, game selector, featured collections, featured products, set spotlight |
| Product | `product.json` | Product main, related cards, recently viewed |
| Collection | `collection.json` | Collection header, collection grid (with filters + sort) |
| Cart | `cart.json` | Main cart |
| Search | `search.json` | Main search |
| Blog | `blog.json` | Main blog |
| Article | `article.json` | Main article |
| Generic page | `page.json` | Page content |
| Set landing | `page.set-landing.json` | Set hero, set browse |
| Buylist | `page.buylist.json` | Buylist hero, buylist form, buylist policy |
| Password | `password.json` | Main password |
| 404 | `404.json` | Main 404 |

## License

Proprietary. Not for redistribution.
