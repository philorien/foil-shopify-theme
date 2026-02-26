/**
 * <tcg-cart-drawer> — slide-in cart drawer from the right.
 *
 * Mount point is already in theme.liquid:
 *   <tcg-cart-drawer class="fixed inset-0 z-50 pointer-events-none" hidden>
 *
 * Opens via `cart:open` CustomEvent on document.
 * Closes via backdrop click, X button, or Escape key.
 * Listens to `cart:updated` to re-render line items.
 *
 * @element tcg-cart-drawer
 */
import { getCart, changeItem, removeItem } from '../cart-api.js';
import { formatMoney } from '../money.js';
import { trapFocus, releaseFocus } from '../focus-trap.js';

class TcgCartDrawer extends HTMLElement {
  connectedCallback() {
    this._onOpen = this._open.bind(this);
    this._onCartUpdated = this._handleCartUpdate.bind(this);
    this._onKeydown = this._handleKeydown.bind(this);

    document.addEventListener('cart:open', this._onOpen);
    document.addEventListener('cart:updated', this._onCartUpdated);
  }

  disconnectedCallback() {
    document.removeEventListener('cart:open', this._onOpen);
    document.removeEventListener('cart:updated', this._onCartUpdated);
    document.removeEventListener('keydown', this._onKeydown);
  }

  /** @private */
  async _open() {
    this.hidden = false;
    this.classList.add('pointer-events-auto');
    document.body.style.overflow = 'hidden';

    // Fetch latest cart and render
    try {
      const cart = await getCart();
      this._render(cart);
    } catch {
      this._render(null);
    }

    document.addEventListener('keydown', this._onKeydown);

    // Focus trap after render
    requestAnimationFrame(() => {
      const panel = this.querySelector('[data-drawer-panel]');
      if (panel) trapFocus(panel);
    });
  }

  /** @private */
  _close() {
    const panel = this.querySelector('[data-drawer-panel]');
    if (panel) {
      panel.classList.remove('animate-slide-in-right');
      panel.classList.add('animate-slide-out-right');
      panel.addEventListener('animationend', () => {
        this.hidden = true;
        this.classList.remove('pointer-events-auto');
        document.body.style.overflow = '';
        if (panel) releaseFocus(panel);
      }, { once: true });
    } else {
      this.hidden = true;
      this.classList.remove('pointer-events-auto');
      document.body.style.overflow = '';
    }

    document.removeEventListener('keydown', this._onKeydown);
  }

  /** @private */
  _handleKeydown(e) {
    if (e.key === 'Escape') this._close();
  }

  /** @private */
  _handleCartUpdate(e) {
    if (this.hidden) return;
    this._render(e.detail);
  }

  /**
   * Render the cart drawer contents.
   * @param {Object|null} cart
   * @private
   */
  _render(cart) {
    const items = cart?.items || [];
    const itemCount = cart?.item_count || 0;
    const totalPrice = cart?.total_price || 0;

    this.innerHTML = /* html */ `
      <div class="fixed inset-0 bg-black/60 transition-opacity" data-drawer-backdrop></div>
      <div
        class="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface border-l border-border flex flex-col animate-slide-in-right"
        data-drawer-panel
        role="document"
      >
        <div class="flex items-center justify-between p-4 border-b border-border">
          <h2 class="text-lg font-heading font-bold text-text">${this._esc(this._t('cart.title'))} (${itemCount})</h2>
          <button
            type="button"
            class="text-text hover:text-primary transition-colors p-1"
            data-close
            aria-label="${this._esc(this._t('accessibility.close_cart'))}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          ${items.length > 0 ? items.map((item) => this._renderItem(item)).join('') : `
            <div class="flex flex-col items-center justify-center h-full text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-border mb-4" aria-hidden="true">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              <p class="text-text opacity-50">${this._esc(this._t('cart.empty'))}</p>
            </div>
          `}
        </div>

        ${items.length > 0 ? `
          <div class="border-t border-border p-4 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-text font-bold">${this._esc(this._t('cart.subtotal'))}</span>
              <span class="text-lg font-bold text-primary">${formatMoney(totalPrice)}</span>
            </div>
            <p class="text-xs text-text opacity-40">${this._esc(this._t('cart.taxes_note'))}</p>
            <a
              href="/checkout"
              class="btn btn-primary w-full btn-lg"
            >${this._esc(this._t('cart.checkout'))}</a>
            <button
              type="button"
              class="btn btn-ghost w-full text-sm"
              data-close
            >${this._esc(this._t('cart.continue_shopping'))}</button>
          </div>
        ` : ''}
      </div>
    `;

    // Wire up event listeners
    this.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => this._close());
    });

    this.querySelector('[data-drawer-backdrop]')?.addEventListener('click', () => this._close());

    // Quantity change handlers
    this.querySelectorAll('[data-line-key]').forEach((line) => {
      const key = line.dataset.lineKey;

      line.querySelector('[data-action="decrease"]')?.addEventListener('click', () => {
        const qty = parseInt(line.querySelector('input')?.value, 10) || 1;
        if (qty <= 1) {
          removeItem(key);
        } else {
          changeItem(key, qty - 1);
        }
      });

      line.querySelector('[data-action="increase"]')?.addEventListener('click', () => {
        const qty = parseInt(line.querySelector('input')?.value, 10) || 1;
        changeItem(key, qty + 1);
      });

      line.querySelector('[data-remove]')?.addEventListener('click', () => {
        removeItem(key);
      });
    });
  }

  /**
   * Render a single line item.
   * @param {Object} item
   * @returns {string}
   * @private
   */
  _renderItem(item) {
    const variantTitle = item.variant_title || '';
    const imageUrl = item.image ? this._imageUrl(item.image, 120) : '';

    return /* html */ `
      <div class="flex gap-3 py-3 border-b border-border" data-line-key="${this._esc(item.key)}">
        ${imageUrl ? `
          <a href="${item.url}" class="flex-shrink-0">
            <img
              src="${imageUrl}"
              alt="${this._esc(item.title)}"
              width="60"
              height="84"
              class="rounded card-aspect object-cover"
              loading="lazy"
            >
          </a>
        ` : ''}
        <div class="flex-1 min-w-0">
          <a href="${item.url}" class="text-sm font-bold text-text hover:text-primary transition-colors line-clamp-2">
            ${this._esc(item.product_title)}
          </a>
          ${variantTitle ? `<p class="text-xs text-text opacity-50 mt-0.5">${this._esc(variantTitle)}</p>` : ''}
          <p class="text-sm text-primary font-bold mt-1">${formatMoney(item.final_line_price)}</p>

          <div class="flex items-center gap-2 mt-2">
            <div class="inline-flex items-center border border-border rounded">
              <button
                type="button"
                class="px-2 py-1 text-xs text-text hover:text-primary transition-colors"
                data-action="decrease"
                aria-label="Decrease quantity"
              >−</button>
              <input
                type="number"
                value="${item.quantity}"
                min="0"
                class="w-8 text-center text-xs bg-transparent border-none p-0 text-text"
                aria-label="Quantity"
                readonly
              >
              <button
                type="button"
                class="px-2 py-1 text-xs text-text hover:text-primary transition-colors"
                data-action="increase"
                aria-label="Increase quantity"
              >+</button>
            </div>
            <button
              type="button"
              class="text-xs text-text opacity-40 hover:text-error hover:opacity-100 transition-colors"
              data-remove
              aria-label="Remove ${this._esc(item.title)}"
            >${this._t('cart.remove')}</button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get a sized Shopify image URL.
   * @param {string} url
   * @param {number} width
   * @returns {string}
   * @private
   */
  _imageUrl(url, width) {
    if (!url) return '';
    // Shopify image URLs can be resized by appending width parameter
    if (url.includes('cdn.shopify.com')) {
      return url.replace(/(\.\w+)(\?|$)/, `_${width}x$1$2`);
    }
    return url;
  }

  /**
   * Escape HTML to prevent XSS.
   * @param {string} str
   * @returns {string}
   * @private
   */
  _esc(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  /**
   * Translation helper — reads data attributes set by Liquid.
   * data-cart-title="Your cart" → dataset.cartTitle → _t('cart.title')
   * @param {string} key — dot-notation key like 'cart.title'
   * @returns {string}
   * @private
   */
  _t(key) {
    // Convert dot/underscore notation to the camelCase that dataset uses
    // 'cart.title' → 'cartTitle', 'cart.continue_shopping' → 'cartContinueShopping'
    const attr = key
      .replace(/[._]/g, '-')
      .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return this.dataset[attr] || key.split('.').pop().replace(/_/g, ' ');
  }
}

customElements.define('tcg-cart-drawer', TcgCartDrawer);
