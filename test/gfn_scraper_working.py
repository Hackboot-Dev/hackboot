#!/usr/bin/env python3
"""
GeForce NOW Games Scraper - WORKING VERSION
Successfully fetches ALL games from GeForce NOW using GraphQL API
"""

import requests
import json
import csv

URL = "https://api-prod.nvidia.com/services/gfngames/v1/gameList"
HEADERS = {
    "content-type": "application/json",
    "origin": "https://www.nvidia.com",
    "referer": "https://www.nvidia.com/",
    "user-agent": "Mozilla/5.0"
}

def fetch_page(after="", country="US", language="en_US"):
    """Fetch one page of games"""
    query = f'{{ apps(country:"{country}" language:"{language}" orderBy: "itemMetadata.gfnPopularityRank:ASC,sortName:ASC" after:"{after}") {{ numberReturned pageInfo {{ endCursor hasNextPage }} items {{ title sortName id images {{ GAME_ICON GAME_LOGO }} gfn {{ playType minimumMembershipTierLabel status }} variants {{ appStore publisherName }} }} }} }}'

    r = requests.post(URL, data=query, headers=HEADERS, timeout=60)

    if r.status_code != 200:
        return None, False, None

    data = r.json()["data"]["apps"]
    return data["items"], data["pageInfo"]["hasNextPage"], data["pageInfo"].get("endCursor", "")

def main():
    print("="*70)
    print("GEFORCE NOW GAMES SCRAPER")
    print("="*70 + "\n")

    all_games = []
    after = ""
    page = 1

    while True:
        print(f"Fetching page {page}...", end=" ")

        games, has_next, cursor = fetch_page(after=after)

        if games is None:
            print("ERROR!")
            break

        print(f"✓ Got {len(games)} games")
        all_games.extend(games)

        if not has_next:
            print("\n✓ Reached last page")
            break

        after = cursor
        page += 1

    print(f"\n{'='*70}")
    print(f"TOTAL GAMES FETCHED: {len(all_games)}")
    print("="*70 + "\n")

    if not all_games:
        print("No games fetched!")
        return

    # Save full JSON
    json_file = "test/gfn_games_complete.json"
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(all_games, f, indent=2, ensure_ascii=False)
    print(f"✓ Saved full data to: {json_file}")

    # Save simple CSV
    csv_file = "test/gfn_games_simple.csv"
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["title", "sortName", "playType", "minTier", "status", "stores", "icon"])

        for game in all_games:
            title = game.get("title", "")
            sort_name = game.get("sortName", "")
            play_type = game.get("gfn", {}).get("playType", "")
            min_tier = game.get("gfn", {}).get("minimumMembershipTierLabel", "")
            status = game.get("gfn", {}).get("status", "")
            stores = ", ".join(v.get("appStore", "") for v in game.get("variants", []))
            icon = game.get("images", {}).get("GAME_ICON", "")

            writer.writerow([title, sort_name, play_type, min_tier, status, stores, icon])

    print(f"✓ Saved CSV to: {csv_file}")

    # Statistics
    print(f"\n{'='*70}")
    print("STATISTICS")
    print("="*70)

    # Count by store
    stores_count = {}
    for game in all_games:
        for v in game.get("variants", []):
            store = v.get("appStore", "Unknown")
            stores_count[store] = stores_count.get(store, 0) + 1

    print(f"\nGames by store (top 10):")
    for store, count in sorted(stores_count.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {store}: {count}")

    # Count by tier
    tiers_count = {}
    for game in all_games:
        tier = game.get("gfn", {}).get("minimumMembershipTierLabel", "Free")
        tiers_count[tier] = tiers_count.get(tier, 0) + 1

    print(f"\nGames by membership tier:")
    for tier, count in sorted(tiers_count.items(), key=lambda x: x[1], reverse=True):
        print(f"  {tier}: {count}")

    # Sample games
    print(f"\nFirst 15 games (by popularity):")
    for i, game in enumerate(all_games[:15], 1):
        stores = [v.get("appStore", "") for v in game.get("variants", [])]
        print(f"  {i:2d}. {game.get('title', 'N/A'):40s} ({', '.join(stores[:2])})")

    print(f"\n{'='*70}")
    print("COMPLETE!")
    print("="*70)
    print("\nYou can now use these files to integrate games into Hackboot:")
    print(f"  - {json_file} (complete data)")
    print(f"  - {csv_file} (simplified view)")

if __name__ == "__main__":
    main()
