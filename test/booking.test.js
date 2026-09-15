import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initBookButtons, initBookingForm } from '../src/booking.js';

// jsdom does not implement scrollIntoView.
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe('initBookButtons', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="booking">
        <input id="booking-listing" />
        <input id="booking-name" />
      </section>
      <button class="book-btn" data-listing="Апартаменты, Гагра">Забронировать</button>
    `;
    initBookButtons(document);
  });

  it('pre-fills the listing field with the button data-listing on click', () => {
    document.querySelector('.book-btn').click();
    const listingInput = /** @type {HTMLInputElement} */ (document.getElementById('booking-listing'));
    expect(listingInput.value).toBe('Апартаменты, Гагра');
  });

  it('scrolls the booking section into view on click', () => {
    document.querySelector('.book-btn').click();
    expect(document.getElementById('booking').scrollIntoView).toHaveBeenCalled();
  });
});

describe('initBookingForm', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="booking-form">
        <p id="booking-status"></p>
        <input id="booking-name" name="name" required />
        <input id="booking-phone" name="phone" required />
        <input id="booking-checkin" type="date" />
        <input id="booking-checkout" type="date" />
        <button type="submit">Отправить</button>
      </form>
    `;
    initBookingForm(document);
  });

  function submit() {
    document.getElementById('booking-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    );
  }

  it('shows a validation message and does not confirm when required fields are empty', () => {
    submit();
    const status = document.getElementById('booking-status');
    expect(status.textContent).toMatch(/Заполните обязательные поля/);
    expect(status.classList.contains('is-error')).toBe(true);
  });

  it('rejects a checkout date on or before checkin', () => {
    /** @type {HTMLInputElement} */ (document.getElementById('booking-name')).value = 'Иван';
    /** @type {HTMLInputElement} */ (document.getElementById('booking-phone')).value = '+7 900 000-00-00';
    /** @type {HTMLInputElement} */ (document.getElementById('booking-checkin')).value = '2026-09-20';
    /** @type {HTMLInputElement} */ (document.getElementById('booking-checkout')).value = '2026-09-20';

    submit();

    const status = document.getElementById('booking-status');
    expect(status.textContent).toMatch(/Дата выезда должна быть позже/);
  });

  it('shows a confirmation and resets the form on a valid submit', () => {
    /** @type {HTMLInputElement} */ (document.getElementById('booking-name')).value = 'Иван';
    /** @type {HTMLInputElement} */ (document.getElementById('booking-phone')).value = '+7 900 000-00-00';
    /** @type {HTMLInputElement} */ (document.getElementById('booking-checkin')).value = '2026-09-20';
    /** @type {HTMLInputElement} */ (document.getElementById('booking-checkout')).value = '2026-09-25';

    submit();

    const status = document.getElementById('booking-status');
    expect(status.textContent).toMatch(/Заявка отправлена/);
    expect(status.classList.contains('is-error')).toBe(false);
    expect(/** @type {HTMLInputElement} */ (document.getElementById('booking-name')).value).toBe('');
  });
});
