/**
 * <tcg-recently-viewed> — displays recently viewed products from localStorage.
 *
 * Reads product handles from localStorage, fetches product JSON from
 * Shopify's /products/{handle}.json endpoint, and renders simple cards.
 *
 * Attributes:
 *   data-limit — max products to show (default: 8)
 *   data-current-handle — current product handle to exclude
 *
 * @element tcg-recently-viewed
 */
import { getProducts } from '../recently-viewed.js';
import { formatMoney } from '../money.js';

class TcgRecentlyViewed extends HTMLElement {
  connectedCallback() {
    // Defer rendering to avoid blocking initial paint
    requestAnimationFrame(() => this._load());
  }

  async _load() {
    const limit = parseInt(this.dataset.limit, 10) || 8;
    const currentHandle = this.dataset.currentHandle || '';
    const grid = this.querySelector('[data-recently-viewed-grid]');
    if (!grid) return;

    const handles = getProducts()
      .filter((h) => h !== currentHandle)
      .slice(0, limit);

    if (handles.length === 0) {
      // Hide the entire section if no recently viewed products
      this.closest('section')?.remove();
      return;
    }

    // Fetch product data in parallel
    const products = await Promise.all(
      handles.map(async (handle) => {
        try {
          const res = await fetch(`/products/${handle}.json`);
          if (!res.ok) return null;
          const data = await res.json();
          return data.product;
        } catch {
          return null;
        }
      })
    );

    const validProducts = products.filter(Boolean);

    if (validProducts.length === 0) {
      this.closest('section')?.remove();
      return;
    }

    grid.innerHTML = validProducts.map((p) => this._renderCard(p)).join('');
  }

  /**
   * Render a simple product card.
   * @param {Object} product — Shopify product JSON
   * @returns {string}
   * @private
   */
  _renderCard(product) {
    const image = product.image?.src || product.images?.[0]?.src || '';
    const imageUrl = image ? this._sizedImage(image, 400) : '';
    const price = product.variants?.[0]?.price
      ? formatMoney(Math.round(parseFloat(product.variants[0].price) * 100))
      : '';
    const comparePrice = product.variants?.[0]?.compare_at_price
      ? formatMoney(Math.round(parseFloat(product.variants[0].compare_at_price) * 100))
      : '';
    const url = `/products/${product.handle}`;
    const available = product.variants?.some((v) => v.available) ?? true;

    return /* html */ `
      <div class="flex-shrink-0 w-48 snap-start">
        <div class="group bg-surface border border-border rounded overflow-hidden hover:border-primary transition-colors">
          <a href="${url}" class="block">
            ${imageUrl
              ? `<img src="${this._esc(imageUrl)}" alt="${this._esc(product.title)}" width="400" height="560" class="w-full card-aspect object-cover" loading="lazy">`
              : '<div class="w-full card-aspect bg-background"></div>'
            }
          </a>
          <div class="p-3">
            <a href="${url}" class="block">
              <h3 class="text-sm font-bold text-text group-hover:text-primary transition-colors line-clamp-2 mb-1">
                ${this._esc(product.title)}
              </h3>
            </a>
            <div class="flex items-baseline gap-2">
              ${price ? `<span class="text-sm font-bold text-primary">${price}</span>` : ''}
              ${comparePrice && comparePrice !== price ? `<span class="text-xs text-text line-through opacity-40">${comparePrice}</span>` : ''}
            </div>
            ${!available ? '<p class="text-xs text-error font-bold mt-1">Sold out</p>' : ''}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Resize a Shopify CDN image URL.
   * @param {string} src
   * @param {number} width
   * @returns {string}
   * @private
   */
  _sizedImage(src, width) {
    if (!src) return '';
    // Modern Shopify image_url format
    if (src.includes('cdn.shopify.com')) {
      return src.replace(/(\.\w+)(\?|$)/, `_${width}x$1$2`);
    }
    return src;
  }

  /** @private */
  _esc(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}

customElements.define('tcg-recently-viewed', TcgRecentlyViewed);
