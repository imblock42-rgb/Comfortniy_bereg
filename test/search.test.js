import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initSearch } from '../src/search.js';

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();

  document.body.innerHTML = `
    <form id="search">
      <select id="search-destination">
        <option value="">Любое направление</option>
        <option value="gagra">Гагра</option>
        <option value="pitsunda">Пицунда</option>
      </select>
      <input id="search-checkin" type="date" />
      <input id="search-checkout" type="date" />
      <button type="submit">Найти</button>
    </form>
    <p id="search-status"></p>

    <div class="destination-card" data-destination="pitsunda"></div>

    <section id="catalog">
      <div id="listings">
        <article class="room-card" data-destination="gagra"></article>
        <article class="room-card" data-destination="pitsunda"></article>
        <article class="room-card" data-destination="gagra"></article>
      </div>
      <p id="catalog-empty" hidden>
        Ничего не найдено
        <button type="button" id="catalog-reset">Показать всё</button>
      </p>
    </section>
  `;

  initSearch(document);
});

function submitSearch() {
  document.getElementById('search').dispatchEvent(
    new Event('submit', { bubbles: true, cancelable: true })
  );
}

describe('initSearch — search form', () => {
  it('filters listings to the selected destination on submit', () => {
    /** @type {HTMLSelectElement} */ (document.getElementById('search-destination')).value = 'gagra';
    submitSearch();

    const cards = document.querySelectorAll('.room-card');
    expect(cards[0].hidden).toBe(false);
    expect(cards[1].hidden).toBe(true);
    expect(cards[2].hidden).toBe(false);
    expect(document.getElementById('search-status').textContent).toMatch(/Гагра/);
  });

  it('shows every listing when no destination is selected', () => {
    submitSearch();
    document.querySelectorAll('.room-card').forEach((card) => {
      expect(card.hidden).toBe(false);
    });
  });

  it('rejects a checkout date on or before checkin and does not filter', () => {
    /** @type {HTMLInputElement} */ (document.getElementById('search-checkin')).value = '2026-09-20';
    /** @type {HTMLInputElement} */ (document.getElementById('search-checkout')).value = '2026-09-18';
    /** @type {HTMLSelectElement} */ (document.getElementById('search-destination')).value = 'gagra';

    submitSearch();

    expect(document.getElementById('search-status').textContent).toMatch(/Дата выезда должна быть позже/);
    document.querySelectorAll('.room-card').forEach((card) => {
      expect(card.hidden).toBe(false);
    });
  });
});

describe('initSearch — destination cards', () => {
  it('filters the catalog and syncs the select when a destination card is clicked', () => {
    document.querySelector('.destination-card').dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const cards = document.querySelectorAll('.room-card');
    expect(cards[0].hidden).toBe(true);
    expect(cards[1].hidden).toBe(false);
    expect(/** @type {HTMLSelectElement} */ (document.getElementById('search-destination')).value).toBe('pitsunda');
  });
});

describe('initSearch — reset', () => {
  it('shows all listings again when the empty-state reset button is used', () => {
    document.querySelector('.destination-card').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    document.getElementById('catalog-reset').click();

    document.querySelectorAll('.room-card').forEach((card) => {
      expect(card.hidden).toBe(false);
    });
  });
});
