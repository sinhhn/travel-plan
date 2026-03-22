// ===== MAIN UI =====
let currentPlan = 'A';
let currentDay = 0;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Read URL param
  const urlParams = new URLSearchParams(window.location.search);
  const planParam = urlParams.get('plan');
  if (planParam && PLANS[planParam.toUpperCase()]) {
    currentPlan = planParam.toUpperCase();
  }

  renderNavPills();
  renderPlanCards();
  renderPlanDetail(currentPlan);
  renderComparison();
  renderEssentials();
  initNavScroll();
  initScrollReveal();
});

// ===== NAV =====
function renderNavPills() {
  const container = document.getElementById('nav-pills');
  container.innerHTML = ['A', 'B', 'C'].map(id => `
    <button class="nav__pill ${id === currentPlan ? 'active' : ''}"
            data-plan="${id}"
            onclick="selectPlan('${id}')"
            aria-label="Plan ${id}">
      ${id}
    </button>
  `).join('');
}

function initNavScroll() {
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');

  const observer = new IntersectionObserver(([entry]) => {
    nav.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0.1 });

  observer.observe(hero);
}

// ===== PLAN CARDS =====
function renderPlanCards() {
  const container = document.getElementById('plan-cards');
  container.innerHTML = ['A', 'B', 'C'].map(id => {
    const plan = PLANS[id];
    return `
      <div class="plan-card ${id === currentPlan ? 'selected' : ''}"
           data-plan="${id}"
           onclick="selectPlan('${id}')"
           tabindex="0"
           role="button"
           aria-pressed="${id === currentPlan}">
        <span class="plan-card__index">${id}</span>
        <span class="plan-card__selected-badge">✓ ĐÃ CHỌN</span>
        <p class="plan-card__label">Plan ${id}</p>
        <h3 class="plan-card__name">${plan.name}</h3>
        <p class="plan-card__route">${plan.route}</p>
        <div class="plan-card__highlights">
          ${plan.highlights.map(h => `
            <div class="plan-card__highlight">
              <span>${h.icon}</span>
              <span>${h.text}</span>
            </div>
          `).join('')}
        </div>
        <div class="plan-card__cta">
          ${id === currentPlan ? '✓ ĐÃ CHỌN' : '● CHỌN PLAN NÀY'}
        </div>
      </div>
    `;
  }).join('');
}

// ===== SELECT PLAN =====
function selectPlan(planId) {
  if (planId === currentPlan) return;
  currentPlan = planId;
  currentDay = 0;

  // Update URL
  const url = new URL(window.location);
  url.searchParams.set('plan', planId);
  history.replaceState(null, '', url);

  // Update cards
  renderPlanCards();
  renderNavPills();

  // Fade transition for detail
  const detail = document.getElementById('plan-detail-content');
  detail.classList.add('fading');

  setTimeout(() => {
    renderPlanDetail(planId);
    detail.classList.remove('fading');
    initScrollReveal();
  }, 300);

  // Scroll to detail
  document.getElementById('plan-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== PLAN DETAIL =====
function renderPlanDetail(planId) {
  const plan = PLANS[planId];
  const container = document.getElementById('plan-detail-content');

  container.innerHTML = `
    <div class="section-header">
      <p class="section-header__label">Plan ${planId}</p>
      <h2 class="section-header__title">${plan.name}</h2>
      <p class="text-secondary" style="margin-top: var(--space-sm); font-style: italic;">${plan.subtitle}</p>
    </div>

    <!-- Day Tabs -->
    <div class="day-tabs" id="day-tabs" style="--plan-color: ${plan.color}">
      ${plan.days.map((day, i) => `
        <button class="day-tab ${i === currentDay ? 'active' : ''}"
                onclick="switchDay(${i})"
                style="--plan-color: ${plan.color}">
          ${day.title}
        </button>
      `).join('')}
    </div>

    <!-- Layout: Timeline + Sidebar -->
    <div class="plan-detail__layout">
      <div class="plan-detail__timeline-wrapper">
        <p class="font-mono text-secondary" style="margin-bottom: var(--space-lg);">
          ${plan.days[currentDay].subtitle}
        </p>
        <div class="timeline" id="timeline" style="--plan-color: ${plan.color}">
          <div class="timeline__line"></div>
          ${renderTimeline(plan.days[currentDay].stops, plan.color)}
        </div>
      </div>

      <!-- Sidebar: Cost + Weather -->
      <div>
        ${renderCostBreakdown(planId)}
        ${renderWeatherWidget()}
        ${renderShareButton(planId)}
      </div>
    </div>
  `;
}

// ===== SWITCH DAY =====
function switchDay(dayIndex) {
  currentDay = dayIndex;
  renderPlanDetail(currentPlan);
  initScrollReveal();
}

// ===== TIMELINE =====
function renderTimeline(stops, color) {
  return stops.map(stop => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`;
    return `
      <div class="stop-card" id="stop-${stop.id}">
        <div class="stop-card__dot ${stop.type}" style="background: ${color}; ${stop.type === 'major' ? `box-shadow: 0 0 0 4px ${color}33;` : ''}"></div>
        <div class="stop-card__header">
          <span>${stop.arrivalTime}</span>
          ${stop.duration ? `<span>🕐 ${stop.duration >= 60 ? Math.floor(stop.duration / 60) + 'h' + (stop.duration % 60 ? stop.duration % 60 + 'ph' : '') : stop.duration + 'ph'}</span>` : ''}
        </div>
        <h3 class="stop-card__name">${stop.name}</h3>
        ${stop.description ? `<p class="stop-card__description">${stop.description}</p>` : ''}
        <div class="stop-card__meta">
          ${stop.food ? `<span class="stop-card__meta-item">🍜 ${stop.food}</span>` : ''}
          ${stop.weather ? `<span class="stop-card__meta-item">🌡️ ${stop.weather}</span>` : ''}
          ${stop.tips ? `<span class="stop-card__meta-item">💡 ${stop.tips}</span>` : ''}
        </div>
        <div class="stop-card__actions">
          <a href="${mapsUrl}" target="_blank" rel="noopener" class="stop-card__link">
            📍 Mở trong Google Maps
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// ===== COST BREAKDOWN =====
function renderCostBreakdown(planId) {
  const plan = PLANS[planId];
  return `
    <div class="cost-breakdown">
      <div class="cost-breakdown__title">💰 Chi phí ước tính — Plan ${planId} (10 người)</div>
      ${plan.cost.items.map(item => `
        <div class="cost-breakdown__row">
          <span>${item.label}</span>
          <span class="font-mono">${item.amount}</span>
        </div>
      `).join('')}
      <div class="cost-breakdown__total">
        <span>TỔNG</span>
        <span>${plan.cost.total}</span>
      </div>
      <div class="cost-breakdown__per-person">
        Mỗi người: ${plan.cost.perPerson}
      </div>
    </div>
  `;
}

// ===== WEATHER WIDGET =====
function renderWeatherWidget() {
  return `
    <div class="weather-widget">
      <div class="weather-widget__title">🌡️ Dự báo tháng 5</div>
      ${WEATHER.map(w => `
        <div class="weather-widget__row">
          <span>${w.location}</span>
          <span class="font-mono">${w.temp} ${w.icon}</span>
        </div>
      `).join('')}
    </div>
  `;
}

// ===== SHARE =====
function renderShareButton(planId) {
  return `
    <button class="share-btn" onclick="shareTrip('${planId}')">
      📤 Chia sẻ Plan ${planId}
    </button>
  `;
}

async function shareTrip(planId) {
  const url = `${window.location.origin}${window.location.pathname}?plan=${planId}`;
  const text = `黒部富山旅行 GW 2026 — Plan ${planId}: ${PLANS[planId].name}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: text, url });
    } catch {
      // User cancelled
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      showToast('Đã copy link!');
    } catch {
      showToast('Không thể copy link');
    }
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== COMPARISON =====
function renderComparison() {
  const table = document.getElementById('comparison-table');
  table.innerHTML = `
    <thead>
      <tr>
        <th></th>
        <th data-plan="A">Plan A 🏔️</th>
        <th data-plan="B">Plan B ♨️</th>
        <th data-plan="C">Plan C 🏯</th>
      </tr>
    </thead>
    <tbody>
      ${COMPARISON.map(row => `
        <tr>
          <td>${row.label}</td>
          <td><span class="pill pill--${row.A.type}">${row.A.text}</span></td>
          <td><span class="pill pill--${row.B.type}">${row.B.text}</span></td>
          <td><span class="pill pill--${row.C.type}">${row.C.text}</span></td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

// ===== ESSENTIALS =====
const ESSENTIALS_TABS = [
  { id: 'checklist', label: '🎒 Đồ cần mang' },
  { id: 'links', label: '📱 Links hữu ích' },
  { id: 'food', label: '🍜 Ăn gì ở đâu' },
];

function renderEssentials() {
  const tabsContainer = document.getElementById('essentials-tabs');
  const panelsContainer = document.getElementById('essentials-panels');

  tabsContainer.innerHTML = ESSENTIALS_TABS.map((tab, i) => `
    <button class="essentials-tab ${i === 0 ? 'active' : ''}"
            onclick="switchEssentialsTab('${tab.id}')"
            data-tab="${tab.id}">
      ${tab.label}
    </button>
  `).join('');

  panelsContainer.innerHTML = `
    <div class="essentials-panel active" id="panel-checklist">
      <div id="checklist-panel"></div>
    </div>
    <div class="essentials-panel" id="panel-links">
      <div class="links-list">
        ${USEFUL_LINKS.map(link => `
          <a href="${link.url}" target="_blank" rel="noopener" class="link-item">
            <span class="link-item__icon">${link.icon}</span>
            <div class="link-item__text">
              <div class="link-item__name">${link.name}</div>
              <div class="link-item__desc">${link.desc}</div>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
    <div class="essentials-panel" id="panel-food">
      <div class="food-list">
        ${FOOD_GUIDE.map(food => `
          <div class="food-item">
            <span class="food-item__emoji">${food.emoji}</span>
            <div>
              <div class="food-item__name">${food.name}</div>
              <div class="food-item__desc">${food.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  renderChecklist();
}

function switchEssentialsTab(tabId) {
  document.querySelectorAll('.essentials-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.essentials-panel').forEach(p => p.classList.remove('active'));

  document.querySelector(`.essentials-tab[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById(`panel-${tabId}`).classList.add('active');
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.stop-card').forEach(card => {
    observer.observe(card);
  });
}
