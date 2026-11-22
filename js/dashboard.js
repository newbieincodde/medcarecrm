/**
 * ==============================================================================
 * MEDCARE CRM — Dashboard Overview Logic
 * ==============================================================================
 */

function initDashboard() {
  const patients = typeof getPatients === 'function' ? getPatients() : [];
  const leads    = typeof getLeads === 'function' ? getLeads() : [];
  const surveys  = typeof getSurveys === 'function' ? getSurveys() : [];

  // 1. Calculate & Render KPIs
  const totalPatients = patients.length;
  const totalRevenue  = patients.reduce((sum, p) => sum + (p.totalSpent || 0), 0);
  const rankStats     = typeof getRankStats === 'function' ? getRankStats(patients) : { gold:0, silver:0, bronze:0 };
  const followUps     = typeof getTodayFollowUps === 'function' ? getTodayFollowUps(patients) : [];
  const newLeads      = leads.filter(l => l.status === 'new').length;

  const elTotalPatients = document.getElementById('kpiTotalPatients');
  if (elTotalPatients) elTotalPatients.textContent = totalPatients;

  const elGoldCount = document.getElementById('kpiGoldCount');
  if (elGoldCount) elGoldCount.textContent = rankStats.gold;

  const elTotalRevenue = document.getElementById('kpiTotalRevenue');
  if (elTotalRevenue) {
    elTotalRevenue.textContent = (totalRevenue / 1000000).toFixed(1) + ' Triệu ₫';
  }

  const elTotalLeads = document.getElementById('kpiTotalLeads');
  if (elTotalLeads) elTotalLeads.textContent = leads.length;

  const elLeadSub = document.getElementById('kpiLeadSub');
  if (elLeadSub) elLeadSub.textContent = `${newLeads} leads mới cần gọi`;

  const elFollowUps = document.getElementById('kpiFollowUps');
  if (elFollowUps) elFollowUps.textContent = followUps.length;

  const elOverdueText = document.getElementById('kpiOverdueText');
  if (elOverdueText && followUps.length > 0) {
    const overdueCount = followUps.filter(p => p.overdueDays > 0).length;
    elOverdueText.textContent = overdueCount > 0 ? `${overdueCount} ca quá hạn cần xử lý gấp!` : 'Đúng hạn hôm nay';
  }

  // 2. Render Follow-up Table
  renderFollowUpTable(followUps.slice(0, 7));

  // 3. Render Charts
  renderRevenueChart();
  renderRankChart(rankStats);
}

function renderFollowUpTable(list) {
  const tbody = document.getElementById('followUpTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:32px; color:#64748b;">
          🎉 Tuyệt vời! Hiện không có ca tái khám nào bị trễ hạn hôm nay.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(p => {
    const isOverdue = p.overdueDays > 0;
    const statusBadge = isOverdue
      ? `<span class="badge-status" style="background:#fee2e2; color:#dc2626;">Quá hạn ${p.overdueDays} ngày</span>`
      : `<span class="badge-status" style="background:#fef3c7; color:#d97706;">Hẹn hôm nay (${p.nextFollowUp})</span>`;

    const rankInfo = typeof classifyPatient === 'function' ? classifyPatient(p.totalSpent) : { rank: p.rank, label: p.rank, icon: '⭐' };

    return `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td class="td-name">
          <a href="customers.html?search=${p.id}" style="color:var(--clr-primary-700,#0f766e); font-weight:700; text-decoration:none;" title="Xem hồ sơ bệnh nhân">
            ${p.name} 📋
          </a>
        </td>
        <td>${p.phone}</td>
        <td><span style="font-size:12.5px; color:#475569;">${p.service}</span></td>
        <td>
          <span class="badge-rank ${rankInfo.rank}">
            ${rankInfo.icon} ${rankInfo.label}
          </span>
        </td>
        <td>${statusBadge}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <a href="customer-care.html?patientId=${p.id}" class="btn btn-outline btn-sm" title="Ghi nhận nhật ký chăm sóc">
              💬 Chăm sóc
            </a>
            <button class="btn btn-sm" style="background:#f1f5f9; color:#0f172a;" onclick="quickCall('${p.name}', '${p.phone}', '${p.id}')" title="Gọi tổng đài VOIP">
              📞
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function quickCall(name, phone, patientId = '') {
  if (typeof startVoipCall === 'function') {
    startVoipCall(name, phone, patientId);
  } else if (typeof showToast === 'function') {
    showToast('Cuộc gọi mô phỏng', `Đang kết nối tổng đài tới bệnh nhân: ${name} (${phone})...`, 'info');
  } else {
    alert(`Đang kết nối tổng đài tới bệnh nhân: ${name} (${phone})`);
  }
}

// ── Chart.js Renderers ──
function renderRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx || typeof Chart === 'undefined') return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11'],
      datasets: [
        {
          label: 'Doanh thu thực tế (Triệu ₫)',
          data: [142, 168, 185, 210, 245, 280],
          backgroundColor: '#0f766e',
          borderRadius: 8,
          hoverBackgroundColor: '#14b8a6'
        },
        {
          label: 'Mục tiêu trung tâm (Triệu ₫)',
          data: [150, 160, 180, 200, 220, 250],
          type: 'line',
          borderColor: '#f59e0b',
          borderWidth: 2,
          pointBackgroundColor: '#f59e0b',
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { family: 'Plus Jakarta Sans', size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw} Triệu VNĐ`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } }
        }
      }
    }
  });
}

function renderRankChart(rankStats) {
  const ctx = document.getElementById('rankChart');
  if (!ctx || typeof Chart === 'undefined') return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Hạng Vàng', 'Hạng Bạc', 'Hạng Đồng'],
      datasets: [{
        data: [rankStats.gold || 12, rankStats.silver || 22, rankStats.bronze || 16],
        backgroundColor: ['#D97706', '#64748B', '#B77945'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: 'Plus Jakarta Sans', size: 12 },
            boxWidth: 12,
            padding: 12
          }
        }
      }
    }
  });
}
