#!/usr/bin/env python3
"""
Sigma Pharmaceuticals Liferay Fragment Collection and Client Extension Builder
Generates ZIP files for deployment to Liferay DXP
"""

import os
import zipfile
import json
from datetime import datetime

def create_zip_from_directory(source_dir, output_path, exclude_patterns=None):
    """
    Create a ZIP file from a directory with optional exclusions
    """
    if exclude_patterns is None:
        exclude_patterns = ['.DS_Store', '__pycache__', '*.pyc', '.git']
    
    print(f"Creating ZIP: {output_path}")
    print(f"Source directory: {source_dir}")
    
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Remove excluded directories
            dirs[:] = [d for d in dirs if not any(pattern in d for pattern in exclude_patterns)]
            
            for file in files:
                # Skip excluded files
                if any(pattern in file for pattern in exclude_patterns):
                    continue
                    
                file_path = os.path.join(root, file)
                # Get relative path from source directory
                relative_path = os.path.relpath(file_path, source_dir)
                zipf.write(file_path, relative_path)
                print(f"  Added: {relative_path}")
    
    print(f"✓ Created: {output_path}")
    return True

def create_fragment_collection_zip(source_dir, output_path, collection_name):
    """
    Create a fragment collection ZIP with proper Liferay structure (root directory wrapper)
    """
    exclude_patterns = ['.DS_Store', '__pycache__', '*.pyc', '.git']
    
    print(f"Creating ZIP: {output_path}")
    print(f"Source directory: {source_dir}")
    
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Remove excluded directories
            dirs[:] = [d for d in dirs if not any(pattern in d for pattern in exclude_patterns)]
            
            for file in files:
                # Skip excluded files
                if any(pattern in file for pattern in exclude_patterns):
                    continue
                    
                file_path = os.path.join(root, file)
                # Get relative path from source directory
                relative_path = os.path.relpath(file_path, source_dir)
                # Add collection name as root directory in ZIP
                archive_path = f"{collection_name}/{relative_path}"
                zipf.write(file_path, archive_path)
                print(f"  Added: {archive_path}")
    
    print(f"✓ Created: {output_path}")
    return True

def validate_fragment_collection(collection_dir):
    """
    Validate fragment collection structure
    """
    print(f"\nValidating fragment collection: {collection_dir}")
    
    # Check collection.json exists
    collection_json = os.path.join(collection_dir, 'collection.json')
    if not os.path.exists(collection_json):
        print(f"❌ Missing collection.json in {collection_dir}")
        return False
    
    # Load and validate collection.json
    try:
        with open(collection_json, 'r') as f:
            collection_data = json.load(f)
        
        required_fields = ['fragmentCollectionKey', 'name']
        for field in required_fields:
            if field not in collection_data:
                print(f"❌ Missing required field '{field}' in collection.json")
                return False
                
        print(f"✓ Collection: {collection_data['name']}")
        print(f"✓ Key: {collection_data['fragmentCollectionKey']}")
        
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON in collection.json: {e}")
        return False
    
    # Check for fragment directories
    fragment_count = 0
    for item in os.listdir(collection_dir):
        item_path = os.path.join(collection_dir, item)
        if os.path.isdir(item_path) and not item.startswith('.'):
            # Check if it's a fragment directory
            fragment_json = os.path.join(item_path, 'fragment.json')
            if os.path.exists(fragment_json):
                fragment_count += 1
                print(f"✓ Found fragment: {item}")
                
                # Validate fragment structure
                required_files = ['index.html', 'index.css', 'index.js', 'configuration.json']
                for req_file in required_files:
                    file_path = os.path.join(item_path, req_file)
                    if os.path.exists(file_path):
                        print(f"  ✓ {req_file}")
                    else:
                        print(f"  ⚠️ Missing {req_file}")
    
    if fragment_count == 0:
        print(f"❌ No fragments found in {collection_dir}")
        return False
    
    print(f"✓ Found {fragment_count} fragments")
    return True

def validate_client_extension(extension_dir):
    """
    Validate client extension structure
    """
    print(f"\nValidating client extension: {extension_dir}")
    
    # Check client-extension.yaml exists
    yaml_file = os.path.join(extension_dir, 'client-extension.yaml')
    if not os.path.exists(yaml_file):
        print(f"❌ Missing client-extension.yaml in {extension_dir}")
        return False
    
    print(f"✓ Found client-extension.yaml")
    
    # Check assets directory (where source files are stored)
    assets_dir = os.path.join(extension_dir, 'assets')
    if os.path.exists(assets_dir):
        asset_files = os.listdir(assets_dir)
        if asset_files:
            print(f"✓ Found {len(asset_files)} asset files: {asset_files}")
        else:
            print(f"⚠️ Empty assets directory")
    else:
        print(f"⚠️ No assets directory found")
    
    return True

def main():
    """
    Main function to build all Sigma Pharmaceuticals ZIP files
    """
    print("=" * 60)
    print("Sigma Pharmaceuticals Liferay Builder")
    print("=" * 60)
    print(f"Build started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Create output directory
    output_dir = "sigma-builds"
    os.makedirs(output_dir, exist_ok=True)
    
    build_success = True
    
    # 1. Build Fragment Collection
    collection_dir = "fragment-collection/sigma-pharmaceuticals-collection"
    collection_zip = os.path.join(output_dir, "sigma-pharmaceuticals-collection.zip")
    collection_name = "sigma-pharmaceuticals-collection"
    
    if os.path.exists(collection_dir):
        if validate_fragment_collection(collection_dir):
            create_fragment_collection_zip(collection_dir, collection_zip, collection_name)
        else:
            print(f"❌ Fragment collection validation failed")
            build_success = False
    else:
        print(f"❌ Fragment collection directory not found: {collection_dir}")
        build_success = False
    
    # 2. Build Client Extension (combined CSS and JS)
    client_extension_dir = "sigma-frontend-client-extension"
    client_extension_zip = os.path.join(output_dir, "sigma-frontend-client-extension.zip")
    
    if os.path.exists(client_extension_dir):
        if validate_client_extension(client_extension_dir):
            create_zip_from_directory(client_extension_dir, client_extension_zip)
        else:
            print(f"❌ Client extension validation failed")
            build_success = False
    else:
        print(f"❌ Client extension directory not found: {client_extension_dir}")
        build_success = False
    
    # Summary
    print("\n" + "=" * 60)
    print("BUILD SUMMARY")
    print("=" * 60)
    
    if build_success:
        print("✓ All builds completed successfully!")
        print(f"\nGenerated files in '{output_dir}':")
        for file in os.listdir(output_dir):
            if file.endswith('.zip'):
                file_path = os.path.join(output_dir, file)
                size = os.path.getsize(file_path)
                print(f"  • {file} ({size:,} bytes)")
        
        print(f"\nDeployment Instructions:")
        print("1. Upload sigma-pharmaceuticals-collection.zip to Liferay's Fragment Collections")
        print("2. Upload sigma-frontend-client-extension.zip to Liferay's Client Extensions")
        print("3. Configure fragments on your Liferay pages")
        
    else:
        print("❌ Build failed! Please check the errors above.")
    
    print(f"\nBuild completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    return build_success

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)