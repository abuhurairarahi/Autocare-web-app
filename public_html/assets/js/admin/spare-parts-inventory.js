/**
 * spare-parts-inventory.js
 * Specific interactions and dynamic functionality for the spare-parts-inventory page.
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("spare-parts-inventory page loaded successfully.");
    initSpecificInteractions();
});

function initSpecificInteractions() {
    // 1. Add hover animations to all stat cards and panels
    const cards = document.querySelectorAll('.stat-card, .metric-card, .card');
    cards.forEach(card => {
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow, 0 4px 6px rgba(0,0,0,0.05))';
        });
    });

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

    // 3. Make charts interactive (if they exist)
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.style.cursor = 'pointer';
        bar.addEventListener('mouseenter', (e) => {
            e.target.style.opacity = '0.7';
        });
        bar.addEventListener('mouseleave', (e) => {
            e.target.style.opacity = '1';
        });
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
