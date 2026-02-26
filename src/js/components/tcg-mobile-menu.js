/**
 * <tcg-mobile-menu> — slide-in mobile navigation drawer.
 *
 * Markup is rendered in header.liquid with:
 *   <tcg-mobile-menu hidden>
 *     <div data-mobile-menu-backdrop></div>
 *     <div data-mobile-menu-panel> ... nav links ... </div>
 *   </tcg-mobile-menu>
 *
 * Opens via [data-mobile-menu-open] click.
 * Closes via [data-mobile-menu-close], backdrop click, or Escape key.
 *
 * @element tcg-mobile-menu
 */
import { trapFocus, releaseFocus } from '../focus-trap.js';

class TcgMobileMenu extends HTMLElement {
  connectedCallback() {
    // Open trigger lives in the header (outside this element)
    this._openBtn = document.querySelector('[data-mobile-menu-open]');
    this._closeBtn = this.querySelector('[data-mobile-menu-close]');
    this._backdrop = this.querySelector('[data-mobile-menu-backdrop]');
    this._panel = this.querySelector('[data-mobile-menu-panel]');

    this._onOpen = this._open.bind(this);
    this._onClose = this._close.bind(this);
    this._onKeydown = this._handleKeydown.bind(this);

    this._openBtn?.addEventListener('click', this._onOpen);
    this._closeBtn?.addEventListener('click', this._onClose);
    this._backdrop?.addEventListener('click', this._onClose);
  }

  disconnectedCallback() {
    this._openBtn?.removeEventListener('click', this._onOpen);
    this._closeBtn?.removeEventListener('click', this._onClose);
    this._backdrop?.removeEventListener('click', this._onClose);
    document.removeEventListener('keydown', this._onKeydown);
  }

  /** @private */
  _open() {
    this.hidden = false;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this._onKeydown);

    // Animate in
    if (this._panel) {
      this._panel.style.transform = 'translateX(-100%)';
      requestAnimationFrame(() => {
        this._panel.style.transition = 'transform 0.25s ease-out';
        this._panel.style.transform = 'translateX(0)';
      });
    }

    if (this._openBtn) {
      this._openBtn.setAttribute('aria-expanded', 'true');
    }

    requestAnimationFrame(() => {
      if (this._panel) trapFocus(this._panel);
    });
  }

  /** @private */
  _close() {
    if (this._panel) {
      this._panel.style.transform = 'translateX(-100%)';
      this._panel.addEventListener('transitionend', () => {
        this.hidden = true;
        document.body.style.overflow = '';
        this._panel.style.transition = '';
        if (this._panel) releaseFocus(this._panel);
      }, { once: true });
    } else {
      this.hidden = true;
      document.body.style.overflow = '';
    }

    document.removeEventListener('keydown', this._onKeydown);

    if (this._openBtn) {
      this._openBtn.setAttribute('aria-expanded', 'false');
    }
  }

  /** @private */
  _handleKeydown(e) {
    if (e.key === 'Escape') this._close();
  }
}

customElements.define('tcg-mobile-menu', TcgMobileMenu);
