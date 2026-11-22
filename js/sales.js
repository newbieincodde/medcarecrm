/**
 * ==============================================================================
 * MEDCARE CRM — Sales & Billing (Hóa Đơn & Thu Ngân) Logic
 * ==============================================================================
 */

let allInvoices = [];
let allPatients = [];
let filteredInvoices = [];

function initSalesPage() {
  allInvoices = typeof getInvoices === 'function' ? getInvoices() : [];
  allPatients = typeof getPatients === 'function' ? getPatients() : [];

  setupSalesFilters();
  setupInvoiceModal();
  setupExportInvoices();

  applySalesFilters();
  updateSalesKPIs();
}

function updateSalesKPIs() {
  const paidInvoices = allInvoices.filter(i => i.status === 'Đã thanh toán');
  const totalPaidVal = paidInvoices.reduce((s, i) => s + (i.amount || 0), 0);
  const totalCount   = allInvoices.length;

  const digitalCount = allInvoices.filter(i => i.paymentMethod === 'Chuyển khoản QR' || i.paymentMethod === 'Thẻ Visa/Master').length;
  const digitalPct   = totalCount > 0 ? Math.round((digitalCount / totalCount) * 100) : 0;
  const pendingCount = allInvoices.filter(i => i.status === 'Chờ thanh toán').length;

  const elTotal   = document.getElementById('kpiSalesTotal');
  const elCount   = document.getElementById('kpiInvoiceCount');
  const elDigital = document.getElementById('kpiDigitalPercent');
  const elPending = document.getElementById('kpiPendingCount');

  if (elTotal) elTotal.textContent = (totalPaidVal / 1000000).toFixed(1) + ' Triệu ₫';
  if (elCount) elCount.textContent = totalCount;
  if (elDigital) elDigital.textContent = `${digitalPct}%`;
  if (elPending) elPending.textContent = `${pendingCount} HĐ`;
}

function setupSalesFilters() {
  const searchInput  = document.getElementById('invoiceSearch');
  const methodFilter = document.getElementById('payMethodFilter');
  const statusFilter = document.getElementById('invoiceStatusFilter');
  const btnReset     = document.getElementById('btnResetInvoiceFilters');

  if (searchInput) searchInput.addEventListener('input', applySalesFilters);
  if (methodFilter) methodFilter.addEventListener('change', applySalesFilters);
  if (statusFilter) statusFilter.addEventListener('change', applySalesFilters);

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (methodFilter) methodFilter.value = 'all';
      if (statusFilter) statusFilter.value = 'all';
      applySalesFilters();
    });
  }
}

function applySalesFilters() {
  const searchVal = (document.getElementById('invoiceSearch')?.value || '').trim().toLowerCase();
  const methodVal = document.getElementById('payMethodFilter')?.value || 'all';
  const statusVal = document.getElementById('invoiceStatusFilter')?.value || 'all';

  filteredInvoices = allInvoices.filter(inv => {
    const matchSearch = !searchVal ||
      inv.id.toLowerCase().includes(searchVal) ||
      inv.patientName.toLowerCase().includes(searchVal) ||
      (inv.phone && inv.phone.includes(searchVal));

    const matchMethod = methodVal === 'all' || inv.paymentMethod === methodVal;
    const matchStatus = statusVal === 'all' || inv.status === statusVal;

    return matchSearch && matchMethod && matchStatus;
  });

  renderInvoicesTable();
}

function renderInvoicesTable() {
  const tbody = document.getElementById('invoicesTableBody');
  if (!tbody) return;

  if (filteredInvoices.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align:center; padding:32px; color:#64748b;">
          Không tìm thấy hóa đơn thu ngân nào.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredInvoices.map(inv => {
    const isPaid = inv.status === 'Đã thanh toán';
    const statusBadge = isPaid
      ? `<span class="badge-status active">✓ Đã thanh toán</span>`
      : `<span class="badge-status" style="background:#fef3c7; color:#d97706;">⏳ Chờ thanh toán</span>`;

    const formattedAmount = (inv.amount || 0).toLocaleString('vi-VN') + ' ₫';

    return `
      <tr>
        <td><strong>${inv.id}</strong></td>
        <td>
          <div style="font-weight:700; color:#0f172a;">${inv.patientName}</div>
          <div style="font-size:11.5px; color:#64748b;">${inv.patientId}</div>
        </td>
        <td>${inv.phone || '—'}</td>
        <td><span style="font-size:12.5px; color:#0f766e; font-weight:600;">${inv.service}</span></td>
        <td style="font-weight:800; font-size:14.5px; color:#0f172a;">${formattedAmount}</td>
        <td>
          <span style="font-size:12.5px; background:#f1f5f9; padding:3px 8px; border-radius:6px; color:#475569; font-weight:500;">
            ${inv.paymentMethod}
          </span>
        </td>
        <td>${statusBadge}</td>
        <td><span style="font-size:12px; color:#64748b;">${inv.cashier || 'Thu ngân'}</span></td>
        <td><span style="font-size:12px; color:#64748b;">${inv.createdAt}</span></td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sm btn-outline" onclick="printReceipt('${inv.id}')" title="In phiếu thu">
              🖨️ In
            </button>
            ${!isPaid ? `
              <button class="btn btn-sm btn-primary" onclick="markAsPaid('${inv.id}')" title="Thu tiền">
                ✓ Thu
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function printReceipt(invoiceId) {
  const inv = allInvoices.find(i => i.id === invoiceId);
  if (!inv) return;

  const formattedAmount = (inv.amount || 0).toLocaleString('vi-VN') + ' ₫';

  const receiptWindow = window.open('', '_blank', 'width=450,height=600');
  receiptWindow.document.write(`
    <html>
      <head>
        <title>Phiếu Thu Viện Phí — ${inv.id}</title>
        <style>
          body { font-family: sans-serif; padding: 24px; color: #1e293b; font-size: 13px; line-height: 1.5; }
          .title { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 4px; color: #0f766e; }
          .sub { text-align: center; font-size: 11px; color: #64748b; margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .divider { border-top: 1px dashed #cbd5e1; margin: 16px 0; }
          .total { font-size: 16px; font-weight: bold; color: #0f766e; }
          .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="title">TRUNG TÂM Y TẾ MEDCARE</div>
        <div class="sub">PHIẾU THU VIỆN PHÍ & DỊCH VỤ KHÁM</div>
        <div class="row"><span>Mã hóa đơn:</span><strong>${inv.id}</strong></div>
        <div class="row"><span>Ngày lập:</span><span>${inv.createdAt}</span></div>
        <div class="row"><span>Bệnh nhân:</span><strong>${inv.patientName} (${inv.patientId})</strong></div>
        <div class="row"><span>Số điện thoại:</span><span>${inv.phone || '—'}</span></div>
        <div class="divider"></div>
        <div class="row"><span>Dịch vụ y tế:</span><strong>${inv.service}</strong></div>
        <div class="row"><span>Hình thức:</span><span>${inv.paymentMethod}</span></div>
        <div class="row"><span>Thu ngân:</span><span>${inv.cashier || 'Nguyễn Minh Nhân'}</span></div>
        <div class="divider"></div>
        <div class="row total"><span>TỔNG THANH TOÁN:</span><span>${formattedAmount}</span></div>
        <div class="row"><span>Trạng thái:</span><strong style="color:#16a34a;">${inv.status}</strong></div>
        <div class="footer">
          Cảm ơn Quý khách đã tin tưởng dịch vụ MedCare!<br>
          Chúc Quý khách luôn dồi dào sức khỏe.
        </div>
      </body>
    </html>
  `);
  receiptWindow.document.close();
  receiptWindow.focus();
  setTimeout(() => receiptWindow.print(), 250);
}

function markAsPaid(invoiceId) {
  const inv = allInvoices.find(i => i.id === invoiceId);
  if (!inv) return;

  inv.status = 'Đã thanh toán';
  if (typeof saveInvoices === 'function') saveInvoices(allInvoices);

  // Update patient's total spent & reclassify
  const pIdx = allPatients.findIndex(p => p.id === inv.patientId);
  if (pIdx !== -1) {
    allPatients[pIdx].totalSpent = (allPatients[pIdx].totalSpent || 0) + inv.amount;
    if (typeof classifyPatient === 'function') {
      const rank = classifyPatient(allPatients[pIdx].totalSpent);
      allPatients[pIdx].rank = rank.rank;
    }
    if (typeof savePatients === 'function') savePatients(allPatients);
  }

  if (typeof showToast === 'function') {
    showToast('Thanh toán thành công', `Hóa đơn ${inv.id} đã được chuyển sang trạng thái Đã thanh toán!`, 'success');
  }

  updateSalesKPIs();
  applySalesFilters();
}

// ── Setup Modal ──
function setupInvoiceModal() {
  const btnOpen = document.getElementById('btnOpenNewInvoiceModal');
  const btnClose = document.getElementById('btnCloseInvoiceModal');
  const btnCancel = document.getElementById('btnCancelInvoice');
  const modal = document.getElementById('invoiceModal');
  const form = document.getElementById('invoiceForm');

  const pSelect = document.getElementById('invPatientSelect');
  const sSelect = document.getElementById('invServiceSelect');

  // Populate patients
  if (pSelect) {
    pSelect.innerHTML = allPatients.map(p => `
      <option value="${p.id}">${p.id} — ${p.name} (${p.phone})</option>
    `).join('');
  }

  // Populate services
  const services = window.SERVICES || [];
  if (sSelect) {
    sSelect.innerHTML = services.map(s => `
      <option value="${s}">${s}</option>
    `).join('');
  }

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      form.reset();
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

      const patientId = pSelect.value;
      const patient   = allPatients.find(p => p.id === patientId) || { name: 'Khách vãng lai', phone: '' };
      const service   = sSelect.value;
      const amount    = parseFloat(document.getElementById('invAmount').value) || 0;
      const method    = document.getElementById('invPaymentMethod').value;
      const status    = document.getElementById('invStatus').value;

      const user = window.currentUser || { name: 'Nguyễn Minh Nhân' };

      const newId = `HD${String(Date.now()).slice(-7)}`;

      const newInvoice = {
        id: newId,
        patientId,
        patientName: patient.name,
        phone: patient.phone,
        service,
        amount,
        paymentMethod: method,
        status,
        cashier: user.name,
        createdAt: new Date().toLocaleDateString('vi-VN')
      };

      allInvoices.unshift(newInvoice);
      if (typeof saveInvoices === 'function') saveInvoices(allInvoices);

      // If paid, update patient total spent
      if (status === 'Đã thanh toán') {
        const pIdx = allPatients.findIndex(p => p.id === patientId);
        if (pIdx !== -1) {
          allPatients[pIdx].totalSpent = (allPatients[pIdx].totalSpent || 0) + amount;
          if (typeof classifyPatient === 'function') {
            const rank = classifyPatient(allPatients[pIdx].totalSpent);
            allPatients[pIdx].rank = rank.rank;
          }
          if (typeof savePatients === 'function') savePatients(allPatients);
        }
      }

      if (typeof showToast === 'function') {
        showToast('Lập hóa đơn thành công!', `Đã tạo hóa đơn ${newId} cho ${patient.name}`, 'success');
      }

      modal.classList.remove('open');
      updateSalesKPIs();
      applySalesFilters();
    });
  }
}

function setupExportInvoices() {
  const btn = document.getElementById('btnExportInvoices');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const headers = ['Mã HĐ', 'Mã BN', 'Họ Tên', 'SĐT', 'Dịch Vụ', 'Tổng Tiền', 'Hình Thức', 'Trạng Thái', 'Thu Ngân', 'Ngày Lập'];
    const rows = allInvoices.map(i => [
      `"${i.id}"`, `"${i.patientId}"`, `"${i.patientName}"`, `"${i.phone || ''}"`,
      `"${i.service}"`, `"${i.amount}"`, `"${i.paymentMethod}"`, `"${i.status}"`,
      `"${i.cashier || ''}"`, `"${i.createdAt}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MedCare_HoaDonThuNgan_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  });
}

// Global exposes
window.printReceipt = printReceipt;
window.markAsPaid = markAsPaid;
