'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.site-nav');
    const navToggle = nav?.querySelector('.nav-toggle');
    const navLinks = Array.from(document.querySelectorAll('.nav-list a'));

    initSmoothScrolling(navLinks, nav);
    initActiveSectionHighlight(navLinks);
    initProjectReveal();
    initNavToggle(nav, navToggle);
});

function initSmoothScrolling(navLinks, nav) {
    if (!navLinks.length) return;

    const header = document.querySelector('.site-header');
    const headerOffset = header ? header.offsetHeight : 80;

    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            const href = link.getAttribute('href');
            if (!href?.startsWith('#')) return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            const top = window.scrollY + target.getBoundingClientRect().top - headerOffset;

            window.scrollTo({ top, behavior: 'smooth' });
            closeMobileNav(nav);
        });
    });
}

function initActiveSectionHighlight(navLinks) {
    if (!navLinks.length) return;

    const sections = Array.from(document.querySelectorAll('main section[id]'));
    if (!sections.length) return;

    const setActiveLink = id => {
        navLinks.forEach(link => {
            const matches = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', matches);
        });
    };

    const observer = new IntersectionObserver(entries => {
        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
            setActiveLink(visible.target.id);
        }
    }, {
        root: null,
        threshold: 0.3,
        rootMargin: '-20% 0px -55% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

function initProjectReveal() {
    const projectItems = Array.from(document.querySelectorAll('.project-item'));
    if (!projectItems.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: '0px 0px -60px 0px'
    });

    projectItems.forEach(item => {
        item.classList.add('hidden');
        observer.observe(item);
    });
}

function initNavToggle(nav, toggle) {
    if (!nav || !toggle) return;

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
}

function closeMobileNav(nav) {
    if (!nav) return;

    nav.classList.remove('open');
    const toggle = nav.querySelector('.nav-toggle');
    if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
    }
}