#!/usr/bin/env python3
"""
Clean debugging statements from JavaScript files while preserving syntax
"""

import re
import os

def clean_js_file(file_path):
    """Remove console.log and console.warn statements while preserving console.error"""
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Remove console.log lines
    content = re.sub(r'^\s*console\.log\([^)]*\);\s*\n', '', content, flags=re.MULTILINE)
    
    # Remove console.warn lines  
    content = re.sub(r'^\s*console\.warn\([^)]*\);\s*\n', '', content, flags=re.MULTILINE)
    
    # Remove multi-line console.log statements
    content = re.sub(r'^\s*console\.log\([^;]*?\);\s*\n', '', content, flags=re.MULTILINE | re.DOTALL)
    
    # Remove debug blocks like === DEBUG === 
    content = re.sub(r'^\s*console\.log\(\'===.*?===\'\);\s*\n', '', content, flags=re.MULTILINE)
    
    # Clean up multiple empty lines
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    
    with open(file_path, 'w') as f:
        f.write(content)
    
    print(f"Cleaned {file_path}")

# Clean header file
header_file = 'fragment-collection/johnson-matthey-collection/jm-header/index.js'
clean_js_file(header_file)

# Clean footer file  
footer_file = 'fragment-collection/johnson-matthey-collection/jm-footer/index.js'
clean_js_file(footer_file)

print("JavaScript files cleaned!")