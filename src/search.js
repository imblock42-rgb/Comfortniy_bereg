// @ts-check
import { isCheckoutAfterCheckin } from './dates.js';
import { applyDestinationFilter, getDestinationLabel } from './catalog.js';

/** @type {Record<string, string>} */
var DESTINATION_LABELS = {
  gagra: 'Гагра',
  pitsunda: 'Пицунда',
  'novy-afon': 'Новый Афон',
  sukhum: 'Сухум'
};

/**
 * Wires the hero search form and destination cards to the catalog filter.
 * @param {Document} doc
 */
export function initSearch(doc) {
  var listings = Array.prototype.slice.call(doc.querySelectorAll('#listings .room-card'));
  var catalogEmpty = doc.getElementById('catalog-empty');
  var catalogReset = doc.getElementById('catalog-reset');
  var destinationSelect = /** @type {HTMLSelectElement | null} */ (doc.getElementById('search-destination'));
  var searchForm = doc.getElementById('search');
  var searchStatus = doc.getElementById('search-status');

  function runFilter(destination) {
    var visibleCount = applyDestinationFilter(listings, destination);
    if (catalogEmpty) catalogEmpty.hidden = visibleCount !== 0;
  }

  function scrollToCatalog() {
    var target = doc.getElementById('catalog');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (searchForm) {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var destination = destinationSelect ? destinationSelect.value : '';
      var checkin = /** @type {HTMLInputElement | null} */ (doc.getElementById('search-checkin'));
      var checkout = /** @type {HTMLInputElement | null} */ (doc.getElementById('search-checkout'));

      if (checkin && checkout && !isCheckoutAfterCheckin(checkin.value, checkout.value)) {
        if (searchStatus) searchStatus.textContent = 'Дата выезда должна быть позже даты заезда.';
        checkout.focus();
        return;
      }

      runFilter(destination);
      scrollToCatalog();

      if (searchStatus) {
        var label = getDestinationLabel(destination, DESTINATION_LABELS);
        searchStatus.textContent = destination
          ? 'Показано жильё в направлении «' + label + '».'
          : 'Показано жильё по всем направлениям.';
      }
    });
  }

  doc.querySelectorAll('.destination-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var destination = /** @type {HTMLElement} */ (card).dataset.destination || '';
      if (destinationSelect) destinationSelect.value = destination;
      runFilter(destination);
      scrollToCatalog();
    });
  });

  if (catalogReset) {
    catalogReset.addEventListener('click', function () {
      if (destinationSelect) destinationSelect.value = '';
      runFilter('');
    });
  }
}
