# 🏔️ 黒部富山 Family Trip Planner — UI/UX Design Specification
**For Claude Code Implementation**
Version 1.0 | Mobile-First | Google Maps Integrated

---

## 1. TỔNG QUAN & CONCEPT

### Vision Statement
Không phải website du lịch thông thường — đây là một **cuốn nhật ký hành trình tương tác** (Interactive Travel Journal). Người dùng không "đọc lịch trình", họ **bước vào chuyến đi** ngay từ lúc mở trang.

### Aesthetic Direction: "Mountain Journal Editorial"
- Cảm giác như một cuốn tạp chí du lịch Nhật Bản cao cấp + field notebook
- Màu sắc lấy cảm hứng từ thiên nhiên Toyama: xanh núi sương, trắng tuyết, vàng nắng sớm
- Typography: serif cổ điển (Playfair Display) kết hợp monospace thô (cho giờ giấc/số liệu)
- Motion: smooth, như lật trang sách — không nhanh, không chói mắt
- Không có dashboard, không có card trắng trên nền trắng

---

## 2. TECH STACK

```
Frontend:  Vanilla HTML + CSS + JavaScript (không framework — dễ deploy, nhanh)
Maps:      Google Maps JavaScript API v3 (embed thật)
Fonts:     Google Fonts — Playfair Display (serif) + DM Mono (monospace)
Icons:     Inline SVG + Unicode emoji
Hosting:   Static file, có thể mở trực tiếp trên điện thoại
```

---

## 3. COLOR SYSTEM

```css
:root {
  /* Background — paper-like */
  --bg-base:       #F5F0E8;   /* kem ấm — như trang giấy cũ */
  --bg-card:       #FDFAF4;   /* trắng ngà */
  --bg-dark:       #1C2B3A;   /* xanh đêm núi */
  --bg-overlay:    rgba(28, 43, 58, 0.85);

  /* Brand colors */
  --snow:          #FFFFFF;
  --mountain:      #2E4A6B;   /* xanh núi */
  --mountain-light:#4A7BA7;
  --forest:        #3D6B4F;   /* xanh rừng */
  --sunrise:       #E8A838;   /* vàng bình minh */
  --sakura:        #D4758A;   /* hồng anh đào */
  --stone:         #8C7B6B;   /* xám đá */

  /* Plan accent colors */
  --plan-a:        #2E4A6B;   /* xanh núi — Alpine Adventure */
  --plan-b:        #3D6B4F;   /* xanh rừng — Family Relax */
  --plan-c:        #8B4513;   /* nâu lâu đài — Nagano Strategy */

  /* Text */
  --text-primary:  #1C2B3A;
  --text-secondary:#5A4F45;
  --text-light:    #9A8E85;
  --text-on-dark:  #F5F0E8;
}
```

---

## 4. TYPOGRAPHY

```css
/* Import */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@400;500&family=Noto+Serif+JP:wght@300;400;600&display=swap');

/* Scale */
--font-display:  'Playfair Display', 'Noto Serif JP', serif;  /* Tiêu đề lớn */
--font-body:     'Noto Serif JP', Georgia, serif;              /* Nội dung */
--font-mono:     'DM Mono', 'Courier New', monospace;          /* Giờ, km, giá vé */

/* Sizes (mobile-first) */
--text-hero:     clamp(2rem, 8vw, 4.5rem);
--text-h1:       clamp(1.5rem, 5vw, 3rem);
--text-h2:       clamp(1.2rem, 3.5vw, 2rem);
--text-h3:       clamp(1rem, 2.5vw, 1.4rem);
--text-body:     clamp(0.9rem, 2vw, 1rem);
--text-caption:  0.8rem;
--text-mono:     0.85rem;
```

---

## 5. CẤU TRÚC TRANG (Page Architecture)

```
┌─────────────────────────────────┐
│  SECTION 1: HERO                │  Full screen, parallax mountain bg
│  "3 Gia Đình · 10 Người · 3 Ngày"
│  + Countdown timer đến 3/5      │
├─────────────────────────────────┤
│  SECTION 2: WARNING BANNER      │  GW Warning — dải màu đỏ cam
├─────────────────────────────────┤
│  SECTION 3: PLAN SELECTOR       │  3 card lớn để chọn plan
│  [A: Alpine] [B: Relax] [C: Smart]
├─────────────────────────────────┤
│  SECTION 4: PLAN DETAIL         │  Dynamic, thay đổi theo plan được chọn
│  ┌─ Day timeline (vertical)     │
│  │  ├─ Day 1 accordion          │
│  │  ├─ Day 2 accordion          │
│  │  └─ Day 3 accordion          │
│  └─ Google Map (sticky sidebar/below)
├─────────────────────────────────┤
│  SECTION 5: COMPARISON TABLE    │  So sánh 3 plan nhanh
├─────────────────────────────────┤
│  SECTION 6: ESSENTIALS          │  Checklist, tips, booking links
└─────────────────────────────────┘
```

---

## 6. CHI TIẾT TỪNG SECTION

### 6.1 HERO SECTION

**Layout:**
- Full viewport height (100svh)
- Background: CSS gradient mesh giả núi tuyết — trắng trên, xanh đậm dưới
- Hoặc dùng background-image với một ảnh núi (unsplash blur/WebP nhỏ)

**Content:**
```
[BADGE: GW 2026]

黒部・富山
gia đình hành trình

3 gia đình · 10 người
3/5 — 5/5/2026

━━━━━━━━━━━━━

[Countdown: XX ngày XX giờ XX phút]

↓ Chọn hành trình của bạn
```

**Visual details:**
- Text màu trắng trên nền tối
- Badge "GW 2026" dạng pill với border
- Tên chính bằng Playfair Display italic, rất lớn
- Subtitle nhỏ hơn bằng DM Mono
- Countdown bằng DM Mono, số lớn
- Arrow down nhấp nháy nhẹ (CSS animation)
- Texture: một lớp noise grain overlay nhẹ để tạo cảm giác "ảnh cũ"

---

### 6.2 WARNING BANNER

**Design:**
- Background: linear-gradient từ #C0392B sang #E74C3C
- Nền có pattern chéo (diagonal stripes nhẹ)
- Icon ⚠️ lớn bên trái
- Text ngắn gọn bằng DM Mono

```
⚠️  GOLDEN WEEK ALERT
Xuất phát TRƯỚC 5:00 AM ngày 3/5
Rời Toyama TRƯỚC 9:00 AM ngày 5/5
Tắc đường có thể gấp 2-3 lần thường ngày
```

---

### 6.3 PLAN SELECTOR (Quan trọng nhất — UX)

**Mobile layout:** 3 card xếp dọc, swipeable
**Tablet+:** 3 card ngang

**Mỗi Plan Card bao gồm:**
```
┌─────────────────────────────┐
│ [Số thứ tự lớn: A / B / C]  │  ← Decorative, góc trên trái
│                             │
│  PLAN [A/B/C]               │  ← Tên plan
│  "Alpine Adventure"         │  ← Subtitle
│  ─────────────────          │
│  📍 五箇山 → 室堂 → 宇奈月   │  ← Route preview
│  ─────────────────          │
│  🏔️ Tường tuyết 15m         │  ← Key highlight 1
│  👨‍👩‍👧 Phù hợp bé 4+ tuổi    │  ← Key highlight 2
│  💰 Chi phí: ~¥55,000       │  ← Chi phí tổng
│  ─────────────────          │
│  [● CHỌN PLAN NÀY]          │  ← CTA button
└─────────────────────────────┘
```

**Trạng thái:**
- Default: border mỏng, nền kem
- Hover: nhẹ nâng lên (translateY -4px), shadow
- Selected: border dày màu accent của plan, background tinted nhẹ, badge "✓ ĐÃ CHỌN"

**Màu accent per plan:**
- Plan A → `--plan-a` (#2E4A6B) — xanh đậm
- Plan B → `--plan-b` (#3D6B4F) — xanh lá
- Plan C → `--plan-c` (#8B4513) — nâu ấm

---

### 6.4 PLAN DETAIL SECTION (Dynamic Content)

**Layout mobile:**
```
[Day Tabs: Day 1 | Day 2 | Day 3]
┌──────────────────────────────┐
│  Day 1 — Chủ Nhật 3/5        │
│  Tokyo → 五箇山 → 富山        │
├──────────────────────────────┤
│  Google Map (height: 250px)  │  ← Map embed thật
├──────────────────────────────┤
│  Timeline dọc:               │
│  ○ 4:30 Xuất phát Tokyo      │
│  │                           │
│  ● 11:00 五箇山 相倉集落      │  ← Dot lớn = stop quan trọng
│  │  > Làng gassho UNESCO     │
│  │  > Ăn: 五箇山豆腐         │
│  │  > Thời gian: 1.5h        │
│  │  [📍 Xem bản đồ]          │
│  │                           │
│  ● 15:00 富山市内 チェックイン │
│  │  > Kansui Park tản bộ     │
│  │  > Tối: 白エビ料理         │
│  ▼                           │
└──────────────────────────────┘
```

**Timeline component chi tiết:**

```css
/* Timeline line */
.timeline-line {
  position: absolute;
  left: 20px;
  top: 0; bottom: 0;
  width: 2px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--plan-color) 10%,
    var(--plan-color) 90%,
    transparent
  );
}

/* Timeline dot */
.timeline-dot {
  width: 12px; height: 12px;
  border-radius: 50%;
  background: var(--plan-color);
  /* Dot lớn cho major stops */
}
.timeline-dot.major {
  width: 20px; height: 20px;
  box-shadow: 0 0 0 4px rgba(plan-color, 0.2);
}
```

**Stop Card (mỗi điểm dừng):**
```
┌────────────────────────────────┐
│ 11:00 AM            🕐 1.5 giờ │  ← Mono font
├────────────────────────────────┤
│ 🏘️ 五箇山 相倉集落              │  ← Tên địa điểm
│ UNESCO · Làng mái tranh cổ     │  ← Subtitle
├────────────────────────────────┤
│ 💡 Yên tĩnh hơn 白川郷, ít     │
│    khách GW hơn. Trẻ em thích  │
│    khám phá nhà 3 tầng.        │
├────────────────────────────────┤
│ 🍜 五箇山豆腐· 岩魚塩焼き      │  ← Ăn gì
│ 🌡️ ~15°C · 👟 Giày thoải mái  │  ← Thời tiết/trang phục
├────────────────────────────────┤
│ [📍 Xem trên Maps] [📞 Liên hệ]│
└────────────────────────────────┘
```

**Google Map per day:**
- Map hiện route của ngày đó
- Markers màu khớp với plan color
- Mỗi marker có InfoWindow với tên điểm và ghi chú ngắn
- `fitBounds()` tự động zoom vừa route
- Trên mobile: height 200px, full width
- Nút "Mở trong Google Maps" (deeplink)

---

### 6.5 COMPARISON TABLE

**Không làm bảng HTML thông thường — làm dạng "Bộ sưu tập so sánh"**

Mobile: scroll ngang (overflow-x: auto)
Desktop: 3 cột cố định

```
            Plan A 🅰️    Plan B 🅱️    Plan C 🅲
────────────────────────────────────────────
Tường tuyết  ✅ Có       ❌ Không     ✅ Có
Độ vất vả    🔥🔥🔥      🔥           🔥🔥🔥
Bé < 4 tuổi  ⚠️          ✅ Tốt       ⚠️
Tránh đông   ⭐⭐         ⭐⭐          ⭐⭐⭐
Chi phí      ¥¥¥         ¥            ¥¥
```

Dùng colored pills cho các giá trị thay vì plain text.

---

### 6.6 ESSENTIALS SECTION

**Chia làm 3 tabs:**
- 🎒 Đồ cần mang (Checklist interactive — check được)
- 📱 Ứng dụng & Links (các link cần thiết)
- 🍜 Ăn gì ở đâu (food guide mini)

**Checklist component:**
```javascript
// Lưu state vào localStorage
const checklist = [
  { id: 'warm-jacket', text: 'Áo ấm dày (Murodo -5°C)', critical: true },
  { id: 'snow-boots',  text: 'Giày không trơn', critical: true },
  { id: 'ticket',      text: 'Vé Alpine Route (ĐẶT TRƯỚC!)', critical: true },
  { id: 'snacks',      text: 'Đồ ăn nhẹ cho trẻ em', critical: false },
  // ...
];
```

---

## 7. NAVIGATION (Sticky Header Mobile)

```
┌──────────────────────────────────┐
│ 🏔️ 黒部富山 2026      [A][B][C]  │  ← Plan switcher quick access
└──────────────────────────────────┘
```

- Sticky top, height 56px
- Background: `--bg-dark` với backdrop-blur
- Logo text bằng Playfair
- Plan pills: A/B/C — click để jump đến section plan detail và highlight

---

## 8. GOOGLE MAPS INTEGRATION

### API Setup
```javascript
// index.html — load Maps API
<script async
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMaps&libraries=marker">
</script>
```

### Map Configuration
```javascript
const MAP_CONFIG = {
  mapId: 'TRAVEL_MAP_2026',  // Tạo Map ID trong Cloud Console cho Advanced Markers
  styles: CUSTOM_MAP_STYLE,  // Style tùy chỉnh (xem mục 8.1)
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};
```

### 8.1 Custom Map Style (cho cảm giác "editorial")
```javascript
const CUSTOM_MAP_STYLE = [
  { featureType: "water",        stylers: [{ color: "#a0c4ff" }] },
  { featureType: "landscape",    stylers: [{ color: "#f0ebe0" }] },
  { featureType: "road.highway", stylers: [{ color: "#e8c87a" }] },
  { featureType: "poi.park",     stylers: [{ color: "#c5deb8" }] },
  { featureType: "transit",      stylers: [{ visibility: "simplified" }] },
];
```

### 8.2 Data Structure (tất cả điểm của 3 plans)
```javascript
const PLANS = {
  A: {
    color: '#2E4A6B',
    name: 'Alpine Adventure',
    days: [
      {
        dayNum: 1,
        title: 'Day 1 — Tokyo → 五箇山 → 富山',
        stops: [
          {
            id: 'gokayama',
            name: '五箇山 相倉集落',
            lat: 36.4260, lng: 136.9355,
            arrivalTime: '11:00',
            duration: 90,
            type: 'major', // major | minor | rest
            description: 'Làng mái tranh gassho UNESCO yên tĩnh nhất',
            food: '五箇山豆腐・岩魚塩焼き',
            tips: 'Đến sớm, ít đông hơn 白川郷',
            googleMapsUrl: 'https://maps.google.com/?cid=...',
          },
          // ...
        ],
      },
      // Day 2, Day 3
    ],
  },
  B: { /* ... */ },
  C: { /* ... */ },
};
```

### 8.3 Route Polyline per Day
```javascript
function drawDayRoute(map, stops, planColor) {
  const path = stops.map(s => ({ lat: s.lat, lng: s.lng }));
  const polyline = new google.maps.Polyline({
    path,
    geodesic: true,
    strokeColor: planColor,
    strokeOpacity: 0.8,
    strokeWeight: 3,
    icons: [{
      icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
      offset: '50%',
    }],
  });
  polyline.setMap(map);
}
```

### 8.4 Custom Markers
```javascript
// Dùng AdvancedMarkerElement
function createMarker(map, stop, index, planColor) {
  const pin = new google.maps.marker.PinElement({
    background: planColor,
    glyphColor: '#FFFFFF',
    glyph: String(index + 1),
    borderColor: '#FFFFFF',
  });

  const marker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position: { lat: stop.lat, lng: stop.lng },
    title: stop.name,
    content: pin.element,
  });

  // InfoWindow
  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="font-family: serif; padding: 8px; max-width: 200px;">
        <strong>${stop.name}</strong><br>
        <small>🕐 ${stop.arrivalTime} · ${stop.duration}ph</small><br>
        <small>${stop.description}</small>
      </div>
    `,
  });

  marker.addEventListener('click', () => {
    infoWindow.open(map, marker);
    // Scroll timeline to this stop
    document.getElementById(`stop-${stop.id}`)?.scrollIntoView({ behavior: 'smooth' });
  });
}
```

---

## 9. INTERACTIONS & ANIMATIONS

### 9.1 Plan Switch Transition
```javascript
// Khi đổi plan, fade out → update → fade in
function switchPlan(planId) {
  const detail = document.getElementById('plan-detail');
  detail.style.opacity = '0';
  detail.style.transform = 'translateY(10px)';

  setTimeout(() => {
    renderPlanDetail(planId);
    reinitMap(planId);
    detail.style.opacity = '1';
    detail.style.transform = 'translateY(0)';
  }, 300);
}
```

### 9.2 Scroll-triggered Reveals
```javascript
// IntersectionObserver cho timeline stops
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.2 });
```

```css
.stop-card {
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.5s ease;
}
.stop-card.revealed {
  opacity: 1;
  transform: translateX(0);
}
```

### 9.3 Map-Timeline Sync
- Click marker trên map → scroll timeline đến stop đó + highlight card
- Click stop card → map pan đến marker đó + bounce marker animation

### 9.4 Day Tab Switch
```css
.day-tab {
  transition: all 0.3s ease;
}
.day-tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0; right: 0;
  height: 3px;
  background: var(--plan-color);
  border-radius: 2px;
}
```

---

## 10. RESPONSIVE BREAKPOINTS

```css
/* Mobile first */
/* Base:      < 640px   — 1 column, stacked */
/* Tablet:    640-1024px — map sidebar */
/* Desktop:  > 1024px   — full 2-col layout */

@media (min-width: 640px) {
  .plan-cards { grid-template-columns: repeat(3, 1fr); }
  .plan-detail { display: grid; grid-template-columns: 1fr 380px; gap: 24px; }
}

@media (min-width: 1024px) {
  .map-container { position: sticky; top: 80px; height: calc(100vh - 100px); }
}
```

---

## 11. FILE STRUCTURE

```
/
├── index.html          ← Entry point
├── css/
│   ├── base.css        ← Reset, variables, typography
│   ├── layout.css      ← Section layouts
│   ├── components.css  ← Cards, timeline, buttons
│   ├── maps.css        ← Map container styles
│   └── animations.css  ← All transitions
├── js/
│   ├── data.js         ← All PLANS data (coordinates, text, etc.)
│   ├── maps.js         ← Google Maps init, markers, routes
│   ├── ui.js           ← Plan switching, tabs, accordion
│   ├── countdown.js    ← Countdown timer
│   └── checklist.js    ← Checklist with localStorage
└── assets/
    └── (optional) hero-bg.webp
```

---

## 12. ACCESSIBILITY & PERFORMANCE

- `prefers-reduced-motion` media query để tắt animation nếu cần
- Tất cả interactive element có `focus-visible` styles rõ ràng
- Màu contrast đạt WCAG AA minimum
- Map có `aria-label` mô tả
- Lazy load map (chỉ init khi scroll đến section map)
- Checklist state persist qua `localStorage`

---

## 13. DATA: TẤT CẢ ĐIỂM TRÊN BẢN ĐỒ

### Plan A — Stops
| ID | Tên | Lat | Lng | Day |
|---|---|---|---|---|
| gokayama | 五箇山 相倉集落 | 36.4260 | 136.9355 | 1 |
| toyama-city | 富山市内 | 36.6884 | 137.2152 | 1 |
| tateyama-sta | 立山駅 | 36.5835 | 137.4459 | 2 |
| murodo | 室堂・雪の大谷 | 36.5777 | 137.5949 | 2 |
| kurobe-dam | 黒部ダム | 36.5666 | 137.6629 | 2 |
| unazuki | 宇奈月温泉 | 36.8162 | 137.5828 | 2 |
| kurobe-trolley | 黒部峡谷トロッコ | 36.8150 | 137.5860 | 3 |

### Plan B — Stops
| ID | Tên | Lat | Lng | Day |
|---|---|---|---|---|
| shirakawago | 白川郷 | 36.2578 | 136.9062 | 1 |
| kansui-park | 富山 環水公園 | 36.7094 | 137.2124 | 1 |
| uozu-aqua | 魚津水族館 | 36.7984 | 137.3882 | 2 |
| unazuki-yamanoha | 宇奈月YAMANOHA | 36.8173 | 137.5841 | 2 |
| kurobe-trolley | 黒部峡谷トロッコ | 36.8150 | 137.5860 | 2 |
| toyama-tad | 富山県美術館TAD | 36.7106 | 137.2101 | 3 |

### Plan C — Stops
| ID | Tên | Lat | Lng | Day |
|---|---|---|---|---|
| matsumoto | 松本城 | 36.2387 | 137.9689 | 1 |
| ogizawa | 扇沢駅 | 36.5587 | 137.7208 | 1 |
| kurobe-dam | 黒部ダム | 36.5666 | 137.6629 | 1 |
| tateyama-sta | 立山駅 | 36.5835 | 137.4459 | 2 |
| murodo | 室堂・雪の大谷 | 36.5777 | 137.5949 | 2 |
| unazuki-yamanoha | 宇奈月YAMANOHA | 36.8173 | 137.5841 | 2 |
| kurobe-trolley | 黒部峡谷トロッコ | 36.8150 | 137.5860 | 3 |
| gokayama | 五箇山 相倉集落 | 36.4260 | 136.9355 | 3 |

---

## 14. SPECIAL COMPONENTS

### 14.1 Countdown Timer
```javascript
// Target: 3/5/2026 04:30:00 JST (UTC+9)
const TARGET = new Date('2026-05-03T04:30:00+09:00');

function updateCountdown() {
  const now = new Date();
  const diff = TARGET - now;
  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  // Render vào DOM
}
setInterval(updateCountdown, 1000);
```

**Visual:**
```
┌──────┐  ┌──────┐  ┌──────┐
│  42  │  │  13  │  │  27  │
│ ngày │  │ giờ  │  │ phút │
└──────┘  └──────┘  └──────┘
```
Dùng DM Mono, số lớn, flip animation.

### 14.2 Cost Calculator Mini
Mỗi plan có bảng chi phí ước tính:
```
Plan A — Chi phí ước tính (10 người)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Alpine Route (vé)     ¥55,000
Xăng/cao tốc          ¥30,000
Khách sạn 2 đêm       ¥80,000
Ăn uống               ¥40,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TỔNG                ~¥205,000
Mỗi người           ~¥20,500
```

### 14.3 Weather Widget (static)
```
🌡️ Dự báo tháng 5:
室堂 (2,450m): -3 ~ 2°C  ❄️ Tuyết có thể rơi
富山市内:       15 ~ 22°C  🌤️ Ấm, mưa nhẹ
宇奈月:         14 ~ 20°C  🌸 Mùa xuân
```

---

## 15. SHARING FEATURE

```javascript
// Nút Share
async function shareTrip(planId) {
  if (navigator.share) {
    await navigator.share({
      title: `黒部富山旅行 Plan ${planId}`,
      text: `Chuyến đi GW 2026 — Plan ${planId}`,
      url: `${window.location.href}?plan=${planId}`,
    });
  } else {
    // Copy to clipboard fallback
    navigator.clipboard.writeText(window.location.href + `?plan=${planId}`);
    showToast('Đã copy link!');
  }
}

// URL state — plan persist khi share link
// ?plan=A → auto-select Plan A khi mở
const urlParams = new URLSearchParams(window.location.search);
const initialPlan = urlParams.get('plan') || 'A';
```

---

*End of Design Specification*
*Estimated implementation time: 6-8 hours*
*Lines of code estimate: ~1,500-2,000 lines*
