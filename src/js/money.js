/**
 * Money formatting — converts Shopify cents to display strings.
 *
 * Uses the store's `money_format` from `window.Foil.money_format`
 * which is set by Liquid in theme.liquid.
 *
 * @module money
 */

/**
 * Format a price in cents to a display string.
 *
 * Shopify money formats use `{{amount}}`, `{{amount_no_decimals}}`,
 * `{{amount_with_comma_separator}}`, or `{{amount_no_decimals_with_comma_separator}}`.
 *
 * @param {number} cents — price in cents (e.g. 1999 = $19.99)
 * @param {string} [format] — Shopify money_format string. Falls back to window.Foil.money_format.
 * @returns {string} — formatted price string (e.g. "$19.99")
 */
export function formatMoney(cents, format) {
  const fmt = format || window.Foil?.money_format || '${{amount}}';
  const amount = (cents / 100).toFixed(2);
  const amountNoDecimals = Math.round(cents / 100).toString();

  // Amount with comma separator (e.g. 1,999.00)
  const amountWithComma = amount.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );

  // Amount no decimals with comma separator (e.g. 1,999)
  const amountNoDecimalsWithComma = amountNoDecimals.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );

  return fmt
    .replace('{{amount_with_comma_separator}}', amountWithComma)
    .replace('{{amount_no_decimals_with_comma_separator}}', amountNoDecimalsWithComma)
    .replace('{{amount_no_decimals}}', amountNoDecimals)
    .replace('{{amount}}', amount);
}
