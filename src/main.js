// @ts-check
import { initMobileNav } from './nav.js';
import { initSearch } from './search.js';
import { initBookButtons, initBookingForm } from './booking.js';

function init() {
  initMobileNav(document.querySelector('.nav-toggle'), document.getElementById('nav-menu'));
  initSearch(document);
  initBookButtons(document);
  initBookingForm(document);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
