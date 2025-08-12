// Smooth scroll for nav links
const navLinks = document.querySelectorAll('.nav-links a, .footer-nav a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Simple mount animation for nav and hero
window.addEventListener('DOMContentLoaded', () => {
  // Autobuild Reach Map: City dot tooltips
  const reachBtns = document.querySelectorAll('.reach-dot-btn');
  const tooltip = document.getElementById('reach-tooltip');
  const tooltipImg = document.getElementById('reach-tooltip-img');
  const tooltipCity = document.getElementById('reach-tooltip-city');
  let currentDot = null;
  function closeTooltip() {
    tooltip.style.display = 'none';
    if (currentDot) currentDot.classList.remove('active-dot');
    currentDot = null;
  }
  reachBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const city = btn.getAttribute('data-city');
      const img = btn.getAttribute('data-img');
      tooltipImg.src = img;
      tooltipImg.alt = city + ' photo';
      // Show city name and description
      const desc = btn.getAttribute('data-desc') || '';
      tooltipCity.innerHTML = `<strong>${city}</strong><br><span class="reach-tooltip-desc">${desc}</span>`;
      // Position tooltip above the dot
      const dot = btn.closest('.reach-city-dot');
      const overlay = document.querySelector('.reach-map-overlay');
      const dotRect = dot.getBoundingClientRect();
      const overlayRect = overlay.getBoundingClientRect();
      // Center tooltip horizontally above the dot, vertically offset
      tooltip.style.left = (dotRect.left - overlayRect.left + dotRect.width/2) + 'px';
      tooltip.style.top = (dotRect.top - overlayRect.top) + 'px';
      tooltip.style.display = 'flex';
      // Highlight active dot
      document.querySelectorAll('.reach-city-dot').forEach(d => d.classList.remove('active-dot'));
      dot.classList.add('active-dot');
      currentDot = dot;
    });
  });
  document.querySelector('.reach-tooltip-close').addEventListener('click', closeTooltip);
  document.addEventListener('click', e => {
    if (tooltip.style.display === 'flex' && !tooltip.contains(e.target)) closeTooltip();
  });
});
  document.querySelector('.navbar').classList.add('show');
  document.querySelector('.hero-section').classList.add('show');

  // Use Cases Slider logic
  const slider = document.querySelector('.usecases-slider');
  const track = document.querySelector('.usecases-track');
  const prevBtn = document.querySelector('.usecase-prev');
  const nextBtn = document.querySelector('.usecase-next');
  if (slider && track && prevBtn && nextBtn) {
    let visibleCards = 4;
    let cardWidth = 0;
    let scrollAmount = 0;
    let maxScroll = 0;
    let isCloned = false;
    let cards, totalCards;

    function cloneCards() {
      // Remove previous clones
      const clones = track.querySelectorAll('.clone');
      clones.forEach(clone => clone.remove());
      cards = Array.from(track.querySelectorAll('.usecase-card:not(.clone)'));
      totalCards = cards.length;
      // Clone first and last N cards
      for (let i = 0; i < visibleCards; i++) {
        if (cards[i]) {
          const clone = cards[i].cloneNode(true);
          clone.classList.add('clone');
          track.appendChild(clone);
        }
        if (cards[totalCards - 1 - i]) {
          const clone = cards[totalCards - 1 - i].cloneNode(true);
          clone.classList.add('clone');
          track.insertBefore(clone, track.firstChild);
        }
      }
      isCloned = true;
    }

    const updateSlider = () => {
      // Responsive: 4 on desktop, 2 on tablet, 1 on mobile
      const width = window.innerWidth;
      if (width <= 600) visibleCards = 1;
      else if (width <= 900) visibleCards = 2;
      else visibleCards = 4;
      cloneCards();
      const card = track.querySelector('.usecase-card:not(.clone)');
      if (!card) return;
      cardWidth = card.offsetWidth + parseInt(getComputedStyle(track).gap || 16);
      scrollAmount = cardWidth * visibleCards;
      maxScroll = track.scrollWidth - track.clientWidth;
      // Set initial scrollLeft after cloning
      track.scrollLeft = cardWidth * visibleCards;
    };

    window.addEventListener('resize', updateSlider);
    updateSlider();

    // Infinite scroll logic
    track.addEventListener('scroll', () => {
      // If at (or past) the left clones
      if (track.scrollLeft < cardWidth * visibleCards * 0.5) {
        track.scrollLeft = cardWidth * totalCards + track.scrollLeft;
      }
      // If at (or past) the right clones
      else if (track.scrollLeft > cardWidth * (totalCards + visibleCards - 0.5)) {
        track.scrollLeft = cardWidth * visibleCards + (track.scrollLeft - cardWidth * (totalCards + visibleCards));
      }
    });

    prevBtn.addEventListener('click', () => {
      updateSlider();
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      updateSlider();
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    // Touch support
    let startX = 0, scrollLeft = 0, isDown = false;
    track.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.classList.add('dragging');
    });
    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.classList.remove('dragging');
    });
    track.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('dragging');
    });
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.2;
      track.scrollLeft = scrollLeft - walk;
    });
    // Touch events
    track.addEventListener('touchstart', (e) => {
      isDown = true;
      startX = e.touches[0].pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('touchend', () => {
      isDown = false;
    });
    track.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - track.offsetLeft;
      const walk = (x - startX) * 1.2;
      track.scrollLeft = scrollLeft - walk;
    });
  }

  // Custom Prompts refresh logic
  const prompts = [
    { title: 'Summarize a research paper', text: 'Write a concise summary of the following research paper: ...' },
    { title: 'Generate a project plan', text: 'Create a detailed project plan for launching a new SaaS product.' },
    { title: 'Write a product description', text: 'Draft a compelling product description for this new gadget.' },
    { title: 'Make a study schedule', text: 'Generate a personalized study schedule for my upcoming exams.' },
    { title: 'Draft a cold email', text: 'Write a professional cold email to reach out to potential clients.' },
    { title: 'Create a social media post', text: 'Generate an engaging social media post for our latest feature.' }
  ];
  function getRandomPrompt(excludeIdx) {
    let idx;
    do {
      idx = Math.floor(Math.random() * prompts.length);
    } while (idx === excludeIdx);
    return { ...prompts[idx], idx };
  }
  function setPrompt(card, titleId, textId, idx) {
    document.getElementById(titleId).textContent = prompts[idx].title;
    document.getElementById(textId).textContent = prompts[idx].text;
    card.dataset.promptIdx = idx;
  }
  // Card 1
  const card1 = document.getElementById('prompt-title-1').closest('.custom-prompt-card');
  const btn1 = document.getElementById('refresh-btn-1');
  // Card 2
  const card2 = document.getElementById('prompt-title-2').closest('.custom-prompt-card');
  const btn2 = document.getElementById('refresh-btn-2');
  // Init
  setPrompt(card1, 'prompt-title-1', 'prompt-text-1', 0);
  setPrompt(card2, 'prompt-title-2', 'prompt-text-2', 1);
  // Refresh handlers
  btn1.addEventListener('click', () => {
    btn1.disabled = true;
    const oldHtml = btn1.innerHTML;
    btn1.innerHTML = '<span class="spinner-dot">...</span>';
    setTimeout(() => {
      const exclude = +card1.dataset.promptIdx;
      const { title, text, idx } = getRandomPrompt(exclude);
      setPrompt(card1, 'prompt-title-1', 'prompt-text-1', idx);
      btn1.disabled = false;
      btn1.innerHTML = oldHtml;
    }, 1200);
  });
  btn2.addEventListener('click', () => {
    btn2.disabled = true;
    const oldHtml = btn2.innerHTML;
    btn2.innerHTML = '<span class="spinner-dot">...</span>';
    setTimeout(() => {
      const exclude = +card2.dataset.promptIdx;
      const { title, text, idx } = getRandomPrompt(exclude);
      setPrompt(card2, 'prompt-title-2', 'prompt-text-2', idx);
      btn2.disabled = false;
      btn2.innerHTML = oldHtml;
    }, 1200);
  });

