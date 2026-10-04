/**
 * analytics.js
 * Specific interactions and dynamic functionality for the analytics page.
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("analytics page loaded successfully.");
    initSpecificInteractions();
    initExportAnalytics();
});

function initSpecificInteractions() {


    // 2. Wire up specific page buttons
    const primaryBtns = document.querySelectorAll('.primary-btn, .btn-primary');
    primaryBtns.forEach(btn => {
        // Only attach if it doesn't already have an action from global admin.js
        if (!btn.hasAttribute('data-wired')) {
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

function initExportAnalytics() {
    const exportBtn = document.getElementById('export-analytics-btn');
    if (!exportBtn) return;

    exportBtn.addEventListener('click', () => {
        // Find the main dashboard wrapper to convert to PDF
        const element = document.querySelector('.dashboard-body');
        if (!element) return;
        
        if (typeof showToast === 'function') {
            showToast("Generating PDF... Please wait.");
        }

        const opt = {
            margin:       0.5,
            filename:     'analytics_report.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, windowWidth: 1200 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
        };

        // Use html2pdf to generate and download the PDF
        html2pdf().set(opt).from(element).save().then(() => {
            if (typeof showToast === 'function') {
                showToast("PDF Downloaded Successfully!");
            }
        });
    });
}
