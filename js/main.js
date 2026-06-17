/* ============================================
   FIRST LEGION - MAIN JAVASCRIPT
   ============================================ */

// ============================================
// IMPORTS / INITIALIZATION
// ============================================

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
});

// ============================================
// PRELOADER
// ============================================
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) {
        initAll();
        return;
    }

    const bar = document.querySelector('.preloader-bar');
    const text = document.querySelector('.preloader-text');
    const messages = ['INITIALIZING...', 'LOADING FLEET DATA...', 'ESTABLISHING LINK...', 'COMMAND CENTER READY'];
    let progress = 0;
    let msgIndex = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 18 + 5;
        if (progress > 100) progress = 100;
        if (bar) bar.style.width = progress + '%';

        msgIndex = Math.min(Math.floor(progress / 25), messages.length - 1);
        if (text) text.textContent = messages[msgIndex];

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                gsap.to(preloader, {
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        preloader.style.display = 'none';
                        initAll();
                    }
                });
            }, 400);
        }
    }, 80);
}

// ============================================
// INITIALIZE ALL
// ============================================
function initAll() {
    initLenis();
    initCursor();
    initCanvas();
    initNavbar();
    initHeroAnimations();
    initScrollReveal();
    initSplitText();
    initShipCards();
    initCounters();
    initMobileNav();
    initFormHandling();
}

// ============================================
// LENIS SMOOTH SCROLL
// ============================================
let lenis;
function initLenis() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // GSAP ticker sync
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Anchor links via Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { offset: -80, duration: 1.4 });
            }
        });
    });
}

// ============================================
// CUSTOM CURSOR
// ============================================
function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let ringX = 0, ringY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
        dotX = e.clientX;
        dotY = e.clientY;
    });

    function animateCursor() {
        ringX += (dotX - ringX) * 0.12;
        ringY += (dotY - ringY) * 0.12;

        if (dot) {
            dot.style.left = dotX + 'px';
            dot.style.top = dotY + 'px';
        }
        if (ring) {
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverEls = document.querySelectorAll('a, button, .btn, .ship-card, .universe-card, .nav-link');
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });

    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

// ============================================
// STAR CANVAS
// ============================================
function initCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [];
    let particles = [];
    let W, H;

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // Stars
    for (let i = 0; i < 300; i++) {
        stars.push({
            x: Math.random() * 2000,
            y: Math.random() * 1200,
            r: Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.8 + 0.2,
            speed: Math.random() * 0.3 + 0.05,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinklePhase: Math.random() * Math.PI * 2
        });
    }

    // Floating particles
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * 2000,
            y: Math.random() * 1200,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: -Math.random() * 0.3 - 0.1,
            alpha: Math.random() * 0.4 + 0.1
        });
    }

    let time = 0;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        time += 0.01;

        // Draw stars
        stars.forEach(star => {
            star.twinklePhase += star.twinkleSpeed;
            const alpha = star.alpha * (0.7 + 0.3 * Math.sin(star.twinklePhase));
            ctx.beginPath();
            ctx.arc(star.x % W, star.y % H, star.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fill();
        });

        // Draw nebula blobs
        const gradient = ctx.createRadialGradient(W * 0.7, H * 0.4, 0, W * 0.7, H * 0.4, 400);
        gradient.addColorStop(0, 'rgba(0, 100, 180, 0.06)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        const gradient2 = ctx.createRadialGradient(W * 0.2, H * 0.7, 0, W * 0.2, H * 0.7, 300);
        gradient2.addColorStop(0, 'rgba(0, 60, 140, 0.04)');
        gradient2.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient2;
        ctx.fillRect(0, 0, W, H);

        // Draw particles
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
            if (p.x < -10) { p.x = W + 10; }
            if (p.x > W + 10) { p.x = -10; }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 174, 239, ${p.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }
    draw();
}

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (lenis) {
        lenis.on('scroll', ({ scroll }) => {
            if (scroll > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    } else {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 80);
        });
    }
}

// ============================================
// MOBILE NAV
// ============================================
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.nav-overlay');
    const closeLinks = document.querySelectorAll('.mobile-nav .nav-link');
    if (!hamburger || !mobileNav) return;

    let open = false;

    function openNav() {
        open = true;
        mobileNav.classList.add('open');
        if (overlay) overlay.classList.add('active');
        hamburger.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        hamburger.children[1].style.opacity = '0';
        hamburger.children[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        if (lenis) lenis.stop();
    }

    function closeNav() {
        open = false;
        mobileNav.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        hamburger.children[0].style.transform = '';
        hamburger.children[1].style.opacity = '1';
        hamburger.children[2].style.transform = '';
        if (lenis) lenis.start();
    }

    hamburger.addEventListener('click', () => open ? closeNav() : openNav());
    if (overlay) overlay.addEventListener('click', closeNav);
    closeLinks.forEach(link => link.addEventListener('click', closeNav));
}

// ============================================
// HERO ANIMATIONS
// ============================================
function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    const eyebrow = document.querySelector('.hero-eyebrow');
    const title = document.querySelector('.hero-title');
    const divider = document.querySelector('.hero-divider');
    const subtitle = document.querySelector('.hero-subtitle');
    const buttons = document.querySelector('.hero-buttons');
    const ship = document.querySelector('.hero-ship');
    const scrollInd = document.querySelector('.hero-scroll-indicator');

    if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.8 }, 0.2);
    if (title) tl.to(title, { opacity: 1, y: 0, duration: 1 }, 0.4);
    if (divider) tl.to(divider, { opacity: 1, x: 0, duration: 0.6 }, 0.8);
    if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.8 }, 0.9);
    if (buttons) tl.to(buttons, { opacity: 1, y: 0, duration: 0.8 }, 1.1);
    if (ship) tl.to(ship, { opacity: 1, duration: 1.2, x: 0 }, 0.6);
    if (scrollInd) tl.to(scrollInd, { opacity: 1, duration: 0.8 }, 1.5);

    // Floating ship animation
    if (ship) {
        gsap.to(ship, {
            y: '-20px',
            duration: 3,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
        });
    }
}

// ============================================
// SPLIT TEXT ANIMATIONS
// ============================================
function initSplitText() {
    if (typeof SplitType === 'undefined') return;

    const splitEls = document.querySelectorAll('.split-text');
    splitEls.forEach(el => {
        const split = new SplitType(el, { types: 'chars, words' });

        gsap.from(split.chars, {
            opacity: 0,
            y: 40,
            rotateX: -90,
            stagger: 0.03,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true
            }
        });
    });
}

// ============================================
// SCROLL REVEAL
// ============================================
function initScrollReveal() {
    if (typeof ScrollTrigger === 'undefined') return;

    // 1. Simple reveal animations
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    reveals.forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => el.classList.add('active')
        });
    });

    // 2. Staggered card animations (FIXED SECTION)
    const cardGroups = document.querySelectorAll('.fleet-grid, .universe-grid, .book-features');
    
    cardGroups.forEach(group => {
        const cards = group.querySelectorAll('.ship-card, .universe-card, .book-feature');
        if (cards.length === 0) return;

        // Hum "fromTo" use karenge taake opacity 1 hone ki guarantee ho
        gsap.fromTo(cards, 
            { 
                opacity: 0, 
                y: 50 
            }, 
            {
                opacity: 1,
                y: 0,
                stagger: 0.12,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: group,
                    start: 'top 85%', // Isse thora change karke check karein agar masla ho
                    toggleActions: 'play none none none', // Ensure it plays correctly
                    once: true
                }
            }
        );
    });

    // 3. Timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, i) => {
        gsap.from(item, {
            opacity: 0,
            x: -40,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 88%',
                once: true
            }
        });
    });

    // 4. Threat panels
    const threatPanels = document.querySelectorAll('.threat-panel');
    threatPanels.forEach((panel, i) => {
        gsap.from(panel, {
            opacity: 0,
            x: i === 0 ? -60 : 60,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: panel,
                start: 'top 85%',
                once: true
            }
        });
    });

    // Refresh ScrollTrigger after all initializations
    ScrollTrigger.refresh();
}

// ============================================
// SHIP CARD HOVER PARALLAX
// ============================================
function initShipCards() {
    const cards = document.querySelectorAll('.ship-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(card, {
                rotateY: x * 8,
                rotateX: -y * 8,
                transformPerspective: 800,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// ============================================
// COUNTERS
// ============================================
function initCounters() {
    if (typeof ScrollTrigger === 'undefined') return;

    const counters = document.querySelectorAll('.fleet-stat-num[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const suffix = counter.getAttribute('data-suffix') || '';

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to({ val: 0 }, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: function() {
                        counter.textContent = Math.round(this.targets()[0].val).toLocaleString() + suffix;
                    }
                });
            }
        });
    });
}

// ============================================
// FORM HANDLING
// ============================================
function initFormHandling() {
    const forms = document.querySelectorAll('.enlist-form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"], .btn');
            if (!btn) return;

            const original = btn.innerHTML;
            btn.innerHTML = 'ENLISTED! ✓';
            btn.style.background = '#00FF88';

            setTimeout(() => {
                btn.innerHTML = original;
                btn.style.background = '';
                form.reset();
            }, 3000);
        });
    });
}

// ============================================
// BOOK COVER 3D TILT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const coverFrame = document.querySelector('.book-cover-frame');
    if (!coverFrame) return;

    coverFrame.addEventListener('mousemove', (e) => {
        const rect = coverFrame.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(coverFrame, {
            rotateY: x * 15,
            rotateX: -y * 10,
            transformPerspective: 1000,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    coverFrame.addEventListener('mouseleave', () => {
        gsap.to(coverFrame, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)'
        });
    });
});

// ============================================
// PARALLAX EFFECTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof ScrollTrigger === 'undefined') return;

    // Parallax sections
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    parallaxEls.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
        gsap.to(el, {
            y: () => el.offsetHeight * speed * -1,
            ease: 'none',
            scrollTrigger: {
                trigger: el.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // Section title reveals with clip
    document.querySelectorAll('.section-title, .page-hero-title').forEach(el => {
        gsap.from(el, {
            clipPath: 'inset(0 100% 0 0)',
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true
            }
        });
    });
});
