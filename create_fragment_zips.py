#!/usr/bin/env python3
"""
Create Liferay Fragment Collection ZIP files with proper structure
Based on Liferay Fragment ZIP Structure Requirements
"""

import os
import zipfile
import json
from pathlib import Path

# Fragment names and their metadata
FRAGMENTS = {
    'jm-header': {
        'name': 'JM Header',
        'type': 'section',
        'icon': 'header'
    },
    'jm-hero': {
        'name': 'JM Hero',
        'type': 'section', 
        'icon': 'banner'
    },
    'jm-news-carousel': {
        'name': 'JM News Carousel',
        'type': 'section',
        'icon': 'carousel'
    },
    'jm-share-price': {
        'name': 'JM Share Price',
        'type': 'component',
        'icon': 'analytics'
    },
    'jm-company-overview': {
        'name': 'JM Company Overview',
        'type': 'section',
        'icon': 'info-circle'
    },
    'jm-footer': {
        'name': 'JM Footer',
        'type': 'section',
        'icon': 'footer'
    },
    'jm-card': {
        'name': 'JM Card',
        'type': 'component',
        'icon': 'cards2'
    }
}

def create_thumbnail(fragment_path):
    """Create a thumbnail only if one doesn't exist"""
    thumbnail_path = os.path.join(fragment_path, 'thumbnail.png')
    if os.path.exists(thumbnail_path):
        print(f"✓ Using existing thumbnail: {thumbnail_path}")
        return
        
    # Create placeholder thumbnail only if none exists
    thumbnail_content = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x96\x00\x00\x00\x96\x08\x06\x00\x00\x00\xe0\x98\x86\x8f\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\xc9e<\x00\x00\x03~IDATx\xda\xec\xdd\xcf\x8b\x13A\x14\x07\xf0\xcf\xbb\xbb\xbb\xf7\xde\xfb\xef\xbd\xf7\x9e\xfb\xe6\xcd\x9b7o\xde\xbc\xc9\x9b7o\xde\xbc\xc9\x9b\x07p\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00IEND\xaeB`\x82'
    
    with open(thumbnail_path, 'wb') as f:
        f.write(thumbnail_content)
    print(f"✓ Created placeholder thumbnail: {thumbnail_path}")

def create_fragment_json(fragment_path, fragment_key, fragment_data):
    """Create fragment.json file for a fragment"""
    fragment_json = {
        "fragmentEntryKey": fragment_key,
        "name": fragment_data['name'],
        "type": fragment_data['type'],
        "htmlPath": "index.html",
        "cssPath": "index.css",
        "jsPath": "index.js",
        "configurationPath": "configuration.json",
        "thumbnailPath": "thumbnail.png",
        "icon": fragment_data['icon']
    }
    
    with open(os.path.join(fragment_path, 'fragment.json'), 'w') as f:
        json.dump(fragment_json, f, indent=2)

def rename_fragment_files(fragment_path):
    """Rename fragment files to Liferay naming convention"""
    file_mappings = {
        'main.js': 'index.js',
        'styles.css': 'index.css'
    }
    
    for old_name, new_name in file_mappings.items():
        old_path = os.path.join(fragment_path, old_name)
        new_path = os.path.join(fragment_path, new_name)
        if os.path.exists(old_path):
            os.rename(old_path, new_path)
            print(f"Renamed {old_name} to {new_name} in {fragment_path}")

def prepare_fragments():
    """Prepare all fragments with required files and naming"""
    base_path = "fragment-collection/johnson-matthey-collection"
    
    for fragment_key, fragment_data in FRAGMENTS.items():
        fragment_path = os.path.join(base_path, fragment_key)
        
        if os.path.exists(fragment_path):
            print(f"Processing fragment: {fragment_key}")
            
            # Rename files to Liferay convention
            rename_fragment_files(fragment_path)
            
            # Create fragment.json
            create_fragment_json(fragment_path, fragment_key, fragment_data)
            
            # Create thumbnail.png
            create_thumbnail(fragment_path)
            
            print(f"✓ Fragment {fragment_key} prepared")
        else:
            print(f"⚠ Fragment path not found: {fragment_path}")

def create_individual_fragment_zips():
    """Create individual ZIP files for each fragment"""
    base_path = "fragment-collection/johnson-matthey-collection"
    output_dir = "fragment-zips"
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    for fragment_key in FRAGMENTS.keys():
        fragment_path = os.path.join(base_path, fragment_key)
        
        if os.path.exists(fragment_path):
            zip_filename = os.path.join(output_dir, f"{fragment_key}.zip")
            
            with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
                # Add all files in the fragment directory
                for root, dirs, files in os.walk(fragment_path):
                    for file in files:
                        file_path = os.path.join(root, file)
                        # Create archive path: fragment-name/filename
                        archive_path = os.path.join(fragment_key, os.path.relpath(file_path, fragment_path))
                        zipf.write(file_path, archive_path)
            
            print(f"✓ Created individual ZIP: {zip_filename}")

def create_collection_zip():
    """Create complete fragment collection ZIP with proper structure"""
    collection_name = "johnson-matthey-collection"
    base_path = f"fragment-collection/{collection_name}"
    zip_filename = f"{collection_name}.zip"
    
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Add collection.json at root
        collection_json_path = os.path.join(base_path, "collection.json")
        if os.path.exists(collection_json_path):
            zipf.write(collection_json_path, f"{collection_name}/collection.json")
        
        # Add all fragments
        for fragment_key in FRAGMENTS.keys():
            fragment_path = os.path.join(base_path, fragment_key)
            
            if os.path.exists(fragment_path):
                for root, dirs, files in os.walk(fragment_path):
                    for file in files:
                        file_path = os.path.join(root, file)
                        # Create archive path: collection-name/fragment-name/filename
                        rel_path = os.path.relpath(file_path, base_path)
                        archive_path = f"{collection_name}/{rel_path}"
                        zipf.write(file_path, archive_path)
        
        # Add resources directory if it exists
        resources_path = os.path.join(base_path, "resources")
        if os.path.exists(resources_path):
            for root, dirs, files in os.walk(resources_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    # Create archive path: collection-name/resources/filename
                    rel_path = os.path.relpath(file_path, base_path)
                    archive_path = f"{collection_name}/{rel_path}"
                    zipf.write(file_path, archive_path)
            print("✓ Added resources directory to collection ZIP")
    
    print(f"✓ Created collection ZIP: {zip_filename}")
    return zip_filename

def main():
    """Main function to create all fragment ZIPs"""
    print("🚀 Creating Liferay Fragment Collection ZIPs...")
    print("=" * 50)
    
    # Step 1: Prepare all fragments
    print("\n📁 Preparing fragments...")
    prepare_fragments()
    
    # Step 2: Create individual fragment ZIPs
    print("\n📦 Creating individual fragment ZIPs...")
    create_individual_fragment_zips()
    
    # Step 3: Create complete collection ZIP
    print("\n🗂️ Creating fragment collection ZIP...")
    collection_zip = create_collection_zip()
    
    print("\n" + "=" * 50)
    print("✅ All fragment ZIPs created successfully!")
    print(f"📁 Individual fragments: ./fragment-zips/")
    print(f"📦 Complete collection: ./{collection_zip}")
    print("\n💡 Ready for Liferay deployment:")
    print("   • Individual ZIPs can be imported one by one")
    print("   • Collection ZIP imports all fragments at once")

if __name__ == "__main__":
    main()