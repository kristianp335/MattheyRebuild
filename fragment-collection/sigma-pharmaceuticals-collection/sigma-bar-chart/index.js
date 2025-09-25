/**
 * Sigma Bar Chart Fragment
 * Professional pharmaceutical sales visualization with A/B dataset switching
 */

(function(fragmentElement, configuration) {
    'use strict';

    let chartInstance = null;
    let currentDataset = configuration.defaultDataset || 'dataset-a';

    /**
     * Dataset definitions using actual Sigma pharmaceutical products
     */
    const datasets = {
        'dataset-a': {
            label: 'Current Quarter (Q3 2025)',
            data: {
                'Cardiovascular': {
                    value: 485600,
                    products: ['Amlodipine 5mg', 'Lisinopril 10mg', 'Atorvastatin 20mg', 'Metoprolol 50mg', 'Aspirin 75mg', 'Nitroglycerin Spray'],
                    topProduct: 'Amlodipine 5mg Tablets'
                },
                'Respiratory': {
                    value: 392400,
                    products: ['Salbutamol Inhaler', 'Beclometasone Inhaler', 'Montelukast 10mg', 'Ipratropium Inhaler', 'Loratadine 10mg', 'Budesonide Inhaler'],
                    topProduct: 'Salbutamol Inhaler 100mcg'
                },
                'Pain Relief': {
                    value: 287300,
                    products: ['Paracetamol 500mg', 'Ibuprofen 200mg', 'Naproxen 250mg'],
                    topProduct: 'Paracetamol 500mg Tablets'
                },
                'Antibiotics': {
                    value: 195800,
                    products: ['Amoxicillin 500mg', 'Ciprofloxacin 500mg', 'Azithromycin 250mg'],
                    topProduct: 'Amoxicillin 500mg Capsules'
                },
                'Gastrointestinal': {
                    value: 147200,
                    products: ['Omeprazole 20mg', 'Loperamide 2mg', 'Domperidone 10mg'],
                    topProduct: 'Omeprazole 20mg Capsules'
                },
                'Dermatological': {
                    value: 98500,
                    products: ['Hydrocortisone 1% Cream', 'Clotrimazole 1% Cream', 'Betamethasone 0.1% Ointment'],
                    topProduct: 'Hydrocortisone 1% Cream'
                }
            }
        },
        'dataset-b': {
            label: 'Previous Quarter (Q2 2025)',
            data: {
                'Cardiovascular': {
                    value: 462300,
                    products: ['Amlodipine 5mg', 'Lisinopril 10mg', 'Atorvastatin 20mg', 'Metoprolol 50mg', 'Aspirin 75mg', 'Nitroglycerin Spray'],
                    topProduct: 'Amlodipine 5mg Tablets'
                },
                'Respiratory': {
                    value: 318600,
                    products: ['Salbutamol Inhaler', 'Beclometasone Inhaler', 'Montelukast 10mg', 'Ipratropium Inhaler', 'Loratadine 10mg', 'Budesonide Inhaler'],
                    topProduct: 'Salbutamol Inhaler 100mcg'
                },
                'Pain Relief': {
                    value: 294100,
                    products: ['Paracetamol 500mg', 'Ibuprofen 200mg', 'Naproxen 250mg'],
                    topProduct: 'Paracetamol 500mg Tablets'
                },
                'Antibiotics': {
                    value: 178400,
                    products: ['Amoxicillin 500mg', 'Ciprofloxacin 500mg', 'Azithromycin 250mg'],
                    topProduct: 'Amoxicillin 500mg Capsules'
                },
                'Gastrointestinal': {
                    value: 139800,
                    products: ['Omeprazole 20mg', 'Loperamide 2mg', 'Domperidone 10mg'],
                    topProduct: 'Omeprazole 20mg Capsules'
                },
                'Dermatological': {
                    value: 91200,
                    products: ['Hydrocortisone 1% Cream', 'Clotrimazole 1% Cream', 'Betamethasone 0.1% Ointment'],
                    topProduct: 'Hydrocortisone 1% Cream'
                }
            }
        }
    };

    /**
     * Chart colors matching Sigma therapeutic categories
     */
    const colors = {
        'Cardiovascular': '#0066cc',
        'Respiratory': '#0099ff',
        'Pain Relief': '#00cc66',
        'Antibiotics': '#ffaa00',
        'Gastrointestinal': '#6666cc',
        'Dermatological': '#9966cc'
    };

    /**
     * Initialize the chart
     */
    function initChart() {
        const canvas = fragmentElement.querySelector('.sigma-chart-canvas');
        if (!canvas) {
            console.warn('Chart canvas not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            loadChartJS().then(() => {
                createChart(ctx);
            });
        } else {
            createChart(ctx);
        }
    }

    /**
     * Load Chart.js dynamically
     */
    function loadChartJS() {
        return new Promise((resolve, reject) => {
            if (typeof Chart !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Create the chart instance
     */
    function createChart(ctx) {
        const data = getCurrentChartData();

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Using custom legend
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#0066cc',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const category = context.label;
                                const value = context.parsed.y;
                                const categoryData = datasets[currentDataset].data[category];
                                
                                return [
                                    `Sales: £${value.toLocaleString()}`,
                                    `Top Product: ${categoryData.topProduct}`,
                                    `Products: ${categoryData.products.length}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '£' + (value / 1000) + 'k';
                            },
                            color: '#666666',
                            font: {
                                family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                            }
                        },
                        grid: {
                            color: '#e5e5e5'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#666666',
                            font: {
                                family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    /**
     * Get current chart data based on selected dataset
     */
    function getCurrentChartData() {
        const dataset = datasets[currentDataset];
        const labels = Object.keys(dataset.data);
        const values = labels.map(label => dataset.data[label].value);
        const backgroundColors = labels.map(label => colors[label]);

        return {
            labels: labels,
            datasets: [{
                label: dataset.label,
                data: values,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors,
                borderWidth: 0,
                borderRadius: 4,
                borderSkipped: false
            }]
        };
    }

    /**
     * Update chart with new dataset
     */
    function updateChart(datasetKey) {
        if (!chartInstance) return;

        currentDataset = datasetKey;
        const newData = getCurrentChartData();
        
        // Safely update chart data
        chartInstance.data = newData;
        chartInstance.update('active');
    }

    /**
     * Initialize dataset toggle buttons
     */
    function initDatasetToggle() {
        const buttons = fragmentElement.querySelectorAll('.sigma-dataset-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const datasetKey = this.getAttribute('data-dataset');
                
                // Update button states
                buttons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update chart
                updateChart(datasetKey);
            });
        });

        // Set initial active state based on configuration
        buttons.forEach(btn => btn.classList.remove('active'));
        const defaultButton = fragmentElement.querySelector(`[data-dataset="${currentDataset}"]`);
        if (defaultButton) {
            defaultButton.classList.add('active');
        }
    }

    /**
     * Initialize the fragment
     */
    function init() {
        try {
            initDatasetToggle();
            initChart();
        } catch (error) {
            console.error('Error initializing Sigma Bar Chart:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on fragment removal
    return function cleanup() {
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
    };

})(fragmentElement, configuration);