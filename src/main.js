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

console.log('⚡ Zency Studios — Ready');
