/**
 * Focus trap utility — keeps keyboard focus inside a container.
 *
 * Used by cart drawer, search modal, and mobile menu to meet
 * accessibility requirements for modal dialogs.
 *
 * @module focus-trap
 */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

let _previouslyFocused = null;

/**
 * Activate focus trap on a container element.
 * Moves focus to the first focusable element and intercepts Tab key.
 * @param {HTMLElement} container
 */
export function trapFocus(container) {
  _previouslyFocused = document.activeElement;

  const focusables = container.querySelectorAll(FOCUSABLE);
  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  first.focus();

  container._focusTrapHandler = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  container.addEventListener('keydown', container._focusTrapHandler);
}

/**
 * Release focus trap and restore focus to the previously focused element.
 * @param {HTMLElement} container
 */
export function releaseFocus(container) {
  if (container._focusTrapHandler) {
    container.removeEventListener('keydown', container._focusTrapHandler);
    delete container._focusTrapHandler;
  }

  if (_previouslyFocused && _previouslyFocused.focus) {
    _previouslyFocused.focus();
    _previouslyFocused = null;
  }
}
