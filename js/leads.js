/**
 * ==============================================================================
 * MEDCARE CRM — Leads Management & HTML5 Form Handler
 * Course Requirement #1: HTML5 Form Validation
 * ==============================================================================
 */

let allLeads = [];
let filteredLeads = [];

function initLeadsPage() {
  allLeads = typeof getLeads === 'function' ? getLeads() : [];

  populateLeadServices();
  setDefaultContactDate();
  setupLeadForm();
  setupLeadFilters();

  applyLeadFilters();
}

function populateLeadServices() {
  const services = window.SERVICES || [
    'Khám Sức Khỏe Tổng Quát', 'Tầm Soát Tim Mạch', 'Nha Khoa Thẩm Mỹ',
    'Da Liễu & Thẩm Mỹ Da', 'Khám Mắt & Điều Trị Cận Thị', 'Gói Mẹ & Bé',
    'Xét Nghiệm Máu Tại Nhà', 'Chẩn Đoán Hình Ảnh CT/MRI', 'Nội Khoa Tổng Quát', 'Tầm Soát Ung Thư'
  ];

  const select = document.getElementById('leadService');
  if (!select) return;

  services.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    select.appendChild(opt);
  });
}

function setDefaultContactDate() {
  const dateInput = document.getElementById('leadContactDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today; // Prevent choosing past dates
  }
}

function setupLeadFilters() {
  const statusFilter = document.getElementById('leadStatusFilter');
  const searchInput  = document.getElementById('leadSearchInput');

  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      applyLeadFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      applyLeadFilters();
    });
  }
}

function applyLeadFilters() {
  const statusVal = document.getElementById('leadStatusFilter')?.value || 'all';
  const searchVal = (document.getElementById('leadSearchInput')?.value || '').trim().toLowerCase();

  filteredLeads = allLeads.filter(l => {
    const matchStatus = statusVal === 'all' || l.status === statusVal;
    const matchSearch = !searchVal ||
      (l.name && l.name.toLowerCase().includes(searchVal)) ||
      (l.phone && l.phone.includes(searchVal)) ||
      (l.id && l.id.toLowerCase().includes(searchVal)) ||
      (l.service && l.service.toLowerCase().includes(searchVal)) ||
      (l.note && l.note.toLowerCase().includes(searchVal));

    return matchStatus && matchSearch;
  });

  renderLeadsTable();
}

function renderLeadsTable() {
  const tbody = document.getElementById('leadsTableBody');
  if (!tbody) return;

  if (filteredLeads.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:32px; color:#64748b;">
          Không có khách hàng tiềm năng nào phù hợp với bộ lọc hoặc từ khóa tìm kiếm.
        </td>
      </tr>
    `;
    return;
  }

  const priorityLabels = {
    high: '<span class="badge-priority high">Gấp</span>',
    medium: '<span class="badge-priority medium">Vừa</span>',
    low: '<span class="badge-priority low">Thấp</span>'
  };

  tbody.innerHTML = filteredLeads.map(l => {
    const isConverted = l.status === 'converted';

    // Extract appointment code if exists
    const codeMatch = (l.note || '').match(/#MED2026-\d{4}/);
    const bookingCode = codeMatch ? codeMatch[0] : null;

    // Check if kiosk queue number already dispatched
    const kioskMatch = (l.note || '').match(/Số thứ tự(?:\s*ưu tiên)?:\s*(#[0-9A-Z]+)/i);
    const kioskNumber = kioskMatch ? kioskMatch[1] : null;

    return `
      <tr>
        <td>
          <strong>${l.id}</strong>
          ${bookingCode ? `<div style="font-size:11px; font-weight:800; color:#0f766e; background:#e6fffa; border:1px solid #99f6e4; padding:1px 6px; border-radius:4px; margin-top:2px; display:inline-block; font-family:monospace;">${bookingCode}</div>` : ''}
        </td>
        <td>
          <div style="font-weight:700; color:#0f172a;">${l.name}</div>
          <div style="font-size:11.5px; color:#64748b;">📞 ${l.phone}</div>
          <div style="font-size:11.5px; color:#64748b;">✉️ ${l.email || '—'}</div>
        </td>
        <td>
          <div style="font-size:12.5px; color:#0f766e; font-weight:700;">${l.service}</div>
          <div style="font-size:11px; color:#64748b;">Nguồn: <span style="font-weight:600;">${l.source}</span></div>
          ${kioskNumber ? `
            <div style="margin-top:4px;">
              <span style="font-size:11px; font-weight:800; background:#dcfce7; color:#166534; padding:2px 8px; border-radius:999px; border:1px solid #bbf7d0;">
                🎟️ Kiosk ${kioskNumber}
              </span>
            </div>
          ` : ''}
        </td>
        <td>${priorityLabels[l.priority] || l.priority}</td>
        <td>
          <select 
            class="filter-select" 
            style="height:30px; font-size:12px; padding:2px 24px 2px 8px; width:125px;"
            onchange="updateLeadStatus('${l.id}', this.value)"
            ${isConverted ? 'disabled' : ''}
          >
            <option value="new" ${l.status === 'new' ? 'selected' : ''}>🟡 Mới nhận</option>
            <option value="contacted" ${l.status === 'contacted' ? 'selected' : ''}>🔵 Đã xếp số / Đã gọi</option>
            <option value="qualified" ${l.status === 'qualified' ? 'selected' : ''}>Tiềm năng</option>
            <option value="converted" ${l.status === 'converted' ? 'selected' : ''}>🟢 Đã thành BN</option>
            <option value="lost" ${l.status === 'lost' ? 'selected' : ''}>⚪ Không đạt</option>
          </select>
        </td>
        <td>
          <div style="display:flex; gap:4px; align-items:center; flex-wrap:wrap;">
            ${!isConverted ? `
              <button 
                class="btn btn-sm" 
                style="padding:4px 8px; font-size:11px; background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; font-weight:700;" 
                onclick="openKioskModal('${l.id}')"
                title="Phân buồng khám & Cấp số thứ tự Kiosk"
              >
                🎟️ Xếp Số
              </button>
              <button 
                class="btn btn-sm" 
                style="padding:4px 6px; font-size:11px; background:#f1f5f9; color:#0f172a;" 
                onclick="startVoipCall('${l.name}', '${l.phone}', '')"
                title="Gọi điện tổng đài VOIP"
              >
                📞
              </button>
              <button 
                class="btn btn-sm" 
                style="padding:4px 6px; font-size:11px; background:#eff6ff; color:#1e40af; border:1px solid #bfdbfe;" 
                onclick="sendZaloConfirmation('${l.id}')"
                title="Gửi xác nhận Zalo hẹn khám"
              >
                💬
              </button>
              <button 
                class="btn btn-sm btn-primary" 
                style="padding:4px 8px; font-size:11px;" 
                onclick="convertLeadToPatient('${l.id}')"
                title="Chuyển đổi thành Bệnh nhân chính thức"
              >
                ➔ Thành BN
              </button>
            ` : `
              <span style="font-size:11.5px; color:#16a34a; font-weight:700;">✓ Hồ sơ BN</span>
            `}
            <button 
              class="action-btn delete" 
              onclick="deleteLead('${l.id}')" 
              title="Xóa Lead"
            >
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function updateLeadStatus(id, newStatus) {
  const lead = allLeads.find(l => l.id === id);
  if (lead) {
    lead.status = newStatus;
    if (typeof saveLeads === 'function') saveLeads(allLeads);
    if (typeof showToast === 'function') {
      showToast('Cập nhật trạng thái', `Lead ${id} chuyển sang: ${newStatus}`, 'info');
    }
    applyLeadFilters();
  }
}

function convertLeadToPatient(leadId) {
  const lead = allLeads.find(l => l.id === leadId);
  if (!lead) return;

  if (!confirm(`Bạn có chắc muốn chuyển Lead ${lead.name} (${lead.phone}) thành Bệnh nhân chính thức của phòng khám?`)) {
    return;
  }

  // 1. Get existing patients
  const patients = typeof getPatients === 'function' ? getPatients() : [];
  const maxNum = patients.reduce((max, p) => {
    const n = parseInt(p.id.replace(/\D/g, '')) || 0;
    return n > max ? n : max;
  }, 0);
  const newPatientId = `KH${String(maxNum + 1).padStart(3, '0')}`;

  // Initial spend for a new patient
  const initialSpent = 3500000;
  const rankObj = typeof classifyPatient === 'function' ? classifyPatient(initialSpent) : { rank: 'bronze' };

  const newPatient = {
    id: newPatientId,
    name: lead.name,
    gender: lead.gender || 'Nam',
    age: 32,
    email: lead.email,
    phone: lead.phone,
    address: 'TP.HCM',
    service: lead.service,
    source: lead.source,
    totalSpent: initialSpent,
    rank: rankObj.rank,
    status: 'active',
    visits: 1,
    createdAt: new Date().toLocaleDateString('vi-VN'),
    lastContact: new Date().toLocaleDateString('vi-VN'),
    nextFollowUp: new Date(Date.now() + 7 * 86400000).toLocaleDateString('vi-VN'),
    overdueDays: 0,
    notes: `Chuyển đổi từ Lead ${lead.id}. Nhu cầu: ${lead.note || 'Tư vấn ban đầu'}`
  };

  patients.unshift(newPatient);
  if (typeof savePatients === 'function') savePatients(patients);

  // 2. Mark lead as converted
  lead.status = 'converted';
  if (typeof saveLeads === 'function') saveLeads(allLeads);

  if (typeof showToast === 'function') {
    showToast('Chuyển đổi thành công! 🎉', `Đã tạo hồ sơ bệnh nhân mới: ${newPatientId} — ${lead.name}`, 'success');
  }

  applyLeadFilters();
}

function deleteLead(id) {
  if (confirm(`Bạn có chắc muốn xóa Lead ${id}?`)) {
    allLeads = allLeads.filter(l => l.id !== id);
    if (typeof saveLeads === 'function') saveLeads(allLeads);
    if (typeof showToast === 'function') {
      showToast('Đã xóa', `Đã xóa Lead ${id}`, 'warning');
    }
    applyLeadFilters();
  }
}

// ── HTML5 Form Submission ──
function setupLeadForm() {
  const form = document.getElementById('leadCaptureForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // HTML5 validation has passed automatically
    const name    = document.getElementById('leadName').value.trim();
    const phone   = document.getElementById('leadPhone').value.trim();
    const email   = document.getElementById('leadEmail').value.trim();
    const gender  = document.getElementById('leadGender').value;
    const date    = document.getElementById('leadContactDate').value;
    const service = document.getElementById('leadService').value;
    const source  = document.getElementById('leadSource').value;
    const priority= document.querySelector('input[name="leadPriority"]:checked')?.value || 'medium';
    const notes   = document.getElementById('leadNotes').value.trim();

    const maxNum = allLeads.reduce((max, l) => {
      const n = parseInt(l.id.replace(/\D/g, '')) || 0;
      return n > max ? n : max;
    }, 0);
    const newLeadId = `LD${String(maxNum + 1).padStart(3, '0')}`;

    const newLead = {
      id: newLeadId,
      name,
      gender,
      email,
      phone,
      service,
      source,
      priority,
      status: 'new',
      note: notes || `Khách quan tâm ${service.toLowerCase()}.`,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      assignedTo: window.currentUser ? window.currentUser.name : 'Nhân viên CSKH'
    };

    allLeads.unshift(newLead);
    if (typeof saveLeads === 'function') saveLeads(allLeads);

    if (typeof showToast === 'function') {
      showToast('Tiếp nhận thành công!', `Đã thêm lead ${newLeadId} — ${name}`, 'success');
    }

    form.reset();
    setDefaultContactDate();
    applyLeadFilters();
  });
}

// ── KIOSK DISPATCHER LOGIC ──
let currentDispatchLead = null;

function openKioskModal(leadId) {
  const lead = allLeads.find(l => l.id === leadId);
  if (!lead) return;

  currentDispatchLead = lead;
  const modal = document.getElementById('kioskModal');
  const nameEl = document.getElementById('kioskPatientName');
  const serviceEl = document.getElementById('kioskServiceText');
  const numInput = document.getElementById('kioskNumberInput');

  if (nameEl) nameEl.textContent = lead.name;
  if (serviceEl) serviceEl.textContent = `${lead.service} · SĐT: ${lead.phone}`;

  generateNewKioskNumber();

  if (modal) modal.classList.add('open');
}

function closeKioskModal() {
  const modal = document.getElementById('kioskModal');
  if (modal) modal.classList.remove('open');
}

function generateNewKioskNumber() {
  const numInput = document.getElementById('kioskNumberInput');
  if (numInput) {
    const randNum = Math.floor(10 + Math.random() * 89);
    numInput.value = `#${randNum}`;
  }
}

function handleKioskDispatchSubmit(e) {
  e.preventDefault();
  if (!currentDispatchLead) return;

  const room = document.getElementById('kioskRoomSelect')?.value || 'Buồng 01 — Tim Mạch';
  const priority = document.getElementById('kioskPrioritySelect')?.value || 'Tiêu chuẩn Kiosk';
  const kioskNum = document.getElementById('kioskNumberInput')?.value || '#15';

  currentDispatchLead.status = 'contacted';
  currentDispatchLead.assignedTo = room.split('—')[0].trim();
  currentDispatchLead.note = (currentDispatchLead.note || '') + ` [Số thứ tự ưu tiên: ${kioskNum} — ${room}]`;

  if (typeof saveLeads === 'function') saveLeads(allLeads);

  closeKioskModal();

  if (typeof showToast === 'function') {
    showToast('Đã cấp số Kiosk!', `Bệnh nhân ${currentDispatchLead.name} đã được cấp Số ${kioskNum} tại ${room}`, 'success');
  }

  applyLeadFilters();
}

function sendZaloConfirmation(leadId) {
  const lead = allLeads.find(l => l.id === leadId);
  if (!lead) return;

  const msg = `[MedCare CRM] Kính gửi Quý khách ${lead.name}, Bệnh viện đã tiếp nhận đăng ký ${lead.service}. Quý khách vui lòng xuất trình mã hoặc đọc SĐT ${lead.phone} tại quầy tiếp đón Kiosk để nhận số thứ tự ưu tiên. Hotline hỗ trợ: xxxx-xxxx.`;

  navigator.clipboard?.writeText(msg).catch(() => {});

  if (typeof showToast === 'function') {
    showToast('Tin nhắn xác nhận Zalo', `Đã sao chép tin nhắn gửi tới ${lead.name} (${lead.phone})!`, 'info');
  } else {
    alert(msg);
  }
}

// Global exposes
window.updateLeadStatus = updateLeadStatus;
window.convertLeadToPatient = convertLeadToPatient;
window.deleteLead = deleteLead;
window.openKioskModal = openKioskModal;
window.closeKioskModal = closeKioskModal;
window.generateNewKioskNumber = generateNewKioskNumber;
window.handleKioskDispatchSubmit = handleKioskDispatchSubmit;
window.sendZaloConfirmation = sendZaloConfirmation;
