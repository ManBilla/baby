/* ============================================
   BABY SHOWER WEBSITE — JAVASCRIPT (Upgraded)
   Features: GSAP Scroll Animations, Vanilla-Tilt 3D,
             Interactive Mouse Balloons, Confetti, Countdown
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ---- Constants ----
    const EVENT_DATE = new Date('2026-07-25T18:00:00-04:00'); // July 25, 2026 6PM EDT

    // ---- DOM Elements ----
    const $days = document.getElementById('days');
    const $hours = document.getElementById('hours');
    const $minutes = document.getElementById('minutes');
    const $seconds = document.getElementById('seconds');
    const $starsLayer = document.getElementById('stars-layer');
    const $balloonsLayer = document.getElementById('balloons-layer');
    const $calendarModal = document.getElementById('calendar-modal');
    const $modalClose = document.getElementById('modal-close');
    const $addCalBtn = document.getElementById('add-to-calendar-btn');
    const $googleCal = document.getElementById('google-cal');
    const $icalDownload = document.getElementById('ical-download');
    const $amazonBtn = document.getElementById('amazon-registry-btn');
    const $heroElephant = document.getElementById('elephant-img');

    // ============================================
    // 1. COUNTDOWN TIMER
    // ============================================
    function updateCountdown() {
        const now = new Date();
        const diff = EVENT_DATE - now;

        if (diff <= 0) {
            $days.textContent = '🎉';
            $hours.textContent = '🎉';
            $minutes.textContent = '🎉';
            $seconds.textContent = '🎉';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        $days.textContent = String(days).padStart(2, '0');
        $hours.textContent = String(hours).padStart(2, '0');
        $minutes.textContent = String(minutes).padStart(2, '0');
        $seconds.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ============================================
    // 2. GSAP ANIMATIONS
    // ============================================
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Load Animation
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
        .fromTo('.gs-reveal-img',
            { y: 60, opacity: 0, scale: 0.88 },
            { y: 0, opacity: 1, scale: 1, duration: 1.2 }
        )
        .fromTo('.gs-title',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.2 },
            '-=0.9'
        )
        .fromTo('.gs-stagger',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.15 },
            '-=0.5'
        )
        .fromTo('.scroll-indicator',
            { opacity: 0 },
            { opacity: 1, duration: 0.8 },
            '-=0.2'
        );

    // Scroll Animations for sections
    gsap.utils.toArray('.gs-fade-up').forEach(el => {
        gsap.fromTo(el,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Message Card pop-in
    gsap.fromTo('.message-card',
        { scale: 0.92, opacity: 0, y: 50 },
        {
            scale: 1, opacity: 1, y: 0, duration: 1, ease: 'back.out(1.4)',
            scrollTrigger: {
                trigger: '.message-section',
                start: 'top 78%'
            }
        }
    );

    // ---- Vanilla Tilt (3D hover on cards) ----
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 12,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
            scale: 1.03,
        });
    }

    // ============================================
    // 3. INTERACTIVE BALLOONS (Dodge Mouse)
    // ============================================
    const BALLOON_COLORS = ['#8cc8ed', '#b5ddf5', '#a0c4e8', '#7bb8e0', '#c9eee0'];
    const balloons = [];
    
    function createBalloonSVG(color, isHeart) {
        if (isHeart) {
            return `<svg viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
                <path d="M30 55 C30 55 5 35 5 20 C5 10 12 2 22 2 C27 2 30 6 30 6 C30 6 33 2 38 2 C48 2 55 10 55 20 C55 35 30 55 30 55Z" fill="${color}" opacity="0.75"/>
                <line x1="30" y1="55" x2="30" y2="70" stroke="${color}" stroke-width="1.5" opacity="0.6"/>
            </svg>`;
        }
        return `<svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
            <ellipse cx="20" cy="22" rx="16" ry="20" fill="${color}" opacity="0.75"/>
            <polygon points="16,40 20,46 24,40" fill="${color}" opacity="0.6"/>
            <line x1="20" y1="46" x2="20" y2="60" stroke="${color}" stroke-width="1.5" opacity="0.6"/>
        </svg>`;
    }

    // Generate balloons
    for (let i = 0; i < 12; i++) {
        const b = document.createElement('div');
        b.classList.add('balloon');
        const size = 35 + Math.random() * 40;
        b.style.width = size + 'px';
        b.style.height = size * 1.5 + 'px';
        b.innerHTML = createBalloonSVG(BALLOON_COLORS[i % BALLOON_COLORS.length], Math.random() > 0.5);
        
        // Initial random positions
        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;
        
        b.style.left = '0px';
        b.style.top = '0px';
        b.style.transform = `translate(${x}px, ${y}px)`;
        
        $balloonsLayer.appendChild(b);
        
        balloons.push({
            el: b,
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            vx: (Math.random() - 0.5) * 1,
            vy: -0.5 - Math.random() * 1.5, // float up
            size: size
        });
    }

    // Mouse interaction variables
    let mouseX = -1000;
    let mouseY = -1000;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animation Loop for Balloons
    function animateBalloons() {
        if (!document.hidden) {
            balloons.forEach(b => {
                // Natural float
                b.y += b.vy;
                b.x += Math.sin(b.y * 0.01) * 0.5; // slight wobble

                // Mouse repel logic
                const dx = b.x - mouseX;
                const dy = b.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 150;

                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    b.x += (dx / dist) * force * 5;
                    b.y += (dy / dist) * force * 5;
                }

                // Wrap around screen
                if (b.y < -100) {
                    b.y = window.innerHeight + 100;
                    b.x = Math.random() * window.innerWidth;
                }
                if (b.x < -100) b.x = window.innerWidth + 100;
                if (b.x > window.innerWidth + 100) b.x = -100;

                b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${Math.sin(b.y * 0.02) * 10}deg)`;
            });
        }
        requestAnimationFrame(animateBalloons);
    }
    animateBalloons();

    // ============================================
    // 4. TWINKLING STARS
    // ============================================
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        const size = Math.random() > 0.8 ? 5 : 3;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        star.style.setProperty('--duration', (2 + Math.random() * 4) + 's');
        star.style.animationDelay = Math.random() * 5 + 's';
        $starsLayer.appendChild(star);
    }

    // ============================================
    // 5. CONFETTI EFFECT
    // ============================================
    function shootConfetti() {
        const colors = ['#8cc8ed', '#c9eee0', '#e8c547', '#f5cac3'];
        
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: colors,
            disableForReducedMotion: true
        });
    }

    if ($amazonBtn) {
        $amazonBtn.addEventListener('mouseenter', () => {
            // small burst on hover
            confetti({
                particleCount: 30,
                spread: 40,
                origin: { 
                    x: $amazonBtn.getBoundingClientRect().left / window.innerWidth + 0.1,
                    y: $amazonBtn.getBoundingClientRect().top / window.innerHeight 
                },
                colors: ['#8cc8ed', '#e8c547'],
                disableForReducedMotion: true
            });
        });
        
        $amazonBtn.addEventListener('click', shootConfetti);
    }

    // ============================================
    // 5b. HERO ELEPHANT — CLICK INTERACTIONS
    // ============================================
    if ($heroElephant) {
        let elephantBusy = false;

        $heroElephant.addEventListener('click', () => {
            if (elephantBusy) return;
            elephantBusy = true;

            // Pause the idle float during the click animation
            $heroElephant.style.animationPlayState = 'paused';

            const tl = gsap.timeline({
                onComplete: () => {
                    elephantBusy = false;
                    $heroElephant.style.animationPlayState = 'running';
                }
            });

            // 1 — Joyful bounce sequence
            tl.to($heroElephant, {
                y: -30,
                scaleX: 1.06,
                scaleY: 0.94,
                duration: 0.15,
                ease: 'power2.out'
            })
            .to($heroElephant, {
                y: 5,
                scaleX: 0.95,
                scaleY: 1.06,
                duration: 0.12,
                ease: 'power2.in'
            })
            .to($heroElephant, {
                y: -18,
                scaleX: 1.04,
                scaleY: 0.97,
                duration: 0.12,
                ease: 'power2.out'
            })
            .to($heroElephant, {
                y: 3,
                scaleX: 0.97,
                scaleY: 1.03,
                duration: 0.1,
                ease: 'power2.in'
            })
            .to($heroElephant, {
                y: -8,
                scaleX: 1.02,
                scaleY: 0.99,
                duration: 0.1,
                ease: 'power2.out'
            })
            .to($heroElephant, {
                y: 0,
                scaleX: 1,
                scaleY: 1,
                duration: 0.35,
                ease: 'elastic.out(1.1, 0.4)'
            })

            // 2 — Playful wiggle rotation
            .to($heroElephant, {
                rotation: -5,
                duration: 0.06,
                ease: 'power1.inOut'
            }, 0.15)
            .to($heroElephant, {
                rotation: 5,
                duration: 0.06,
                ease: 'power1.inOut'
            })
            .to($heroElephant, {
                rotation: -3,
                duration: 0.06,
                ease: 'power1.inOut'
            })
            .to($heroElephant, {
                rotation: 3,
                duration: 0.06,
                ease: 'power1.inOut'
            })
            .to($heroElephant, {
                rotation: 0,
                duration: 0.2,
                ease: 'power2.out'
            })

            // 3 — Brief glow pulse
            .to($heroElephant, {
                filter: 'drop-shadow(0 20px 60px rgba(140, 200, 237, 1)) brightness(1.12)',
                duration: 0.2
            }, 0)
            .to($heroElephant, {
                filter: 'drop-shadow(0 15px 40px rgba(140, 200, 237, 0.5)) brightness(1)',
                duration: 0.6,
                ease: 'power2.out'
            });

            // Water spray confetti from trunk area (upper-right of image)
            const rect = $heroElephant.getBoundingClientRect();
            const sprayX = (rect.left + rect.width * 0.5) / window.innerWidth;
            const sprayY = (rect.top + rect.height * 0.25) / window.innerHeight;

            // Blue water drops burst
            confetti({
                particleCount: 50,
                angle: 80,
                spread: 50,
                origin: { x: sprayX, y: sprayY },
                colors: ['#dbeefb', '#b5ddf5', '#8cc8ed', '#ffffff'],
                startVelocity: 35,
                gravity: 1.4,
                scalar: 0.7,
                ticks: 90,
                disableForReducedMotion: true
            });

            // Delayed second burst (more playful)
            setTimeout(() => {
                confetti({
                    particleCount: 35,
                    angle: 100,
                    spread: 65,
                    origin: { x: sprayX + 0.02, y: sprayY + 0.03 },
                    colors: ['#c9eee0', '#b5ddf5', '#f5cac3', '#e8c547'],
                    startVelocity: 25,
                    gravity: 1.2,
                    scalar: 0.8,
                    ticks: 70,
                    disableForReducedMotion: true
                });
            }, 150);
        });
    }

    // ============================================
    // 6. CALENDAR MODAL & LINKS
    // ============================================
    const EVENT_TITLE = 'Baby Shower — Sathvika & Manoj';
    const EVENT_LOCATION = '2675 S Course Dr, Pompano Beach, FL 33069';
    const EVENT_DESC = 'Our little peanut is almost here!! Join us for an evening of good food, warm laughter, and happy blessings.';

    function getGoogleCalendarUrl() {
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: EVENT_TITLE,
            dates: `20260725T220000Z/20260726T020000Z`,
            details: EVENT_DESC,
            location: EVENT_LOCATION,
        });
        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    }

    function generateICalFile() {
        const ical = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Baby Shower//EN\r\nBEGIN:VEVENT\r\nDTSTART:20260725T220000Z\r\nDTEND:20260726T020000Z\r\nSUMMARY:${EVENT_TITLE}\r\nDESCRIPTION:${EVENT_DESC}\r\nLOCATION:${EVENT_LOCATION}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
        return URL.createObjectURL(new Blob([ical], { type: 'text/calendar;charset=utf-8' }));
    }

    if ($googleCal) $googleCal.href = getGoogleCalendarUrl();
    if ($icalDownload) $icalDownload.href = generateICalFile();

    if ($addCalBtn) {
        $addCalBtn.addEventListener('click', () => {
            $calendarModal.classList.add('active');
        });
    }
    if ($modalClose) {
        $modalClose.addEventListener('click', () => {
            $calendarModal.classList.remove('active');
        });
    }
    if ($calendarModal) {
        $calendarModal.addEventListener('click', (e) => {
            if (e.target === $calendarModal) $calendarModal.classList.remove('active');
        });
    }

    // ============================================
    // 7. SCROLL INDICATOR FADE OUT
    // ============================================
    const $scrollIndicator = document.getElementById('scroll-indicator');
    if ($scrollIndicator) {
        $scrollIndicator.addEventListener('click', () => {
            document.getElementById('message').scrollIntoView({ behavior: 'smooth' });
        });
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                $scrollIndicator.style.opacity = '0';
                $scrollIndicator.style.pointerEvents = 'none';
            }
        }, { passive: true });
    }

});
