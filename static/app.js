/**
 * VoyageAI - Intelligent Travel Planner
 * Enhanced Frontend Controller with Flight Radar, Confetti Celebration & Tab System
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const travelForm = document.getElementById('travelForm');
  const destinationInput = document.getElementById('destinationInput');
  const clearDestBtn = document.getElementById('clearDestBtn');
  const durationSlider = document.getElementById('durationSlider');
  const durationValue = document.getElementById('durationValue');
  const tripTempoBadge = document.getElementById('tripTempoBadge');
  const travelersInput = document.getElementById('travelersInput');
  const travelerTypeTag = document.getElementById('travelerTypeTag');
  const decrementTravelers = document.getElementById('decrementTravelers');
  const incrementTravelers = document.getElementById('incrementTravelers');
  const budgetCards = document.querySelectorAll('.budget-option-card');
  const transportSelect = document.getElementById('transportSelect');
  const hotelSelect = document.getElementById('hotelSelect');
  const interestChips = document.querySelectorAll('.interest-chip');
  const customNotes = document.getElementById('customNotes');
  
  // Submit Button
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnIcon = document.getElementById('submitBtnIcon');
  const submitBtnText = document.getElementById('submitBtnText');

  // Hub & Display Panels
  const destinationsGrid = document.getElementById('destinationsGrid');
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  const resultState = document.getElementById('resultState');
  const errorState = document.getElementById('errorState');
  
  // Radar & Loading Elements
  const radarPercent = document.getElementById('radarPercent');
  const flightTrackFill = document.getElementById('flightTrackFill');
  const flightPlaneIcon = document.getElementById('flightPlaneIcon');
  const flightDestWaypoint = document.getElementById('flightDestWaypoint');
  const loadingStatusText = document.getElementById('loadingStatusText');
  const loadingProgressBar = document.getElementById('loadingProgressBar');
  const liveFactText = document.getElementById('liveFactText');

  // Showcase Header & Badges
  const showcaseDestTitle = document.getElementById('showcaseDestTitle');
  const metaDestBadge = document.getElementById('metaDestBadge');
  const metaDurationBadge = document.getElementById('metaDurationBadge');
  const metaTravelersBadge = document.getElementById('metaTravelersBadge');
  const metaBudgetBadge = document.getElementById('metaBudgetBadge');
  const metaTransportBadge = document.getElementById('metaTransportBadge');
  const metaHotelBadge = document.getElementById('metaHotelBadge');
  const mapsBtn = document.getElementById('mapsBtn');
  const confettiCanvas = document.getElementById('confettiCanvas');

  // Tabs & Content
  const itineraryTabsBar = document.getElementById('itineraryTabsBar');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const itineraryContent = document.getElementById('itineraryContent');

  // Action Buttons
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const printBtn = document.getElementById('printBtn');
  const planAnotherBtn = document.getElementById('planAnotherBtn');
  const retryBtn = document.getElementById('retryBtn');
  const errorMessageText = document.getElementById('errorMessageText');

  // Theme & Toast
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMessage = document.getElementById('toastMessage');

  let currentRawMarkdown = '';
  let currentDestinationName = 'Trip';
  let parsedSections = {};

  // --- Theme Controller ---
  const savedTheme = localStorage.getItem('voyageai-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('voyageai-theme', newTheme);
    showToast(`Switched to ${newTheme} theme`, newTheme === 'dark' ? '🌙' : '☀️');
  });

  // --- Toast Notification ---
  let toastTimer = null;
  function showToast(message, icon = '✓', duration = 3200) {
    if (toastTimer) clearTimeout(toastTimer);
    toastIcon.textContent = icon;
    toastMessage.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // --- Destination Input & Clear Button ---
  function updateClearBtnVisibility() {
    clearDestBtn.style.display = destinationInput.value.trim() ? 'block' : 'none';
  }

  destinationInput.addEventListener('input', updateClearBtnVisibility);
  clearDestBtn.addEventListener('click', () => {
    destinationInput.value = '';
    updateClearBtnVisibility();
    destinationInput.focus();
  });

  // Quick Idea Pills
  document.querySelectorAll('.quick-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const dest = pill.getAttribute('data-dest');
      destinationInput.value = dest;
      updateClearBtnVisibility();
      showToast(`Selected ${dest}`, '📍');
    });
  });

  // --- Duration Slider Logic ---
  function updateDurationDisplay(days) {
    durationValue.textContent = days;
    let tempo = 'Medium Getaway';
    if (days <= 3) tempo = 'Weekend Trip';
    else if (days <= 6) tempo = 'Short Vacation';
    else if (days <= 12) tempo = 'Grand Journey';
    else tempo = 'Deep Exploration';
    tripTempoBadge.textContent = tempo;
  }

  durationSlider.addEventListener('input', (e) => {
    updateDurationDisplay(e.target.value);
  });

  // --- Travelers Stepper Logic ---
  function updateTravelerType(count) {
    let tag = `Solo Explorer (${count})`;
    if (count === 2) tag = `Couple / Pair (${count})`;
    else if (count <= 4) tag = `Small Group / Family (${count})`;
    else tag = `Large Tour Party (${count})`;
    travelerTypeTag.textContent = tag;
  }

  decrementTravelers.addEventListener('click', () => {
    let current = parseInt(travelersInput.value, 10) || 1;
    if (current > 1) {
      current -= 1;
      travelersInput.value = current;
      updateTravelerType(current);
    }
  });

  incrementTravelers.addEventListener('click', () => {
    let current = parseInt(travelersInput.value, 10) || 1;
    if (current < 20) {
      current += 1;
      travelersInput.value = current;
      updateTravelerType(current);
    }
  });

  // --- Budget Radio Cards ---
  budgetCards.forEach(card => {
    card.addEventListener('click', () => {
      budgetCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // --- Interest Chips Toggle ---
  interestChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });

  function getSelectedInterests() {
    return Array.from(document.querySelectorAll('.interest-chip.active'))
      .map(chip => chip.getAttribute('data-interest'));
  }

  // --- Fetch & Render Popular Destinations ---
  async function loadPopularDestinations() {
    try {
      const res = await fetch('/api/destinations');
      if (!res.ok) throw new Error('Failed to load destinations');
      const destinations = await res.json();
      renderPopularDestinations(destinations);
    } catch (err) {
      console.warn('Could not fetch destinations list:', err);
    }
  }

  function renderPopularDestinations(list) {
    destinationsGrid.innerHTML = '';
    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'dest-card';
      card.innerHTML = `
        <div class="dest-card-top">
          <span class="dest-emoji">${item.emoji}</span>
          <span class="dest-duration-badge">${item.bestDays} Days</span>
        </div>
        <div class="dest-name">${item.name}</div>
        <div class="dest-tagline">${item.tagline}</div>
        <div class="dest-footer-tags">
          <span class="dest-mini-tag">${item.budget}</span>
          <span class="dest-mini-tag">${item.hotel}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        applyDestinationPreset(item);
      });

      destinationsGrid.appendChild(card);
    });
  }

  function applyDestinationPreset(item) {
    destinationInput.value = item.name;
    updateClearBtnVisibility();

    durationSlider.value = item.bestDays;
    updateDurationDisplay(item.bestDays);

    budgetCards.forEach(c => {
      const radio = c.querySelector('input[type="radio"]');
      if (radio && radio.value.toLowerCase() === item.budget.toLowerCase()) {
        c.classList.add('selected');
        radio.checked = true;
      } else {
        c.classList.remove('selected');
      }
    });

    if (item.transport) transportSelect.value = item.transport;
    if (item.hotel) hotelSelect.value = item.hotel;

    if (item.interests && item.interests.length) {
      interestChips.forEach(chip => {
        const val = chip.getAttribute('data-interest');
        if (item.interests.includes(val)) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    }

    showToast(`Loaded ${item.name} preset!`, item.emoji);
    destinationInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // --- Dynamic Live Ticker & Radar Simulation ---
  let progressTimer = null;
  let factTimer = null;
  let currentProgress = 0;

  const travelFacts = [
    "Consulting Groq LLM & searching real-time Google Serper intelligence...",
    "Scanning local attraction tickets, metro maps, and hidden scenic spots...",
    "Curating authentic local cuisine and verified traveler recommendations...",
    "Calculating realistic day-by-day budget estimates and transit options...",
    "Structuring morning, afternoon, and evening schedules with optimal walking routes...",
    "Polishing insider safety advice and seasonal packing tips..."
  ];

  function startRadarProgress(destination) {
    currentProgress = 5;
    flightDestWaypoint.textContent = destination || 'Destination';
    radarPercent.textContent = '5%';
    flightTrackFill.style.width = '5%';
    flightPlaneIcon.style.left = '5%';
    loadingProgressBar.style.width = '5%';

    // Step indicators
    const steps = [
      { id: 'step1', min: 0, text: 'Connecting to Groq AI & Google Serper' },
      { id: 'step2', min: 25, text: 'Gathering weather, transit passes & top rated attractions' },
      { id: 'step3', min: 55, text: 'Assembling Morning, Afternoon & Evening schedules' },
      { id: 'step4', min: 80, text: 'Finalizing hotel recommendations & budget breakdown' }
    ];

    // Facts rotation
    let factIdx = 0;
    liveFactText.textContent = travelFacts[0];
    factTimer = setInterval(() => {
      factIdx = (factIdx + 1) % travelFacts.length;
      liveFactText.textContent = travelFacts[factIdx];
    }, 2800);

    // Smooth Progress easing
    progressTimer = setInterval(() => {
      if (currentProgress < 94) {
        // Increment smoothly
        const delta = Math.max(1, Math.floor((95 - currentProgress) * 0.08));
        currentProgress += delta;
        
        radarPercent.textContent = `${currentProgress}%`;
        flightTrackFill.style.width = `${currentProgress}%`;
        flightPlaneIcon.style.left = `${currentProgress}%`;
        loadingProgressBar.style.width = `${currentProgress}%`;

        // Update step items
        steps.forEach((s, idx) => {
          const el = document.getElementById(s.id);
          if (!el) return;
          if (currentProgress >= s.min + 20) {
            el.className = 'step-item completed';
          } else if (currentProgress >= s.min) {
            el.className = 'step-item active';
            loadingStatusText.textContent = s.text;
          } else {
            el.className = 'step-item';
          }
        });
      }
    }, 400);
  }

  function finishRadarProgress() {
    if (progressTimer) clearInterval(progressTimer);
    if (factTimer) clearInterval(factTimer);
    currentProgress = 100;
    radarPercent.textContent = '100%';
    flightTrackFill.style.width = '100%';
    flightPlaneIcon.style.left = '100%';
    loadingProgressBar.style.width = '100%';
  }

  // --- Confetti Celebration Burst ---
  function fireConfetti() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    const width = confettiCanvas.width = confettiCanvas.parentElement.offsetWidth;
    const height = confettiCanvas.height = confettiCanvas.parentElement.offsetHeight;

    const colors = ['#38bdf8', '#0284c7', '#f59e0b', '#22c55e', '#a855f7', '#fb7185'];
    const particles = [];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: width * (0.3 + Math.random() * 0.4),
        y: height * 0.2,
        r: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 8,
        vy: -3 - Math.random() * 6,
        gravity: 0.18 + Math.random() * 0.1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }

    let animationId;
    function render() {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 1.5);
          ctx.restore();
        }
      });

      if (alive) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        cancelAnimationFrame(animationId);
      }
    }
    render();
  }

  // --- Markdown Parser with Section Extraction for Tabs ---
  function parseMarkdown(md) {
    if (!md) return { all: '', daily: '', hotels: '', food: '', budget: '', tips: '' };

    let text = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = text.split('\n');

    let currentSection = 'overview';
    let sections = {
      overview: [],
      daily: [],
      hotels: [],
      transit: [],
      food: [],
      budget: [],
      tips: []
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lower = line.toLowerCase();

      if (lower.includes('day-by-day') || lower.includes('day by day')) {
        currentSection = 'daily';
      } else if (lower.includes('accommodation') || lower.includes('hotel')) {
        currentSection = 'hotels';
      } else if (lower.includes('transit') || lower.includes('getting around')) {
        currentSection = 'transit';
      } else if (lower.includes('culinary') || lower.includes('food') || lower.includes('must-eat')) {
        currentSection = 'food';
      } else if (lower.includes('budget') || lower.includes('cost')) {
        currentSection = 'budget';
      } else if (lower.includes('tip') || lower.includes('safety') || lower.includes('packing')) {
        currentSection = 'tips';
      }

      sections[currentSection].push(line);
    }

    return {
      all: renderLinesToHTML(lines),
      daily: renderLinesToHTML(sections.daily),
      hotels: renderLinesToHTML(sections.hotels),
      food: renderLinesToHTML(sections.food),
      budget: renderLinesToHTML(sections.budget),
      tips: renderLinesToHTML(sections.tips, true) // Enable checklist mode for tips
    };
  }

  function renderLinesToHTML(lines, isChecklist = false) {
    let outputLines = [];
    let insideDayCard = false;
    let insideTable = false;
    let tableHtml = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // Tables
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!insideTable) {
          insideTable = true;
          tableHtml = ['<table><tbody>'];
        }
        const cells = line.split('|').map(c => c.trim()).slice(1, -1);
        if (cells.every(c => /^[-:]+$/.test(c))) {
          if (tableHtml.length === 2) {
            tableHtml[1] = tableHtml[1].replace(/<td/g, '<th').replace(/<\/td>/g, '</th>');
          }
          continue;
        }
        tableHtml.push('<tr>' + cells.map(c => `<td>${parseInlineMarkdown(c)}</td>`).join('') + '</tr>');
        continue;
      } else if (insideTable) {
        insideTable = false;
        tableHtml.push('</tbody></table>');
        outputLines.push(tableHtml.join(''));
        tableHtml = [];
      }

      // Day section cards
      if (line.match(/^###\s+(Day\s+\d+.*)/i)) {
        if (insideDayCard) outputLines.push('</div>');
        insideDayCard = true;
        const dayTitle = line.replace(/^###\s+/, '');
        outputLines.push(`<div class="day-plan-card"><h3 class="day-card-title">📅 ${parseInlineMarkdown(dayTitle)}</h3>`);
        continue;
      }

      if (insideDayCard && line.startsWith('## ')) {
        insideDayCard = false;
        outputLines.push('</div>');
      }

      // Formatting
      if (line.startsWith('# ')) {
        outputLines.push(`<h1>${parseInlineMarkdown(line.substring(2))}</h1>`);
      } else if (line.startsWith('## ')) {
        outputLines.push(`<h2>${parseInlineMarkdown(line.substring(3))}</h2>`);
      } else if (line.startsWith('### ')) {
        outputLines.push(`<h3>${parseInlineMarkdown(line.substring(4))}</h3>`);
      } else if (line.startsWith('#### ')) {
        outputLines.push(`<h4>${parseInlineMarkdown(line.substring(5))}</h4>`);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemContent = line.substring(2);
        if (isChecklist) {
          outputLines.push(`
            <label class="checklist-item">
              <input type="checkbox">
              <span>${parseInlineMarkdown(itemContent)}</span>
            </label>
          `);
        } else {
          outputLines.push(`<li>${parseDayTimeBadges(parseInlineMarkdown(itemContent))}</li>`);
        }
      } else if (line.match(/^\d+\.\s+/)) {
        const itemContent = line.replace(/^\d+\.\s+/, '');
        if (isChecklist) {
          outputLines.push(`
            <label class="checklist-item">
              <input type="checkbox">
              <span>${parseInlineMarkdown(itemContent)}</span>
            </label>
          `);
        } else {
          outputLines.push(`<li>${parseDayTimeBadges(parseInlineMarkdown(itemContent))}</li>`);
        }
      } else if (line === '') {
        outputLines.push('');
      } else {
        outputLines.push(`<p>${parseInlineMarkdown(line)}</p>`);
      }
    }

    if (insideDayCard) outputLines.push('</div>');
    if (insideTable) {
      tableHtml.push('</tbody></table>');
      outputLines.push(tableHtml.join(''));
    }

    let result = outputLines.join('\n');
    result = result.replace(/(<li>.*?<\/li>\s*)+/gs, (match) => `<ul>${match}</ul>`);
    return result;
  }

  function parseInlineMarkdown(str) {
    return str
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function parseDayTimeBadges(html) {
    return html
      .replace(/<strong>Morning:?<\/strong>/gi, '<span class="time-tag time-morning">🌅 Morning</span>')
      .replace(/<strong>Afternoon:?<\/strong>/gi, '<span class="time-tag time-afternoon">☀️ Afternoon</span>')
      .replace(/<strong>Evening:?<\/strong>/gi, '<span class="time-tag time-evening">🌙 Evening</span>')
      .replace(/<strong>Dining Recommendations:?<\/strong>/gi, '<span class="time-tag time-dining">🍴 Dining</span>')
      .replace(/<strong>Dining:?<\/strong>/gi, '<span class="time-tag time-dining">🍴 Dining</span>');
  }

  // --- Tab Switcher Logic ---
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tabKey = btn.getAttribute('data-tab');
      if (parsedSections[tabKey]) {
        itineraryContent.innerHTML = parsedSections[tabKey];
        bindChecklistEvents();
      } else if (parsedSections.all) {
        itineraryContent.innerHTML = parsedSections.all;
        bindChecklistEvents();
      }
    });
  });

  function bindChecklistEvents() {
    document.querySelectorAll('.checklist-item').forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            item.classList.add('checked');
          } else {
            item.classList.remove('checked');
          }
        });
      }
    });
  }

  // --- Form Submission Handling (Enhanced UX) ---
  travelForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dest = destinationInput.value.trim();
    if (!dest) {
      destinationInput.focus();
      showToast('Please enter a destination to proceed', '⚠️');
      return;
    }

    const days = parseInt(durationSlider.value, 10) || 5;
    const travelers = parseInt(travelersInput.value, 10) || 2;
    const selectedBudgetEl = document.querySelector('input[name="budget"]:checked');
    const budget = selectedBudgetEl ? selectedBudgetEl.value : 'Standard';
    const transport = transportSelect.value;
    const hotel = hotelSelect.value;
    const interests = getSelectedInterests();
    const notes = customNotes.value.trim();

    // 1. Upgrade Submit Button to Active Loading
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtnIcon.textContent = '✈️';
    submitBtnIcon.classList.add('spin-plane-icon');
    submitBtnText.textContent = `Architecting ${dest} Itinerary...`;

    // 2. Switch Right Panel to Flight Radar Loading
    emptyState.style.display = 'none';
    resultState.style.display = 'none';
    errorState.style.display = 'none';
    loadingState.style.display = 'flex';

    // Start Radar & Live Ticker
    startRadarProgress(dest);

    // Smooth scroll directly to the radar card
    loadingState.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          destination: dest,
          days,
          travelers,
          budget,
          transport,
          hotel,
          interests,
          notes
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to generate itinerary');
      }

      const data = await response.json();
      currentRawMarkdown = data.itinerary;
      currentDestinationName = data.destination;

      // 3. Complete Radar Progress
      finishRadarProgress();

      // 4. Populate Showcase Header & Badges
      showcaseDestTitle.textContent = `${data.days}-Day Journey to ${data.destination}`;
      metaDestBadge.textContent = `📍 ${data.destination}`;
      metaDurationBadge.textContent = `⏱️ ${data.days} Days`;
      metaTravelersBadge.textContent = `👥 ${data.travelers} Travelers`;
      metaBudgetBadge.textContent = `💎 ${data.budget}`;
      metaTransportBadge.textContent = `🚀 ${data.transport}`;
      metaHotelBadge.textContent = `🏨 ${data.hotel}`;

      // Google Maps Direct Link
      mapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.destination)}`;

      // 5. Parse Sections for Tab System
      parsedSections = parseMarkdown(data.itinerary);
      itineraryContent.innerHTML = parsedSections.all;
      bindChecklistEvents();

      // Reset Tab to 'Complete Plan'
      tabBtns.forEach(b => b.classList.remove('active'));
      const allTab = document.querySelector('.tab-btn[data-tab="all"]');
      if (allTab) allTab.classList.add('active');

      // 6. Reveal with Celebration
      loadingState.style.display = 'none';
      resultState.style.display = 'block';

      // Confetti & Toast
      fireConfetti();
      showToast(`Your dream trip to ${data.destination} is ready!`, '🎉', 4000);

      // Smooth scroll to top of itinerary
      resultState.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
      if (progressTimer) clearInterval(progressTimer);
      if (factTimer) clearInterval(factTimer);
      console.error(err);

      loadingState.style.display = 'none';
      errorMessageText.textContent = err.message || 'An error occurred while communicating with the AI concierge.';
      errorState.style.display = 'flex';
      showToast('Generation failed. Please try again.', '❌');
    } finally {
      // Restore Submit Button
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtnIcon.textContent = '🚀';
      submitBtnIcon.classList.remove('spin-plane-icon');
      submitBtnText.textContent = 'Generate AI Travel Plan';
    }
  });

  retryBtn.addEventListener('click', () => {
    travelForm.dispatchEvent(new Event('submit'));
  });

  // --- Quick Action Handlers ---
  copyBtn.addEventListener('click', async () => {
    if (!currentRawMarkdown) return;
    try {
      await navigator.clipboard.writeText(currentRawMarkdown);
      showToast('Itinerary markdown copied to clipboard!', '📋');
    } catch {
      showToast('Unable to copy to clipboard', '⚠️');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!currentRawMarkdown) return;
    const blob = new Blob([currentRawMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = currentDestinationName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `${safeName}_itinerary.md`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Saved markdown file!', '💾');
  });

  printBtn.addEventListener('click', () => {
    window.print();
  });

  planAnotherBtn.addEventListener('click', () => {
    destinationInput.value = '';
    updateClearBtnVisibility();
    destinationInput.focus();
    destinationInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Ready for your next destination!', '✈️');
  });

  // Initialize
  updateDurationDisplay(durationSlider.value);
  updateTravelerType(parseInt(travelersInput.value, 10) || 2);
  loadPopularDestinations();
});
