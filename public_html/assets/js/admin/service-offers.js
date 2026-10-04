/**
 * service-offers.js
 * Specific interactions and dynamic functionality for the service-offers page.
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("service-offers page loaded successfully.");
    initSpecificInteractions();
    initAddOfferModal();
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

function initAddOfferModal() {
    const addBtn = document.getElementById('add-offer-btn');
    const modal = document.getElementById('add-offer-modal');
    const closeBtn = document.getElementById('close-offer-modal-btn');
    const cancelBtn = document.getElementById('cancel-offer-modal-btn');
    const form = document.getElementById('add-offer-form');

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
                showToast("Offer added successfully!");
            } else {
                alert("Offer added successfully!");
            }
            closeModal();
        });
    }
}
