/**
 * ==============================================================================
 * MEDCARE CRM — AUTHENTICATION & PORTAL ROUTING LOGIC (v2.0)
 * Login · Register · Session Management · Two-Portal Role Dispatcher
 * (Zero backend, Pure Vanilla JS ES6+ & LocalStorage)
 * ==============================================================================
 */

// ── DEMO ACCOUNTS (Mô phỏng phân quyền 2 cổng: Bệnh nhân & Cán bộ y tế) ──
const DEMO_ACCOUNTS = [
  {
    id: 'P001',
    name: 'Nguyễn Văn An',
    email: 'benhnhan@gmail.com',
    phone: '0912345678',
    password: 'Patient@123',
    role: 'patient',
    roleLabel: 'Bệnh nhân',
    avatar: 'A',
    dob: '15/08/1988',
    gender: 'Nam',
    bhyt: 'DN4791234567890',
    address: 'Quận 5, TP. Hồ Chí Minh',
    joinDate: '10/01/2026'
  },
  {
    id: 'U001',
    name: 'Nguyễn Minh Nhân',
    email: 'admin@medcare.vn',
    password: 'Admin@123',
    role: 'admin',
    roleLabel: 'Super Admin',
    avatar: 'N',
    department: 'Ban Giám đốc Bệnh viện',
    joinDate: '01/01/2024'
  },
  {
    id: 'U002',
    name: 'BS. CKII Trần Thị Mai',
    email: 'manager@medcare.vn',
    password: 'Manager@123',
    role: 'manager',
    roleLabel: 'Trưởng Khoa / Quản lý',
    avatar: 'M',
    department: 'Khoa Khám Bệnh & Tiếp Nhận',
    joinDate: '15/03/2024'
  },
  {
    id: 'U003',
    name: 'Lê Văn Hùng',
    email: 'staff@medcare.vn',
    password: 'Staff@123',
    role: 'staff',
    roleLabel: 'Điều dưỡng / CSKH',
    avatar: 'H',
    department: 'Tổ Tiếp Đón Kiosk',
    joinDate: '01/06/2024'
  }
];

// ── SESSION STORAGE KEYS ──
const AUTH_KEY = 'medcare_session';
const USERS_KEY = 'medcare_users';
const LEADS_KEY = 'medcare_leads';

/**
 * Khởi tạo dữ liệu lịch hẹn demo cho tài khoản Bệnh nhân mẫu (Nguyễn Văn An)
 * Đảm bảo khi bệnh nhân đăng nhập lần đầu vào Cổng Bệnh Nhân sẽ thấy lịch hẹn thực tế ngay!
 */
function initDemoPatientAppointments() {
  try {
    let leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
    const patientPhone = '0912345678';
    const hasPatientLead = leads.some(l => l.phone === patientPhone || l.email === 'benhnhan@gmail.com');

    if (!hasPatientLead) {
      const sampleAppointments = [
        {
          id: 'LD_DEMO_01',
          name: 'Nguyễn Văn An',
          gender: 'Nam',
          email: 'benhnhan@gmail.com',
          phone: patientPhone,
          facility: 'Bệnh viện Chợ Rẫy (TP.HCM)',
          service: 'Khám Chuyên Khoa Tim Mạch',
          source: 'Cổng Bệnh Nhân Trực Tuyến',
          priority: 'high',
          status: 'contacted', // Đã gọi xác nhận & chốt số tiếp đón
          note: '[#MED2026-8821] Hẹn: Ngày mai (Sáng 08:00 - 09:30). Bác sĩ tiếp nhận: PGS.TS Nguyễn Huy Thắng. Số thứ tự ưu tiên Kiosk: #14.',
          createdAt: new Date().toLocaleDateString('vi-VN'),
          assignedTo: 'BS. Chuyên khoa Tim Mạch'
        },
        {
          id: 'LD_DEMO_02',
          name: 'Nguyễn Văn An',
          gender: 'Nam',
          email: 'benhnhan@gmail.com',
          phone: patientPhone,
          facility: 'Bệnh viện Đại học Y Dược TP.HCM',
          service: 'Gói Khám Sức Khỏe Tổng Quát Toàn Diện',
          source: 'Cổng Bệnh Nhân Trực Tuyến',
          priority: 'medium',
          status: 'converted', // Đã hoàn thành khám
          note: '[#MED2026-7734] Hẹn: 15/11/2026 (Sáng 07:30). Đã có kết quả xét nghiệm máu và chẩn đoán hình ảnh, đơn thuốc đã gửi qua Zalo.',
          createdAt: '15/11/2026',
          assignedTo: 'Khoa Khám Theo Yêu Cầu'
        },
        {
          id: 'LD_DEMO_03',
          name: 'Nguyễn Văn An',
          gender: 'Nam',
          email: 'benhnhan@gmail.com',
          phone: patientPhone,
          facility: 'Bệnh viện Bạch Mai (Hà Nội)',
          service: 'Tầm Soát Ung Thư Sớm Chuyên Sâu',
          source: 'Cổng Bệnh Nhân Trực Tuyến',
          priority: 'medium',
          status: 'new', // Chờ viện xếp số
          note: '[#MED2026-9140] Hẹn: 30/11/2026 (Chiều 13:30). Ghi chú: Có tiền sử đau đầu nhẹ, đã xuất trình BHYT đúng tuyến.',
          createdAt: new Date().toLocaleDateString('vi-VN'),
          assignedTo: 'Tổng đài viên CSKH'
        }
      ];

      leads = [...sampleAppointments, ...leads];
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    }
  } catch (err) {
    console.warn('initDemoPatientAppointments error:', err);
  }
}

// Chạy khởi tạo ngay
initDemoPatientAppointments();

// ── QUẢN LÝ PHIÊN ĐĂNG NHẬP (SESSION) ──
function saveSession(user) {
  const session = {
    ...user,
    loginAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 giờ
  };
  delete session.password;
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (new Date(session.expiresAt) < new Date()) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(AUTH_KEY);
}

/**
 * Kiểm tra phân quyền ở các trang Dashboard (CRM Nhân Viên & Admin)
 */
function requireAuth() {
  const session = getSession();
  const currentPath = window.location.pathname.toLowerCase();

  if (!session) {
    const loginTarget = currentPath.includes('/dashboard/') ? '../pages/login.html' : 'pages/login.html';
    window.location.href = loginTarget;
    return null;
  }

  // Nếu tài khoản là Bệnh nhân nhưng cố truy cập vào Dashboard CRM của cán bộ y tế:
  if (session.role === 'patient' && currentPath.includes('/dashboard/')) {
    alert('Tài khoản của bạn là Bệnh nhân. Hệ thống đang chuyển bạn đến Cổng Y Tế Bệnh Nhân.');
    window.location.href = '../pages/patient-portal.html';
    return null;
  }

  return session;
}

/**
 * Điều hướng tự động nếu người dùng đã đăng nhập khi truy cập login.html hoặc register.html
 */
function redirectIfLoggedIn() {
  const session = getSession();
  if (session) {
    const inPages = window.location.pathname.includes('/pages/');
    if (session.role === 'patient') {
      window.location.href = inPages ? 'patient-portal.html' : 'pages/patient-portal.html';
    } else {
      window.location.href = inPages ? '../dashboard/index.html' : 'dashboard/index.html';
    }
  }
}

// ── XỬ LÝ ĐĂNG NHẬP ──
function handleLogin(e) {
  if (e) e.preventDefault();

  const emailEl = document.getElementById('loginEmail');
  const passEl  = document.getElementById('loginPassword');
  const btn     = document.getElementById('btnLogin');

  if (!emailEl || !passEl || !btn) return;

  const email    = emailEl.value.trim().toLowerCase();
  const password = passEl.value;

  clearErrors();
  let valid = true;

  if (!email) {
    showError(emailEl, 'Vui lòng nhập email hoặc số điện thoại đăng ký.');
    valid = false;
  } else if (!isValidEmail(email) && !isValidPhone(email)) {
    showError(emailEl, 'Vui lòng nhập đúng định dạng email hoặc số điện thoại (10 chữ số).');
    valid = false;
  }

  if (!password) {
    showError(passEl, 'Vui lòng nhập mật khẩu tài khoản.');
    valid = false;
  }

  if (!valid) return;

  // Hiệu ứng loading
  btn.classList.add('loading');
  btn.disabled = true;
  btn.innerHTML = '<span>⏳</span> Đang xác thực y tế số...';

  setTimeout(() => {
    // 1. Tìm trong DEMO_ACCOUNTS
    let user = DEMO_ACCOUNTS.find(u => 
      (u.email.toLowerCase() === email || u.phone === email) && u.password === password
    );

    // 2. Nếu không thấy, tìm trong tài khoản tự đăng ký
    if (!user) {
      try {
        const registeredUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        user = registeredUsers.find(u => 
          (u.email.toLowerCase() === email || u.phone === email) && u.password === password
        );
      } catch (err) {
        console.error(err);
      }
    }

    btn.classList.remove('loading');
    btn.disabled = false;

    if (user) {
      saveSession(user);
      btn.innerHTML = '<span>✓</span> Xác thực thành công!';
      btn.style.background = '#059669';

      const inPages = window.location.pathname.includes('/pages/');

      if (user.role === 'patient') {
        showToast(`Xin chào Bệnh nhân ${user.name}! Đang mở Cổng sức khỏe...`, 'success');
        setTimeout(() => {
          window.location.href = inPages ? 'patient-portal.html' : 'pages/patient-portal.html';
        }, 800);
      } else {
        showToast(`Xin chào ${user.roleLabel} ${user.name}! Đang vào CRM Quản trị...`, 'success');
        setTimeout(() => {
          window.location.href = inPages ? '../dashboard/index.html' : 'dashboard/index.html';
        }, 800);
      }
    } else {
      btn.innerHTML = '<span>🔐</span> Đăng nhập vào hệ thống';
      showError(passEl, 'Email hoặc mật khẩu không đúng. Vui lòng thử lại hoặc click tài khoản Demo bên trên.');
      passEl.classList.add('is-invalid');
    }
  }, 750);
}

// ── XỬ LÝ ĐĂNG KÝ ──
let currentRegisterRole = 'patient'; // Mặc định đăng ký bệnh nhân

function setRegisterRole(role) {
  currentRegisterRole = role;
  const tabPatient = document.getElementById('regTabPatient');
  const tabStaff = document.getElementById('regTabStaff');
  const patientFields = document.getElementById('patientExtraFields');
  const staffFields = document.getElementById('staffExtraFields');
  const submitBtn = document.getElementById('btnRegister');

  if (role === 'patient') {
    if (tabPatient) tabPatient.classList.add('active');
    if (tabStaff) tabStaff.classList.remove('active');
    if (patientFields) patientFields.style.display = 'block';
    if (staffFields) staffFields.style.display = 'none';
    if (submitBtn) submitBtn.innerHTML = '<span>🚀</span> Tạo Tài Khoản Bệnh Nhân';
  } else {
    if (tabPatient) tabPatient.classList.remove('active');
    if (tabStaff) tabStaff.classList.add('active');
    if (patientFields) patientFields.style.display = 'none';
    if (staffFields) staffFields.style.display = 'block';
    if (submitBtn) submitBtn.innerHTML = '<span>🏥</span> Đăng Ký Tài Khoản Cơ Sở Y Tế';
  }
}

function handleRegister(e) {
  if (e) e.preventDefault();

  const nameEl    = document.getElementById('regName');
  const emailEl   = document.getElementById('regEmail');
  const phoneEl   = document.getElementById('regPhone');
  const passEl    = document.getElementById('regPassword');
  const confirmEl = document.getElementById('regConfirm');
  const termsEl   = document.getElementById('regTerms');
  const btn       = document.getElementById('btnRegister');

  // Trường cho bệnh nhân
  const dobEl     = document.getElementById('regDob');
  const genderEl  = document.getElementById('regGender');
  const bhytEl    = document.getElementById('regBhyt');

  // Trường cho phòng khám
  const clinicEl  = document.getElementById('regClinic');

  clearErrors();
  let valid = true;

  if (!nameEl || !nameEl.value.trim() || nameEl.value.trim().length < 2) {
    showError(nameEl, 'Họ và tên phải có ít nhất 2 ký tự.');
    valid = false;
  }
  if (!phoneEl || !isValidPhone(phoneEl.value.trim())) {
    showError(phoneEl, 'Số điện thoại phải có đúng 10 số (bắt đầu bằng 0).');
    valid = false;
  }
  if (!emailEl || !isValidEmail(emailEl.value.trim())) {
    showError(emailEl, 'Email không đúng định dạng.');
    valid = false;
  }
  if (!passEl || passEl.value.length < 8) {
    showError(passEl, 'Mật khẩu phải có ít nhất 8 ký tự.');
    valid = false;
  }
  if (!confirmEl || passEl.value !== confirmEl.value) {
    showError(confirmEl, 'Mật khẩu xác nhận không khớp.');
    valid = false;
  }
  if (termsEl && !termsEl.checked) {
    showError(termsEl, 'Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật y tế.');
    valid = false;
  }

  if (!valid) return;

  const emailLower = emailEl.value.trim().toLowerCase();
  const phoneVal   = phoneEl.value.trim();

  // Kiểm tra trùng lặp
  const existsInDemo = DEMO_ACCOUNTS.some(u => u.email.toLowerCase() === emailLower || u.phone === phoneVal);
  if (existsInDemo) {
    showError(emailEl, 'Email hoặc số điện thoại này đã tồn tại trong hệ thống demo.');
    return;
  }

  try {
    const existingUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (existingUsers.some(u => u.email.toLowerCase() === emailLower || u.phone === phoneVal)) {
      showError(emailEl, 'Email hoặc số điện thoại này đã được đăng ký.');
      return;
    }
  } catch {}

  btn.classList.add('loading');
  btn.disabled = true;
  btn.innerHTML = '<span>⏳</span> Đang tạo tài khoản hồ sơ y tế...';

  setTimeout(() => {
    const isPatient = currentRegisterRole === 'patient';
    const newUser = {
      id: (isPatient ? 'P' : 'U') + Date.now(),
      name: nameEl.value.trim(),
      email: emailLower,
      phone: phoneVal,
      password: passEl.value,
      role: isPatient ? 'patient' : 'staff',
      roleLabel: isPatient ? 'Bệnh nhân' : 'Cán bộ Y tế',
      avatar: nameEl.value.trim().charAt(0).toUpperCase(),
      dob: dobEl ? dobEl.value : '01/01/1990',
      gender: genderEl ? genderEl.value : 'Nam',
      bhyt: bhytEl ? (bhytEl.value.trim().toUpperCase() || 'Chưa cập nhật') : 'Chưa cập nhật',
      clinic: clinicEl ? clinicEl.value.trim() : '',
      address: 'Việt Nam',
      joinDate: new Date().toLocaleDateString('vi-VN')
    };

    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }

    saveSession(newUser);
    btn.classList.remove('loading');
    btn.innerHTML = '<span>✓</span> Đăng ký thành công!';
    btn.style.background = '#059669';

    const inPages = window.location.pathname.includes('/pages/');

    if (isPatient) {
      showToast('Đăng ký tài khoản Bệnh nhân thành công! Đang vào Cổng y tế...', 'success');
      setTimeout(() => {
        window.location.href = inPages ? 'patient-portal.html' : 'pages/patient-portal.html';
      }, 900);
    } else {
      showToast('Đăng ký tài khoản Quản trị cơ sở y tế thành công!', 'success');
      setTimeout(() => {
        window.location.href = inPages ? '../dashboard/index.html' : 'dashboard/index.html';
      }, 900);
    }
  }, 900);
}

// ── ĐĂNG XUẤT ──
function logout() {
  clearSession();
  const currentPath = window.location.pathname.toLowerCase();
  const inDashboard = currentPath.includes('/dashboard/');
  window.location.href = inDashboard ? '../pages/login.html' : 'login.html';
}

// ── CHUYỂN TAB VAI TRÒ Ở TRANG LOGIN (Bệnh nhân vs Cán bộ y tế) ──
let currentLoginRole = 'patient';

function switchLoginRole(role) {
  currentLoginRole = role;
  const tabPatient = document.getElementById('roleTabPatient');
  const tabStaff   = document.getElementById('roleTabStaff');
  const demoPatientBox = document.getElementById('demoChipsPatient');
  const demoStaffBox   = document.getElementById('demoChipsStaff');
  const emailInput = document.getElementById('loginEmail');
  const labelEmail = document.getElementById('labelLoginEmail');

  if (role === 'patient') {
    if (tabPatient) tabPatient.classList.add('active');
    if (tabStaff) tabStaff.classList.remove('active');
    if (demoPatientBox) demoPatientBox.style.display = 'flex';
    if (demoStaffBox) demoStaffBox.style.display = 'none';
    if (labelEmail) labelEmail.innerHTML = 'Số điện thoại hoặc Email <span class="required">*</span>';
    if (emailInput) emailInput.placeholder = 'Nhập 0912345678 hoặc email...';
  } else {
    if (tabPatient) tabPatient.classList.remove('active');
    if (tabStaff) tabStaff.classList.add('active');
    if (demoPatientBox) demoPatientBox.style.display = 'none';
    if (demoStaffBox) demoStaffBox.style.display = 'flex';
    if (labelEmail) labelEmail.innerHTML = 'Email cơ quan / cán bộ y tế <span class="required">*</span>';
    if (emailInput) emailInput.placeholder = 'admin@medcare.vn hoặc staff@medcare.vn';
  }
}

// ── 1-CLICK DEMO LOGIN ──
function quickLogin(email) {
  const user = DEMO_ACCOUNTS.find(u => u.email === email);
  if (!user) return;

  const emailEl = document.getElementById('loginEmail');
  const passEl  = document.getElementById('loginPassword');

  if (user.role === 'patient') {
    switchLoginRole('patient');
  } else {
    switchLoginRole('staff');
  }

  if (emailEl) {
    emailEl.value = user.email;
    emailEl.classList.add('is-valid');
    setTimeout(() => emailEl.classList.remove('is-valid'), 800);
  }
  if (passEl) {
    passEl.value = user.password;
    passEl.classList.add('is-valid');
    setTimeout(() => passEl.classList.remove('is-valid'), 800);
  }

  showToast(`⚡ Đã điền tài khoản: ${user.name} (${user.roleLabel})`, 'info');
}

// ── VALIDATION & TIỆN ÍCH ──
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^0[0-9]{9}$/.test(phone);
}

function showError(el, msg) {
  if (!el) return;
  el.classList.add('is-invalid');

  const wrapper = el.closest('.auth-input-group') || el.parentElement;
  if (!wrapper) return;

  let errorEl = wrapper.querySelector('.auth-form-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'auth-form-error';
    wrapper.appendChild(errorEl);
  }
  errorEl.innerHTML = `<span>⚠️</span> ${msg}`;
}

function clearErrors() {
  document.querySelectorAll('.auth-input, .form-control').forEach(el => {
    el.classList.remove('is-invalid', 'is-valid');
  });
  document.querySelectorAll('.auth-form-error, .form-error').forEach(el => el.remove());
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  btn.textContent = isText ? '👁' : '🙈';
}

function checkPasswordStrength(password) {
  const bars = document.querySelectorAll('.pwd-bar');
  const label = document.querySelector('.pwd-strength-label');
  if (!bars.length) return;

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const colors = ['', '#EF4444', '#F59E0B', '#10B981', '#059669'];
  const labels = ['', 'Mật khẩu yếu', 'Mật khẩu trung bình', 'Mật khẩu an toàn', 'Mật khẩu rất mạnh'];

  bars.forEach((bar, i) => {
    bar.style.background = i < score ? colors[score] : '#E2E8F0';
  });

  if (label) {
    label.textContent = password ? labels[score] || 'Mật khẩu yếu' : '';
    label.style.color = colors[score] || '#64748B';
  }
}

// ── TOAST NOTIFICATION ──
function showToast(msg, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── GLOBAL EXPORT ──
if (typeof window !== 'undefined') {
  window.handleLogin            = handleLogin;
  window.handleRegister         = handleRegister;
  window.logout                 = logout;
  window.switchLoginRole        = switchLoginRole;
  window.setRegisterRole        = setRegisterRole;
  window.quickLogin             = quickLogin;
  window.togglePassword         = togglePassword;
  window.checkPasswordStrength  = checkPasswordStrength;
  window.getSession             = getSession;
  window.requireAuth            = requireAuth;
  window.saveSession            = saveSession;
  window.clearSession           = clearSession;
  window.showToast              = showToast;
  window.redirectIfLoggedIn     = redirectIfLoggedIn;
  window.DEMO_ACCOUNTS          = DEMO_ACCOUNTS;
}

if (typeof global !== 'undefined') {
  global.DEMO_ACCOUNTS          = DEMO_ACCOUNTS;
  global.getSession             = getSession;
  global.saveSession            = saveSession;
  global.initDemoPatientAppointments = initDemoPatientAppointments;
}
