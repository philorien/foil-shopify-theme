/**
 * <tcg-variant-picker> — visual variant selector for TCG products.
 *
 * Reads variant data from a JSON blob in data-variants attribute.
 * Renders condition as badge selectors, finish as swatches.
 * Updates hidden input, price display, and stock status.
 *
 * Usage in Liquid:
 *   <tcg-variant-picker data-variants='{{ product.variants | json }}' data-url="{{ product.url }}">
 *     <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
 *     <div data-option-container></div>
 *     <div data-price></div>
 *     <div data-stock></div>
 *   </tcg-variant-picker>
 *
 * @element tcg-variant-picker
 */
import { formatMoney } from '../money.js';

class TcgVariantPicker extends HTMLElement {
  connectedCallback() {
    try {
      this._variants = JSON.parse(this.dataset.variants || '[]');
    } catch {
      this._variants = [];
    }

    if (this._variants.length === 0) return;

    this._hiddenInput = this.querySelector('input[name="id"]');
    this._optionContainer = this.querySelector('[data-option-container]');
    this._priceEl = this.querySelector('[data-price]');
    this._stockEl = this.querySelector('[data-stock]');

    // Collect unique option names and values
    this._options = this._buildOptionGroups();
    this._selectedOptions = {};

    // Init with first available variant's options
    const firstAvail = this._variants.find((v) => v.available) || this._variants[0];
    if (firstAvail) {
      firstAvail.options.forEach((val, i) => {
        const name = this._options[i]?.name;
        if (name) this._selectedOptions[name] = val;
      });
    }

    this._renderOptions();
    this._updateVariant();
  }

  /** @private — Build option groups from variant data */
  _buildOptionGroups() {
    // Shopify variants have option1, option2, option3
    // and the product has options array with name/values
    // Since we only get variants, we infer option structure
    const groups = [];
    const optionNames = ['Option 1', 'Option 2', 'Option 3'];

    // Try to detect option names from the product URL or just use generic names
    // Each variant has options: [value1, value2, value3]
    for (let i = 0; i < 3; i++) {
      const values = new Set();
      this._variants.forEach((v) => {
        if (v.options && v.options[i] && v.options[i] !== 'Default Title') {
          values.add(v.options[i]);
        }
      });
      if (values.size > 0) {
        // Use variant option names if available (from Shopify data)
        const name = this._variants[0]?.[`option${i + 1}`]
          ? optionNames[i]
          : optionNames[i];
        groups.push({ name: `option${i + 1}`, index: i, values: [...values] });
      }
    }

    return groups;
  }

  /** @private */
  _renderOptions() {
    if (!this._optionContainer) return;

    this._optionContainer.innerHTML = this._options.map((group) => {
      const isCondition = this._isConditionOption(group.values);
      return `
        <fieldset class="mb-4" data-option-group="${group.name}">
          <legend class="text-xs font-bold text-text uppercase tracking-wide opacity-50 mb-2">
            ${this._esc(this._formatOptionName(group.name))}
          </legend>
          <div class="flex flex-wrap gap-2">
            ${group.values.map((val) => {
              const selected = this._selectedOptions[group.name] === val;
              const disabled = !this._isOptionAvailable(group.name, val);
              return `
                <button
                  type="button"
                  class="${isCondition ? this._conditionClass(val, selected, disabled) : this._swatchClass(selected, disabled)}"
                  data-option-name="${group.name}"
                  data-option-value="${this._esc(val)}"
                  ${disabled ? 'aria-disabled="true"' : ''}
                  aria-pressed="${selected}"
                >
                  ${disabled && !isCondition ? `<span class="line-through">${this._esc(val)}</span>` : this._esc(val)}
                </button>
              `;
            }).join('')}
          </div>
        </fieldset>
      `;
    }).join('');

    // Wire click handlers
    this._optionContainer.querySelectorAll('[data-option-name]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.getAttribute('aria-disabled') === 'true') return;
        this._selectedOptions[btn.dataset.optionName] = btn.dataset.optionValue;
        this._renderOptions();
        this._updateVariant();
      });
    });
  }

  /** @private — Check if option values look like conditions (NM, LP, etc.) */
  _isConditionOption(values) {
    const conditions = ['nm', 'lp', 'mp', 'hp', 'd', 'near mint', 'lightly played', 'moderately played', 'heavily played', 'damaged'];
    return values.some((v) => conditions.includes(v.toLowerCase()));
  }

  /** @private */
  _conditionClass(val, selected, disabled) {
    const base = 'badge cursor-pointer transition-all';
    if (disabled) return `${base} opacity-30 cursor-not-allowed line-through`;

    const lower = val.toLowerCase();
    if (selected) {
      if (lower === 'nm' || lower === 'near mint') return `${base} badge-success ring-2 ring-success ring-offset-1 ring-offset-surface`;
      if (lower === 'lp' || lower === 'lightly played') return `${base} badge-primary ring-2 ring-primary ring-offset-1 ring-offset-surface`;
      if (lower === 'mp' || lower === 'moderately played') return `${base} badge-accent ring-2 ring-accent ring-offset-1 ring-offset-surface`;
      return `${base} badge-error ring-2 ring-error ring-offset-1 ring-offset-surface`;
    }
    return `${base} hover:border-text`;
  }

  /** @private */
  _swatchClass(selected, disabled) {
    const base = 'px-3 py-1.5 text-xs font-bold border rounded cursor-pointer transition-all';
    if (disabled) return `${base} border-border text-text opacity-30 cursor-not-allowed`;
    if (selected) return `${base} border-primary bg-primary text-white`;
    return `${base} border-border text-text hover:border-text`;
  }

  /** @private */
  _formatOptionName(name) {
    return name.replace(/^option(\d+)$/, 'Option $1');
  }

  /** @private — Check if selecting this value still leads to at least one available variant */
  _isOptionAvailable(optionName, value) {
    const testOptions = { ...this._selectedOptions, [optionName]: value };
    return this._variants.some((v) => {
      return this._options.every((group) => {
        const testVal = testOptions[group.name];
        return !testVal || v.options[group.index] === testVal;
      }) && v.available;
    });
  }

  /** @private — Find the currently selected variant and update UI */
  _updateVariant() {
    const variant = this._variants.find((v) => {
      return this._options.every((group) => {
        return v.options[group.index] === this._selectedOptions[group.name];
      });
    });

    if (!variant) return;

    // Update hidden input
    if (this._hiddenInput) {
      this._hiddenInput.value = variant.id;
    }

    // Update price display
    if (this._priceEl) {
      let priceHtml = `<span class="text-2xl font-bold text-primary">${formatMoney(variant.price)}</span>`;
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        priceHtml += ` <span class="text-lg text-text line-through opacity-40">${formatMoney(variant.compare_at_price)}</span>`;
      }
      this._priceEl.innerHTML = priceHtml;
    }

    // Update stock display
    if (this._stockEl) {
      const threshold = window.Foil?.settings?.low_stock_threshold || 0;
      if (!variant.available) {
        this._stockEl.innerHTML = '<span class="text-sm text-error font-bold">Sold out</span>';
      } else if (threshold > 0 && variant.inventory_quantity > 0 && variant.inventory_quantity <= threshold) {
        this._stockEl.innerHTML = `<span class="text-sm text-accent font-bold">Only ${variant.inventory_quantity} left</span>`;
      } else {
        this._stockEl.innerHTML = '';
      }
    }

    // Update add to cart button state
    const addBtn = this.closest('form')?.querySelector('[type="submit"]');
    if (addBtn) {
      addBtn.disabled = !variant.available;
      addBtn.textContent = variant.available ? 'Add to cart' : 'Sold out';
    }

    // Dispatch event for other components
    this.dispatchEvent(new CustomEvent('variant:change', {
      detail: { variant },
      bubbles: true,
    }));

    // Update URL without reload
    if (this.dataset.url) {
      const url = new URL(window.location);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url);
    }
  }

  /** @private */
  _esc(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}

customElements.define('tcg-variant-picker', TcgVariantPicker);
