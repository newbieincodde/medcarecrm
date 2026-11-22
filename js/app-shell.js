/**
 * ==============================================================================
 * MEDCARE CRM — App Shell (Sidebar & Header shared across dashboard pages)
 * Enterprise v3.0: Notification Center · Spotlight Search · VOIP Simulator
 * ==============================================================================
 */

(function () {
  // Ensure session exists
  if (typeof requireAuth === 'function') {
    window.currentUser = requireAuth();
  }

  // Ensure initial data exists
  if (typeof initData === 'function') {
    initData();
  }

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Tổng Quan', href: 'index.html', icon: '📊' },
    { id: 'customers', label: 'Bệnh Nhân', href: 'customers.html', icon: '👥' },
    { id: 'leads',     label: 'Tiềm Năng (Leads)', href: 'leads.html', icon: '🎯' },
    { id: 'care',      label: 'Chăm Sóc KH', href: 'customer-care.html', icon: '💬' },
    { id: 'inventory', label: 'Kho Dược & Vật Tư', href: 'inventory.html', icon: '📦' },
    { id: 'sales',     label: 'Hóa Đơn & Thu Ngân', href: 'sales.html', icon: '💰' },
    { id: 'surveys',   label: 'Khảo Sát CSAT', href: 'surveys.html', icon: '⭐' },
    { id: 'reports',   label: 'Báo Cáo & CLV', href: 'reports.html', icon: '📈' },
  ];

  function getCurrentPageId() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('customer-care')) return 'care';
    if (path.includes('customers')) return 'customers';
    if (path.includes('leads')) return 'leads';
    if (path.includes('inventory')) return 'inventory';
    if (path.includes('sales')) return 'sales';
    if (path.includes('surveys')) return 'surveys';
    if (path.includes('reports')) return 'reports';
    return 'dashboard';
  }

  function renderSidebar() {
    const currentId = getCurrentPageId();
    const user = window.currentUser || { name: 'Quản trị viên', roleLabel: 'Admin', avatar: 'A' };
    
    // Count today follow ups for badge
    let todayFollowCount = 0;
    try {
      const patients = typeof getPatients === 'function' ? getPatients() : [];
      if (typeof getTodayFollowUps === 'function') {
        todayFollowCount = getTodayFollowUps(patients).length;
      }
    } catch(e) {}

    let leadsCount = 0;
    try {
      const leads = typeof getLeads === 'function' ? getLeads() : [];
      leadsCount = leads.filter(l => l.status === 'new').length;
    } catch(e) {}

    let lowStockCount = 0;
    try {
      const inv = typeof getInventory === 'function' ? getInventory() : [];
      lowStockCount = inv.filter(item => item.stock <= item.minStock).length;
    } catch(e) {}

    return `
      <aside class="app-sidebar" id="appSidebar">
        <div class="sidebar-logo">
          <div class="sidebar-logo-icon">🩺</div>
          <div class="sidebar-logo-text">
            <span class="logo-name">MedCare CRM</span>
            <span class="logo-sub">Healthcare Solution</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="sidebar-section-label">Phân hệ chính</div>
          ${NAV_ITEMS.map(item => {
            const isActive = item.id === currentId ? 'active' : '';
            let badgeHtml = '';
            if (item.id === 'care' && todayFollowCount > 0) {
              badgeHtml = `<span class="nav-badge" title="${todayFollowCount} ca cần liên hệ">${todayFollowCount}</span>`;
            } else if (item.id === 'leads' && leadsCount > 0) {
              badgeHtml = `<span class="nav-badge" style="background:var(--clr-primary-500,#14b8a6);" title="${leadsCount} lead mới">${leadsCount}</span>`;
            } else if (item.id === 'inventory' && lowStockCount > 0) {
              badgeHtml = `<span class="nav-badge" style="background:#f59e0b;" title="${lowStockCount} mặt hàng sắp hết">${lowStockCount}</span>`;
            }
            return `
              <div class="sidebar-nav-item">
                <a href="${item.href}" class="sidebar-nav-link ${isActive}" data-id="${item.id}">
                  <span class="nav-icon">${item.icon}</span>
                  <span class="nav-label">${item.label}</span>
                  ${badgeHtml}
                </a>
              </div>
            `;
          }).join('')}

          <div class="sidebar-section-label" style="margin-top:16px;">Tiện ích nhanh</div>
          <div class="sidebar-nav-item">
            <a href="../pages/patient-portal.html" class="sidebar-nav-link" target="_blank" title="Xem Cổng Bệnh Nhân Trực Tuyến">
              <span class="nav-icon">👤</span>
              <span class="nav-label">Cổng Bệnh Nhân</span>
            </a>
          </div>
          <div class="sidebar-nav-item">
            <a href="../index.html" class="sidebar-nav-link" target="_blank" title="Xem Landing Page quảng bá">
              <span class="nav-icon">🌐</span>
              <span class="nav-label">Landing Page</span>
            </a>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="sidebar-user" id="sidebarUserTrigger" title="Tài khoản">
            <div class="sidebar-user-avatar">${user.avatar || user.name.charAt(0)}</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${user.name}</div>
              <div class="sidebar-user-role">${user.roleLabel || 'Nhân viên'}</div>
            </div>
          </div>
        </div>
      </aside>
    `;
  }

  function renderHeader(breadcrumbText = 'Tổng quan') {
    const user = window.currentUser || { name: 'Quản trị viên', roleLabel: 'Admin', avatar: 'A' };
    
    return `
      <header class="app-header">
        <button class="header-toggle-btn" id="btnToggleSidebar" title="Thu gọn / Mở rộng menu">
          ☰
        </button>

        <div class="header-search" id="headerSearchTrigger" title="Nhấn để tìm kiếm hoặc gõ Ctrl + K">
          <span class="header-search-icon">🔍</span>
          <input type="text" id="globalSearchInput" placeholder="Tìm kiếm nhanh bệnh nhân, leads, kho dược... (Ctrl + K)" readonly style="cursor:pointer;">
        </div>

        <div class="header-actions">
          <!-- Notification Dropdown Wrap -->
          <div class="header-notif-wrap" id="notifWrap">
            <button class="header-action-btn" id="btnNotif" title="Trung tâm Thông báo & Cảnh báo Y tế">
              🔔
              <span class="header-notif-badge" id="notifBadge">0</span>
            </button>
            <div class="notif-dropdown" id="notifDropdown">
              <div class="notif-header">
                <span class="notif-header-title">🔔 Thông Báo & Cảnh Báo Y Tế</span>
                <span class="notif-badge-pill" id="notifPillCount">0 mới</span>
              </div>
              <div class="notif-body" id="notifBody">
                <!-- Filled dynamically by JS -->
              </div>
              <div class="notif-footer">
                <a href="leads.html">Xem tất cả lịch hẹn tiếp đón →</a>
              </div>
            </div>
          </div>

          <!-- User dropdown -->
          <div class="header-user-dropdown" id="userDropdownWrap">
            <button class="header-user-btn" id="btnUserDropdown">
              <div class="header-user-avatar">${user.avatar || user.name.charAt(0)}</div>
              <span class="header-user-name">${user.name.split(' ').slice(-1)[0]}</span>
              <span style="font-size:10px; color:#64748b; margin-left:2px;">▼</span>
            </button>
            <div class="user-dropdown-menu" id="userMenu">
              <div style="padding:8px 12px; border-bottom:1px solid #e2e8f0; margin-bottom:4px;">
                <div style="font-weight:700; font-size:13px; color:#0f172a;">${user.name}</div>
                <div style="font-size:11px; color:#64748b;">${user.email || ''}</div>
                <div style="display:inline-block; font-size:10px; padding:2px 8px; border-radius:12px; background:#ccfbf1; color:#0f766e; margin-top:4px; font-weight:600;">
                  ${user.roleLabel || 'Nhân viên'}
                </div>
              </div>
              <a href="customers.html" class="dropdown-item">👥 Danh sách Bệnh nhân</a>
              <a href="customer-care.html" class="dropdown-item">💬 Lịch sử Chăm sóc</a>
              <a href="../pages/patient-portal.html" class="dropdown-item" target="_blank">🩺 Cổng Bệnh Nhân (e-Portal)</a>
              <a href="../index.html" class="dropdown-item" target="_blank">🌐 Trang giới thiệu</a>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item danger" id="btnLogout">
                🚪 Đăng xuất
              </div>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  function initAppShell(breadcrumb = 'Tổng quan') {
    const mount = document.getElementById('appMount');
    if (!mount) return;

    // Build skeleton
    const sidebarHtml = renderSidebar();
    const headerHtml  = renderHeader(breadcrumb);

    const mainSlotContent = mount.innerHTML;
    mount.innerHTML = `
      <div class="app-shell">
        ${sidebarHtml}
        <div class="app-body">
          ${headerHtml}
          <main class="main-content">
            <div class="breadcrumb">
              <a href="index.html">MedCare CRM</a>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">${breadcrumb}</span>
            </div>
            <div id="pageContent">
              ${mainSlotContent}
            </div>
          </main>
        </div>
      </div>

      <!-- Spotlight Universal Search Modal (Ctrl + K) -->
      <div class="spotlight-backdrop" id="spotlightModal">
        <div class="spotlight-box">
          <div class="spotlight-header">
            <span style="font-size:20px; color:#0f766e;">🔍</span>
            <input type="text" class="spotlight-input" id="spotlightInput" placeholder="Tìm kiếm bệnh nhân, số điện thoại, mã hẹn #MED2026, thuốc, hóa đơn...">
            <span class="spotlight-kbd">ESC để đóng</span>
          </div>
          <div class="spotlight-results" id="spotlightResults">
            <div style="text-align:center; padding:32px 16px; color:#94a3b8; font-size:13px;">
              Gõ từ khóa để tìm kiếm tức thì trên toàn bộ hệ thống CRM...
            </div>
          </div>
        </div>
      </div>

      <!-- VOIP Call Simulation Modal -->
      <div class="spotlight-backdrop" id="voipModal" style="align-items:center; padding-top:0;">
        <div class="voip-modal-box">
          <div class="voip-avatar-pulse" id="voipAvatar">📞</div>
          <div class="voip-caller-name" id="voipName">Nguyễn Văn An</div>
          <div class="voip-caller-phone" id="voipPhone">0912345678</div>
          <div style="font-size:12px; color:#a7f3d0; margin-top:4px;">Tổng đài VOIP MedCare Hotline xxxx-xxxx</div>
          <div class="voip-timer" id="voipTimer">00:00</div>
          
          <div class="voip-quick-note">
            <label style="font-size:11px; color:#94a3b8; font-weight:600; display:block; margin-bottom:4px;">Ghi chú nhanh cuộc gọi:</label>
            <textarea id="voipNoteInput" placeholder="Nội dung trao đổi: Bệnh nhân đã nhận được lịch hẹn khám, sức khỏe ổn định..."></textarea>
          </div>

          <div class="voip-controls">
            <button type="button" class="voip-btn-hangup" onclick="endVoipCall()" title="Kết thúc cuộc gọi">
              📵
            </button>
          </div>
        </div>
      </div>

      <div class="toast-container" id="toastContainer"></div>
    `;

    setupShellEvents();
    initNotificationCenter();
  }

  function setupShellEvents() {
    // Sidebar toggle (desktop collapse + mobile drawer)
    const btnToggle = document.getElementById('btnToggleSidebar');
    const sidebar   = document.getElementById('appSidebar');

    if (btnToggle && sidebar) {
      btnToggle.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.toggle('mobile-open');
        } else {
          sidebar.classList.toggle('collapsed');
        }
      });
    }

    // User dropdown toggle
    const btnUser = document.getElementById('btnUserDropdown');
    const userMenu = document.getElementById('userMenu');

    if (btnUser && userMenu) {
      btnUser.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('open');
        document.getElementById('notifDropdown')?.classList.remove('open');
      });

      document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target) && !btnUser.contains(e.target)) {
          userMenu.classList.remove('open');
        }
      });
    }

    // Logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi MedCare CRM?')) {
          if (typeof clearSession === 'function') {
            clearSession();
          } else {
            localStorage.removeItem('medcare_session');
          }
          window.location.href = '../pages/login.html';
        }
      });
    }

    // Spotlight Search Triggers
    const searchTrigger = document.getElementById('headerSearchTrigger');
    const spotlightModal = document.getElementById('spotlightModal');
    const spotlightInput = document.getElementById('spotlightInput');

    if (searchTrigger && spotlightModal && spotlightInput) {
      searchTrigger.addEventListener('click', () => {
        openSpotlight();
      });

      // Keyboard shortcut Ctrl + K or Cmd + K
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          openSpotlight();
        } else if (e.key === 'Escape') {
          closeSpotlight();
          document.getElementById('notifDropdown')?.classList.remove('open');
        }
      });

      spotlightModal.addEventListener('click', (e) => {
        if (e.target === spotlightModal) closeSpotlight();
      });

      spotlightInput.addEventListener('input', (e) => {
        handleSpotlightSearch(e.target.value.trim());
      });
    }
  }

  // ── NOTIFICATION CENTER LOGIC ──
  function initNotificationCenter() {
    const btnNotif = document.getElementById('btnNotif');
    const notifDropdown = document.getElementById('notifDropdown');
    const notifBadge = document.getElementById('notifBadge');
    const notifPill = document.getElementById('notifPillCount');
    const notifBody = document.getElementById('notifBody');

    if (!btnNotif || !notifDropdown || !notifBody) return;

    btnNotif.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('open');
      document.getElementById('userMenu')?.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target) && !btnNotif.contains(e.target)) {
        notifDropdown.classList.remove('open');
      }
    });

    // Compute notifications
    const items = [];

    // 1. Leads
    try {
      const leads = typeof getLeads === 'function' ? getLeads() : [];
      const newLeads = leads.filter(l => l.status === 'new');
      newLeads.slice(0, 3).forEach(l => {
        items.push({
          type: 'lead',
          icon: '🎯',
          title: `Lịch hẹn mới: ${l.name}`,
          desc: `${l.service || 'Khám chuyên khoa'} · SĐT: ${l.phone}`,
          time: l.createdAt || 'Hôm nay',
          url: 'leads.html'
        });
      });
    } catch(e) {}

    // 2. Overdue patients
    try {
      const patients = typeof getPatients === 'function' ? getPatients() : [];
      const followUps = typeof getTodayFollowUps === 'function' ? getTodayFollowUps(patients) : [];
      followUps.slice(0, 2).forEach(p => {
        const isOverdue = p.overdueDays > 0;
        items.push({
          type: 'care',
          icon: '⏰',
          title: isOverdue ? `Quá hạn tái khám: ${p.name}` : `Hẹn tái khám hôm nay: ${p.name}`,
          desc: `Khoa: ${p.service} · Hạng ${p.rank?.toUpperCase()}`,
          time: isOverdue ? `Trễ ${p.overdueDays} ngày` : 'Hôm nay',
          url: `customer-care.html?patientId=${p.id}`
        });
      });
    } catch(e) {}

    // 3. Low stock inventory
    try {
      const inv = typeof getInventory === 'function' ? getInventory() : [];
      const lowItems = inv.filter(i => i.stock <= i.minStock);
      lowItems.slice(0, 2).forEach(i => {
        items.push({
          type: 'inventory',
          icon: '⚠️',
          title: `Sắp hết hàng: ${i.name}`,
          desc: `Tồn kho: ${i.stock} ${i.unit} (Mức tối thiểu: ${i.minStock})`,
          time: 'Cần bổ sung kho',
          url: 'inventory.html'
        });
      });
    } catch(e) {}

    const totalCount = items.length;
    if (notifBadge) {
      notifBadge.textContent = totalCount;
      notifBadge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }
    if (notifPill) {
      notifPill.textContent = `${totalCount} cảnh báo`;
    }

    if (items.length === 0) {
      notifBody.innerHTML = `
        <div style="text-align:center; padding:32px 16px; color:#94a3b8; font-size:12.5px;">
          🎉 Hiện không có thông báo y tế cần xử lý gấp.
        </div>
      `;
    } else {
      notifBody.innerHTML = items.map(item => `
        <a href="${item.url}" class="notif-item">
          <div class="notif-icon-box ${item.type}">${item.icon}</div>
          <div class="notif-info">
            <div class="notif-item-title">${item.title}</div>
            <div class="notif-item-desc">${item.desc}</div>
            <div class="notif-item-time">${item.time}</div>
          </div>
        </a>
      `).join('');
    }
  }

  // ── SPOTLIGHT SEARCH LOGIC ──
  function openSpotlight() {
    const modal = document.getElementById('spotlightModal');
    const input = document.getElementById('spotlightInput');
    if (!modal || !input) return;

    modal.classList.add('open');
    input.value = '';
    input.focus();
    handleSpotlightSearch('');
  }

  function closeSpotlight() {
    const modal = document.getElementById('spotlightModal');
    if (modal) modal.classList.remove('open');
  }

  function handleSpotlightSearch(query) {
    const resultsContainer = document.getElementById('spotlightResults');
    if (!resultsContainer) return;

    if (!query) {
      resultsContainer.innerHTML = `
        <div style="text-align:center; padding:32px 16px; color:#94a3b8; font-size:13px;">
          Gõ tên bệnh nhân, số điện thoại, mã hồ sơ (#MED2026, KH001) hoặc tên thuốc...
        </div>
      `;
      return;
    }

    const q = query.toLowerCase();
    let html = '';

    // Search Patients
    try {
      const patients = typeof getPatients === 'function' ? getPatients() : [];
      const matchPatients = patients.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.phone && p.phone.includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q))
      ).slice(0, 4);

      if (matchPatients.length > 0) {
        html += `<div class="spotlight-group-title">👥 Bệnh Nhân (${matchPatients.length})</div>`;
        html += matchPatients.map(p => `
          <a href="customers.html?search=${encodeURIComponent(p.id)}" class="spotlight-result-item" onclick="closeSpotlight()">
            <div class="spotlight-item-left">
              <div class="spotlight-item-icon" style="background:#ccfbf1; color:#0f766e;">👤</div>
              <div>
                <div class="spotlight-item-name">${p.name} <span style="font-size:12px; font-weight:normal; color:#64748b;">(${p.id})</span></div>
                <div class="spotlight-item-meta">📞 ${p.phone} · Khoa: ${p.service}</div>
              </div>
            </div>
            <span class="spotlight-badge" style="background:#fef3c7; color:#92400e;">Hạng ${p.rank?.toUpperCase()}</span>
          </a>
        `).join('');
      }
    } catch(e) {}

    // Search Leads
    try {
      const leads = typeof getLeads === 'function' ? getLeads() : [];
      const matchLeads = leads.filter(l => 
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.phone && l.phone.includes(q)) ||
        (l.id && l.id.toLowerCase().includes(q)) ||
        (l.note && l.note.toLowerCase().includes(q))
      ).slice(0, 3);

      if (matchLeads.length > 0) {
        html += `<div class="spotlight-group-title">🎯 Leads & Đặt Lịch (${matchLeads.length})</div>`;
        html += matchLeads.map(l => `
          <a href="leads.html" class="spotlight-result-item" onclick="closeSpotlight()">
            <div class="spotlight-item-left">
              <div class="spotlight-item-icon" style="background:#dbeafe; color:#1e40af;">🎯</div>
              <div>
                <div class="spotlight-item-name">${l.name} <span style="font-size:12px; font-weight:normal; color:#64748b;">(${l.id})</span></div>
                <div class="spotlight-item-meta">📞 ${l.phone} · ${l.service}</div>
              </div>
            </div>
            <span class="spotlight-badge" style="background:#d1fae5; color:#065f46;">${l.status}</span>
          </a>
        `).join('');
      }
    } catch(e) {}

    // Search Medicines
    try {
      const inv = typeof getInventory === 'function' ? getInventory() : [];
      const matchInv = inv.filter(i => 
        (i.name && i.name.toLowerCase().includes(q)) ||
        (i.id && i.id.toLowerCase().includes(q)) ||
        (i.category && i.category.toLowerCase().includes(q))
      ).slice(0, 3);

      if (matchInv.length > 0) {
        html += `<div class="spotlight-group-title">💊 Dược Phẩm & Vật Tư (${matchInv.length})</div>`;
        html += matchInv.map(i => `
          <a href="inventory.html?search=${encodeURIComponent(i.name)}" class="spotlight-result-item" onclick="closeSpotlight()">
            <div class="spotlight-item-left">
              <div class="spotlight-item-icon" style="background:#ffedd5; color:#ea580c;">💊</div>
              <div>
                <div class="spotlight-item-name">${i.name}</div>
                <div class="spotlight-item-meta">Tồn kho: ${i.stock} ${i.unit} · Đơn giá: ${i.price.toLocaleString('vi-VN')} ₫</div>
              </div>
            </div>
            <span class="spotlight-badge">${i.category}</span>
          </a>
        `).join('');
      }
    } catch(e) {}

    if (!html) {
      resultsContainer.innerHTML = `
        <div style="text-align:center; padding:32px 16px; color:#64748b; font-size:13px;">
          Không tìm thấy kết quả nào khớp với "<strong>${query}</strong>"
        </div>
      `;
    } else {
      resultsContainer.innerHTML = html;
    }
  }

  // ── VOIP CALL SIMULATOR LOGIC ──
  let voipInterval = null;
  let voipSeconds = 0;
  let activeCallPatient = null;

  function startVoipCall(name, phone, patientId = '') {
    activeCallPatient = { name, phone, patientId };
    const modal = document.getElementById('voipModal');
    const elName = document.getElementById('voipName');
    const elPhone = document.getElementById('voipPhone');
    const elTimer = document.getElementById('voipTimer');
    const elNote = document.getElementById('voipNoteInput');

    if (!modal) return;

    if (elName) elName.textContent = name;
    if (elPhone) elPhone.textContent = phone;
    if (elNote) elNote.value = '';

    modal.classList.add('open');
    voipSeconds = 0;
    if (elTimer) elTimer.textContent = '00:00';

    if (voipInterval) clearInterval(voipInterval);
    voipInterval = setInterval(() => {
      voipSeconds++;
      const m = String(Math.floor(voipSeconds / 60)).padStart(2, '0');
      const s = String(voipSeconds % 60).padStart(2, '0');
      if (elTimer) elTimer.textContent = `${m}:${s}`;
    }, 1000);

    showToast('Tổng đài VOIP', `Đang kết nối cuộc gọi tới ${name} (${phone})...`, 'info');
  }

  function endVoipCall() {
    if (voipInterval) clearInterval(voipInterval);
    const modal = document.getElementById('voipModal');
    if (modal) modal.classList.remove('open');

    const note = document.getElementById('voipNoteInput')?.value.trim();
    const duration = voipSeconds > 0 ? `${voipSeconds} giây` : 'Vừa gọi';

    if (activeCallPatient && activeCallPatient.patientId) {
      try {
        const patients = typeof getPatients === 'function' ? getPatients() : [];
        const p = patients.find(item => item.id === activeCallPatient.patientId);
        if (p) {
          p.lastContact = new Date().toLocaleDateString('vi-VN');
          if (note) {
            p.notes = (p.notes || '') + ` [Gọi VOIP ${duration}]: ${note}`;
          }
          if (typeof savePatients === 'function') savePatients(patients);
        }
      } catch(e) {}
    }

    showToast('Cuộc gọi kết thúc', `Thời lượng: ${duration}. Nhật ký đã được lưu vào hệ thống!`, 'success');
  }

  // Toast notification helper
  function showToast(title, msg, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || 'ℹ️'}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${msg}</div>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Global Exports
  window.initAppShell   = initAppShell;
  window.showToast       = showToast;
  window.startVoipCall   = startVoipCall;
  window.endVoipCall     = endVoipCall;
  window.openSpotlight   = openSpotlight;
  window.closeSpotlight  = closeSpotlight;
})();
