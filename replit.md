# Sigma Pharmaceuticals B2B Commerce System

## Overview
This project aims to establish a comprehensive B2B pharmaceutical commerce system for Sigma Pharmaceuticals. Leveraging Liferay Commerce Headless APIs, the system offers a complete product catalog featuring authentic pharmaceutical branding, precise SKU variants for pack sizes, a robust pharmaceutical categorization system, and detailed product specifications. The core objective is to manage products effectively, including multiple SKUs linked to product options, proper taxonomies for therapeutic areas and product types, and informational specifications. The system also includes advanced data visualization tools for sales trends and order management, alongside a versatile fragment collection for Liferay-based frontends, demonstrated through both Sigma's own branding and adaptable templates for other corporate identities like Yorkshire Building Society and Johnson Matthey. The business vision is to streamline B2B pharmaceutical transactions, enhance product visibility, and provide valuable insights into sales data.

## User Preferences
Preferred communication style: Simple, everyday language.
Preferred name: Call user "Kris".

## System Architecture
The system is built on a Liferay Commerce-based architecture utilizing headless APIs for all product management functions.

**UI/UX Decisions:**
- **Fragment-based Design:** Employs reusable Liferay fragments for modular and consistent UI development across different brand identities (Sigma, YBS, Johnson Matthey).
- **Branding Integration:** Each fragment collection (Sigma, YBS, JM) incorporates specific brand guidelines, including primary/secondary colors, typography, and messaging, managed via dedicated frontend client extensions.
- **Data Visualization:** Integration of Chart.js for dynamic and interactive data representation (bar charts for sales comparison, line graphs for sales trends).
- **Responsive Design:** Fragments are designed to be mobile-responsive, ensuring accessibility across various devices.
- **Mega Menu Functionality:** Header fragments include sophisticated mega menu dropzones with proper position-based mapping for enhanced navigation.

**Technical Implementations & Feature Specifications:**
- **Product Catalog:** Supports a detailed product portfolio of 25 pharmaceutical products across various therapeutic areas.
- **SKU Management:** Products are configured with multiple SKUs linked to options like pack size, dosage strength, and inhaler doses using reusable option templates.
- **Specification System:** A working system for attaching localized product specifications (e.g., Active Ingredient, Strength, Storage Conditions) to products.
- **Categorization:** Products are categorized using taxonomies for therapeutic areas and product types (e.g., POM, P Medicine).
- **Image Management:** Supports uploading and attaching multiple professional images per product, categorized by priority (Packaging, Product Photo, Medical Consultation).
- **Data Visualization Fragments:**
    - `sigma-bar-chart`: Compares therapeutic category sales with A/B dataset switching (Current vs. Previous Quarter).
    - `sigma-line-graph`: Displays 12-month sales trends with seasonal analysis and insights cards.
    - `sigma-orders-table`: Provides detailed order history with search, sort, pagination, and customer segmentation (Hospital vs. Pharmacy).
- **Automated Builds:** Python scripts are used to automate the creation of deployment-ready ZIP files for fragment collections and client extensions.

**System Design Choices:**
- **Liferay Commerce Headless API Workflow:** A structured three-step process for product creation:
    1. Basic product creation (POST `/products`).
    2. Adding options/SKUs via PATCH to `/products/{id}`.
    3. Attaching specifications via POST to `/products/{id}/productSpecifications`.
- **API Call Sequencing:** Strict adherence to API call order and specific payload structures for product, SKU, specification, category, and image management.
- **Reusable Templates:** Utilizes reusable option templates for consistent product option configuration.
- **Fragment Collection Structure:** Organized directory structure for fragment collections and client extensions, enabling modular development and deployment.

**Product Portfolio Summary (25 Products):**
- **Cardiovascular (6 products)**: Amlodipine, Lisinopril, Atorvastatin, Metoprolol, Aspirin, Nitroglycerin.
- **Pain Relief & Anti-inflammatories (3 products)**: Paracetamol, Ibuprofen, Naproxen.
- **Respiratory (6 products)**: Salbutamol, Beclometasone, Montelukast, Ipratropium, Loratadine, Budesonide.
- **Gastrointestinal (3 products)**: Omeprazole, Loperamide, Domperidone.
- **Dermatological (3 products)**: Hydrocortisone, Clotrimazole, Betamethasone.
- **Antibiotics & Anti-infectives (3 products)**: Amoxicillin, Ciprofloxacin, Azithromycin.
- All products include professional B2B pricing, unique external reference codes, and a set of 3 images.

## External Dependencies
- **Liferay Commerce Platform:**
    - Liferay Commerce Headless APIs (v1.0 for Catalog and Taxonomy)
    - Headless Delivery API (for document/image uploads)
- **API Endpoints Utilized:**
    - `/o/headless-commerce-admin-catalog/v1.0/products`
    - `/o/headless-commerce-admin-catalog/v1.0/products/{id}/productSpecifications`
    - `/o/headless-commerce-admin-catalog/v1.0/products/{id}/categories`
    - `/o/headless-commerce-admin-catalog/v1.0/products/{id}/images`
    - `/o/headless-commerce-admin-catalog/v1.0/specifications`
    - `/o/headless-admin-taxonomy/v1.0/taxonomy-vocabularies/{id}/taxonomy-categories`
    - `/sites/{siteId}/documents` (for image uploads)
- **Authentication:** Basic Auth credentials (configured via environment variables), Site ID: 20123, Catalog ID: 33181.
- **Chart.js:** JavaScript charting library integrated for data visualization fragments.
- **AI Image Generation:** Used for creating professional pharmaceutical product images (75 images total across all products).

## Critical Liferay Platform Constraints

### UTF-8 Encoding Limitation (CRITICAL)
**Issue**: Liferay's MySQL database uses `utf8mb3` charset which does NOT support 4-byte UTF-8 characters (emojis)
**Impact**: Fragment CSS/HTML/JS containing emojis will fail with database error: `Incorrect string value: '\xF0\x9F...' for column 'css'`
**Solution**: Never use emojis in fragment code - use ASCII text only (e.g., `>>` instead of 🎯, `[text]` instead of 🌐)
**Affected**: All fragment collections must be emoji-free for successful deployment

### Thumbnail Requirements
**Minimum Size**: All fragment thumbnail.png files must be at least 70 bytes
**Validation**: Empty (0 byte) thumbnails cause "HTML content must not be empty" upload errors
**Best Practice**: Use actual screenshot thumbnails (100KB+ recommended)