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
document.addEventListener("DOMContentLoaded", () => {
    // 1. Add html2pdf library to the document head
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    document.head.appendChild(script);

    // 2. HTML for the New Quoter Modal & PDF Template
    const quoterHTML = `
        <!-- Quoter Modal -->
        <div id="pw-quoter-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9998; opacity:0; visibility:hidden; transition: 0.3s ease; display:flex; align-items:center; justify-content:center;">
            <div id="pw-quoter-modal" style="background:#111110; border:1px solid #c9b48a; width:100%; max-width:500px; padding:2.5rem; position:relative; color:#fff; font-family:'Inter',sans-serif; transform:translateY(20px); transition:0.3s ease; max-height: 90vh; overflow-y:auto;">
                <button id="pw-quoter-close" style="position:absolute; top:1rem; right:1.5rem; background:none; border:none; color:#fff; font-size:1.5rem; cursor:pointer;">&times;</button>
                
                <!-- Step 1: Form Input -->
                <div id="pw-quoter-step-1">
                    <h2 style="font-family:'DM Serif Display',serif; font-size:1.8rem; margin-top:0; margin-bottom:1.5rem;">Instant AI Quote</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                        <div>
                            <label style="display:block; margin-bottom:0.5rem; font-size:0.75rem; color:#c9b48a; text-transform:uppercase; letter-spacing:0.1em;">Name *</label>
                            <input type="text" id="q-name" required style="width:100%; padding:0.8rem; background:#1a1a18; border:1px solid rgba(255,255,255,0.2); color:#fff; outline:none; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display:block; margin-bottom:0.5rem; font-size:0.75rem; color:#c9b48a; text-transform:uppercase; letter-spacing:0.1em;">Phone / Email *</label>
                            <input type="text" id="q-contact" required style="width:100%; padding:0.8rem; background:#1a1a18; border:1px solid rgba(255,255,255,0.2); color:#fff; outline:none; box-sizing: border-box;">
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display:block; margin-bottom:0.5rem; font-size:0.75rem; color:#c9b48a; text-transform:uppercase; letter-spacing:0.1em;">Project Address *</label>
                        <input type="text" id="q-address" placeholder="e.g. Blk 123 Tampines Ave 1" required style="width:100%; padding:0.8rem; background:#1a1a18; border:1px solid rgba(255,255,255,0.2); color:#fff; outline:none; box-sizing: border-box;">
                    </div>

                    <label style="display:block; margin-bottom:0.5rem; font-size:0.75rem; color:#c9b48a; text-transform:uppercase; letter-spacing:0.1em;">1. Scope of Work</label>
                    <select id="q-scope" style="width:100%; padding:0.8rem; background:#1a1a18; border:1px solid rgba(255,255,255,0.2); color:#fff; margin-bottom:1rem; outline:none; box-sizing: border-box;" onchange="document.getElementById('wall-qty-wrapper').style.display = this.value.startsWith('wall') ? 'block' : 'none';">
                        <option value="whole_3">Whole House (3-Room BTO) - Approx 2,200 sqft</option>
                        <option value="whole_4">Whole House (4-Room BTO) - Approx 2,720 sqft</option>
                        <option value="whole_5">Whole House (5-Room BTO) - Approx 3,200 sqft</option>
                        <option value="wall_s">Feature Wall - Small (~6 sqm / 65 sqft)</option>
                        <option value="wall_m">Feature Wall - Medium (~12 sqm / 130 sqft)</option>
                        <option value="wall_l">Feature Wall - Large (~18 sqm / 195 sqft)</option>
                    </select>

                    <div id="wall-qty-wrapper" style="display: none; margin-bottom: 1.5rem; background: rgba(255,255,255,0.03); padding: 1rem; border-left: 2px solid #c9b48a;">
                        <label style="display:block; margin-bottom:0.5rem; font-size:0.75rem; color:#fff;">How many walls of this size?</label>
                        <input type="number" id="q-wall-qty" value="1" min="1" max="10" style="width:100%; padding:0.8rem; background:#111; border:1px solid rgba(255,255,255,0.2); color:#fff; outline:none; box-sizing: border-box;">
                    </div>

                    <label style="display:block; margin-bottom:0.5rem; font-size:0.75rem; color:#c9b48a; text-transform:uppercase; letter-spacing:0.1em;">2. Architectural System</label>
                    <select id="q-system" style="width:100%; padding:0.8rem; background:#1a1a18; border:1px solid rgba(255,255,255,0.2); color:#fff; margin-bottom:1rem; outline:none; box-sizing: border-box;">
                        <option value="lime_paint">Lime Paint</option>
                        <option value="lime_plaster">Lime Plaster (Shikkui Stone)</option>
                        <option value="microcement">Microcement</option>
                        <option value="liquid_metal">Liquid Metal</option>
                    </select>
                    
                    <div style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="q-ceiling" style="width: 18px; height: 18px; accent-color: #c9b48a; cursor: pointer;">
                        <label for="q-ceiling" style="font-size: 0.85rem; cursor: pointer;">Include Ceiling Application (+50% Area Multiplier)</label>
                    </div>

                    <label style="display:block; margin-bottom:0.5rem; font-size:0.75rem; color:#c9b48a; text-transform:uppercase; letter-spacing:0.1em;">3. Upload Floorplan / Wall Photo</label>
                    <div style="border: 1px dashed rgba(255,255,255,0.3); padding: 1.5rem; text-align: center; margin-bottom: 2rem; cursor: pointer; transition: 0.2s;" onmouseover="this.style.borderColor='#c9b48a'" onmouseout="this.style.borderColor='rgba(255,255,255,0.3)'" onclick="document.getElementById('q-file').click()">
                        <span id="q-file-label" style="opacity: 0.7;">Click to select file (PDF, JPG)</span>
                        <input type="file" id="q-file" accept="image/*,application/pdf" style="display:none;" onchange="document.getElementById('q-file-label').innerText = this.files[0].name; document.getElementById('q-file-label').style.color='#c9b48a';">
                    </div>

                    <button id="q-analyze-btn" style="width:100%; background:#c9b48a; color:#111; border:none; padding:1rem; font-family:'Inter',sans-serif; font-size:1rem; font-weight:500; cursor:pointer; transition:0.2s;">
                        Generate Instant Quote
                    </button>
                </div>
                <!-- Step 2: Loading AI -->
                <div id="pw-quoter-step-2" style="display:none; text-align:center; padding: 2rem 0;">
                    <h3 style="font-family:'DM Serif Display',serif; font-size:1.5rem; margin-bottom:1rem;">KiloClaw Vision AI is analyzing...</h3>
                    <p style="opacity:0.7; margin-bottom:2rem; font-size:0.9rem;">Extracting dimensions and mapping material requirements.</p>
                    <div style="margin: 0 auto; width: 40px; height: 40px; border: 2px solid #c9b48a; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>

                <!-- Step 3: Result & PDF Download -->
                <div id="pw-quoter-step-3" style="display:none; text-align:center;">
                    <h3 style="font-family:'DM Serif Display',serif; font-size:1.8rem; margin-bottom:0.5rem; color:#c9b48a;">Analysis Complete</h3>
                    <p style="opacity:0.8; margin-bottom:2rem; font-size:0.9rem;">Your official Plainwork estimate is ready.</p>
                    
                    <div style="background:#1a1a18; padding:1.5rem; border:1px solid rgba(255,255,255,0.1); margin-bottom:2rem;">
                        <div style="font-size:0.8rem; opacity:0.6; text-transform:uppercase; margin-bottom:0.5rem;">Estimated Investment</div>
                        <div id="q-final-price" style="font-size:2.5rem; font-family:'DM Serif Display',serif; margin-bottom:0.5rem;">S$0</div>
                        <div style="font-size:0.8rem; color:#c9b48a;">Valid for 7 Days</div>
                    </div>

                    <button id="q-download-btn" style="width:100%; background:transparent; border:1px solid #c9b48a; color:#c9b48a; padding:1rem; font-family:'Inter',sans-serif; font-size:1rem; font-weight:500; cursor:pointer; margin-bottom:1rem; transition:0.2s;">
                        ⬇ Download Official Quote (PDF)
                    </button>
                    
                    <button onclick="window.location.href='#deposit'" style="width:100%; background:#c9b48a; color:#111; border:none; padding:1rem; font-family:'Inter',sans-serif; font-size:1rem; font-weight:500; cursor:pointer;">
                        Lock In S$188 Deposit
                    </button>
                </div>
            </div>
        </div>

        <!-- Hidden PDF Template -->
        <div id="quote-pdf-template" style="display:none;">
            <div style="padding: 60px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; background: #fff; width: 800px; max-width:100%;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 30px; border-bottom: 2px solid #111; padding-bottom: 20px;">
                    <div>
                        <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">Plain Work</h1>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">A Mineral Surface Studio</p>
                    </div>
                    <div style="text-align: right; font-size: 14px; color: #444;">
                        <p style="margin: 0;"><strong>Date:</strong> <span id="pdf-date"></span></p>
                        <p style="margin: 5px 0 0 0;"><strong>Valid Until:</strong> <span id="pdf-expiry"></span></p>
                        <p style="margin: 5px 0 0 0;"><strong>Quote Ref:</strong> PW-<span id="pdf-ref"></span></p>
                    </div>
                </div>
                
                <div style="display:flex; justify-content:space-between; margin-bottom: 30px; font-size: 13px;">
                    <div>
                        <p style="margin:0 0 5px 0; font-weight:bold; text-transform:uppercase; color:#888;">Prepared For:</p>
                        <p style="margin:0 0 3px 0; font-size:15px;" id="pdf-client-name"></p>
                        <p style="margin:0 0 3px 0;" id="pdf-client-contact"></p>
                        <p style="margin:0;" id="pdf-client-address"></p>
                    </div>
                </div>

                <h2 style="margin-top: 0; font-size: 20px; text-transform: uppercase; color: #111;">Project Estimate</h2>
                
                <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
                    <table style="width: 100%; text-align: left; border-collapse: collapse; font-size:14px;">
                        <tr>
                            <th style="padding: 12px 0; border-bottom: 1px solid #ddd; width: 35%;">Scope of Work</th>
                            <td style="padding: 12px 0; border-bottom: 1px solid #ddd;" id="pdf-scope"></td>
                        </tr>
                        <tr>
                            <th style="padding: 12px 0; border-bottom: 1px solid #ddd;">Architectural System</th>
                            <td style="padding: 12px 0; border-bottom: 1px solid #ddd;" id="pdf-system"></td>
                        </tr>
                        <tr>
                            <th style="padding: 12px 0; border-bottom: 1px solid #ddd;">Ceiling Application</th>
                            <td style="padding: 12px 0; border-bottom: 1px solid #ddd;" id="pdf-ceiling"></td>
                        </tr>
                        <tr>
                            <th style="padding: 12px 0; border-bottom: 1px solid #ddd;">Base Material Cost</th>
                            <td style="padding: 12px 0; border-bottom: 1px solid #ddd;">Included</td>
                        </tr>
                        <tr>
                            <th style="padding: 12px 0;">Artisan Application</th>
                            <td style="padding: 12px 0;">Included</td>
                        </tr>
                    </table>
                </div>

                <div style="text-align: right; margin-top: 30px; margin-bottom: 40px;">
                    <p style="font-size: 14px; color: #666; margin: 0 0 5px 0; text-transform: uppercase;">Estimated Investment</p>
                    <h2 style="font-size: 36px; margin: 0; color: #111;" id="pdf-price"></h2>
                </div>

                <div style="border-top: 1px solid #ccc; padding-top: 20px; font-size: 11px; color: #666; line-height: 1.6;">
                    <p style="margin: 0 0 10px 0;"><strong>Terms & Conditions:</strong></p>
                    <p style="margin: 0 0 5px 0;">1. This is a preliminary estimate generated by KiloClaw Vision AI based on client inputs.</p>
                    <p style="margin: 0 0 5px 0;">2. <strong>Mandatory Preparation:</strong> Prices exclude Level 5 Dustless Resurfacing prep (+S$1.50 - S$3.50/sqft) if required upon physical site assessment.</p>
                    <p style="margin: 0 0 5px 0;">3. Exact replication of sample textures is not possible. Mineral finishes are living materials and artisan-applied.</p>
                    <p style="margin: 0;">4. To lock in this rate and schedule a physical site assessment, please remit the S$188 deposit at plainwork.sg.</p>
                    <div style="margin-top: 25px; padding-top: 15px; border-top: 1px dashed #ccc; font-size: 10px; color: #888;">
                        <p style="margin: 0 0 8px 0; font-style: italic; color: #444;">"Every wall we do is an 'Original Copy'—a unique mineral texture replicated from nature, backed by the technical precision of Futureproof Industries."</p>
                        <p style="margin: 0 0 3px 0;"><strong>Managed & Installed by:</strong> Original Copy Pte Ltd (Singapore)</p>
                        <p style="margin: 0;"><strong>Material Origin:</strong> Formulated by Futureproof Industries Sdn Bhd (Malaysia)</p>
                    </div>
                </div>
            </div>
        </div>
        <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .pw-btn-hover:hover { background: #b8a47d !important; }
        </style>
    `;
    
    document.body.insertAdjacentHTML('beforeend', quoterHTML);

    const overlay = document.getElementById('pw-quoter-overlay');
    const modal = document.getElementById('pw-quoter-modal');
    const closeBtn = document.getElementById('pw-quoter-close');
    const analyzeBtn = document.getElementById('q-analyze-btn');
    const downloadBtn = document.getElementById('q-download-btn');
    
    const step1 = document.getElementById('pw-quoter-step-1');
    const step2 = document.getElementById('pw-quoter-step-2');
    const step3 = document.getElementById('pw-quoter-step-3');

    // Replace the old floorplan logic with this new one
    const oldInputs = document.querySelectorAll('input[type="file"]');
    oldInputs.forEach(input => {
        if(input.id === 'floorplan-upload') {
            const label = input.nextElementSibling;
            if(label && label.tagName === 'LABEL') {
                label.onclick = (e) => {
                    e.preventDefault();
                    openQuoter();
                };
            }
        }
    });

    function openQuoter() {
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
        step1.style.display = 'block';
        step2.style.display = 'none';
        step3.style.display = 'none';
    }

    function closeQuoter() {
        overlay.style.opacity = '0';
        modal.style.transform = 'translateY(20px)';
        setTimeout(() => { overlay.style.visibility = 'hidden'; }, 300);
    }

    closeBtn.onclick = closeQuoter;
    overlay.onclick = (e) => { if(e.target === overlay) closeQuoter(); };

    let calculatedPrice = "0";
    let formattedScope = "";
    let formattedSystem = "";

    analyzeBtn.onclick = () => {
        // Validation
        const name = document.getElementById('q-name').value.trim();
        const contact = document.getElementById('q-contact').value.trim();
        const address = document.getElementById('q-address').value.trim();
        const fileInput = document.getElementById('q-file');
        
        if(!name || !contact || !address) {
            alert("Please provide your Name, Contact, and Project Address to generate the quote.");
            return;
        }

        if(!fileInput.files.length) {
            alert("Please upload a floorplan or photo of the wall.");
            return;
        }

        const scope = document.getElementById('q-scope').value;
        const system = document.getElementById('q-system').value;
        const ceilingIncluded = document.getElementById('q-ceiling').checked;
        const wallQty = parseInt(document.getElementById('q-wall-qty').value) || 1;

        // Populate Lead Data for PDF early
        document.getElementById('pdf-client-name').innerText = name;
        document.getElementById('pdf-client-contact').innerText = contact;
        document.getElementById('pdf-client-address').innerText = address;
        document.getElementById('pdf-ceiling').innerText = ceilingIncluded ? "Yes (+50% Area)" : "No";

        // Pricing Logic Engine
        let price = 0;
        
        // Sqft map for feature walls
        const sqftMap = { 'wall_s': 65, 'wall_m': 130, 'wall_l': 195 };
        const systemRate = { 'lime_paint': 8.8, 'lime_plaster': 8.8, 'microcement': 18, 'liquid_metal': 45 };

        if (scope.startsWith('whole_')) {
            if (system === 'lime_paint') {
                if(scope === 'whole_3') { price = 2488; formattedScope = "Whole House (3-Room BTO)"; }
                if(scope === 'whole_4') { price = 3288; formattedScope = "Whole House (4-Room BTO)"; }
                if(scope === 'whole_5') { price = 3888; formattedScope = "Whole House (5-Room BTO)"; }
                
                if (ceilingIncluded) {
                    price = price * 1.5; // Add 50% for ceiling
                }
            } else {
                price = "Custom Quote Required";
                formattedScope = "Whole House (" + scope.split('_')[1] + "-Room BTO)";
            }
        } else {
            // Feature Wall Logic
            let baseSqft = sqftMap[scope] * wallQty;
            if (ceilingIncluded) {
                baseSqft = baseSqft * 1.5; // Adding ceiling area
            }
            
            const rate = systemRate[system];
            price = Math.round(baseSqft * rate);
            
            let sizeLabel = "Small";
            if(scope === 'wall_m') sizeLabel = "Medium";
            if(scope === 'wall_l') sizeLabel = "Large";
            
            formattedScope = `Feature Wall (${sizeLabel}, ~${Math.round(baseSqft)} sqft total)\nQuantity: ${wallQty} Wall(s)`;
        }

        formattedSystem = document.getElementById('q-system').options[document.getElementById('q-system').selectedIndex].text;
        
        if (typeof price === 'number') {
            calculatedPrice = "S$" + price.toLocaleString();
        } else {
            calculatedPrice = price;
        }

        // UI Transition
        step1.style.display = 'none';
        step2.style.display = 'block';

        setTimeout(() => {
            document.getElementById('q-final-price').innerText = calculatedPrice;
            step2.style.display = 'none';
            step3.style.display = 'block';
        }, 2500);
    };

    downloadBtn.onclick = () => {
        // Populate PDF Template
        const today = new Date();
        const expiry = new Date(today);
        expiry.setDate(expiry.getDate() + 7);

        document.getElementById('pdf-date').innerText = today.toLocaleDateString();
        document.getElementById('pdf-expiry').innerText = expiry.toLocaleDateString();
        document.getElementById('pdf-ref').innerText = Math.floor(100000 + Math.random() * 900000);
        
        document.getElementById('pdf-scope').innerText = formattedScope;
        document.getElementById('pdf-system').innerText = formattedSystem;
        document.getElementById('pdf-price').innerText = calculatedPrice;

        const element = document.getElementById('quote-pdf-template');
        element.style.display = 'block'; // make visible for html2pdf
        
        const opt = {
            margin:       0,
            filename:     'Plainwork_Estimate.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Change button text to show progress
        const originalText = downloadBtn.innerText;
        downloadBtn.innerText = "Generating PDF...";
        
        html2pdf().set(opt).from(element).save().then(() => {
            element.style.display = 'none';
            downloadBtn.innerText = originalText;
        });
    };
});
