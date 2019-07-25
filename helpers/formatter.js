/**
 * Helper for formatting amounts and quantities
 */

/**
 * Formats the number in the appropriate locale
 * @param {int} quantity 
 * @return {string} Formatted quantity
 */
const format = (quantity) => {
  const formatter = new Intl.NumberFormat('en-In');
  return formatter.format(quantity);
}

/**
 * Formats the amount into rupees
 * @param {int} amount - Amount int
 * @return {string} Formatted amount 
 */
const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });
  return formatter.format(amount);
}

module.exports = {
  format,
  formatCurrency
}