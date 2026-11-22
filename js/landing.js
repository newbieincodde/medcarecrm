/**
 * ==============================================================================
 * MEDCARE CRM — Landing Page Interactive Logic (v3.0 Comprehensive)
 * Typewriter Search, Specialty Knowledge Modal, Clinical Itemization,
 * FAQ Accordion & Public Patient Booking to CRM
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriterEffect();
  initHeroSearchSuggest();
  initPackageTabs();
  initSearchHandler();
  initPublicBookingModal();
  initFaqAccordion();
});

// ── 1. TYPEWRITER EFFECT WITH BLINKING CURSOR ──
function initTypewriterEffect() {
  const input = document.getElementById('heroSearchInput');
  if (!input) return;

  const phrases = [
    'Tìm kiếm bệnh viện Chợ Rẫy, Bạch Mai, ĐH Y Dược...',
    'Tìm kiếm bác sĩ Tim mạch, Tiêu hóa, Da liễu giỏi...',
    'Tìm gói khám tổng quát định kỳ & tầm soát ung thư...',
    'Tìm dịch vụ xét nghiệm máu tại nhà toàn quốc...',
    'Tìm bệnh viện gần bạn tại Hà Nội, TP.HCM, Đà Nẵng, Đồng Nai...'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 60;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      input.setAttribute('placeholder', currentPhrase.substring(0, charIdx - 1));
      charIdx--;
      typingSpeed = 25;
    } else {
      input.setAttribute('placeholder', currentPhrase.substring(0, charIdx + 1));
      charIdx++;
      typingSpeed = 60;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400;
    }

    if (document.activeElement !== input || input.value === '') {
      setTimeout(type, typingSpeed);
    }
  }

  type();
}


// ── 1.5 HERO SEARCH AUTO-SUGGEST DROPDOWN ──
function initHeroSearchSuggest() {
  const input = document.getElementById('heroSearchInput');
  const suggestPanel = document.getElementById('heroSearchSuggest');
  if (!input || !suggestPanel) return;

  function renderSuggestions(query) {
    const q = (query || '').toLowerCase().trim();
    const facilities = window.NATIONWIDE_FACILITIES || [];
    const specialties = window.SPECIALTIES_KNOWLEDGE || {};

    let matchedFacilities = [];
    let matchedSpecialties = [];
    let matchedPackages = [];

    if (!q) {
      // Top 3 facilities and top 3 specialties
      matchedFacilities = facilities.slice(0, 3);
      matchedSpecialties = Object.values(specialties).slice(0, 3);
    } else {
      matchedFacilities = facilities.filter(f => 
        f.name.toLowerCase().includes(q) || 
        f.address.toLowerCase().includes(q) || 
        (f.specialties && f.specialties.toLowerCase().includes(q))
      ).slice(0, 4);

      matchedSpecialties = Object.values(specialties).filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.symptoms && s.symptoms.some(sym => sym.toLowerCase().includes(q))) ||
        (s.diseases && s.diseases.some(d => d.toLowerCase().includes(q)))
      ).slice(0, 3);

      ['suckhoe', 'xetnghiem', 'tiemchung'].forEach(cat => {
        (PACKAGE_DATA[cat] || []).forEach(pkg => {
          if (pkg.title.toLowerCase().includes(q) || pkg.facility.toLowerCase().includes(q)) {
            if (matchedPackages.length < 3) matchedPackages.push(pkg);
          }
        });
      });
    }

    if (matchedFacilities.length === 0 && matchedSpecialties.length === 0 && matchedPackages.length === 0) {
      suggestPanel.innerHTML = `
        <div style="padding:16px 20px; text-align:center; color:#64748b; font-size:13px;">
          🔍 Không tìm thấy kết quả trực tiếp với "<strong>${query}</strong>".<br>
          <a href="pages/co-so-y-te.html?q=${encodeURIComponent(query)}" style="color:#0284c7; font-weight:700; text-decoration:none; margin-top:8px; display:inline-block;">
            ➔ Bấm vào đây để tra cứu toàn bộ 40 cơ sở
          </a>
        </div>
      `;
      suggestPanel.classList.add('open');
      return;
    }

    let html = '';

    if (matchedFacilities.length > 0) {
      html += `<div class="suggest-group-title">🏥 Cơ Sở Y Tế (${matchedFacilities.length})</div>`;
      matchedFacilities.forEach(f => {
        const safeName = f.name.replace(/'/g, "\\'");
        html += `
          <div class="suggest-item" onclick="openBookingModal('${safeName}'); document.getElementById('heroSearchSuggest').classList.remove('open');">
            <div class="suggest-item-icon">🏥</div>
            <div class="suggest-item-info">
              <div class="suggest-item-name">${f.name}</div>
              <div class="suggest-item-desc">📍 ${f.cityLabel} · ⭐ ${f.rating} · ${f.typeLabel}</div>
            </div>
            <span class="suggest-item-badge">Đặt khám</span>
          </div>
        `;
      });
    }

    if (matchedSpecialties.length > 0) {
      html += `<div class="suggest-group-title">🩺 Chuyên Khoa Y Tế (${matchedSpecialties.length})</div>`;
      matchedSpecialties.forEach(s => {
        html += `
          <div class="suggest-item" onclick="openSpecialtyKnowledge('${s.id}'); document.getElementById('heroSearchSuggest').classList.remove('open');">
            <div class="suggest-item-icon">${s.icon || '🩺'}</div>
            <div class="suggest-item-info">
              <div class="suggest-item-name">${s.name}</div>
              <div class="suggest-item-desc">${s.badge || 'Chuyên khoa'} · ${s.doctors ? s.doctors.split(',')[0] : ''}</div>
            </div>
            <span class="suggest-item-badge" style="background:#fef3c7; color:#b45309;">Xem cẩm nang</span>
          </div>
        `;
      });
    }

    if (matchedPackages.length > 0) {
      html += `<div class="suggest-group-title">📋 Gói Khám & Xét Nghiệm (${matchedPackages.length})</div>`;
      matchedPackages.forEach(p => {
        const safeTitle = p.title.replace(/'/g, "\\'");
        html += `
          <div class="suggest-item" onclick="openBookingModal('${safeTitle}'); document.getElementById('heroSearchSuggest').classList.remove('open');">
            <div class="suggest-item-icon">💊</div>
            <div class="suggest-item-info">
              <div class="suggest-item-name">${p.title}</div>
              <div class="suggest-item-desc">${p.facility} · <strong>${p.price}</strong></div>
            </div>
            <span class="suggest-item-badge">Đăng ký</span>
          </div>
        `;
      });
    }

    suggestPanel.innerHTML = html;
    suggestPanel.classList.add('open');
  }

  input.addEventListener('focus', () => {
    renderSuggestions(input.value);
  });

  input.addEventListener('input', () => {
    renderSuggestions(input.value);
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !suggestPanel.contains(e.target)) {
      suggestPanel.classList.remove('open');
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      suggestPanel.classList.remove('open');
    }
  });
}

// ── 2. REAL PHOTOGRAPHIC PACKAGES DATA & TABS ──
const PACKAGE_DATA = {
  suckhoe: [
    {
      title: 'Khám sức khỏe xin việc & đi làm',
      facility: 'Phòng khám Đa khoa Quốc tế Hàng Xanh',
      price: '563.000 ₫',
      oldPrice: '',
      img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
      desc: 'Bao gồm khám mắt, huyết áp, chụp X-quang phổi, xét nghiệm nước tiểu và cấp giấy trong ngày.'
    },
    {
      title: 'Khám sức khỏe tổng quát cơ bản (18 chỉ số)',
      facility: 'Trung tâm Xét nghiệm Y khoa Laditec Bình Dương',
      price: '540.000 ₫',
      oldPrice: '600.000 ₫',
      img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80',
      desc: 'Kiểm tra đường huyết, men gan, chức năng thận, mỡ máu, điện tim và siêu âm bụng 5 tạng.'
    },
    {
      title: 'Đo khúc xạ & Tầm soát tật khúc xạ mắt',
      facility: 'Bệnh viện Mắt Á Châu',
      price: '150.000 ₫',
      oldPrice: '',
      img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=600&q=80',
      desc: 'Đo nhãn áp không tiếp xúc, soi đáy mắt, chẩn đoán cận - loạn thị bằng máy Topcon Nhật Bản.'
    },
    {
      title: 'Gói khám Tổng quát Tầm soát Ung thư Nữ',
      facility: 'Phòng khám Gia Đình Tokyo - Tokyo Family Clinic',
      price: '2.140.000 ₫',
      oldPrice: '',
      img: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=600&q=80',
      desc: 'Tầm soát ung thư vú, ung thư cổ tử cung HPV Thinprep, siêu âm đầu dò và xét nghiệm CA 125.'
    }
  ],
  xetnghiem: [
    {
      title: 'Xét nghiệm Máu Tổng Quát 24 Chỉ Số',
      facility: 'Trung tâm Xét nghiệm Medlatec',
      price: '480.000 ₫',
      oldPrice: '550.000 ₫',
      img: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=600&q=80',
      desc: 'Định lượng công thức máu, đường huyết đói, lipid máu, men gan AST/ALT và acid uric.'
    },
    {
      title: 'Tầm soát Chức Năng Gan & Viêm Gan Siêu Vi B, C',
      facility: 'Phòng khám Đa khoa Sài Gòn Healthcare',
      price: '650.000 ₫',
      oldPrice: '',
      img: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=600&q=80',
      desc: 'Xét nghiệm HBsAg, Anti-HCV, men gan GGT, Bilirubin toàn phần đánh giá xơ gan sớm.'
    },
    {
      title: 'Kiểm tra Mỡ Máu & Nguy Cơ Đột Quỵ Sớm',
      facility: 'Trung tâm Xét nghiệm Labo Diag',
      price: '380.000 ₫',
      oldPrice: '',
      img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      desc: 'Định lượng Cholesterol, Triglyceride, HDL-C, LDL-C và tỷ lệ xơ vữa động mạch chuyên sâu.'
    },
    {
      title: 'Theo Dõi Đái Tháo Đường & HbA1c 3 Tháng',
      facility: 'Trung tâm Y Khoa Medic Hòa Hảo',
      price: '290.000 ₫',
      oldPrice: '',
      img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
      desc: 'Đánh giá mức kiểm soát đường huyết trung bình trong 90 ngày qua theo chuẩn ADA Hoa Kỳ.'
    }
  ],
  tiemchung: [
    {
      title: 'Vắc xin Cúm Mùa Tứ Giá Thế Hệ Mới (Vaxigrip Tetra)',
      facility: 'Hệ thống Tiêm chủng MedCare Toàn Quốc',
      price: '350.000 ₫',
      oldPrice: '',
      img: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
      desc: 'Phòng ngừa 4 chủng virus cúm A (H1N1, H3N2) và cúm B (Yamagata, Victoria) cho trẻ và người lớn.'
    },
    {
      title: 'Vắc xin Viêm Gan B Người Lớn (Engerix-B)',
      facility: 'Trung tâm Tiêm chủng Quốc tế Sim Med',
      price: '220.000 ₫',
      oldPrice: '',
      img: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80',
      desc: 'Kháng nguyên tinh chế tạo kháng thể Anti-HBs vững bền, bảo vệ gan khỏi virus viêm gan B.'
    },
    {
      title: 'Vắc xin Ung Thư Cổ Tử Cung HPV 9 Chủng (Gardasil 9)',
      facility: 'Bệnh viện Quốc tế City (CIH)',
      price: '2.950.000 ₫',
      oldPrice: '3.100.000 ₫',
      img: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=600&q=80',
      desc: 'Phòng ngừa 9 tuýp HPV nguy cơ cao gây ung thư cổ tử cung, âm hộ, hậu môn và sùi mào gà.'
    },
    {
      title: 'Vắc xin Phế Cầu 13 Chủng (Prevenar 13)',
      facility: 'Phòng khám Đa khoa CarePlus',
      price: '1.290.000 ₫',
      oldPrice: '',
      img: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=600&q=80',
      desc: 'Bảo vệ phổi, màng não và tai giữa khỏi phế cầu khuẩn Streptococcus pneumoniae ở người lớn và trẻ nhỏ.'
    }
  ]
};

function initPackageTabs() {
  const tabs = document.querySelectorAll('.pkg-tab-btn');
  const grid = document.getElementById('packagesGrid');
  if (!tabs || !grid) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.getAttribute('data-tab') || 'suckhoe';
      renderPackages(cat);
    });
  });

  renderPackages('suckhoe');
}

function renderPackages(cat) {
  const grid = document.getElementById('packagesGrid');
  if (!grid) return;

  const list = PACKAGE_DATA[cat] || PACKAGE_DATA.suckhoe;

  grid.innerHTML = list.map(item => {
    const safeTitle = item.title.replace(/'/g, "\\'");
    const safeFacility = item.facility.replace(/'/g, "\\'");
    return `
      <div class="package-card">
        <div class="package-img-wrap">
          <img src="${item.img}" alt="${item.title}" loading="lazy">
        </div>
        <div class="package-body">
          <div class="package-title">${item.title}</div>
          <div class="package-facility">🏥 ${item.facility}</div>
          <div style="font-size:12px; color:#475569; margin-bottom:12px; line-height:1.5;">${item.desc}</div>
          <div class="package-price-wrap">
            <span class="package-price-main">${item.price}</span>
            ${item.oldPrice ? `<span class="package-price-old">${item.oldPrice}</span>` : ''}
          </div>
          <button class="btn-book-now" onclick="openBookingModal('${safeTitle}', '${safeFacility}')">
            Đặt khám ngay
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ── 3. SEARCH HANDLER ──
function initSearchHandler() {
  const btn = document.getElementById('btnHeroSearch');
  const input = document.getElementById('heroSearchInput');

  function doSearch() {
    const q = input?.value.trim();
    if (q) {
      window.location.href = `pages/co-so-y-te.html?q=${encodeURIComponent(q)}`;
    } else {
      window.location.href = `pages/co-so-y-te.html`;
    }
  }

  if (btn) btn.addEventListener('click', doSearch);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  }
}

// ── 4. SPECIALTY KNOWLEDGE MODAL (Cẩm Nang Y Khoa Thực Tế) ──
window.openSpecialtyKnowledge = function (specialtyKey) {
  const data = window.SPECIALTIES_KNOWLEDGE ? window.SPECIALTIES_KNOWLEDGE[specialtyKey] : null;
  if (!data) return;

  const overlay = document.getElementById('specialtyKnowledgeModal');
  const container = document.getElementById('specialtyKnowledgeBody');

  if (overlay && container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:48px; height:48px; border-radius:50%; background:#e0f2fe; display:flex; align-items:center; justify-content:center; font-size:24px;">
            ${data.icon}
          </div>
          <div>
            <h3 style="font-size:20px; font-weight:800; color:#0f172a; margin:0;">Chuyên Khoa: ${data.name}</h3>
            <span style="font-size:11px; background:#ccfbf1; color:#0f766e; padding:2px 8px; border-radius:10px; font-weight:700;">
              ${data.badge}
            </span>
          </div>
        </div>
      </div>

      <!-- Phần 1: Triệu chứng khi nào cần đi khám -->
      <div style="margin-bottom:20px;">
        <h4 style="font-size:14px; font-weight:800; color:#b91c1c; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
          ⚠️ Triệu Chứng Báo Động (Khi Nào Bạn Cần Đi Khám Ngay?):
        </h4>
        ${data.symptoms.map(s => `
          <div class="symptom-pill">
            <span class="icon">•</span>
            <span>${s}</span>
          </div>
        `).join('')}
      </div>

      <!-- Phần 2: Bệnh lý điều trị phổ biến -->
      <div style="margin-bottom:20px;">
        <h4 style="font-size:14px; font-weight:800; color:#0f172a; margin-bottom:8px;">
          🩺 Các Bệnh Lý Thường Gặp & Điều Trị:
        </h4>
        <ul style="margin:0; padding-left:20px; font-size:13.5px; color:#334155; line-height:1.6;">
          ${data.diseases.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>

      <!-- Phần 3: Thiết bị máy móc chẩn đoán -->
      <div style="margin-bottom:20px;">
        <h4 style="font-size:14px; font-weight:800; color:#0f766e; margin-bottom:8px;">
          🔬 Trang Thiết Bị & Phương Pháp Chẩn Đoán Hiện Đại:
        </h4>
        ${data.equipment.map(eq => `
          <div class="tech-item-row">
            <span>⚙️</span>
            <span>${eq}</span>
          </div>
        `).join('')}
      </div>

      <!-- Phần 4: Bác sĩ phụ trách & Bệnh viện -->
      <div style="background:#f0fdfa; border:1px solid #ccfbf1; border-radius:12px; padding:14px 16px; margin-bottom:20px; font-size:13px;">
        <div style="margin-bottom:4px;">👨‍⚕️ <strong>Bác sĩ chuyên khoa tiêu biểu:</strong> ${data.doctors}</div>
        <div>🏥 <strong>Cơ sở y tế điều trị tuyến đầu:</strong> ${data.hospitals}</div>
      </div>

      <button class="btn btn-primary" onclick="openBookingModal('Khám chuyên khoa: ${data.name}')" style="width:100%; padding:12px 0; font-size:15px; font-weight:800;">
        📅 Đặt Lịch Khám Chuyên Khoa ${data.name}
      </button>
    `;

    overlay.classList.add('open');
  }
};

window.closeSpecialtyKnowledge = function () {
  const overlay = document.getElementById('specialtyKnowledgeModal');
  if (overlay) overlay.classList.remove('open');
  document.body.style.removeProperty('overflow');
  document.body.style.overflow = '';
};

// ── 5. FAQ ACCORDION ──
function initFaqAccordion() {
  const headers = document.querySelectorAll('.faq-header');
  headers.forEach(h => {
    h.addEventListener('click', () => {
      const parent = h.closest('.faq-item');
      if (parent) {
        parent.classList.toggle('open');
      }
    });
  });
}

// ── 6. PUBLIC PATIENT BOOKING MODAL (Không nhảy vào CRM Admin) ──
function initPublicBookingModal() {
  const overlay = document.getElementById('publicBookingModal');
  const btnClose = document.getElementById('btnCloseBookingModal');
  const form = document.getElementById('publicBookingForm');

  if (btnClose && overlay) {
    btnClose.addEventListener('click', () => window.closeBookingModal());
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) window.closeBookingModal();
    });
  }

  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    dateInput.value = tomorrow;
    dateInput.min = tomorrow;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name     = document.getElementById('bookName').value.trim();
      const phone    = document.getElementById('bookPhone').value.trim();
      const email    = document.getElementById('bookEmail')?.value.trim() || '';
      const date     = document.getElementById('bookDate').value;
      const timeSlot = document.getElementById('bookTimeSlot').value;
      const service  = document.getElementById('bookServiceDisplay').value;
      const facility = document.getElementById('bookFacilitySelect')?.value || 'Bệnh viện Chợ Rẫy (TP.HCM)';
      const note     = document.getElementById('bookNotes').value.trim();

      const codeNum = Math.floor(1000 + Math.random() * 9000);
      const bookingCode = `#MED2026-${codeNum}`;

      // SAVE DIRECTLY INTO CRM LOCALSTORAGE (medcare_leads)
      try {
        let leads = JSON.parse(localStorage.getItem('medcare_leads')) || [];
        const newLead = {
          id: `LD${String(leads.length + 1).padStart(3, '0')}`,
          name: name,
          gender: 'Chưa rõ',
          email: email || `${phone}@khachhang.medcare.vn`,
          phone: phone,
          service: service + ' - Cơ sở: ' + facility,
          source: 'Website Landing Page (Bệnh nhân tự đặt online)',
          priority: 'high',
          status: 'new',
          note: `[Mã đặt: ${bookingCode}] Hẹn: ${date} (${timeSlot}). Ghi chú: ${note || 'Không có'}`,
          createdAt: new Date().toLocaleDateString('vi-VN'),
          assignedTo: 'Tổng đài viên CSKH'
        };
        leads.unshift(newLead);
        localStorage.setItem('medcare_leads', JSON.stringify(leads));
      } catch (err) {
        console.error('Save lead error:', err);
      }

      // Show Success View in Modal
      document.getElementById('bookingFormContainer').style.display = 'none';
      const successView = document.getElementById('bookingSuccessContainer');
      successView.style.display = 'block';

      document.getElementById('displayBookingCode').textContent = bookingCode;
      document.getElementById('displayPatientName').textContent = name;
      document.getElementById('displayAppointmentTime').textContent = `${date} (${timeSlot})`;
    });
  }
}

// Global modal trigger
window.openBookingModal = function (serviceOrFacility, explicitFacility = '') {
  window.closeSpecialtyKnowledge();

  let service = (serviceOrFacility || '').trim();
  let facility = (explicitFacility || '').trim();

  const isFacilityRegex = /^(bệnh viện|phòng khám|trung tâm|viện\s|bv\s|medic|fv\s|careplus|triều an|phương đông|chợ rẫy|bạch mai|thu cúc|tâm anh|vinmec|hoàn mỹ|victoria|bernard|laditec|á châu)/i;

  if (isFacilityRegex.test(service) && !facility) {
    facility = service;
    service = 'Khám Bác Sĩ / Đăng Ký Khám Chuyên Khoa';
  } else if (!service) {
    service = 'Khám & Tư Vấn Sức Khỏe Toàn Diện';
  }

  const overlay = document.getElementById('publicBookingModal');
  const serviceInput = document.getElementById('bookServiceDisplay');
  const facSelect = document.getElementById('bookFacilitySelect');
  const formContainer = document.getElementById('bookingFormContainer');
  const successView = document.getElementById('bookingSuccessContainer');

  if (serviceInput) {
    serviceInput.value = service;
  }

  if (facSelect && facility) {
    let matched = false;
    const target = facility.toLowerCase();
    for (let i = 0; i < facSelect.options.length; i++) {
      const text = facSelect.options[i].text.toLowerCase();
      const val = facSelect.options[i].value.toLowerCase();
      if (text.includes(target) || val.includes(target) || target.includes(val)) {
        facSelect.selectedIndex = i;
        matched = true;
        break;
      }
    }
    if (!matched) {
      const opt = new Option(facility, facility, true, true);
      facSelect.add(opt, 1);
      facSelect.selectedIndex = 1;
    }
  }

  if (formContainer) formContainer.style.display = 'block';
  if (successView) successView.style.display = 'none';

  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      document.getElementById('bookName')?.focus();
    }, 200);
  }
};

window.closeBookingModal = function () {
  const overlay = document.getElementById('publicBookingModal');
  if (overlay) overlay.classList.remove('open');
  document.body.style.removeProperty('overflow');
  document.body.style.overflow = '';
};

window.closeBookingModalSuccess = window.closeBookingModal;


// ── 7. ARTICLE READER POPUP MODAL (Đọc Toàn Văn Bài Viết Cẩm Nang) ──
const ARTICLES_FULL_CONTENT = {
  1: {
    tag: 'Nội Thần Kinh',
    title: 'Dấu Hiệu Cảnh Báo Sớm Đột Quỵ: Quy Tắc Vàng F.A.S.T Bạn Phải Biết',
    author: 'TS.BS Nguyễn Văn An — Trưởng Đơn vị Đột quỵ Não',
    hospital: 'Bệnh viện Chợ Rẫy & BV Nhân Dân 115',
    readTime: '5 phút đọc',
    img: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80',
    content: `
      <p style="font-size:15px; font-weight:600; color:#0f172a; line-height:1.7;">
        Đột quỵ (tai biến mạch máu não) là nguyên nhân gây tử vong thứ 2 trên thế giới và là thủ phạm hàng đầu gây tàn phế vĩnh viễn ở người trưởng thành. Cứ mỗi phút trôi qua trong cơn đột quỵ, có gần <strong>2 triệu tế bào não chết đi</strong> do thiếu oxy nuôi dưỡng.
      </p>

      <h3 style="font-size:17px; font-weight:800; color:#0f766e; margin:22px 0 10px;">1. Quy Tắc Vàng F.A.S.T Nhận Biết Đột Quỵ Trong 1 Phút</h3>
      <div style="background:#f0fdfa; border-left:4px solid #0f766e; padding:14px 18px; border-radius:0 10px 10px 0; margin-bottom:16px;">
        <p style="margin:0 0 6px;"><strong>• F (Face - Khuôn mặt):</strong> Méo miệng, lệch một bên mặt, cười bị xệ khóe môi.</p>
        <p style="margin:0 0 6px;"><strong>• A (Arm - Tay chân):</strong> Yếu liệt một bên, yêu cầu giơ 2 tay lên cao thì một tay bị rơi xuống hoặc không nâng lên được.</p>
        <p style="margin:0 0 6px;"><strong>• S (Speech - Lời nói):</strong> Nói ngọng, phát âm khó, nói không rõ từ hoặc không hiểu được người khác nói gì.</p>
        <p style="margin:0;"><strong>• T (Time - Thời gian vàng):</strong> Hãy gọi ngay cấp cứu hoặc đưa người bệnh đến bệnh viện có đơn vị đột quỵ gần nhất trong <strong>3 đến 4.5 giờ đầu</strong>.</p>
      </div>

      <h3 style="font-size:17px; font-weight:800; color:#0f766e; margin:22px 0 10px;">2. Những Việc Tuyệt Đối KHÔNG ĐƯỢC LÀM Khi Nghi Ngờ Đột Quỵ</h3>
      <ul style="font-size:14px; line-height:1.7; color:#334155; padding-left:20px;">
        <li><strong>Không chích máu 10 đầu ngón tay hoặc dái tai:</strong> Đây là phương pháp dân gian phản khoa học, làm mất thời gian vàng cấp cứu và gây nhiễm trùng.</li>
        <li><strong>Không cạo gió, giật tóc mai:</strong> Gây kích thích đau đớn khiến huyết áp vọt lên cao hơn, tăng nguy cơ vỡ mạch máu não.</li>
        <li><strong>Không cho uống thuốc hạ huyết áp hoặc viên An cung ngưu hoàng:</strong> Người bệnh đang bị rối loạn nuốt, uống nước hoặc thuốc có thể gây sặc vào đường thở dẫn đến tắc thở tử vong ngay lập tức.</li>
      </ul>
    `
  },
  2: {
    tag: 'Nội Tiết & Dinh Dưỡng',
    title: 'Chế Độ Dinh Dưỡng Kiểm Soát Chỉ Số Đường Huyết Cho Người Tiền Tiểu Đường',
    author: 'BSCKII Lê Thanh Mai — Chuyên gia Nội tiết & Đái tháo đường',
    hospital: 'Bệnh viện Bạch Mai & Viện Dinh Dưỡng Quốc Gia',
    readTime: '4 phút đọc',
    img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80',
    content: `
      <p style="font-size:15px; font-weight:600; color:#0f172a; line-height:1.7;">
        Giai đoạn tiền đái tháo đường (đường huyết lúc đói từ 5.6 đến 6.9 mmol/L hoặc HbA1c từ 5.7 đến 6.4%) là "cơ hội vàng" duy nhất để bạn đảo ngược tình thế, đưa chỉ số đường máu trở về bình thường mà chưa cần phải uống thuốc suốt đời.
      </p>

      <h3 style="font-size:17px; font-weight:800; color:#0f766e; margin:22px 0 10px;">1. Quy Tắc "Đĩa Thức Ăn" Kiểm Soát Đường Huyết Chuẩn Quốc Tế</h3>
      <div style="background:#f0fdfa; border-left:4px solid #0f766e; padding:14px 18px; border-radius:0 10px 10px 0; margin-bottom:16px;">
        <p style="margin:0 0 6px;"><strong>• 1/2 đĩa là rau củ không tinh bột:</strong> Bông cải xanh, rau cải bó xôi, dưa leo, cà chua, măng tây...</p>
        <p style="margin:0 0 6px;"><strong>• 1/4 đĩa là protein nạc:</strong> Ức gà bỏ da, cá hồi, đậu phụ, trứng luộc, thịt nạc lợn.</p>
        <p style="margin:0;"><strong>• 1/4 đĩa là tinh bột chuyển hóa chậm (GI thấp):</strong> Gạo lứt, yến mạch nguyên hạt, khoai lang luộc.</p>
      </div>

      <h3 style="font-size:17px; font-weight:800; color:#0f766e; margin:22px 0 10px;">2. Thứ Tự Ăn Thông Minh Giúp Đường Huyết Không Bị Tăng Vọt</h3>
      <p style="font-size:14px; line-height:1.7; color:#334155;">
        Thử nghiệm lâm sàng chứng minh: Khi bạn <strong>ăn rau trước ➔ ăn thịt/cá tiếp theo ➔ ăn cơm/tinh bột sau cùng</strong>, lượng chất xơ sẽ bao phủ niêm mạc ruột, làm chậm quá trình hấp thu glucose vào máu, giúp chỉ số đường huyết sau ăn giảm 30%.
      </p>
    `
  },
  3: {
    tag: 'Tiêu Hóa Gan Mật',
    title: 'Nội Soi Dạ Dày Không Đau: Khi Nào Bạn Cần Tầm Soát Vi Khuẩn HP?',
    author: 'ThS.BS Lê Thành Đạt — Giảng viên Bộ môn Nội Tiêu Hóa',
    hospital: 'Bệnh viện Đại học Y Dược TP.HCM & BV Chợ Rẫy',
    readTime: '6 phút đọc',
    img: 'https://images.unsplash.com/photo-1576765608866-5b51046452be?auto=format&fit=crop&w=800&q=80',
    content: `
      <p style="font-size:15px; font-weight:600; color:#0f172a; line-height:1.7;">
        Việt Nam nằm trong vùng có tỷ lệ nhiễm vi khuẩn Helicobacter pylori (HP) rất cao, ước tính lên đến 70% dân số. Vi khuẩn HP là tác nhân số 1 gây viêm loét dạ dày tá tràng mạn tính và là yếu tố nguy cơ hàng đầu dẫn đến ung thư biểu mô dạ dày.
      </p>

      <h3 style="font-size:17px; font-weight:800; color:#0f766e; margin:22px 0 10px;">1. Khi Nào Bạn Cần Đi Nội Soi Tầm Soát Ngay?</h3>
      <ul style="font-size:14px; line-height:1.7; color:#334155; padding-left:20px;">
        <li>Đau cồn cào vùng thượng vị trên rốn, đau nặng hơn sau ăn hoặc khi đói bụng.</li>
        <li>Ợ chua, ợ hơi nóng rát vùng ngực cổ kéo dài trên 2 tuần.</li>
        <li>Gia đình có người thân trực hệ (bố mẹ, anh chị em ruột) mắc ung thư dạ dày.</li>
        <li>Sụt cân không rõ lý do, chán ăn, đi cầu phân đen sệt như bã cà phê.</li>
      </ul>
    `
  },
  4: {
    tag: 'Mắt & Thị Lực',
    title: 'Phương Pháp 20-20-20 Chống Mỏi Mắt Và Hạn Chế Tăng Độ Cận Cho Dân Văn Phòng',
    author: 'TS.BS Vũ Anh Tuấn — Giám đốc Chuyên môn',
    hospital: 'Bệnh viện Mắt Quốc Tế Á Châu',
    readTime: '3 phút đọc',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80',
    content: `
      <p style="font-size:15px; font-weight:600; color:#0f172a; line-height:1.7;">
        Hơn 75% người làm việc văn phòng trên 6 giờ/ngày gặp hội chứng thị giác màn hình: khô mắt, đỏ mắt, mờ mắt từng cơn và đau đầu nhức hốc mắt do tiếp xúc liên tục với ánh sáng xanh.
      </p>

      <h3 style="font-size:17px; font-weight:800; color:#0f766e; margin:22px 0 10px;">1. Quy Tắc Vàng 20 - 20 - 20</h3>
      <div style="background:#f0fdfa; border-left:4px solid #0f766e; padding:14px 18px; border-radius:0 10px 10px 0; margin-bottom:16px;">
        <p style="margin:0 0 6px;"><strong>• 20 Phút:</strong> Cứ sau mỗi 20 phút nhìn màn hình máy tính.</p>
        <p style="margin:0 0 6px;"><strong>• 20 Feet (6 Mét):</strong> Hãy phóng tầm mắt nhìn vào một vật cách xa ít nhất 6 mét.</p>
        <p style="margin:0;"><strong>• 20 Giây:</strong> Giữ ánh nhìn thư giãn đó trong ít nhất 20 giây để cơ điều tiết mắt nghỉ ngơi.</p>
      </div>
    `
  }
};

window.openArticleReader = function(articleId) {
  const art = ARTICLES_FULL_CONTENT[articleId];
  if (!art) return;

  const modal = document.getElementById('articleReaderModal');
  const body = document.getElementById('articleReaderContent');

  if (modal && body) {
    body.innerHTML = `
      <div style="margin-bottom:12px;">
        <span style="font-size:11px; font-weight:800; background:#e0f2fe; color:#0284c7; padding:4px 10px; border-radius:12px; text-transform:uppercase;">
          ${art.tag}
        </span>
        <span style="font-size:12px; color:#64748b; margin-left:10px;">⏱️ ${art.readTime}</span>
      </div>

      <h1 style="font-size:22px; font-weight:800; color:#0f172a; line-height:1.35; margin-bottom:14px;">
        ${art.title}
      </h1>

      <div style="display:flex; align-items:center; gap:12px; padding:12px 16px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:20px;">
        <div style="font-size:28px;">👨‍⚕️</div>
        <div style="font-size:13px;">
          <div style="font-weight:700; color:#0f172a;">${art.author}</div>
          <div style="color:#64748b;">${art.hospital}</div>
        </div>
      </div>

      <div style="width:100%; height:300px; border-radius:14px; overflow:hidden; margin-bottom:22px;">
        <img src="${art.img}" alt="${art.title}" style="width:100%; height:100%; object-fit:cover;">
      </div>

      <div style="color:#334155; line-height:1.75; font-size:14px;">
        ${art.content}
      </div>

      <div style="margin-top:28px; padding:18px; background:#f0fdfa; border:1px solid #99f6e4; border-radius:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="font-weight:800; font-size:14.5px; color:#0f766e;">Bạn cần tư vấn chi tiết với Bác sĩ chuyên khoa?</div>
          <div style="font-size:12.5px; color:#475569;">Đặt lịch hẹn trước để được tiếp đón theo khung giờ mong muốn</div>
        </div>
        <button class="btn btn-primary btn-sm" id="btnLandingArticleBook" style="font-weight:800;">
          📅 Đặt Khám Ngay
        </button>
      </div>
    `;

    const bookBtn = body.querySelector('#btnLandingArticleBook');
    if (bookBtn) {
      bookBtn.onclick = function () {
        window.closeArticleReader();
        window.openBookingModal('Tư vấn & Khám: ' + art.title);
      };
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeArticleReader = function() {
  const modal = document.getElementById('articleReaderModal');
  if (modal) modal.classList.remove('open');
  document.body.style.removeProperty('overflow');
  document.body.style.overflow = '';
};
