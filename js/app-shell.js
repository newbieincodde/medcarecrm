/**
 * ==============================================================================
 * MEDCARE CRM — App Shell (Sidebar & Header shared across dashboard pages)
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

        <div class="header-search">
          <span class="header-search-icon">🔍</span>
          <input type="text" id="globalSearchInput" placeholder="Tìm kiếm nhanh bệnh nhân, SĐT, mã hồ sơ... (Enter để tìm)">
        </div>

        <div class="header-actions">
          <button class="header-action-btn" id="btnNotif" title="Thông báo nhắc việc">
            🔔
            <span class="header-notif-badge" id="notifBadge">3</span>
          </button>

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
      <div class="toast-container" id="toastContainer"></div>
    `;

    setupShellEvents();
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

    // User dropdown toggle (Safe click toggle — prevents hover flickering!)
    const btnUser = document.getElementById('btnUserDropdown');
    const userMenu = document.getElementById('userMenu');

    if (btnUser && userMenu) {
      btnUser.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('open');
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

    // Global search input
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = searchInput.value.trim();
          if (q) {
            window.location.href = `customers.html?search=${encodeURIComponent(q)}`;
          }
        }
      });
    }

    // Notification button
    const btnNotif = document.getElementById('btnNotif');
    if (btnNotif) {
      btnNotif.addEventListener('click', () => {
        showToast('Thông báo', 'Bạn có 3 lịch hẹn tái khám cần xử lý trong ngày hôm nay!', 'warning');
      });
    }
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

  window.initAppShell = initAppShell;
  window.showToast = showToast;
})();
