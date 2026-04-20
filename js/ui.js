// ===== MAIN UI =====
let currentPlan = 'A';
let currentDay = 0;

// ===== DAY DESCRIPTIONS =====
const DAY_DESCRIPTIONS = {
  A: [
    '3 xe tập kết nhà anh Hà 6h sáng. Đi 上信越道+北陸道, ghé 五箇山 UNESCO trên đường — yên tĩnh, ít đông. Chiều check-in HOTEL R9.',
    'Ngày đỉnh cao — Alpine Route: tường tuyết 15m tại Murodo + đập Kurobe. Chiều trolley hẻm núi. Ngày rất dài và đáng nhớ!',
    'Sáng 環水公園 + TAD rooftop playground. Chiều nghỉ tránh Uターンラッシュ. Về Tokyo sau 19:00 qua 関越道 — đường thông.',
  ],
  B: [
    '3 xe tập kết nhà anh Hà 6h sáng. Đi 関越道+北陸道 (dễ nhất). Chiều ghé 魚津水族館 + ミラージュランド gần hotel.',
    'Trolley hẻm núi sáng → 宇奈月温泉 tắm chân → ヒスイ海岸 săn đá ngọc bích. Tất cả gần hotel, không vội.',
    'TAD rooftop + 環水公園 Starbucks đẹp nhất Nhật Bản. Chiều nghỉ tránh tắc. Về Tokyo sau 19:00.',
  ],
  C: [
    '3 xe tập kết 6h sáng. Đi 中央道 → 松本城 sáng sớm (tránh đông). Chiều lái qua Alps (大町→Hakuba) — cảnh đẹp nhất trip!',
    'Alpine Route: tường tuyết Murodo buổi sáng. Chiều trolley hẻm núi Kurobe. Về HOTEL R9 nghỉ ngơi.',
    '魚津水族館 sáng + ヒスイ海岸 săn ngọc. Chiều nghỉ. Về Tokyo sau 19:00 qua 関越道 (khác đường đi 中央道).',
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
  initCarouselSnap();
});

// ===== NAV =====
function renderNavPills() {
  const container = document.getElementById('nav-pills');
  container.innerHTML = Object.keys(PLANS).map(id => `
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

// ===== PLAN CARDS (carousel on mobile) =====
function renderPlanCards() {
  const container = document.getElementById('plan-cards');
  const planIds = Object.keys(PLANS);
  container.innerHTML = planIds.map(id => {
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

  // Render carousel dots
  const dotsContainer = document.getElementById('plan-carousel-dots');
  dotsContainer.innerHTML = planIds.map(id =>
    `<span class="plan-carousel__dot ${id === currentPlan ? 'active' : ''}" data-plan="${id}" onclick="selectPlan('${id}')"></span>`
  ).join('');

  // Scroll selected card into view in carousel
  requestAnimationFrame(() => {
    const selected = container.querySelector('.plan-card.selected');
    if (selected) {
      selected.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });

  // Render gallery below cards
  renderPlanGallery();
}

// Carousel snap → auto-select plan
function initCarouselSnap() {
  const container = document.getElementById('plan-cards');
  let snapTimer = null;

  container.addEventListener('scrollend', () => {
    const cards = container.querySelectorAll('.plan-card');
    const containerRect = container.getBoundingClientRect();
    const center = containerRect.left + containerRect.width / 2;

    let closest = null;
    let minDist = Infinity;
    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < minDist) {
        minDist = dist;
        closest = card;
      }
    });

    if (closest) {
      const planId = closest.dataset.plan;
      if (planId !== currentPlan) {
        selectPlan(planId);
      }
    }
  });

  // Fallback for browsers without scrollend
  container.addEventListener('scroll', () => {
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      container.dispatchEvent(new Event('scrollend'));
    }, 150);
  }, { passive: true });
}

// ===== PLAN GALLERY (below cards, synced) =====
function renderPlanGallery() {
  const container = document.getElementById('plan-gallery');
  const plan = PLANS[currentPlan];

  if (!plan.gallery || plan.gallery.length === 0) {
    container.innerHTML = '';
    return;
  }

  galleryIndex = 0;
  const gallery = plan.gallery;

  container.innerHTML = `
    <div class="gallery-slideshow" id="gallery-slideshow">
      <div class="gallery-slideshow__viewport">
        <button class="gallery-slideshow__arrow gallery-slideshow__arrow--prev" onclick="slideGallery(-1)" aria-label="Previous">‹</button>
        <div class="gallery-slideshow__track" id="gallery-track">
          ${gallery.map((img, i) => `
            <div class="gallery-slideshow__slide ${i === 0 ? 'active' : ''}">
              <img src="${img.src}" alt="${img.caption}" loading="${i < 2 ? 'eager' : 'lazy'}">
            </div>
          `).join('')}
        </div>
        <button class="gallery-slideshow__arrow gallery-slideshow__arrow--next" onclick="slideGallery(1)" aria-label="Next">›</button>
      </div>
      <div class="gallery-slideshow__info">
        <div class="gallery-slideshow__caption" id="gallery-caption">${gallery[0].caption}</div>
        <div class="gallery-slideshow__spot" id="gallery-spot">📍 ${gallery[0].spot}</div>
      </div>
      <div class="gallery-slideshow__dots" id="gallery-dots">
        ${gallery.map((_, i) => `<span class="gallery-slideshow__dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></span>`).join('')}
      </div>
    </div>
  `;
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
        <div class="plan-viewer__sticky-tabs">
          ${plan.days.map((d, i) => `
            <button class="plan-viewer__sticky-tab ${i === currentDay ? 'active' : ''}"
                    onclick="switchDay(${i})">
              Day ${d.dayNum}
              <span class="plan-viewer__sticky-tab-date">${d.title.split('—')[1]?.trim() || ''}</span>
            </button>
          `).join('')}
        </div>
        <div class="plan-viewer__header">
          <h2>${day.title} — ${day.subtitle}</h2>
          <p>${desc}</p>
          ${currentDay === 0 && plan.routeGo ? `<div style="margin-top: 8px; font-size: 0.75rem; color: rgba(255,255,255,0.5);">🚗 ${plan.routeGo}</div>` : ''}
          ${currentDay === plan.days.length - 1 && plan.routeReturn ? `<div style="margin-top: 8px; font-size: 0.75rem; color: rgba(255,255,255,0.5);">🔙 ${plan.routeReturn}</div>` : ''}
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
          ${renderSpecialties(planId, currentDay)}
          ${renderDistances(planId, currentDay)}
          ${renderRouteOptions(planId)}
          ${renderWeatherWidget()}
        </div>
      </div>
    </div>
  `;

  // Fetch real-time weather after DOM update
  setTimeout(() => afterRenderPlanDetail(), 100);
}

// ===== SWITCH DAY =====
function switchDay(dayIndex) {
  currentDay = dayIndex;
  renderPlanDetail(currentPlan);
}

// After render, fetch weather
function afterRenderPlanDetail() {
  updateWeatherWidget(currentPlan, currentDay);
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

// ===== GALLERY SLIDESHOW =====
let galleryIndex = 0;

function slideGallery(direction) {
  const plan = PLANS[currentPlan];
  if (!plan.gallery || plan.gallery.length === 0) return;

  galleryIndex = (galleryIndex + direction + plan.gallery.length) % plan.gallery.length;
  updateGallerySlide();
}

function goToSlide(index) {
  galleryIndex = index;
  updateGallerySlide();
}

function updateGallerySlide() {
  const plan = PLANS[currentPlan];
  const item = plan.gallery[galleryIndex];
  const track = document.getElementById('gallery-track');
  const caption = document.getElementById('gallery-caption');
  const spot = document.getElementById('gallery-spot');
  const dots = document.querySelectorAll('.gallery-slideshow__dot');
  const slides = document.querySelectorAll('.gallery-slideshow__slide');

  if (!track) return;

  track.style.transform = `translateX(-${galleryIndex * 100}%)`;
  caption.textContent = item.caption;
  spot.textContent = '📍 ' + item.spot;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === galleryIndex));
  slides.forEach((s, i) => s.classList.toggle('active', i === galleryIndex));
}

// Swipe support for gallery
document.addEventListener('touchstart', handleGalleryTouchStart, { passive: true });
document.addEventListener('touchend', handleGalleryTouchEnd, { passive: true });

let galleryTouchStartX = 0;
function handleGalleryTouchStart(e) {
  const slideshow = document.getElementById('gallery-slideshow');
  if (!slideshow || !slideshow.contains(e.target)) return;
  galleryTouchStartX = e.changedTouches[0].screenX;
}
function handleGalleryTouchEnd(e) {
  const slideshow = document.getElementById('gallery-slideshow');
  if (!slideshow || !slideshow.contains(e.target)) return;
  const diff = galleryTouchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    slideGallery(diff > 0 ? 1 : -1);
  }
}

// ===== SPECIALTIES =====
function renderSpecialties(planId, dayIndex) {
  const plan = PLANS[planId];
  const day = plan.days[dayIndex];
  if (!day.specialties || day.specialties.length === 0) return '';

  return `
    <div class="cost-breakdown" style="margin-bottom: var(--space-md)">
      <div class="cost-breakdown__title">🍽️ Đặc sản nên thử — ${day.title.split('—')[0].trim()}</div>
      ${day.specialties.map(s => `
        <div class="cost-breakdown__row" style="align-items: flex-start;">
          <span>${s.emoji} <strong>${s.name}</strong></span>
          <span class="font-mono" style="font-size: 0.7rem; opacity: 0.6;">📍 ${s.where}</span>
        </div>
        <div style="font-size: 0.72rem; color: rgba(255,255,255,0.45); padding: 0 0 6px 0; line-height: 1.5;">
          ${s.desc}
        </div>
      `).join('')}
    </div>
  `;
}

// ===== DISTANCES =====
function getModeIcon(mode) {
  const icons = { car: '🚗', alpine: '🚡', trolley: '🚂', bus: '🚌', walk: '🚶' };
  return icons[mode] || '🚗';
}

function renderDistances(planId, dayIndex) {
  const plan = PLANS[planId];
  const day = plan.days[dayIndex];
  if (!day.segments || day.segments.length === 0) return '';

  const totalKm = day.segments.reduce((sum, s) => sum + s.km, 0);

  return `
    <div class="cost-breakdown">
      <div class="cost-breakdown__title">📏 Khoảng cách di chuyển — ${day.title.split('—')[0].trim()}</div>
      ${day.segments.map(seg => `
        <div class="cost-breakdown__row">
          <span>${getModeIcon(seg.mode)} ${seg.from}${seg.to ? ' → ' + seg.to : ''}</span>
          <span class="font-mono">${seg.km}km · ${seg.time}</span>
        </div>
      `).join('')}
      <div class="cost-breakdown__total">
        <span>TỔNG NGÀY</span>
        <span>${totalKm}km</span>
      </div>
    </div>
  `;
}

// ===== ROUTE OPTIONS =====
function renderRouteOptions(planId) {
  const plan = PLANS[planId];
  if (!plan.routeOptions || plan.routeOptions.length === 0) return '';

  return `
    <div class="cost-breakdown" style="margin-top: var(--space-md)">
      <div class="cost-breakdown__title">🛣️ Cung đường</div>
      <div class="cost-breakdown__row" style="font-weight: 500;">
        <span>🚗 Đi</span>
        <span class="font-mono" style="font-size: 0.72rem; text-align: right;">${plan.routeGo}</span>
      </div>
      <div class="cost-breakdown__row" style="font-weight: 500;">
        <span>🔙 Về</span>
        <span class="font-mono" style="font-size: 0.72rem; text-align: right;">${plan.routeReturn}</span>
      </div>
      <div style="margin-top: 10px; font-size: 0.7rem; color: rgba(255,255,255,0.4);">
        <div style="margin-bottom: 4px; color: rgba(255,255,255,0.5);">Các cung đường khả dụng (Day 1):</div>
        ${plan.routeOptions.map(r => `<div style="padding: 2px 0; line-height: 1.5;">${r}</div>`).join('')}
      </div>
    </div>
  `;
}

// ===== WEATHER WIDGET (Open-Meteo API) =====
const weatherCache = {};

const WMO_ICONS = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌧️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '❄️',
  80: '🌦️', 81: '🌧️', 82: '🌧️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
};

const WMO_TEXT = {
  0: 'Trời quang', 1: 'Ít mây', 2: 'Mây rải rác', 3: 'Nhiều mây',
  45: 'Sương mù', 48: 'Sương mù',
  51: 'Mưa phùn nhẹ', 53: 'Mưa phùn', 55: 'Mưa phùn dày',
  61: 'Mưa nhẹ', 63: 'Mưa vừa', 65: 'Mưa to',
  71: 'Tuyết nhẹ', 73: 'Tuyết vừa', 75: 'Tuyết dày',
  80: 'Mưa rào nhẹ', 81: 'Mưa rào', 82: 'Mưa rào to',
  95: 'Giông', 96: 'Giông + mưa đá', 99: 'Giông mạnh',
};

function getDayDate(dayNum) {
  // Day 1 = 3/5/2026, Day 2 = 4/5/2026, Day 3 = 5/5/2026
  const dates = { 1: '2026-05-03', 2: '2026-05-04', 3: '2026-05-05' };
  return dates[dayNum] || '2026-05-03';
}

async function fetchWeatherForStops(stops, date) {
  const majorStops = stops.filter(s => s.type === 'major' && s.lat && s.lng);
  if (majorStops.length === 0) return null;

  // Parallel fetch all stops at once
  const promises = majorStops.map(async stop => {
    const cacheKey = `${stop.lat},${stop.lng},${date}`;
    if (weatherCache[cacheKey]) {
      return { name: stop.name, ...weatherCache[cacheKey] };
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${stop.lat}&longitude=${stop.lng}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia/Tokyo&start_date=${date}&end_date=${date}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.warn('Weather API error:', res.status, stop.name);
        return null;
      }
      const data = await res.json();

      if (data.daily && data.daily.time && data.daily.time.length > 0) {
        const weather = {
          min: Math.round(data.daily.temperature_2m_min[0]),
          max: Math.round(data.daily.temperature_2m_max[0]),
          code: data.daily.weathercode[0],
        };
        weatherCache[cacheKey] = weather;
        return { name: stop.name, ...weather };
      }
      console.warn('Weather API no data for:', stop.name, data);
      return null;
    } catch (err) {
      console.warn('Weather API fetch failed:', stop.name, err.message);
      return null;
    }
  });

  const results = (await Promise.all(promises)).filter(Boolean);
  return results.length > 0 ? results : null;
}

function renderWeatherWidget() {
  // Render placeholder first, then fetch real data
  return `
    <div class="weather-widget" id="weather-widget">
      <div class="weather-widget__title">🌡️ Thời tiết điểm đến</div>
      <div class="weather-widget__row" style="color: rgba(255,255,255,0.4);">
        <span>Đang tải dữ liệu...</span>
        <span class="font-mono">⏳</span>
      </div>
    </div>
  `;
}

function renderStaticWeather(day, widget, note) {
  const dayStops = day.stops.filter(s => s.type === 'major' && s.weather);
  widget.innerHTML = `
    <div class="weather-widget__title">🌡️ Thời tiết điểm đến (dự báo tham khảo)</div>
    ${dayStops.length > 0 ? dayStops.map(s => `
      <div class="weather-widget__row">
        <span>${s.name.substring(0, 15)}</span>
        <span class="font-mono">${s.weather}</span>
      </div>
    `).join('') : WEATHER.map(w => `
      <div class="weather-widget__row">
        <span>${w.location}</span>
        <span class="font-mono">${w.temp} ${w.icon}</span>
      </div>
    `).join('')}
    ${note ? `<div style="font-size: 0.65rem; color: rgba(255,255,255,0.3); margin-top: 8px;">${note}</div>` : ''}
  `;
}

async function updateWeatherWidget(planId, dayIndex) {
  const plan = PLANS[planId];
  const day = plan.days[dayIndex];
  const date = getDayDate(day.dayNum);
  const widget = document.getElementById('weather-widget');
  if (!widget) return;

  // Always try to fetch real data first (Open-Meteo returns data if within 16-day window)
  const weatherData = await fetchWeatherForStops(day.stops, date);

  if (!weatherData) {
    // Fallback to static per-stop weather from data.js
    renderStaticWeather(day, widget, '📅 Dự báo real-time sẽ khả dụng trong 16 ngày trước chuyến đi');
    return;
  }

  const dateStr = new Date(date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' });

  widget.innerHTML = `
    <div class="weather-widget__title">🌡️ Thời tiết ${dateStr} (real-time)</div>
    ${weatherData.map(w => `
      <div class="weather-widget__row">
        <span>${w.name.substring(0, 15)}</span>
        <span class="font-mono">${w.min}~${w.max}°C ${WMO_ICONS[w.code] || '🌤️'}</span>
      </div>
      <div style="font-size: 0.68rem; color: rgba(255,255,255,0.35); padding: 0 0 4px 0;">
        ${WMO_TEXT[w.code] || ''}
      </div>
    `).join('')}
    <div style="font-size: 0.65rem; color: rgba(255,255,255,0.3); margin-top: 8px;">
      🔄 Nguồn: Open-Meteo · Cập nhật khi load trang
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
  const planIds = Object.keys(PLANS);
  const planIcons = { A: '🏔️', B: '♨️', C: '🏯', D: '💧', E: '⛷️' };
  table.innerHTML = `
    <thead>
      <tr>
        <th></th>
        ${planIds.map(id => `<th data-plan="${id}">Plan ${id} ${planIcons[id] || ''}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${COMPARISON.map(row => `
        <tr>
          <td>${row.label}</td>
          ${planIds.map(id => `<td><span class="pill pill--${row[id].type}">${row[id].text}</span></td>`).join('')}
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
