/**
 * Cart API — wrapper around Shopify AJAX Cart API.
 *
 * All mutations emit a `cart:updated` CustomEvent on `document`
 * with the full cart object as `event.detail`, so every component
 * (cart drawer, header badge, etc.) can stay in sync from a single
 * source of truth.
 *
 * @module cart-api
 */

const routes = window.Foil?.routes ?? {
  cart_url: '/cart',
  cart_add_url: '/cart/add',
  cart_change_url: '/cart/change',
  cart_update_url: '/cart/update',
};

/**
 * Broadcast the updated cart to all listeners.
 * @param {Object} cart — full cart JSON from Shopify
 */
function emit(cart) {
  document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
}

/**
 * Shared fetch helper — handles JSON headers and error responses.
 * @param {string} url
 * @param {Object} body
 * @returns {Promise<Object>}
 */
async function post(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.description || data.message || 'Cart error');
    err.status = res.status;
    throw err;
  }

  return data;
}

/**
 * Get the current cart.
 * @returns {Promise<Object>}
 */
export async function getCart() {
  const res = await fetch(`${routes.cart_url}.js`, {
    headers: { Accept: 'application/json' },
  });
  return res.json();
}

/**
 * Add an item to the cart.
 * @param {number|string} id — variant ID
 * @param {number} [quantity=1]
 * @param {Object} [properties] — line item properties
 * @returns {Promise<Object>} — the updated cart
 */
export async function addToCart(id, quantity = 1, properties) {
  await post(routes.cart_add_url + '.js', {
    items: [{ id, quantity, ...(properties ? { properties } : {}) }],
  });

  // /cart/add.js returns the added item, not the full cart.
  // Fetch the full cart so listeners get complete state.
  const cart = await getCart();
  emit(cart);
  return cart;
}

/**
 * Change a line item's quantity (by line item key).
 * @param {string} key — the line item key (item.key)
 * @param {number} quantity — new quantity (0 to remove)
 * @returns {Promise<Object>} — the updated cart
 */
export async function changeItem(key, quantity) {
  const cart = await post(routes.cart_change_url + '.js', {
    id: key,
    quantity,
  });
  emit(cart);
  return cart;
}

/**
 * Update multiple line items at once.
 * @param {Object} updates — { [key]: quantity } map
 * @returns {Promise<Object>} — the updated cart
 */
export async function updateCart(updates) {
  const cart = await post(routes.cart_update_url + '.js', {
    updates,
  });
  emit(cart);
  return cart;
}

/**
 * Remove a line item from the cart.
 * @param {string} key — the line item key
 * @returns {Promise<Object>} — the updated cart
 */
export async function removeItem(key) {
  return changeItem(key, 0);
}
