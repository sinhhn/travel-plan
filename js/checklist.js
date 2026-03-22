// ===== CHECKLIST WITH LOCALSTORAGE =====
const CHECKLIST_STORAGE_KEY = 'toyama-trip-checklist';

function getCheckedItems() {
  try {
    return JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCheckedItems(checked) {
  localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checked));
}

function toggleCheckItem(id) {
  const checked = getCheckedItems();
  checked[id] = !checked[id];
  saveCheckedItems(checked);
  renderChecklist();
}

function renderChecklist() {
  const container = document.getElementById('checklist-panel');
  if (!container) return;

  const checked = getCheckedItems();

  container.innerHTML = `
    <div class="checklist">
      ${CHECKLIST.map(item => `
        <div class="checklist-item ${item.critical ? 'critical' : ''} ${checked[item.id] ? 'checked' : ''}"
             onclick="toggleCheckItem('${item.id}')"
             role="checkbox"
             aria-checked="${!!checked[item.id]}"
             tabindex="0">
          <div class="checklist-item__checkbox">
            ${checked[item.id] ? '✓' : ''}
          </div>
          <span class="checklist-item__text">${item.text}</span>
        </div>
      `).join('')}
    </div>
  `;
}
