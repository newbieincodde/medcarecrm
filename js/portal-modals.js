/**
 * ==============================================================================
 * MEDCARE CRM — Portal Shared Modals & Backdrop Dismiss Handler (v3.1)
 * Provides Booking Modal, Specialty Knowledge Modal, Article Reader Modal,
 * and Hotline Callback Modal across all portal pages with outside-click closing,
 * ESC key dismiss, and bulletproof scrolling restoration.
 * ==============================================================================
 */

(function () {
  'use strict';

  // ── 0. HELPER: RESTORE BODY SCROLL UNCONDITIONALLY ──
  function restoreBodyScroll() {
    try {
      if (document.body) {
        document.body.style.overflow = '';
        if (typeof document.body.style.removeProperty === 'function') {
          document.body.style.removeProperty('overflow');
        }
      }
      if (document.documentElement) {
        document.documentElement.style.overflow = '';
        if (typeof document.documentElement.style.removeProperty === 'function') {
          document.documentElement.style.removeProperty('overflow');
        }
      }
    } catch (e) {
      console.warn('Error restoring scroll:', e);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ── 1. GLOBAL BACKDROP & ESCAPE CLOSE LISTENER ──
  document.addEventListener('click', function (e) {
    const modalIds = [
      'specialtyKnowledgeModal',
      'publicBookingModal',
      'bookingModal',
      'articleReaderModal',
      'hotlineModal'
    ];

    modalIds.forEach(id => {
      const modal = document.getElementById(id);
      if (modal && e.target === modal) {
        modal.classList.remove('open');
        modal.classList.remove('active');
        restoreBodyScroll();
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      window.closeAllModals();
    }
  });

  window.closeAllModals = function () {
    const modalIds = [
      'specialtyKnowledgeModal',
      'publicBookingModal',
      'bookingModal',
      'articleReaderModal',
      'hotlineModal'
    ];
    modalIds.forEach(id => {
      const m = document.getElementById(id);
      if (m) {
        m.classList.remove('open');
        m.classList.remove('active');
      }
    });
    restoreBodyScroll();
  };

  // ── 2. HOTLINE MODAL ──
  window.openHotlineModal = function () {
    let modal = document.getElementById('hotlineModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'hotlineModal';
      modal.className = 'specialty-modal-overlay';
      modal.innerHTML = `
        <div class="specialty-modal-box" style="max-width:560px; text-align:center;">
          <div class="specialty-modal-header" style="border-bottom:none; padding-bottom:0;">
            <div style="font-weight:800; font-size:16px; color:#ffffff;">
              📞 TỔNG ĐÀI ĐẶT KHÁM & TƯ VẤN SỨC KHỎE
            </div>
            <button class="booking-modal-close" onclick="window.closeHotlineModal()">✕</button>
          </div>
          <div class="specialty-modal-body" style="padding:10px 30px 30px;">
            <div style="width:70px; height:70px; border-radius:50%; background:#fef3c7; color:#d97706; display:flex; align-items:center; justify-content:center; font-size:34px; margin:10px auto 16px;">
              ☎️
            </div>
            <h3 style="font-size:22px; font-weight:800; color:#0f172a; margin-bottom:8px;">
              Tổng Đài Hỗ Trợ 24/7 Toàn Quốc
            </h3>
            <div style="font-size:32px; font-weight:900; color:#ea580c; letter-spacing:1px; margin-bottom:12px;">
              xxxx-xxxx
            </div>
            <p style="font-size:14px; color:#475569; line-height:1.6; margin-bottom:20px;">
              Cước gọi hoàn toàn <strong>MIỄN PHÍ</strong>. Đội ngũ Điều dưỡng & Bác sĩ trực ban sẵn sàng tư vấn chuyên khoa, báo giá xét nghiệm và hỗ trợ lấy số thứ tự ưu tiên tại hơn 40 bệnh viện trên cả nước.
            </p>

            <a href="tel:xxxx-xxxx" class="btn btn-primary" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:14px; font-size:16px; font-weight:800; text-decoration:none; margin-bottom:16px; border-radius:12px; background:linear-gradient(135deg, #0f766e, #0284c7);">
              <span>📞 BẤM GỌI NGAY: xxxx-xxxx</span>
            </a>

            <div style="position:relative; margin:20px 0; text-align:center;">
              <span style="background:#ffffff; padding:0 12px; color:#94a3b8; font-size:12px; position:relative; z-index:1;">HOẶC ĐỂ LẠI SỐ ĐIỆN THOẠI</span>
              <div style="position:absolute; top:50%; left:0; right:0; height:1px; background:#e2e8f0; z-index:0;"></div>
            </div>

            <form id="hotlineCallbackForm" onsubmit="window.handleHotlineCallback(event)">
              <div style="display:flex; gap:10px; margin-bottom:12px;">
                <input type="text" id="hotlineLeadName" required placeholder="Họ và tên của bạn *" style="flex:1; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;">
                <input type="tel" id="hotlineLeadPhone" required pattern="[0-9]{10,11}" placeholder="Số điện thoại *" style="flex:1; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;">
              </div>
              <input type="text" id="hotlineLeadNeeds" placeholder="Nhu cầu: Bệnh viện muốn khám, Triệu chứng..." style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; margin-bottom:14px;">
              <button type="submit" class="btn btn-outline" style="width:100%; padding:11px; font-size:14px; font-weight:700; border-radius:8px;">
                📩 Yêu Cầu Bác Sĩ Gọi Lại Sau 3 Phút (Miễn Phí)
              </button>
            </form>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modal.classList.add('open');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeHotlineModal = function () {
    const modal = document.getElementById('hotlineModal');
    if (modal) {
      modal.classList.remove('open');
      modal.classList.remove('active');
    }
    restoreBodyScroll();
  };

  window.handleHotlineCallback = function (e) {
    e.preventDefault();
    const name = document.getElementById('hotlineLeadName').value.trim();
    const phone = document.getElementById('hotlineLeadPhone').value.trim();
    const needs = document.getElementById('hotlineLeadNeeds').value.trim();

    const newLead = {
      id: 'LD' + String(Date.now()).slice(-4),
      name: name,
      gender: 'Chưa rõ',
      email: `${phone}@khachhang.medcare.vn`,
      phone: phone,
      service: 'Yêu cầu tư vấn Hotline xxxx-xxxx',
      source: 'Popup Hotline xxxx-xxxx',
      priority: 'high',
      status: 'new',
      note: `Khách yêu cầu gọi lại: ${needs || 'Tư vấn khám tổng quát'}. Hotline: xxxx-xxxx`,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      assignedTo: 'Tổng đài viên CSKH'
    };

    try {
      let leads = JSON.parse(localStorage.getItem('medcare_leads') || '[]');
      leads.unshift(newLead);
      localStorage.setItem('medcare_leads', JSON.stringify(leads));
    } catch (err) {
      console.error(err);
    }

    alert(`✅ Cảm ơn bạn ${name}! MedCare đã tiếp nhận yêu cầu. Nhân viên y tế sẽ gọi lại cho bạn qua số ${phone} trong vòng 3 phút!`);
    window.closeHotlineModal();
  };

  // ── 3. SPECIALTY KNOWLEDGE MODAL ──
  window.openSpecialtyKnowledge = function (specialtyKey) {
    const data = window.SPECIALTIES_KNOWLEDGE ? window.SPECIALTIES_KNOWLEDGE[specialtyKey] : null;
    if (!data) {
      console.warn('Specialty data not found for key:', specialtyKey);
      return;
    }

    let overlay = document.getElementById('specialtyKnowledgeModal');
    let container = document.getElementById('specialtyKnowledgeBody');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'specialtyKnowledgeModal';
      overlay.className = 'specialty-modal-overlay';
      overlay.innerHTML = `
        <div class="specialty-modal-box">
          <div class="specialty-modal-header">
            <div style="font-weight:800; font-size:17px; display:flex; align-items:center; gap:8px;">
              <span>🩺</span> Cẩm Nang Kiến Thức Chuyên Khoa Y Tế
            </div>
            <button class="booking-modal-close" onclick="window.closeSpecialtyKnowledge()">✕</button>
          </div>
          <div class="specialty-modal-body" id="specialtyKnowledgeBody" style="padding:24px 28px;"></div>
        </div>
      `;
      document.body.appendChild(overlay);
      container = document.getElementById('specialtyKnowledgeBody');
    }

    if (overlay && container) {
      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:48px; height:48px; border-radius:50%; background:#e0f2fe; display:flex; align-items:center; justify-content:center; font-size:24px;">
              ${data.icon || '🩺'}
            </div>
            <div>
              <h3 style="font-size:20px; font-weight:800; color:#0f172a; margin:0;">Chuyên Khoa: ${escapeHtml(data.name)}</h3>
              <span style="font-size:11px; background:#ccfbf1; color:#0f766e; padding:2px 8px; border-radius:10px; font-weight:700;">
                ${escapeHtml(data.badge || 'Chuyên Khoa Tuyến Đầu')}
              </span>
            </div>
          </div>
        </div>

        <div style="margin-bottom:20px;">
          <h4 style="font-size:14px; font-weight:800; color:#b91c1c; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
            ⚠️ Triệu Chứng Báo Động (Khi Nào Bạn Cần Đi Khám Ngay?):
          </h4>
          ${(data.symptoms || []).map(s => `
            <div class="symptom-pill" style="margin-bottom:6px; display:flex; align-items:flex-start; gap:8px; font-size:13.5px; color:#1e293b;">
              <span style="color:#b91c1c; font-weight:bold;">•</span>
              <span>${escapeHtml(s)}</span>
            </div>
          `).join('')}
        </div>

        <div style="margin-bottom:20px;">
          <h4 style="font-size:14px; font-weight:800; color:#0f172a; margin-bottom:8px;">
            🩺 Các Bệnh Lý Thường Gặp & Điều Trị:
          </h4>
          <ul style="margin:0; padding-left:20px; font-size:13.5px; color:#334155; line-height:1.6;">
            ${(data.diseases || []).map(d => `<li>${escapeHtml(d)}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-bottom:20px;">
          <h4 style="font-size:14px; font-weight:800; color:#0f766e; margin-bottom:8px;">
            🔬 Trang Thiết Bị & Phương Pháp Chẩn Đoán Hiện Đại:
          </h4>
          ${(data.equipment || []).map(eq => `
            <div class="tech-item-row" style="margin-bottom:6px; display:flex; align-items:center; gap:8px; font-size:13px; color:#334155;">
              <span>⚙️</span>
              <span>${escapeHtml(eq)}</span>
            </div>
          `).join('')}
        </div>

        <div style="background:#f0fdfa; border:1px solid #ccfbf1; border-radius:12px; padding:14px 16px; margin-bottom:20px; font-size:13px;">
          <div style="margin-bottom:4px;">👨‍⚕️ <strong>Bác sĩ chuyên khoa tiêu biểu:</strong> ${escapeHtml(data.doctors || 'Đội ngũ Bác sĩ CKII tuyến Trung ương')}</div>
          <div>🏥 <strong>Cơ sở y tế điều trị tuyến đầu:</strong> ${escapeHtml(data.hospitals || 'Hệ thống 40+ bệnh viện đối tác MedCare')}</div>
        </div>

        <button type="button" class="btn btn-primary" id="btnSpecialtyBookNow" style="width:100%; padding:13px 0; font-size:15px; font-weight:800; border-radius:10px;">
          📅 Đặt Lịch Khám Chuyên Khoa ${escapeHtml(data.name)}
        </button>
      `;

      // Programmatic click listener
      const bookBtn = container.querySelector('#btnSpecialtyBookNow');
      if (bookBtn) {
        bookBtn.onclick = function () {
          window.closeSpecialtyKnowledge();
          window.openBookingModal('Khám chuyên khoa: ' + data.name);
        };
      }

      overlay.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeSpecialtyKnowledge = function () {
    const overlay = document.getElementById('specialtyKnowledgeModal');
    if (overlay) {
      overlay.classList.remove('open');
      overlay.classList.remove('active');
    }
    restoreBodyScroll();
  };

  // ── 4. UNIFIED PUBLIC BOOKING MODAL (Supports all pages and smart facility detection) ──
  window.openBookingModal = function (serviceOrFacility = '', explicitFacility = '') {
    window.closeSpecialtyKnowledge();
    window.closeArticleReader();

    let service = (serviceOrFacility || '').trim();
    let facility = (explicitFacility || '').trim();

    // Smart detection: If the first argument is a hospital/clinic/center name, map it to facility!
    const isFacilityRegex = /^(bệnh viện|phòng khám|trung tâm|viện\s|bv\s|medic|fv\s|careplus|triều an|phương đông|chợ rẫy|bạch mai|thu cúc|tâm anh|vinmec|hoàn mỹ|victoria|bernard|laditec|á châu)/i;

    if (isFacilityRegex.test(service) && !facility) {
      facility = service;
      service = 'Khám Bác Sĩ / Đăng Ký Khám Chuyên Khoa';
    } else if (!service) {
      service = 'Khám & Tư Vấn Sức Khỏe Toàn Diện';
    }

    let overlay = document.getElementById('publicBookingModal') || document.getElementById('bookingModal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'publicBookingModal';
      overlay.className = 'public-booking-overlay';
      overlay.innerHTML = `
        <div class="public-booking-box">
          <div class="booking-modal-header">
            <div class="booking-modal-title">
              <span>📅</span> Đặt Lịch Khám Trực Tuyến Toàn Quốc
            </div>
            <button class="booking-modal-close" onclick="window.closeBookingModal()">✕</button>
          </div>
          <div class="booking-modal-body" id="bookingFormContainer">
            <form id="publicBookingForm" onsubmit="window.handlePublicBookingSubmit(event)">
              <div class="form-group">
                <label class="form-label">Dịch vụ / Gói khám đăng ký <span style="color:#ef4444;">*</span></label>
                <input type="text" class="form-control" id="bookServiceDisplay" readonly style="background:#f1f5f9; font-weight:700; color:#0f766e;">
              </div>

              <div class="form-group">
                <label class="form-label">Bệnh viện / Cơ sở y tế tiếp đón <span style="color:#ef4444;">*</span></label>
                <select class="form-control" id="bookFacilitySelect" required>
                  <optgroup label="🏥 Đề Xuất Tuyến Cuối Hàng Đầu">
                    <option value="Bệnh viện Chợ Rẫy (TP.HCM)" selected>Bệnh viện Chợ Rẫy — Quận 5, TP.HCM</option>
                    <option value="Bệnh viện Bạch Mai (Hà Nội)">Bệnh viện Bạch Mai — Đống Đa, Hà Nội</option>
                    <option value="Bệnh viện Đại học Y Dược TP.HCM">Bệnh viện Đại học Y Dược — Quận 5, TP.HCM</option>
                    <option value="Bệnh viện Hữu Nghị Việt Đức (Hà Nội)">Bệnh viện Hữu Nghị Việt Đức — Hà Nội</option>
                    <option value="Bệnh viện Trung ương Huế">Bệnh viện Trung ương Huế — Vĩnh Ninh, Huế</option>
                    <option value="Bệnh viện Đa khoa Đà Nẵng">Bệnh viện Đa khoa Đà Nẵng — Hải Châu, Đà Nẵng</option>
                  </optgroup>
                  <optgroup label="🏢 Bệnh Viện Tư Nhân Chất Lượng Cao">
                    <option value="Bệnh viện Đa khoa Tư nhân Triều An (TP.HCM)">Bệnh viện Đa khoa Triều An — Bình Tân, TP.HCM (4.9 ⭐)</option>
                    <option value="Bệnh viện Đa khoa Phương Đông (Hà Nội)">Bệnh viện Đa khoa Phương Đông — Bắc Từ Liêm, Hà Nội (5.0 ⭐)</option>
                    <option value="Bệnh viện Đa khoa Tâm Anh (Hà Nội & TP.HCM)">Bệnh viện Đa khoa Tâm Anh — TP.HCM & Hà Nội</option>
                    <option value="Bệnh viện Đa khoa Quốc tế Vinmec">Bệnh viện Đa khoa Quốc tế Vinmec</option>
                  </optgroup>
                  <optgroup label="🔬 Phòng Khám & Trung Tâm Xét Nghiệm">
                    <option value="Trung tâm Xét nghiệm Y khoa Laditec Bình Dương">Trung tâm Xét nghiệm Laditec — Bình Dương</option>
                    <option value="Phòng Khám Da Liễu BS.CKII Đoàn Văn Lợi Em">Phòng Khám BS.CKII Đoàn Văn Lợi Em — Tân Phú, TP.HCM</option>
                    <option value="Bệnh viện Mắt Quốc Tế Á Châu">Bệnh viện Mắt Á Châu — Quận 10, TP.HCM</option>
                    <option value="Trung tâm Xét nghiệm MedCare Lab">MedCare Lab Toàn Quốc — Lấy mẫu tại nhà 63 tỉnh</option>
                  </optgroup>
                </select>
              </div>

              <div class="form-row" style="display:flex; gap:12px; margin-bottom:12px;">
                <div class="form-group" style="flex:1;">
                  <label class="form-label">Họ và tên bệnh nhân <span style="color:#ef4444;">*</span></label>
                  <input type="text" class="form-control" id="bookName" placeholder="Nguyễn Văn An" required minlength="2">
                </div>
                <div class="form-group" style="flex:1;">
                  <label class="form-label">Số điện thoại liên hệ <span style="color:#ef4444;">*</span></label>
                  <input type="tel" class="form-control" id="bookPhone" placeholder="09xxxxxxxx" required pattern="^0[0-9]{9,10}$">
                </div>
              </div>

              <div class="form-row" style="display:flex; gap:12px; margin-bottom:12px;">
                <div class="form-group" style="flex:1;">
                  <label class="form-label">Ngày khám dự kiến <span style="color:#ef4444;">*</span></label>
                  <input type="date" class="form-control" id="bookDate" required>
                </div>
                <div class="form-group" style="flex:1;">
                  <label class="form-label">Khung giờ tiếp đón <span style="color:#ef4444;">*</span></label>
                  <select class="form-control" id="bookTimeSlot" required>
                    <option value="Sáng (07:30 - 09:30)">Buổi sáng (07:30 – 09:30)</option>
                    <option value="Sáng (09:30 - 11:30)">Buổi sáng (09:30 – 11:30)</option>
                    <option value="Chiều (13:30 - 15:30)">Buổi chiều (13:30 – 15:30)</option>
                    <option value="Ngoài giờ (17:30 - 20:00)">Khám ngoài giờ (17:30 – 20:00)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Mô tả triệu chứng / Ghi chú cho bác sĩ</label>
                <textarea class="form-control" id="bookNotes" rows="2" placeholder="Ví dụ: Đau tức ngực, huyết áp cao, tiền sử đái tháo đường..."></textarea>
              </div>

              <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                <button type="button" class="btn btn-outline" onclick="window.closeBookingModal()">Hủy bỏ</button>
                <button type="submit" class="btn btn-primary" style="flex:1; padding:12px 0; font-size:15px; font-weight:800;">
                  ✓ Xác Nhận Đăng Ký Khám Ưu Tiên
                </button>
              </div>
            </form>
          </div>

          <div class="booking-modal-body booking-success-view" id="bookingSuccessContainer" style="display:none; text-align:center; padding:30px;">
            <div style="width:60px; height:60px; border-radius:50%; background:#dcfce7; color:#16a34a; display:flex; align-items:center; justify-content:center; font-size:32px; margin:0 auto 16px;">✓</div>
            <h3 style="font-size:20px; font-weight:800; color:#0f172a; margin-bottom:6px;">Đặt Khám Trực Tuyến Thành Công!</h3>
            <p style="font-size:14px; color:#64748b; line-height:1.5;">Hồ sơ của bạn đã được tiếp nhận và đồng bộ vào hệ thống tiếp đón y tế.</p>
            <div class="booking-code-badge" id="displayBookingCode" style="font-size:20px; font-weight:900; color:#0f766e; background:#ccfbf1; padding:8px 18px; border-radius:10px; display:inline-block; margin:16px 0;">#MED2026-8891</div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px 18px; text-align:left; font-size:13px; margin-bottom:20px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span style="color:#64748b;">Bệnh nhân:</span>
                <strong id="displayPatientName">Nguyễn Văn An</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span style="color:#64748b;">Nơi khám:</span>
                <span id="displayFacilityName" style="color:#0f766e; font-weight:700;">Bệnh viện Chợ Rẫy</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span style="color:#64748b;">Thời gian hẹn:</span>
                <span id="displayAppointmentTime">Ngày mai (07:30 – 09:30)</span>
              </div>
            </div>
            <button type="button" class="btn btn-primary" onclick="window.closeBookingModal()" style="width:100%; padding:12px; font-weight:800;">
              Hoàn Tất & Đóng
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    // Set service display input (supports both bookServiceDisplay and bookServiceInput)
    const srvDisplay = document.getElementById('bookServiceDisplay') || document.getElementById('bookServiceInput');
    if (srvDisplay) {
      srvDisplay.value = service;
    }

    // Set facility selector
    const facSelect = document.getElementById('bookFacilitySelect');
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

    // Date default
    const dateInput = document.getElementById('bookDate');
    if (dateInput && !dateInput.value) {
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      dateInput.value = tomorrow;
      dateInput.min = tomorrow;
    }

    // Reset views
    const formBox = document.getElementById('bookingFormContainer');
    const successBox = document.getElementById('bookingSuccessContainer');
    if (formBox) formBox.style.display = 'block';
    if (successBox) successBox.style.display = 'none';

    overlay.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      const nameInput = document.getElementById('bookName') || document.getElementById('bookFullName');
      if (nameInput) nameInput.focus();
    }, 200);
  };

  // Close booking modal
  window.closeBookingModal = function () {
    const overlay = document.getElementById('publicBookingModal') || document.getElementById('bookingModal');
    if (overlay) {
      overlay.classList.remove('open');
      overlay.classList.remove('active');
    }
    restoreBodyScroll();
  };

  window.closeBookingModalSuccess = window.closeBookingModal;
  window.closePackageBooking = window.closeBookingModal;
  window.closePublicBooking = window.closeBookingModal;
  window.openPublicBooking = window.openBookingModal;
  window.openPackageBooking = window.openBookingModal;

  // Handle Form Submission
  window.handlePublicBookingSubmit = function (e) {
    if (e && e.preventDefault) e.preventDefault();

    const nameInput = document.getElementById('bookName') || document.getElementById('bookFullName');
    const phoneInput = document.getElementById('bookPhone');
    const srvInput = document.getElementById('bookServiceDisplay') || document.getElementById('bookServiceInput');
    const facInput = document.getElementById('bookFacilitySelect');
    const dateInput = document.getElementById('bookDate');
    const timeInput = document.getElementById('bookTimeSlot');
    const noteInput = document.getElementById('bookNotes') || document.getElementById('bookNote');

    const name = nameInput ? nameInput.value.trim() : 'Bệnh nhân';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const service = srvInput ? srvInput.value.trim() : 'Khám Bác Sĩ';
    const facility = facInput ? facInput.value : 'Bệnh viện Chợ Rẫy (TP.HCM)';
    const date = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];
    const time = timeInput ? timeInput.value : 'Sáng (07:30 - 09:30)';
    const notes = noteInput ? noteInput.value.trim() : '';

    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `#MED2026-${codeNum}`;

    try {
      let leads = JSON.parse(localStorage.getItem('medcare_leads') || '[]');
      const newLead = {
        id: `LD${String(leads.length + 1).padStart(3, '0')}`,
        name: name,
        gender: 'Chưa rõ',
        email: `${phone}@khachhang.medcare.vn`,
        phone: phone,
        service: `${service} — ${facility}`,
        source: 'Website MedCare Portal (Bệnh nhân tự đặt online)',
        priority: 'high',
        status: 'new',
        note: `[${bookingCode}] Hẹn: ${date} (${time}). Cơ sở: ${facility}. Ghi chú: ${notes || 'Không có'}`,
        createdAt: new Date().toLocaleDateString('vi-VN'),
        assignedTo: 'Tổng đài viên CSKH'
      };
      leads.unshift(newLead);
      localStorage.setItem('medcare_leads', JSON.stringify(leads));
    } catch (err) {
      console.error('Save lead error:', err);
    }

    const formBox = document.getElementById('bookingFormContainer');
    const successBox = document.getElementById('bookingSuccessContainer');

    if (formBox && successBox) {
      formBox.style.display = 'none';
      successBox.style.display = 'block';

      const codeEl = document.getElementById('displayBookingCode');
      if (codeEl) codeEl.textContent = bookingCode;
      const patientEl = document.getElementById('displayPatientName');
      if (patientEl) patientEl.textContent = name;
      const facilityEl = document.getElementById('displayFacilityName');
      if (facilityEl) facilityEl.textContent = facility;
      const timeEl = document.getElementById('displayAppointmentTime');
      if (timeEl) timeEl.textContent = `${date} (${time})`;
    } else {
      alert(`🎉 ĐẶT LỊCH THÀNH CÔNG!\n\nMã hồ sơ: ${bookingCode}\nBệnh nhân: ${name}\nDịch vụ: ${service}\nCơ sở: ${facility}\nThời gian: ${date} (${time})\n\nTổng đài MedCare sẽ gọi xác nhận qua số ${phone} trong 15 phút!`);
      window.closeBookingModal();
    }
  };

  // ── 5. ARTICLE READER MODAL (Safe Programmatic Booking Button) ──
  window.openArticleReader = function (articleId) {
    let art = null;
    if (window.MEDCARE_ARTICLES_50) {
      art = window.MEDCARE_ARTICLES_50.find(a => a.id === articleId || a.id === 'art-' + String(articleId).padStart(2, '0'));
    }
    if (!art && window.ARTICLES_FULL_CONTENT) {
      art = window.ARTICLES_FULL_CONTENT[articleId];
    }
    if (!art) {
      console.warn('Article not found for id:', articleId);
      return;
    }

    let modal = document.getElementById('articleReaderModal');
    let body = document.getElementById('articleReaderContent');

    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'articleReaderModal';
      modal.className = 'specialty-modal-overlay';
      modal.innerHTML = `
        <div class="specialty-modal-box" style="max-width:860px;">
          <div class="specialty-modal-header">
            <div style="font-weight:800; font-size:16px; display:flex; align-items:center; gap:8px;">
              <span>📖</span> Chuyên Mục Cẩm Nang Y Khoa MedCare
            </div>
            <button class="booking-modal-close" onclick="window.closeArticleReader()">✕</button>
          </div>
          <div class="specialty-modal-body" id="articleReaderContent" style="padding:28px 30px;"></div>
        </div>
      `;
      document.body.appendChild(modal);
      body = document.getElementById('articleReaderContent');
    }

    if (modal && body) {
      body.innerHTML = `
        <div style="margin-bottom:16px;">
          <span style="display:inline-block; font-size:12px; font-weight:700; color:#0f766e; background:#ccfbf1; padding:4px 12px; border-radius:20px; margin-bottom:10px;">
            ${escapeHtml(art.tag || art.catLabel || 'Y Khoa Thường Thức')}
          </span>
          <h2 style="font-size:24px; font-weight:800; color:#0f172a; line-height:1.4; margin:0 0 12px;">
            ${escapeHtml(art.title)}
          </h2>
          <div style="display:flex; flex-wrap:wrap; align-items:center; gap:16px; font-size:13px; color:#64748b; border-bottom:1px solid #e2e8f0; padding-bottom:14px;">
            <span>👨‍⚕️ <strong>Kiểm duyệt:</strong> ${escapeHtml(art.author)}</span>
            <span>📅 Ngày đăng: ${art.date || '2026-11-20'}</span>
            <span>⏱️ ${art.readTime || '5 phút đọc'}</span>
          </div>
        </div>

        <div style="margin:20px 0; border-radius:14px; overflow:hidden; max-height:360px;">
          <img src="${art.img}" alt="" style="width:100%; height:100%; object-fit:cover; display:block;">
        </div>

        <div style="background:#f8fafc; border-left:4px solid #0284c7; padding:14px 18px; border-radius:0 8px 8px 0; margin-bottom:24px; font-style:italic; font-size:15px; color:#334155; line-height:1.6;">
          "${escapeHtml(art.summary || '')}"
        </div>

        <div style="font-size:15px; color:#1e293b; line-height:1.8;">
          ${art.fullContent || art.content || ''}
        </div>

        <div style="margin-top:30px; padding:20px; background:#f0fdfa; border:1px solid #99f6e4; border-radius:12px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px;">
          <div>
            <div style="font-weight:800; font-size:16px; color:#0f766e; margin-bottom:4px;">Bạn Cần Tư Vấn Chuyên Sâu Về Vấn Đề Này?</div>
            <div style="font-size:13px; color:#475569;">Bác sĩ chuyên khoa tại các bệnh viện tuyến đầu luôn sẵn sàng hỗ trợ bạn.</div>
          </div>
          <div style="display:flex; gap:10px;">
            <button type="button" class="btn btn-outline btn-sm" onclick="window.openHotlineModal()">📞 Gọi Hotline xxxx-xxxx</button>
            <button type="button" class="btn btn-primary btn-sm" id="btnArticleBookNow">
              📅 Đặt Khám Bác Sĩ Ngay
            </button>
          </div>
        </div>
      `;

      // Programmatic click listener - 100% immune to quotes in article titles
      const bookBtn = body.querySelector('#btnArticleBookNow');
      if (bookBtn) {
        bookBtn.onclick = function () {
          window.closeArticleReader();
          window.openBookingModal('Tư vấn & Khám: ' + art.title);
        };
      }

      modal.classList.add('open');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeArticleReader = function () {
    const modal = document.getElementById('articleReaderModal');
    if (modal) {
      modal.classList.remove('open');
      modal.classList.remove('active');
    }
    restoreBodyScroll();
  };

  // Wire existing close button in DOM on load
  document.addEventListener('DOMContentLoaded', function () {
    const btnCloseBooking = document.getElementById('btnCloseBookingModal');
    if (btnCloseBooking) {
      btnCloseBooking.onclick = function () {
        window.closeBookingModal();
      };
    }
  });

})();
