/**
 * <tcg-dark-mode-toggle> — toggles data-theme on <html> between dark/light.
 *
 * Usage in Liquid (inside header):
 *   <tcg-dark-mode-toggle>
 *     <button type="button" aria-label="{{ 'accessibility.dark_mode_toggle' | t }}">
 *       <span data-icon="dark">🌙</span>
 *       <span data-icon="light">☀️</span>
 *     </button>
 *   </tcg-dark-mode-toggle>
 *
 * Reads initial theme from <html data-theme="...">, persists to localStorage.
 * On next page load, theme.liquid reads from settings, but this component
 * overrides immediately on connectedCallback if localStorage has a preference.
 *
 * @element tcg-dark-mode-toggle
 */
const STORAGE_KEY = 'foil:theme';

class TcgDarkModeToggle extends HTMLElement {
  connectedCallback() {
    // Restore user preference from localStorage (overrides server default)
    const saved = this._getSaved();
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }

    this._updateIcons();

    this.button = this.querySelector('button');
    this.button?.addEventListener('click', this._toggle.bind(this));
  }

  disconnectedCallback() {
    this.button?.removeEventListener('click', this._toggle);
  }

  /** @private */
  _toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);
    this._save(next);
    this._updateIcons();
  }

  /** @private */
  _updateIcons() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const darkIcon = this.querySelector('[data-icon="dark"]');
    const lightIcon = this.querySelector('[data-icon="light"]');

    if (darkIcon) darkIcon.hidden = theme !== 'light';
    if (lightIcon) lightIcon.hidden = theme !== 'dark';
  }

  /** @private */
  _getSaved() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  /** @private */
  _save(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // noop
    }
  }
}

customElements.define('tcg-dark-mode-toggle', TcgDarkModeToggle);
