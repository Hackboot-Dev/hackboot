import requests
import json

all_games = []
cursor = ""

for page in range(1, 10):  # Max 10 pages for testing
    query = '{ apps(country:"US" language:"en_US" orderBy: "itemMetadata.gfnPopularityRank:ASC,sortName:ASC" after:"' + cursor + '") { numberReturned pageInfo { endCursor hasNextPage } items { title sortName gfn { playType } variants { appStore } } } }'

    r = requests.post(
        'https://api-prod.nvidia.com/services/gfngames/v1/gameList',
        data=query,
        headers={
            'content-type': 'application/json',
            'origin': 'https://www.nvidia.com',
            'referer': 'https://www.nvidia.com/',
            'user-agent': 'Mozilla/5.0'
        }
    )

    if r.status_code != 200:
        print(f"Error {r.status_code}: {r.text[:100]}")
        break

    d = r.json()["data"]["apps"]
    print(f"Page {page}: {len(d['items'])} games")

    all_games.extend(d["items"])

    if not d["pageInfo"]["hasNextPage"]:
        print("Last page reached")
        break

    cursor = d["pageInfo"]["endCursor"]

print(f"\nTotal: {len(all_games)} games")

with open("test/gfn_result.json", "w") as f:
    json.dump(all_games, f, indent=2)

print("Saved to test/gfn_result.json")
