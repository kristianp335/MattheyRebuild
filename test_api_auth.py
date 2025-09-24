#!/usr/bin/env python3
"""
Test Liferay Commerce API Authentication
"""

import requests
import base64
import json

# API Configuration
BASE_URL = "https://webserver-lctjmsandbox-prd.lfr.cloud"
API_BASE = f"{BASE_URL}/o/headless-commerce-admin-catalog/v1.0"
USERNAME = "nick@boots.com"
PASSWORD = "Gloria1234!"

# Create authentication header
auth_header = base64.b64encode(f"{USERNAME}:{PASSWORD}".encode()).decode()
HEADERS = {
    "Authorization": f"Basic {auth_header}",
    "Content-Type": "application/json"
}

print("🔍 Testing Liferay Commerce API Authentication")
print(f"🌐 Base URL: {BASE_URL}")
print(f"👤 Username: {USERNAME}")
print(f"🔑 Auth Header: Basic {auth_header}")
print("="*80)

def test_basic_connection():
    """Test basic API connection"""
    print("\n1️⃣ Testing basic connection...")
    try:
        response = requests.get(BASE_URL, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        if response.status_code == 200:
            print("✅ Basic connection successful")
        else:
            print("❌ Basic connection failed")
    except Exception as e:
        print(f"❌ Connection error: {str(e)}")

def test_api_endpoint():
    """Test API endpoint without auth"""
    print("\n2️⃣ Testing API endpoint without auth...")
    try:
        response = requests.get(f"{API_BASE}/products", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        if response.status_code == 401:
            print("✅ Expected 401 - endpoint requires auth")
        elif response.status_code == 200:
            print("❓ Unexpected - no auth required")
        else:
            print(f"❓ Unexpected status: {response.status_code}")
    except Exception as e:
        print(f"❌ API error: {str(e)}")

def test_authentication():
    """Test with Basic Authentication"""
    print("\n3️⃣ Testing with Basic Authentication...")
    try:
        response = requests.get(
            f"{API_BASE}/products",
            headers=HEADERS,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        if response.status_code == 200:
            print("✅ Authentication successful")
            return True
        elif response.status_code == 401:
            print("❌ Authentication failed - 401 Unauthorized")
        else:
            print(f"❓ Unexpected status: {response.status_code}")
        return False
    except Exception as e:
        print(f"❌ Auth test error: {str(e)}")
        return False

def test_catalog_access():
    """Test catalog-specific access"""
    print("\n4️⃣ Testing catalog access...")
    catalog_id = 33181
    try:
        response = requests.get(
            f"{API_BASE}/catalogs/{catalog_id}",
            headers=HEADERS,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        if response.status_code == 200:
            print("✅ Catalog access successful")
            return True
        else:
            print(f"❌ Catalog access failed: {response.status_code}")
        return False
    except Exception as e:
        print(f"❌ Catalog test error: {str(e)}")
        return False

def test_alternative_auth():
    """Test alternative authentication methods"""
    print("\n5️⃣ Testing alternative authentication...")
    
    # Try without Content-Type header
    alt_headers = {"Authorization": f"Basic {auth_header}"}
    try:
        response = requests.get(
            f"{API_BASE}/products",
            headers=alt_headers,
            timeout=10
        )
        print(f"Without Content-Type - Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Alternative auth successful")
            return True
    except Exception as e:
        print(f"Alt auth error: {str(e)}")
    
    return False

if __name__ == "__main__":
    test_basic_connection()
    test_api_endpoint()
    auth_success = test_authentication()
    
    if auth_success:
        test_catalog_access()
    else:
        test_alternative_auth()
    
    print("\n" + "="*80)
    print("📊 AUTHENTICATION DIAGNOSTIC COMPLETE")
    print("="*80)