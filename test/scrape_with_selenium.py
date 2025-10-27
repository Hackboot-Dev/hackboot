#!/usr/bin/env python3
"""
Script to scrape GeForce NOW games using different methods
Since the API requires POST with specific params, we'll try multiple approaches
"""

import requests
import json
import time

def try_post_request():
    """Try making a POST request to the API"""
    api_url = "https://api-prod.nvidia.com/services/gfngames/v1/gameList"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }

    # Try different payload structures
    payloads = [
        {},  # Empty payload
        {"limit": 1000, "offset": 0},  # Pagination
        {"locale": "en-US"},  # Locale
        {"locale": "en-US", "limit": 1000, "offset": 0},  # Combined
    ]

    print("="*70)
    print("TRYING POST REQUESTS WITH DIFFERENT PAYLOADS")
    print("="*70 + "\n")

    for i, payload in enumerate(payloads, 1):
        print(f"Attempt {i}: {payload}")

        try:
            response = requests.post(api_url, headers=headers, json=payload, timeout=10)
            print(f"  Status: {response.status_code}")

            if response.status_code == 200:
                data = response.json()
                print(f"  ✓ SUCCESS! Got {len(str(data))} bytes")

                # Save it
                output_file = f'/workspaces/hackboot/test/geforce_games_payload_{i}.json'
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)

                print(f"  ✓ Saved to: {output_file}")

                # Analyze structure
                if isinstance(data, dict):
                    print(f"  Keys: {list(data.keys())}")
                elif isinstance(data, list):
                    print(f"  List with {len(data)} items")

                return data

            else:
                print(f"  ✗ Error: {response.text[:100]}")

        except Exception as e:
            print(f"  ✗ Exception: {str(e)[:100]}")

        print()
        time.sleep(0.5)

    return None

def extract_from_html():
    """Extract games from the HTML file we already fetched"""
    print("="*70)
    print("EXTRACTING GAMES FROM HTML")
    print("="*70 + "\n")

    try:
        with open('/workspaces/hackboot/test/geforce_now_raw.html', 'r', encoding='utf-8') as f:
            html = f.read()

        # Look for JSON data in script tags
        import re

        # Pattern to find JSON arrays/objects in script tags
        script_pattern = r'<script[^>]*>(.*?)</script>'
        scripts = re.findall(script_pattern, html, re.DOTALL)

        print(f"Found {len(scripts)} script tags")

        games_data = []

        for i, script in enumerate(scripts):
            # Look for arrays that might contain game data
            if 'game' in script.lower() or 'title' in script.lower():
                # Try to extract JSON arrays
                json_array_pattern = r'\[\s*\{[^}]+\}[^\]]*\]'
                matches = re.findall(json_array_pattern, script)

                for match in matches:
                    try:
                        data = json.loads(match)
                        if isinstance(data, list) and len(data) > 5:
                            print(f"\n✓ Found potential games array in script {i} with {len(data)} items")
                            games_data.append({
                                'script_index': i,
                                'data': data
                            })
                            # Sample
                            print(f"  Sample: {json.dumps(data[0], indent=2)[:200]}")
                    except:
                        pass

        if games_data:
            # Save the best candidate
            best = max(games_data, key=lambda x: len(x['data']))
            output_file = '/workspaces/hackboot/test/games_from_html.json'
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(best['data'], f, indent=2, ensure_ascii=False)

            print(f"\n✓ Saved best candidate ({len(best['data'])} items) to: {output_file}")
            return best['data']
        else:
            print("\n✗ No game arrays found in HTML")

    except Exception as e:
        print(f"✗ Error: {e}")

    return None

def main():
    print("\nGeForce NOW Games Scraper - Multi-Method Approach")
    print("="*70 + "\n")

    # Method 1: Try POST requests
    data = try_post_request()

    # Method 2: Extract from HTML if POST failed
    if not data:
        print("\nPOST requests failed, trying to extract from HTML...\n")
        data = extract_from_html()

    if data:
        print("\n" + "="*70)
        print("SUCCESS - DATA RETRIEVED")
        print("="*70)
        print("\nNow analyzing the structure...")

        # Analyze structure
        if isinstance(data, list) and data:
            print(f"\nGot a list with {len(data)} items")
            print(f"\nFirst item structure:")
            print(json.dumps(data[0], indent=2)[:500])
        elif isinstance(data, dict):
            print(f"\nGot a dict with keys: {list(data.keys())}")

    else:
        print("\n" + "="*70)
        print("ALL METHODS FAILED")
        print("="*70)
        print("\nNext steps:")
        print("1. Use browser DevTools to intercept the actual API call")
        print("2. Check if the page uses WebSocket or other protocols")
        print("3. May need to use Selenium/Playwright to render JS")

if __name__ == "__main__":
    main()
