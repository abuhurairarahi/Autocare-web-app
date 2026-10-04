/**
 * vehicle-owners.js
 * Specific interactions and dynamic functionality for the vehicle-owners page.
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("vehicle-owners page loaded successfully.");
    initSpecificInteractions();
    initAddOwnerModal();
    initUpdateOwnerModal();
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
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', (e) => {
            if (typeof showToast === 'function') {
                showToast("Data filtered by: " + e.target.options[e.target.selectedIndex].text);
            }
        });
    });
}

function initAddOwnerModal() {
    const addBtn = document.getElementById('add-owner-btn');
    const modal = document.getElementById('add-owner-modal');
    const closeBtn = document.getElementById('close-owner-modal-btn');
    const cancelBtn = document.getElementById('cancel-owner-modal-btn');
    const form = document.getElementById('add-owner-form');

    if (!addBtn || !modal) return;

    addBtn.addEventListener('click', () => { modal.classList.add('active'); });
    const closeModal = () => { modal.classList.remove('active'); if(form) form.reset(); };

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(cancelBtn) cancelBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (typeof showToast === 'function') {
                showToast("Owner added successfully!");
            } else {
                alert("Owner added successfully!");
            }
            closeModal();
        });
    }
}

function initUpdateOwnerModal() {
    const updateBtns = document.querySelectorAll('.btn-update');
    const modal = document.getElementById('update-owner-modal');
    const closeBtn = document.getElementById('close-update-owner-modal-btn');
    const cancelBtn = document.getElementById('cancel-update-owner-modal-btn');
    const form = document.getElementById('update-owner-form');

    if (!modal || !form) return;

    let currentRow = null;

    updateBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentRow = e.target.closest('tr');
            if (!currentRow) return;

            const name = currentRow.querySelector('.user-name').innerText.trim();
            const email = currentRow.querySelector('.user-email').innerText.trim();
            const phone = currentRow.children[1].innerText.trim();
            const vnumber = currentRow.children[2].innerText.trim();
            const vtype = currentRow.children[3].innerText.trim();
            const date = currentRow.children[4].innerText.trim();
            const status = currentRow.querySelector('select.status').value;

            document.getElementById('update-owner-name').value = name;
            document.getElementById('update-owner-email').value = email;
            document.getElementById('update-owner-phone').value = phone;
            document.getElementById('update-owner-vnumber').value = vnumber;
            document.getElementById('update-owner-vtype').value = vtype;
            document.getElementById('update-owner-date').value = date;
            document.getElementById('update-owner-status').value = status;

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
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentRow) return;

        const newName = document.getElementById('update-owner-name').value;
        const newEmail = document.getElementById('update-owner-email').value;
        const newPhone = document.getElementById('update-owner-phone').value;
        const newVnumber = document.getElementById('update-owner-vnumber').value;
        const newVtype = document.getElementById('update-owner-vtype').value;
        const newDate = document.getElementById('update-owner-date').value;
        const newStatus = document.getElementById('update-owner-status').value;

        currentRow.querySelector('.user-name').innerText = newName;
        
        const nameParts = newName.split(' ');
        const initials = nameParts.length > 1 ? nameParts[0][0] + nameParts[nameParts.length - 1][0] : newName.substring(0, 2);
        currentRow.querySelector('.avatar').innerText = initials.toUpperCase();

        currentRow.querySelector('.user-email').innerText = newEmail;
        currentRow.children[1].innerText = newPhone;
        currentRow.children[2].innerText = newVnumber;
        currentRow.children[3].innerText = newVtype;
        currentRow.children[4].innerText = newDate;
        currentRow.querySelector('select.status').value = newStatus;

        if (typeof showToast === 'function') {
            showToast("Owner updated successfully!");
        } else {
            alert("Owner updated successfully!");
        }

        closeModal();
    });
}
