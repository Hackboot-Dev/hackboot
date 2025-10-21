#!/usr/bin/env python3
"""
Script to analyze GeForce NOW games page structure
and understand how to scrape the games list
"""

import requests
from bs4 import BeautifulSoup
import json
import re

def fetch_page():
    """Fetch the GeForce NOW games page"""
    url = "https://www.nvidia.com/en-us/geforce-now/games/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    print("Fetching GeForce NOW games page...")
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        print(f"✓ Page fetched successfully (Status: {response.status_code})")
        return response.text
    else:
        print(f"✗ Failed to fetch page (Status: {response.status_code})")
        return None

def analyze_html_structure(html):
    """Analyze the HTML structure to understand the page layout"""
    soup = BeautifulSoup(html, 'html.parser')

    print("\n" + "="*60)
    print("ANALYZING HTML STRUCTURE")
    print("="*60)

    # Look for common game list containers
    print("\n1. Looking for game list containers...")
    game_containers = [
        soup.find_all('div', class_=re.compile(r'game', re.I)),
        soup.find_all('li', class_=re.compile(r'game', re.I)),
        soup.find_all('article', class_=re.compile(r'game', re.I)),
    ]

    for i, containers in enumerate(game_containers):
        if containers:
            print(f"   Found {len(containers)} elements with 'game' in class")
            if containers:
                print(f"   Sample classes: {containers[0].get('class', [])}")

    # Look for JSON data in script tags
    print("\n2. Looking for JSON data in <script> tags...")
    scripts = soup.find_all('script')
    json_data_found = []

    for script in scripts:
        if script.string:
            # Look for JSON patterns
            if 'games' in script.string.lower() or 'data' in script.string.lower():
                # Try to find JSON objects
                json_matches = re.findall(r'\{[^{}]*"[^"]*"[^{}]*:[^{}]*\}', script.string)
                if json_matches:
                    json_data_found.append({
                        'type': script.get('type', 'text/javascript'),
                        'sample': json_matches[0][:200] + '...' if len(json_matches[0]) > 200 else json_matches[0]
                    })

    if json_data_found:
        print(f"   Found {len(json_data_found)} script tags with potential JSON data")
        for i, data in enumerate(json_data_found[:3]):  # Show first 3
            print(f"   Sample {i+1}: {data['sample']}")
    else:
        print("   No obvious JSON data found in script tags")

    # Look for data attributes
    print("\n3. Looking for data-* attributes...")
    elements_with_data = soup.find_all(attrs=lambda x: x and any(k.startswith('data-') for k in x.keys()))
    if elements_with_data:
        print(f"   Found {len(elements_with_data)} elements with data-* attributes")
        # Sample first few
        for elem in elements_with_data[:5]:
            data_attrs = {k: v for k, v in elem.attrs.items() if k.startswith('data-')}
            if data_attrs:
                print(f"   Sample: {list(data_attrs.keys())}")

    # Look for API endpoints in the HTML/JS
    print("\n4. Looking for potential API endpoints...")
    api_patterns = [
        r'https?://[^"\s]+/api/[^"\s]+',
        r'https?://[^"\s]+\.json',
        r'/api/[^"\s]+',
    ]

    endpoints_found = set()
    full_text = str(soup)
    for pattern in api_patterns:
        matches = re.findall(pattern, full_text)
        endpoints_found.update(matches)

    if endpoints_found:
        print(f"   Found {len(endpoints_found)} potential API endpoints:")
        for endpoint in list(endpoints_found)[:10]:  # Show first 10
            print(f"   - {endpoint}")
    else:
        print("   No obvious API endpoints found")

    return soup

def check_network_calls():
    """Check for common API patterns used by GeForce NOW"""
    print("\n" + "="*60)
    print("CHECKING COMMON API PATTERNS")
    print("="*60)

    base_urls = [
        "https://www.nvidia.com/api/geforce-now/games",
        "https://api.nvidia.com/geforce-now/games",
        "https://www.nvidia.com/content/geforce-now/games.json",
    ]

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }

    for url in base_urls:
        try:
            response = requests.head(url, headers=headers, timeout=5)
            print(f"✓ {url} - Status: {response.status_code}")
        except Exception as e:
            print(f"✗ {url} - Error: {str(e)[:50]}")

def main():
    print("GeForce NOW Games Page Analyzer")
    print("="*60)

    # Fetch the page
    html = fetch_page()

    if html:
        # Save raw HTML for inspection
        with open('/workspaces/hackboot/test/geforce_now_raw.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("✓ Raw HTML saved to: test/geforce_now_raw.html")

        # Analyze structure
        soup = analyze_html_structure(html)

        # Check for API endpoints
        check_network_calls()

        print("\n" + "="*60)
        print("ANALYSIS COMPLETE")
        print("="*60)
        print("\nNext steps:")
        print("1. Inspect test/geforce_now_raw.html manually")
        print("2. Look at browser DevTools Network tab for actual API calls")
        print("3. Check if the page uses client-side rendering (React/Vue)")
    else:
        print("✗ Failed to fetch page, cannot proceed with analysis")

if __name__ == "__main__":
    main()
