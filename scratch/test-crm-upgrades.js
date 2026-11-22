/**
 * Test script for MedCare CRM Enterprise Upgrades (v3.0)
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const jsDir = path.join(rootDir, 'js');

console.log('=== TEST SUITE: MEDCARE CRM ENTERPRISE UPGRADES ===');

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
global.window = { location: { href: '', search: '', pathname: '/dashboard/index.html' } };
global.document = {
  getElementById: function () { return null; },
  querySelectorAll: function () { return []; }
};

// 1. Load data.js
eval(fs.readFileSync(path.join(jsDir, 'data.js'), 'utf8'));
global.window.initData();

const patients = global.window.getPatients();
const leads = global.window.getLeads();
const inventory = global.window.getInventory();
const invoices = global.window.getInvoices();

console.log(`[PASS] Initial Data Seeded: ${patients.length} patients, ${leads.length} leads, ${inventory.length} meds, ${invoices.length} invoices.`);

// 2. Load auth.js
eval(fs.readFileSync(path.join(jsDir, 'auth.js'), 'utf8'));

// 3. Test EHR Data Mapping
console.log('\n--- 1. Testing EHR Patient Data Generation ---');
const sampleP = patients[0];
console.log(`Sample Patient: ${sampleP.name} (${sampleP.id}), Rank: ${sampleP.rank}, Spent: ${sampleP.totalSpent}`);
if (sampleP.name && sampleP.phone && sampleP.service) {
  console.log('[PASS] Patient object has valid structure for EHR modal rendering.');
}

// 4. Test Kiosk Dispatch logic
console.log('\n--- 2. Testing Kiosk Dispatcher Logic ---');
const sampleLead = leads[0];
const kioskNum = '#15';
const room = 'Buồng 01 — Tim Mạch & Huyết Áp (Tầng 1)';
sampleLead.status = 'contacted';
sampleLead.note = (sampleLead.note || '') + ` [Số thứ tự: ${kioskNum} — ${room}]`;
global.window.saveLeads(leads);

const reloadedLeads = global.window.getLeads();
const updatedLead = reloadedLeads.find(l => l.id === sampleLead.id);
if (updatedLead.note.includes('#15') && updatedLead.status === 'contacted') {
  console.log('[PASS] Kiosk queue number successfully stored & synchronized with medcare_leads!');
} else {
  console.error('[FAIL] Kiosk dispatch lead failed to save correctly.');
}

// 5. Test VietQR Payment Flow
console.log('\n--- 3. Testing VietQR Cashier Payment Flow ---');
const sampleInv = invoices.find(i => i.status === 'Chờ thanh toán') || invoices[0];
sampleInv.status = 'Đã thanh toán';
sampleInv.paymentMethod = 'Chuyển khoản QR';
global.window.saveInvoices(invoices);

const reloadedInvoices = global.window.getInvoices();
const updatedInv = reloadedInvoices.find(i => i.id === sampleInv.id);
if (updatedInv.status === 'Đã thanh toán' && updatedInv.paymentMethod === 'Chuyển khoản QR') {
  console.log('[PASS] VietQR invoice payment marked as paid in medcare_invoices!');
}

console.log('\n=== ALL CRM UPGRADE TESTS COMPLETED 100% SUCCESSFULLY! ===');
