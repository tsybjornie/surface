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
document.addEventListener("DOMContentLoaded", () => {
    // 1. Create the drawer HTML
    const drawerHTML = `
        <div id="pw-checkout-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9998; opacity:0; visibility:hidden; transition: 0.3s ease;"></div>

        <div id="pw-checkout-drawer" style="position:fixed; top:0; right:-450px; width:100%; max-width:450px; height:100%; background:#111110; z-index:9999; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); display:flex; flex-direction:column; box-shadow:-5px 0 15px rgba(0,0,0,0.5); color:#f0ece6; font-family:'Inter', sans-serif;">
            <div style="padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
                <h2 style="font-family:'DM Serif Display',serif; font-size:1.5rem; margin:0;">Select Your Kit</h2>
                <button id="pw-checkout-close" style="background:none; border:none; color:#f0ece6; font-size:1.5rem; cursor:pointer;">&times;</button>
            </div>
            
            <div style="padding: 1.5rem; flex: 1; overflow-y:auto;">
                <p style="font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-top:0; margin-bottom: 1.5rem; line-height: 1.5;">All kits are fully creditable towards your S$188 site assessment deposit.</p>
                
                <!-- Option 1: The Vibe Kit -->
                <div class="kit-option" data-price="12" style="border: 1px solid rgba(201,180,138,0.4); border-radius: 4px; padding: 1rem; margin-bottom: 1rem; cursor: pointer; transition: 0.2s; background: rgba(201,180,138,0.05);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 0.5rem;">
                        <h3 style="margin:0; font-family:'DM Serif Display',serif; font-size:1.2rem;">The Vibe Kit</h3>
                        <span style="font-size:1rem; color:#c9b48a;">S$12.00</span>
                    </div>
                    <p style="margin:0 0 0.5rem 0; font-size:0.8rem; color:rgba(255,255,255,0.5);">"I know my color family."</p>
                    <p style="margin:0; font-size:0.75rem; color:rgba(255,255,255,0.4);">4 Custom Mineral Tones (e.g. The Verdant Kit, The Crimson Kit).</p>
                </div>

                <!-- Option 2: The Designer's Deck -->
                <div class="kit-option" data-price="19" style="border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 1rem; margin-bottom: 1rem; cursor: pointer; transition: 0.2s;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 0.5rem;">
                        <h3 style="margin:0; font-family:'DM Serif Display',serif; font-size:1.2rem;">The Designer's Deck</h3>
                        <span style="font-size:1rem; color:#c9b48a;">S$19.00</span>
                    </div>
                    <p style="margin:0 0 0.5rem 0; font-size:0.8rem; color:rgba(255,255,255,0.5);">"I don't know what I want."</p>
                    <p style="margin:0; font-size:0.75rem; color:rgba(255,255,255,0.4);">12 Bestsellers — The "Safe" architectural hits.</p>
                </div>

                <!-- Option 3: The Master Studio -->
                <div class="kit-option" data-price="29" style="border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 1rem; margin-bottom: 1rem; cursor: pointer; transition: 0.2s;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 0.5rem;">
                        <h3 style="margin:0; font-family:'DM Serif Display',serif; font-size:1.2rem;">The Master Studio</h3>
                        <span style="font-size:1rem; color:#c9b48a;">S$29.00</span>
                    </div>
                    <p style="margin:0 0 0.5rem 0; font-size:0.8rem; color:rgba(255,255,255,0.5);">"I want the whole library."</p>
                    <p style="margin:0; font-size:0.75rem; color:rgba(255,255,255,0.4);">52 Tones — The full mineral spectrum.</p>
                </div>
                
                <hr style="border:none; border-top:1px solid rgba(255,255,255,0.06); margin: 2rem 0;">
                
                <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem;">
                    <span style="color:rgba(255,255,255,0.6); font-size:0.9rem;">Shipping</span>
                    <span style="font-size:0.9rem; color:#c9b48a;">Free</span>
                </div>
            </div>

            <div style="padding: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); background:#0a0907;">
                <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem;">
                    <strong style="font-size:1.1rem; font-family:'DM Serif Display',serif;">Total</strong>
                    <strong id="pw-checkout-total" style="font-size:1.1rem;">S$12.00</strong>
                </div>
                <button id="pw-checkout-btn" style="width:100%; background:#c9b48a; color:#111; border:none; padding:1rem; font-family:'Inter',sans-serif; font-size:0.9rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; cursor:pointer; border-radius:2px; transition: 0.2s;">
                    Checkout Securely
                </button>
                <p style="text-align:center; font-size:0.7rem; color:rgba(255,255,255,0.3); margin-top:1rem;">Powered by Stripe</p>
            </div>        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', drawerHTML);

    const overlay = document.getElementById('pw-checkout-overlay');
    const drawer = document.getElementById('pw-checkout-drawer');
    const closeBtn = document.getElementById('pw-checkout-close');
    const checkoutBtn = document.getElementById('pw-checkout-btn');

    
    // Logic for Kit Selection
    const kitOptions = document.querySelectorAll('.kit-option');
    const totalEl = document.getElementById('pw-checkout-total');
    let selectedPrice = 12;

    kitOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Reset styles
            kitOptions.forEach(opt => {
                opt.style.borderColor = 'rgba(255,255,255,0.1)';
                opt.style.background = 'transparent';
            });
            // Set active style
            option.style.borderColor = 'rgba(201,180,138,0.4)';
            option.style.background = 'rgba(201,180,138,0.05)';
            
            // Update total
            selectedPrice = option.getAttribute('data-price');
            totalEl.innerText = 'S$' + selectedPrice + '.00';
        });
    });
    
    function openCart(e) {
        if(e) e.preventDefault();
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
        drawer.style.right = '0';
    }

    function closeCart() {
        overlay.style.opacity = '0';
        drawer.style.right = '-400px';
        setTimeout(() => {
            overlay.style.visibility = 'hidden';
        }, 300);
    }

    closeBtn.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', () => {
        checkoutBtn.innerHTML = "Redirecting to Stripe...";
        setTimeout(() => {
            window.open('https://buy.stripe.com/test_dummy_link', '_blank');
            closeCart();
            checkoutBtn.innerHTML = "Checkout Securely";
        }, 1500);
    });

    // Attach to any button that says "Swatch Box"
    const buttons = document.querySelectorAll('a, button');
    buttons.forEach(btn => {
        if (btn.textContent.includes('Sample Kit') || btn.textContent.includes('Swatch Box') || btn.getAttribute('href') === '#swatch') {
            btn.addEventListener('click', openCart);
        }
    });
});
