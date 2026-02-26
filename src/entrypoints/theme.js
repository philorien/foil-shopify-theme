/**
 * Foil Theme — main JS entry point.
 * All Web Components and modules are imported here.
 */

/* ── Web Components ────────────────────────────────────── */
import '../js/components/tcg-dark-mode-toggle.js';
import '../js/components/tcg-cart-drawer.js';
import '../js/components/tcg-variant-picker.js';
import '../js/components/tcg-search-modal.js';
import '../js/components/tcg-quantity-input.js';
import '../js/components/tcg-product-gallery.js';
import '../js/components/tcg-mobile-menu.js';
import '../js/components/tcg-recently-viewed.js';

/* ── Modules ───────────────────────────────────────────── */
import '../js/components/tcg-condition-modal.js';
import { addProduct } from '../js/recently-viewed.js';

/* ── Global event wiring ───────────────────────────────── */

/**
 * Bridge Liquid-rendered buttons to CustomEvents that Web Components listen for.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Cart open — header cart button
  document.querySelectorAll('[data-cart-open]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.dispatchEvent(new CustomEvent('cart:open'));
    });
  });

  // Search open — header search button
  document.querySelectorAll('[data-search-open]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.dispatchEvent(new CustomEvent('search:open'));
    });
  });

  // Quick-add buttons on product cards (collection pages, homepage, etc.)
  document.querySelectorAll('[data-quick-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.variantId;
      if (!id) return;
      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = 'Adding...';

      fetch(window.Foil.routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: [{ id: parseInt(id, 10), quantity: 1 }] }),
      })
        .then(() => fetch(window.Foil.routes.cart_url + '.js'))
        .then((r) => r.json())
        .then((cart) => {
          document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
          document.dispatchEvent(new CustomEvent('cart:open'));
          btn.disabled = false;
          btn.textContent = originalText;
        })
        .catch(() => {
          btn.disabled = false;
          btn.textContent = originalText;
        });
    });
  });

  // Sticky ATC bar — show/hide based on main ATC button visibility
  const stickyBar = document.querySelector('[data-sticky-atc]');
  const mainForm = document.querySelector('[data-product-form]');
  if (stickyBar && mainForm) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        stickyBar.classList.toggle('translate-y-full', entry.isIntersecting);
        stickyBar.classList.toggle('translate-y-0', !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(mainForm);

    // Sticky ATC button click
    const stickyBtn = stickyBar.querySelector('[data-sticky-atc-btn]');
    stickyBtn?.addEventListener('click', () => {
      const id = stickyBtn.dataset.variantId;
      if (!id) return;
      stickyBtn.disabled = true;

      fetch(window.Foil.routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: [{ id: parseInt(id, 10), quantity: 1 }] }),
      })
        .then(() => fetch(window.Foil.routes.cart_url + '.js'))
        .then((r) => r.json())
        .then((cart) => {
          document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
          document.dispatchEvent(new CustomEvent('cart:open'));
          stickyBtn.disabled = false;
        })
        .catch(() => {
          stickyBtn.disabled = false;
        });
    });
  }

  // Update cart count in header on cart:updated
  document.addEventListener('cart:updated', (e) => {
    const cart = e.detail;
    if (!cart) return;
    const countEl = document.querySelector('[data-cart-count]');
    if (countEl) {
      countEl.textContent = cart.item_count;
      countEl.classList.toggle('hidden', cart.item_count === 0);
    }
    // Update the Foil global
    if (window.Foil) {
      window.Foil.cart.item_count = cart.item_count;
      window.Foil.cart.total_price = cart.total_price;
    }
  });

  // AJAX product form submission — intercept to use cart drawer instead of page redirect
  document.querySelectorAll('[data-product-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const id = formData.get('id');
      const qty = parseInt(formData.get('quantity'), 10) || 1;

      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Adding...';
      }

      fetch(window.Foil.routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: [{ id: parseInt(id, 10), quantity: qty }] }),
      })
        .then(() => fetch(window.Foil.routes.cart_url + '.js'))
        .then((r) => r.json())
        .then((cart) => {
          document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
          document.dispatchEvent(new CustomEvent('cart:open'));
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add to cart';
          }
        })
        .catch(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add to cart';
          }
        });
    });
  });
});

/* ── Expose recently-viewed helper for inline scripts ──── */
window.Foil = window.Foil || {};
window.Foil._addRecentlyViewed = addProduct;
