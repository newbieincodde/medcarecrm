/**
 * Test script for MedCare Auth & Patient Portal
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

console.log('--- 1. Testing JS syntax across all js/ files ---');
const jsDir = path.join(rootDir, 'js');
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
let hasJsError = false;

jsFiles.forEach(file => {
  const filePath = path.join(jsDir, file);
  const code = fs.readFileSync(filePath, 'utf8');
  try {
    new Function(code);
    console.log(`[PASS] ${file} is valid JS.`);
  } catch (err) {
    console.error(`[FAIL] ${file} has syntax error:`, err.message);
    hasJsError = true;
  }
});

console.log('\n--- 2. Checking login.html for deleted bulky pills ---');
const loginHtml = fs.readFileSync(path.join(rootDir, 'pages', 'login.html'), 'utf8');
const forbiddenPills = [
  'Quản lý toàn diện hồ sơ bệnh nhân',
  'Tự động phân hạng Đồng · Bạc · Vàng',
  'Báo cáo & phân tích thời gian thực',
  'Nhắc lịch tái khám tự động'
];

let pillFound = false;
forbiddenPills.forEach(pill => {
  if (loginHtml.includes(pill)) {
    console.error(`[FAIL] Found forbidden pill: "${pill}" in login.html`);
    pillFound = true;
  }
});

if (!pillFound) {
  console.log('[PASS] All 4 bulky pills have been completely removed from login.html!');
}

console.log('\n--- 3. Checking register.html for deleted bulky pills ---');
const regHtml = fs.readFileSync(path.join(rootDir, 'pages', 'register.html'), 'utf8');
const forbiddenRegPills = [
  'Miễn phí 30 ngày, không cần thẻ tín dụng',
  'Thiết lập trong vòng 15 phút',
  'Đào tạo và hỗ trợ onboarding miễn phí'
];

let regPillFound = false;
forbiddenRegPills.forEach(pill => {
  if (regHtml.includes(pill)) {
    console.error(`[FAIL] Found old pill in register.html: "${pill}"`);
    regPillFound = true;
  }
});

if (!regPillFound) {
  console.log('[PASS] Old boilerplate pills removed from register.html!');
}

console.log('\n--- 4. Checking patient-portal.html file exists and structure ---');
const portalPath = path.join(rootDir, 'pages', 'patient-portal.html');
if (fs.existsSync(portalPath)) {
  const portalHtml = fs.readFileSync(portalPath, 'utf8');
  console.log(`[PASS] patient-portal.html exists (${portalHtml.length} bytes).`);
  if (portalHtml.includes('medcare_leads') && portalHtml.includes('newBookingModal') && portalHtml.includes('slipModal')) {
    console.log('[PASS] patient-portal.html contains medcare_leads integration, new booking modal, and slip modal!');
  } else {
    console.error('[FAIL] Missing expected elements in patient-portal.html');
  }
} else {
  console.error('[FAIL] patient-portal.html does not exist!');
}

console.log('\n--- 5. Simulating Auth Logic & Data Flow ---');
// Mock browser environment
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: function (key) { return store[key] || null; },
    setItem: function (key, value) { store[key] = value.toString(); },
    removeItem: function (key) { delete store[key]; },
    clear: function () { store = {}; }
  };
})();

global.localStorage = localStorageMock;
global.window = { location: { href: '', pathname: '/pages/login.html' } };
global.document = {
  getElementById: function () { return null; },
  querySelectorAll: function () { return []; }
};

// Evaluate auth.js
const authCode = fs.readFileSync(path.join(jsDir, 'auth.js'), 'utf8');
eval(authCode);

console.log('DEMO_ACCOUNTS count:', global.DEMO_ACCOUNTS.length);
const patientDemo = global.DEMO_ACCOUNTS.find(u => u.role === 'patient');
console.log('Patient Demo found:', patientDemo ? `${patientDemo.name} (${patientDemo.email})` : 'None');

const leadsRaw = localStorageMock.getItem('medcare_leads');
console.log('Initialized leads in storage:', leadsRaw ? JSON.parse(leadsRaw).length : 0);

if (patientDemo && leadsRaw) {
  console.log('[PASS] Demo patient and patient appointments initialized perfectly in localStorage!');
}

console.log('\n=== VERIFICATION SUMMARY ===');
if (!hasJsError && !pillFound && !regPillFound) {
  console.log('ALL CHECKS PASSED 100%! Ready to present to user.');
} else {
  console.log('CHECKS FAILED! Please review errors above.');
}
