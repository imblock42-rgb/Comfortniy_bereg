// @ts-check
import { isCheckoutAfterCheckin } from './dates.js';

/**
 * Wires "Забронировать" buttons: pre-fill the inquiry form and jump to it.
 * @param {Document} doc
 */
export function initBookButtons(doc) {
  var listingInput = /** @type {HTMLInputElement | null} */ (doc.getElementById('booking-listing'));
  var nameInput = /** @type {HTMLInputElement | null} */ (doc.getElementById('booking-name'));

  doc.querySelectorAll('.book-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      if (listingInput) {
        listingInput.value = /** @type {HTMLElement} */ (button).dataset.listing || '';
      }
      var target = doc.getElementById('booking');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (nameInput) {
        doc.defaultView && doc.defaultView.setTimeout(function () {
          nameInput.focus();
        }, 400);
      }
    });
  });
}

/**
 * Wires the booking inquiry form submit handler. Static prototype: no
 * network request is made, the form only validates and shows a confirmation.
 * @param {Document} doc
 */
export function initBookingForm(doc) {
  var bookingForm = /** @type {HTMLFormElement | null} */ (doc.getElementById('booking-form'));
  var bookingStatus = doc.getElementById('booking-status');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var checkin = /** @type {HTMLInputElement | null} */ (doc.getElementById('booking-checkin'));
    var checkout = /** @type {HTMLInputElement | null} */ (doc.getElementById('booking-checkout'));

    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      if (bookingStatus) {
        bookingStatus.textContent = 'Заполните обязательные поля, отмеченные выше.';
        bookingStatus.classList.add('is-error');
      }
      return;
    }

    if (checkin && checkout && !isCheckoutAfterCheckin(checkin.value, checkout.value)) {
      if (bookingStatus) {
        bookingStatus.textContent = 'Дата выезда должна быть позже даты заезда.';
        bookingStatus.classList.add('is-error');
      }
      checkout.focus();
      return;
    }

    var submitButton = /** @type {HTMLButtonElement | null} */ (bookingForm.querySelector('button[type="submit"]'));
    if (submitButton) submitButton.disabled = true;

    if (bookingStatus) {
      bookingStatus.classList.remove('is-error');
      bookingStatus.textContent = 'Заявка отправлена! Мы свяжемся с вами по указанному телефону.';
    }

    bookingForm.reset();
    if (submitButton) submitButton.disabled = false;
  });
}
