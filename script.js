const progress = document.querySelector('.progress');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav-links');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });
}

function updateProgress() {
  const h = document.documentElement;
  const scrollTop = h.scrollTop || document.body.scrollTop;
  const scrollHeight = h.scrollHeight - h.clientHeight;
  const ratio = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

  if (progress) {
    progress.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  }
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

function updateActiveLink() {
  if (!sections.length || !navLinks.length) return;

  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.offsetHeight : 72;

  // 用视口上方偏下一点的位置作为判断基准
  const marker = window.scrollY + headerHeight + 120;

  let currentSectionId = sections[0].id;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (marker >= top && marker < bottom) {
      currentSectionId = section.id;
    }
  });

  // 页面接近底部时，强制高亮最后一个 section
  const nearBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

  if (nearBottom) {
    currentSectionId = sections[sections.length - 1].id;
  }

  navLinks.forEach(link => {
    const targetId = link.getAttribute('href').slice(1);
    link.classList.toggle('active', targetId === currentSectionId);
  });
}

function handleScroll() {
  updateProgress();
  updateActiveLink();
}

updateProgress();
updateActiveLink();

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', updateActiveLink);

const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  reveals.forEach(node => revealObserver.observe(node));
} else {
  reveals.forEach(node => node.classList.add('visible'));
}