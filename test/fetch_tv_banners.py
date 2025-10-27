#!/usr/bin/env python3
"""
Fetch GeForce NOW games with ALL image types including TV_BANNER
"""

import requests
import json

URL = "https://api-prod.nvidia.com/services/gfngames/v1/gameList"
HEADERS = {
    "content-type": "application/json",
    "origin": "https://www.nvidia.com",
    "referer": "https://www.nvidia.com/",
    "user-agent": "Mozilla/5.0"
}

def fetch_page(after="", country="US", language="en_US"):
    """Fetch one page with ALL image types"""
    # Include ALL image types: TV_BANNER, FEATURE_IMAGE, GAME_BOX_ART, GAME_ICON, GAME_LOGO
    query = f'''{{ apps(country:"{country}" language:"{language}" orderBy: "itemMetadata.gfnPopularityRank:ASC,sortName:ASC" after:"{after}") {{ numberReturned pageInfo {{ endCursor hasNextPage }} items {{ title sortName id images {{ TV_BANNER FEATURE_IMAGE GAME_BOX_ART GAME_ICON GAME_LOGO }} gfn {{ playType minimumMembershipTierLabel status }} variants {{ appStore publisherName }} }} }} }}'''

    try:
        r = requests.post(URL, data=query, headers=HEADERS, timeout=60)

        if r.status_code != 200:
            print(f"  ERROR: Status {r.status_code}")
            return None, False, None

        data = r.json()["data"]["apps"]
        return data["items"], data["pageInfo"]["hasNextPage"], data["pageInfo"].get("endCursor", "")
    except Exception as e:
        print(f"  ERROR: {e}")
        return None, False, None

def main():
    print("="*80)
    print("FETCHING GEFORCE NOW GAMES WITH TV_BANNER")
    print("="*80 + "\n")

    all_games = []
    after = ""
    page = 1

    while True:
        print(f"Page {page}...", end=" ")

        games, has_next, cursor = fetch_page(after=after)

        if games is None:
            break

        print(f"✓ {len(games)} games")
        all_games.extend(games)

        if not has_next:
            print("\n✓ Last page reached")
            break

        after = cursor
        page += 1

    print(f"\n{'='*80}")
    print(f"TOTAL: {len(all_games)} games")
    print("="*80 + "\n")

    if not all_games:
        print("✗ No games fetched!")
        return

    # Save with all images
    output_file = "test/gfn_with_tv_banners.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_games, f, indent=2, ensure_ascii=False)

    print(f"✓ Saved to: {output_file}")

    # Check what images we got
    print(f"\n{'='*80}")
    print("IMAGE TYPES ANALYSIS")
    print("="*80 + "\n")

    image_types_count = {
        "TV_BANNER": 0,
        "FEATURE_IMAGE": 0,
        "GAME_BOX_ART": 0,
        "GAME_ICON": 0,
        "GAME_LOGO": 0
    }

    for game in all_games:
        images = game.get("images", {})
        for img_type in image_types_count.keys():
            if images.get(img_type):
                image_types_count[img_type] += 1

    print("Games with each image type:")
    for img_type, count in image_types_count.items():
        pct = (count / len(all_games) * 100) if all_games else 0
        print(f"  {img_type:20s}: {count:5d} ({pct:5.1f}%)")

    # Show sample with TV_BANNER
    print(f"\n{'='*80}")
    print("SAMPLE GAMES WITH TV_BANNER")
    print("="*80 + "\n")

    count = 0
    for game in all_games:
        images = game.get("images", {})
        if images.get("TV_BANNER"):
            count += 1
            print(f"{count}. {game.get('title', 'N/A')}")
            print(f"   TV_BANNER: {images['TV_BANNER'][:80]}...")
            if count >= 5:
                break

    if count == 0:
        print("⚠ No games with TV_BANNER found!")
        print("\nShowing first game images:")
        if all_games:
            first = all_games[0]
            print(f"\nTitle: {first.get('title')}")
            images = first.get("images", {})
            for key, url in images.items():
                print(f"  {key}: {url[:80]}...")

    print(f"\n{'='*80}")
    print("DONE!")
    print("="*80)

if __name__ == "__main__":
    main()
