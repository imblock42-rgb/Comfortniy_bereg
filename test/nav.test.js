import { describe, it, expect, beforeEach } from 'vitest';
import { initMobileNav } from '../src/nav.js';

describe('initMobileNav', () => {
  /** @type {HTMLButtonElement} */
  let toggle;
  /** @type {HTMLElement} */
  let menu;

  beforeEach(() => {
    document.body.innerHTML = `
      <button class="nav-toggle" aria-expanded="false"></button>
      <nav id="nav-menu">
        <a href="#a">A</a>
        <a href="#b">B</a>
      </nav>
    `;
    toggle = document.querySelector('.nav-toggle');
    menu = document.getElementById('nav-menu');
    initMobileNav(toggle, menu);
  });

  it('opens the menu and flips aria-expanded on toggle click', () => {
    toggle.click();
    expect(menu.classList.contains('is-open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes the menu on a second toggle click', () => {
    toggle.click();
    toggle.click();
    expect(menu.classList.contains('is-open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the menu when a nav link is clicked', () => {
    toggle.click();
    menu.querySelector('a').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(menu.classList.contains('is-open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the menu and returns focus to the toggle on Escape', () => {
    toggle.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(menu.classList.contains('is-open')).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it('does nothing when elements are missing', () => {
    expect(() => initMobileNav(null, null)).not.toThrow();
  });
});
