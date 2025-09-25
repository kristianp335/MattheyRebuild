# Liferay Commerce API Guide

## Overview

This guide provides comprehensive documentation for building B2B pharmaceutical commerce systems using Liferay Commerce Headless APIs. It covers complete product creation workflows, SKU management, category systems, and working specifications based on the proven Sigma Pharmaceuticals implementation.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred name: Call user "Kris".

## System Architecture

The project employs a Liferay Commerce-based architecture using headless APIs for comprehensive product management. All products are created with enhanced descriptions, proper categorization, SKU variants, and working specifications system.

### Key Architectural Decisions

- **Product Creation Workflow**: Three-step process - create basic product first, then add options/SKUs via PATCH, then attach specifications via dedicated endpoint.
- **SKU Option Linkage**: PATCH to `/products/{id}` with productOptions and skus arrays AFTER product creation (not in initial POST).
- **Product ID Resolution**: Use product ID from actions.get.href URL (not internal ID) for all subsequent API calls.
- **Specification System**: POST to `/products/{id}/productSpecifications` with localized value maps after product creation.
- **Category System**: PATCH to `/products/{id}/categories` with simplified [{"id": categoryId}] payload structure.
- **Option Templates**: Reusable across products - pack-size (ID: 62686), dosage-strength (ID: 63140), inhaler-doses (ID: 63141).
- **Image Management**: POST to `/products/{id}/images` with localized title maps and fileEntryId from uploaded documents.

### Working API Structure

**Step 1 - Products**: POST `/products` with basic fields (name, description, catalogId, productType, externalReferenceCode)
**Step 2 - Options/SKUs**: PATCH `/products/{id}` with productOptions and skus arrays 
**Step 3 - Specifications**: POST `/products/{id}/productSpecifications` with {"specificationKey": "key", "value": {"en_US": "value"}, "priority": number}
**Step 4 - Categories**: PATCH `/products/{id}/categories` with [{"id": categoryId}, {"id": categoryId}] payload
**Step 5 - Images**: POST `/products/{id}/images` with {"fileEntryId": id, "title": {"en_US": "title"}, "priority": number}

## Complete Product Portfolio Implementation

### Pharmaceutical Product Categories

**Cardiovascular Products (6 total):**
1. **Amlodipine 5mg Tablets (ID: 66518)** - Cardiovascular/POM with 3 pack sizes (28/56/84 tablets)
2. **Lisinopril 10mg Tablets (ID: 66607)** - Cardiovascular/POM with 2 pack sizes (30/90 tablets)
3. **Atorvastatin 20mg Tablets (ID: 66628)** - Cardiovascular/POM with 3 pack sizes (28/56/84 tablets)
4. **Metoprolol 50mg Tablets (ID: 66654)** - Cardiovascular/POM with 2 pack sizes (56/112 tablets)
5. **Aspirin 75mg Tablets (ID: 66675)** - Cardiovascular/P Medicine with 3 pack sizes (28/56/100 tablets)
6. **Nitroglycerin Sublingual Spray (ID: 66701)** - Cardiovascular/POM with 2 dose strengths (400mcg/800mcg)

**Pain Relief & Anti-inflammatories Products (3 total):**
1. **Paracetamol 500mg Tablets (ID: 69267)** - Pain Relief/P Medicine with 2 pack sizes (16/32 tablets)
2. **Ibuprofen 200mg Tablets (ID: 69277)** - Pain Relief/P Medicine with 2 pack sizes (24/48 tablets)
3. **Naproxen 250mg Tablets (ID: 69287)** - Pain Relief/POM with 2 pack sizes (28/56 tablets)

**Respiratory Products (6 total):**
1. **Salbutamol Inhaler 100mcg (ID: 66544)** - Respiratory/POM with 2 dose options (100/200 doses)
2. **Beclometasone Inhaler 250mcg (ID: 66722)** - Respiratory/POM with 2 dose options (120/200 doses)
3. **Montelukast 10mg Tablets (ID: 66743)** - Respiratory/POM with 2 pack sizes (28/84 tablets)
4. **Ipratropium Inhaler 20mcg (ID: 66764)** - Respiratory/POM with 2 dose options (200/400 doses)
5. **Loratadine 10mg Tablets (ID: 66785)** - Respiratory/P Medicine with 2 pack sizes (30/60 tablets)
6. **Budesonide Inhaler 200mcg (ID: 66806)** - Respiratory/POM with 2 dose options (100/200 doses)

**Gastrointestinal Products (3 total):**
1. **Omeprazole 20mg Capsules (ID: 69297)** - Gastrointestinal/POM with 1 pack size (28 capsules)
2. **Loperamide 2mg Tablets (ID: 69307)** - Gastrointestinal/P Medicine with 1 pack size (30 tablets)
3. **Domperidone 10mg Tablets (ID: 69317)** - Gastrointestinal/POM with 1 pack size (30 tablets)

**Dermatological Products (3 total):**
1. **Hydrocortisone 1% Cream (ID: 69327)** - Dermatological/P Medicine with 1 pack size (15g tube)
2. **Clotrimazole 1% Cream (ID: 69337)** - Dermatological/P Medicine with 1 pack size (20g tube)
3. **Betamethasone 0.1% Ointment (ID: 69347)** - Dermatological/POM with 1 pack size (30g tube)

**Antibiotics & Anti-infectives Products (3 total):**
1. **Amoxicillin 500mg Capsules (ID: 67457)** - Antibiotics/POM with 2 pack sizes (28/56 capsules)
2. **Ciprofloxacin 500mg Tablets (ID: 67467)** - Antibiotics/POM with 2 pack sizes (28/56 tablets)
3. **Azithromycin 250mg Tablets (ID: 67477)** - Antibiotics/POM with 2 pack sizes (28/84 tablets)

## Specification System Implementation

**Working Specifications:**
- **Active Ingredient Spec (ID: 66585)**: Primary pharmaceutical ingredient (key: "active-ingredient")
- **Strength Spec (ID: 66409)**: Dosage strength information (key: "strength")
- **Storage Conditions Spec (ID: 66410)**: Required storage conditions (key: "storage-conditions")
- Each product has 3 specifications properly attached using localized value maps

## Taxonomy Structure

**Therapeutic Areas Vocabulary (ID: 62442)**: 
- Cardiovascular (62443)
- Respiratory (62452)
- Antibiotics & Anti-infectives (62446)
- Pain Relief & Anti-inflammatories (62449)
- Gastrointestinal (62455)
- Dermatological (62458)

**Product Types Vocabulary (ID: 62461)**: 
- POM (62462)
- P Medicine (62465)
- GSL (62468)
- Medical Devices (62471)
- Controlled Substances (62474)

## Option Templates (Reusable)

- **pack-size (ID: 62686)**: For tablet pack variants (28, 56, 84, 24, 48 tablets)
- **dosage-strength (ID: 63140)**: Ready for future dosage variants
- **inhaler-doses (ID: 63141)**: For inhaler dose counts (100, 200 doses)

## B2B Pricing Structure

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
- Basic Auth credentials configured securely via environment variables
- Site ID: 20123, Catalog ID: 33181

## Generated Assets

- Professional pharmaceutical product images via AI generation
- Complete 3-image systems for all 25 products
- Packaging, product photos, and consultation scenes for each therapeutic category
- Total: 75 professional pharmaceutical images with working src URLs

## Three-Image Solution Workflow

- **Step 1**: Generate professional pharmaceutical images (packaging, product photo, consultation context)
- **Step 2**: Upload images via Headless Delivery API: POST `/sites/{siteId}/documents`
- **Step 3**: Attach images via Commerce API: POST `/products/{id}/images` with fileEntryId, title, priority
- **Priority System**: 0=Packaging, 1=Product Photo, 2=Medical Consultation
- **Complete Coverage**: All 25 products have 3 professional images with working src URLs
- **API Statistics**: 75 uploads + 75 attachments = 150 successful API calls total

## External Reference Codes (All 25 Products)

**Cardiovascular**: AMLO-5MG-SIGMA, LISIN-10MG-SIGMA, ATOR-20MG-SIGMA, METO-50MG-SIGMA, ASP-75MG-SIGMA, NITRO-SUBLIN-SIGMA
**Respiratory**: SALB-100MCG-SIGMA, BECLO-250MCG-SIGMA, MONTE-10MG-SIGMA, IPRA-20MCG-SIGMA, LORAT-10MG-SIGMA, BUDE-200MCG-SIGMA
**Antibiotics**: AMOXI-500MG-SIGMA, CIPRO-500MG-SIGMA, AZITH-250MG-SIGMA
**Pain Relief**: PARA-500MG-SIGMA, IBU-200MG-SIGMA, NAPX-250MG-SIGMA
**Gastrointestinal**: OMEP-20MG-SIGMA, LOPER-2MG-SIGMA, DOMP-10MG-SIGMA
**Dermatological**: HYDRO-1PC-SIGMA, CLOT-1PC-SIGMA, BETA-01PC-SIGMA