document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Check if current is active
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(i => i.classList.remove('active'));
            
            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Reveal animations on scroll
    const reveals = document.querySelectorAll('.reveal-left, .reveal-right');
    const windowHeight = window.innerHeight;

    function revealOnScroll() {
        const elementVisible = 150;
        
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                if (reveal.classList.contains('reveal-left')) {
                    reveal.style.animation = 'fadeUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
                } else if (reveal.classList.contains('reveal-right')) {
                    reveal.style.animation = 'fadeUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s backwards';
                }
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load
});

// ==========================================
// META PIXEL & CONVERSIONS API (CAPI) LOGIC
// ==========================================
const META_PIXEL_ID = '2131888377628007';
const META_CAPI_TOKEN = 'EAAedLpYiTYMBRKZC679iBe3WHonWnYZBlO42x4bLBlmwrSERAOOCKrJicbxqJWHqo1a0JIopviWhuNWqGUFOfrtiaUXtQoXZB5E6snuosvfdi4bXlxznHROzIKLXFFp2WMpZBk3VbzejNZA6gZB1SCAGc4F3lHe4WSHjwkZAaptFE0ef4DtXeWcZBc1YMkEgPTZBf8AZDZD';

// Helper to generate IDs (fbp, fbc approximation)
function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : '';
}

// Function to send event to Conversion API
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

// Track CAPI PageView on initial load (safeguard inside DOM)
sendMetaCAPI('PageView');

// Trigger ViewContent only when scrolled 50% of page
let viewContentFired = false;

window.addEventListener('scroll', () => {
    if (viewContentFired) return;
    
    let scrollPosition = window.scrollY;
    let documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollPercentage = (scrollPosition / documentHeight) * 100;
    
    if (scrollPercentage >= 50) {
        // Fire client-side pixel event
        if (typeof fbq === 'function') {
            fbq('track', 'ViewContent');
        }
        // Fire server-side CAPI event
        sendMetaCAPI('ViewContent');
        viewContentFired = true;
    }
});
