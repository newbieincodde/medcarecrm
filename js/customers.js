/**
 * ==============================================================================
 * MEDCARE CRM — Customers (Bệnh Nhân) Logic
 * CRUD, Phân loại Đồng/Bạc/Vàng, Bộ lọc, Phân trang, Xuất CSV
 * ==============================================================================
 */

let allPatients = [];
let filteredPatients = [];
let currentPage = 1;
const PAGE_SIZE = 10;

function initCustomersPage() {
  allPatients = typeof getPatients === 'function' ? getPatients() : [];

  populateServiceDropdowns();
  setupFilterListeners();
  setupModalEvents();
  setupExportCSV();

  // Check URL query parameters
  const params = new URLSearchParams(window.location.search);
  const searchParam = params.get('search');
  if (searchParam) {
    const sInput = document.getElementById('patientSearchInput');
    if (sInput) sInput.value = searchParam;
  }
  if (params.get('action') === 'new') {
    openModalForAdd();
  }

  applyFilters();
  updateRankStats();
}

function updateRankStats() {
  const stats = typeof getRankStats === 'function'
    ? getRankStats(allPatients)
    : { gold: 0, silver: 0, bronze: 0 };

  const elG = document.getElementById('statGoldCount');
  const elS = document.getElementById('statSilverCount');
  const elB = document.getElementById('statBronzeCount');

  if (elG) elG.textContent = stats.gold;
  if (elS) elS.textContent = stats.silver;
  if (elB) elB.textContent = stats.bronze;
}

function populateServiceDropdowns() {
  const services = window.SERVICES || [
    'Khám Sức Khỏe Tổng Quát', 'Tầm Soát Tim Mạch', 'Nha Khoa Thẩm Mỹ',
    'Da Liễu & Thẩm Mỹ Da', 'Khám Mắt & Điều Trị Cận Thị', 'Gói Mẹ & Bé',
    'Xét Nghiệm Máu Tại Nhà', 'Chẩn Đoán Hình Ảnh CT/MRI', 'Nội Khoa Tổng Quát', 'Tầm Soát Ung Thư'
  ];

  const filterSelect = document.getElementById('serviceFilter');
  const formSelect   = document.getElementById('pService');

  if (filterSelect) {
    services.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      filterSelect.appendChild(opt);
    });
  }

  if (formSelect) {
    services.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      formSelect.appendChild(opt);
    });
  }
}

function setupFilterListeners() {
  const searchInput  = document.getElementById('patientSearchInput');
  const rankFilter   = document.getElementById('rankFilter');
  const serviceFilter= document.getElementById('serviceFilter');
  const statusFilter = document.getElementById('statusFilter');
  const sortFilter   = document.getElementById('sortFilter');
  const btnReset     = document.getElementById('btnResetFilters');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      applyFilters();
    });
  }

  [rankFilter, serviceFilter, statusFilter, sortFilter].forEach(el => {
    if (el) {
      el.addEventListener('change', () => {
        currentPage = 1;
        applyFilters();
      });
    }
  });

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (rankFilter) rankFilter.value = 'all';
      if (serviceFilter) serviceFilter.value = 'all';
      if (statusFilter) statusFilter.value = 'all';
      if (sortFilter) sortFilter.value = 'default';
      currentPage = 1;
      applyFilters();
    });
  }
}

function applyFilters() {
  const searchVal  = (document.getElementById('patientSearchInput')?.value || '').trim().toLowerCase();
  const rankVal    = document.getElementById('rankFilter')?.value || 'all';
  const serviceVal = document.getElementById('serviceFilter')?.value || 'all';
  const statusVal  = document.getElementById('statusFilter')?.value || 'all';
  const sortVal    = document.getElementById('sortFilter')?.value || 'default';

  filteredPatients = allPatients.filter(p => {
    // Search match
    const matchSearch = !searchVal ||
      (p.name && p.name.toLowerCase().includes(searchVal)) ||
      (p.phone && p.phone.includes(searchVal)) ||
      (p.id && p.id.toLowerCase().includes(searchVal)) ||
      (p.email && p.email.toLowerCase().includes(searchVal));

    // Rank match
    const matchRank = rankVal === 'all' || p.rank === rankVal;

    // Service match
    const matchService = serviceVal === 'all' || p.service === serviceVal;

    // Status match
    const matchStatus = statusVal === 'all' || p.status === statusVal;

    return matchSearch && matchRank && matchService && matchStatus;
  });

  // Sorting
  if (sortVal === 'spent-desc') {
    filteredPatients.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
  } else if (sortVal === 'spent-asc') {
    filteredPatients.sort((a, b) => (a.totalSpent || 0) - (b.totalSpent || 0));
  } else if (sortVal === 'name-asc') {
    filteredPatients.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  } else if (sortVal === 'visits-desc') {
    filteredPatients.sort((a, b) => (b.visits || 0) - (a.visits || 0));
  }

  renderTable();
  renderPagination();
}

function renderTable() {
  const tbody = document.getElementById('patientTableBody');
  if (!tbody) return;

  if (filteredPatients.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <div class="empty-state-title">Không tìm thấy bệnh nhân nào</div>
            <div class="empty-state-desc">Hãy thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredPatients.slice(start, start + PAGE_SIZE);

  tbody.innerHTML = pageItems.map(p => {
    const rankInfo = typeof classifyPatient === 'function'
      ? classifyPatient(p.totalSpent)
      : { rank: p.rank, label: p.rank, icon: '⭐' };

    const statusBadge = p.status === 'active'
      ? `<span class="badge-status active">Đang điều trị</span>`
      : `<span class="badge-status inactive">Tạm ngưng</span>`;

    const formattedSpent = (p.totalSpent || 0).toLocaleString('vi-VN') + ' ₫';

    return `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>
          <div class="td-name" onclick="openEHRModal('${p.id}')" style="cursor:pointer; color:#0f766e; font-weight:700;" title="Nhấp để xem Bệnh Án Điện Tử 360°">
            ${p.name} 📋
          </div>
          <div style="font-size:11.5px; color:#64748b;">${p.gender}, ${p.age || 30} tuổi</div>
        </td>
        <td>
          <div>📞 ${p.phone}</div>
          <div style="font-size:11.5px; color:#64748b;">✉️ ${p.email || 'Chưa có'}</div>
        </td>
        <td><span style="font-size:12.5px; color:#475569;">${p.address || 'TP.HCM'}</span></td>
        <td>
          <span style="display:inline-block; max-width:180px; font-size:12.5px; color:#0f766e; font-weight:600;">
            ${p.service}
          </span>
        </td>
        <td style="font-weight:700; color:#0f172a;">${formattedSpent}</td>
        <td>
          <span class="badge-rank ${rankInfo.rank}">
            ${rankInfo.icon} ${rankInfo.label}
          </span>
        </td>
        <td>${statusBadge}</td>
        <td>
          <div style="display:flex; gap:4px;">
            <button class="action-btn view" onclick="openEHRModal('${p.id}')" title="Mở Bệnh Án Điện Tử 360°" style="background:#e6fffa; color:#0f766e; border:1px solid #99f6e4;">
              📋
            </button>
            <button class="action-btn" onclick="startVoipCall('${p.name}', '${p.phone}', '${p.id}')" title="Gọi tổng đài VOIP" style="background:#f1f5f9; color:#0f172a;">
              📞
            </button>
            <a href="customer-care.html?patientId=${p.id}" class="action-btn" title="Chăm sóc & Nhật ký">
              💬
            </a>
            <button class="action-btn edit" onclick="openModalForEdit('${p.id}')" title="Chỉnh sửa thông tin">
              ✏️
            </button>
            <button class="action-btn delete" onclick="confirmDelete('${p.id}')" title="Xóa bệnh nhân">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderPagination() {
  const total = filteredPatients.length;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const start = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end   = Math.min(currentPage * PAGE_SIZE, total);

  const infoEl = document.getElementById('paginationInfo');
  if (infoEl) {
    infoEl.textContent = `Hiển thị ${start} – ${end} trên tổng số ${total} bệnh nhân`;
  }

  const controls = document.getElementById('paginationControls');
  if (!controls) return;

  let btnsHtml = `
    <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">‹</button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      btnsHtml += `
        <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>
      `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      btnsHtml += `<span style="padding:0 4px; color:#94a3b8;">…</span>`;
    }
  }

  btnsHtml += `
    <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">›</button>
  `;

  controls.innerHTML = btnsHtml;
}

function goToPage(page) {
  const totalPages = Math.ceil(filteredPatients.length / PAGE_SIZE) || 1;
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable();
  renderPagination();
}

// ── MODAL ADD / EDIT ──
function setupModalEvents() {
  const btnOpen = document.getElementById('btnOpenAddModal');
  const btnClose = document.getElementById('btnCloseModal');
  const btnCancel = document.getElementById('btnCancelModal');
  const modal = document.getElementById('patientModal');
  const form = document.getElementById('patientForm');
  const pSpent = document.getElementById('pSpent');

  if (btnOpen) btnOpen.addEventListener('click', openModalForAdd);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Real-time rank preview on typing totalSpent
  if (pSpent) {
    pSpent.addEventListener('input', () => {
      const val = parseFloat(pSpent.value) || 0;
      const rank = typeof classifyPatient === 'function' ? classifyPatient(val) : { label: 'Đồng', icon: '🥉' };
      const hint = document.getElementById('rankPreviewHint');
      if (hint) {
        hint.innerHTML = `Hạng tự động: <strong>${rank.icon} Hạng ${rank.label}</strong> (≥15M: Vàng, 5M-15M: Bạc, <5M: Đồng)`;
      }
    });
  }

  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}

function openModalForAdd() {
  const form = document.getElementById('patientForm');
  if (form) form.reset();

  document.getElementById('editPatientId').value = '';
  document.getElementById('modalTitle').textContent = 'Thêm Bệnh Nhân Mới';
  document.getElementById('rankPreviewHint').innerHTML = 'Hạng tính toán tự động: 🥉 Hạng Đồng';
  document.getElementById('patientModal').classList.add('open');
}

function openModalForEdit(id) {
  const p = allPatients.find(x => x.id === id);
  if (!p) return;

  document.getElementById('editPatientId').value = p.id;
  document.getElementById('pName').value = p.name;
  document.getElementById('pPhone').value = p.phone;
  document.getElementById('pEmail').value = p.email || '';
  document.getElementById('pGender').value = p.gender || 'Nam';
  document.getElementById('pAge').value = p.age || 30;
  document.getElementById('pService').value = p.service;
  document.getElementById('pAddress').value = p.address || '';
  document.getElementById('pSpent').value = p.totalSpent || 0;
  document.getElementById('pStatus').value = p.status || 'active';
  document.getElementById('pNotes').value = p.notes || '';

  const rank = typeof classifyPatient === 'function' ? classifyPatient(p.totalSpent) : { label: p.rank, icon: '⭐' };
  document.getElementById('rankPreviewHint').innerHTML = `Hạng tự động: <strong>${rank.icon} Hạng ${rank.label}</strong>`;
  document.getElementById('modalTitle').textContent = `Chỉnh Sửa Bệnh Nhân: ${p.id}`;
  document.getElementById('patientModal').classList.add('open');
}

function closeModal() {
  document.getElementById('patientModal').classList.remove('open');
}

function handleFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('editPatientId').value;
  const name = document.getElementById('pName').value.trim();
  const phone = document.getElementById('pPhone').value.trim();
  const email = document.getElementById('pEmail').value.trim();
  const gender = document.getElementById('pGender').value;
  const age = parseInt(document.getElementById('pAge').value) || 30;
  const service = document.getElementById('pService').value;
  const address = document.getElementById('pAddress').value.trim();
  const totalSpent = parseFloat(document.getElementById('pSpent').value) || 0;
  const status = document.getElementById('pStatus').value;
  const notes = document.getElementById('pNotes').value.trim();

  // CLASSIFICATION LOGIC (Yêu cầu học phần)
  const rankObj = typeof classifyPatient === 'function' ? classifyPatient(totalSpent) : { rank: 'bronze' };

  if (id) {
    // Edit existing
    const idx = allPatients.findIndex(x => x.id === id);
    if (idx !== -1) {
      allPatients[idx] = {
        ...allPatients[idx],
        name, phone, email, gender, age, service, address,
        totalSpent,
        rank: rankObj.rank,
        status, notes
      };
      if (typeof savePatients === 'function') savePatients(allPatients);
      if (typeof showToast === 'function') {
        showToast('Cập nhật thành công', `Đã lưu thông tin bệnh nhân ${id} (Hạng ${rankObj.label})`, 'success');
      }
    }
  } else {
    // Add new
    const maxNum = allPatients.reduce((max, p) => {
      const n = parseInt(p.id.replace(/\D/g, '')) || 0;
      return n > max ? n : max;
    }, 0);
    const newId = `KH${String(maxNum + 1).padStart(3, '0')}`;

    const newPatient = {
      id: newId,
      name, phone, email, gender, age, service, address,
      totalSpent,
      rank: rankObj.rank,
      status, notes,
      visits: 1,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      lastContact: new Date().toLocaleDateString('vi-VN'),
      nextFollowUp: new Date(Date.now() + 7 * 86400000).toLocaleDateString('vi-VN'),
      overdueDays: 0
    };

    allPatients.unshift(newPatient);
    if (typeof savePatients === 'function') savePatients(allPatients);
    if (typeof showToast === 'function') {
      showToast('Thêm mới thành công', `Đã tạo hồ sơ bệnh nhân ${newId} (${name})`, 'success');
    }
  }

  closeModal();
  updateRankStats();
  applyFilters();
}

function confirmDelete(id) {
  const p = allPatients.find(x => x.id === id);
  if (!p) return;

  if (confirm(`Bạn có chắc chắn muốn xóa bệnh nhân ${p.id} — ${p.name}? Hành động này sẽ cập nhật lại LocalStorage.`)) {
    allPatients = allPatients.filter(x => x.id !== id);
    if (typeof savePatients === 'function') savePatients(allPatients);
    if (typeof showToast === 'function') {
      showToast('Đã xóa', `Đã xóa hồ sơ bệnh nhân ${id}`, 'warning');
    }
    updateRankStats();
    applyFilters();
  }
}

// Export CSV
function setupExportCSV() {
  const btn = document.getElementById('btnExportCSV');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (allPatients.length === 0) {
      alert('Không có dữ liệu bệnh nhân để xuất file.');
      return;
    }

    const headers = ['Mã BN', 'Họ Tên', 'Giới Tính', 'Tuổi', 'SĐT', 'Email', 'Địa Chỉ', 'Dịch Vụ', 'Tổng Chi Tiêu', 'Phân Hạng', 'Trạng Thái'];
    const rows = allPatients.map(p => [
      `"${p.id}"`,
      `"${p.name}"`,
      `"${p.gender}"`,
      `"${p.age}"`,
      `"${p.phone}"`,
      `"${p.email || ''}"`,
      `"${p.address || ''}"`,
      `"${p.service}"`,
      `"${p.totalSpent}"`,
      `"${p.rank}"`,
      `"${p.status}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MedCare_DanhSachBenhNhan_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    if (typeof showToast === 'function') {
      showToast('Xuất file thành công', 'File CSV danh sách bệnh nhân đã được tải về máy.', 'success');
    }
  });
}

// ── ELECTRONIC HEALTH RECORD (EHR 360°) MODAL LOGIC ──
let activeEHRTab = 'clinical';
let currentEHRPatient = null;

function openEHRModal(patientId) {
  const p = allPatients.find(x => x.id === patientId);
  if (!p) return;

  currentEHRPatient = p;
  activeEHRTab = 'clinical';

  const modal = document.getElementById('ehrModal');
  const container = document.getElementById('ehrModalContent');
  if (!modal || !container) return;

  renderEHRModalContent();
  modal.classList.add('open');
}

function closeEHRModal() {
  const modal = document.getElementById('ehrModal');
  if (modal) modal.classList.remove('open');
}

function switchEHRTab(tabName) {
  activeEHRTab = tabName;
  renderEHRModalContent();
}

function renderEHRModalContent() {
  const container = document.getElementById('ehrModalContent');
  if (!container || !currentEHRPatient) return;

  const p = currentEHRPatient;
  const isMale = p.gender === 'Nam';
  const weight = p.weight || (isMale ? 68 : 52);
  const height = p.height || (isMale ? 172 : 158);
  const bmi = (weight / ((height/100) * (height/100))).toFixed(1);
  const bmiLabel = bmi < 18.5 ? 'Gầy' : bmi <= 24.9 ? 'Cân đối' : 'Tiền béo phì';
  const bhytCode = p.bhyt || `DN 4 79 ${(p.id.replace(/\D/g,'') || '101').padEnd(10, '0')}`;
  const bloodType = p.bloodType || (['O+', 'A+', 'B+', 'AB+'][p.id.charCodeAt(p.id.length-1) % 4]);
  const bp = (p.totalSpent || 0) >= 15000000 ? '135/85 mmHg' : '120/80 mmHg';
  const hr = 72 + (p.age % 8);

  const rankInfo = typeof classifyPatient === 'function'
    ? classifyPatient(p.totalSpent || 0)
    : { rank: p.rank, label: p.rank, icon: '⭐' };

  // Sample clinical encounters
  const encounters = [
    {
      date: p.lastContact || '15/11/2026',
      service: p.service || 'Khám Chuyên Khoa Tim Mạch',
      doctor: 'BS. CKII Nguyễn Minh Nhân',
      icd: 'I10 — Bệnh tăng huyết áp vô căn (nguyên phát)',
      note: 'Huyết áp kiểm soát ổn định, tim đều, không phù chi. Đề nghị duy trì phác đồ hiện tại và ăn giảm muối.',
      fee: 1450000
    },
    {
      date: '10/08/2026',
      service: 'Tầm Soát Tim Mạch & Điện Tâm Đồ (ECG)',
      doctor: 'BS. CKII Trần Thị Mai',
      icd: 'Z01.8 — Khám chuyên khoa đặc biệt khác',
      note: 'ECG nhịp xoang đều, siêu âm tim chức năng tâm thu thất trái EF 65% trong giới hạn bình thường.',
      fee: 2800000
    }
  ];

  // Sample prescriptions
  const prescriptions = [
    { name: 'Amlodipine 5mg', dose: '1 viên / ngày (Sáng sau ăn)', qty: '30 viên', note: 'Hạ áp mạch vành' },
    { name: 'Losartan Potassium 50mg', dose: '1 viên / ngày (Sáng)', qty: '30 viên', note: 'Ổn định huyết áp' },
    { name: 'Panadol Extra 500mg', dose: '1 viên khi đau đầu (cách 6h)', qty: '10 viên', note: 'Giảm đau nhẹ' },
    { name: 'Omega-3 Fish Oil 1000mg', dose: '1 viên / ngày (Tối)', qty: '60 viên', note: 'Bổ trợ tim mạch' }
  ];

  // Interactions history
  let interactions = [];
  try {
    const raw = localStorage.getItem('medcare_interactions');
    if (raw) {
      const allInt = JSON.parse(raw);
      interactions = allInt.filter(i => i.patientId === p.id);
    }
  } catch(e) {}
  if (interactions.length === 0) {
    interactions = [
      { date: p.lastContact || '15/11/2026', type: 'Gọi điện hỏi thăm', staff: 'Trần Thị Mai', note: 'Hỏi thăm phản ứng sau khi dùng thuốc hạ áp, bệnh nhân tuân thủ tốt, huyết áp ổn định.' },
      { date: '12/08/2026', type: 'Nhắc lịch tái khám', staff: 'Lê Văn Hùng', note: 'Nhắc lịch tái khám định kỳ theo chỉ định bác sĩ.' }
    ];
  }

  container.innerHTML = `
    <!-- Top EHR Banner -->
    <div class="ehr-banner">
      <div class="ehr-header-top">
        <div>
          <div class="ehr-seal">BỘ Y TẾ VIỆT NAM · BỆNH ÁN ĐIỆN TỬ (EHR 360°)</div>
          <div class="ehr-title">HỒ SƠ THEO DÕI SỨC KHỎE BỆNH NHÂN TOÀN DIỆN</div>
        </div>
        <button type="button" class="portal-modal-close" style="color:white; font-size:24px;" onclick="closeEHRModal()">✕</button>
      </div>

      <div class="ehr-patient-profile">
        <div class="ehr-avatar">${p.name.charAt(0).toUpperCase()}</div>
        <div style="flex:1;">
          <div class="ehr-bio-name">
            ${p.name.toUpperCase()}
            <span class="badge-rank ${rankInfo.rank}" style="font-size:12px; padding:3px 10px;">
              ${rankInfo.icon} Hạng ${rankInfo.label}
            </span>
            <span style="font-size:12px; background:rgba(255,255,255,0.2); padding:3px 8px; border-radius:6px; font-weight:600;">
              Mã: ${p.id}
            </span>
          </div>

          <div class="ehr-bio-meta-row">
            <span>Giới tính: <strong>${p.gender}</strong></span>
            <span>Tuổi: <strong>${p.age || 32}</strong></span>
            <span>Nhóm máu: <strong>${bloodType}</strong></span>
            <span>Mã BHYT: <strong>${bhytCode}</strong></span>
            <span>SĐT: <strong>${p.phone}</strong></span>
            <span>Địa chỉ: <strong>${p.address || 'TP. Hồ Chí Minh'}</strong></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Clinical Vitals Grid -->
    <div class="ehr-vitals-grid">
      <div class="ehr-vital-box">
        <div class="ehr-vital-icon bp">🩺</div>
        <div class="ehr-vital-info">
          <span class="ehr-vital-label">Huyết Áp (BP)</span>
          <span class="ehr-vital-val">${bp}</span>
          <span class="ehr-vital-tag">✓ Huyết áp mục tiêu</span>
        </div>
      </div>

      <div class="ehr-vital-box">
        <div class="ehr-vital-icon hr">💓</div>
        <div class="ehr-vital-info">
          <span class="ehr-vital-label">Nhịp Tim (Pulse)</span>
          <span class="ehr-vital-val">${hr} bpm</span>
          <span class="ehr-vital-tag">✓ Nhịp xoang đều</span>
        </div>
      </div>

      <div class="ehr-vital-box">
        <div class="ehr-vital-icon bmi">⚖️</div>
        <div class="ehr-vital-info">
          <span class="ehr-vital-label">Chiều cao / Cân nặng</span>
          <span class="ehr-vital-val">${height}cm · ${weight}kg</span>
          <span class="ehr-vital-tag" style="color:#2563eb;">BMI: ${bmi} (${bmiLabel})</span>
        </div>
      </div>

      <div class="ehr-vital-box">
        <div class="ehr-vital-icon spo2">🫁</div>
        <div class="ehr-vital-info">
          <span class="ehr-vital-label">Nồng Độ Oxy SpO2</span>
          <span class="ehr-vital-val">98%</span>
          <span class="ehr-vital-tag">✓ Bão hòa oxy tốt</span>
        </div>
      </div>
    </div>

    <!-- Medical History Alert -->
    <div style="padding: 0 28px;">
      <div class="ehr-alert-box">
        <span style="font-size:20px;">⚠️</span>
        <div style="flex:1;">
          <strong>Tiền sử bệnh lý:</strong> ${p.medicalHistory || 'Tăng huyết áp nguyên phát độ 1, có tiền sử đau dạ dày nhẹ.'}<br>
          <strong style="color:#dc2626;">Dị ứng thuốc & thức ăn:</strong> ${p.allergies || 'Dị ứng kháng sinh nhóm Penicillin (nổi ban, ngứa). Chống chỉ định dùng Amoxicillin.'}
        </div>
      </div>
    </div>

    <!-- EHR Tabs Header -->
    <div class="ehr-tabs">
      <button type="button" class="ehr-tab-btn ${activeEHRTab === 'clinical' ? 'active' : ''}" onclick="switchEHRTab('clinical')">
        📋 Lịch Sử Khám & ICD-10
      </button>
      <button type="button" class="ehr-tab-btn ${activeEHRTab === 'prescriptions' ? 'active' : ''}" onclick="switchEHRTab('prescriptions')">
        💊 Đơn Thuốc & Toa Thuốc Điện Tử
      </button>
      <button type="button" class="ehr-tab-btn ${activeEHRTab === 'care' ? 'active' : ''}" onclick="switchEHRTab('care')">
        💬 Nhật Ký Chăm Sóc & Tái Khám (${interactions.length})
      </button>
    </div>

    <!-- Tab 1: Clinical encounters -->
    ${activeEHRTab === 'clinical' ? `
      <div class="ehr-tab-content">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ngày Khám</th>
                <th>Chuyên Khoa</th>
                <th>Bác Sĩ Phụ Trách</th>
                <th>Chẩn Đoán ICD-10</th>
                <th>Kết Luận & Diễn Tiến</th>
                <th>Chi Phí</th>
              </tr>
            </thead>
            <tbody>
              ${encounters.map(e => `
                <tr>
                  <td><strong>${e.date}</strong></td>
                  <td><span style="color:#0f766e; font-weight:600;">${e.service}</span></td>
                  <td>${e.doctor}</td>
                  <td><span style="background:#f1f5f9; padding:2px 8px; border-radius:4px; font-weight:600; font-size:12px;">${e.icd}</span></td>
                  <td style="font-size:12.5px; color:#475569; max-width:280px;">${e.note}</td>
                  <td style="font-weight:700; color:#0f172a;">${e.fee.toLocaleString('vi-VN')} ₫</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <!-- Tab 2: Prescriptions -->
    ${activeEHRTab === 'prescriptions' ? `
      <div class="ehr-tab-content">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên Thuốc / Hàm Lượng</th>
                <th>Liều Dùng & Hướng Dẫn</th>
                <th>Số Lượng</th>
                <th>Chỉ Định / Mục Đích</th>
              </tr>
            </thead>
            <tbody>
              ${prescriptions.map(rx => `
                <tr>
                  <td><strong style="color:#0f766e;">${rx.name}</strong></td>
                  <td>${rx.dose}</td>
                  <td><strong>${rx.qty}</strong></td>
                  <td><span style="font-size:12px; color:#64748b;">${rx.note}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <!-- Tab 3: Care and follow-up -->
    ${activeEHRTab === 'care' ? `
      <div class="ehr-tab-content">
        <div style="margin-bottom:14px; font-size:13px; color:#64748b;">
          Lịch hẹn tái khám tiếp theo: <strong style="color:#0f766e;">${p.nextFollowUp || 'Chưa đặt hẹn'}</strong>
          ${p.overdueDays > 0 ? `<span class="badge-status" style="background:#fee2e2; color:#dc2626; margin-left:8px;">Quá hạn ${p.overdueDays} ngày</span>` : ''}
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Thời Gian</th>
                <th>Kênh Tương Tác</th>
                <th>Nhân Viên Phụ Trách</th>
                <th>Ghi Chú Trao Đổi</th>
              </tr>
            </thead>
            <tbody>
              ${interactions.map(it => `
                <tr>
                  <td><strong>${it.date}</strong></td>
                  <td><span style="background:#f1f5f9; padding:2px 8px; border-radius:4px; font-weight:600;">${it.type}</span></td>
                  <td>${it.staff || 'Trần Thị Mai'}</td>
                  <td style="font-size:12.5px; color:#475569;">${it.note}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    <!-- EHR Actions Footer Toolbar -->
    <div class="ehr-actions-bar">
      <div style="display:flex; gap:10px;">
        <button type="button" class="btn btn-primary btn-sm" onclick="startVoipCall('${p.name}', '${p.phone}', '${p.id}')">
          <span>📞</span> Gọi VOIP Bệnh Nhân
        </button>
        <a href="customer-care.html?patientId=${p.id}" class="btn btn-outline btn-sm">
          <span>💬</span> Ghi Nhật Ký Chăm Sóc
        </a>
        <a href="sales.html?patientId=${p.id}" class="btn btn-outline btn-sm">
          <span>🧾</span> Lập Hóa Đơn Thu Viện Phí
        </a>
      </div>

      <div style="display:flex; gap:10px;">
        <button type="button" class="btn btn-outline btn-sm" onclick="window.print()">
          <span>🖨️</span> In Hồ Sơ Bệnh Án
        </button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeEHRModal()">
          Đóng
        </button>
      </div>
    </div>
  `;
}

// Global exposes
window.openModalForEdit = openModalForEdit;
window.confirmDelete = confirmDelete;
window.goToPage = goToPage;
window.openEHRModal = openEHRModal;
window.closeEHRModal = closeEHRModal;
window.switchEHRTab = switchEHRTab;
