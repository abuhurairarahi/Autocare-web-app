/**
 * AutoCare Admin Panel Interactions
 * Handles dynamic UI behaviors across all Admin pages.
 */

document.addEventListener("DOMContentLoaded", () => {
  initSearchFiltering();
  initStatusFiltering();
  initExportToCSV();
  initPaginationMock();
  initTopBarInteractions();
  initActionButtons();
});

/**
 * 1. Global & Table Search Filtering
 */
function initSearchFiltering() {
  const globalSearch = document.querySelector(".search input");
  if (globalSearch) {
    globalSearch.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      // Simple mock for global search
      if (term.length > 2) {
        console.log(`Searching system for: ${term}`);
      }
    });
  }

  const tableSearch = document.querySelector(".filter-input input");
  const tableRows = document.querySelectorAll("tbody tr");

  if (tableSearch && tableRows.length > 0) {
    tableSearch.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      tableRows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(term) ? "" : "none";
      });
    });
  }
}

/**
 * 2. Table Status Filtering
 */
function initStatusFiltering() {
  const statusFilter = document.querySelector("select[name='filter-status']");
  const tableRows = document.querySelectorAll("tbody tr");

  if (statusFilter && tableRows.length > 0) {
    statusFilter.addEventListener("change", (e) => {
      const filterValue = e.target.value.toLowerCase();
      const searchInput = document.querySelector(".filter-input input");
      const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

      tableRows.forEach(row => {
        const statusElement = row.querySelector(".status-pill");
        if (!statusElement) return;

        const rowStatus = statusElement.innerText.toLowerCase().trim();
        const rowText = row.innerText.toLowerCase();

        const matchesStatus = filterValue === "all" || rowStatus.includes(filterValue);
        const matchesSearch = rowText.includes(searchTerm);

        row.style.display = (matchesStatus && matchesSearch) ? "" : "none";
      });
    });
  }
}

/**
 * 3. Export Table to CSV
 */
function initExportToCSV() {
  const exportBtn = document.querySelector(".toolbar-export");
  if (!exportBtn) return;

  exportBtn.addEventListener("click", () => {
    const table = document.querySelector("table");
    if (!table) return alert("No table found to export.");

    let csv = [];
    const rows = table.querySelectorAll("tr");

    for (let i = 0; i < rows.length; i++) {
      let row = [], cols = rows[i].querySelectorAll("td, th");
      for (let j = 0; j < cols.length; j++) {
        let text = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, " ").trim();
        row.push(`"${text}"`);
      }
      csv.push(row.join(","));
    }

    const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.download = `Export_${new Date().getTime()}.csv`;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    showToast("Export successful!");
  });
}

/**
 * 4. Pagination Mocking
 */
function initPaginationMock() {
  const pageBtns = document.querySelectorAll(".pagination .page-btn");
  pageBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      if (this.innerText === "‹" || this.innerText === "›" || this.innerText === "…") return;
      
      pageBtns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      
      // Add a slight loading effect mock
      const tbody = document.querySelector("tbody");
      if(tbody) {
        tbody.style.opacity = "0.3";
        setTimeout(() => tbody.style.opacity = "1", 300);
      }
    });
  });
}

/**
 * 5. Top Bar Notifications & Profile
 */
function initTopBarInteractions() {
  const notification = document.querySelector(".notification");
  const mail = document.querySelector(".mail");
  const avatar = document.querySelector(".avatar");

  if (notification) {
    notification.addEventListener("click", () => showToast("You have 3 new notifications."));
  }
  if (mail) {
    mail.addEventListener("click", () => showToast("You have 1 new message."));
  }
  if (avatar) {
    avatar.addEventListener("click", () => showToast("Profile settings opened."));
  }
  
  const dotsBtns = document.querySelectorAll(".dots-btn");
  dotsBtns.forEach(btn => {
    btn.addEventListener("click", () => showToast("More options clicked."));
  });
}

/**
 * 6. Action Buttons (Add, Update, Delete) + Modal Logic
 */
function initActionButtons() {
  const addButtons = document.querySelectorAll(".btn-primary:not(.page-btn)");
  const updateButtons = document.querySelectorAll(".btn-update");

  addButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      openModal("Add New Record", "Please fill in the details for the new entry.");
    });
  });

  updateButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const name = row ? row.querySelector(".name-text, td:nth-child(2)")?.innerText : "Record";
      openModal(`Update ${name}`, "Modify the details below and save changes.");
    });
  });
}

/**
 * Reusable Toast Notification System
 */
function showToast(message) {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.innerText = message;
  toast.style.cssText = `
    background-color: var(--navy-800, #152650);
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    font-size: 14px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
  `;
  
  toastContainer.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Reusable Modal System
 */
function openModal(title, description) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.5); z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.2s ease;
  `;

  const modal = document.createElement("div");
  modal.className = "modal-content";
  modal.style.cssText = `
    background: #fff; width: 400px; max-width: 90%; border-radius: 8px;
    padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    transform: scale(0.9); transition: transform 0.2s ease;
  `;

  modal.innerHTML = `
    <h3 style="margin-top:0; color: var(--text-dark, #0B1220);">${title}</h3>
    <p style="color: var(--text-body, #545E6F); font-size: 14px; margin-bottom: 20px;">${description}</p>
    
    <div style="margin-bottom: 15px;">
      <label style="display:block; font-size: 12px; margin-bottom: 5px; color: var(--text-muted, #757684)">Identifier</label>
      <input type="text" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border, #C4C5D5); border-radius: 4px; box-sizing: border-box;" placeholder="Enter value...">
    </div>
    
    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;">
      <button class="btn btn-cancel" style="padding: 8px 16px; border: 1px solid var(--border, #C4C5D5); background: white; border-radius: 4px; cursor: pointer;">Cancel</button>
      <button class="btn btn-save" style="padding: 8px 16px; background: var(--primary, #00288E); color: white; border: none; border-radius: 4px; cursor: pointer;">Save Changes</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Animate in
  setTimeout(() => {
    overlay.style.opacity = "1";
    modal.style.transform = "scale(1)";
  }, 10);

  // Close logic
  const close = () => {
    overlay.style.opacity = "0";
    modal.style.transform = "scale(0.9)";
    setTimeout(() => overlay.remove(), 200);
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  
  modal.querySelector(".btn-cancel").addEventListener("click", close);
  modal.querySelector(".btn-save").addEventListener("click", () => {
    showToast("Changes saved successfully!");
    close();
  });
}
