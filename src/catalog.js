// @ts-check

/** @typedef {{ destination: string }} ListingRecord */

/**
 * Pure filter: given plain records with a `destination` field, returns the
 * subset matching the requested destination (empty/falsy destination = all).
 * @param {ListingRecord[]} records
 * @param {string} destination
 * @returns {ListingRecord[]}
 */
export function filterListingRecords(records, destination) {
  if (!destination) return records.slice();
  return records.filter(function (record) {
    return record.destination === destination;
  });
}

/**
 * Applies a destination filter to live listing elements by toggling `.hidden`.
 * Returns the number of listings left visible.
 * @param {{ hidden: boolean, dataset: { destination?: string } }[]} listingElements
 * @param {string} destination
 * @returns {number}
 */
export function applyDestinationFilter(listingElements, destination) {
  var visibleCount = 0;
  listingElements.forEach(function (element) {
    var match = !destination || element.dataset.destination === destination;
    element.hidden = !match;
    if (match) visibleCount += 1;
  });
  return visibleCount;
}

/**
 * Resolves a human-readable label for a destination code, falling back to
 * the raw code (or a generic phrase when no destination is selected).
 * @param {string} destination
 * @param {Record<string, string>} labels
 * @returns {string}
 */
export function getDestinationLabel(destination, labels) {
  if (!destination) return 'по всем направлениям';
  return labels[destination] || destination;
}
