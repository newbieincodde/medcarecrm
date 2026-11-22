/**
 * ==============================================================================
 * MEDCARE CRM — Reports & CLV Analytics Logic
 * ==============================================================================
 */

let allPatients = [];
let allLeads = [];

function initReportsPage() {
  allPatients = typeof getPatients === 'function' ? getPatients() : [];
  allLeads    = typeof getLeads === 'function' ? getLeads() : [];

  calculateCLV();
  renderTopPatients();
  renderSpecialtyChart();
  renderSourceChart();
}

function calculateCLV() {
  if (allPatients.length === 0) return;

  const totalRevenue = allPatients.reduce((sum, p) => sum + (p.totalSpent || 0), 0);
  const totalVisits  = allPatients.reduce((sum, p) => sum + (p.visits || 3), 0);

  const aov = Math.round(totalRevenue / totalVisits);
  const f   = parseFloat((totalVisits / allPatients.length).toFixed(1));
  const l   = 3.0; // Vòng đời trung bình 3 năm
  const clv = Math.round(aov * f * l);

  const elAOV = document.getElementById('valAOV');
  if (elAOV) elAOV.textContent = (aov).toLocaleString('vi-VN') + ' ₫';

  const elF = document.getElementById('valF');
  if (elF) elF.textContent = `${f} lần / năm`;

  const elCLV = document.getElementById('clvAverageVal');
  if (elCLV) elCLV.textContent = (clv).toLocaleString('vi-VN') + ' ₫';
}

function renderTopPatients() {
  const tbody = document.getElementById('topPatientsTableBody');
  if (!tbody) return;

  // Sort descending by totalSpent
  const sorted = [...allPatients].sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
  const top5 = sorted.slice(0, 5);

  const medals = ['🥇 Top 1', '🥈 Top 2', '🥉 Top 3', '⭐ Top 4', '⭐ Top 5'];

  tbody.innerHTML = top5.map((p, idx) => {
    const formattedSpent = (p.totalSpent || 0).toLocaleString('vi-VN') + ' ₫';
    const rankInfo = typeof classifyPatient === 'function' ? classifyPatient(p.totalSpent) : { rank: 'gold', label: 'Vàng', icon: '🥇' };

    return `
      <tr>
        <td><strong style="color:#d97706;">${medals[idx]}</strong></td>
        <td><strong>${p.id}</strong></td>
        <td class="td-name">
          <a href="customers.html?search=${p.id}" style="color:var(--clr-primary-700,#0f766e); text-decoration:none;">
            ${p.name}
          </a>
        </td>
        <td>${p.phone}</td>
        <td><span style="font-size:12.5px; color:#475569;">${p.service}</span></td>
        <td style="font-weight:600; text-align:center;">${p.visits || 5} lần</td>
        <td style="font-weight:800; color:#0f172a;">${formattedSpent}</td>
        <td>
          <span class="badge-rank ${rankInfo.rank}">
            ${rankInfo.icon} ${rankInfo.label}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

function renderSpecialtyChart() {
  const ctx = document.getElementById('specialtyChart');
  if (!ctx || typeof Chart === 'undefined') return;

  // Group revenue by service
  const serviceRevenue = {};
  allPatients.forEach(p => {
    const s = p.service || 'Khám Tổng Quát';
    serviceRevenue[s] = (serviceRevenue[s] || 0) + (p.totalSpent || 0);
  });

  const labels = Object.keys(serviceRevenue).slice(0, 6);
  const data = labels.map(l => Math.round(serviceRevenue[l] / 1000000)); // Triệu ₫

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Doanh thu (Triệu VNĐ)',
        data: data,
        backgroundColor: [
          '#0f766e', '#14b8a6', '#2dd4bf', '#0d9488', '#047857', '#10b981'
        ],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw} Triệu VNĐ`
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
          ticks: {
            font: { family: 'Plus Jakarta Sans', size: 10 },
            callback: function(val) {
              const text = this.getLabelForValue(val);
              return text.length > 16 ? text.substring(0, 16) + '…' : text;
            }
          }
        }
      }
    }
  });
}

function renderSourceChart() {
  const ctx = document.getElementById('sourceChart');
  if (!ctx || typeof Chart === 'undefined') return;

  // Group by source from patients and leads
  const sourceCount = {};
  allPatients.forEach(p => {
    const src = p.source || 'Website';
    sourceCount[src] = (sourceCount[src] || 0) + 1;
  });
  allLeads.forEach(l => {
    const src = l.source || 'Website';
    sourceCount[src] = (sourceCount[src] || 0) + 1;
  });

  const labels = Object.keys(sourceCount);
  const data = labels.map(l => sourceCount[l]);

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#0f766e', '#14b8a6', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: { family: 'Plus Jakarta Sans', size: 11.5 },
            boxWidth: 12,
            padding: 10
          }
        }
      }
    }
  });
}
