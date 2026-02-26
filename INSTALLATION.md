# Foil Theme — Installation Guide

Thank you for purchasing Foil! This guide will walk you through installing the theme on your Shopify store. You don’t need any coding or technical experience — just follow the steps in order.

---

## What You’ll Need

- **A Shopify store.** If you don’t have one yet, you can start a free trial at [shopify.com](https://www.shopify.com).
- **The theme file** you downloaded after purchase. It should be a single file named something like `foil-theme.zip` (or similar). Do **not** unzip it — Shopify needs the `.zip` file as-is.

---

## Part 1: Upload the Theme to Shopify

### Step 1: Open your Shopify admin

1. Go to [shopify.com](https://www.shopify.com) and **log in** to your store.
2. You’ll land on your **admin dashboard** (the back office where you manage products, orders, and settings).

### Step 2: Go to the Themes page

1. In the **left sidebar**, click **Online Store**.
2. Click **Themes**.

You’ll see a list of themes currently on your store (e.g. “Dawn”, “Refresh”, or a previous theme). That’s normal.

### Step 3: Add the Foil theme

1. On the Themes page, look for the **Add theme** button (often in the top-right or near the theme list).
2. Click **Add theme**.
3. In the menu that appears, choose **Upload zip file** (or **Upload theme**).
4. A file picker will open. **Find the Foil theme zip file** on your computer (e.g. in your Downloads folder or wherever you saved it after purchasing).
5. Select the file and click **Open** (or **Upload**).

Shopify will upload and install the theme. This usually takes 30 seconds to a minute. When it’s done, you’ll see **Foil** appear in your theme list with an option that says something like **Customize** or **Actions**.

### Step 4: Publish Foil (make it live)

Right now the theme is installed but not yet visible to your customers. To make it your store’s look:

1. Find **Foil** in the theme list.
2. Click **Actions** (or the three dots) next to it.
3. Click **Publish** (or **Publish as current theme**).
4. Confirm when Shopify asks you to confirm.

Your store will now be using the Foil theme. You can click **Customize** to change how it looks (see Part 2).

---

## Part 2: Customize Your Store (No Coding Required)

Foil is designed to be customized entirely through Shopify’s theme editor.

### Opening the theme editor

1. Go to **Online Store → Themes**.
2. On the **Foil** theme, click **Customize**.

You’ll see a preview of your store on one side and **theme settings** on the other.

### What you can change

- **Theme settings** (often in the left panel or under a “Theme settings” / gear icon):
  - **Colors** — primary, accent, background, text, etc.
  - **Typography** — heading and body fonts, sizes.
  - **Layout** — max width, spacing, border roundness.
  - **Product cards** — show/hide condition badge, set badge, rarity, foil shimmer, “low stock” threshold.
  - **Cart** — cart drawer behavior, optional upsell.
  - **Search** — predictive search, what appears in results.
  - **Dark mode** — default light or dark, and whether customers can switch.
  - **TCG settings** — condition guide (tooltip or modal), show card number on product page.
  - **Social & footer** — social links, footer columns.

- **Homepage sections** — On the homepage you can add, remove, or reorder sections (e.g. hero banner, “Shop by game”, featured products, set spotlight). Click any section in the preview to edit its text, images, and which collection it uses.

- **Header and footer** — Usually edited via “Header” and “Footer” sections. You can set your main menu, logo, cart icon, and footer links here.

When you’re happy with your changes, click **Save** (top-right). You can close the editor anytime; your store is already live with Foil.

---

## Part 3: Add Products and Collections (Getting Your Store Filled)

Foil is built for trading card products. Here’s the minimum you need to get cards showing nicely.

### Adding a product (simplified)

1. Go to **Products** in the left sidebar and click **Add product**.
2. Fill in:
   - **Title** — e.g. “Charizard ex”
   - **Media** — add at least one image (front of card). Portrait orientation (taller than wide) works best for cards.
   - **Pricing** — set a price.
   - **Variants** (optional but recommended for singles): add an option like **Condition** with values: Near Mint, Lightly Played, Moderately Played, Heavily Played, Damaged. You can add a second option for **Finish** (e.g. Normal, Foil). Set price and quantity for each variant.
3. Under **Organization**, add a **Vendor** (e.g. “Pokemon” or “Magic”) and **Product type** (e.g. “Single”). Add the product to at least one **collection** (see below).
4. Click **Save**.

### Creating collections

Collections group your products (e.g. by game or set).

1. Go to **Products → Collections** and click **Create collection**.
2. Give it a **Title** (e.g. “Pokemon”, “Magic”, “New Arrivals”).
3. Choose how products are added (manual, or automatic by type/vendor/tag).
4. Save.

Then, in the **theme editor** (Customize), open the homepage sections that show products (e.g. “Featured products”, “Set spotlight”) and choose which collection each section should display. No coding — just pick from the dropdown.

### Optional: Set name, rarity, and card number (metafields)

Foil can show set name, rarity, and card number on product cards and product pages. These use Shopify **metafields**. They’re optional — the theme still works without them.

If you want them:

1. Go to **Settings** (gear icon in the bottom-left) → **Custom data** → **Products**.
2. Click **Add definition** and create definitions for the fields Foil uses (e.g. Set Name, Rarity, Card Number). The full list and exact names are in the **TCG Metafields Setup** guide included in your purchase. Use the **Namespace and key** values from that guide (e.g. `tcg.set_name`, `tcg.rarity`).
3. After the definitions exist, open any product, scroll to **Metafields**, and fill in the values (e.g. Set name: “Surging Sparks”, Rarity: “Rare”). Save.

Once set up, Foil will show these as badges and details on cards and product pages.

---

## Part 4: Menus and Navigation

1. Go to **Online Store → Navigation** (or **Navigation** under Online Store).
2. Edit your **Main menu** to add links to your collections (e.g. Singles, Sealed, by game).
3. Create or edit a **Footer** menu if you want links in the footer (e.g. Contact, Condition Guide, Shipping, Refund policy).

The header and footer sections in the theme editor often let you choose which menu appears where.

---

## Part 5: Important Pages (Optional but Recommended)

Foil works with standard Shopify pages. Consider creating:

- **Contact** — so customers can reach you (use a contact form or your email).
- **Condition guide** — explain what NM, LP, MP, HP, and Damaged mean. You can link to this from the product page or footer.
- **Shipping / Refund / FAQ** — set expectations and reduce support questions.

Create these under **Online Store → Pages**, then add links in your footer or main menu.

---

## Troubleshooting

- **“I don’t see Add theme / Upload zip”** — Make sure you’re logged in as a store **owner** or staff with theme permissions. Only certain roles can add themes.
- **“Upload failed”** — Check that the file is the original `.zip` you downloaded (not unzipped). If the file is very large, ensure your internet connection is stable and try again.
- **“My products don’t show on the homepage”** — In the theme editor, open the homepage sections that display products (e.g. “Featured products”, “Set spotlight”) and select the correct **collection**. Also ensure products are in that collection.
- **“Cart or search doesn’t work”** — Foil uses a cart drawer and search modal. If something looks broken, try a different browser or clear the cache. If it still fails, contact support with your store URL and what you clicked.

---

## Where to Get Help

- **Theme purchase support** — Use the contact method provided by the seller (e.g. Etsy Messages) for theme-specific questions, installation help, or a missing file.
- **Shopify help** — For general Shopify questions (billing, domains, checkout), use [Shopify Help Center](https://help.shopify.com) or Shopify’s live chat/help in your admin.

---

Enjoy your new Foil theme and good luck with your TCG store!
