
const progress = document.querySelector('.progress');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav-links');

if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

function updateProgress() {
  const h = document.documentElement;
  const ratio = (h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight);
  if (progress) progress.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
}
updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });

if (sections.length && navLinks.length) {
  const linkMap = new Map(navLinks.map(a => [a.getAttribute('href').slice(1), a]));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = linkMap.get(entry.target.id);
      if (entry.isIntersecting && link) {
        navLinks.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-35% 0px -50% 0px', threshold: 0.1 });
  sections.forEach(section => observer.observe(section));
}

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(node => revealObserver.observe(node));
