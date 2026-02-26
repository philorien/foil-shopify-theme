/**
 * Condition guide modal — opens when [data-condition-guide-trigger] is clicked.
 *
 * The modal markup lives in snippets/condition-guide.liquid.
 * This script wires up the trigger buttons on product pages to open
 * the modal and populate it with the condition guide content.
 *
 * Not a Web Component — a simple event-driven module since the modal
 * markup is a standalone snippet, not a custom element.
 *
 * @module tcg-condition-modal
 */
import { trapFocus, releaseFocus } from '../focus-trap.js';

function init() {
  const modal = document.querySelector('[data-condition-modal]');
  const backdrop = document.querySelector('[data-condition-modal-backdrop]');
  const closeBtn = document.querySelector('[data-condition-modal-close]');
  const content = document.querySelector('[data-condition-modal-content]');
  const guide = document.querySelector('[data-condition-guide]');
  const triggers = document.querySelectorAll('[data-condition-guide-trigger]');

  if (!modal || !guide || triggers.length === 0) return;

  function open() {
    // Clone condition guide content into modal
    if (content) {
      content.innerHTML = guide.outerHTML;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      const panel = modal.querySelector('.relative.bg-surface');
      if (panel) trapFocus(panel);
    });

    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);

    const panel = modal.querySelector('.relative.bg-surface');
    if (panel) releaseFocus(panel);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
  }

  triggers.forEach((btn) => btn.addEventListener('click', open));
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
