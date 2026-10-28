// Sticky bottom bar controller
document.addEventListener('DOMContentLoaded', () => {
  const sbar = document.getElementById('sbar') || document.querySelector('.sbar');
  const heroSection = document.querySelector('.bhero');

  if (sbar && heroSection) {
    const handleScroll = () => {
      const heroRect = heroSection.getBoundingClientRect();
      // Show when hero section is scrolled past
      if (heroRect.bottom < 80) {
        sbar.classList.add('show');
        document.body.classList.add('has-sbar');
      } else {
        sbar.classList.remove('show');
        document.body.classList.remove('has-sbar');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  const BOOK_ID = 'royal-watch';
  const BOOK_TITLE = "The Queen's Jewels & Secrets";

  // Track events for analytics
  function trackEvent(eventName, eventData = {}) {
    const payload = {
      event: eventName,
      book_id: BOOK_ID,
      book_title: BOOK_TITLE,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer || 'direct',
      ...eventData
    };
    console.log('[Analytics]:', payload);

    try {
      const endpoint = window.ROYAL_TRACKER_ENDPOINT || 'https://royal-tracker-dashboard.vercel.app/api/track';
      const body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(endpoint, blob);
      } else {
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
          keepalive: true
        }).catch(() => {});
      }
    } catch (_) {}
  }

  // Initial page view event
  trackEvent('page_view', { channel: "Royal Watch" });

  // Track checkout button clicks
  document.querySelectorAll('a[href*="whop.com/checkout"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const href = this.getAttribute('href');
      let plan = 'unknown';
      if (href.includes('plan_vn9KbkYygo8UT')) plan = 'combo_24_99';
      else if (href.includes('plan_su7ftv0tPA73n')) plan = 'ebook_16_99';
      else if (href.includes('plan_t6uKwMsCbsfr2')) plan = 'audiobook_16_99';

      trackEvent('checkout_click', {
        plan: plan,
        checkoutUrl: href,
        buttonText: this.innerText.replace(/\s+/g, ' ').trim()
      });
    });
  });
});
