/**
 * ==============================================================================
 * MEDCARE CRM — DỮ LIỆU MẪU BỆNH NHÂN
 * 50 bệnh nhân Healthcare · Trung tâm đa chuyên khoa
 * ==============================================================================
 */

const SERVICES = [
  'Khám Sức Khỏe Tổng Quát',
  'Tầm Soát Tim Mạch',
  'Nha Khoa Thẩm Mỹ',
  'Da Liễu & Thẩm Mỹ Da',
  'Khám Mắt & Điều Trị Cận Thị',
  'Gói Mẹ & Bé',
  'Xét Nghiệm Máu Tại Nhà',
  'Chẩn Đoán Hình Ảnh CT/MRI',
  'Nội Khoa Tổng Quát',
  'Tầm Soát Ung Thư'
];

const HO = ['Nguyễn','Trần','Lê','Phạm','Hoàng','Huỳnh','Phan','Vũ','Đặng','Bùi','Đỗ','Hồ','Ngô','Dương','Lý'];
const TEN_NAM = ['Văn An','Minh Khoa','Quốc Hùng','Thanh Tùng','Trọng Nghĩa','Đức Long','Hoàng Nam','Anh Tuấn','Minh Đức','Công Tâm'];
const TEN_NU  = ['Thị Hoa','Thanh Mai','Thu Hương','Ngọc Linh','Bích Ngọc','Phương Anh','Minh Châu','Kim Oanh','Lan Anh','Hồng Nhung'];
const DISTRICTS = ['Quận 1','Quận 3','Quận 7','Quận Bình Thạnh','TP Thủ Đức','Quận Gò Vấp','Bình Dương','Long An','Đồng Nai'];
const SOURCES = ['Website','Giới thiệu','Zalo','Facebook','Google Ads','Flyer phát tay','Khách cũ giới thiệu'];
const STATUSES = ['active','active','active','active','inactive'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generatePatients(n = 50) {
  const patients = [];
  for (let i = 1; i <= n; i++) {
    const isMale = Math.random() > 0.45;
    const ho = rand(HO);
    const ten = isMale ? rand(TEN_NAM) : rand(TEN_NU);
    const name = `${ho} ${ten}`;
    const spent = randInt(500000, 45000000);
    const rank = spent >= 15000000 ? 'gold' : spent >= 5000000 ? 'silver' : 'bronze';

    const daysAgo = randInt(0, 180);
    const lastDate = new Date(Date.now() - daysAgo * 86400000);
    const createdAgo = randInt(daysAgo, daysAgo + 180);
    const createdDate = new Date(Date.now() - createdAgo * 86400000);

    const nextFollowDays = randInt(-10, 30);
    const nextFollowDate = new Date(Date.now() + nextFollowDays * 86400000);

    patients.push({
      id: `KH${String(i).padStart(3,'0')}`,
      name,
      gender: isMale ? 'Nam' : 'Nữ',
      age: randInt(18, 72),
      email: `${ho.toLowerCase()}${i}@email.com`,
      phone: `09${randInt(10000000, 99999999)}`,
      address: rand(DISTRICTS),
      service: rand(SERVICES),
      source: rand(SOURCES),
      totalSpent: spent,
      rank,
      status: rand(STATUSES),
      visits: randInt(1, 12),
      lastContact: lastDate.toLocaleDateString('vi-VN'),
      nextFollowUp: nextFollowDate.toLocaleDateString('vi-VN'),
      createdAt: createdDate.toLocaleDateString('vi-VN'),
      overdueDays: nextFollowDays < 0 ? Math.abs(nextFollowDays) : 0,
      notes: `Bệnh nhân quan tâm ${rand(SERVICES).toLowerCase()}. Cần ${isMale ? 'anh' : 'chị'} gọi hỏi thăm.`
    });
  }
  return patients;
}

// ── INTERACTIONS (Lịch sử tương tác) ──
const INTERACTION_TYPES = ['Gọi điện hỏi thăm','Nhắc lịch tái khám','Gửi kết quả xét nghiệm','Tư vấn sau khám','Đặt lịch hẹn','Giải thích đơn thuốc','Hỏi thăm sau phẫu thuật'];
const STAFF_NAMES = ['Nguyễn Minh Nhân','Trần Thị Mai','Lê Văn Hùng'];

function generateInteractions(patientId, count = 3) {
  return Array.from({ length: count }, (_, i) => {
    const daysAgo = (i + 1) * randInt(5, 20);
    const date = new Date(Date.now() - daysAgo * 86400000);
    return {
      id: `INT_${patientId}_${i + 1}`,
      patientId,
      type: rand(INTERACTION_TYPES),
      date: date.toLocaleDateString('vi-VN'),
      staff: rand(STAFF_NAMES),
      note: `Đã ${rand(INTERACTION_TYPES).toLowerCase()}. Bệnh nhân phản hồi tốt.`,
      result: Math.random() > 0.3 ? 'Tích cực' : 'Cần theo dõi thêm'
    };
  });
}

// ── LEADS ──
const LEAD_STATUSES = ['new','contacted','qualified','converted','lost'];
const LEAD_STATUS_LABELS = { new:'Mới', contacted:'Đã liên hệ', qualified:'Tiềm năng', converted:'Đã chuyển đổi', lost:'Không tiềm năng' };
const PRIORITIES = ['low','medium','high'];

function generateLeads(n = 20) {
  return Array.from({ length: n }, (_, i) => {
    const isMale = Math.random() > 0.5;
    const ho = rand(HO);
    const ten = isMale ? rand(TEN_NAM) : rand(TEN_NU);
    const daysAgo = randInt(0, 60);
    const created = new Date(Date.now() - daysAgo * 86400000);
    const statusIdx = Math.min(Math.floor(Math.random() * 2.5), 4);

    return {
      id: `LD${String(i + 1).padStart(3,'0')}`,
      name: `${ho} ${ten}`,
      gender: isMale ? 'Nam' : 'Nữ',
      email: `lead${i + 1}@gmail.com`,
      phone: `09${randInt(10000000, 99999999)}`,
      service: rand(SERVICES),
      source: rand(SOURCES),
      priority: rand(PRIORITIES),
      status: LEAD_STATUSES[statusIdx],
      note: `Khách hỏi về ${rand(SERVICES).toLowerCase()}, ngân sách khoảng ${(randInt(2, 20) * 500000).toLocaleString('vi-VN')} ₫.`,
      createdAt: created.toLocaleDateString('vi-VN'),
      assignedTo: rand(STAFF_NAMES)
    };
  });
}

// ── SURVEYS ──
function generateSurveys(n = 15) {
  const comments = [
    'Bác sĩ tư vấn rất tận tình, sẽ giới thiệu cho người thân.',
    'Thời gian chờ hơi lâu nhưng chất lượng dịch vụ tốt.',
    'Nhân viên thân thiện, cơ sở vật chất hiện đại.',
    'Rất hài lòng, kết quả xét nghiệm trả nhanh.',
    'Phòng khám sạch sẽ, bác sĩ giải thích rõ ràng.',
    'Giá cả hợp lý, chất lượng tương xứng.',
  ];

  return Array.from({ length: n }, (_, i) => {
    const daysAgo = randInt(0, 30);
    const date = new Date(Date.now() - daysAgo * 86400000);
    const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 – 5.0

    return {
      id: `SV${String(i + 1).padStart(3,'0')}`,
      patientId: `KH${String(randInt(1, 50)).padStart(3,'0')}`,
      date: date.toLocaleDateString('vi-VN'),
      serviceRating: parseFloat(rating),
      staffRating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
      waitRating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      overallRating: parseFloat(rating),
      comment: rand(comments),
      service: rand(SERVICES)
    };
  });
}

// ── INVENTORY (Kho Dược & Vật tư Y tế) ──
const SAMPLE_MEDICINES = [
  { id: 'MED001', name: 'Paracetamol 500mg', category: 'Thuốc hạ sốt, giảm đau', unit: 'Hộp', stock: 150, minStock: 30, price: 65000, expiry: '12/2027', status: 'normal' },
  { id: 'MED002', name: 'Amoxicillin 500mg', category: 'Kháng sinh', unit: 'Hộp', stock: 85, minStock: 25, price: 120000, expiry: '08/2026', status: 'normal' },
  { id: 'MED003', name: 'Bộ Kit Test Đường Huyết Accu-Chek', category: 'Vật tư chẩn đoán', unit: 'Bộ', stock: 12, minStock: 15, price: 380000, expiry: '06/2027', status: 'low' },
  { id: 'MED004', name: 'Băng Gạc Vô Trùng Y Tế 10x10', category: 'Vật tư tiêu hao', unit: 'Gói', stock: 320, minStock: 50, price: 25000, expiry: '10/2028', status: 'normal' },
  { id: 'MED005', name: 'Cồn Y Tế 70 Độ (Chai 500ml)', category: 'Sát khuẩn', unit: 'Chai', stock: 60, minStock: 20, price: 35000, expiry: '01/2027', status: 'normal' },
  { id: 'MED006', name: 'Khẩu Trang Y Tế 4 Lớp Kháng Khuẩn', category: 'Bảo hộ y tế', unit: 'Hộp', stock: 8, minStock: 20, price: 45000, expiry: '05/2028', status: 'low' },
  { id: 'MED007', name: 'Omega-3 Dầu Cá Tinh Khiết', category: 'Thực phẩm bổ sung', unit: 'Lọ', stock: 45, minStock: 15, price: 280000, expiry: '09/2026', status: 'normal' },
  { id: 'MED008', name: 'Găng Tay Cao Su Khám Bệnh (Size M)', category: 'Vật tư tiêu hao', unit: 'Hộp', stock: 95, minStock: 30, price: 95000, expiry: '11/2027', status: 'normal' },
  { id: 'MED009', name: 'Thuốc Nhỏ Mắt Kháng Viêm Tobradex', category: 'Chuyên khoa mắt', unit: 'Lọ', stock: 22, minStock: 10, price: 110000, expiry: '04/2026', status: 'normal' },
  { id: 'MED010', name: 'Bộ Dụng Cụ Nha Khoa Dùng 1 Lần', category: 'Vật tư nha khoa', unit: 'Bộ', stock: 5, minStock: 15, price: 85000, expiry: '12/2026', status: 'low' }
];

function generateInventory() {
  return [...SAMPLE_MEDICINES];
}

// ── INVOICES (Hóa Đơn & Thu Ngân Bán Hàng) ──
function generateInvoices(patients, n = 20) {
  const paymentMethods = ['Tiền mặt', 'Chuyển khoản QR', 'Thẻ Visa/Master', 'Bảo hiểm Y tế'];
  const invoiceStatuses = ['Đã thanh toán', 'Đã thanh toán', 'Đã thanh toán', 'Chờ thanh toán'];

  return Array.from({ length: n }, (_, i) => {
    const p = patients[i % patients.length] || { id: 'KH001', name: 'Nguyễn Văn An' };
    const daysAgo = randInt(0, 30);
    const date = new Date(Date.now() - daysAgo * 86400000);
    const amount = randInt(5, 45) * 200000;

    return {
      id: `HD${String(2026001 + i)}`,
      patientId: p.id,
      patientName: p.name,
      phone: p.phone,
      service: rand(SERVICES),
      amount: amount,
      paymentMethod: rand(paymentMethods),
      status: rand(invoiceStatuses),
      cashier: rand(STAFF_NAMES),
      createdAt: date.toLocaleDateString('vi-VN')
    };
  });
}

// ── KHỞI TẠO DỮ LIỆU ──
const DATA_KEY      = 'medcare_patients';
const LEADS_KEY     = 'medcare_leads';
const SURVEYS_KEY   = 'medcare_surveys';
const INVENTORY_KEY = 'medcare_inventory';
const INVOICES_KEY  = 'medcare_invoices';

function initData() {
  if (!localStorage.getItem(DATA_KEY)) {
    localStorage.setItem(DATA_KEY, JSON.stringify(generatePatients(50)));
  }
  if (!localStorage.getItem(LEADS_KEY)) {
    localStorage.setItem(LEADS_KEY, JSON.stringify(generateLeads(20)));
  }
  if (!localStorage.getItem(SURVEYS_KEY)) {
    localStorage.setItem(SURVEYS_KEY, JSON.stringify(generateSurveys(15)));
  }
  if (!localStorage.getItem(INVENTORY_KEY)) {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(generateInventory()));
  }
  if (!localStorage.getItem(INVOICES_KEY)) {
    const pts = getPatients();
    localStorage.setItem(INVOICES_KEY, JSON.stringify(generateInvoices(pts, 20)));
  }
}

function getInventory() {
  try { return JSON.parse(localStorage.getItem(INVENTORY_KEY)) || []; }
  catch { return []; }
}
function saveInventory(data) { localStorage.setItem(INVENTORY_KEY, JSON.stringify(data)); }

function getInvoices() {
  try { return JSON.parse(localStorage.getItem(INVOICES_KEY)) || []; }
  catch { return []; }
}
function saveInvoices(data) { localStorage.setItem(INVOICES_KEY, JSON.stringify(data)); }

function getPatients() {
  try { return JSON.parse(localStorage.getItem(DATA_KEY)) || []; }
  catch { return []; }
}
function savePatients(data) { localStorage.setItem(DATA_KEY, JSON.stringify(data)); }

function getLeads() {
  try { return JSON.parse(localStorage.getItem(LEADS_KEY)) || []; }
  catch { return []; }
}
function saveLeads(data) { localStorage.setItem(LEADS_KEY, JSON.stringify(data)); }

function getSurveys() {
  try { return JSON.parse(localStorage.getItem(SURVEYS_KEY)) || []; }
  catch { return []; }
}
function saveSurveys(data) { localStorage.setItem(SURVEYS_KEY, JSON.stringify(data)); }

// ── PHÂN LOẠI KHÁCH HÀNG (YÊU CẦU HỌC PHẦN) ──
/**
 * Phân hạng bệnh nhân theo giá trị giao dịch tích lũy
 * Đồng:  < 5.000.000 ₫
 * Bạc:   5.000.000 ₫ – 14.999.999 ₫
 * Vàng:  ≥ 15.000.000 ₫
 */
function classifyPatient(totalSpent) {
  if (totalSpent >= 15000000) return { rank: 'gold',   label: 'Vàng',  icon: '🥇', color: '#D97706' };
  if (totalSpent >= 5000000)  return { rank: 'silver', label: 'Bạc',   icon: '🥈', color: '#64748B' };
  return                               { rank: 'bronze', label: 'Đồng',  icon: '🥉', color: '#B77945' };
}

function getRankStats(patients) {
  return patients.reduce((acc, p) => {
    acc[p.rank] = (acc[p.rank] || 0) + 1;
    return acc;
  }, { gold: 0, silver: 0, bronze: 0 });
}

function getTodayFollowUps(patients) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return patients
    .filter(p => p.overdueDays > 0 || isFollowUpToday(p.nextFollowUp))
    .sort((a, b) => {
      const rankOrder = { gold: 0, silver: 1, bronze: 2 };
      return rankOrder[a.rank] - rankOrder[b.rank];
    });
}

function isFollowUpToday(dateStr) {
  if (!dateStr) return false;
  try {
    const [d, m, y] = dateStr.split('/').map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  } catch { return false; }
}

function formatCurrency(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M ₫';
  if (n >= 1000)    return (n / 1000).toFixed(0) + 'K ₫';
  return n.toLocaleString('vi-VN') + ' ₫';
}

// ── GLOBAL EXPORT ──
if (typeof window !== 'undefined') {
  window.initData         = initData;
  window.getPatients      = getPatients;
  window.savePatients     = savePatients;
  window.getLeads         = getLeads;
  window.saveLeads        = saveLeads;
  window.getSurveys       = getSurveys;
  window.saveSurveys      = saveSurveys;
  window.getInventory     = getInventory;
  window.saveInventory    = saveInventory;
  window.getInvoices      = getInvoices;
  window.saveInvoices     = saveInvoices;
  window.classifyPatient  = classifyPatient;
  window.getRankStats     = getRankStats;
  window.getTodayFollowUps= getTodayFollowUps;
  window.formatCurrency   = formatCurrency;
  window.SERVICES         = SERVICES;
  window.LEAD_STATUS_LABELS = LEAD_STATUS_LABELS;
  window.generateInteractions = generateInteractions;
}
if (typeof global !== 'undefined') {
  global.classifyPatient = classifyPatient;
  global.getRankStats    = getRankStats;
  global.formatCurrency  = formatCurrency;
}
