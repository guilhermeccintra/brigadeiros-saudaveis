document.addEventListener('DOMContentLoaded', () => {
    // Schedule non-critical work when browser is idle to optimize main thread
    const scheduleWork = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

    scheduleWork(() => {
        // FAQ Accordion
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        });
    });

    scheduleWork(() => {
        // Reveal animations using IntersectionObserver
        const reveals = document.querySelectorAll('.reveal-left, .reveal-right');
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -150px 0px',
                threshold: 0
            };

            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const reveal = entry.target;
                        if (reveal.classList.contains('reveal-left')) {
                            reveal.style.animation = 'fadeUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
                        } else if (reveal.classList.contains('reveal-right')) {
                            reveal.style.animation = 'fadeUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s backwards';
                        }
                        observer.unobserve(reveal);
                    }
                });
            }, observerOptions);

            reveals.forEach(reveal => revealObserver.observe(reveal));
        }
    });

    scheduleWork(() => {
        // Inject current date into promo bar and bonus section
        injectCurrentDate();
        // Start Promo Timer
        startPromoTimer();
    });
});



// ==========================================
// PROMO TIMER LOGIC
// ==========================================
function startPromoTimer() {
    const timerDisplay = document.getElementById('countdown');
    if (!timerDisplay) return;

    function updateTimer() {
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        let diff = endOfDay - now;
        if (diff < 0) diff = 0;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        timerDisplay.textContent = 
            String(hours).padStart(2, '0') + ':' + 
            String(mins).padStart(2, '0') + ':' + 
            String(secs).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
    updateTimer();
}

// ==========================================
// CURRENT DATE INJECTION
// ==========================================
function injectCurrentDate() {
    const now = new Date();
    const formatted = now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const promoDate = document.getElementById('promo-date');
    if (promoDate) promoDate.textContent = formatted;

    const bonusDate = document.getElementById('bonus-date');
    if (bonusDate) bonusDate.textContent = formatted;
}
