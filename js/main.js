/* ============================================
   DAVID W. DEPRIEST — FIRST LEGION UNIVERSE
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
});

// ============================================
// PRELOADER
// ============================================
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) { initAll(); return; }

    const bar  = document.querySelector('.preloader-bar');
    const text = document.querySelector('.preloader-text');
    const messages = ['INITIALIZING...', 'LOADING FLEET DATA...', 'ESTABLISHING LINK...', 'COMMAND CENTER READY'];
    let progress = 0, msgIndex = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 18 + 5;
        if (progress > 100) progress = 100;
        if (bar)  bar.style.width = progress + '%';
        msgIndex = Math.min(Math.floor(progress / 25), messages.length - 1);
        if (text) text.textContent = messages[msgIndex];

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                gsap.to(preloader, {
                    opacity: 0, duration: 0.8, ease: 'power2.inOut',
                    onComplete: () => { preloader.style.display = 'none'; initAll(); }
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
    initHeroCanvas();
    initGalaxyCanvas();
    initNavbar();
    initHeroAnimations();
    initScrollReveal();
    initSplitText();
    initCardHover();
    initCounters();
    initMobileNav();
    initFormHandling();
    initParallax();
    initPageHeroReveal();
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

    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
        });
    });
}

// ============================================
// CUSTOM CURSOR
// ============================================
function initCursor() {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => { dotX = e.clientX; dotY = e.clientY; });

    (function animateCursor() {
        ringX += (dotX - ringX) * 0.12;
        ringY += (dotY - ringY) * 0.12;
        dot.style.left  = dotX + 'px';
        dot.style.top   = dotY + 'px';
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animateCursor);
    })();

    document.querySelectorAll('a, button, .btn, .ship-card, .universe-card, .featured-book-card, .char-card, .media-card, .shop-card, .nav-link').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });

    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

// ============================================
// HERO STAR CANVAS
// ============================================
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [], particles = [], W, H;

    function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 320; i++) {
        stars.push({
            x: Math.random() * 2000, y: Math.random() * 1200,
            r: Math.random() * 1.4 + 0.2,
            alpha: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinklePhase: Math.random() * Math.PI * 2
        });
    }
    for (let i = 0; i < 25; i++) {
        particles.push({
            x: Math.random() * 2000, y: Math.random() * 1200,
            size: Math.random() * 1.8 + 0.5,
            speedX: (Math.random() - 0.5) * 0.35,
            speedY: -Math.random() * 0.25 - 0.08,
            alpha: Math.random() * 0.35 + 0.1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        stars.forEach(star => {
            star.twinklePhase += star.twinkleSpeed;
            const alpha = star.alpha * (0.7 + 0.3 * Math.sin(star.twinklePhase));
            ctx.beginPath();
            ctx.arc(star.x % W, star.y % H, star.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201,212,229,${alpha})`;
            ctx.fill();
        });

        // nebula blobs
        const g1 = ctx.createRadialGradient(W * 0.7, H * 0.4, 0, W * 0.7, H * 0.4, 400);
        g1.addColorStop(0, 'rgba(10,80,160,0.07)'); g1.addColorStop(1, 'transparent');
        ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

        const g2 = ctx.createRadialGradient(W * 0.2, H * 0.7, 0, W * 0.2, H * 0.7, 300);
        g2.addColorStop(0, 'rgba(200,155,60,0.04)'); g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

        particles.forEach(p => {
            p.x += p.speedX; p.y += p.speedY;
            if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
            if (p.x < -10) p.x = W + 10;
            if (p.x > W + 10) p.x = -10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(58,168,255,${p.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }
    draw();
}

// ============================================
// GALAXY MAP CANVAS
// ============================================
function initGalaxyCanvas() {
    const canvas = document.getElementById('galaxyCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H;
    function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);

    // Node positions (relative 0-1, matching CSS positions)
    const nodes = [
        { x: 0.42, y: 0.55, color: '#3AA8FF' },
        { x: 0.65, y: 0.30, color: '#C89B3C' },
        { x: 0.20, y: 0.25, color: '#ef4444' },
        { x: 0.55, y: 0.65, color: '#3AA8FF' },
        { x: 0.75, y: 0.60, color: '#C9D4E5' },
    ];
    const links = [[0,1],[0,2],[0,3],[1,4],[3,4],[1,3]];

    // Background stars
    const bgStars = Array.from({ length: 150 }, () => ({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1 + 0.2,
        alpha: Math.random() * 0.5 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.01 + 0.003
    }));

    let time = 0;
    function draw() {
        ctx.clearRect(0, 0, W, H);

        // bg stars
        bgStars.forEach(s => {
            s.phase += s.speed;
            ctx.beginPath();
            ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201,212,229,${s.alpha * (0.6 + 0.4 * Math.sin(s.phase))})`;
            ctx.fill();
        });

        // galaxy glow
        const glow = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.5);
        glow.addColorStop(0, 'rgba(10,60,120,0.15)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

        // draw links
        links.forEach(([a, b]) => {
            const na = nodes[a], nb = nodes[b];
            const grad = ctx.createLinearGradient(na.x * W, na.y * H, nb.x * W, nb.y * H);
            grad.addColorStop(0, na.color + '40');
            grad.addColorStop(0.5, '#3AA8FF30');
            grad.addColorStop(1, nb.color + '40');
            ctx.beginPath();
            ctx.moveTo(na.x * W, na.y * H);
            ctx.lineTo(nb.x * W, nb.y * H);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.stroke();

            // animated travel dot
            const progress = (Math.sin(time * 0.8 + a + b) * 0.5 + 0.5);
            const tx = na.x * W + (nb.x * W - na.x * W) * progress;
            const ty = na.y * H + (nb.y * H - na.y * H) * progress;
            ctx.beginPath();
            ctx.arc(tx, ty, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#3AA8FF';
            ctx.fill();
        });

        time += 0.016;
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

    const checkScroll = (scrollY) => {
        navbar.classList.toggle('scrolled', scrollY > 60);
    };

    if (lenis) {
        lenis.on('scroll', ({ scroll }) => checkScroll(scroll));
    } else {
        window.addEventListener('scroll', () => checkScroll(window.scrollY));
    }
    checkScroll(window.scrollY);
}

// ============================================
// MOBILE NAV
// ============================================
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay   = document.querySelector('.nav-overlay');
    const closeLinks = document.querySelectorAll('.mobile-nav .nav-link');
    if (!hamburger || !mobileNav) return;

    let open = false;

    function openNav() {
        open = true;
        mobileNav.classList.add('open');
        if (overlay) overlay.classList.add('active');
        hamburger.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        hamburger.children[1].style.opacity   = '0';
        hamburger.children[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        if (lenis) lenis.stop();
    }
    function closeNav() {
        open = false;
        mobileNav.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        hamburger.children[0].style.transform = '';
        hamburger.children[1].style.opacity   = '1';
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

    const eyebrow  = document.querySelector('.hero-eyebrow');
    const title    = document.querySelector('.hero-title');
    const divider  = document.querySelector('.hero-divider');
    const subtitle = document.querySelector('.hero-subtitle');
    const buttons  = document.querySelector('.hero-buttons');
    const ship     = document.querySelector('.hero-ship');
    const scrollInd = document.querySelector('.hero-scroll-indicator');

    if (eyebrow)   tl.to(eyebrow,   { opacity: 1, y: 0, duration: 0.9 }, 0.2);
    if (title)     tl.to(title,     { opacity: 1, y: 0, duration: 1.1 }, 0.4);
    if (divider)   tl.to(divider,   { opacity: 1, x: 0, duration: 0.7 }, 0.8);
    if (subtitle)  tl.to(subtitle,  { opacity: 1, y: 0, duration: 0.9 }, 1.0);
    if (buttons)   tl.to(buttons,   { opacity: 1, y: 0, duration: 0.9 }, 1.2);
    if (ship)      tl.to(ship,      { opacity: 1, duration: 1.3,  x: 0 }, 0.5);
    if (scrollInd) tl.to(scrollInd, { opacity: 1, duration: 0.8 }, 1.6);

    if (ship) {
        gsap.to(ship, { y: '-18px', duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true });
    }
}

// ============================================
// PAGE HERO REVEAL (inner pages)
// ============================================
function initPageHeroReveal() {
    const pageTitle = document.querySelector('.page-hero-title');
    const breadcrumb = document.querySelector('.page-breadcrumb');
    if (!pageTitle) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
    if (breadcrumb) tl.from(breadcrumb, { opacity: 0, y: 20 }, 0.3);
    tl.from(pageTitle, { opacity: 0, y: 40, clipPath: 'inset(0 100% 0 0)' }, 0.5);
}

// ============================================
// SPLIT TEXT
// ============================================
function initSplitText() {
    if (typeof SplitType === 'undefined') return;
    document.querySelectorAll('.split-text').forEach(el => {
        const split = new SplitType(el, { types: 'chars,words' });
        gsap.from(split.chars, {
            opacity: 0, y: 40, rotateX: -90, stagger: 0.03, duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        });
    });
}

// ============================================
// SCROLL REVEAL
// ============================================
function initScrollReveal() {
    if (typeof ScrollTrigger === 'undefined') return;

    // Basic reveals
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        ScrollTrigger.create({
            trigger: el, start: 'top 88%', once: true,
            onEnter: () => el.classList.add('active')
        });
    });

    // Staggered card groups
    document.querySelectorAll('.fleet-grid, .universe-grid, .book-features, .char-grid, .media-grid, .shop-grid').forEach(group => {
        const cards = group.querySelectorAll('.ship-card, .universe-card, .book-feature, .char-card, .media-card, .shop-card');
        if (!cards.length) return;
        gsap.fromTo(cards,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, stagger: 0.1, duration: 0.85, ease: 'power3.out',
                scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: 'play none none none', once: true }
            }
        );
    });

    // Featured books stagger
    document.querySelectorAll('.featured-books-grid').forEach(grid => {
        const cards = grid.querySelectorAll('.featured-book-card');
        if (!cards.length) return;
        gsap.fromTo(cards,
            { opacity: 0, y: 60 },
            {
                opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: grid, start: 'top 85%', once: true }
            }
        );
    });

    // Timeline items
    document.querySelectorAll('.timeline-item').forEach((item) => {
        gsap.from(item, {
            opacity: 0, x: -40, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 88%', once: true }
        });
    });

    // Threat panels
    document.querySelectorAll('.threat-panel').forEach((panel, i) => {
        gsap.from(panel, {
            opacity: 0, x: i === 0 ? -60 : 60, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 85%', once: true }
        });
    });

    // Section title clip reveals
    document.querySelectorAll('.section-title, .page-hero-title').forEach(el => {
        // skip hero (already handled above)
        if (el.closest('.hero')) return;
        gsap.from(el, {
            clipPath: 'inset(0 100% 0 0)', opacity: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
    });

    // Galaxy map reveal
    const galaxyMap = document.querySelector('.galaxy-map-wrap');
    if (galaxyMap) {
        gsap.from(galaxyMap, {
            opacity: 0, scale: 0.95, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: galaxyMap, start: 'top 80%', once: true }
        });
    }

    ScrollTrigger.refresh();
}

// ============================================
// CARD HOVER PARALLAX (ship + featured book + char)
// ============================================
function initCardHover() {
    const cards = document.querySelectorAll('.ship-card, .featured-book-card, .char-card, .media-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 800, duration: 0.4, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
        });
    });

    // Book cover 3D tilt
    document.querySelectorAll('.book-cover-frame, .featured-book-frame').forEach(frame => {
        frame.addEventListener('mousemove', (e) => {
            const rect = frame.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            gsap.to(frame, { rotateY: x * 15, rotateX: -y * 10, transformPerspective: 1000, duration: 0.5, ease: 'power2.out' });
        });
        frame.addEventListener('mouseleave', () => {
            gsap.to(frame, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
        });
    });
}

// ============================================
// COUNTERS
// ============================================
function initCounters() {
    if (typeof ScrollTrigger === 'undefined') return;
    document.querySelectorAll('[data-count]').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const suffix = counter.getAttribute('data-suffix') || '';
        ScrollTrigger.create({
            trigger: counter, start: 'top 85%', once: true,
            onEnter: () => {
                gsap.to({ val: 0 }, {
                    val: target, duration: 2, ease: 'power2.out',
                    onUpdate: function () {
                        counter.textContent = Math.round(this.targets()[0].val).toLocaleString() + suffix;
                    }
                });
            }
        });
    });
}

// ============================================
// PARALLAX
// ============================================
function initParallax() {
    if (typeof ScrollTrigger === 'undefined') return;
    document.querySelectorAll('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
        gsap.to(el, {
            y: () => el.offsetHeight * speed * -1, ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });
}

// ============================================
// FORM HANDLING
// ============================================
function initFormHandling() {
    document.querySelectorAll('.enlist-form, .contact-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"], .btn');
            if (!btn) return;
            const original = btn.innerHTML;
            btn.innerHTML = 'SENT ✓';
            btn.style.background = 'var(--color-gold)';
            setTimeout(() => { btn.innerHTML = original; btn.style.background = ''; form.reset(); }, 3000);
        });
    });
}

// ============================================
// SEARCHABLE CHARACTER DATABASE
// ============================================
function initCharSearch() {
    const input = document.getElementById('charSearch');
    const cards = document.querySelectorAll('.char-card');
    if (!input || !cards.length) return;

    input.addEventListener('input', () => {
        const q = input.value.toLowerCase().trim();
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.opacity = text.includes(q) ? '1' : '0.2';
            card.style.pointerEvents = text.includes(q) ? '' : 'none';
        });
    });
}

// ============================================
// INLINE PAGE INIT ON LOAD
// ============================================
window.addEventListener('load', () => {
    initCharSearch();
});