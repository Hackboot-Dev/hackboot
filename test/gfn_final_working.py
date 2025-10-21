#!/usr/bin/env python3
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

all_games = []
after = ""
page = 1

print("Fetching GeForce NOW games...\n")

while True:
    query = '{ apps(country:"US" language:"en_US" orderBy: "itemMetadata.gfnPopularityRank:ASC,sortName:ASC" after:"' + after + '") { numberReturned pageInfo { endCursor hasNextPage } items { title sortName id images { GAME_ICON GAME_LOGO } gfn { playType minimumMembershipTierLabel status } variants { appStore publisherName } } } }'

    r = requests.post(URL, data=query, headers=HEADERS, timeout=60)

    if r.status_code != 200:
        print(f"Error on page {page}: {r.status_code}")
        break

    data = r.json()["data"]["apps"]
    items = data["items"]

    print(f"Page {page}: {len(items)} games")
    all_games.extend(items)

    if not data["pageInfo"]["hasNextPage"]:
        break

    after = data["pageInfo"]["endCursor"]
    page += 1

print(f"\n✓ Total: {len(all_games)} games\n")

# Save JSON
with open("test/gfn_games_all.json", "w", encoding="utf-8") as f:
    json.dump(all_games, f, indent=2, ensure_ascii=False)
print("✓ Saved: test/gfn_games_all.json")

# Save CSV
with open("test/gfn_games_all.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["title", "sortName", "playType", "minTier", "status", "stores", "icon"])
    for g in all_games:
        w.writerow([
            g.get("title", ""),
            g.get("sortName", ""),
            g.get("gfn", {}).get("playType", ""),
            g.get("gfn", {}).get("minimumMembershipTierLabel", ""),
            g.get("gfn", {}).get("status", ""),
            ", ".join(v.get("appStore", "") for v in g.get("variants", [])),
            g.get("images", {}).get("GAME_ICON", "")
        ])
print("✓ Saved: test/gfn_games_all.csv")

print(f"\nFirst 10:")
for i, g in enumerate(all_games[:10], 1):
    print(f"  {i}. {g['title']}")

print("\nDONE!")
