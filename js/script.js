/* ============================================================
   NEXUS AI — MAIN JAVASCRIPT
   Particles, Onboarding, Scroll Animations, Nav, Typewriter
   ============================================================ */

/* ---------- PARTICLE SYSTEM ---------- */
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.connections = [];
    this.mouse = { x: null, y: null };
    this.animationId = null;
    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 80);
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '123,47,255' : '0,212,255',
      pulseOffset: Math.random() * Math.PI * 2,
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const time = Date.now() * 0.001;

    this.particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Mouse repulsion
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x += (dx / dist) * 0.8;
          p.y += (dy / dist) * 0.8;
        }
      }

      // Pulse opacity
      const pulse = Math.sin(time * 1.5 + p.pulseOffset) * 0.15 + 0.85;
      const alpha = p.opacity * pulse;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color},${alpha})`;
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const q = this.particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const lineAlpha = (1 - dist / 140) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(q.x, q.y);
          this.ctx.strokeStyle = `rgba(123,47,255,${lineAlpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

/* ---------- TYPEWRITER EFFECT ---------- */
class Typewriter {
  constructor(el, words, speed = 80, pause = 2200) {
    this.el = el;
    this.words = words;
    this.speed = speed;
    this.pause = pause;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const currentWord = this.words[this.wordIndex % this.words.length];
    const displayed = this.isDeleting
      ? currentWord.substring(0, this.charIndex - 1)
      : currentWord.substring(0, this.charIndex + 1);

    this.el.textContent = displayed;

    if (!this.isDeleting && displayed === currentWord) {
      setTimeout(() => { this.isDeleting = true; this.type(); }, this.pause);
      return;
    }
    if (this.isDeleting && displayed === '') {
      this.isDeleting = false;
      this.wordIndex++;
      setTimeout(() => this.type(), 400);
      return;
    }

    this.charIndex = this.isDeleting ? this.charIndex - 1 : this.charIndex + 1;
    setTimeout(() => this.type(), this.isDeleting ? this.speed / 2 : this.speed);
  }
}


/* ---------- SCROLL REVEAL ---------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ---------- NAVBAR ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Hamburger
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    if (mobileClose) mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ---------- COUNTER ANIMATION ---------- */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        const update = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent = (Number.isInteger(target) ? Math.floor(value) : value.toFixed(1)) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ---------- CONTACT FORM ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please fill in all fields');
      return;
    }
    if (!isValidEmail(email)) {
      showToast('⚠️ Please enter a valid email');
      return;
    }

    btn.classList.add('loading');
    setTimeout(() => {
      btn.classList.remove('loading');
      btn.classList.add('success');
      btn.querySelector('.btn-text').textContent = '✓ Message Sent!';
      form.reset();
      showToast('🚀 Message sent! We\'ll get back to you soon.');
      setTimeout(() => {
        btn.classList.remove('success');
        btn.querySelector('.btn-text').textContent = 'Send Message →';
      }, 3000);
    }, 1800);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ---------- TOAST NOTIFICATION ---------- */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon">💡</span><span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ---------- PAGE TRANSITION ---------- */
function initPageTransitions() {
  let transitionEl = document.querySelector('.page-transition');
  if (!transitionEl) {
    transitionEl = document.createElement('div');
    transitionEl.className = 'page-transition';
    document.body.appendChild(transitionEl);
  }

  // Fade in on load
  document.body.style.opacity = '0';
  window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });

  // Intercept internal links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href === '#') return;
    if (link.target === '_blank') return;

    e.preventDefault();
    transitionEl.classList.add('active');
    setTimeout(() => { window.location.href = href; }, 350);
  });
}

/* ---------- ADD CSS KEYFRAME FOR SHAKE ---------- */
function addShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(style);
}

/* ---------- SMOOTH HOVER TILT ON CARDS ---------- */
function initCardTilt() {
  const cards = document.querySelectorAll('.service-card, .product-card, .leader-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotY = ((x - cx) / cx) * 4;
      const rotX = -((y - cy) / cy) * 4;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------- INIT ALL ---------- */
document.addEventListener('DOMContentLoaded', () => {
  addShakeKeyframe();
  new ParticleSystem('particle-canvas');
  initNavbar();
  initScrollReveal();
  animateCounters();
  initContactForm();
  initPageTransitions();

  // Typewriter only if element exists
  const twEl = document.getElementById('typewriter');
  if (twEl) {
    new Typewriter(twEl, [
      'Intelligent Solutions',
      'AI-Powered Products',
      'Next-Gen Automation',
      'Smarter Workflows',
      'Deep Learning Models',
    ]);
  }

  // Card tilt on desktop
  if (window.innerWidth > 768) {
    setTimeout(initCardTilt, 500);
  }
});
