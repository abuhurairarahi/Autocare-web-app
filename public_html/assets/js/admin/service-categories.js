/**
 * service-categories.js
 * Specific interactions and dynamic functionality for the service-categories page.
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("service-categories page loaded successfully.");
    initSpecificInteractions();
    initAddCategoryModal();
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

function initAddCategoryModal() {
    const addBtns = [document.getElementById('add-category-btn'), document.getElementById('add-category-card-btn')];
    const modal = document.getElementById('add-category-modal');
    const closeBtn = document.getElementById('close-category-modal-btn');
    const cancelBtn = document.getElementById('cancel-category-modal-btn');
    const form = document.getElementById('add-category-form');

    if (!modal) return;

    addBtns.forEach(btn => {
        if(btn) btn.addEventListener('click', () => { modal.classList.add('active'); });
    });

    const closeModal = () => { modal.classList.remove('active'); if(form) form.reset(); };

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(cancelBtn) cancelBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (typeof showToast === 'function') {
                showToast("Category added successfully!");
            } else {
                alert("Category added successfully!");
            }
            closeModal();
        });
    }
}
