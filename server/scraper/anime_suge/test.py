import requests

headers = {
    "Referer": "https://megaplay.buzz"
}
url = "https://megaplay.buzz/stream/s-1/Z1FmeE5NRVVubXgvWW9GNyswdUxPZz09?autostart=true"
response = requests.get(url, headers=headers)

print(response.text)
