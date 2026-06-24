document.addEventListener('DOMContentLoaded', function () {

    /* ========================
       COUNTDOWN TIMER
       ======================== */
    (function initTimer() {
        var timerEl = document.getElementById('timer');
        var DURATION = 27 * 60; // 27 minutes in seconds
        var storageKey = 'playmobi_timer_end';

        var endTime = sessionStorage.getItem(storageKey);
        if (!endTime) {
            endTime = Date.now() + DURATION * 1000;
            sessionStorage.setItem(storageKey, endTime);
        } else {
            endTime = parseInt(endTime, 10);
        }

        function update() {
            var remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            var min = Math.floor(remaining / 60);
            var sec = remaining % 60;
            timerEl.textContent =
                (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;

            if (remaining > 0) {
                requestAnimationFrame(function () {
                    setTimeout(update, 250);
                });
            }
        }

        update();
    })();

    /* ========================
       VIDEO FACADE
       ======================== */
    (function initVideo() {
        var facade = document.getElementById('videoFacade');
        var inner = document.getElementById('videoInner');
        if (!facade || !inner) return;

        facade.addEventListener('click', function () {
            var iframe = document.createElement('iframe');
            iframe.src = 'https://www.youtube.com/embed/5qjRBReNZ1w?autoplay=1&rel=0&modestbranding=1&playsinline=1';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            inner.innerHTML = '';
            inner.appendChild(iframe);
        });
    })();

    /* ========================
       FAQ ACCORDION
       ======================== */
    (function initFAQ() {
        var items = document.querySelectorAll('.faq-item');

        items.forEach(function (item) {
            var btn = item.querySelector('.faq-question');
            btn.addEventListener('click', function () {
                var isOpen = item.classList.contains('open');

                // Close all
                items.forEach(function (i) {
                    i.classList.remove('open');
                    i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });

                // Open clicked (if it was closed)
                if (!isOpen) {
                    item.classList.add('open');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    })();

    /* ========================
       TESTIMONIALS CAROUSEL
       ======================== */
    (function initCarousel() {
        var carousel = document.getElementById('carousel');
        var dotsContainer = document.getElementById('carouselDots');
        if (!carousel || !dotsContainer) return;

        var cards = carousel.querySelectorAll('.testimonial-card');
        if (cards.length === 0) return;

        // Create dots
        cards.forEach(function (_, i) {
            var dot = document.createElement('span');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', function () {
                cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            });
            dotsContainer.appendChild(dot);
        });

        var dots = dotsContainer.querySelectorAll('.carousel-dot');

        // Update active dot on scroll
        var scrollTimeout;
        carousel.addEventListener('scroll', function () {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function () {
                var scrollLeft = carousel.scrollLeft;
                var cardWidth = cards[0].offsetWidth + 14; // width + gap
                var activeIndex = Math.round(scrollLeft / cardWidth);
                dots.forEach(function (d, i) {
                    d.classList.toggle('active', i === activeIndex);
                });
            }, 50);
        });
    })();

    /* ========================
       ORDER BUMP MODAL
       ======================== */
    (function initModal() {
        var overlay = document.getElementById('modalOverlay');
        var closeBtn = document.getElementById('modalClose');
        var buyBtn = document.getElementById('buyBtn');
        var basicBtn = document.getElementById('basicBtn');

        if (!overlay || !buyBtn) return;

        function openModal() {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        buyBtn.addEventListener('click', openModal);

        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        // Close on overlay click (outside modal card)
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closeModal();
            }
        });

        // Basic button also closes modal (redirects to basic checkout)
        if (basicBtn) {
            basicBtn.addEventListener('click', function () {
                closeModal();
                // Will follow the href link
            });
        }
    })();

    /* ========================
       SCROLL ANIMATIONS
       ======================== */
    (function initScrollAnimations() {
        var targets = document.querySelectorAll('.fade-up');
        if (!targets.length) return;

        if (!('IntersectionObserver' in window)) {
            // Fallback: show all immediately
            targets.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        targets.forEach(function (el) { observer.observe(el); });
    })();

});
