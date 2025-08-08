/* Utility: select */
const $ = (q, ctx = document) => ctx.querySelector(q);
const $$ = (q, ctx = document) => Array.from(ctx.querySelectorAll(q));

/* Mobile nav toggle */
const navToggle = $('.nav-toggle');
const navMenu = $('#nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Close on navigation
  navMenu.addEventListener('click', (e) => {
    if (e.target.matches('a[data-nav]')) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* Smooth scroll for nav/CTA links */
$$('a[data-nav]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = $(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', href);
    }
  });
});

/* IntersectionObserver: section reveal + active link highlight */
const sections = $$('section[data-section]');
const navLinks = $$('a[data-nav]').filter(a => a.getAttribute('href')?.startsWith('#'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // Reveal animation
    if (entry.isIntersecting) entry.target.classList.add('in-view');

    // Active link highlight
    if (entry.isIntersecting && entry.target.id) {
      const id = `#${entry.target.id}`;
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === id;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'section');
        else link.removeAttribute('aria-current');
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(sec => io.observe(sec));

/* Set current year */
$('#year').textContent = new Date().getFullYear();

/* Small enhancement: respect reduced motion by disabling smooth scroll programmatically where needed */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
}
