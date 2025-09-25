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
                // September 2025 Orders (Recent)
                { orderDate: '2025-09-25', products: [{ name: 'Amlodipine 5mg Tablets', sku: 'AMLO-5MG-84', quantity: 840 }, { name: 'Lisinopril 10mg Tablets', sku: 'LISIN-10MG-90', quantity: 720 }], quantity: 1560, total: 18450.00, status: 'processing' },
                { orderDate: '2025-09-24', products: [{ name: 'Salbutamol Inhaler 100mcg', sku: 'SALB-100MCG-200', quantity: 400 }, { name: 'Beclometasone Inhaler 250mcg', sku: 'BECLO-250MCG-120', quantity: 300 }], quantity: 700, total: 22450.00, status: 'completed' },
                { orderDate: '2025-09-24', products: [{ name: 'Amoxicillin 500mg Capsules', sku: 'AMOXI-500MG-56', quantity: 1120 }, { name: 'Azithromycin 250mg Tablets', sku: 'AZITH-250MG-84', quantity: 840 }], quantity: 1960, total: 28750.00, status: 'completed' },
                { orderDate: '2025-09-23', products: [{ name: 'Atorvastatin 20mg Tablets', sku: 'ATOR-20MG-84', quantity: 1680 }, { name: 'Metoprolol 50mg Tablets', sku: 'METO-50MG-112', quantity: 896 }], quantity: 2576, total: 35920.00, status: 'completed' },
                { orderDate: '2025-09-23', products: [{ name: 'Omeprazole 20mg Capsules', sku: 'OMEP-20MG-28', quantity: 560 }], quantity: 560, total: 8450.00, status: 'pending' },
                { orderDate: '2025-09-22', products: [{ name: 'Montelukast 10mg Tablets', sku: 'MONTE-10MG-84', quantity: 672 }, { name: 'Loratadine 10mg Tablets', sku: 'LORAT-10MG-60', quantity: 480 }], quantity: 1152, total: 19350.00, status: 'completed' },
                { orderDate: '2025-09-22', products: [{ name: 'Hydrocortisone 1% Cream', sku: 'HYDRO-1PC-15G', quantity: 360 }, { name: 'Betamethasone 0.1% Ointment', sku: 'BETA-01PC-30G', quantity: 240 }], quantity: 600, total: 12680.00, status: 'processing' },
                { orderDate: '2025-09-21', products: [{ name: 'Paracetamol 500mg Tablets', sku: 'PARA-500MG-32', quantity: 1280 }, { name: 'Ibuprofen 200mg Tablets', sku: 'IBU-200MG-48', quantity: 960 }], quantity: 2240, total: 8450.00, status: 'completed' },
                { orderDate: '2025-09-21', products: [{ name: 'Aspirin 75mg Tablets', sku: 'ASP-75MG-100', quantity: 1000 }], quantity: 1000, total: 4250.00, status: 'completed' },
                { orderDate: '2025-09-20', products: [{ name: 'Ciprofloxacin 500mg Tablets', sku: 'CIPRO-500MG-56', quantity: 1120 }], quantity: 1120, total: 16800.00, status: 'processing' },
                // August 2025 Orders
                { orderDate: '2025-08-31', products: [{ name: 'Budesonide Inhaler 200mcg', sku: 'BUDE-200MCG-200', quantity: 600 }], quantity: 600, total: 18650.00, status: 'completed' },
                { orderDate: '2025-08-30', products: [{ name: 'Domperidone 10mg Tablets', sku: 'DOMP-10MG-30', quantity: 480 }, { name: 'Loperamide 2mg Tablets', sku: 'LOPER-2MG-30', quantity: 360 }], quantity: 840, total: 12450.00, status: 'completed' },
                { orderDate: '2025-08-29', products: [{ name: 'Clotrimazole 1% Cream', sku: 'CLOT-1PC-20G', quantity: 400 }], quantity: 400, total: 6850.00, status: 'completed' },
                { orderDate: '2025-08-28', products: [{ name: 'Ipratropium Inhaler 20mcg', sku: 'IPRA-20MCG-400', quantity: 320 }], quantity: 320, total: 14250.00, status: 'completed' },
                { orderDate: '2025-08-27', products: [{ name: 'Naproxen 250mg Tablets', sku: 'NAPX-250MG-56', quantity: 1120 }], quantity: 1120, total: 16750.00, status: 'completed' },
                { orderDate: '2025-08-26', products: [{ name: 'Nitroglycerin Sublingual Spray', sku: 'NITRO-SUBLIN-800MCG', quantity: 80 }], quantity: 80, total: 9850.00, status: 'completed' },
                { orderDate: '2025-08-25', products: [{ name: 'Amlodipine 5mg Tablets', sku: 'AMLO-5MG-56', quantity: 1120 }], quantity: 1120, total: 13450.00, status: 'completed' },
                { orderDate: '2025-08-24', products: [{ name: 'Salbutamol Inhaler 100mcg', sku: 'SALB-100MCG-100', quantity: 500 }], quantity: 500, total: 12250.00, status: 'completed' },
                { orderDate: '2025-08-23', products: [{ name: 'Amoxicillin 500mg Capsules', sku: 'AMOXI-500MG-28', quantity: 840 }], quantity: 840, total: 11450.00, status: 'completed' },
                { orderDate: '2025-08-22', products: [{ name: 'Atorvastatin 20mg Tablets', sku: 'ATOR-20MG-56', quantity: 1120 }], quantity: 1120, total: 15650.00, status: 'completed' },
                { orderDate: '2025-08-21', products: [{ name: 'Beclometasone Inhaler 250mcg', sku: 'BECLO-250MCG-200', quantity: 400 }], quantity: 400, total: 19850.00, status: 'completed' },
                { orderDate: '2025-08-20', products: [{ name: 'Lisinopril 10mg Tablets', sku: 'LISIN-10MG-30', quantity: 900 }], quantity: 900, total: 8750.00, status: 'completed' },
                { orderDate: '2025-08-19', products: [{ name: 'Metoprolol 50mg Tablets', sku: 'METO-50MG-56', quantity: 1120 }], quantity: 1120, total: 14250.00, status: 'completed' },
                { orderDate: '2025-08-18', products: [{ name: 'Omeprazole 20mg Capsules', sku: 'OMEP-20MG-28', quantity: 840 }], quantity: 840, total: 12650.00, status: 'completed' },
                { orderDate: '2025-08-17', products: [{ name: 'Montelukast 10mg Tablets', sku: 'MONTE-10MG-28', quantity: 560 }], quantity: 560, total: 16450.00, status: 'completed' },
                { orderDate: '2025-08-16', products: [{ name: 'Loratadine 10mg Tablets', sku: 'LORAT-10MG-30', quantity: 720 }], quantity: 720, total: 7850.00, status: 'completed' },
                { orderDate: '2025-08-15', products: [{ name: 'Hydrocortisone 1% Cream', sku: 'HYDRO-1PC-15G', quantity: 480 }], quantity: 480, total: 8450.00, status: 'completed' },
                { orderDate: '2025-08-14', products: [{ name: 'Paracetamol 500mg Tablets', sku: 'PARA-500MG-16', quantity: 1600 }], quantity: 1600, total: 4250.00, status: 'completed' },
                { orderDate: '2025-08-13', products: [{ name: 'Ibuprofen 200mg Tablets', sku: 'IBU-200MG-24', quantity: 1200 }], quantity: 1200, total: 5850.00, status: 'completed' },
                { orderDate: '2025-08-12', products: [{ name: 'Aspirin 75mg Tablets', sku: 'ASP-75MG-56', quantity: 1120 }], quantity: 1120, total: 3450.00, status: 'completed' },
                // July 2025 Orders
                { orderDate: '2025-07-31', products: [{ name: 'Ciprofloxacin 500mg Tablets', sku: 'CIPRO-500MG-28', quantity: 840 }], quantity: 840, total: 14850.00, status: 'completed' },
                { orderDate: '2025-07-30', products: [{ name: 'Azithromycin 250mg Tablets', sku: 'AZITH-250MG-28', quantity: 560 }], quantity: 560, total: 18450.00, status: 'completed' },
                { orderDate: '2025-07-29', products: [{ name: 'Budesonide Inhaler 200mcg', sku: 'BUDE-200MCG-100', quantity: 300 }], quantity: 300, total: 12450.00, status: 'completed' },
                { orderDate: '2025-07-28', products: [{ name: 'Domperidone 10mg Tablets', sku: 'DOMP-10MG-30', quantity: 360 }], quantity: 360, total: 8750.00, status: 'completed' },
                { orderDate: '2025-07-27', products: [{ name: 'Loperamide 2mg Tablets', sku: 'LOPER-2MG-30', quantity: 480 }], quantity: 480, total: 6450.00, status: 'completed' },
                { orderDate: '2025-07-26', products: [{ name: 'Clotrimazole 1% Cream', sku: 'CLOT-1PC-20G', quantity: 320 }], quantity: 320, total: 7850.00, status: 'completed' },
                { orderDate: '2025-07-25', products: [{ name: 'Betamethasone 0.1% Ointment', sku: 'BETA-01PC-30G', quantity: 240 }], quantity: 240, total: 14250.00, status: 'completed' },
                { orderDate: '2025-07-24', products: [{ name: 'Ipratropium Inhaler 20mcg', sku: 'IPRA-20MCG-200', quantity: 400 }], quantity: 400, total: 16450.00, status: 'completed' },
                { orderDate: '2025-07-23', products: [{ name: 'Naproxen 250mg Tablets', sku: 'NAPX-250MG-28', quantity: 840 }], quantity: 840, total: 12650.00, status: 'completed' },
                { orderDate: '2025-07-22', products: [{ name: 'Nitroglycerin Sublingual Spray', sku: 'NITRO-SUBLIN-400MCG', quantity: 120 }], quantity: 120, total: 8450.00, status: 'completed' },
                { orderDate: '2025-07-21', products: [{ name: 'Amlodipine 5mg Tablets', sku: 'AMLO-5MG-28', quantity: 1120 }], quantity: 1120, total: 9850.00, status: 'completed' },
                { orderDate: '2025-07-20', products: [{ name: 'Salbutamol Inhaler 100mcg', sku: 'SALB-100MCG-200', quantity: 600 }], quantity: 600, total: 18450.00, status: 'completed' },
                { orderDate: '2025-07-19', products: [{ name: 'Amoxicillin 500mg Capsules', sku: 'AMOXI-500MG-56', quantity: 1120 }], quantity: 1120, total: 15250.00, status: 'completed' },
                { orderDate: '2025-07-18', products: [{ name: 'Atorvastatin 20mg Tablets', sku: 'ATOR-20MG-28', quantity: 1120 }], quantity: 1120, total: 13450.00, status: 'completed' },
                { orderDate: '2025-07-17', products: [{ name: 'Beclometasone Inhaler 250mcg', sku: 'BECLO-250MCG-120', quantity: 240 }], quantity: 240, total: 16850.00, status: 'completed' },
                { orderDate: '2025-07-16', products: [{ name: 'Lisinopril 10mg Tablets', sku: 'LISIN-10MG-90', quantity: 900 }], quantity: 900, total: 11450.00, status: 'completed' },
                { orderDate: '2025-07-15', products: [{ name: 'Metoprolol 50mg Tablets', sku: 'METO-50MG-112', quantity: 1120 }], quantity: 1120, total: 16850.00, status: 'completed' },
                { orderDate: '2025-07-14', products: [{ name: 'Omeprazole 20mg Capsules', sku: 'OMEP-20MG-28', quantity: 560 }], quantity: 560, total: 8450.00, status: 'completed' },
                { orderDate: '2025-07-13', products: [{ name: 'Montelukast 10mg Tablets', sku: 'MONTE-10MG-84', quantity: 672 }], quantity: 672, total: 19750.00, status: 'completed' },
                { orderDate: '2025-07-12', products: [{ name: 'Loratadine 10mg Tablets', sku: 'LORAT-10MG-60', quantity: 720 }], quantity: 720, total: 9850.00, status: 'completed' },
                { orderDate: '2025-07-11', products: [{ name: 'Hydrocortisone 1% Cream', sku: 'HYDRO-1PC-15G', quantity: 360 }], quantity: 360, total: 6450.00, status: 'completed' },
                { orderDate: '2025-07-10', products: [{ name: 'Paracetamol 500mg Tablets', sku: 'PARA-500MG-32', quantity: 1920 }], quantity: 1920, total: 6450.00, status: 'completed' }
            ]
        },
        'pharmacy-orders': {
            label: 'Pharmacy Orders',
            orders: [
                // September 2025 Orders (Recent)
                { orderDate: '2025-09-25', products: [{ name: 'Paracetamol 500mg Tablets', sku: 'PARA-500MG-16', quantity: 48 }, { name: 'Aspirin 75mg Tablets', sku: 'ASP-75MG-28', quantity: 72 }], quantity: 120, total: 285.40, status: 'completed' },
                { orderDate: '2025-09-24', products: [{ name: 'Ibuprofen 200mg Tablets', sku: 'IBU-200MG-24', quantity: 96 }], quantity: 96, total: 145.20, status: 'completed' },
                { orderDate: '2025-09-24', products: [{ name: 'Loratadine 10mg Tablets', sku: 'LORAT-10MG-30', quantity: 60 }], quantity: 60, total: 185.40, status: 'processing' },
                { orderDate: '2025-09-23', products: [{ name: 'Hydrocortisone 1% Cream', sku: 'HYDRO-1PC-15G', quantity: 24 }, { name: 'Clotrimazole 1% Cream', sku: 'CLOT-1PC-20G', quantity: 18 }], quantity: 42, total: 165.80, status: 'completed' },
                { orderDate: '2025-09-23', products: [{ name: 'Loperamide 2mg Tablets', sku: 'LOPER-2MG-30', quantity: 36 }], quantity: 36, total: 98.50, status: 'completed' },
                { orderDate: '2025-09-22', products: [{ name: 'Paracetamol 500mg Tablets', sku: 'PARA-500MG-32', quantity: 64 }], quantity: 64, total: 128.40, status: 'completed' },
                { orderDate: '2025-09-22', products: [{ name: 'Aspirin 75mg Tablets', sku: 'ASP-75MG-56', quantity: 112 }], quantity: 112, total: 145.60, status: 'pending' },
                { orderDate: '2025-09-21', products: [{ name: 'Naproxen 250mg Tablets', sku: 'NAPX-250MG-28', quantity: 28 }], quantity: 28, total: 285.40, status: 'completed' },
                { orderDate: '2025-09-21', products: [{ name: 'Ibuprofen 200mg Tablets', sku: 'IBU-200MG-48', quantity: 96 }], quantity: 96, total: 165.80, status: 'completed' },
                { orderDate: '2025-09-20', products: [{ name: 'Domperidone 10mg Tablets', sku: 'DOMP-10MG-30', quantity: 30 }], quantity: 30, total: 145.20, status: 'processing' },
                // August 2025 Orders
                { orderDate: '2025-08-31', products: [{ name: 'Betamethasone 0.1% Ointment', sku: 'BETA-01PC-30G', quantity: 15 }], quantity: 15, total: 285.40, status: 'completed' },
                { orderDate: '2025-08-30', products: [{ name: 'Hydrocortisone 1% Cream', sku: 'HYDRO-1PC-15G', quantity: 36 }], quantity: 36, total: 165.80, status: 'completed' },
                { orderDate: '2025-08-29', products: [{ name: 'Paracetamol 500mg Tablets', sku: 'PARA-500MG-16', quantity: 80 }], quantity: 80, total: 145.60, status: 'completed' },
                { orderDate: '2025-08-28', products: [{ name: 'Aspirin 75mg Tablets', sku: 'ASP-75MG-28', quantity: 84 }], quantity: 84, total: 185.40, status: 'completed' },
                { orderDate: '2025-08-27', products: [{ name: 'Ibuprofen 200mg Tablets', sku: 'IBU-200MG-24', quantity: 72 }], quantity: 72, total: 125.80, status: 'completed' },
                { orderDate: '2025-08-26', products: [{ name: 'Loratadine 10mg Tablets', sku: 'LORAT-10MG-60', quantity: 60 }], quantity: 60, total: 245.40, status: 'completed' },
                { orderDate: '2025-08-25', products: [{ name: 'Loperamide 2mg Tablets', sku: 'LOPER-2MG-30', quantity: 60 }], quantity: 60, total: 165.80, status: 'completed' },
                { orderDate: '2025-08-24', products: [{ name: 'Clotrimazole 1% Cream', sku: 'CLOT-1PC-20G', quantity: 24 }], quantity: 24, total: 145.20, status: 'completed' },
                { orderDate: '2025-08-23', products: [{ name: 'Hydrocortisone 1% Cream', sku: 'HYDRO-1PC-15G', quantity: 30 }], quantity: 30, total: 128.40, status: 'completed' },
                { orderDate: '2025-08-22', products: [{ name: 'Paracetamol 500mg Tablets', sku: 'PARA-500MG-32', quantity: 96 }], quantity: 96, total: 185.60, status: 'completed' },
                { orderDate: '2025-08-21', products: [{ name: 'Aspirin 75mg Tablets', sku: 'ASP-75MG-56', quantity: 168 }], quantity: 168, total: 225.40, status: 'completed' },
                { orderDate: '2025-08-20', products: [{ name: 'Naproxen 250mg Tablets', sku: 'NAPX-250MG-56', quantity: 56 }], quantity: 56, total: 485.40, status: 'completed' },
                { orderDate: '2025-08-19', products: [{ name: 'Ibuprofen 200mg Tablets', sku: 'IBU-200MG-48', quantity: 144 }], quantity: 144, total: 245.80, status: 'completed' },
                { orderDate: '2025-08-18', products: [{ name: 'Domperidone 10mg Tablets', sku: 'DOMP-10MG-30', quantity: 60 }], quantity: 60, total: 285.40, status: 'completed' },
                { orderDate: '2025-08-17', products: [{ name: 'Loratadine 10mg Tablets', sku: 'LORAT-10MG-30', quantity: 90 }], quantity: 90, total: 265.80, status: 'completed' },
                { orderDate: '2025-08-16', products: [{ name: 'Loperamide 2mg Tablets', sku: 'LOPER-2MG-30', quantity: 90 }], quantity: 90, total: 245.40, status: 'completed' },
                { orderDate: '2025-08-15', products: [{ name: 'Betamethasone 0.1% Ointment', sku: 'BETA-01PC-30G', quantity: 18 }], quantity: 18, total: 345.20, status: 'completed' },
                { orderDate: '2025-08-14', products: [{ name: 'Clotrimazole 1% Cream', sku: 'CLOT-1PC-20G', quantity: 36 }], quantity: 36, total: 215.80, status: 'completed' },
                { orderDate: '2025-08-13', products: [{ name: 'Hydrocortisone 1% Cream', sku: 'HYDRO-1PC-15G', quantity: 48 }], quantity: 48, total: 205.40, status: 'completed' },
                { orderDate: '2025-08-12', products: [{ name: 'Paracetamol 500mg Tablets', sku: 'PARA-500MG-16', quantity: 128 }], quantity: 128, total: 225.60, status: 'completed' },
                // July 2025 Orders
                { orderDate: '2025-07-31', products: [{ name: 'Ibuprofen 200mg Tablets', sku: 'IBU-200MG-48', quantity: 192 }], quantity: 192, total: 325.80, status: 'completed' },
                { orderDate: '2025-07-30', products: [{ name: 'Naproxen 250mg Tablets', sku: 'NAPX-250MG-56', quantity: 112 }], quantity: 112, total: 925.40, status: 'completed' },
                { orderDate: '2025-07-29', products: [{ name: 'Loratadine 10mg Tablets', sku: 'LORAT-10MG-30', quantity: 150 }], quantity: 150, total: 445.80, status: 'completed' },
                { orderDate: '2025-07-28', products: [{ name: 'Domperidone 10mg Tablets', sku: 'DOMP-10MG-30', quantity: 120 }], quantity: 120, total: 565.40, status: 'completed' },
                { orderDate: '2025-07-27', products: [{ name: 'Loperamide 2mg Tablets', sku: 'LOPER-2MG-30', quantity: 150 }], quantity: 150, total: 405.20, status: 'completed' },
                { orderDate: '2025-07-26', products: [{ name: 'Clotrimazole 1% Cream', sku: 'CLOT-1PC-20G', quantity: 60 }], quantity: 60, total: 355.80, status: 'completed' },
                { orderDate: '2025-07-25', products: [{ name: 'Betamethasone 0.1% Ointment', sku: 'BETA-01PC-30G', quantity: 30 }], quantity: 30, total: 585.40, status: 'completed' },
                { orderDate: '2025-07-24', products: [{ name: 'Hydrocortisone 1% Cream', sku: 'HYDRO-1PC-15G', quantity: 72 }], quantity: 72, total: 305.60, status: 'completed' },
                { orderDate: '2025-07-23', products: [{ name: 'Paracetamol 500mg Tablets', sku: 'PARA-500MG-16', quantity: 192 }], quantity: 192, total: 345.20, status: 'completed' },
                { orderDate: '2025-07-22', products: [{ name: 'Aspirin 75mg Tablets', sku: 'ASP-75MG-28', quantity: 168 }], quantity: 168, total: 365.80, status: 'completed' },
                { orderDate: '2025-07-21', products: [{ name: 'Ibuprofen 200mg Tablets', sku: 'IBU-200MG-24', quantity: 168 }], quantity: 168, total: 265.40, status: 'completed' },
                { orderDate: '2025-07-20', products: [{ name: 'Naproxen 250mg Tablets', sku: 'NAPX-250MG-28', quantity: 112 }], quantity: 112, total: 1125.40, status: 'completed' },
                { orderDate: '2025-07-19', products: [{ name: 'Loratadine 10mg Tablets', sku: 'LORAT-10MG-60', quantity: 180 }], quantity: 180, total: 725.80, status: 'completed' }
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
                    sortDirection = 'desc';
                }
                
                updateSortIcons();
                currentPage = 1;
                updateTable();
            });
        });
    }

    /**
     * Update sort icons
     */
    function updateSortIcons() {
        const headers = fragmentElement.querySelectorAll('.sigma-th.sortable');
        
        headers.forEach(header => {
            const icon = header.querySelector('.sigma-sort-icon');
            if (!icon) return;
            
            header.classList.remove('sorted-asc', 'sorted-desc');
            
            if (header.getAttribute('data-sort') === sortField) {
                header.classList.add(sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
            }
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
    function getFilteredData() {
        const dataset = datasets[currentDataset];
        if (!dataset || !dataset.orders) return [];

        let filtered = dataset.orders.slice();

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(order => {
                return order.orderDate.toLowerCase().includes(searchQuery) ||
                       order.products.some(product => 
                           product.name.toLowerCase().includes(searchQuery) ||
                           product.sku.toLowerCase().includes(searchQuery)
                       ) ||
                       order.status.toLowerCase().includes(searchQuery);
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            // Handle different field types
            if (sortField === 'orderDate') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            } else if (sortField === 'total' || sortField === 'quantity') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } else {
                aValue = String(aValue).toLowerCase();
                bValue = String(bValue).toLowerCase();
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }

    /**
     * Update the table display
     */
    function updateTable() {
        filteredData = getFilteredData();
        renderTable();
        updatePagination();
        updateTableInfo();
    }

    /**
     * Render table rows
     */
    function renderTable() {
        const tbody = fragmentElement.querySelector('.sigma-table-body');
        if (!tbody) return;

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);
        const pageData = filteredData.slice(startIndex, endIndex);

        tbody.innerHTML = '';

        pageData.forEach(order => {
            const row = document.createElement('tr');
            row.className = 'sigma-table-row';

            // Format date
            const formattedDate = new Date(order.orderDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

            // Build products list
            const productsList = order.products.map(product => `
                <div class="sigma-product-item">
                    <span class="sigma-product-name">${product.name}</span>
                    <span class="sigma-product-sku">${product.sku}</span> x${product.quantity}
                </div>
            `).join('');

            // Format total as currency
            const formattedTotal = '£' + order.total.toFixed(2);

            // Status badge
            const statusClass = `sigma-status-${order.status}`;

            row.innerHTML = `
                <td class="sigma-td">${formattedDate}</td>
                <td class="sigma-td">
                    <div class="sigma-product-list">${productsList}</div>
                </td>
                <td class="sigma-td">${order.quantity.toLocaleString()}</td>
                <td class="sigma-td">${formattedTotal}</td>
                <td class="sigma-td">
                    <span class="sigma-status-badge ${statusClass}">${order.status.toUpperCase()}</span>
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
            nextButton.disabled = currentPage >= totalPages;
        }

        // Update page numbers
        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            
            const maxVisiblePages = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                const pageButton = document.createElement('button');
                pageButton.className = `sigma-page-number ${i === currentPage ? 'active' : ''}`;
                pageButton.textContent = i;
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    updateTable();
                });
                pageNumbers.appendChild(pageButton);
            }
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
    function initialize() {
        // Set default dataset if not configured
        if (!currentDataset || !datasets[currentDataset]) {
            currentDataset = 'hospital-orders';
        }

        initTable();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})(fragmentElement, configuration);