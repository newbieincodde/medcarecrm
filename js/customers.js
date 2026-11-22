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
  const btnReset     = document.getElementById('btnResetFilters');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      applyFilters();
    });
  }

  [rankFilter, serviceFilter, statusFilter].forEach(el => {
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
          <div class="td-name">${p.name}</div>
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
            <a href="customer-care.html?patientId=${p.id}" class="action-btn view" title="Xem lịch sử CSKH & tương tác">
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

// Global exposes
window.openModalForEdit = openModalForEdit;
window.confirmDelete = confirmDelete;
window.goToPage = goToPage;
