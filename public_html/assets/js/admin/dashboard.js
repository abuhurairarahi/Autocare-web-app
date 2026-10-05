/**
 * dashboard.js
 * Specific interactions and dynamic functionality for the dashboard page.
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("dashboard page loaded successfully.");
    initSpecificInteractions();
    initVisualizations();
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

function initVisualizations() {
    generateRevenueTrend();
    generateServicesByCategory();
    generateTopWorkshops();
    generateServiceDistribution();
}

function generateRevenueTrend() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Revenue (৳)',
            data: [120000, 190000, 150000, 220000, 300000, 280000, 350000, 400000, 420000, 380000, 450000, 500000],
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#f97316',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += '৳' + context.parsed.y.toLocaleString('en-IN');
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '৳' + (value / 1000) + 'k';
                        }
                    },
                    grid: {
                        color: '#f1f5f9'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };

    new Chart(ctx, config);
}

function generateServicesByCategory() {
    const container = document.getElementById('servicesCategoryChart');
    if (!container) return;

    // Data in percentage
    const categories = [
        { label: 'Maintenance', height: 60, color: '#3D4F91' },
        { label: 'Engine', height: 42, color: '#6E7FBE' },
        { label: 'Electrical', height: 75, color: '#8C9AD3' },
        { label: 'Body Shop', height: 34, color: '#A9B5E5' },
        { label: 'HVAC', height: 50, color: '#c4c4c4' }
    ];

    container.innerHTML = '';
    categories.forEach(cat => {
        const barWrap = document.createElement('div');
        barWrap.style.display = 'flex';
        barWrap.style.flexDirection = 'column';
        barWrap.style.alignItems = 'center';
        barWrap.style.height = '100%';
        barWrap.style.justifyContent = 'flex-end';
        barWrap.style.flex = '1';
        barWrap.style.gap = '4px';

        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = cat.height + '%';
        bar.style.background = cat.color;
        bar.title = cat.label + ': ' + cat.height + '%';

        const percentageText = document.createElement('span');
        percentageText.innerText = cat.height + '%';
        percentageText.style.fontSize = '11px';
        percentageText.style.fontWeight = 'bold';
        percentageText.style.color = '#334155';

        const nameText = document.createElement('span');
        nameText.innerText = cat.label;
        nameText.style.fontSize = '11px';
        nameText.style.color = '#64748b';
        nameText.style.textAlign = 'center';

        barWrap.appendChild(bar);
        barWrap.appendChild(percentageText);
        barWrap.appendChild(nameText);
        container.appendChild(barWrap);
    });
}

function generateTopWorkshops() {
    const list = document.getElementById('topWorkshopsList');
    if (!list) return;

    const topWorkshops = [
        { name: 'Dhaka Central AutoCare', jobs: 342, progress: 95 },
        { name: 'Rajshahi Motors', jobs: 289, progress: 80 },
        { name: 'Chittagong Auto Center', jobs: 210, progress: 58 },
        { name: 'Khulna Car Point', jobs: 195, progress: 54 },
        { name: 'Sylhet Elite Garage', jobs: 150, progress: 42 }
    ];

    list.innerHTML = '';
    topWorkshops.forEach(ws => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="workshop-row">
                <span>${ws.name}</span>
                <span>${ws.jobs} jobs</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width:${ws.progress}%"></div>
            </div>
        `;
        list.appendChild(li);
    });
}

function generateServiceDistribution() {
    const donut = document.getElementById('serviceDistributionDonut');
    const legend = document.getElementById('serviceDistributionLegend');
    if (!donut || !legend) return;

    const data = [
        { label: 'Maintenance', percentage: 45, color: '#00288E' },
        { label: 'Engine', percentage: 30, color: '#4C63B6' },
        { label: 'Electrical', percentage: 25, color: '#A9B5E5' }
    ];

    let gradientString = '';
    let currentDegree = 0;
    
    legend.innerHTML = '';

    data.forEach((item, index) => {
        const startPercentage = currentDegree;
        const endPercentage = currentDegree + item.percentage;
        
        gradientString += `${item.color} ${startPercentage}% ${endPercentage}%`;
        if (index < data.length - 1) {
            gradientString += ', ';
        }

        currentDegree = endPercentage;

        // Add to legend
        const legendItem = document.createElement('span');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `<i style="background:${item.color}"></i> ${item.label} (${item.percentage}%)`;
        legend.appendChild(legendItem);
    });

    donut.style.background = `conic-gradient(${gradientString})`;
}
