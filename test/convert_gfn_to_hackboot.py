#!/usr/bin/env python3
"""
Convert GeForce NOW games to Hackboot community games format
Creates a separate JSON file for community games
"""

import json
import re

def slugify(text):
    """Convert game name to slug"""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)  # Remove special chars
    text = re.sub(r'[-\s]+', '-', text)   # Replace spaces/hyphens
    return text.strip('-')

def convert_gfn_to_hackboot(gfn_games, limit=100):
    """
    Convert GFN games to Hackboot community format

    Args:
        gfn_games: List of games from GFN API
        limit: Max number of games to convert (default 100 for testing)

    Returns:
        List of games in Hackboot format
    """
    hackboot_games = []
    processed_slugs = set()

    print(f"Converting up to {limit} games from GeForce NOW format...\n")

    for i, gfn_game in enumerate(gfn_games[:limit], 1):
        title = gfn_game.get("title", "")
        sort_name = gfn_game.get("sortName", "")

        if not title:
            continue

        # Create slug
        slug = f"gaming-{slugify(sort_name or title)}"

        # Avoid duplicates
        if slug in processed_slugs:
            slug = f"{slug}-{i}"
        processed_slugs.add(slug)

        # Get store info
        variants_data = gfn_game.get("variants", [])
        stores = [v.get("appStore", "") for v in variants_data if v.get("appStore")]
        publishers = [v.get("publisherName", "") for v in variants_data if v.get("publisherName")]

        # Get GFN info
        gfn_info = gfn_game.get("gfn", {})
        play_type = gfn_info.get("playType", "")
        min_tier = gfn_info.get("minimumMembershipTierLabel", "")

        # Get images
        images = gfn_game.get("images") or {}
        icon_url = images.get("GAME_ICON") or ""
        logo_url = images.get("GAME_LOGO") or ""

        # Create Hackboot game entry
        game = {
            "id": slug,
            "slug": slug,
            "name": title,
            "game": title,
            "category": "gaming",
            "optimizationLevel": "community",
            "description": f"Cloud gaming for {title}",
            "longDescription": f"GeForce NOW cloud gaming environment for {title}. Standard configuration with community support.",
            "status": "ACTIVE",
            "gfnData": {
                "playType": play_type,
                "minimumTier": min_tier,
                "stores": stores,
                "iconUrl": icon_url,
                "logoUrl": logo_url
            },
            "variants": [
                {
                    "id": "standard",
                    "name": "Standard",
                    "tier": "standard",
                    "gpu": "RTX 3060",
                    "ram": "16 GB",
                    "cpu": "Intel i5-12400",
                    "usage": "Standard cloud configuration",
                    "description": f"VM cloud for {title}",
                    "use_cases": [
                        "Casual gaming",
                        "Practice",
                        "Standard play"
                    ],
                    "features": [
                        "Cloud VM optimized",
                        "Community support",
                        "Regular updates"
                    ],
                    "target_audience": f"{title} players",
                    "highlight": "Community supported",
                    "protection": "Standard",
                    "updates": "Regular",
                    "pricing": {
                        "hourly": 0.50,
                        "monthly": 199
                    },
                    "sla": "99.9%",
                    "support_level": "community",
                    "badges": ["Community", "Standard"],
                    "image": f"/images/products/{slug}/standard/main.png"
                }
            ],
            "reviews": {
                "average": 4.0,
                "count": 0
            },
            "discount": {
                "active": False,
                "percentage": 0,
                "code": ""
            }
        }

        hackboot_games.append(game)

        if i % 20 == 0:
            print(f"  Converted {i}/{limit} games...")

    print(f"\n✓ Converted {len(hackboot_games)} games successfully\n")
    return hackboot_games

def main():
    print("="*70)
    print("GFN TO HACKBOOT CONVERTER")
    print("="*70 + "\n")

    # Load GFN games with images
    print("Loading GeForce NOW games...")
    try:
        with open("test/gfn_with_images.json", "r", encoding="utf-8") as f:
            gfn_games = json.load(f)
        print(f"✓ Loaded {len(gfn_games)} games from GFN (with images)\n")
    except FileNotFoundError:
        print("⚠ gfn_with_images.json not found, trying gfn_result.json...")
        with open("test/gfn_result.json", "r", encoding="utf-8") as f:
            gfn_games = json.load(f)
        print(f"✓ Loaded {len(gfn_games)} games from GFN\n")

    # Convert top 100 most popular games (can increase later)
    hackboot_games = convert_gfn_to_hackboot(gfn_games, limit=100)

    # Save to community games JSON
    output_file = "data/gaming-products-community.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(hackboot_games, f, indent=2, ensure_ascii=False)

    print(f"✓ Saved to: {output_file}")

    # Statistics
    print(f"\n{'='*70}")
    print("STATISTICS")
    print("="*70)

    stores_count = {}
    for game in hackboot_games:
        for store in game["gfnData"]["stores"]:
            stores_count[store] = stores_count.get(store, 0) + 1

    print(f"\nGames by store (top 10):")
    for store, count in sorted(stores_count.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {store}: {count}")

    print(f"\nSample games (first 10):")
    for i, game in enumerate(hackboot_games[:10], 1):
        stores = ", ".join(game["gfnData"]["stores"][:2])
        print(f"  {i:2d}. {game['name']:40s} ({stores})")

    print(f"\n{'='*70}")
    print("COMPLETE!")
    print("="*70)
    print(f"\nCreated: {output_file}")
    print("This file contains the top 100 GFN games as community games.")
    print("\nNext step: Update lib/gaming-products.ts to load from both JSONs")

if __name__ == "__main__":
    main()
