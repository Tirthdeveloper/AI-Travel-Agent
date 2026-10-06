/**
 * VoyageAI - Intelligent Travel Planner
 * Modern Vanilla JavaScript Frontend Controller
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
  const submitBtn = document.getElementById('submitBtn');

  // Hub & Display Elements
  const destinationsGrid = document.getElementById('destinationsGrid');
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  const resultState = document.getElementById('resultState');
  const errorState = document.getElementById('errorState');
  const loadingStatusText = document.getElementById('loadingStatusText');
  const loadingProgressBar = document.getElementById('loadingProgressBar');
  const itineraryContent = document.getElementById('itineraryContent');
  const errorMessageText = document.getElementById('errorMessageText');
  const retryBtn = document.getElementById('retryBtn');

  // Action Buttons & Badges
  const metaDestBadge = document.getElementById('metaDestBadge');
  const metaDurationBadge = document.getElementById('metaDurationBadge');
  const metaTravelersBadge = document.getElementById('metaTravelersBadge');
  const metaBudgetBadge = document.getElementById('metaBudgetBadge');
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const printBtn = document.getElementById('printBtn');
  const planAnotherBtn = document.getElementById('planAnotherBtn');

  // Theme & Toast
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMessage = document.getElementById('toastMessage');

  let currentRawMarkdown = '';
  let currentDestinationName = 'Trip';

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

  // --- Toast Utility ---
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

    // Budget selection
    budgetCards.forEach(c => {
      const radio = c.querySelector('input[type="radio"]');
      if (radio && radio.value.toLowerCase() === item.budget.toLowerCase()) {
        c.classList.add('selected');
        radio.checked = true;
      } else {
        c.classList.remove('selected');
      }
    });

    // Transport & Hotel
    if (item.transport) transportSelect.value = item.transport;
    if (item.hotel) hotelSelect.value = item.hotel;

    // Interests
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

    showToast(`Loaded ${item.name} plan template!`, item.emoji);
    destinationInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // --- Lightweight & Robust Markdown Parser ---
  function parseMarkdownToHTML(md) {
    if (!md) return '';

    // Normalize line breaks
    let text = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Headers
    // Detect Day headers e.g. "### Day 1: [Theme]" and transform them into day cards
    const lines = text.split('\n');
    let outputLines = [];
    let insideDayCard = false;
    let insideTable = false;
    let tableHtml = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // Check for Table rows
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!insideTable) {
          insideTable = true;
          tableHtml = ['<table><tbody>'];
        }

        const cells = line.split('|').map(c => c.trim()).slice(1, -1);
        // Check if it's separator row like |---|---|
        if (cells.every(c => /^[-:]+$/.test(c))) {
          // Turn first row into header
          if (tableHtml.length === 2) {
            tableHtml[1] = tableHtml[1].replace(/<td/g, '<th').replace(/<\/td>/g, '</th>');
          }
          continue;
        }

        const rowHtml = '<tr>' + cells.map(c => `<td>${parseInlineMarkdown(c)}</td>`).join('') + '</tr>';
        tableHtml.push(rowHtml);
        continue;
      } else if (insideTable) {
        insideTable = false;
        tableHtml.push('</tbody></table>');
        outputLines.push(tableHtml.join(''));
        tableHtml = [];
      }

      // Day section detection
      if (line.match(/^###\s+(Day\s+\d+.*)/i)) {
        if (insideDayCard) {
          outputLines.push('</div>'); // Close previous day card
        }
        insideDayCard = true;
        const dayTitle = line.replace(/^###\s+/, '');
        outputLines.push(`<div class="day-plan-card"><h3 class="day-card-title">📅 ${parseInlineMarkdown(dayTitle)}</h3>`);
        continue;
      }

      // Close day card if encountering a new main section
      if (insideDayCard && line.startsWith('## ')) {
        insideDayCard = false;
        outputLines.push('</div>');
      }

      // Other headers
      if (line.startsWith('# ')) {
        outputLines.push(`<h1>${parseInlineMarkdown(line.substring(2))}</h1>`);
      } else if (line.startsWith('## ')) {
        outputLines.push(`<h2>${parseInlineMarkdown(line.substring(3))}</h2>`);
      } else if (line.startsWith('### ')) {
        outputLines.push(`<h3>${parseInlineMarkdown(line.substring(4))}</h3>`);
      } else if (line.startsWith('#### ')) {
        outputLines.push(`<h4>${parseInlineMarkdown(line.substring(5))}</h4>`);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        outputLines.push(`<li>${parseInlineMarkdown(line.substring(2))}</li>`);
      } else if (line.match(/^\d+\.\s+/)) {
        outputLines.push(`<li>${parseInlineMarkdown(line.replace(/^\d+\.\s+/, ''))}</li>`);
      } else if (line === '') {
        outputLines.push('');
      } else {
        outputLines.push(`<p>${parseInlineMarkdown(line)}</p>`);
      }
    }

    if (insideDayCard) {
      outputLines.push('</div>');
    }
    if (insideTable) {
      tableHtml.push('</tbody></table>');
      outputLines.push(tableHtml.join(''));
    }

    // Wrap adjacent <li> in <ul>
    let result = outputLines.join('\n');
    result = result.replace(/(<li>.*?<\/li>\s*)+/gs, (match) => `<ul>${match}</ul>`);

    return result;
  }

  function parseInlineMarkdown(str) {
    return str
      // Bold + Italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  // --- Step Simulation for Loading State ---
  let stepInterval = null;
  function startLoadingSteps() {
    const steps = [
      { id: 'step1', text: 'Connecting to Groq AI Planner...', progress: 25 },
      { id: 'step2', text: 'Searching attractions with Google Serper...', progress: 50 },
      { id: 'step3', text: 'Structuring day-by-day morning, afternoon & evening schedule...', progress: 75 },
      { id: 'step4', text: 'Finalizing transit options, hotel picks & budget calculation...', progress: 90 },
    ];

    let currentStep = 0;
    loadingProgressBar.style.width = '15%';

    // Reset steps
    steps.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) {
        el.className = 'step-item';
      }
    });

    const activateStep = (idx) => {
      steps.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        if (i < idx) {
          el.className = 'step-item completed';
        } else if (i === idx) {
          el.className = 'step-item active';
          loadingStatusText.textContent = s.text;
          loadingProgressBar.style.width = `${s.progress}%`;
        } else {
          el.className = 'step-item';
        }
      });
    };

    activateStep(0);

    stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        activateStep(currentStep);
      } else {
        clearInterval(stepInterval);
      }
    }, 3800);
  }

  function stopLoadingSteps() {
    if (stepInterval) clearInterval(stepInterval);
    loadingProgressBar.style.width = '100%';
  }

  // --- Form Submission Handling ---
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

    // Set UI to loading
    emptyState.style.display = 'none';
    resultState.style.display = 'none';
    errorState.style.display = 'none';
    loadingState.style.display = 'flex';
    submitBtn.disabled = true;
    startLoadingSteps();

    // Smooth scroll to results
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

      stopLoadingSteps();

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to generate itinerary');
      }

      const data = await response.json();
      currentRawMarkdown = data.itinerary;
      currentDestinationName = data.destination;

      // Update header summary badges
      metaDestBadge.textContent = `📍 ${data.destination}`;
      metaDurationBadge.textContent = `⏱️ ${data.days} Days`;
      metaTravelersBadge.textContent = `👥 ${data.travelers} Travelers`;
      metaBudgetBadge.textContent = `💎 ${data.budget}`;

      // Render Markdown into UI
      itineraryContent.innerHTML = parseMarkdownToHTML(data.itinerary);

      loadingState.style.display = 'none';
      resultState.style.display = 'block';
      showToast('Your custom itinerary is ready!', '🎉');

      // Scroll to view
      resultState.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
      stopLoadingSteps();
      console.error(err);
      loadingState.style.display = 'none';
      errorMessageText.textContent = err.message || 'An error occurred while connecting to the AI agent.';
      errorState.style.display = 'flex';
      showToast('Generation failed. Please try again.', '❌');
    } finally {
      submitBtn.disabled = false;
    }
  });

  retryBtn.addEventListener('click', () => {
    travelForm.dispatchEvent(new Event('submit'));
  });

  // --- Quick Action Handlers ---
  // 1. Copy Markdown
  copyBtn.addEventListener('click', async () => {
    if (!currentRawMarkdown) return;
    try {
      await navigator.clipboard.writeText(currentRawMarkdown);
      showToast('Itinerary copied to clipboard!', '📋');
    } catch {
      showToast('Unable to copy to clipboard', '⚠️');
    }
  });

  // 2. Download .md File
  downloadBtn.addEventListener('click', () => {
    if (!currentRawMarkdown) return;
    const blob = new Blob([currentRawMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = currentDestinationName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.href = url;
    a.download = `${safeName}_itinerary.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded markdown file!', '💾');
  });

  // 3. Print / PDF
  printBtn.addEventListener('click', () => {
    window.print();
  });

  // 4. Plan Another Trip
  planAnotherBtn.addEventListener('click', () => {
    destinationInput.value = '';
    updateClearBtnVisibility();
    destinationInput.focus();
    destinationInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Enter your next destination!', '✈️');
  });

  // Initial loads
  updateDurationDisplay(durationSlider.value);
  updateTravelerType(parseInt(travelersInput.value, 10) || 2);
  loadPopularDestinations();
});
