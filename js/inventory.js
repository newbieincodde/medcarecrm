/**
 * ==============================================================================
 * MEDCARE CRM — Inventory (Kho Dược & Vật tư Y tế) Logic
 * ==============================================================================
 */

let allInventory = [];
let filteredInventory = [];

function initInventoryPage() {
  allInventory = typeof getInventory === 'function' ? getInventory() : [];

  populateCategoryFilter();
  setupInventoryFilters();
  setupInventoryModal();
  setupExportInventory();

  applyInventoryFilters();
  updateInventoryKPIs();
}

function updateInventoryKPIs() {
  const totalItems = allInventory.length;
  const lowStock   = allInventory.filter(i => i.stock <= i.minStock).length;
  const totalQty   = allInventory.reduce((s, i) => s + (i.stock || 0), 0);
  const totalVal   = allInventory.reduce((s, i) => s + ((i.stock || 0) * (i.price || 0)), 0);

  const elItems = document.getElementById('kpiTotalItems');
  const elLow   = document.getElementById('kpiLowStock');
  const elQty   = document.getElementById('kpiTotalQty');
  const elVal   = document.getElementById('kpiTotalVal');

  if (elItems) elItems.textContent = totalItems;
  if (elLow) elLow.textContent = lowStock;
  if (elQty) elQty.textContent = totalQty.toLocaleString('vi-VN');
  if (elVal) elVal.textContent = (totalVal / 1000000).toFixed(1) + ' Triệu ₫';
}

function populateCategoryFilter() {
  const select = document.getElementById('invCategoryFilter');
  if (!select) return;

  const categories = [...new Set(allInventory.map(i => i.category))];
  categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
}

function setupInventoryFilters() {
  const searchInput = document.getElementById('inventorySearch');
  const catFilter   = document.getElementById('invCategoryFilter');
  const statFilter  = document.getElementById('invStatusFilter');
  const btnReset    = document.getElementById('btnResetInvFilters');

  if (searchInput) searchInput.addEventListener('input', applyInventoryFilters);
  if (catFilter) catFilter.addEventListener('change', applyInventoryFilters);
  if (statFilter) statFilter.addEventListener('change', applyInventoryFilters);

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (catFilter) catFilter.value = 'all';
      if (statFilter) statFilter.value = 'all';
      applyInventoryFilters();
    });
  }
}

function applyInventoryFilters() {
  const searchVal = (document.getElementById('inventorySearch')?.value || '').trim().toLowerCase();
  const catVal    = document.getElementById('invCategoryFilter')?.value || 'all';
  const statVal   = document.getElementById('invStatusFilter')?.value || 'all';

  filteredInventory = allInventory.filter(item => {
    const matchSearch = !searchVal ||
      item.name.toLowerCase().includes(searchVal) ||
      item.id.toLowerCase().includes(searchVal) ||
      item.category.toLowerCase().includes(searchVal);

    const matchCat = catVal === 'all' || item.category === catVal;

    let matchStat = true;
    if (statVal === 'low') matchStat = item.stock <= item.minStock;
    else if (statVal === 'normal') matchStat = item.stock > item.minStock;

    return matchSearch && matchCat && matchStat;
  });

  renderInventoryTable();
}

function renderInventoryTable() {
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;

  if (filteredInventory.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align:center; padding:32px; color:#64748b;">
          Không tìm thấy mặt hàng dược phẩm nào.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredInventory.map(item => {
    const isLow = item.stock <= item.minStock;
    const statusBadge = isLow
      ? `<span class="badge-status" style="background:#fee2e2; color:#dc2626;">⚠️ Sắp hết (${item.stock}/${item.minStock})</span>`
      : `<span class="badge-status" style="background:#dcfce7; color:#16a34a;">🟢 Bình thường</span>`;

    const formattedPrice = (item.price || 0).toLocaleString('vi-VN') + ' ₫';

    return `
      <tr>
        <td><strong>${item.id}</strong></td>
        <td>
          <div style="font-weight:700; color:#0f172a;">${item.name}</div>
        </td>
        <td><span style="font-size:12.5px; color:#475569;">${item.category}</span></td>
        <td><span style="font-weight:600;">${item.unit}</span></td>
        <td style="font-weight:800; font-size:15px; color:${isLow ? '#dc2626' : '#0f766e'};">
          ${item.stock}
        </td>
        <td style="color:#64748b;">${item.minStock}</td>
        <td style="font-weight:600;">${formattedPrice}</td>
        <td><span style="font-size:12.5px; color:#64748b;">${item.expiry}</span></td>
        <td>${statusBadge}</td>
        <td>
          <div style="display:flex; gap:4px; align-items:center;">
            <button class="btn btn-sm btn-outline" style="padding:2px 8px; font-size:11px;" onclick="adjustStock('${item.id}', 10)" title="Nhập thêm 10 đơn vị">
              +10
            </button>
            <button class="btn btn-sm btn-outline" style="padding:2px 8px; font-size:11px;" onclick="adjustStock('${item.id}', -1)" title="Xuất 1 đơn vị">
              -1
            </button>
            <button class="action-btn edit" onclick="openMedModalForEdit('${item.id}')" title="Chỉnh sửa">
              ✏️
            </button>
            <button class="action-btn delete" onclick="deleteMedItem('${item.id}')" title="Xóa">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function adjustStock(id, delta) {
  const item = allInventory.find(i => i.id === id);
  if (!item) return;

  const newStock = Math.max(0, (item.stock || 0) + delta);
  item.stock = newStock;
  item.status = newStock <= item.minStock ? 'low' : 'normal';

  if (typeof saveInventory === 'function') saveInventory(allInventory);

  if (typeof showToast === 'function') {
    const actionText = delta > 0 ? `Đã nhập thêm +${delta}` : `Đã xuất ${Math.abs(delta)}`;
    showToast('Cập nhật tồn kho', `${actionText} ${item.unit} ${item.name}. Tồn hiện tại: ${newStock}`, 'info');
  }

  updateInventoryKPIs();
  applyInventoryFilters();
}

// ── Modal Add / Edit ──
function setupInventoryModal() {
  const btnOpen = document.getElementById('btnOpenAddMedicineModal');
  const btnClose = document.getElementById('btnCloseMedModal');
  const btnCancel = document.getElementById('btnCancelMed');
  const modal = document.getElementById('medicineModal');
  const form = document.getElementById('medicineForm');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      form.reset();
      document.getElementById('editMedId').value = '';
      document.getElementById('medicineModalTitle').textContent = 'Nhập Dược Phẩm Mới';
      modal.classList.add('open');
    });
  }

  [btnClose, btnCancel].forEach(b => {
    if (b) b.addEventListener('click', () => modal.classList.remove('open'));
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const editId = document.getElementById('editMedId').value;
      const name = document.getElementById('medName').value.trim();
      const category = document.getElementById('medCategory').value;
      const unit = document.getElementById('medUnit').value;
      const stock = parseInt(document.getElementById('medStock').value) || 0;
      const minStock = parseInt(document.getElementById('medMinStock').value) || 0;
      const price = parseFloat(document.getElementById('medPrice').value) || 0;
      const expiry = document.getElementById('medExpiry').value.trim();

      const status = stock <= minStock ? 'low' : 'normal';

      if (editId) {
        // Edit
        const idx = allInventory.findIndex(i => i.id === editId);
        if (idx !== -1) {
          allInventory[idx] = { ...allInventory[idx], name, category, unit, stock, minStock, price, expiry, status };
          if (typeof showToast === 'function') showToast('Thành công', `Đã cập nhật ${editId}`, 'success');
        }
      } else {
        // Add
        const maxNum = allInventory.reduce((max, i) => {
          const n = parseInt(i.id.replace(/\D/g, '')) || 0;
          return n > max ? n : max;
        }, 0);
        const newId = `MED${String(maxNum + 1).padStart(3, '0')}`;

        allInventory.push({ id: newId, name, category, unit, stock, minStock, price, expiry, status });
        if (typeof showToast === 'function') showToast('Nhập kho thành công', `Đã thêm ${newId} — ${name}`, 'success');
      }

      if (typeof saveInventory === 'function') saveInventory(allInventory);

      modal.classList.remove('open');
      updateInventoryKPIs();
      applyInventoryFilters();
    });
  }
}

function openMedModalForEdit(id) {
  const item = allInventory.find(i => i.id === id);
  if (!item) return;

  document.getElementById('editMedId').value = item.id;
  document.getElementById('medName').value = item.name;
  document.getElementById('medCategory').value = item.category;
  document.getElementById('medUnit').value = item.unit;
  document.getElementById('medStock').value = item.stock;
  document.getElementById('medMinStock').value = item.minStock;
  document.getElementById('medPrice').value = item.price;
  document.getElementById('medExpiry').value = item.expiry;

  document.getElementById('medicineModalTitle').textContent = `Chỉnh Sửa Dược Phẩm: ${item.id}`;
  document.getElementById('medicineModal').classList.add('open');
}

function deleteMedItem(id) {
  if (confirm(`Bạn có chắc muốn xóa dược phẩm ${id}?`)) {
    allInventory = allInventory.filter(i => i.id !== id);
    if (typeof saveInventory === 'function') saveInventory(allInventory);
    if (typeof showToast === 'function') showToast('Đã xóa', `Đã xóa mặt hàng ${id}`, 'warning');
    updateInventoryKPIs();
    applyInventoryFilters();
  }
}

function setupExportInventory() {
  const btn = document.getElementById('btnExportInventory');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const headers = ['Mã Thuốc', 'Tên Dược Phẩm', 'Danh Mục', 'ĐVT', 'Tồn Kho', 'Tối Thiểu', 'Đơn Giá', 'Hạn Dùng', 'Tình Trạng'];
    const rows = allInventory.map(i => [
      `"${i.id}"`, `"${i.name}"`, `"${i.category}"`, `"${i.unit}"`, `"${i.stock}"`,
      `"${i.minStock}"`, `"${i.price}"`, `"${i.expiry}"`, `"${i.status}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MedCare_KiemKho_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  });
}

// Global exposes
window.adjustStock = adjustStock;
window.openMedModalForEdit = openMedModalForEdit;
window.deleteMedItem = deleteMedItem;
