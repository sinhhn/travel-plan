// ===== COUNTDOWN TIMER =====
// Target: 3/5/2026 04:30:00 JST (UTC+9)
const COUNTDOWN_TARGET = new Date('2026-05-03T06:00:00+09:00');

function updateCountdown() {
  const container = document.getElementById('countdown');
  if (!container) return;

  const now = new Date();
  const diff = COUNTDOWN_TARGET - now;

  if (diff <= 0) {
    container.classList.add('countdown--past');
    container.innerHTML = `
      <div class="countdown__box">
        <span class="countdown__number">🎉</span>
        <span class="countdown__label">Chuyến đi đã bắt đầu!</span>
      </div>
    `;
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  container.innerHTML = `
    <div class="countdown__box">
      <span class="countdown__number" id="cd-days">${String(days).padStart(2, '0')}</span>
      <span class="countdown__label">ngày</span>
    </div>
    <div class="countdown__box">
      <span class="countdown__number" id="cd-hours">${String(hours).padStart(2, '0')}</span>
      <span class="countdown__label">giờ</span>
    </div>
    <div class="countdown__box">
      <span class="countdown__number" id="cd-min">${String(minutes).padStart(2, '0')}</span>
      <span class="countdown__label">phút</span>
    </div>
    <div class="countdown__box">
      <span class="countdown__number" id="cd-sec">${String(seconds).padStart(2, '0')}</span>
      <span class="countdown__label">giây</span>
    </div>
  `;
}

// Init
updateCountdown();
setInterval(updateCountdown, 1000);
