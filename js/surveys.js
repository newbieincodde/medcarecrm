/**
 * ==============================================================================
 * MEDCARE CRM — Surveys & CSAT Logic
 * Course Requirement #2: CSS3 Transitions Handler
 * ==============================================================================
 */

let allSurveys = [];
let allPatients = [];

function initSurveysPage() {
  allSurveys = typeof getSurveys === 'function' ? getSurveys() : [];
  allPatients = typeof getPatients === 'function' ? getPatients() : [];

  renderSurveysList();
  calculateAndRenderCSAT();
  triggerProgressBarAnimation();
  setupSurveyModal();
}

function calculateAndRenderCSAT() {
  if (allSurveys.length === 0) return;

  const totalScore = allSurveys.reduce((sum, s) => sum + (s.overallRating || 4.5), 0);
  const avg = (totalScore / allSurveys.length).toFixed(1);

  const elAvg = document.getElementById('csatAverageScore');
  if (elAvg) elAvg.textContent = `${avg} / 5.0 ⭐`;
}

/**
 * Hiệu ứng CSS3 Transition #3:
 * Kích hoạt thanh đo tiến trình tự động tăng dần từ 0% tới % thực tế
 */
function triggerProgressBarAnimation() {
  setTimeout(() => {
    const bars = document.querySelectorAll('.progress-fill');
    bars.forEach(bar => {
      const target = bar.getAttribute('data-percent') || '90%';
      bar.style.width = target;
    });
  }, 150); // slight delay so transition is clearly visible on load
}

function renderSurveysList() {
  const container = document.getElementById('surveyListWrap');
  if (!container) return;

  if (allSurveys.length === 0) {
    container.innerHTML = `<div class="empty-state">Chưa có đánh giá nào.</div>`;
    return;
  }

  container.innerHTML = allSurveys.map((s, idx) => {
    // Find patient name if possible
    const patient = allPatients.find(p => p.id === s.patientId);
    const patientName = patient ? patient.name : `Bệnh nhân (${s.patientId})`;

    const stars = renderStarIcons(s.overallRating || 5);

    return `
      <div class="survey-row-item ${idx === 0 ? 'open' : ''}" onclick="toggleSurveyDetail(this)">
        <div class="survey-row-header">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:36px; height:36px; border-radius:50%; background:#ccfbf1; color:#0f766e; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px;">
              ${s.patientId.replace('KH', '')}
            </div>
            <div>
              <div style="font-weight:700; color:#0f172a; font-size:14px;">
                ${patientName}
                <span style="font-weight:400; color:#64748b; font-size:12px; margin-left:6px;">(${s.patientId})</span>
              </div>
              <div style="font-size:12px; color:#0f766e; font-weight:500;">
                Dịch vụ: ${s.service || 'Khám Tổng Quát'}
              </div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:18px;">
            <div style="text-align:right;">
              <div style="color:#f59e0b; font-size:15px; letter-spacing:1px;">${stars}</div>
              <div style="font-size:11px; color:#94a3b8; margin-top:2px;">Ngày: ${s.date || 'Hôm nay'}</div>
            </div>
            <span class="badge-status" style="background:#e6fffa; color:#0d9488; font-weight:700;">
              ${s.overallRating ? s.overallRating.toFixed(1) : '5.0'} ⭐
            </span>
            <span style="color:#94a3b8; font-size:12px;" class="toggle-indicator">▼</span>
          </div>
        </div>

        <!-- ★ HIỆU ỨNG 2: MỞ RỘNG GÓP Ý VỚI CSS TRANSITION -->
        <div class="survey-row-content">
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-bottom:12px; background:#fff; padding:12px; border-radius:8px; border:1px solid #e2e8f0;">
            <div>
              <span style="font-size:11px; color:#64748b;">Chất lượng dịch vụ:</span>
              <div style="font-weight:700; color:#0f172a;">${s.serviceRating || s.overallRating} / 5.0 ⭐</div>
            </div>
            <div>
              <span style="font-size:11px; color:#64748b;">Thái độ nhân viên:</span>
              <div style="font-weight:700; color:#0f172a;">${s.staffRating || 5.0} / 5.0 ⭐</div>
            </div>
            <div>
              <span style="font-size:11px; color:#64748b;">Thời gian chờ:</span>
              <div style="font-weight:700; color:#0f172a;">${s.waitRating || 4.5} / 5.0 ⭐</div>
            </div>
          </div>

          <div style="background:#fff; border-left:3px solid var(--clr-primary-500,#14b8a6); padding:10px 14px; border-radius:0 8px 8px 0; font-size:13.5px; color:#334155;">
            <strong>💬 Nhận xét chi tiết:</strong> "${s.comment || 'Dịch vụ rất tốt và tận tình.'}"
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderStarIcons(rating) {
  const rounded = Math.round(rating);
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rounded ? '★' : '☆';
  }
  return stars;
}

/**
 * Hiệu ứng CSS3 Transition #2: Toggle mở rộng / thu hẹp
 */
function toggleSurveyDetail(rowEl) {
  rowEl.classList.toggle('open');
  const ind = rowEl.querySelector('.toggle-indicator');
  if (ind) {
    ind.textContent = rowEl.classList.contains('open') ? '▲' : '▼';
  }
}

// ── Survey Modal ──
function setupSurveyModal() {
  const btnOpen = document.getElementById('btnOpenSurveyModal');
  const btnClose = document.getElementById('btnCloseSurveyModal');
  const btnCancel = document.getElementById('btnCancelSurvey');
  const modal = document.getElementById('surveyModal');
  const form = document.getElementById('newSurveyForm');

  const pSelect = document.getElementById('surveyPatientSelect');
  const sSelect = document.getElementById('surveyServiceSelect');

  // Populate patients
  if (pSelect) {
    pSelect.innerHTML = allPatients.slice(0, 30).map(p => `
      <option value="${p.id}">${p.id} — ${p.name} (${p.service})</option>
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
      const service   = sSelect.value;
      const sRating   = parseFloat(document.getElementById('surveyRatingService').value);
      const stRating  = parseFloat(document.getElementById('surveyRatingStaff').value);
      const comment   = document.getElementById('surveyComment').value.trim();

      const newSurvey = {
        id: `SV${String(allSurveys.length + 1).padStart(3, '0')}`,
        patientId,
        service,
        serviceRating: sRating,
        staffRating: stRating,
        waitRating: 4.5,
        overallRating: parseFloat(((sRating + stRating) / 2).toFixed(1)),
        comment,
        date: new Date().toLocaleDateString('vi-VN')
      };

      allSurveys.unshift(newSurvey);
      if (typeof saveSurveys === 'function') saveSurveys(allSurveys);

      if (typeof showToast === 'function') {
        showToast('Đã lưu đánh giá', `Cảm ơn đã ghi nhận khảo sát từ bệnh nhân ${patientId}!`, 'success');
      }

      modal.classList.remove('open');
      renderSurveysList();
      calculateAndRenderCSAT();
    });
  }
}

// Global exposes
window.toggleSurveyDetail = toggleSurveyDetail;
