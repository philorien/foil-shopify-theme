/**
 * <tcg-search-modal> — full-screen search overlay with predictive results.
 *
 * Mount point is in theme.liquid:
 *   <tcg-search-modal class="fixed inset-0 z-50" hidden
 *     data-predictive="true" data-show-collections="true" data-show-pages="true">
 *
 * Opens via `search:open` CustomEvent on document.
 * Closes via backdrop click, X button, or Escape key.
 * Uses Shopify Predictive Search API (/search/suggest.json).
 *
 * @element tcg-search-modal
 */
import { formatMoney } from '../money.js';
import { trapFocus, releaseFocus } from '../focus-trap.js';

class TcgSearchModal extends HTMLElement {
  connectedCallback() {
    this._onOpen = this._open.bind(this);
    document.addEventListener('search:open', this._onOpen);
    this._debounceTimer = null;
    this._abortController = null;
    this._selectedIndex = -1;
  }

  disconnectedCallback() {
    document.removeEventListener('search:open', this._onOpen);
  }

  get _predictive() {
    return this.dataset.predictive === 'true';
  }

  get _showCollections() {
    return this.dataset.showCollections === 'true';
  }

  get _showPages() {
    return this.dataset.showPages === 'true';
  }

  /** @private */
  _open() {
    this.hidden = false;
    document.body.style.overflow = 'hidden';
    this._render();

    requestAnimationFrame(() => {
      const input = this.querySelector('[data-search-input]');
      if (input) {
        trapFocus(this);
        input.focus();
      }
    });
  }

  /** @private */
  _close() {
    this.hidden = true;
    document.body.style.overflow = '';
    releaseFocus(this);
    this.innerHTML = '';
  }

  /** @private */
  _render() {
    const searchUrl = window.Foil?.routes?.search_url || '/search';

    this.innerHTML = /* html */ `
      <div class="fixed inset-0 bg-black/70 animate-fade-in" data-search-backdrop></div>
      <div class="fixed inset-x-0 top-0 bg-surface border-b border-border shadow-xl animate-fade-in" data-search-panel>
        <div class="mx-auto max-w-2xl px-4 py-6">
          <form action="${searchUrl}" method="get" role="search" class="relative">
            <input
              type="search"
              name="q"
              placeholder="Search cards, sets, products..."
              autocomplete="off"
              class="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-lg text-text text-lg focus:border-primary focus:outline-none"
              data-search-input
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="absolute left-3 top-1/2 -translate-y-1/2 text-text opacity-40 pointer-events-none" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-text opacity-40 hover:opacity-100 transition-opacity"
              data-search-close
              aria-label="Close search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </form>
          <div data-search-results class="mt-4 max-h-[60vh] overflow-y-auto"></div>
        </div>
      </div>
    `;

    // Wire events
    this.querySelector('[data-search-backdrop]')?.addEventListener('click', () => this._close());
    this.querySelector('[data-search-close]')?.addEventListener('click', () => this._close());

    const input = this.querySelector('[data-search-input]');
    input?.addEventListener('input', (e) => this._onInput(e.target.value));
    input?.addEventListener('keydown', (e) => this._onKeydown(e));
  }

  /** @private */
  _onInput(query) {
    clearTimeout(this._debounceTimer);
    this._abortController?.abort();

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      this._clearResults();
      return;
    }

    this._debounceTimer = setTimeout(() => {
      if (this._predictive) {
        this._fetchPredictive(trimmed);
      }
    }, 250);
  }

  /** @private */
  async _fetchPredictive(query) {
    this._abortController = new AbortController();
    const { signal } = this._abortController;

    const params = new URLSearchParams({
      q: query,
      'resources[type]': this._getResourceTypes(),
      'resources[limit]': '6',
    });

    const url = `${window.Foil?.routes?.predictive_search_url || '/search/suggest'}.json?${params}`;

    try {
      const res = await fetch(url, { signal });
      if (!res.ok) return;
      const data = await res.json();
      this._renderResults(data.resources?.results || {}, query);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Predictive search error:', err);
      }
    }
  }

  /** @private */
  _getResourceTypes() {
    const types = ['product'];
    if (this._showCollections) types.push('collection');
    if (this._showPages) types.push('page');
    return types.join(',');
  }

  /** @private */
  _renderResults(results, query) {
    const container = this.querySelector('[data-search-results]');
    if (!container) return;

    const products = results.products || [];
    const collections = results.collections || [];
    const pages = results.pages || [];

    if (products.length === 0 && collections.length === 0 && pages.length === 0) {
      container.innerHTML = `
        <p class="text-text opacity-50 text-center py-4">No results for "${this._esc(query)}"</p>
      `;
      return;
    }

    let html = '';
    this._selectedIndex = -1;

    if (products.length > 0) {
      html += `
        <div class="mb-4">
          <h3 class="text-xs font-bold text-text uppercase tracking-wide opacity-50 mb-2">Products</h3>
          <div class="space-y-1">
            ${products.map((p) => this._renderProductResult(p)).join('')}
          </div>
        </div>
      `;
    }

    if (collections.length > 0) {
      html += `
        <div class="mb-4">
          <h3 class="text-xs font-bold text-text uppercase tracking-wide opacity-50 mb-2">Collections</h3>
          <div class="space-y-1">
            ${collections.map((c) => `
              <a href="${c.url}" class="flex items-center gap-3 p-2 rounded hover:bg-background transition-colors" data-search-result>
                <span class="text-sm text-text">${this._esc(c.title)}</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (pages.length > 0) {
      html += `
        <div class="mb-4">
          <h3 class="text-xs font-bold text-text uppercase tracking-wide opacity-50 mb-2">Pages</h3>
          <div class="space-y-1">
            ${pages.map((p) => `
              <a href="${p.url}" class="flex items-center gap-3 p-2 rounded hover:bg-background transition-colors" data-search-result>
                <span class="text-sm text-text">${this._esc(p.title)}</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    // View all results link
    const searchUrl = window.Foil?.routes?.search_url || '/search';
    html += `
      <a href="${searchUrl}?q=${encodeURIComponent(query)}" class="block text-center text-sm text-primary hover:underline py-2" data-search-result>
        View all results
      </a>
    `;

    container.innerHTML = html;
  }

  /** @private */
  _renderProductResult(product) {
    const imageUrl = product.image
      ? product.image.replace(/(\.\w+)(\?|$)/, '_100x$1$2')
      : '';
    const price = product.price ? formatMoney(product.price) : '';

    return `
      <a href="${product.url}" class="flex items-center gap-3 p-2 rounded hover:bg-background transition-colors" data-search-result>
        ${imageUrl ? `
          <img
            src="${imageUrl}"
            alt="${this._esc(product.title)}"
            width="40"
            height="56"
            class="rounded card-aspect object-cover flex-shrink-0"
            loading="lazy"
          >
        ` : '<div class="w-10 h-14 bg-background rounded flex-shrink-0"></div>'}
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-text line-clamp-1">${this._esc(product.title)}</p>
          ${price ? `<p class="text-xs text-primary font-bold">${price}</p>` : ''}
        </div>
      </a>
    `;
  }

  /** @private */
  _clearResults() {
    const container = this.querySelector('[data-search-results]');
    if (container) container.innerHTML = '';
    this._selectedIndex = -1;
  }

  /** @private */
  _onKeydown(e) {
    const results = this.querySelectorAll('[data-search-result]');
    if (results.length === 0 && e.key !== 'Escape') return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this._close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this._selectedIndex = Math.min(this._selectedIndex + 1, results.length - 1);
        this._highlightResult(results);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._selectedIndex = Math.max(this._selectedIndex - 1, -1);
        this._highlightResult(results);
        break;
      case 'Enter':
        if (this._selectedIndex >= 0 && results[this._selectedIndex]) {
          e.preventDefault();
          results[this._selectedIndex].click();
        }
        break;
    }
  }

  /** @private */
  _highlightResult(results) {
    results.forEach((el, i) => {
      el.classList.toggle('bg-background', i === this._selectedIndex);
    });
    if (this._selectedIndex >= 0 && results[this._selectedIndex]) {
      results[this._selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  /** @private */
  _esc(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}

customElements.define('tcg-search-modal', TcgSearchModal);
