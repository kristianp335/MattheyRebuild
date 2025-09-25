/**
 * Sigma Line Graph Fragment
 * Professional pharmaceutical sales trend visualization with seasonal analysis
 */

(function(fragmentElement, configuration) {
    'use strict';

    let chartInstance = null;
    let currentDataset = configuration.defaultDataset || 'trend-2024';

    /**
     * Monthly sales data for actual Sigma pharmaceutical products
     */
    const datasets = {
        'trend-2024': {
            label: '2024 Performance Data',
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            lines: [
                {
                    label: 'Cardiovascular Products',
                    data: [145200, 138600, 142800, 149300, 155700, 151200, 147600, 152900, 158400, 162300, 169800, 178500],
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    products: ['Amlodipine', 'Lisinopril', 'Atorvastatin', 'Metoprolol', 'Aspirin', 'Nitroglycerin']
                },
                {
                    label: 'Respiratory Products',
                    data: [98400, 89200, 102600, 118900, 134200, 127800, 139500, 142300, 145800, 138600, 125400, 108700],
                    borderColor: '#0099ff',
                    backgroundColor: 'rgba(0, 153, 255, 0.1)',
                    products: ['Salbutamol Inhaler', 'Beclometasone', 'Montelukast', 'Ipratropium', 'Loratadine', 'Budesonide']
                },
                {
                    label: 'Pain Relief Products', 
                    data: [78300, 82100, 79600, 76800, 84200, 87500, 91300, 89700, 85400, 88900, 92600, 95800],
                    borderColor: '#00cc66',
                    backgroundColor: 'rgba(0, 204, 102, 0.1)',
                    products: ['Paracetamol', 'Ibuprofen', 'Naproxen']
                }
            ],
            insights: {
                peakMonth: 'December',
                growthRate: '+12.4%',
                seasonalTrend: 'Winter Peak'
            }
        },
        'trend-2025': {
            label: '2025 Performance Data',
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            lines: [
                {
                    label: 'Cardiovascular Products',
                    data: [165400, 158200, 162900, 169800, 175300, 171600, 167200, 173400, 179500, 184200, 192600, null],
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    products: ['Amlodipine', 'Lisinopril', 'Atorvastatin', 'Metoprolol', 'Aspirin', 'Nitroglycerin']
                },
                {
                    label: 'Respiratory Products',
                    data: [112800, 103400, 118900, 138600, 156700, 149200, 162800, 166100, 169200, 161400, 146200, null],
                    borderColor: '#0099ff',
                    backgroundColor: 'rgba(0, 153, 255, 0.1)',
                    products: ['Salbutamol Inhaler', 'Beclometasone', 'Montelukast', 'Ipratropium', 'Loratadine', 'Budesonide']
                },
                {
                    label: 'Pain Relief Products',
                    data: [89700, 94200, 91200, 88100, 96500, 100300, 104700, 102900, 98000, 101900, 106200, null],
                    borderColor: '#00cc66',
                    backgroundColor: 'rgba(0, 204, 102, 0.1)',
                    products: ['Paracetamol', 'Ibuprofen', 'Naproxen']
                }
            ],
            insights: {
                peakMonth: 'November',
                growthRate: '+18.2%',
                seasonalTrend: 'Steady Growth'
            }
        }
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
                updateInsights();
            });
        } else {
            createChart(ctx);
            updateInsights();
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
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                                size: 12
                            },
                            color: '#374151'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#0066cc',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                const lineData = datasets[currentDataset].lines[context.datasetIndex];
                                
                                return [
                                    `${context.dataset.label}: £${value ? value.toLocaleString() : 'No Data'}`,
                                    `Top Products: ${lineData.products.slice(0, 3).join(', ')}`
                                ];
                            },
                            afterBody: function(tooltipItems) {
                                const month = tooltipItems[0].label;
                                return `Month: ${month}`;
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
                            color: '#f3f4f6'
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.3,
                        borderWidth: 3
                    },
                    point: {
                        radius: 4,
                        hoverRadius: 6,
                        borderWidth: 2,
                        backgroundColor: '#ffffff'
                    }
                },
                animation: {
                    duration: 1000,
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
        
        return {
            labels: dataset.months,
            datasets: dataset.lines.map(line => ({
                label: line.label,
                data: line.data,
                borderColor: line.borderColor,
                backgroundColor: line.backgroundColor,
                fill: true,
                pointBackgroundColor: line.borderColor,
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: line.borderColor,
                pointHoverBorderColor: '#ffffff'
            }))
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
        updateInsights();
    }

    /**
     * Update insights cards
     */
    function updateInsights() {
        const dataset = datasets[currentDataset];
        const insights = dataset.insights;

        const peakElement = fragmentElement.querySelector('[data-insight="peak-month"]');
        const growthElement = fragmentElement.querySelector('[data-insight="growth-rate"]');
        const trendElement = fragmentElement.querySelector('[data-insight="seasonal-trend"]');

        if (peakElement) peakElement.textContent = insights.peakMonth;
        if (growthElement) growthElement.textContent = insights.growthRate;
        if (trendElement) trendElement.textContent = insights.seasonalTrend;
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
            console.error('Error initializing Sigma Line Graph:', error);
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