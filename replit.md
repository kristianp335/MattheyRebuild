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

**Complete Product Portfolio (16 Products):**

**Cardiovascular Products (6 total):**
1. **Amlodipine 5mg Tablets (ID: 66518)** - Cardiovascular/POM with 3 pack sizes (28/56/84 tablets)
2. **Lisinopril 10mg Tablets (ID: 66607)** - Cardiovascular/POM with 2 pack sizes (30/90 tablets)
3. **Atorvastatin 20mg Tablets (ID: 66628)** - Cardiovascular/POM with 3 pack sizes (28/56/84 tablets)
4. **Metoprolol 50mg Tablets (ID: 66654)** - Cardiovascular/POM with 2 pack sizes (56/112 tablets)
5. **Aspirin 75mg Tablets (ID: 66675)** - Cardiovascular/P Medicine with 3 pack sizes (28/56/100 tablets)
6. **Nitroglycerin Sublingual Spray (ID: 66701)** - Cardiovascular/POM with 2 dose strengths (400mcg/800mcg)

**Respiratory Products (7 total):**
1. **Salbutamol Inhaler 100mcg (ID: 66544)** - Respiratory/POM with 2 dose options (100/200 doses)
2. **Ibuprofen 400mg Tablets (ID: 66565)** - P Medicine with 2 pack sizes (24/48 tablets)
3. **Beclometasone Inhaler 250mcg (ID: 66722)** - Respiratory/POM with 2 dose options (120/200 doses)
4. **Montelukast 10mg Tablets (ID: 66743)** - Respiratory/POM with 2 pack sizes (28/84 tablets)
5. **Ipratropium Inhaler 20mcg (ID: 66764)** - Respiratory/POM with 2 dose options (200/400 doses)
6. **Loratadine 10mg Tablets (ID: 66785)** - Respiratory/P Medicine with 2 pack sizes (30/60 tablets)
7. **Budesonide Inhaler 200mcg (ID: 66806)** - Respiratory/POM with 2 dose options (100/200 doses)

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
- **Therapeutic Areas Vocabulary (ID: 62442)**: Cardiovascular (62443), Respiratory (62452), Antibiotics & Anti-infectives (62446)
- **Product Types Vocabulary (ID: 62461)**: POM (62462), P Medicine (62465), GSL (62468), Medical Devices (62471), Controlled Substances (62474)

**Option Templates (Reusable):**
- **pack-size (ID: 62686)**: For tablet pack variants (28, 56, 84, 24, 48 tablets)
- **dosage-strength (ID: 63140)**: Ready for future dosage variants
- **inhaler-doses (ID: 63141)**: For inhaler dose counts (100, 200 doses)

**B2B Pricing Structure:**
- Professional pricing with cost margins for wholesale pharmaceutical distribution
- Varied pricing by pack size and therapeutic category
- All products have purchasable SKUs with proper cost/price ratios

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
- Basic Auth with nick@boots.com:Gloria1234! for API access
- Site ID: 20123, Catalog ID: 33181

**Generated Assets:**
- Professional pharmaceutical product images via AI generation
- Amlodipine packaging, prescription bottle, tablet images
- Salbutamol inhaler product photo
- Ibuprofen tablets product photo

**Three-Image Solution Workflow:**
- **Step 1**: Generate professional pharmaceutical images (packaging, product photo, consultation context)
- **Step 2**: Upload images via Headless Delivery API: POST `/sites/{siteId}/documents`
- **Step 3**: Attach images via Commerce API: POST `/products/{id}/images` with fileEntryId, title, priority
- **Priority System**: 0=Packaging, 1=Product Photo, 2=Medical Consultation
- **Complete Coverage**: All 13 products have 3 professional images with working src URLs
- **API Statistics**: 36 uploads + 36 attachments = 72 successful API calls total

**External Reference Codes:**
- AMLO-5MG-SIGMA (Amlodipine)
- SALB-100MCG-SIGMA (Salbutamol) 
- IBU-400MG-SIGMA (Ibuprofen)