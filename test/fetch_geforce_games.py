#!/usr/bin/env python3
"""
Script to fetch games from GeForce NOW API
API endpoint discovered: https://api-prod.nvidia.com/services/gfngames/v1/gameList
"""

import requests
import json

def fetch_games_from_api():
    """Fetch games list from the official GeForce NOW API"""
    api_url = "https://api-prod.nvidia.com/services/gfngames/v1/gameList"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
    }

    print("="*70)
    print("FETCHING GAMES FROM GEFORCE NOW API")
    print("="*70)
    print(f"\nAPI Endpoint: {api_url}\n")

    try:
        response = requests.get(api_url, headers=headers, timeout=10)

        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('Content-Type', 'N/A')}")
        print(f"Content-Length: {len(response.content)} bytes\n")

        if response.status_code == 200:
            data = response.json()

            # Save full JSON response
            output_file = '/workspaces/hackboot/test/geforce_games_full.json'
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            print(f"✓ Full data saved to: {output_file}\n")

            # Analyze structure
            analyze_response_structure(data)

            return data

        else:
            print(f"✗ API request failed with status {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return None

    except Exception as e:
        print(f"✗ Error fetching data: {e}")
        return None

def analyze_response_structure(data):
    """Analyze the structure of the API response"""
    print("="*70)
    print("ANALYZING API RESPONSE STRUCTURE")
    print("="*70 + "\n")

    # Check top-level structure
    if isinstance(data, dict):
        print(f"Top-level keys: {list(data.keys())}\n")

        # Look for games list
        for key in data.keys():
            value = data[key]
            if isinstance(value, list):
                print(f"✓ Found list under key '{key}' with {len(value)} items")

                if value:
                    # Sample first game
                    first_item = value[0]
                    print(f"\nSample game structure:")
                    print(json.dumps(first_item, indent=2)[:500])
                    print("\n...")

                    # Detect available fields
                    if isinstance(first_item, dict):
                        print(f"\nAvailable fields per game:")
                        for field in first_item.keys():
                            field_value = first_item[field]
                            field_type = type(field_value).__name__
                            sample = str(field_value)[:50]
                            print(f"  - {field} ({field_type}): {sample}")

                break
    elif isinstance(data, list):
        print(f"Response is a list with {len(data)} items")
        if data:
            print(f"\nSample item:\n{json.dumps(data[0], indent=2)[:500]}")

def extract_game_names(data):
    """Extract and save a simple list of game names"""
    games = []

    # Try to find the games list in different structures
    if isinstance(data, dict):
        # Try common keys
        for key in ['games', 'data', 'results', 'items']:
            if key in data and isinstance(data[key], list):
                games = data[key]
                break
    elif isinstance(data, list):
        games = data

    if not games:
        print("Could not find games list in response")
        return

    # Extract names
    game_names = []
    for game in games[:100]:  # First 100 for testing
        if isinstance(game, dict):
            # Try different name fields
            name = (game.get('title') or
                   game.get('name') or
                   game.get('gameName') or
                   game.get('displayName') or
                   'Unknown')
            game_names.append(name)

    # Save simple list
    output_file = '/workspaces/hackboot/test/game_names_simple.txt'
    with open(output_file, 'w', encoding='utf-8') as f:
        for name in game_names:
            f.write(f"{name}\n")

    print(f"\n✓ Extracted {len(game_names)} game names")
    print(f"✓ Saved to: {output_file}")
    print(f"\nFirst 10 games:")
    for i, name in enumerate(game_names[:10], 1):
        print(f"  {i}. {name}")

def main():
    print("\nGeForce NOW Games API Fetcher")
    print("="*70 + "\n")

    data = fetch_games_from_api()

    if data:
        extract_game_names(data)

        print("\n" + "="*70)
        print("FETCH COMPLETE")
        print("="*70)
        print("\nFiles created:")
        print("  - test/geforce_games_full.json (complete API response)")
        print("  - test/game_names_simple.txt (list of game names)")
        print("\nYou can now inspect these files to understand the data structure.")
    else:
        print("\n✗ Failed to fetch data from API")

if __name__ == "__main__":
    main()
