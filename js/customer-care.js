/**
 * ==============================================================================
 * MEDCARE CRM — Customer Care & Interaction Timeline Logic
 * ==============================================================================
 */

let allPatients = [];
let currentPatientId = null;

const INTERACTIONS_KEY = 'medcare_interactions';

function getInteractionsMap() {
  try {
    return JSON.parse(localStorage.getItem(INTERACTIONS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveInteractionsMap(map) {
  localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(map));
}

function initCustomerCarePage() {
  allPatients = typeof getPatients === 'function' ? getPatients() : [];

  populatePatientSelect();
  setupPatientSelectListener();
  setupCareForm();

  // Set default next contact date = today + 7 days
  const nextDateInput = document.getElementById('careNextDate');
  if (nextDateInput) {
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    nextDateInput.value = nextWeek;
  }

  // Check URL query parameter: ?patientId=...
  const params = new URLSearchParams(window.location.search);
  const paramPatientId = params.get('patientId');

  const pSelect = document.getElementById('carePatientSelect');
  if (paramPatientId && allPatients.some(p => p.id === paramPatientId)) {
    if (pSelect) pSelect.value = paramPatientId;
    loadPatientData(paramPatientId);
  } else if (allPatients.length > 0) {
    if (pSelect) pSelect.value = allPatients[0].id;
    loadPatientData(allPatients[0].id);
  }
}

function populatePatientSelect() {
  const pSelect = document.getElementById('carePatientSelect');
  if (!pSelect) return;

  pSelect.innerHTML = allPatients.map(p => {
    const rank = typeof classifyPatient === 'function' ? classifyPatient(p.totalSpent) : { icon: '⭐', label: p.rank };
    return `<option value="${p.id}">${p.id} — ${p.name} (${rank.icon} ${rank.label} · ${p.service})</option>`;
  }).join('');
}

function setupPatientSelectListener() {
  const pSelect = document.getElementById('carePatientSelect');
  if (!pSelect) return;

  pSelect.addEventListener('change', (e) => {
    loadPatientData(e.target.value);
  });
}

function loadPatientData(patientId) {
  currentPatientId = patientId;
  const patient = allPatients.find(p => p.id === patientId);
  if (!patient) return;

  // Render Patient Mini Summary Card
  const card = document.getElementById('selectedPatientCard');
  if (card) {
    const rank = typeof classifyPatient === 'function' ? classifyPatient(patient.totalSpent) : { icon: '⭐', label: patient.rank, rank: patient.rank };
    const formattedSpent = (patient.totalSpent || 0).toLocaleString('vi-VN') + ' ₫';

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <div>
          <strong style="font-size:15px; color:#0f172a;">${patient.name}</strong> (${patient.id})
          <div style="color:#64748b; font-size:12px; margin-top:2px;">
            ${patient.gender}, ${patient.age || 30} tuổi · 📞 ${patient.phone}
          </div>
        </div>
        <span class="badge-rank ${rank.rank}">
          ${rank.icon} Hạng ${rank.label}
        </span>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:12px; color:#475569; padding-top:6px; border-top:1px dashed #e2e8f0;">
        <span>Dịch vụ: <strong>${patient.service}</strong></span>
        <span>Chi tiêu: <strong style="color:#0f766e;">${formattedSpent}</strong></span>
      </div>
    `;
  }

  // Update Title of Timeline
  const tTitle = document.getElementById('timelinePatientTitle');
  if (tTitle) {
    tTitle.textContent = `Hồ sơ: ${patient.name} (${patient.id}) — ${patient.phone}`;
  }

  // Load Timeline Interactions
  renderTimeline(patientId);
}

function renderTimeline(patientId) {
  const container = document.getElementById('patientTimeline');
  if (!container) return;

  const map = getInteractionsMap();
  let list = map[patientId];

  // If no interactions stored yet, seed with sample interactions
  if (!list || list.length === 0) {
    if (typeof generateInteractions === 'function') {
      list = generateInteractions(patientId, 3);
      map[patientId] = list;
      saveInteractionsMap(map);
    } else {
      list = [];
    }
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:24px 0;">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-title">Chưa có lịch sử chăm sóc</div>
        <div class="empty-state-desc">Hãy ghi nhận tương tác đầu tiên bằng biểu mẫu bên trái</div>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((item, idx) => {
    return `
      <div class="timeline-item">
        <div class="timeline-dot" style="${idx === 0 ? 'background:#0f766e; box-shadow:0 0 0 4px #99f6e4;' : ''}"></div>
        <div class="timeline-time">${item.date} · Thực hiện bởi: <strong>${item.staff || 'Nhân viên CSKH'}</strong></div>
        <div class="timeline-content">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <strong style="color:#0f766e; font-size:14px;">${item.type}</strong>
            <span class="badge-status" style="font-size:11px; ${item.result?.includes('Tích cực') ? 'background:#dcfce7; color:#16a34a;' : 'background:#fef3c7; color:#d97706;'}">
              ${item.result || 'Hoàn thành'}
            </span>
          </div>
          <div style="color:#334155; line-height:1.5;">${item.note}</div>
        </div>
      </div>
    `;
  }).join('');
}

function setupCareForm() {
  const form = document.getElementById('careForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!currentPatientId) {
      alert('Vui lòng chọn bệnh nhân!');
      return;
    }

    const channel = document.getElementById('careChannel').value;
    const type = document.getElementById('careType').value;
    const notes = document.getElementById('careNotes').value.trim();
    const result = document.getElementById('careResult').value;
    const nextDate = document.getElementById('careNextDate').value;

    const user = window.currentUser || { name: 'Nguyễn Minh Nhân' };

    const newInteraction = {
      id: `INT_${currentPatientId}_${Date.now()}`,
      patientId: currentPatientId,
      type: `${type} (${channel})`,
      date: new Date().toLocaleDateString('vi-VN'),
      staff: user.name,
      note: notes,
      result: result
    };

    // Save to map
    const map = getInteractionsMap();
    if (!map[currentPatientId]) map[currentPatientId] = [];
    map[currentPatientId].unshift(newInteraction);
    saveInteractionsMap(map);

    // Update patient's nextFollowUp if provided
    if (nextDate) {
      const idx = allPatients.findIndex(p => p.id === currentPatientId);
      if (idx !== -1) {
        const [y, m, d] = nextDate.split('-');
        allPatients[idx].nextFollowUp = `${d}/${m}/${y}`;
        allPatients[idx].lastContact = new Date().toLocaleDateString('vi-VN');
        allPatients[idx].overdueDays = 0;
        if (typeof savePatients === 'function') savePatients(allPatients);
      }
    }

    if (typeof showToast === 'function') {
      showToast('Ghi nhận thành công!', `Đã thêm hoạt động CSKH vào hồ sơ ${currentPatientId}`, 'success');
    }

    document.getElementById('careNotes').value = '';
    renderTimeline(currentPatientId);
  });
}
