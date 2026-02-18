import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════ LENIS (Smooth Scroll) ═══════════════════════ */
const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ═══════════════════════ HERO ANIMATION ═══════════════════════ */
const heroText = new SplitType('#hero-text', { types: 'chars' });

gsap.set('#hero-text', { opacity: 1 });
gsap.from(heroText.chars, {
    y: 120,
    opacity: 0,
    rotateX: -90,
    stagger: 0.04,
    duration: 1.2,
    ease: 'power4.out',
    delay: 0.3,
});

gsap.to('.hero-sub', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 1.2,
});

/* ═══════════════════════ EXPERTISE — 3D CARD SLIDER ═══════════════════════ */
let isAnimating = false;

function splitCardText() {
    document.querySelectorAll('.copy h1').forEach((h1) => {
        new SplitType(h1, { types: 'chars' });
    });
}

function initializeCards() {
    const cards = Array.from(document.querySelectorAll('.card'));
    gsap.to(cards, {
        y: (i) => `${-15 + 15 * i}%`,
        z: (i) => 15 * i,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: -0.1,
    });
}

document.addEventListener('DOMContentLoaded', () => {
    splitCardText();
    initializeCards();

    // Hide all card text initially, show only the top card's text
    gsap.set('.copy h1 .char', { y: -200 });
    gsap.set('.slider .card:last-child .copy h1 .char', { y: 0 });
});

document.addEventListener('click', (e) => {
    if (isAnimating) return;
    if (!e.target.closest('.slider')) return;

    isAnimating = true;

    const slider = document.querySelector('.slider');
    const cards = Array.from(slider.querySelectorAll('.card'));
    const lastCard = cards.pop();
    const nextCard = cards[cards.length - 1];

    // Text out
    gsap.to(lastCard.querySelectorAll('.char'), {
        y: 200,
        duration: 0.75,
        ease: 'power3.in',
    });

    // Card out
    gsap.to(lastCard, {
        y: '+=150%',
        duration: 0.75,
        ease: 'power3.in',
        onComplete: () => {
            slider.prepend(lastCard);
            initializeCards();
            gsap.set(lastCard.querySelectorAll('.char'), { y: -200 });
            setTimeout(() => { isAnimating = false; }, 800);
        },
    });

    // Next card text in
    if (nextCard) {
        gsap.to(nextCard.querySelectorAll('.char'), {
            y: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.05,
        });
    }
});

/* ═══════════════════════ MARQUEE ANIMATIONS ═══════════════════════ */
document.querySelectorAll('.marquee-container').forEach((container, index) => {
    const marquee = container.querySelector('.marquee');
    const direction = index % 2 === 0 ? -1 : 1;

    gsap.to(marquee, {
        x: direction * 600,
        ease: 'none',
        scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
        },
    });
});

/* ═══════════════════════ AI SECTION — SCROLL REVEAL ═══════════════════════ */
gsap.from('.ai-title', {
    y: 80,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.ai-section',
        start: 'top 70%',
    },
});

gsap.from('.tech-card', {
    y: 60,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.tech-grid',
        start: 'top 80%',
    },
});

/* ═══════════════════════ WHY US — SCROLL REVEAL ═══════════════════════ */
gsap.from('.why-sub', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.why-us',
        start: 'top 70%',
    },
});

const whyTitle = new SplitType('.why-title', { types: 'chars' });
gsap.from(whyTitle.chars, {
    y: 100,
    opacity: 0,
    stagger: 0.03,
    duration: 1,
    ease: 'power4.out',
    scrollTrigger: {
        trigger: '.why-us',
        start: 'top 60%',
    },
});

/* ═══════════════════════ TEAM / FOUNDERS — INTERACTIVE HOVER ═══════════════════════ */
const profileImages = document.querySelectorAll('.profile-images .img');
const nameElements = document.querySelectorAll('.profile-names .name');

if (profileImages.length > 0 && nameElements.length > 0) {
    // Split all name headings
    document.querySelectorAll('.profile-names .name h1').forEach((h) => {
        new SplitType(h, { types: 'chars' });
    });

    const defaultChars = nameElements[0].querySelectorAll('.char');

    // Default "The Squad" visible; all others hidden
    gsap.set(defaultChars, { y: '0%' });
    nameElements.forEach((el, i) => {
        if (i > 0) gsap.set(el.querySelectorAll('.char'), { y: '100%' });
    });

    profileImages.forEach((img, index) => {
        const nameEl = nameElements[index + 1];
        if (!nameEl) return;
        const chars = nameEl.querySelectorAll('.char');

        img.addEventListener('mouseenter', () => {
            gsap.to(img, { width: 130, height: 130, duration: 0.5, ease: 'power4.out' });
            gsap.to(defaultChars, { y: '-100%', duration: 0.5, ease: 'power4.out', stagger: { each: 0.02, from: 'center' } });
            gsap.to(chars, { y: '0%', duration: 0.6, ease: 'power4.out', stagger: { each: 0.02, from: 'center' }, overwrite: true });
        });

        img.addEventListener('mouseleave', () => {
            gsap.to(img, { width: 70, height: 70, duration: 0.5, ease: 'power4.out' });
            gsap.to(chars, { y: '100%', duration: 0.5, ease: 'power4.out', stagger: { each: 0.02, from: 'center' } });
            gsap.to(defaultChars, { y: '0%', duration: 0.6, ease: 'power4.out', stagger: { each: 0.02, from: 'center' }, overwrite: true });
        });
    });
}

/* ═══════════════════════ SECTION LABELS — SCROLL REVEAL ═══════════════════════ */
document.querySelectorAll('.section-label').forEach((label) => {
    gsap.from(label, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: label,
            start: 'top 85%',
        },
    });
});

/* ═══════════════════════ REELS CONTENT — HORIZONTAL SCROLL ═══════════════════════ */
const reelsWorks = [
    { title: "SK Telecom :/Addiction", thumb: "https://images.prismic.io/alcre/aFNobrNJEFaPYFhr_1.png?auto=format,compress" },
    { title: "SK Telecom :/Dopamine", thumb: "https://images.prismic.io/alcre/aFNojLNJEFaPYFhs_2.png?auto=format,compress" },
    { title: "GALAXY S24", thumb: "https://images.prismic.io/alcre/aFNouLNJEFaPYFht_3.png?auto=format,compress" },
    { title: "GALAXY Z 6", thumb: "https://images.prismic.io/alcre/aFNpF7NJEFaPYFhy_4.png?auto=format,compress" },
    { title: "DDANJITRER's AI", thumb: "https://images.prismic.io/alcre/aFUm5Hfc4bHWikLF_flow_2025-06-20_18317930.png?auto=format,compress" },
    { title: "LANEIGE / Cream Skin", thumb: "https://images.prismic.io/alcre/aFNpVbNJEFaPYFh0_6.png?auto=format,compress" },
    { title: "VITAL BEUTY / Meta Green", thumb: "https://images.prismic.io/alcre/aFNparNJEFaPYFh1_7.png?auto=format,compress" },
    { title: "SK Telecom :/AI Help you?", thumb: "https://images.prismic.io/alcre/aFNo3LNJEFaPYFhw_8.png?auto=format,compress" },
    { title: "Always I Love You", thumb: "https://images.prismic.io/alcre/aFNpgbNJEFaPYFh2_9.png?auto=format,compress" },
    { title: "AESTURA / Pop-Up Store", thumb: "https://images.prismic.io/alcre/aFJQ17NJEFaPYDMC_%EB%A6%AC%EC%A0%9C%EB%8D%A4%ED%95%98%EC%9A%B0%EC%8A%A4.jpg?auto=compress,format" },
    { title: "SK Telecom A. / Series 1", thumb: "https://images.prismic.io/alcre/086493b4-fdbf-49c8-a1ae-7f23ecba1d89_%E1%84%83%E1%85%A2%E1%84%8C%E1%85%B5+1+%E1%84%87%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A1.png?auto=compress,format" },
    { title: "SK Telecom A. / Series 2", thumb: "https://images.prismic.io/alcre/9232e485-bb25-43f6-b60b-b0042c15c96b_%EB%B6%80%ED%83%81%ED%97%A4%EC%96%B42_00.jpg?auto=compress,format" },
    { title: "SK Telecom X Caliber", thumb: "https://images.prismic.io/alcre/08b8f0a4-6410-4b3c-8941-ddd9178a3123_%EC%8B%9C%EA%B3%A0%EB%A5%B4%EC%9E%90%EB%B8%8C_00.jpg?auto=format,compress" },
    { title: "Korea Investment / ACE ETF", thumb: "https://images.prismic.io/alcre/bbc5c4d1-54ca-4dcb-b0d5-7a221ac4e46d_%E1%84%92%E1%85%A1%E1%86%AB%E1%84%90%E1%85%AE_ACEETF_00_scale.jpg?auto=compress,format" },
    { title: "SK Telecom A. / Era", thumb: "https://images.prismic.io/alcre/11838b80-8ad2-4e60-86a3-9c6fa802a99f_AI%EC%9D%98%EA%B8%B0%EC%9B%90_00.jpg?auto=compress,format" },
    { title: "GALAXY Z FLIP 5", thumb: "https://images.prismic.io/alcre/e626be2d-59d3-42f3-b4a8-cb9e475d1292_SKT_Zflip5_00.jpg?auto=compress,format" },
    { title: "SK Telecom / 0Youth", thumb: "https://images.prismic.io/alcre/3093d8a9-7777-4fea-810b-ddd3bca477c8_SKT_%EB%90%9C%EB%8C%80%EB%8F%842_00.jpg?auto=compress,format" },
    { title: "Korea Investment Mgmt", thumb: "https://images.prismic.io/alcre/69458c0e-5d33-4210-85be-c41d072df69f_pr0101.webp?auto=compress,format" },
    { title: "AHC / Premier Ampoule", thumb: "https://images.prismic.io/alcre/4b5ca90d-280e-4d3f-a155-9d7bdbfc7c15_pr0201.webp?auto=compress,format" },
    { title: "NOBLE Design Film", thumb: "https://images.prismic.io/alcre/02fe5831-e6dd-4f7c-9165-164f0e56b08e_pr00245.webp?auto=compress,format" },
    { title: "OERA CALIBRATOR", thumb: "https://images.prismic.io/alcre/f0a64fad-a953-4ad2-9baa-dc68a8b68ae6_pr0401.webp?auto=compress,format" },
    { title: "V&A BEAUTY", thumb: "https://images.prismic.io/alcre/f89f696a-2478-4634-8a82-7f004dc9523e_pr0501.webp?auto=compress,format" },
    { title: "Sulwhasoo / First Care", thumb: "https://images.prismic.io/alcre/a5b5d781-0124-4824-a664-09e57cf2f020_pr2901.webp?auto=compress,format" },
    { title: "AESTRA / ATOBARRIER", thumb: "https://images.prismic.io/alcre/a5ce2a4b-83c5-45cd-b7ab-4926a4c6cf11_pr3001.webp?auto=compress,format" },
    { title: "BTS UNIVERSE", thumb: "https://images.prismic.io/alcre/ae7f7d37-e471-4344-b6b3-590ec27def86_0801.webp?auto=compress,format" },
    { title: "SK Telecom WE_ING", thumb: "https://images.prismic.io/alcre/403aff5c-6944-4738-b61f-c80b4265a0d0_pr0901.webp?auto=format,compress" },
    { title: "SIENU Launching", thumb: "https://images.prismic.io/alcre/7835ac81-82fe-412b-bc40-081b96b063f2_pr0601.webp?auto=compress,format" },
    { title: "SIENU / TIMEBRACE SERUM", thumb: "https://images.prismic.io/alcre/7dc8388d-9e6f-411a-82be-62bab89c9f14_pr0701.webp?auto=compress,format" },
];

(function initReelsSection() {
    const REELS_N = reelsWorks.length;
    const REELS_GAP = 10;

    const reelsTrack = document.getElementById('reelsTrack');
    const reelsTitle = document.getElementById('reelsSceneTitle');
    const reelsTickerEl = document.getElementById('reelsTicker');

    if (!reelsTrack || !reelsTitle || !reelsTickerEl) return;

    // Build cards + ticks
    reelsWorks.forEach((w, i) => {
        const card = document.createElement('div');
        card.className = 'reels-card';
        card.innerHTML = `<img src="${w.thumb}" alt="${w.title}" loading="${i < 6 ? 'eager' : 'lazy'}"/>`;
        reelsTrack.appendChild(card);

        const t = document.createElement('div');
        t.className = 'reels-tick';
        reelsTickerEl.appendChild(t);
    });

    const reelsCards = reelsTrack.querySelectorAll('.reels-card');
    const reelsTicks = reelsTickerEl.querySelectorAll('.reels-tick');

    let rcw, rch, rtotalW, rStartX, rEndX, rscrollDist;

    function reelsMeasure() {
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        rch = vh * 0.60;
        rcw = rch * (9 / 16);

        reelsCards.forEach(c => {
            c.style.width = rcw + 'px';
            c.style.height = rch + 'px';
        });

        rtotalW = REELS_N * (rcw + REELS_GAP) - REELS_GAP;

        // The track is flex-centered, so at x=0 the track center is at vw/2.
        // Card i center (relative to track start) = i * (rcw + GAP) + rcw/2
        // Card i center in viewport = x + (vw - rtotalW)/2 + i*(rcw+GAP) + rcw/2
        // To center card i in viewport: x = vw/2 - rcw/2 - i*(rcw+GAP) - (vw-rtotalW)/2
        //   simplifies to: x = (rtotalW - rcw)/2 - i*(rcw+GAP)

        rStartX = (rtotalW - rcw) / 2;                              // centers card 0
        rEndX = (rtotalW - rcw) / 2 - (REELS_N - 1) * (rcw + REELS_GAP); // centers last card
        rscrollDist = rStartX - rEndX;                               // total travel

        reelsTrack.style.width = rtotalW + 'px';

        // Set initial position so first card is centered
        gsap.set(reelsTrack, { x: rStartX });

        reelsTicks.forEach((t, i) => {
            const mid = (REELS_N - 1) / 2;
            const dist = Math.abs(i - mid) / mid;
            const h = Math.round(36 - dist * 20);
            t.style.height = h + 'px';
        });
    }

    reelsMeasure();

    // GSAP scroll → track x with pin (auto-pins the section and releases cleanly)
    let reelsSt;
    function buildReelsST() {
        if (reelsSt) reelsSt.kill();
        gsap.set(reelsTrack, { x: rStartX });
        reelsSt = gsap.fromTo(reelsTrack,
            { x: rStartX },
            {
                x: rEndX,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#reelsPinWrap',
                    pin: true,
                    start: 'top top',
                    end: () => `+=${rscrollDist}`,
                    scrub: 1,
                    pinSpacing: true,
                }
            }
        );
    }
    buildReelsST();

    // rAF: tilt / scale / opacity
    const TILT_MAX = 14;
    const SCALE_CTR = 1.06;
    const SCALE_EDGE = 0.78;
    const OPACITY_CTR = 1;
    const OPACITY_EDGE = 0.5;
    const FALLOFF = 1.1;

    let lastReelsActive = -1;

    function reelsRaf() {
        const x = gsap.getProperty(reelsTrack, 'x');
        const vw = window.innerWidth;
        const cx = vw / 2;

        let closestD = Infinity;
        let activeIdx = 0;

        reelsCards.forEach((card, i) => {
            const cardCx = x + i * (rcw + REELS_GAP) + rcw / 2 + (vw - rtotalW) / 2;
            const d = (cardCx - cx) / (vw * FALLOFF);
            const dC = Math.max(-1, Math.min(1, d));

            const tilt = dC * TILT_MAX;
            const absD = Math.abs(dC);
            const scale = SCALE_CTR - (SCALE_CTR - SCALE_EDGE) * absD;
            const opacity = OPACITY_CTR - (OPACITY_CTR - OPACITY_EDGE) * absD;

            card.style.transformOrigin = '50% 100%';
            card.style.transform = `rotate(${tilt}deg) scale(${scale})`;
            card.style.opacity = opacity;
            card.style.zIndex = Math.round(50 - absD * 40);

            const realD = Math.abs(cardCx - cx);
            if (realD < closestD) { closestD = realD; activeIdx = i; }
        });

        if (activeIdx !== lastReelsActive) {
            lastReelsActive = activeIdx;
            reelsTitle.textContent = reelsWorks[activeIdx].title;
            reelsTicks.forEach((t, i) => t.classList.toggle('active', i === activeIdx));
        }

        requestAnimationFrame(reelsRaf);
    }
    requestAnimationFrame(reelsRaf);

    window.addEventListener('resize', () => { reelsMeasure(); buildReelsST(); });
})();

console.log('⚡ Zency Studios — Ready');
