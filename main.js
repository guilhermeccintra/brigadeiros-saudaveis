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
// META PIXEL & CONVERSIONS API (CAPI) LOGIC
// ==========================================
const META_PIXEL_ID = '2131888377628007';
const META_CAPI_TOKEN = 'EAAedLpYiTYMBRKZC679iBe3WHonWnYZBlO42x4bLBlmwrSERAOOCKrJicbxqJWHqo1a0JIopviWhuNWqGUFOfrtiaUXtQoXZB5E6snuosvfdi4bXlxznHROzIKLXFFp2WMpZBk3VbzejNZA6gZB1SCAGc4F3lHe4WSHjwkZAaptFE0ef4DtXeWcZBc1YMkEgPTZBf8AZDZD';

function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : '';
}

function sendMetaCAPI(eventName) {
    const payload = {
        data: [{
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: window.location.href,
            user_data: {
                client_user_agent: navigator.userAgent,
                fbp: getCookie('_fbp'),
                fbc: getCookie('_fbc')
            }
        }]
    };

    fetch(`https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(err => console.error('CAPI Error:', err));
}

function initMetaPixel() {
    !function(f,b,e,v,n,t,s){
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
    }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
    sendMetaCAPI('PageView');
}

// Defer PageView tracking to free up main thread during initial load
if (window.requestIdleCallback) {
    window.requestIdleCallback(initMetaPixel);
} else {
    setTimeout(initMetaPixel, 1000);
}

// Optimize ViewContent scroll tracking with passive listener
let viewContentFired = false;
let ticking = false;

window.addEventListener('scroll', () => {
    if (viewContentFired) return;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            let scrollPosition = window.scrollY;
            let documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrollPercentage = (scrollPosition / documentHeight) * 100;
            
            if (scrollPercentage >= 50) {
                if (typeof fbq === 'function') fbq('track', 'ViewContent');
                sendMetaCAPI('ViewContent');
                viewContentFired = true;
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

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
