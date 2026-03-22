// ===== MAIN UI =====
let currentPlan = 'A';
let currentDay = 0;

// ===== DAY DESCRIPTIONS =====
const DAY_DESCRIPTIONS = {
  A: [
    'Xuất phát 6h sáng từ Tokyo, khám phá làng gassho UNESCO tại 五箇山 — yên tĩnh hơn 白川郷. Chiều check-in HOTEL R9 The Yard Kurobe.',
    'Ngày đỉnh cao — Alpine Route: tường tuyết 15m tại Murodo, đập Kurobe hùng vĩ. Chiều trolley hẻm núi Kurobe. Ngày rất dài và đáng nhớ!',
    'Rời Kurobe sớm 8h sáng, về Tokyo trước tắc chiều GW. Trolley đã đi hôm qua!',
  ],
  B: [
    'Xuất phát 6h sáng. Làng gassho 白川郷 nổi tiếng nhất thế giới. Chiều tản bộ Kansui Park ngắm hoàng hôn. Check-in HOTEL R9 Kurobe.',
    'Thủy cung Uozu cho các bé buổi sáng. Trưa trolley qua hẻm núi Kurobe. Chiều tản bộ phố onsen Unazuki.',
    'Bảo tàng TAD — rooftop playground miễn phí cho trẻ em. Rời sớm về Tokyo tránh tắc GW.',
  ],
  C: [
    'Xuất phát 6h sáng hướng Nagano tránh tắc GW. Matsumoto Castle sáng, Kurobe Dam chiều. Check-in HOTEL R9 Kurobe.',
    'Alpine Route: tường tuyết Murodo buổi sáng. Chiều trolley hẻm núi Kurobe. Về HOTEL R9 nghỉ ngơi.',
    'Ghé nhanh 五箇山 sáng sớm — yên tĩnh, ít khách. Về Tokyo qua Hokuriku, ít tắc hơn Plan A/B.',
  ],
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
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

  const url = new URL(window.location);
  url.searchParams.set('plan', planId);
  history.replaceState(null, '', url);

  renderPlanCards();
  renderNavPills();
  renderPlanDetail(planId);

  document.getElementById('plan-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== PLAN DETAIL (Map + Panel split view) =====
function renderPlanDetail(planId) {
  const plan = PLANS[planId];
  const day = plan.days[currentDay];
  const container = document.getElementById('plan-detail-content');
  const mapUrl = getMapEmbedUrl(day.stops);
  const routeUrl = getRouteUrl(day.stops);
  const desc = DAY_DESCRIPTIONS[planId]?.[currentDay] || '';

  container.innerHTML = `
    <div class="container" style="margin-bottom: var(--space-xl)">
      <div class="section-header">
        <p class="section-header__label">Plan ${planId}</p>
        <h2 class="section-header__title">${plan.name}</h2>
        <p class="text-secondary" style="margin-top: var(--space-sm); font-style: italic;">${plan.subtitle}</p>
      </div>
    </div>

    <div class="plan-viewer" style="--plan-color: ${plan.color}">
      <!-- Map -->
      <div class="plan-viewer__map">
        <div class="plan-viewer__day-tabs">
          ${plan.days.map((d, i) => `
            <button class="plan-viewer__day-tab ${i === currentDay ? 'active' : ''}"
                    onclick="switchDay(${i})">
              Day ${d.dayNum}
            </button>
          `).join('')}
        </div>
        <iframe class="plan-viewer__iframe"
                src="${mapUrl}"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Route map for ${day.title}"></iframe>
      </div>

      <!-- Itinerary Panel -->
      <div class="plan-viewer__panel">
        <div class="plan-viewer__header">
          <h2>${day.title} — ${day.subtitle}</h2>
          <p>${desc}</p>
          <div class="plan-viewer__actions">
            <a href="${routeUrl}" target="_blank" rel="noopener" class="plan-viewer__btn">
              📍 Open route
            </a>
            <button class="plan-viewer__btn" onclick="copyRoute('${planId}')">
              📋 Copy
            </button>
          </div>
        </div>

        <div class="plan-viewer__itinerary">
          ${renderItinerary(day.stops, plan.color)}
        </div>

        <div class="plan-viewer__extras">
          ${renderCostBreakdown(planId)}
          ${renderWeatherWidget()}
        </div>
      </div>
    </div>
  `;
}

// ===== SWITCH DAY =====
function switchDay(dayIndex) {
  currentDay = dayIndex;
  renderPlanDetail(currentPlan);
}

// ===== MAP HELPERS =====
function getMapEmbedUrl(stops) {
  const points = stops.filter(s => s.lat && s.lng);
  if (points.length === 0) return '';
  if (points.length === 1) {
    return `https://maps.google.com/maps?q=${points[0].lat},${points[0].lng}&z=10&output=embed`;
  }
  const origin = `${points[0].lat},${points[0].lng}`;
  const waypoints = points.slice(1).map(s => `${s.lat},${s.lng}`).join('+to:');
  return `https://maps.google.com/maps?saddr=${origin}&daddr=${waypoints}&output=embed`;
}

function getRouteUrl(stops) {
  const points = stops.filter(s => s.lat && s.lng);
  return `https://www.google.com/maps/dir/${points.map(s => `${s.lat},${s.lng}`).join('/')}/`;
}

// ===== ITINERARY =====
function getPeriod(time) {
  const hour = parseInt(time.split(':')[0]);
  if (hour < 12) return 'Sáng';
  if (hour < 17) return 'Chiều';
  return 'Tối';
}

function formatTime(time) {
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const suffix = hour < 12 ? 'AM' : 'PM';
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${display}:${m} ${suffix}`;
}

function renderItinerary(stops, color) {
  const groups = [];
  let current = null;

  stops.forEach((stop, i) => {
    const period = getPeriod(stop.arrivalTime);
    if (!current || current.period !== period) {
      current = { period, stops: [] };
      groups.push(current);
    }
    current.stops.push({ ...stop, index: i + 1 });
  });

  return groups.map(group => `
    <div class="itinerary-group">
      <h4 class="itinerary-group__title">${group.period}</h4>
      ${group.stops.map(stop => {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`;
        return `
          <a href="${mapsUrl}" target="_blank" rel="noopener" class="itinerary-stop">
            <div class="itinerary-stop__marker ${stop.type}" style="background: ${color}">
              ${stop.index}
            </div>
            <div class="itinerary-stop__info">
              <span class="itinerary-stop__time">${formatTime(stop.arrivalTime)}</span>
              <h4 class="itinerary-stop__name">${stop.name}</h4>
              ${stop.food ? `<div class="itinerary-stop__meta">🍜 ${stop.food}</div>` : ''}
              ${stop.duration ? `<div class="itinerary-stop__meta">🕐 ${stop.duration >= 60 ? Math.floor(stop.duration / 60) + 'h' + (stop.duration % 60 ? stop.duration % 60 + 'min' : '') : stop.duration + ' phút'}</div>` : ''}
              <p class="itinerary-stop__desc">${stop.description || ''}</p>
            </div>
          </a>
        `;
      }).join('')}
    </div>
  `).join('');
}

// ===== COST BREAKDOWN =====
function renderCostBreakdown(planId) {
  const plan = PLANS[planId];
  return `
    <div class="cost-breakdown">
      <div class="cost-breakdown__title">💰 Chi phí ước tính (10 người)</div>
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

// ===== SHARE & COPY =====
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

async function copyRoute(planId) {
  const plan = PLANS[planId];
  const day = plan.days[currentDay];
  const text = `${day.title} — ${day.subtitle}\n` +
    day.stops.map(s => `${s.arrivalTime} ${s.name}`).join('\n') +
    `\n\n${getRouteUrl(day.stops)}`;

  try {
    await navigator.clipboard.writeText(text);
    showToast('Đã copy lịch trình!');
  } catch {
    showToast('Không thể copy');
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
