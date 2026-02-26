# Foil Theme — TCG Metafields Setup Guide

This guide shows you how to add **set name, rarity, card number**, and similar info to your products so Foil can display them as badges and details on your store.

**You can skip this.** Foil works great without it. Come back when you want those extra badges and details on your cards.

---

## In a Nutshell

There are only two big steps:

1. **One-time setup:** Tell Shopify about seven “extra product fields” (set name, rarity, etc.). You do this once per store.
2. **Per product:** On each product page, fill in those fields (e.g. set name “Surging Sparks”, rarity “Rare”). Foil then shows them automatically.

The only fiddly part is step 1: Shopify asks for a special code for each field. You don’t need to understand it — just **copy and paste** the codes from this guide exactly. We’ll tell you where to paste them.

---

## What Each Field Does (And Where It Shows Up)

| What you're adding | Example | Where customers see it |
|--------------------|----------|-------------------------|
| **Set name** | Surging Sparks, Prismatic Evolutions | Badge on the product card; set info on the product page |
| **Set symbol** | A small set icon image | Next to the set name on the product page |
| **Rarity** | Common, Rare, Mythic Rare | Colored dot on the card; rarity badge on the product page |
| **Condition** | NM, LP, MP | Condition badge on the card (if you use it) |
| **Card number** | 006/191 | Shown as something like "#006/191" on the product page |
| **Language** | English, Japanese | Badge on the product page (only when it’s not English) |
| **Release date** | 2025-01-17 or March 2026 | Small date text on the product page |

All of these are optional. Leave any blank and Foil simply won’t show that piece of info.

---

## Part 1: Tell Shopify About the Seven Fields (One-Time)

You only do this once. After that, every product in your store will have these seven “slots” you can fill in.

### Where to go

1. In your Shopify admin, click the **Settings** (gear) icon at the bottom-left.
2. Click **Custom data**, then **Products**.
3. You’ll see a list (maybe empty). Click **Add definition**.

### What you’ll see on the form

Shopify shows a form with a few boxes. The one that matters most is:

- **“Namespace and key”** — This is the special code the theme looks for. You don’t need to invent it; **copy it from below and paste it exactly** (including the dot, no extra spaces). If it’s wrong, the theme won’t find the data.

For each field you also pick a **Type**:

- For six of the seven, choose **“Single line text”** (you type words).
- For **Set symbol** only, choose **“File”** (you upload a small image).

### Add all seven fields

Do this seven times: fill in the form, click **Save**, then click **Add definition** again for the next.

**1. Condition**

- **Name:** `Condition` (or any label you like — this is for you)
- **Namespace and key:** copy-paste exactly: `tcg.condition`
- **Type:** Single line text

**2. Set Name**

- **Name:** `Set Name`
- **Namespace and key:** `tcg.set_name`
- **Type:** Single line text

**3. Set Symbol**

- **Name:** `Set Symbol`
- **Namespace and key:** `tcg.set_symbol`
- **Type:** **File** (this is the only one that’s a file — for the set icon image)

**4. Rarity**

- **Name:** `Rarity`
- **Namespace and key:** `tcg.rarity`
- **Type:** Single line text

**5. Card Number**

- **Name:** `Card Number`
- **Namespace and key:** `tcg.card_number`
- **Type:** Single line text

**6. Language**

- **Name:** `Language`
- **Namespace and key:** `tcg.language`
- **Type:** Single line text

**7. Release Date**

- **Name:** `Release Date`
- **Namespace and key:** `tcg.release_date`
- **Type:** Single line text

When all seven are saved, you’re done with the one-time setup. You won’t need to do this again unless you add a new store.

---

## Part 2: Fill In the Info on Each Product

Now each product can have its own set name, rarity, card number, etc.

### What to do

1. Go to **Products** in the left sidebar and click the product (e.g. a card).
2. Scroll to the **bottom** of the product page.
3. You’ll see a **Metafields** or **Custom data** section with the seven fields you just created.
4. Type (or upload) the info that applies to this product.
5. Click **Save**.

### What to put in each field (examples)

- **Condition** — Short form like `NM`, `LP`, `MP`, `HP`, or `D`. Or leave blank if you only use variants for condition.
- **Set name** — e.g. `Surging Sparks`, `Prismatic Evolutions`, `Hidden Fates`.
- **Set symbol** — Click to upload a small image (e.g. the set’s icon). Optional.
- **Rarity** — e.g. `Common`, `Uncommon`, `Rare`, `Mythic Rare`, `Secret Rare`. See the next section for how Foil colors these.
- **Card number** — However you want it to appear, e.g. `006/191` or `SV59/SV94`.
- **Language** — e.g. `English`, `Japanese`. Only shown on the product page when it’s not English.
- **Release date** — Any format you like, e.g. `2025-01-17` or `March 2026`.

That’s it. Foil will show this info on the product card and product page where it’s designed to appear.

---

## Rarity Colors

If you use these **exact** words in the Rarity field, Foil will give the rarity dot a special color on product cards:

| You type | Dot color |
|----------|-----------|
| Common | Default |
| Uncommon | Silver |
| Rare | Gold/accent |
| Mythic Rare, Ultra Rare, or Secret Rare | Red |

Other words will still show; they’ll just use the default dot style.

---

## Quick Tips

- **Card numbers** — Use the same style everywhere (e.g. always `006/191`) so the store looks consistent.
- **Set symbol** — A small image (around 100×100 pixels) is enough and loads quickly.
- **Condition** — If you already use product variants for condition (Near Mint, Lightly Played, etc.), you can leave the Condition field blank; the theme can use the variant instead.
- **Lots of products?** — Shopify’s bulk edit (if available on your plan) can sometimes edit these fields for many products at once.

---

## Something Not Working?

**“I don’t see Custom data or Metafields.”**  
Go to **Settings → Custom data → Products** and make sure you added all seven fields and clicked Save. After that, scroll to the bottom of any product — the section should be there.

**“I filled everything in but the badges don’t show.”**  
The **Namespace and key** value has to match exactly what’s in this guide — no extra spaces, no different letters. Open **Settings → Custom data → Products**, click each definition, and fix any that don’t match (e.g. `tcg.set_name` with a dot, no space).

**“The set symbol image doesn’t show.”**  
Make sure that field was created as type **File** (not Single line text) and that you’ve uploaded an image for that product.

---

You’re done. Once the seven fields exist and you’ve filled them in on products, Foil will show set name, rarity, card number, and the rest where the theme is designed to. For installing or customizing the theme, see the main **Installation Guide** that came with your purchase.
