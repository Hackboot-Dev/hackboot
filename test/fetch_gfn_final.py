#!/usr/bin/env python3
"""
GeForce NOW Games Fetcher - Final Working Version
Uses GraphQL API with proper query formatting
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

def fetch_all_games(country="US", language="en_US"):
    """Fetch all games with pagination"""
    after = ""
    page = 1
    all_games = []

    print(f"Fetching GeForce NOW games ({country}/{language})...\n")

    while True:
        # Build GraphQL query (use simple string formatting, no triple quotes)
        query = '{ apps(country:"' + country + '" language:"' + language + '" orderBy: "itemMetadata.gfnPopularityRank:ASC,sortName:ASC" after:"' + after + '") { numberReturned pageInfo { endCursor hasNextPage } items { title sortName id images { FEATURE_IMAGE GAME_ICON GAME_LOGO } gfn { playType minimumMembershipTierLabel status } variants { appStore publisherName } } } }'

        try:
            r = requests.post(URL, data=query, headers=HEADERS, timeout=60)
            r.raise_for_status()

            data = r.json()["data"]["apps"]
            items = data["items"]

            print(f"Page {page}: {len(items)} games")

            all_games.extend(items)

            if not data["pageInfo"]["hasNextPage"]:
                break

            after = data["pageInfo"]["endCursor"]
            page += 1

        except Exception as e:
            print(f"Error on page {page}: {e}")
            break

    return all_games

def main():
    print("="*70)
    print("GEFORCE NOW GAMES FETCHER")
    print("="*70 + "\n")

    games = fetch_all_games()

    print(f"\n✓ Total games fetched: {len(games)}\n")

    if not games:
        print("No games fetched!")
        return

    # Save JSON
    json_file = "test/gfn_games_full.json"
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(games, f, indent=2, ensure_ascii=False)
    print(f"✓ Saved to: {json_file}")

    # Save CSV
    csv_file = "test/gfn_games.csv"
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["title", "sortName", "playType", "minTier", "stores", "icon"])

        for game in games:
            title = game.get("title", "")
            sort_name = game.get("sortName", "")
            play_type = game.get("gfn", {}).get("playType", "")
            min_tier = game.get("gfn", {}).get("minimumMembershipTierLabel", "")
            stores = ",".join(v.get("appStore", "") for v in game.get("variants", []))
            icon = game.get("images", {}).get("GAME_ICON", "")

            writer.writerow([title, sort_name, play_type, min_tier, stores, icon])

    print(f"✓ Saved to: {csv_file}")

    # Stats
    print(f"\n{'='*70}")
    print("STATISTICS")
    print("="*70)

    stores = {}
    for game in games:
        for v in game.get("variants", []):
            store = v.get("appStore", "Unknown")
            stores[store] = stores.get(store, 0) + 1

    print(f"\nGames by store:")
    for store, count in sorted(stores.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {store}: {count}")

    print(f"\nFirst 10 games:")
    for i, game in enumerate(games[:10], 1):
        print(f"  {i}. {game.get('title', 'N/A')}")

    print(f"\n{'='*70}")
    print("DONE!")
    print("="*70)

if __name__ == "__main__":
    main()
