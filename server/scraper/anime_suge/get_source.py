import requests
import sys

headers = {
    "Referer": "https://megaplay.buzz/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv.0) Gecko/20100101 Firefox/124.0",
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json",
}
params = {
    'id': sys.argv[1]
}


def get_source():
    try:
        result = {}
        response = requests.get(
            "https://megaplay.buzz/stream/getSources", headers=headers, params=params, timeout=10000)
        data = response.json()
        tracks = data['tracks']
        result['tracks'] = tracks
        url = data['sources']['file']
        index = str(url).find("master")
        base = url[0:index-1]
        res = requests.get(url, headers=headers)
        if "index-f1" in res.text:
            result['file'] = f"{base}/index-f1-v1-a1.m3u8"
        else:
            result['file', url]

        print(result)
    except Exception as e:
        print('Error', e, file=sys.stderr)


get_source()
