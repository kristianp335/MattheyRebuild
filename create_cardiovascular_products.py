#!/usr/bin/env python3
"""
Cardiovascular Product Creation Script for Sigma Pharmaceuticals
Creates 20 comprehensive cardiovascular pharmaceutical products using Liferay Commerce APIs
"""

import requests
import json
import base64
from datetime import datetime

# API Configuration
BASE_URL = "https://webserver-lctjmsandbox-prd.lfr.cloud"
API_BASE = f"{BASE_URL}/o/headless-commerce-admin-catalog/v1.0"
USERNAME = "nick@boots.com"
PASSWORD = "Gloria1234!"
SITE_ID = 20123
CATALOG_ID = 33181

# IDs from existing system
PACK_SIZE_OPTION_TEMPLATE_ID = 62686
CARDIOVASCULAR_CATEGORY_ID = 62443
POM_CATEGORY_ID = 62462
ACTIVE_INGREDIENT_SPEC_ID = 63257
STRENGTH_SPEC_ID = 63339
STORAGE_CONDITIONS_SPEC_ID = 63340

# Create authentication header
auth_header = base64.b64encode(f"{USERNAME}:{PASSWORD}".encode()).decode()
HEADERS = {
    "Authorization": f"Basic {auth_header}",
    "Content-Type": "application/json"
}

# Comprehensive cardiovascular product data
CARDIOVASCULAR_PRODUCTS = [
    {
        "code": "CV007",
        "name": "Ramipril 5mg Tablets",
        "active_ingredient": "Ramipril",
        "strength": "5mg",
        "short_description": "ACE inhibitor for hypertension and heart failure treatment",
        "description": "Ramipril 5mg tablets are an angiotensin-converting enzyme (ACE) inhibitor used to treat high blood pressure and heart failure. Effective in reducing cardiovascular events and kidney problems in diabetic patients. Each tablet contains 5mg of ramipril as the active ingredient.",
        "pack_sizes": [
            {"size": "28 tablets", "cost": 8.50, "price": 12.75},
            {"size": "56 tablets", "cost": 15.20, "price": 22.80},
            {"size": "84 tablets", "cost": 21.50, "price": 32.25}
        ],
        "storage": "Store below 30°C in original container. Protect from moisture."
    },
    {
        "code": "CV008",
        "name": "Warfarin 5mg Tablets",
        "active_ingredient": "Warfarin Sodium",
        "strength": "5mg",
        "short_description": "Anticoagulant for stroke prevention and thrombosis treatment",
        "description": "Warfarin 5mg tablets are an oral anticoagulant used to prevent blood clots in conditions such as atrial fibrillation, deep vein thrombosis, and pulmonary embolism. Requires regular INR monitoring. Each tablet contains 5mg of warfarin sodium.",
        "pack_sizes": [
            {"size": "28 tablets", "cost": 12.80, "price": 19.20},
            {"size": "56 tablets", "cost": 23.60, "price": 35.40},
            {"size": "84 tablets", "cost": 34.20, "price": 51.30}
        ],
        "storage": "Store below 30°C. Protect from light and moisture."
    },
    {
        "code": "CV009",
        "name": "Diltiazem 60mg Capsules",
        "active_ingredient": "Diltiazem Hydrochloride",
        "strength": "60mg",
        "short_description": "Calcium channel blocker for hypertension and angina",
        "description": "Diltiazem 60mg capsules are a calcium channel blocker used to treat high blood pressure and angina. Works by relaxing blood vessels and reducing heart rate. Each capsule contains 60mg of diltiazem hydrochloride in modified-release formulation.",
        "pack_sizes": [
            {"size": "28 capsules", "cost": 16.40, "price": 24.60},
            {"size": "56 capsules", "cost": 31.20, "price": 46.80}
        ],
        "storage": "Store below 25°C in original container. Do not crush or chew."
    },
    {
        "code": "CV010",
        "name": "Nifedipine 10mg Tablets",
        "active_ingredient": "Nifedipine",
        "strength": "10mg",
        "short_description": "Calcium channel blocker for hypertension management",
        "description": "Nifedipine 10mg tablets are a calcium channel blocker used primarily to treat high blood pressure and prevent angina. Provides effective vasodilation and reduces peripheral resistance. Each tablet contains 10mg of nifedipine.",
        "pack_sizes": [
            {"size": "30 tablets", "cost": 9.80, "price": 14.70},
            {"size": "60 tablets", "cost": 18.60, "price": 27.90},
            {"size": "90 tablets", "cost": 26.40, "price": 39.60}
        ],
        "storage": "Store below 30°C. Protect from light and moisture."
    },
    {
        "code": "CV011",
        "name": "Verapamil 80mg Tablets",
        "active_ingredient": "Verapamil Hydrochloride",
        "strength": "80mg",
        "short_description": "Calcium channel blocker for cardiovascular conditions",
        "description": "Verapamil 80mg tablets are a calcium channel blocker used to treat high blood pressure, angina, and certain heart rhythm disorders. Provides cardiac and vascular selectivity. Each tablet contains 80mg of verapamil hydrochloride.",
        "pack_sizes": [
            {"size": "56 tablets", "cost": 22.40, "price": 33.60},
            {"size": "84 tablets", "cost": 32.80, "price": 49.20}
        ],
        "storage": "Store below 30°C in dry conditions."
    },
    {
        "code": "CV012",
        "name": "Propranolol 40mg Tablets",
        "active_ingredient": "Propranolol Hydrochloride",
        "strength": "40mg",
        "short_description": "Beta-blocker for hypertension and cardiac conditions",
        "description": "Propranolol 40mg tablets are a non-selective beta-blocker used to treat high blood pressure, angina, heart rhythm disorders, and migraine prevention. Also used for anxiety management. Each tablet contains 40mg of propranolol hydrochloride.",
        "pack_sizes": [
            {"size": "28 tablets", "cost": 7.20, "price": 10.80},
            {"size": "56 tablets", "cost": 13.60, "price": 20.40},
            {"size": "84 tablets", "cost": 19.20, "price": 28.80}
        ],
        "storage": "Store below 30°C. Protect from light."
    },
    {
        "code": "CV013",
        "name": "Carvedilol 6.25mg Tablets",
        "active_ingredient": "Carvedilol",
        "strength": "6.25mg",
        "short_description": "Beta-blocker with alpha-blocking activity for heart failure",
        "description": "Carvedilol 6.25mg tablets combine beta-blocking and alpha-blocking activity for treatment of heart failure and hypertension. Provides cardioprotective benefits and reduces mortality in heart failure patients. Each tablet contains 6.25mg carvedilol.",
        "pack_sizes": [
            {"size": "28 tablets", "cost": 18.90, "price": 28.35},
            {"size": "56 tablets", "cost": 36.40, "price": 54.60}
        ],
        "storage": "Store below 30°C in original container."
    },
    {
        "code": "CV014",
        "name": "Candesartan 8mg Tablets",
        "active_ingredient": "Candesartan Cilexetil",
        "strength": "8mg",
        "short_description": "ARB for hypertension and heart failure treatment",
        "description": "Candesartan 8mg tablets are an angiotensin receptor blocker (ARB) used to treat high blood pressure and heart failure. Provides effective blood pressure control with good tolerability profile. Each tablet contains 8mg candesartan cilexetil.",
        "pack_sizes": [
            {"size": "28 tablets", "cost": 24.60, "price": 36.90},
            {"size": "56 tablets", "cost": 47.20, "price": 70.80},
            {"size": "84 tablets", "cost": 68.40, "price": 102.60}
        ],
        "storage": "Store below 30°C. Keep in original package."
    },
    {
        "code": "CV015",
        "name": "Losartan 50mg Tablets",
        "active_ingredient": "Losartan Potassium",
        "strength": "50mg",
        "short_description": "ARB for hypertension and diabetic nephropathy",
        "description": "Losartan 50mg tablets are an angiotensin receptor blocker used to treat high blood pressure and protect kidneys in diabetic patients. First ARB with proven cardiovascular outcomes. Each tablet contains 50mg losartan potassium.",
        "pack_sizes": [
            {"size": "28 tablets", "cost": 16.80, "price": 25.20},
            {"size": "56 tablets", "cost": 32.40, "price": 48.60},
            {"size": "84 tablets", "cost": 46.80, "price": 70.20}
        ],
        "storage": "Store below 30°C in dry place."
    },
    {
        "code": "CV016",
        "name": "Valsartan 80mg Tablets",
        "active_ingredient": "Valsartan",
        "strength": "80mg",
        "short_description": "ARB for hypertension and post-MI heart failure",
        "description": "Valsartan 80mg tablets are an angiotensin receptor blocker used for hypertension treatment and post-myocardial infarction heart failure management. Provides cardiovascular protection with excellent tolerability. Each tablet contains 80mg valsartan.",
        "pack_sizes": [
            {"size": "28 tablets", "cost": 21.40, "price": 32.10},
            {"size": "56 tablets", "cost": 41.20, "price": 61.80},
            {"size": "84 tablets", "cost": 59.60, "price": 89.40}
        ],
        "storage": "Store below 30°C. Protect from moisture."
    },
    {
        "code": "CV017",
        "name": "Irbesartan 150mg Tablets",
        "active_ingredient": "Irbesartan",
        "strength": "150mg",
        "short_description": "ARB for hypertension and diabetic nephropathy protection",
        "description": "Irbesartan 150mg tablets are an angiotensin receptor blocker with proven renal protective effects in type 2 diabetic patients. Effective for hypertension management with once-daily dosing. Each tablet contains 150mg irbesartan.",
        "pack_sizes": [
            {"size": "28 tablets", "cost": 19.60, "price": 29.40},
            {"size": "56 tablets", "cost": 37.80, "price": 56.70}
        ],
        "storage": "Store below 30°C in original container."
    },
    {
        "code": "CV018",
        "name": "Telmisartan 40mg Tablets",
        "active_ingredient": "Telmisartan",
        "strength": "40mg",
        "short_description": "ARB with long half-life for 24-hour BP control",
        "description": "Telmisartan 40mg tablets are a long-acting angiotensin receptor blocker providing 24-hour blood pressure control. Also has PPAR-gamma activity with potential metabolic benefits. Each tablet contains 40mg telmisartan.",
        "pack_sizes": [
            {"size": "28 tablets", "cost": 26.80, "price": 40.20},
            {"size": "56 tablets", "cost": 51.60, "price": 77.40},
            {"size": "84 tablets", "cost": 74.80, "price": 112.20}
        ],
        "storage": "Store below 30°C. Do not remove from blister until use."
    },
    {
        "code": "CV019",
        "name": "Olmesartan 20mg Tablets",
        "active_ingredient": "Olmesartan Medoxomil",
        "strength": "20mg",
        "short_description": "ARB for effective hypertension management",
        "description": "Olmesartan 20mg tablets are an angiotensin receptor blocker providing potent and sustained blood pressure reduction. Offers excellent cardiovascular protection with good tolerability profile. Each tablet contains 20mg olmesartan medoxomil.",
        "pack_sizes": [
            {"size": "28 tablets", "cost": 23.40, "price": 35.10},
            {"size": "56 tablets", "cost": 45.20, "price": 67.80}
        ],
        "storage": "Store below 30°C. Protect from light and moisture."
    },
    {
        "code": "CV020",
        "name": "Perindopril 4mg Tablets",
        "active_ingredient": "Perindopril Arginine",
        "strength": "4mg",
        "short_description": "ACE inhibitor for cardiovascular risk reduction",
        "description": "Perindopril 4mg tablets are an ACE inhibitor with proven cardiovascular outcomes in high-risk patients. Effective for hypertension and stable coronary artery disease. Each tablet contains 4mg perindopril arginine equivalent to 5mg perindopril tert-butylamine.",
        "pack_sizes": [
            {"size": "30 tablets", "cost": 14.80, "price": 22.20},
            {"size": "60 tablets", "cost": 28.40, "price": 42.60},
            {"size": "90 tablets", "cost": 41.20, "price": 61.80}
        ],
        "storage": "Store below 30°C in dry conditions."
    },
    {
        "code": "CV021",
        "name": "Enalapril 10mg Tablets",
        "active_ingredient": "Enalapril Maleate",
        "strength": "10mg",
        "short_description": "ACE inhibitor for hypertension and heart failure",
        "description": "Enalapril 10mg tablets are an established ACE inhibitor for treating hypertension and heart failure. One of the first ACE inhibitors with proven mortality benefits in heart failure. Each tablet contains 10mg enalapril maleate.",
        "pack_sizes": [
            {"size": "28 tablets", "cost": 6.40, "price": 9.60},
            {"size": "56 tablets", "cost": 12.20, "price": 18.30},
            {"size": "84 tablets", "cost": 17.60, "price": 26.40}
        ],
        "storage": "Store below 30°C. Protect from moisture."
    },
    {
        "code": "CV022",
        "name": "Captopril 25mg Tablets",
        "active_ingredient": "Captopril",
        "strength": "25mg",
        "short_description": "First ACE inhibitor for hypertension and heart failure",
        "description": "Captopril 25mg tablets are the first ACE inhibitor developed, used for treating hypertension and heart failure. Requires more frequent dosing but remains effective for specific patient populations. Each tablet contains 25mg captopril.",
        "pack_sizes": [
            {"size": "56 tablets", "cost": 8.60, "price": 12.90},
            {"size": "84 tablets", "cost": 12.40, "price": 18.60}
        ],
        "storage": "Store below 30°C. Protect from light and moisture."
    },
    {
        "code": "CV023",
        "name": "Furosemide 40mg Tablets",
        "active_ingredient": "Furosemide",
        "strength": "40mg",
        "short_description": "Loop diuretic for heart failure and edema treatment",
        "description": "Furosemide 40mg tablets are a potent loop diuretic used to treat fluid retention in heart failure, kidney disease, and liver disease. Provides rapid and effective diuresis. Each tablet contains 40mg furosemide.",
        "pack_sizes": [
            {"size": "28 tablets", "cost": 4.80, "price": 7.20},
            {"size": "56 tablets", "cost": 9.20, "price": 13.80},
            {"size": "84 tablets", "cost": 13.20, "price": 19.80}
        ],
        "storage": "Store below 30°C. Protect from light."
    },
    {
        "code": "CV024",
        "name": "Hydrochlorothiazide 25mg Tablets",
        "active_ingredient": "Hydrochlorothiazide",
        "strength": "25mg",
        "short_description": "Thiazide diuretic for hypertension treatment",
        "description": "Hydrochlorothiazide 25mg tablets are a thiazide diuretic commonly used as first-line treatment for hypertension. Often combined with other antihypertensive agents. Each tablet contains 25mg hydrochlorothiazide.",
        "pack_sizes": [
            {"size": "28 tablets", "cost": 3.60, "price": 5.40},
            {"size": "56 tablets", "cost": 6.80, "price": 10.20},
            {"size": "84 tablets", "cost": 9.60, "price": 14.40}
        ],
        "storage": "Store below 30°C in dry place."
    },
    {
        "code": "CV025",
        "name": "Indapamide 2.5mg Tablets",
        "active_ingredient": "Indapamide",
        "strength": "2.5mg",
        "short_description": "Thiazide-like diuretic with cardiovascular benefits",
        "description": "Indapamide 2.5mg tablets are a thiazide-like diuretic with proven cardiovascular outcome benefits beyond blood pressure reduction. Preferred diuretic in many hypertension guidelines. Each tablet contains 2.5mg indapamide.",
        "pack_sizes": [
            {"size": "30 tablets", "cost": 8.40, "price": 12.60},
            {"size": "60 tablets", "cost": 16.20, "price": 24.30}
        ],
        "storage": "Store below 30°C. Protect from moisture."
    },
    {
        "code": "CV026",
        "name": "Bendroflumethiazide 2.5mg Tablets",
        "active_ingredient": "Bendroflumethiazide",
        "strength": "2.5mg",
        "short_description": "Thiazide diuretic for hypertension management",
        "description": "Bendroflumethiazide 2.5mg tablets are a thiazide diuretic used for hypertension treatment and as adjunctive therapy in heart failure. Provides reliable blood pressure reduction with once-daily dosing. Each tablet contains 2.5mg bendroflumethiazide.",
        "pack_sizes": [
            {"size": "28 tablets", "cost": 5.20, "price": 7.80},
            {"size": "56 tablets", "cost": 9.80, "price": 14.70}
        ],
        "storage": "Store below 25°C in dry conditions."
    }
]

def create_product_payload(product_data):
    """Create complete product payload with productOptions and SKUs"""
    
    # Generate product option values for pack sizes
    product_option_values = []
    for i, pack in enumerate(product_data["pack_sizes"]):
        product_option_values.append({
            "key": f"pack-{product_data['code'].lower()}-{i+1}",
            "name": {"en_US": pack["size"]},
            "priority": i
        })
    
    # Generate SKUs with corresponding options
    skus = []
    for i, pack in enumerate(product_data["pack_sizes"]):
        external_ref = f"{product_data['code']}-{pack['size'].replace(' ', '-').upper()}"
        skus.append({
            "cost": pack["cost"],
            "price": pack["price"],
            "externalReferenceCode": external_ref,
            "published": True,
            "purchasable": True,
            "sku": external_ref,
            "skuOptions": [
                {
                    "key": f"pack-{product_data['code'].lower()}-{i+1}",
                    "value": {"en_US": pack["size"]}
                }
            ]
        })
    
    payload = {
        "catalogId": CATALOG_ID,
        "name": {"en_US": product_data["name"]},
        "shortDescription": {"en_US": product_data["short_description"]},
        "description": {"en_US": product_data["description"]},
        "externalReferenceCode": f"DRUG-STRENGTH-{product_data['code']}",
        "productType": "simple",
        "active": True,
        "published": True,
        "productOptions": [
            {
                "optionId": PACK_SIZE_OPTION_TEMPLATE_ID,
                "productOptionValues": product_option_values
            }
        ],
        "skus": skus
    }
    
    return payload

def create_product(product_data):
    """Create a single product with complete payload"""
    print(f"\n🏭 Creating product: {product_data['name']}")
    
    payload = create_product_payload(product_data)
    
    try:
        response = requests.post(
            f"{API_BASE}/products",
            headers=HEADERS,
            json=payload,
            params={"nestedFields": "skus,productOptions"}
        )
        
        if response.status_code in [200, 201]:
            product = response.json()
            print(f"✅ Created product ID: {product['id']} - {product_data['name']}")
            return product
        else:
            print(f"❌ Failed to create product: {response.status_code}")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Exception creating product: {str(e)}")
        return None

def add_product_specifications(product_id, product_data):
    """Add specifications to a product"""
    print(f"📋 Adding specifications for product ID: {product_id}")
    
    specifications = [
        {
            "specificationKey": "active-ingredient",
            "value": {"en_US": product_data["active_ingredient"]},
            "priority": 0
        },
        {
            "specificationKey": "strength", 
            "value": {"en_US": product_data["strength"]},
            "priority": 1
        },
        {
            "specificationKey": "storage-conditions",
            "value": {"en_US": product_data["storage"]},
            "priority": 2
        }
    ]
    
    success_count = 0
    for spec in specifications:
        try:
            response = requests.post(
                f"{API_BASE}/products/{product_id}/productSpecifications",
                headers=HEADERS,
                json=spec
            )
            
            if response.status_code in [200, 201]:
                success_count += 1
                print(f"  ✅ Added {spec['specificationKey']}: {spec['value']['en_US']}")
            else:
                print(f"  ❌ Failed to add {spec['specificationKey']}: {response.status_code}")
                
        except Exception as e:
            print(f"  ❌ Exception adding {spec['specificationKey']}: {str(e)}")
    
    return success_count == len(specifications)

def add_product_categories(product_id, product_name):
    """Add categories to a product"""
    print(f"🏷️ Adding categories for product ID: {product_id}")
    
    categories = [
        {
            "id": CARDIOVASCULAR_CATEGORY_ID,
            "externalReferenceCode": "cardiovascular",
            "name": {"en_US": "Cardiovascular"}
        },
        {
            "id": POM_CATEGORY_ID, 
            "externalReferenceCode": "pom",
            "name": {"en_US": "POM"}
        }
    ]
    
    try:
        response = requests.patch(
            f"{API_BASE}/products/{product_id}/categories",
            headers=HEADERS,
            json=categories
        )
        
        if response.status_code in [200, 201]:
            print(f"  ✅ Added Cardiovascular and POM categories")
            return True
        else:
            print(f"  ❌ Failed to add categories: {response.status_code}")
            print(f"  Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"  ❌ Exception adding categories: {str(e)}")
        return False

def create_cardiovascular_products():
    """Create all cardiovascular products with specifications and categories"""
    print("🚀 Starting Cardiovascular Product Creation for Sigma Pharmaceuticals")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 Target: {BASE_URL}")
    print(f"📊 Catalog ID: {CATALOG_ID}")
    print(f"🏢 Site ID: {SITE_ID}")
    print("="*80)
    
    created_products = []
    failed_products = []
    
    for i, product_data in enumerate(CARDIOVASCULAR_PRODUCTS, 1):
        print(f"\n[{i}/20] Processing {product_data['code']}: {product_data['name']}")
        
        # Create product
        product = create_product(product_data)
        if not product:
            failed_products.append(product_data['name'])
            continue
            
        # Add specifications
        specs_success = add_product_specifications(product['id'], product_data)
        
        # Add categories
        categories_success = add_product_categories(product['id'], product_data['name'])
        
        if product and specs_success and categories_success:
            created_products.append({
                'id': product['id'],
                'name': product_data['name'],
                'code': product_data['code'],
                'sku_count': len(product_data['pack_sizes'])
            })
            print(f"🎉 Successfully completed {product_data['name']}")
        else:
            print(f"⚠️ Partial success for {product_data['name']}")
    
    # Final summary
    print("\n" + "="*80)
    print("📊 CARDIOVASCULAR PRODUCT CREATION SUMMARY")
    print("="*80)
    print(f"✅ Successfully created: {len(created_products)}/20 products")
    print(f"❌ Failed: {len(failed_products)} products")
    
    if created_products:
        print(f"\n🎯 CREATED PRODUCTS:")
        for product in created_products:
            print(f"  • {product['code']}: {product['name']} (ID: {product['id']}) - {product['sku_count']} SKUs")
    
    if failed_products:
        print(f"\n❌ FAILED PRODUCTS:")
        for product_name in failed_products:
            print(f"  • {product_name}")
    
    print(f"\n📅 Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    return created_products, failed_products

if __name__ == "__main__":
    created, failed = create_cardiovascular_products()