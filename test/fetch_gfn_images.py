#!/usr/bin/env python3
import requests
import json

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

print("Fetching GeForce NOW games WITH images...\n")

while page <= 10:
    query = '{ apps(country:"US" language:"en_US" orderBy: "itemMetadata.gfnPopularityRank:ASC,sortName:ASC" after:"' + after + '") { numberReturned pageInfo { endCursor hasNextPage } items { title sortName id images { GAME_ICON GAME_LOGO } gfn { playType minimumMembershipTierLabel } variants { appStore } } } }'
    
    try:
        r = requests.post(URL, data=query, headers=HEADERS, timeout=60)
        
        if r.status_code != 200:
            print(f"Error page {page}: {r.status_code}")
            break
        
        data = r.json()["data"]["apps"]
        items = data["items"]
        
        print(f"Page {page}: {len(items)} games")
        all_games.extend(items)
        
        if not data["pageInfo"]["hasNextPage"]:
            break
        
        after = data["pageInfo"]["endCursor"]
        page += 1
        
    except Exception as e:
        print(f"Error: {e}")
        break

print(f"\nTotal: {len(all_games)} games")

with open("test/gfn_with_images.json", "w", encoding="utf-8") as f:
    json.dump(all_games, f, indent=2, ensure_ascii=False)

print("Saved to: test/gfn_with_images.json")

print("\nSample images:")
for i, g in enumerate(all_games[:5], 1):
    imgs = g.get("images", {}) or {}
    print(f"{i}. {g['title']}")
    print(f"   Icon: {imgs.get('GAME_ICON', 'N/A')}")
    print(f"   Logo: {imgs.get('GAME_LOGO', 'N/A')}")
