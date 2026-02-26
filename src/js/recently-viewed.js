/**
 * Recently viewed products — localStorage backed.
 *
 * Stores product handles as a simple array. Newest first,
 * capped at MAX_ITEMS to avoid unbounded storage growth.
 *
 * @module recently-viewed
 */

const STORAGE_KEY = 'foil:recently-viewed';
const MAX_ITEMS = 20;

/**
 * Get the list of recently viewed product handles.
 * @returns {string[]}
 */
export function getProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Add a product handle to the recently viewed list.
 * Moves it to the front if it already exists.
 * @param {string} handle — the product handle (e.g. "charizard-nm")
 */
export function addProduct(handle) {
  if (!handle) return;

  try {
    let items = getProducts();
    // Remove duplicate if exists, then prepend
    items = items.filter((h) => h !== handle);
    items.unshift(handle);
    // Cap length
    if (items.length > MAX_ITEMS) items.length = MAX_ITEMS;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable — silently fail
  }
}

/**
 * Clear all recently viewed products.
 */
export function clearProducts() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
