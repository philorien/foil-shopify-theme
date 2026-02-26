/**
 * <tcg-quantity-input> — +/- stepper wrapping a number input.
 *
 * Usage in Liquid:
 *   <tcg-quantity-input>
 *     <button data-action="decrease" aria-label="Decrease quantity">−</button>
 *     <input type="number" name="quantity" value="1" min="1" max="99" aria-label="Quantity">
 *     <button data-action="increase" aria-label="Increase quantity">+</button>
 *   </tcg-quantity-input>
 *
 * Dispatches `quantity:change` CustomEvent with { value } on change.
 * Degrades gracefully — the number input works without JS.
 *
 * @element tcg-quantity-input
 */
class TcgQuantityInput extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('input[type="number"]');
    if (!this.input) return;

    this.decreaseBtn = this.querySelector('[data-action="decrease"]');
    this.increaseBtn = this.querySelector('[data-action="increase"]');

    this.decreaseBtn?.addEventListener('click', this._decrease.bind(this));
    this.increaseBtn?.addEventListener('click', this._increase.bind(this));
    this.input.addEventListener('change', this._onInputChange.bind(this));
  }

  disconnectedCallback() {
    this.decreaseBtn?.removeEventListener('click', this._decrease);
    this.increaseBtn?.removeEventListener('click', this._increase);
    this.input?.removeEventListener('change', this._onInputChange);
  }

  get value() {
    return parseInt(this.input?.value, 10) || 1;
  }

  set value(val) {
    if (!this.input) return;
    const min = parseInt(this.input.min, 10) || 1;
    const max = parseInt(this.input.max, 10) || 99;
    this.input.value = Math.min(Math.max(val, min), max);
    this._emit();
  }

  /** @private */
  _decrease() {
    this.value = this.value - 1;
  }

  /** @private */
  _increase() {
    this.value = this.value + 1;
  }

  /** @private */
  _onInputChange() {
    // Clamp to min/max
    this.value = this.value;
  }

  /** @private */
  _emit() {
    this.dispatchEvent(
      new CustomEvent('quantity:change', {
        detail: { value: this.value },
        bubbles: true,
      })
    );
  }
}

customElements.define('tcg-quantity-input', TcgQuantityInput);
