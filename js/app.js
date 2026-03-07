/**
 * Plain Work — Main JavaScript
 * Includes: navigation, scroll reveal, micro-animations, video hero
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initScrollReveal();
    initMicroAnimations();
    initFAQ();
    initVideoHero();
    initContactForm();
});

/* ── Navigation ── */
function initNavigation() {
    const header = document.querySelector('.site-header');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileBtn) mobileBtn.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Nav pill — always visible, elevates on scroll
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }
}

/* ── Smooth scroll ── */
function initScrollEffects() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const el = document.querySelector(targetId);
            if (el) {
                window.scrollTo({
                    top: el.getBoundingClientRect().top + window.pageYOffset - 90,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ── Scroll Reveal ──
   Any element with class "reveal" fades + slides in when it enters viewport.
   Supports: reveal-up (default), reveal-left, reveal-right, reveal-fade
   Add delay with data-delay="200" (ms)
*/
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.delay || 0;
                setTimeout(() => el.classList.add('revealed'), parseInt(delay));
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    // Auto-tag common elements if they don't have a class already
    const autoReveal = [
        '.section-title',
        '.service-card',
        '.about-content',
        '.process-step',
        '.faq-item',
        '.case-study',
        '.coming-soon-card',
        '.cs-spec-item',
        '.journal-hero h1',
        '.stat-item',
        '.feature-block',
        '.system-card',
    ];

    autoReveal.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal', 'reveal-up');
                el.dataset.delay = i * 80;
            }
        });
    });

    // Also observe anything already tagged
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Micro Animations ── */
function initMicroAnimations() {
    // Spot counter — count up from 0 to N
    const spotsEl = document.querySelector('[data-spots-total]');
    if (spotsEl) {
        const total = parseInt(spotsEl.dataset.spotsTotal) || 10;
        const taken = parseInt(spotsEl.dataset.spotsTaken) || 0;
        const squares = spotsEl.querySelectorAll('.spot-square');
        squares.forEach((sq, i) => {
            setTimeout(() => {
                sq.classList.add(i < taken ? 'spot-taken' : 'spot-open');
            }, i * 120);
        });
    }

    // Parallax drift on hero image
    const heroBg = document.querySelector('.hero-bg img, .hero-video');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }, { passive: true });
    }

    // Hover micro-lift on cards
    document.querySelectorAll('.service-card, .system-card, .case-study').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease';
            card.style.transform = 'translateY(-6px)';
            card.style.boxShadow = '0 16px 48px rgba(0,0,0,0.13)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });


}

/* ── Video Hero ── */
function initVideoHero() {
    const video = document.querySelector('.hero-video-el');
    if (!video) return;

    // Ensure video plays on mobile (muted autoplay policy)
    video.muted = true;
    video.play().catch(() => {
        // Fallback: show poster image if video can't play
        video.closest('.hero-video-wrap')?.classList.add('no-video');
    });
}

/* ── FAQ Accordion ── */
function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('h3');
        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        }
    });
}

/* ── Contact Form → WhatsApp ── */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('cf-name')?.value.trim() || '';
        const email = document.getElementById('cf-email')?.value.trim() || '';
        const system = document.getElementById('cf-system')?.value || '';
        const message = document.getElementById('cf-message')?.value.trim() || '';

        const systemLabel = {
            'lime-paint': 'Lime Paint',
            'lime-plaster': 'Lime Plaster',
            'microcement': 'Microcement',
            'liquid-metal': 'Liquid Metal',
            'patina': 'Patina & Oxidised',
            'mural': 'Custom Mural & Graphics',
            'other': 'Other / Not Sure'
        }[system] || 'Not specified';

        const text = [
            `Hi Plain Work! I'd like to enquire about a surface project.`,
            ``,
            `Name: ${name}`,
            `Email: ${email}`,
            `System Interested In: ${systemLabel}`,
            ``,
            `Details:`,
            message || '(No additional details provided)'
        ].join('\n');

        const url = `https://wa.me/6598004317?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    });
}
