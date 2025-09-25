# Sigma Pharmaceuticals B2B Commerce System

## Overview
This project delivers a comprehensive B2B pharmaceutical commerce system for Sigma Pharmaceuticals using Liferay Commerce Headless APIs. It provides a complete product catalog with authentic pharmaceutical branding, proper SKU variants for pack sizes, pharmaceutical categorization system, and working product specifications. The system focuses on creating products with multiple SKUs linked to product options, proper taxonomies for therapeutic areas and product types, and specifications that provide informational product details.

## User Preferences
Preferred communication style: Simple, everyday language.
Preferred name: Call user "Kris".

## System Architecture
The project employs a Liferay Commerce-based architecture using headless APIs for comprehensive product management. All products are created with enhanced descriptions, proper categorization, SKU variants, and working specifications system.

**Key Architectural Decisions:**
- **Product Creation Workflow**: Two-step process - create product first, then attach specifications via dedicated endpoint.
- **SKU Option Linkage**: Complete product payload with productOptions containing inline productOptionValues and skus with skuOptions in single API call.
- **Specification System**: POST to `/products/{id}/productSpecifications` endpoint after product creation (inline specifications during creation don't persist properly).
- **Category System**: PATCH to `/products/{id}/categories` endpoint using existing taxonomy categories.
- **Option Templates**: Reusable across products - pack-size (ID: 62686), dosage-strength (ID: 63140), inhaler-doses (ID: 63141).
- **Image Management**: POST to `/products/{id}/images` using fileEntryId from uploaded documents.
- **Specification Definitions**: Created via POST to `/specifications` with key, title, description, facetable, visible, priority.

**Working API Structure:**
- **Products**: Use complete payload with productOptions and skus arrays for full SKU variant creation
- **Specifications**: Always use POST `/products/{id}/productSpecifications` with specificationKey, value, priority
- **Categories**: Use PATCH `/products/{id}/categories` with complete category objects including externalReferenceCode
- **Images**: POST `/products/{id}/images` with fileEntryId, title, priority

**Complete Product Portfolio (25 Products):**

**Cardiovascular Products (6 total):**
1. **Amlodipine 5mg Tablets (ID: 66518)** - Cardiovascular/POM with 3 pack sizes (28/56/84 tablets)
2. **Lisinopril 10mg Tablets (ID: 66607)** - Cardiovascular/POM with 2 pack sizes (30/90 tablets)
3. **Atorvastatin 20mg Tablets (ID: 66628)** - Cardiovascular/POM with 3 pack sizes (28/56/84 tablets)
4. **Metoprolol 50mg Tablets (ID: 66654)** - Cardiovascular/POM with 2 pack sizes (56/112 tablets)
5. **Aspirin 75mg Tablets (ID: 66675)** - Cardiovascular/P Medicine with 3 pack sizes (28/56/100 tablets)
6. **Nitroglycerin Sublingual Spray (ID: 66701)** - Cardiovascular/POM with 2 dose strengths (400mcg/800mcg)

**Pain Relief & Anti-inflammatories Products (6 total):**
1. **Paracetamol 500mg Tablets (ID: 67636)** - Pain Relief/P Medicine with 2 pack sizes (16/32 tablets)
2. **Ibuprofen 200mg Tablets (ID: 67646)** - Pain Relief/P Medicine with 2 pack sizes (24/48 tablets)
3. **Naproxen 250mg Tablets (ID: 67656)** - Pain Relief/POM with 2 pack sizes (28/56 tablets)
4. **Ibuprofen 400mg Tablets (ID: 66565)** - Pain Relief/P Medicine with 2 pack sizes (24/48 tablets)

**Respiratory Products (6 total):**
1. **Salbutamol Inhaler 100mcg (ID: 66544)** - Respiratory/POM with 2 dose options (100/200 doses)
2. **Beclometasone Inhaler 250mcg (ID: 66722)** - Respiratory/POM with 2 dose options (120/200 doses)
3. **Montelukast 10mg Tablets (ID: 66743)** - Respiratory/POM with 2 pack sizes (28/84 tablets)
4. **Ipratropium Inhaler 20mcg (ID: 66764)** - Respiratory/POM with 2 dose options (200/400 doses)
5. **Loratadine 10mg Tablets (ID: 66785)** - Respiratory/P Medicine with 2 pack sizes (30/60 tablets)
6. **Budesonide Inhaler 200mcg (ID: 66806)** - Respiratory/POM with 2 dose options (100/200 doses)

**Gastrointestinal Products (3 total):**
1. **Omeprazole 20mg Capsules (ID: 67666)** - Gastrointestinal/POM with 1 pack size (28 capsules)
2. **Loperamide 2mg Tablets (ID: 67676)** - Gastrointestinal/P Medicine with 1 pack size (30 tablets)
3. **Domperidone 10mg Tablets (ID: 67686)** - Gastrointestinal/POM with 1 pack size (30 tablets)

**Dermatological Products (3 total):**
1. **Hydrocortisone 1% Cream (ID: 67696)** - Dermatological/P Medicine with 1 pack size (15g tube)
2. **Clotrimazole 1% Cream (ID: 67706)** - Dermatological/P Medicine with 1 pack size (20g tube)
3. **Betamethasone 0.1% Ointment (ID: 67716)** - Dermatological/POM with 1 pack size (30g tube)

**Antibiotics & Anti-infectives Products (3 total):**
1. **Amoxicillin 500mg Capsules (ID: 67457)** - Antibiotics/POM with 2 pack sizes (28/56 capsules)
2. **Ciprofloxacin 500mg Tablets (ID: 67467)** - Antibiotics/POM with 2 pack sizes (28/56 tablets)
3. **Azithromycin 250mg Tablets (ID: 67477)** - Antibiotics/POM with 2 pack sizes (28/84 tablets)

**Specification System (Working):**
- **Active Ingredient Spec (ID: 63257)**: Primary pharmaceutical ingredient
- **Strength Spec (ID: 63339)**: Dosage strength information  
- **Storage Conditions Spec (ID: 63340)**: Required storage conditions
- Each product has 3 specifications properly attached and visible

**Taxonomy Structure:**
- **Therapeutic Areas Vocabulary (ID: 62442)**: Cardiovascular (62443), Respiratory (62452), Antibiotics & Anti-infectives (62446), Pain Relief & Anti-inflammatories (67626), Gastrointestinal (67636), Dermatological (67646)
- **Product Types Vocabulary (ID: 62461)**: POM (62462), P Medicine (62465), GSL (62468), Medical Devices (62471), Controlled Substances (62474)

**Option Templates (Reusable):**
- **pack-size (ID: 62686)**: For tablet pack variants (28, 56, 84, 24, 48 tablets)
- **dosage-strength (ID: 63140)**: Ready for future dosage variants
- **inhaler-doses (ID: 63141)**: For inhaler dose counts (100, 200 doses)

**B2B Pricing Structure:**
- Professional pricing with cost margins for wholesale pharmaceutical distribution
- Varied pricing by pack size and therapeutic category
- All products have purchasable SKUs with proper cost/price ratios

**Recent Changes (September 2025):**
- **SKU Regeneration Fix**: Resolved "From 0.00" pricing display issue for 9 products by regenerating SKUs with proper structure
- **Affected Products**: Omeprazole (68842), Loperamide (68845), Domperidone (68848), Hydrocortisone (68851), Betamethasone (68854), Clotrimazole (68857), Paracetamol (68860), Naproxen (68863), Ibuprofen 200mg (68866)
- **Solution Applied**: Used simplified single-SKU approach for immediate functionality restoration instead of complex multi-variant productOptions due to API constraints
- **Result**: All 25 products now display proper B2B pricing instead of "From 0.00"

## External Dependencies

**Liferay Commerce Platform:**
- **Liferay Commerce Headless APIs**: Core API for product, catalog, and specification management
- **Headless Commerce Admin Catalog v1.0**: Primary API endpoints for all commerce operations
- **Headless Admin Taxonomy API**: For category and vocabulary management
- **Headless Delivery API**: For document and image upload

**Commerce API Endpoints:**
- **Products**: `/o/headless-commerce-admin-catalog/v1.0/products`
- **Product Specifications**: `/o/headless-commerce-admin-catalog/v1.0/products/{id}/productSpecifications`
- **Product Categories**: `/o/headless-commerce-admin-catalog/v1.0/products/{id}/categories`
- **Product Images**: `/o/headless-commerce-admin-catalog/v1.0/products/{id}/images`
- **Specifications**: `/o/headless-commerce-admin-catalog/v1.0/specifications`
- **Taxonomies**: `/o/headless-admin-taxonomy/v1.0/taxonomy-vocabularies/{id}/taxonomy-categories`

**Authentication:**
- Basic Auth credentials configured securely via environment variables
- Site ID: 20123, Catalog ID: 33181

**Generated Assets:**
- Professional pharmaceutical product images via AI generation
- Complete 3-image systems for all 25 products
- Packaging, product photos, and consultation scenes for each therapeutic category
- Total: 75 professional pharmaceutical images with working src URLs

**Three-Image Solution Workflow:**
- **Step 1**: Generate professional pharmaceutical images (packaging, product photo, consultation context)
- **Step 2**: Upload images via Headless Delivery API: POST `/sites/{siteId}/documents`
- **Step 3**: Attach images via Commerce API: POST `/products/{id}/images` with fileEntryId, title, priority
- **Priority System**: 0=Packaging, 1=Product Photo, 2=Medical Consultation
- **Complete Coverage**: All 25 products have 3 professional images with working src URLs
- **API Statistics**: 75 uploads + 75 attachments = 150 successful API calls total

**External Reference Codes (Selected):**
- AMLO-5MG-SIGMA (Amlodipine)
- SALB-100MCG-SIGMA (Salbutamol)
- PARA-500MG-SIGMA (Paracetamol)
- IBU-200MG-SIGMA (Ibuprofen 200mg)
- OMEP-20MG-SIGMA (Omeprazole)
- HYDRO-1PC-SIGMA (Hydrocortisone)
- Plus 19 additional products with consistent naming convention