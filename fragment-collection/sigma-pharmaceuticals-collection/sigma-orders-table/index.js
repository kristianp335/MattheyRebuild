/**
 * Sigma Orders Table Fragment
 * Professional pharmaceutical order management with search, sort, and pagination
 */

(function(fragmentElement, configuration) {
    'use strict';

    let currentDataset = configuration.defaultDataset || 'hospital-orders';
    let currentPage = 1;
    let rowsPerPage = parseInt(configuration.rowsPerPage) || 10;
    let sortField = 'orderDate';
    let sortDirection = 'desc';
    let searchQuery = '';
    let filteredData = [];

    /**
     * Order datasets using actual Sigma pharmaceutical products
     */
    const datasets = {
        'hospital-orders': {
            label: 'Hospital/Clinic Orders',
            orders: [
                {
                    orderDate: '2025-09-23',
                    customer: 'Royal London Hospital',
                    products: [
                        { name: 'Amlodipine 5mg Tablets', sku: 'AMLO-5MG-56', quantity: 500 },
                        { name: 'Lisinopril 10mg Tablets', sku: 'LISIN-10MG-90', quantity: 300 }
                    ],
                    quantity: 800,
                    total: 12450.00,
                    status: 'completed'
                },
                {
                    orderDate: '2025-09-22',
                    customer: 'Manchester General Hospital',
                    products: [
                        { name: 'Salbutamol Inhaler 100mcg', sku: 'SALB-100MCG-200', quantity: 150 },
                        { name: 'Beclometasone Inhaler 250mcg', sku: 'BECLO-250MCG-120', quantity: 200 }
                    ],
                    quantity: 350,
                    total: 8975.50,
                    status: 'processing'
                },
                {
                    orderDate: '2025-09-22',
                    customer: 'Birmingham Clinic Network',
                    products: [
                        { name: 'Amoxicillin 500mg Capsules', sku: 'AMOXI-500MG-56', quantity: 600 },
                        { name: 'Ciprofloxacin 500mg Tablets', sku: 'CIPRO-500MG-28', quantity: 400 }
                    ],
                    quantity: 1000,
                    total: 15680.00,
                    status: 'completed'
                },
                {
                    orderDate: '2025-09-21',
                    customer: 'Leeds Teaching Hospital',
                    products: [
                        { name: 'Atorvastatin 20mg Tablets', sku: 'ATOR-20MG-84', quantity: 800 },
                        { name: 'Metoprolol 50mg Tablets', sku: 'METO-50MG-112', quantity: 450 }
                    ],
                    quantity: 1250,
                    total: 18920.75,
                    status: 'completed'
                },
                {
                    orderDate: '2025-09-21',
                    customer: 'Newcastle Medical Centre',
                    products: [
                        { name: 'Omeprazole 20mg Capsules', sku: 'OMEP-20MG-28', quantity: 300 },
                        { name: 'Domperidone 10mg Tablets', sku: 'DOMP-10MG-30', quantity: 250 }
                    ],
                    quantity: 550,
                    total: 7250.25,
                    status: 'pending'
                },
                {
                    orderDate: '2025-09-20',
                    customer: 'Edinburgh Royal Infirmary',
                    products: [
                        { name: 'Montelukast 10mg Tablets', sku: 'MONTE-10MG-84', quantity: 200 },
                        { name: 'Loratadine 10mg Tablets', sku: 'LORAT-10MG-60', quantity: 350 }
                    ],
                    quantity: 550,
                    total: 9850.00,
                    status: 'completed'
                },
                {
                    orderDate: '2025-09-20',
                    customer: 'Cardiff Medical Group',
                    products: [
                        { name: 'Hydrocortisone 1% Cream', sku: 'HYDRO-1PC-15G', quantity: 180 },
                        { name: 'Clotrimazole 1% Cream', sku: 'CLOT-1PC-20G', quantity: 220 }
                    ],
                    quantity: 400,
                    total: 5680.50,
                    status: 'processing'
                },
                {
                    orderDate: '2025-09-19',
                    customer: 'Bristol Children\'s Hospital',
                    products: [
                        { name: 'Paracetamol 500mg Tablets', sku: 'PARA-500MG-32', quantity: 1200 },
                        { name: 'Ibuprofen 200mg Tablets', sku: 'IBU-200MG-48', quantity: 800 }
                    ],
                    quantity: 2000,
                    total: 4250.00,
                    status: 'completed'
                }
            ]
        },
        'pharmacy-orders': {
            label: 'Pharmacy Orders',
            orders: [
                {
                    orderDate: '2025-09-23',
                    customer: 'Boots Pharmacy - Oxford St',
                    products: [
                        { name: 'Paracetamol 500mg Tablets', sku: 'PARA-500MG-16', quantity: 24 },
                        { name: 'Aspirin 75mg Tablets', sku: 'ASP-75MG-28', quantity: 36 }
                    ],
                    quantity: 60,
                    total: 185.40,
                    status: 'completed'
                },
                {
                    orderDate: '2025-09-23',
                    customer: 'Lloyds Pharmacy - High St',
                    products: [
                        { name: 'Ibuprofen 200mg Tablets', sku: 'IBU-200MG-24', quantity: 48 },
                        { name: 'Loratadine 10mg Tablets', sku: 'LORAT-10MG-30', quantity: 18 }
                    ],
                    quantity: 66,
                    total: 289.50,
                    status: 'processing'
                },
                {
                    orderDate: '2025-09-22',
                    customer: 'Superdrug - Victoria Station',
                    products: [
                        { name: 'Hydrocortisone 1% Cream', sku: 'HYDRO-1PC-15G', quantity: 12 },
                        { name: 'Loperamide 2mg Tablets', sku: 'LOPER-2MG-30', quantity: 15 }
                    ],
                    quantity: 27,
                    total: 156.75,
                    status: 'completed'
                },
                {
                    orderDate: '2025-09-22',
                    customer: 'Well Pharmacy - Camden',
                    products: [
                        { name: 'Naproxen 250mg Tablets', sku: 'NAPX-250MG-28', quantity: 18 },
                        { name: 'Betamethasone 0.1% Ointment', sku: 'BETA-01PC-30G', quantity: 8 }
                    ],
                    quantity: 26,
                    total: 425.60,
                    status: 'pending'
                },
                {
                    orderDate: '2025-09-21',
                    customer: 'Boots Pharmacy - Regent St',
                    products: [
                        { name: 'Salbutamol Inhaler 100mcg', sku: 'SALB-100MCG-100', quantity: 6 },
                        { name: 'Budesonide Inhaler 200mcg', sku: 'BUDE-200MCG-100', quantity: 4 }
                    ],
                    quantity: 10,
                    total: 485.20,
                    status: 'completed'
                },
                {
                    orderDate: '2025-09-21',
                    customer: 'Tesco Pharmacy - King\'s Cross',
                    products: [
                        { name: 'Azithromycin 250mg Tablets', sku: 'AZITH-250MG-28', quantity: 12 },
                        { name: 'Clotrimazole 1% Cream', sku: 'CLOT-1PC-20G', quantity: 20 }
                    ],
                    quantity: 32,
                    total: 680.40,
                    status: 'processing'
                },
                {
                    orderDate: '2025-09-20',
                    customer: 'Day Lewis Pharmacy',
                    products: [
                        { name: 'Amlodipine 5mg Tablets', sku: 'AMLO-5MG-28', quantity: 15 },
                        { name: 'Lisinopril 10mg Tablets', sku: 'LISIN-10MG-30', quantity: 20 }
                    ],
                    quantity: 35,
                    total: 320.75,
                    status: 'completed'
                },
                {
                    orderDate: '2025-09-19',
                    customer: 'Asda Pharmacy - Croydon',
                    products: [
                        { name: 'Ipratropium Inhaler 20mcg', sku: 'IPRA-20MCG-200', quantity: 3 },
                        { name: 'Montelukast 10mg Tablets', sku: 'MONTE-10MG-28', quantity: 8 }
                    ],
                    quantity: 11,
                    total: 395.85,
                    status: 'cancelled'
                }
            ]
        }
    };

    /**
     * Initialize the table
     */
    function initTable() {
        try {
            initDatasetToggle();
            initSearch();
            initSorting();
            initPagination();
            updateTable();
        } catch (error) {
            console.error('Error initializing Sigma Orders Table:', error);
        }
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
                
                // Update dataset and reset pagination
                currentDataset = datasetKey;
                currentPage = 1;
                updateTable();
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
     * Initialize search functionality
     */
    function initSearch() {
        const searchInput = fragmentElement.querySelector('.sigma-search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', function() {
            searchQuery = this.value.toLowerCase();
            currentPage = 1;
            updateTable();
        });
    }

    /**
     * Initialize sorting functionality
     */
    function initSorting() {
        const sortableHeaders = fragmentElement.querySelectorAll('.sigma-th.sortable');
        
        sortableHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const field = this.getAttribute('data-sort');
                
                if (sortField === field) {
                    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    sortField = field;
                    sortDirection = 'asc';
                }
                
                // Update header visual state
                sortableHeaders.forEach(h => {
                    h.classList.remove('sort-asc', 'sort-desc');
                });
                this.classList.add(sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
                
                currentPage = 1;
                updateTable();
            });
        });
    }

    /**
     * Initialize pagination
     */
    function initPagination() {
        const prevButton = fragmentElement.querySelector('[data-action="prev-page"]');
        const nextButton = fragmentElement.querySelector('[data-action="next-page"]');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTable();
                }
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const totalPages = Math.ceil(filteredData.length / rowsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTable();
                }
            });
        }
    }

    /**
     * Filter and sort data
     */
    function processData() {
        let data = [...datasets[currentDataset].orders];
        
        // Apply search filter
        if (searchQuery) {
            data = data.filter(order => {
                return order.customer.toLowerCase().includes(searchQuery) ||
                       order.products.some(product => 
                           product.name.toLowerCase().includes(searchQuery) ||
                           product.sku.toLowerCase().includes(searchQuery)
                       ) ||
                       order.status.toLowerCase().includes(searchQuery);
            });
        }
        
        // Apply sorting
        data.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];
            
            if (sortField === 'orderDate') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }
            
            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        
        filteredData = data;
    }

    /**
     * Update the table display
     */
    function updateTable() {
        processData();
        renderTableBody();
        updatePagination();
        updateTableInfo();
    }

    /**
     * Render table body
     */
    function renderTableBody() {
        const tbody = fragmentElement.querySelector('.sigma-table-body');
        if (!tbody) return;

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);

        tbody.innerHTML = '';

        pageData.forEach(order => {
            const row = document.createElement('tr');
            
            // Format date
            const orderDate = new Date(order.orderDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            
            // Build products HTML
            const productsHtml = order.products.map(product => `
                <div class="sigma-product-item">
                    <span class="sigma-product-name">${product.name}</span>
                    <span class="sigma-product-sku">(${product.sku}) x${product.quantity}</span>
                </div>
            `).join('');
            
            // Get status badge class
            const statusClass = `sigma-status-${order.status}`;
            
            row.innerHTML = `
                <td class="sigma-td">${orderDate}</td>
                <td class="sigma-td">${order.customer}</td>
                <td class="sigma-td">
                    <div class="sigma-product-list">
                        ${productsHtml}
                    </div>
                </td>
                <td class="sigma-td">${order.quantity.toLocaleString()}</td>
                <td class="sigma-td">£${order.total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                <td class="sigma-td">
                    <span class="sigma-status-badge ${statusClass}">
                        ${order.status}
                    </span>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    /**
     * Update pagination controls
     */
    function updatePagination() {
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        const prevButton = fragmentElement.querySelector('[data-action="prev-page"]');
        const nextButton = fragmentElement.querySelector('[data-action="next-page"]');
        const pageNumbers = fragmentElement.querySelector('[data-container="page-numbers"]');
        
        // Update buttons
        if (prevButton) {
            prevButton.disabled = currentPage === 1;
        }
        if (nextButton) {
            nextButton.disabled = currentPage === totalPages;
        }
        
        // Update page numbers
        if (pageNumbers) {
            let numbersHtml = '';
            const maxPages = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
            let endPage = Math.min(totalPages, startPage + maxPages - 1);
            
            for (let i = startPage; i <= endPage; i++) {
                const activeClass = i === currentPage ? 'active' : '';
                numbersHtml += `
                    <button class="sigma-page-number ${activeClass}" data-page="${i}">
                        ${i}
                    </button>
                `;
            }
            
            pageNumbers.innerHTML = numbersHtml;
            
            // Add event listeners to page numbers
            pageNumbers.querySelectorAll('.sigma-page-number').forEach(button => {
                button.addEventListener('click', () => {
                    currentPage = parseInt(button.getAttribute('data-page'));
                    updateTable();
                });
            });
        }
    }

    /**
     * Update table info
     */
    function updateTableInfo() {
        const startIndex = (currentPage - 1) * rowsPerPage + 1;
        const endIndex = Math.min(currentPage * rowsPerPage, filteredData.length);
        
        const startElement = fragmentElement.querySelector('[data-info="showing-start"]');
        const endElement = fragmentElement.querySelector('[data-info="showing-end"]');
        const totalElement = fragmentElement.querySelector('[data-info="total-orders"]');
        
        if (startElement) startElement.textContent = startIndex;
        if (endElement) endElement.textContent = endIndex;
        if (totalElement) totalElement.textContent = filteredData.length;
    }

    /**
     * Initialize the fragment
     */
    function init() {
        initTable();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(fragmentElement, configuration);