#!/usr/bin/env python3
"""
Scrape GeForce NOW website to get TV_BANNER images
Uses Playwright to render JavaScript and extract data
"""

import json
import re
import time

def scrape_with_requests():
    """Try scraping with requests first (faster)"""
    import requests

    print("="*80)
    print("SCRAPING GEFORCE NOW WEBSITE")
    print("="*80 + "\n")

    url = "https://www.nvidia.com/en-us/geforce-now/games/"

    print(f"Fetching: {url}")

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }

    try:
        r = requests.get(url, headers=headers, timeout=30)
        html = r.text

        print(f"✓ Got {len(html)} bytes of HTML")

        # Look for JSON data in script tags
        print("\nSearching for game data in HTML...")

        # Pattern 1: Look for window.__INITIAL_STATE__ or similar
        patterns = [
            r'window\.__INITIAL_STATE__\s*=\s*({.*?});',
            r'window\.__PRELOADED_STATE__\s*=\s*({.*?});',
            r'var\s+gamesData\s*=\s*(\[.*?\]);',
            r'const\s+games\s*=\s*(\[.*?\]);',
        ]

        for pattern in patterns:
            matches = re.findall(pattern, html, re.DOTALL)
            if matches:
                print(f"  ✓ Found potential data with pattern: {pattern[:30]}...")
                for i, match in enumerate(matches):
                    try:
                        data = json.loads(match)
                        print(f"    Match {i+1}: Valid JSON, {len(str(data))} bytes")

                        # Save it
                        output = f"test/gfn_scraped_{i+1}.json"
                        with open(output, 'w', encoding='utf-8') as f:
                            json.dump(data, f, indent=2, ensure_ascii=False)
                        print(f"    ✓ Saved to: {output}")
                        return data
                    except:
                        pass

        # Pattern 2: Look for image URLs directly
        print("\n  Searching for TV_BANNER URLs directly...")
        tv_banner_urls = re.findall(r'https://img\.nvidiagrid\.net/apps/\d+/ZZ/TV_BANNER[^"\'>\s]+', html)

        if tv_banner_urls:
            print(f"  ✓ Found {len(tv_banner_urls)} TV_BANNER URLs!")
            print("\n  Sample URLs:")
            for url in tv_banner_urls[:5]:
                print(f"    {url}")

            # Save URLs
            output = "test/tv_banner_urls.json"
            with open(output, 'w') as f:
                json.dump(tv_banner_urls, f, indent=2)
            print(f"\n  ✓ Saved to: {output}")
            return tv_banner_urls

        print("\n  ⚠ No game data or TV_BANNER URLs found in HTML")
        print("  The page likely loads data via JavaScript")

        # Save HTML for inspection
        with open('test/gfn_page.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"\n  ✓ Saved HTML to: test/gfn_page.html (for manual inspection)")

        return None

    except Exception as e:
        print(f"✗ Error: {e}")
        return None

def main():
    data = scrape_with_requests()

    if not data:
        print("\n" + "="*80)
        print("REQUESTS METHOD FAILED")
        print("="*80)
        print("\nThe GeForce NOW website loads games via JavaScript.")
        print("We need to use one of these approaches:")
        print("  1. Use Playwright/Selenium to render JavaScript")
        print("  2. Intercept the API calls the website makes")
        print("  3. Use the mobile API endpoint (sometimes less restricted)")
        print("\nFor now, we can:")
        print("  - Check test/gfn_page.html to find the API endpoint")
        print("  - Use browser DevTools Network tab to find API calls")
        return

    print("\n" + "="*80)
    print("SUCCESS")
    print("="*80)

if __name__ == "__main__":
    main()
