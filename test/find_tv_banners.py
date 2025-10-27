#!/usr/bin/env python3
"""
Try to find TV_BANNER URLs by testing different patterns
"""

import json
import requests
from urllib.parse import urlparse
import re

def test_tv_banner_patterns(icon_url):
    """
    Given a GAME_ICON URL, try to construct possible TV_BANNER URLs
    """
    # Example:
    # ICON: https://img.nvidiagrid.net/apps/103955842/ZZ/GAME_ICON_01_cbf1f555-4f0a-41a1-829c-ecc60f0ff2c1.png
    # BANNER: https://img.nvidiagrid.net/apps/103955842/ZZ/TV_BANNER_01_8f7b8453-2ee0-4651-aab2-06c359a84a88.jpg

    # Extract app ID
    match = re.search(r'/apps/(\d+)/', icon_url)
    if not match:
        return []

    app_id = match.group(1)
    base_url = f"https://img.nvidiagrid.net/apps/{app_id}/ZZ/"

    # Try different patterns
    patterns = [
        f"{base_url}TV_BANNER_01.jpg",  # Simple pattern without UUID
        # We can't guess the UUID, so we'll try to fetch from the API or scrape
    ]

    return patterns

def check_url_exists(url, timeout=5):
    """Check if URL returns 200"""
    try:
        r = requests.head(url, timeout=timeout, allow_redirects=True)
        return r.status_code == 200
    except:
        return False

def main():
    print("="*80)
    print("FINDING TV_BANNER URLs")
    print("="*80 + "\n")

    # Load community games
    with open('data/gaming-products-community.json', 'r', encoding='utf-8') as f:
        games = json.load(f)

    print(f"Loaded {len(games)} games\n")

    # Test first few games
    print("Testing TV_BANNER patterns...\n")

    results = []

    for i, game in enumerate(games[:10], 1):
        name = game['name']
        icon_url = game['gfnData']['iconUrl']

        print(f"{i}. {name}")
        print(f"   Icon: {icon_url[:70]}...")

        # Extract app ID
        match = re.search(r'/apps/(\d+)/', icon_url)
        if match:
            app_id = match.group(1)
            print(f"   App ID: {app_id}")

            # Try to construct TV_BANNER URL
            # Pattern 1: Same UUID pattern
            icon_parts = icon_url.split('/')
            icon_filename = icon_parts[-1]  # GAME_ICON_01_xxx.png

            # Try replacing GAME_ICON with TV_BANNER
            banner_filename_png = icon_filename.replace('GAME_ICON', 'TV_BANNER')
            banner_filename_jpg = banner_filename_png.replace('.png', '.jpg')

            test_urls = [
                icon_url.replace(icon_filename, banner_filename_jpg),
                icon_url.replace(icon_filename, banner_filename_png),
            ]

            found = False
            for test_url in test_urls:
                print(f"   Testing: {test_url[:70]}...")
                if check_url_exists(test_url):
                    print(f"   ✓ FOUND!")
                    results.append({
                        'game': name,
                        'slug': game['slug'],
                        'tv_banner': test_url
                    })
                    found = True
                    break

            if not found:
                print(f"   ✗ Not found with simple pattern")

        print()

    print("="*80)
    print(f"RESULTS: Found {len(results)} TV_BANNER URLs")
    print("="*80)

    if results:
        for r in results:
            print(f"\n{r['game']}")
            print(f"  {r['tv_banner']}")

        # Save results
        with open('test/tv_banners_found.json', 'w') as f:
            json.dump(results, f, indent=2)
        print(f"\n✓ Saved to: test/tv_banners_found.json")
    else:
        print("\n⚠ No TV_BANNER URLs found with simple URL transformation")
        print("\nThe UUIDs in TV_BANNER URLs are different from GAME_ICON URLs")
        print("We need to:")
        print("  1. Scrape the actual website HTML/JS")
        print("  2. Or use a different API endpoint")
        print("  3. Or manually fetch from GeForce NOW CDN directory listing")

if __name__ == "__main__":
    main()
