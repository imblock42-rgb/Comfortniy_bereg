// @ts-check

/**
 * Wires up the mobile hamburger nav: toggle button, click-outside-closes-on-link,
 * and Escape-to-close-and-return-focus. No-ops safely if elements are missing.
 * @param {HTMLElement | null} toggle
 * @param {HTMLElement | null} menu
 */
export function initMobileNav(toggle, menu) {
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}
