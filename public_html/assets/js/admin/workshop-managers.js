/**
 * workshop-managers.js
 * Specific interactions and dynamic functionality for the workshop-managers page.
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("workshop-managers page loaded successfully.");
    initSpecificInteractions();
    initAddManagerModal();
    initExportToExcel();
    initUpdateManagerModal();
});

function initSpecificInteractions() {


    // 2. Wire up specific page buttons
    const primaryBtns = document.querySelectorAll('.primary-btn, .btn-primary');
    primaryBtns.forEach(btn => {
        // Only attach if it doesn't already have an action from global admin.js
        if(!btn.hasAttribute('data-wired')) {
            btn.setAttribute('data-wired', 'true');
            btn.addEventListener('click', (e) => {
                const actionText = e.target.innerText.trim();
                // We use the global showToast if available, otherwise alert
                if (typeof showToast === 'function') {
                    showToast(actionText + " action triggered successfully!");
                } else {
                    alert(actionText + " action triggered successfully!");
                }
            });
        }
    });



    // 4. Handle specific filters
    const selects = document.querySelectorAll('select:not(#manager-workshop):not(#manager-status)');
    selects.forEach(select => {
        select.addEventListener('change', (e) => {
            if (typeof showToast === 'function') {
                showToast("Data filtered by: " + e.target.options[e.target.selectedIndex].text);
            }
        });
    });
}

function initAddManagerModal() {
    const addBtn = document.getElementById('add-manager-btn');
    const modal = document.getElementById('add-manager-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-modal-btn');
    const form = document.getElementById('add-manager-form');
    const dateInput = document.getElementById('manager-joining-date');

    if (!addBtn || !modal) return;

    // Open modal
    addBtn.addEventListener('click', () => {
        // Auto-fill today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        if(dateInput) dateInput.value = today;
        modal.classList.add('active');
    });

    const closeModal = () => {
        modal.classList.remove('active');
        if(form) form.reset();
    };

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Close when clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Form submit
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const data = {
                name: document.getElementById('manager-name').value,
                email: document.getElementById('manager-email').value,
                phone: document.getElementById('manager-phone').value,
                workshop: document.getElementById('manager-workshop').value,
                status: document.getElementById('manager-status').value,
                joiningDate: dateInput.value
            };
            
            console.log("Saving new manager:", data);
            
            if (typeof showToast === 'function') {
                showToast("Manager saved successfully!");
            } else {
                alert("Manager saved successfully!");
            }
            
            closeModal();
        });
    }
}

function initExportToExcel() {
    const exportBtn = document.getElementById('export-managers-btn');
    if (!exportBtn) return;

    exportBtn.addEventListener('click', () => {
        const table = document.querySelector('.managers-table');
        if (!table) return;

        let csvContent = "data:text/csv;charset=utf-8,";

        // Get table headers
        const headers = [];
        table.querySelectorAll('thead th').forEach(th => {
            if (!th.classList.contains('col-actions')) {
                headers.push('"' + th.innerText.trim().replace(/"/g, '""') + '"');
            }
        });
        csvContent += headers.join(',') + "\r\n";

        // Get table rows
        table.querySelectorAll('tbody tr').forEach(tr => {
            const rowData = [];
            tr.querySelectorAll('td').forEach(td => {
                // Skip the actions column based on structure, or we can just skip the last cell
                if (!td.querySelector('.btn')) {
                    // Extract text content carefully
                    let text = td.innerText.trim();
                    text = text.replace(/"/g, '""');
                    rowData.push('"' + text + '"');
                }
            });
            csvContent += rowData.join(',') + "\r\n";
        });

        // Trigger download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "workshop_managers.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);

        if (typeof showToast === 'function') {
            showToast("Export successful!");
        }
    });
}

function initUpdateManagerModal() {
    const updateBtns = document.querySelectorAll('.btn-update');
    const modal = document.getElementById('update-manager-modal');
    const closeBtn = document.getElementById('close-update-modal-btn');
    const cancelBtn = document.getElementById('cancel-update-modal-btn');
    const form = document.getElementById('update-manager-form');

    if (!modal || !form) return;

    let currentRow = null;

    // Open modal and prepopulate
    updateBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentRow = e.target.closest('tr');
            if (!currentRow) return;

            // Extract data from row
            const name = currentRow.querySelector('.name-text').innerText.trim();
            const email = currentRow.querySelector('.contact-cell span:first-child').innerText.trim();
            const phone = currentRow.querySelector('.contact-cell .muted').innerText.trim();
            const workshop = currentRow.children[3].innerText.trim();
            const status = currentRow.querySelector('.status-pill').innerText.trim();
            const date = currentRow.children[5].innerText.trim();

            // Populate form
            document.getElementById('update-manager-name').value = name;
            document.getElementById('update-manager-email').value = email;
            document.getElementById('update-manager-phone').value = phone;
            document.getElementById('update-manager-workshop').value = workshop;
            document.getElementById('update-manager-status').value = status;
            document.getElementById('update-manager-joining-date').value = date;

            modal.classList.add('active');
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        form.reset();
        currentRow = null;
    };

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(cancelBtn) cancelBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle save
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentRow) return;

        // Get updated values
        const newName = document.getElementById('update-manager-name').value;
        const newEmail = document.getElementById('update-manager-email').value;
        const newPhone = document.getElementById('update-manager-phone').value;
        const newWorkshop = document.getElementById('update-manager-workshop').value;
        const newStatus = document.getElementById('update-manager-status').value;
        const newDate = document.getElementById('update-manager-joining-date').value;

        // Update DOM row
        currentRow.querySelector('.name-text').innerText = newName;
        
        // Update avatar initials
        const nameParts = newName.split(' ');
        const initials = nameParts.length > 1 ? nameParts[0][0] + nameParts[nameParts.length - 1][0] : newName.substring(0, 2);
        currentRow.querySelector('.avatar-sm').innerText = initials.toUpperCase();

        currentRow.querySelector('.contact-cell span:first-child').innerText = newEmail;
        currentRow.querySelector('.contact-cell .muted').innerText = newPhone;
        currentRow.children[3].innerText = newWorkshop;
        
        const statusPill = currentRow.querySelector('.status-pill');
        statusPill.innerText = newStatus;
        statusPill.className = 'status-pill status-' + newStatus.toLowerCase();

        currentRow.children[5].innerText = newDate;

        if (typeof showToast === 'function') {
            showToast("Manager updated successfully!");
        } else {
            alert("Manager updated successfully!");
        }

        closeModal();
    });
}
