/* globals Chart:false, flatpickr:false */

class DashboardController {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return; // Oprim daca containerul nu exista

        this.chartCanvas = this.container.querySelector('.dashboard-chart-canvas');
        this.datePickerInput = this.container.querySelector('.dashboard-datepicker');
        this.rangeThisMonthBtn = this.container.querySelector('.range-this-month');
        this.rangeLast30DaysBtn = this.container.querySelector('.range-last-30-days');
        this.rangeLastMonthBtn = this.container.querySelector('.range-last-month');
        this.chart = null;

        this.init();
    }

    // Initializeaza toate componentele
    init() {
        this.initDatePicker();
        this.initEventListeners();
        // Incarcarea initiala a datelor
        if (this.rangeThisMonthBtn) {
            this.rangeThisMonthBtn.click();
        }
    }

    // Initializeaza Flatpickr
    initDatePicker() {
        if (!this.datePickerInput) return;
        this.datePicker = flatpickr(this.datePickerInput, {
            mode: "range",
            dateFormat: "d-m-Y",
            locale: "ro",
            onChange: (selectedDates) => {
                if (selectedDates.length === 2) {
                    this.updateChart(selectedDates[0], selectedDates[1]);
                }
            }
        });
    }

    // Seteaza event listenerii pentru butoane
    initEventListeners() {
        this.rangeThisMonthBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            const today = new Date();
            const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            this.datePicker.setDate([startDate, today]);
            this.updateChart(startDate, endDate);
        });

        this.rangeLast30DaysBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 29);
            this.datePicker.setDate([startDate, endDate]);
            this.updateChart(startDate, endDate);
        });

        this.rangeLastMonthBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            const today = new Date();
            const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const endDate = new Date(today.getFullYear(), today.getMonth(), 0);
            this.datePicker.setDate([startDate, endDate]);
            this.updateChart(startDate, endDate);
        });
    }
    
    // Functia care genereaza date demonstrative
    generateConsumptionData(startDate, endDate) {
        const data = { labels: [], coldWater: [], hotWater: [] };
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            data.labels.push(currentDate.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' }));
            data.coldWater.push(Math.floor(Math.random() * 450) + 50);
            data.hotWater.push(Math.floor(Math.random() * 250) + 20);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return data;
    }

    // Functia principala care actualizeaza graficul
    updateChart(startDate, endDate) {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const effectiveEndDate = endDate > today ? today : endDate;
        const data = this.generateConsumptionData(startDate, effectiveEndDate);

        if (!this.chart) {
            this.chart = new Chart(this.chartCanvas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Consum Apă Rece (L)',
                        data: data.coldWater,
                        backgroundColor: '#0984e3',
                    }, {
                        label: 'Consum Apă Caldă (L)',
                        data: data.hotWater,
                        backgroundColor: '#d63031',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { x: { title: { display: true, text: 'Data' } }, y: { beginAtZero: true, title: { display: true, text: 'Consum (Litri)' } } },
                    plugins: { legend: { position: 'top' }, title: { display: true, text: 'Consum Zilnic Apă' } }
                }
            });
        } else {
            this.chart.data.labels = data.labels;
            this.chart.data.datasets[0].data = data.coldWater;
            this.chart.data.datasets[1].data = data.hotWater;
            this.chart.update();
        }
    }
}

// --- INITIALIZARE ---
document.addEventListener('DOMContentLoaded', () => {
    // Initializeaza panoul principal
    const mainDashboard = new DashboardController('mainDashboard');
    
    // Initializeaza fiecare panou de apartament
    const apartmentDashboards = {};
    document.querySelectorAll('[id^="apartmentDashboard"]').forEach(el => {
        apartmentDashboards[el.id] = new DashboardController(el.id);
    });

    // Rezolva problema de afisare a graficelor in tab-uri ascunse
    const apartmentTabs = document.querySelectorAll('#apartmentTabs button[data-bs-toggle="tab"]');
    apartmentTabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', event => {
            const targetPaneId = event.target.getAttribute('data-bs-target').substring(1);
            const targetDashboardId = document.querySelector(`#${targetPaneId} > div`).id;
            const targetDashboard = apartmentDashboards[targetDashboardId];
            if (targetDashboard && targetDashboard.chart) {
                targetDashboard.chart.resize();
            }
        });
    });
});