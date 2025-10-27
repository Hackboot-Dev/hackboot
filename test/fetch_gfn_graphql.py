#!/usr/bin/env python3
"""
Script to fetch ALL GeForce NOW games using the GraphQL API
This is the proper way to retrieve the games list with pagination
"""

import requests
import json
import csv
from typing import List, Dict, Generator

# API Configuration
API_URL = "https://api-prod.nvidia.com/services/gfngames/v1/gameList"
HEADERS = {
    "accept": "*/*",
    "content-type": "application/json",
    "origin": "https://www.nvidia.com",
    "referer": "https://www.nvidia.com/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

def fetch_all_games(country: str = "FR", language: str = "fr_FR") -> Generator[Dict, None, None]:
    """
    Fetch all games from GeForce NOW API with pagination

    Args:
        country: Country code (US, FR, etc.)
        language: Language code (en_US, fr_FR, etc.)

    Yields:
        Dict: Game data for each game
    """
    after = ""
    page = 1
    total_fetched = 0

    print("="*70)
    print(f"FETCHING GEFORCE NOW GAMES")
    print("="*70)
    print(f"Country: {country}")
    print(f"Language: {language}\n")

    while True:
        # GraphQL query with all useful fields
        # Note: Use \" inside the query string to avoid GraphQL parsing issues
        query = f'''{{
            apps(country:\"{country}\" language:\"{language}\" orderBy: \"itemMetadata.gfnPopularityRank:ASC,sortName:ASC\" after:\"{after}\") {{
                numberReturned
                pageInfo {{
                    endCursor
                    hasNextPage
                }}
                items {{
                    title
                    sortName
                    id
                    images {{
                        FEATURE_IMAGE
                        TV_BANNER
                        GAME_ICON
                        GAME_LOGO
                        GAME_BOX_ART
                    }}
                    gfn {{
                        playType
                        minimumMembershipTierLabel
                        status
                    }}
                    variants {{
                        appStore
                        publisherName
                        minimumSizeInBytes
                    }}
                }}
            }}
        }}'''

        try:
            # Send GraphQL query as raw body (do NOT encode to utf-8, send as string)
            response = requests.post(
                API_URL,
                data=query,
                headers=HEADERS,
                timeout=60
            )
            response.raise_for_status()

            data = response.json()

            if "data" not in data or "apps" not in data["data"]:
                print(f"✗ Unexpected response structure: {list(data.keys())}")
                break

            apps_data = data["data"]["apps"]
            items = apps_data["items"]
            page_info = apps_data["pageInfo"]

            # Stats for this page
            page_count = len(items)
            total_fetched += page_count

            print(f"Page {page}: Fetched {page_count} games (Total: {total_fetched})")

            # Yield each game
            for item in items:
                yield item

            # Check if there are more pages
            if not page_info["hasNextPage"]:
                print(f"\n✓ Reached last page")
                break

            # Update cursor for next page
            after = page_info["endCursor"]
            page += 1

        except requests.exceptions.RequestException as e:
            print(f"\n✗ Request error on page {page}: {e}")
            break
        except (KeyError, ValueError) as e:
            print(f"\n✗ Data parsing error on page {page}: {e}")
            break

    print(f"\n✓ Total games fetched: {total_fetched}")

def save_to_json(games: List[Dict], filename: str = "gfn_games_full.json"):
    """Save games to JSON file"""
    filepath = f"/workspaces/hackboot/test/{filename}"
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(games, f, indent=2, ensure_ascii=False)
    print(f"✓ Saved {len(games)} games to: {filepath}")

def save_to_csv(games: List[Dict], filename: str = "gfn_games.csv"):
    """Save games to CSV file"""
    filepath = f"/workspaces/hackboot/test/{filename}"

    rows = []
    for game in games:
        # Extract main info
        title = game.get("title", "")
        sort_name = game.get("sortName", "")
        game_id = game.get("id", "")

        # GFN info
        gfn = game.get("gfn", {})
        play_type = gfn.get("playType", "")
        min_tier = gfn.get("minimumMembershipTierLabel", "")
        status = gfn.get("status", "")

        # Stores
        variants = game.get("variants", [])
        stores = ", ".join(v.get("appStore", "") for v in variants if v.get("appStore"))
        publishers = ", ".join(set(v.get("publisherName", "") for v in variants if v.get("publisherName")))

        # Images
        images = game.get("images", {})
        icon = images.get("GAME_ICON", "")
        logo = images.get("GAME_LOGO", "")

        rows.append([
            title, sort_name, game_id, play_type, min_tier, status,
            stores, publishers, icon, logo
        ])

    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "title", "sortName", "id", "playType", "minTier", "status",
            "stores", "publishers", "icon", "logo"
        ])
        writer.writerows(rows)

    print(f"✓ Saved {len(rows)} games to: {filepath}")

def analyze_games(games: List[Dict]):
    """Analyze the games data"""
    print("\n" + "="*70)
    print("ANALYSIS")
    print("="*70 + "\n")

    # Count by store
    stores_count = {}
    tiers_count = {}
    play_types = {}

    for game in games:
        # Count stores
        for variant in game.get("variants", []):
            store = variant.get("appStore", "Unknown")
            stores_count[store] = stores_count.get(store, 0) + 1

        # Count tiers
        tier = game.get("gfn", {}).get("minimumMembershipTierLabel", "Unknown")
        tiers_count[tier] = tiers_count.get(tier, 0) + 1

        # Count play types
        play_type = game.get("gfn", {}).get("playType", "Unknown")
        play_types[play_type] = play_types.get(play_type, 0) + 1

    print(f"Total games: {len(games)}\n")

    print("Games by Store:")
    for store, count in sorted(stores_count.items(), key=lambda x: x[1], reverse=True):
        print(f"  {store}: {count}")

    print("\nGames by Membership Tier:")
    for tier, count in sorted(tiers_count.items(), key=lambda x: x[1], reverse=True):
        print(f"  {tier}: {count}")

    print("\nGames by Play Type:")
    for ptype, count in sorted(play_types.items(), key=lambda x: x[1], reverse=True):
        print(f"  {ptype}: {count}")

    # Sample games
    print("\n" + "="*70)
    print("SAMPLE GAMES (First 10)")
    print("="*70)
    for i, game in enumerate(games[:10], 1):
        print(f"\n{i}. {game.get('title', 'N/A')}")
        print(f"   Sort Name: {game.get('sortName', 'N/A')}")
        print(f"   Play Type: {game.get('gfn', {}).get('playType', 'N/A')}")
        print(f"   Min Tier: {game.get('gfn', {}).get('minimumMembershipTierLabel', 'N/A')}")
        stores = [v.get("appStore", "") for v in game.get("variants", [])]
        print(f"   Stores: {', '.join(stores) if stores else 'N/A'}")

def main():
    """Main execution"""
    print("\n" + "="*70)
    print("GEFORCE NOW GAMES FETCHER - GraphQL Method")
    print("="*70 + "\n")

    # Fetch all games (use US/en_US as it's the most reliable)
    games = list(fetch_all_games(country="US", language="en_US"))

    if not games:
        print("\n✗ No games fetched!")
        return

    # Save to files
    print("\n" + "="*70)
    print("SAVING DATA")
    print("="*70)
    save_to_json(games)
    save_to_csv(games)

    # Analyze
    analyze_games(games)

    print("\n" + "="*70)
    print("COMPLETE")
    print("="*70)
    print("\nFiles created:")
    print("  - test/gfn_games_full.json (complete data with images)")
    print("  - test/gfn_games.csv (simplified CSV)")
    print("\nYou can now integrate these games into your gaming-products.json!")

if __name__ == "__main__":
    main()
