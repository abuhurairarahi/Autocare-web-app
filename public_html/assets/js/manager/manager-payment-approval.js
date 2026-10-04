/**
 * manager-payment-approval.js
 * Logic for Spare Parts Approval:
 * Stock stats & low stock alerts, individual part approval/rejection with inventory deduction,
 * batch "Approve All", and filter modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  renderApprovalStats();
  renderApprovalTable();
  initApprovalButtons();
});

/**
 * 1. Render Stats Cards
 */
function renderApprovalStats() {
  if (typeof AutoCareStore === 'undefined') return;

  const spareParts = AutoCareStore.getSpareParts();
  const requests = AutoCareStore.getJobCardParts();

  const totalInStock = spareParts.reduce((sum, p) => sum + (p.quantity_in_stock || 0), 0);
  const lowStockCount = spareParts.filter(p => p.quantity_in_stock <= p.low_stock_threshold).length;

  const pendingRequests = requests.filter(r => r.status === 'Pending Approval');
  const todayValue = pendingRequests.reduce((sum, r) => sum + (r.total_price || 0), 0);

  const statCards = document.querySelectorAll('.stats-grid .stat-card');
  if (statCards.length >= 3) {
    // Card 1: Total Available Parts
    statCards[0].querySelector('.stat-value').innerText = totalInStock.toLocaleString();

    // Card 2: Low Stock Alerts
    statCards[1].querySelector('.stat-value').innerText = lowStockCount;

    // Card 3: Today's Requests
    statCards[2].querySelector('.stat-value').innerText = pendingRequests.length;
    const sub = statCards[2].querySelector('.stat-value-sub');
    if (sub) sub.innerText = `Value: ৳${todayValue.toLocaleString()}`;
  }
}

/**
 * 2. Render Approval Table
 */
function renderApprovalTable() {
  const tbody = document.querySelector('.table-card table tbody');
  const footerText = document.querySelector('.table-footer .showing-text');
  if (!tbody || typeof AutoCareStore === 'undefined') return;

  const pending = AutoCareStore.getJobCardParts().filter(r => r.status === 'Pending Approval');

  if (footerText) {
    footerText.innerText = `Showing 1-${pending.length} of ${pending.length} requests`;
  }

  if (pending.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 35px; color: #94a3b8; font-size: 14px;">🎉 All spare parts requests have been reviewed!</td></tr>`;
    return;
  }

  let html = '';
  pending.forEach(req => {
    html += `
      <tr data-part-req-id="${req.id}">
        <td>
          <div class="part-cell">
            <div class="part-icon">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </div>
            <div>
              <div class="part-name">${req.part_name}</div>
              <div class="part-pn">${req.part_number}</div>
            </div>
          </div>
        </td>
        <td><span class="qty-badge">${req.quantity} ${req.unit || 'Units'}</span></td>
        <td class="dim-text">৳${req.unit_price.toFixed(2)}</td>
        <td class="bold">৳${req.total_price.toFixed(2)}</td>
        <td>
          <div class="mechanic-cell">
            <div class="avatar-sm navy">${req.mechanic_initials || 'ME'}</div>
            <div>
              <div class="mechanic-name">${req.mechanic_name}</div>
              <div class="job-id" onclick="window.location.href='manager-jobCards.html';" style="cursor: pointer; text-decoration: underline;" title="View Job Card">Job: ${req.work_order}</div>
            </div>
          </div>
        </td>
        <td class="actions-td">
          <button class="btn-action approve" onclick="handleApprovePart(${req.id})">✓ Approve</button>
          <button class="btn-action reject" onclick="handleRejectPart(${req.id})">✕ Reject</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

/**
 * 3. Individual Approve / Reject Handlers
 */
window.handleApprovePart = function (reqId) {
  const req = AutoCareStore.getJobCardPartById(reqId);
  if (!req) return;

  AutoCareStore.approvePartRequest(reqId);
  showToast(`Approved ${req.part_name} for ${req.work_order}! Stock updated.`, 'success');
  renderApprovalStats();
  renderApprovalTable();
};

window.handleRejectPart = function (reqId) {
  const req = AutoCareStore.getJobCardPartById(reqId);
  if (!req) return;

  openModal({
    title: `Reject Request: ${req.part_name}`,
    content: `
      <p>Are you sure you want to decline this mechanic request?</p>
      <div>
        <label style="display: block; font-weight: 600; font-size: 13px; margin-bottom: 5px;">Reason</label>
        <select id="modal-reject-part-reason" style="width: 100%; padding: 9px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 13px;">
          <option>Part currently out of stock</option>
          <option>Alternative aftermarket part required</option>
          <option>Repair estimate limit exceeded</option>
        </select>
      </div>
    `,
    confirmText: 'Confirm Reject',
    onConfirm: () => {
      AutoCareStore.rejectPartRequest(reqId);
      showToast(`Rejected request for ${req.part_name}`, 'info');
      renderApprovalStats();
      renderApprovalTable();
    }
  });
};

/**
 * 4. "Approve All" and Filter Buttons
 */
function initApprovalButtons() {
  const approveAllBtn = document.querySelector('.header-actions .btn-approve-all');
  const filterBtn = document.querySelector('.header-actions .btn-secondary');

  if (approveAllBtn) {
    approveAllBtn.addEventListener('click', () => {
      const count = AutoCareStore.approveAllPartRequests();
      if (count > 0) {
        showToast(`All ${count} spare parts requests approved and inventory deducted!`, 'success');
      } else {
        showToast('No pending requests to approve.', 'info');
      }
      renderApprovalStats();
      renderApprovalTable();
    });
  }

  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      openModal({
        title: 'Filter Parts Requests',
        content: `
          <div>
            <label style="display: block; font-weight: 600; font-size: 13px; margin-bottom: 6px;">Filter by Status</label>
            <select id="modal-part-filter" style="width: 100%; padding: 9px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 13px;">
              <option value="pending">Pending Approval Only</option>
              <option value="all">Show All (Including Approved & Rejected)</option>
            </select>
          </div>
        `,
        confirmText: 'Apply',
        onConfirm: () => {
          showToast('Filter applied', 'info');
        }
      });
    });
  }
}
