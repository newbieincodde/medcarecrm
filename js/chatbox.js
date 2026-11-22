/**
 * ==============================================================================
 * MEDCARE CRM — Next-Gen AI Medical Assistant (Chatbox Widget v3.0)
 * Features:
 * 1. Quick Action Chips (Bệnh viện, Giá xét nghiệm, Triệu chứng, Gọi lại, Đặt lịch)
 * 2. Interactive Rich Cards (Hospitals & Packages with direct booking triggers)
 * 3. In-Chat Callback Lead Capture Form (saves directly to LocalStorage)
 * 4. Realistic Typing Indicator Animation (Bouncing Dots)
 * 5. Department Clinical Triage (Nội khoa, Ngoại khoa, Nhi, Sản, Da liễu)
 * 6. Sound Toggle & Chat Reset Button
 * 7. Proactive Friendly Greeting Balloon
 * ==============================================================================
 */

(function () {
  let isSoundEnabled = true;
  let isTyping = false;

  function initChatbox() {
    if (document.getElementById('chatboxWidgetMount')) return;

    const mount = document.createElement('div');
    mount.id = 'chatboxWidgetMount';
    mount.innerHTML = `
      <!-- Proactive Floating Greeting Balloon -->
      <div class="chatbox-greeting-balloon" id="chatboxGreetingBalloon" onclick="window.toggleMedCareChatbox()">
        <span class="greeting-avatar">👩‍⚕️</span>
        <div class="greeting-text">
          <strong>Bác sĩ ảo MedCare</strong><br>
          Chào bạn! Cần tư vấn triệu chứng hay đặt lịch khám ở đâu hôm nay?
        </div>
        <button class="greeting-close" onclick="event.stopPropagation(); document.getElementById('chatboxGreetingBalloon').style.display='none';">✕</button>
      </div>

      <!-- Floating Toggle Button -->
      <button class="chatbox-toggle-btn" id="chatboxToggleBtn" title="Trợ lý y tế ảo MedCare" aria-label="Mở chatbox tư vấn">
        <span class="chat-icon-msg">💬</span>
        <span class="chat-icon-close">✕</span>
        <span class="chatbox-badge-unread" id="chatboxUnreadBadge">1</span>
      </button>

      <!-- Chatbox Window Container -->
      <div class="chatbox-window" id="chatboxWindow">
        <!-- Header -->
        <div class="chatbox-header">
          <div class="chatbox-header-info">
            <div class="chatbox-avatar-wrap">
              <span class="chatbox-avatar">🩺</span>
              <span class="chatbox-status-dot online"></span>
            </div>
            <div>
              <div class="chatbox-header-title">Trợ Lý Y Tế AI MedCare</div>
              <div class="chatbox-header-subtitle">Trực tuyến 24/7 · Hỗ trợ toàn quốc</div>
            </div>
          </div>
          <div class="chatbox-header-actions">
            <button class="chatbox-action-icon" id="btnSoundToggle" title="Bật/Tắt âm thanh thông báo">🔔</button>
            <button class="chatbox-action-icon" id="btnClearChat" title="Xóa lịch sử trò chuyện">🗑️</button>
            <button class="chatbox-action-icon" id="chatboxBtnClose" title="Đóng cửa sổ chat">✕</button>
          </div>
        </div>

        <!-- Quick Triage Category Chips Bar -->
        <div class="chatbox-chips-bar" id="chatboxChipsBar">
          <button class="chat-chip" onclick="window.handleChatChip('benhvien')">🏥 Tìm Bệnh Viện</button>
          <button class="chat-chip" onclick="window.handleChatChip('banggia')">📋 Bảng Giá</button>
          <button class="chat-chip" onclick="window.handleChatChip('trieuchung')">🩺 Tư Vấn Triệu Chứng</button>
          <button class="chat-chip" onclick="window.handleChatChip('goilai')">📞 Yêu Cầu Gọi Lại</button>
          <button class="chat-chip" onclick="window.handleChatChip('datkham')">📅 Đặt Lịch Nhanh</button>
        </div>

        <!-- Messages Flow Area -->
        <div class="chatbox-messages" id="chatboxMessages">
          <div class="chat-bubble bot">
            <div style="font-weight:700; color:#0f766e; margin-bottom:4px;">👋 Xin chào Quý khách!</div>
            Tôi là <strong>Trợ lý Y tế Thông Minh MedCare</strong>. Tôi có thể hỗ trợ bạn:<br>
            • Tìm bệnh viện & phòng khám tuyến đầu gần bạn.<br>
            • Tra cứu bảng giá xét nghiệm & gói khám tổng quát.<br>
            • Đặt lịch hẹn ưu tiên không cần xếp hàng lấy số.<br>
            • Kết nối để Bác sĩ gọi điện tư vấn trực tiếp sau 3 phút.
            <div class="chat-bubble-time">Vừa xong</div>
          </div>
        </div>

        <!-- Typing Animation Indicator -->
        <div class="chatbox-typing-indicator" id="chatboxTyping">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span style="font-size:11px; color:#64748b; margin-left:6px;">Bác sĩ ảo đang soạn câu trả lời...</span>
        </div>

        <!-- Input Bar -->
        <form class="chatbox-input-form" id="chatboxInputForm">
          <input 
            type="text" 
            class="chatbox-input" 
            id="chatboxInput" 
            placeholder="Nhập câu hỏi hoặc số điện thoại của bạn..."
            autocomplete="off"
          >
          <button type="submit" class="chatbox-send-btn" id="chatboxSendBtn" title="Gửi tin nhắn">
            ➤
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(mount);

    // Bind event listeners
    const toggleBtn = document.getElementById('chatboxToggleBtn');
    const win = document.getElementById('chatboxWindow');
    const btnClose = document.getElementById('chatboxBtnClose');
    const form = document.getElementById('chatboxInputForm');
    const input = document.getElementById('chatboxInput');
    const btnSound = document.getElementById('btnSoundToggle');
    const btnClear = document.getElementById('btnClearChat');

    window.toggleMedCareChatbox = function () {
      const isOpen = win.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
      const balloon = document.getElementById('chatboxGreetingBalloon');
      if (balloon) balloon.style.display = 'none';
      const badge = document.getElementById('chatboxUnreadBadge');
      if (badge) badge.style.display = 'none';
      if (isOpen && input) input.focus();
    };

    if (toggleBtn) toggleBtn.addEventListener('click', window.toggleMedCareChatbox);
    if (btnClose) btnClose.addEventListener('click', window.toggleMedCareChatbox);

    if (btnSound) {
      btnSound.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        btnSound.textContent = isSoundEnabled ? '🔔' : '🔕';
        btnSound.title = isSoundEnabled ? 'Đang bật âm thanh' : 'Đang tắt âm thanh';
      });
    }

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (confirm('Bạn có muốn xóa toàn bộ lịch sử trò chuyện này không?')) {
          const container = document.getElementById('chatboxMessages');
          if (container) {
            container.innerHTML = `
              <div class="chat-bubble bot">
                Lịch sử trò chuyện đã được làm mới. Bác sĩ sẵn sàng hỗ trợ bạn câu hỏi tiếp theo!
                <div class="chat-bubble-time">${getCurrentTime()}</div>
              </div>
            `;
          }
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text || isTyping) return;

        appendUserMessage(text);
        input.value = '';

        // Check if user input is a phone number (Lead auto-capture)
        const phoneRegex = /(0[3|5|7|8|9][0-9]{8})\b/g;
        const matchPhone = text.match(phoneRegex);

        showTypingIndicator();

        setTimeout(() => {
          hideTypingIndicator();
          if (matchPhone) {
            handleAutoPhoneLead(matchPhone[0], text);
          } else {
            generateSmartBotReply(text);
          }
        }, 650);
      });
    }

    // Show proactive balloon after 4 seconds
    setTimeout(() => {
      const balloon = document.getElementById('chatboxGreetingBalloon');
      if (balloon && !win.classList.contains('open')) {
        balloon.classList.add('show');
      }
    }, 4000);
  }

  function getCurrentTime() {
    return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  function playNotificationSound() {
    if (!isSoundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      // AudioContext not allowed or muted
    }
  }

  function showTypingIndicator() {
    isTyping = true;
    const typing = document.getElementById('chatboxTyping');
    if (typing) {
      typing.style.display = 'flex';
      scrollChatToBottom();
    }
  }

  function hideTypingIndicator() {
    isTyping = false;
    const typing = document.getElementById('chatboxTyping');
    if (typing) typing.style.display = 'none';
  }

  function scrollChatToBottom() {
    const container = document.getElementById('chatboxMessages');
    if (container) container.scrollTop = container.scrollHeight;
  }

  function appendUserMessage(text) {
    const container = document.getElementById('chatboxMessages');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user';
    bubble.innerHTML = `
      ${escapeHtml(text)}
      <div class="chat-bubble-time">${getCurrentTime()}</div>
    `;
    container.appendChild(bubble);
    scrollChatToBottom();
  }

  function appendBotMessage(html) {
    const container = document.getElementById('chatboxMessages');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot';
    bubble.innerHTML = `
      ${html}
      <div class="chat-bubble-time">${getCurrentTime()}</div>
    `;
    container.appendChild(bubble);
    scrollChatToBottom();
    playNotificationSound();
  }

  function handleAutoPhoneLead(phone, fullText) {
    const newLead = {
      id: 'lead_' + Date.now(),
      name: 'Khách hàng để lại SĐT qua Chatbox',
      phone: phone,
      email: '',
      service: 'Tư vấn khám qua Chatbox AI',
      facility: 'Đề xuất cơ sở y tế phù hợp',
      date: new Date().toISOString().split('T')[0],
      notes: 'Nội dung chat: ' + fullText,
      status: 'new',
      created_at: new Date().toISOString()
    };

    try {
      let leads = JSON.parse(localStorage.getItem('medcare_leads') || '[]');
      leads.unshift(newLead);
      localStorage.setItem('medcare_leads', JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }

    appendBotMessage(`
      <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:10px; padding:12px; margin-bottom:8px;">
        <div style="color:#059669; font-weight:800; font-size:14px; margin-bottom:4px;">
          ✅ ĐÃ TIẾP NHẬN SỐ ĐIỆN THOẠI CỦA BẠN!
        </div>
        <div style="font-size:13px; color:#064e3b; line-height:1.5;">
          Hệ thống MedCare đã lưu số <strong>${phone}</strong> vào hàng đợi ưu tiên. Bác sĩ điều dưỡng trực ban sẽ gọi lại cho bạn trong vòng <strong>3 đến 5 phút</strong> để tư vấn trực tiếp!
        </div>
      </div>
      <div>Nếu cần gọi cấp bách ngay bây giờ, bạn có thể bấm: <a href="tel:xxxx-xxxx" style="color:#0f766e; font-weight:800; text-decoration:underline;">xxxx-xxxx</a> (Miễn phí cước).</div>
    `);
  }

  // Quick Action Chips Click Handlers
  window.handleChatChip = function (type) {
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      switch (type) {
        case 'benhvien':
          appendBotMessage(`
            <strong>🏥 Mạng Lưới 40+ Cơ Sở Y Tế Tuyến Đầu MedCare:</strong><br>
            Dưới đây là một số cơ sở đối tác tiêu biểu được đông đảo người bệnh tin chọn:
            <div class="chat-card-wrap">
              <div class="chat-bot-card">
                <div class="chat-card-title">Bệnh viện Chợ Rẫy (TP.HCM)</div>
                <div class="chat-card-desc">Tuyến cuối đa khoa, Ung bướu, Tim mạch, Can thiệp</div>
                <button class="chat-card-action" onclick="window.openBookingModal('Khám đa khoa', 'Bệnh viện Chợ Rẫy (TP.HCM)')">📅 Đặt Khám Chợ Rẫy</button>
              </div>
              <div class="chat-bot-card">
                <div class="chat-card-title">Bệnh viện Bạch Mai (Hà Nội)</div>
                <div class="chat-card-desc">Trung tâm Đột quỵ, Tim mạch, Nội tiết, Hồi sức</div>
                <button class="chat-card-action" onclick="window.openBookingModal('Khám đa khoa', 'Bệnh viện Bạch Mai (Hà Nội)')">📅 Đặt Khám Bạch Mai</button>
              </div>
              <div class="chat-bot-card">
                <div class="chat-card-title">BV Đa Khoa Quốc Tế Vinmec</div>
                <div class="chat-card-desc">Chuẩn JCI Quốc tế, phẫu thuật robot, dịch vụ 5 sao</div>
                <button class="chat-card-action" onclick="window.openBookingModal('Khám tổng quát', 'Bệnh viện Đa khoa Quốc tế Vinmec')">📅 Đặt Khám Vinmec</button>
              </div>
            </div>
            <a href="pages/co-so-y-te.html" style="display:inline-block; margin-top:8px; font-weight:700; color:#0284c7; font-size:13px;">➔ Xem toàn bộ danh bạ 40 bệnh viện toàn quốc</a>
          `);
          break;

        case 'banggia':
          appendBotMessage(`
            <strong>📋 Bảng Giá Dịch Vụ & Gói Khám Niêm Yết:</strong><br>
            • <strong>Khám tổng quát cơ bản:</strong> 540.000 ₫ (gốc 600K)<br>
            • <strong>Khám sức khỏe xin việc/đi làm:</strong> 563.000 ₫ (lấy giấy ngay)<br>
            • <strong>Đo khúc xạ & thị lực mắt:</strong> 150.000 ₫<br>
            • <strong>Khám nâng cao toàn diện:</strong> 1.250.000 ₫<br>
            • <strong>Tầm soát ung thư nữ toàn diện:</strong> 2.140.000 ₫<br>
            • <strong>Tầm soát tim mạch & đột quỵ:</strong> 1.850.000 ₫<br>
            • <strong>Lấy mẫu xét nghiệm tại nhà:</strong> Giá gốc + 10K phí đi lại toàn quốc.
            <div style="margin-top:10px;">
              <button class="btn btn-primary btn-sm" onclick="window.openBookingModal('Gói Khám Sức Khỏe')">📅 Đặt Khám Với Giá Ưu Đãi</button>
              <a href="pages/goi-kham.html" style="margin-left:8px; font-size:12.5px; color:#0f766e; font-weight:700;">Xem chi tiết gói »</a>
            </div>
          `);
          break;

        case 'trieuchung':
          appendBotMessage(`
            <strong>🩺 Tư Vấn Định Hướng Chuyên Khoa:</strong><br>
            Bạn đang có triệu chứng khó chịu ở cơ quan nào? Hãy chọn nhóm chuyên khoa để bác sĩ hướng dẫn:
            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;">
              <button class="chat-chip" onclick="window.handleChatChip('sym_tim')">❤️ Tức ngực, hồi hộp</button>
              <button class="chat-chip" onclick="window.handleChatChip('sym_da')">🩺 Đau dạ dày, ợ chua</button>
              <button class="chat-chip" onclick="window.handleChatChip('sym_khop')">🦴 Đau lưng, khớp gối</button>
              <button class="chat-chip" onclick="window.handleChatChip('sym_dau')">🧠 Đau đầu, chóng mặt</button>
              <button class="chat-chip" onclick="window.handleChatChip('sym_phukhoa')">🌸 Khám phụ khoa</button>
            </div>
          `);
          break;

        case 'sym_tim':
          appendBotMessage(`
            ⚠️ <strong>Triệu chứng tức ngực & hồi hộp:</strong><br>
            Nếu bạn cảm thấy đè nặng sau xương ức lan lên vai trái, vã mồ hôi hoặc khó thở gắng sức, cần thăm khám <strong>Nội Tim Mạch</strong> ngay để đo điện tim ECG và siêu âm tim Doppler.<br>
            <div style="margin-top:8px;">
              <button class="btn btn-primary btn-sm" onclick="window.openBookingModal('Khám Chuyên Khoa Nội Tim Mạch')">📅 Đặt Khám Bác Sĩ Tim Mạch</button>
            </div>
          `);
          break;

        case 'sym_da':
          appendBotMessage(`
            ⚠️ <strong>Triệu chứng đau dạ dày, ợ chua, buồn nôn:</strong><br>
            Cảnh báo trào ngược GERD hoặc viêm loét dạ dày HP. Khuyến nghị nội soi tiêu hóa tiền mê không đau và làm xét nghiệm thở C13.<br>
            <div style="margin-top:8px;">
              <button class="btn btn-primary btn-sm" onclick="window.openBookingModal('Khám Chuyên Khoa Tiêu Hóa')">📅 Đặt Nội Soi Tiêu Hóa Không Đau</button>
            </div>
          `);
          break;

        case 'sym_khop':
          appendBotMessage(`
            ⚠️ <strong>Triệu chứng đau lưng, cứng khớp gối buổi sáng:</strong><br>
            Cần chụp X-quang hoặc MRI cột sống thắt lưng để loại trừ thoái hóa đĩa đệm và thoái hóa sụn khớp.<br>
            <div style="margin-top:8px;">
              <button class="btn btn-primary btn-sm" onclick="window.openBookingModal('Khám Chuyên Khoa Cơ Xương Khớp')">📅 Đặt Khám Bác Sĩ Cơ Xương Khớp</button>
            </div>
          `);
          break;

        case 'sym_dau':
          appendBotMessage(`
            ⚠️ <strong>Triệu chứng đau đầu, nhà cửa quay cuồng:</strong><br>
            Cảnh báo rối loạn tiền đình, đau nửa đầu Migraine hoặc thiểu năng tuần hoàn não. Cần khám <strong>Nội Thần Kinh</strong> sớm.<br>
            <div style="margin-top:8px;">
              <button class="btn btn-primary btn-sm" onclick="window.openBookingModal('Khám Chuyên Khoa Nội Thần Kinh')">📅 Đặt Khám Bác Sĩ Thần Kinh</button>
            </div>
          `);
          break;

        case 'sym_phukhoa':
          appendBotMessage(`
            🌸 <strong>Chăm sóc Sức khỏe Phụ khoa:</strong><br>
            Khuyến cáo chị em phụ nữ làm xét nghiệm tế bào cổ tử cung Thinprep Pap kết hợp HPV DNA và siêu âm đầu dò phụ khoa định kỳ 1 năm/lần.<br>
            <div style="margin-top:8px;">
              <button class="btn btn-primary btn-sm" onclick="window.openBookingModal('Khám Chuyên Khoa Sản Phụ Khoa')">📅 Đặt Khám Sản Phụ Khoa</button>
            </div>
          `);
          break;

        case 'goilai':
          appendBotMessage(`
            <strong>📞 Yêu Cầu Bác Sĩ Gọi Lại Tư Vấn Trực Tiếp:</strong><br>
            Vui lòng nhập số điện thoại của bạn vào ô chat bên dưới, hoặc điền nhanh thông tin:
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:12px; margin-top:8px;">
              <input type="tel" id="chatInlinePhone" placeholder="Nhập số điện thoại của bạn..." style="width:100%; padding:8px 12px; border:1px solid #94a3b8; border-radius:6px; font-size:13.5px; margin-bottom:8px;">
              <button class="btn btn-primary btn-sm" style="width:100%;" onclick="window.submitInlineChatPhone()">Gửi Số Điện Thoại Ngay</button>
            </div>
          `);
          break;

        case 'datkham':
          window.openBookingModal('Tư vấn đặt hẹn khám nhanh');
          appendBotMessage(`
            Đã mở cửa sổ <strong>Đặt Lịch Khám Toàn Quốc</strong> cho bạn! Hãy chọn bệnh viện mong muốn và ngày khám để hệ thống tiếp nhận ngay nhé.
          `);
          break;
      }
    }, 450);
  };

  window.submitInlineChatPhone = function () {
    const input = document.getElementById('chatInlinePhone');
    if (!input) return;
    const phone = input.value.trim();
    if (!phone || phone.length < 10) {
      alert('Vui lòng nhập số điện thoại hợp lệ gồm 10 chữ số!');
      return;
    }
    handleAutoPhoneLead(phone, 'Yêu cầu gọi lại từ form chat nhanh');
  };

  function generateSmartBotReply(text) {
    const lower = text.toLowerCase();

    if (lower.includes('đặt') || lower.includes('lịch') || lower.includes('khám') || lower.includes('hẹn')) {
      appendBotMessage(`
        Dạ, bạn có thể đặt lịch khám nhanh chóng bằng các cách sau:<br>
        1. Bấm nút <strong>"Đặt Lịch Nhanh"</strong> bên dưới để chọn bệnh viện và ngày khám.<br>
        2. Nhập trực tiếp <strong>Số điện thoại</strong> của bạn vào đây, bác sĩ sẽ gọi lại sau 3 phút.<br>
        3. Gọi tổng đài miễn phí: <strong>xxxx-xxxx</strong> (trực 24/7).<br>
        <button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="window.openBookingModal('Đặt khám theo yêu cầu')">📅 Mở Form Đặt Lịch Hẹn</button>
      `);
    } else if (lower.includes('giá') || lower.includes('tiền') || lower.includes('chi phí') || lower.includes('bao nhiêu')) {
      appendBotMessage(`
        MedCare cam kết <strong>minh bạch 100% chi phí</strong>, đúng theo giá niêm yết của từng bệnh viện:<br>
        • Khám Bác sĩ chuyên khoa: 150.000 – 450.000 ₫<br>
        • Khám tổng quát cơ bản 18 chỉ số: 540.000 ₫<br>
        • Lấy máu xét nghiệm tại nhà: Giá gốc + 10.000 ₫ phí đi lại<br>
        • Trợ lý y tế đi cùng hỗ trợ: 350.000 ₫/buổi<br>
        <a href="pages/goi-kham.html" style="color:#0f766e; font-weight:700; text-decoration:underline;">Xem bảng so sánh xét nghiệm chi tiết »</a>
      `);
    } else if (lower.includes('xét nghiệm') || lower.includes('máu') || lower.includes('tại nhà')) {
      appendBotMessage(`
        🔬 <strong>Dịch Vụ Lấy Mẫu Xét Nghiệm Máu Tại Nhà Toàn Quốc:</strong><br>
        • Điều dưỡng mang hộp bảo quản lạnh chuyên dụng đến tận nhà bạn.<br>
        • Kết quả xét nghiệm trả trực tuyến sau 2 - 4 giờ qua SMS / mã QR bảo mật.<br>
        • Bác sĩ chuyên khoa gọi điện giải thích từng chỉ số men gan, mỡ máu, đường huyết.<br>
        <button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="window.openBookingModal('Xét nghiệm máu tại nhà toàn quốc')">🩸 Đăng Ký Lấy Mẫu Tại Nhà</button>
      `);
    } else if (lower.includes('bác sĩ') || lower.includes('bệnh viện') || lower.includes('chợ rẫy') || lower.includes('bạch mai') || lower.includes('vinmec')) {
      appendBotMessage(`
        MedCare liên kết trực tiếp với hơn <strong>40 Bệnh viện tuyến Trung ương</strong> tại Hà Nội, Đà Nẵng, TP.HCM, Bình Dương, Đồng Nai, Cần Thơ.<br>
        Bệnh nhân đặt khám qua MedCare sẽ được:<br>
        ✓ Cấp mã số ưu tiên, không cần bốc số chờ đợi.<br>
        ✓ Chọn đúng Bác sĩ Trưởng/Phó khoa mong muốn.<br>
        ✓ Hỗ trợ thủ tục Bảo hiểm y tế (BHYT) thông tuyến.<br>
        <a href="pages/co-so-y-te.html" style="color:#0284c7; font-weight:700;">➔ Xem danh bạ 40 bệnh viện</a>
      `);
    } else {
      appendBotMessage(`
        Cảm ơn bạn đã nhắn tin cho Trợ lý MedCare! Bạn có thể cho tôi biết rõ hơn về <strong>triệu chứng cơ thể</strong> hoặc <strong>bệnh viện bạn muốn đến khám</strong> không ạ?<br>
        Hoặc bạn hãy <strong>nhập số điện thoại</strong> của bạn, bác sĩ điều dưỡng của chúng tôi sẽ gọi lại tư vấn miễn phí ngay!
      `);
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Self initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbox);
  } else {
    initChatbox();
  }
})();
