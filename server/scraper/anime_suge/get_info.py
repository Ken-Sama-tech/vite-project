import sys
import asyncio
import nodriver as uc
from bs4 import BeautifulSoup
import requests
import re
import json
import signal
import subprocess


async def cleanup(exit=False):
    cmds = [
        "taskkill /F /IM msedge.exe /T",
        "taskkill /F /IM msedgewebview2.exe /T"
    ]

    for cmd in cmds:
        try:
            subprocess.run(
                cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception as e:
            print(f"Failed to run: {cmd}\nError: {e}")

    # if exit:
    #     print("Cleaned up all msedge-related processes.")
    #     sys.exit(0)


# def setup_clean_signal():
#     for sig in [signal.SIGINT, signal.SIGTERM]:
#         signal.signal(sig, lambda s, f: asyncio.create_task(cleanup(True)))


async def get_info(url):

    headers = {
        "Referer": "https://megaplay.buzz/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv.0) Gecko/20100101 Firefox/124.0"
    }

    # setup_clean_signal()
    browser = None
    page = None

    try:
        data = {
            'episodes': []
        }
        browser = await uc.start(
            headless=True,
            user_data_dir="C:\\Users\\galla\\AppData\\Local\\Temp\\",
            browser_executable_path="C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
        )
        page = await browser.get(url)
        await browser.wait(2)
        auto_play_btn = await page.query_selector("[data-name='auto_play']")
        btn_off = str(auto_play_btn.__getattr__("data-off")
                      ).replace("Auto Play", '').strip()
        btn_state = str(auto_play_btn.children[0])
        if btn_off == btn_state:
            await auto_play_btn.click()
            await page.reload()

        eps = await page.query_selector_all("div.range a")
        iframe_src = (await page.query_selector("div#player iframe")).__getattr__("src")
        data['iframe_src'] = iframe_src
        for ep in eps:
            soup = BeautifulSoup(str(ep), 'html.parser')
            a = soup.find("a")
            href = a.get("href")
            title = a.get_text(strip=True)
            data_id = a.get("data-id")
            mal_id = a.get("data-mal")
            data_tt = a.get("data-timestamp")
            ep = a.get("data-slug")
            res = {
                'href': href,
                'title': title,
                'data_id': int(data_id),
                'mal_id': int(mal_id),
                'data_tt': int(data_tt),
                'ep': int(ep)
            }
            data['episodes'].append(res)

        response = requests.get(iframe_src, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.find('title').get_text(strip=True)
        id = re.findall(r"\d+", title)

        data['id'] = int(id[0])

        print(json.dumps(data))
    except Exception as e:
        print("Error", str(e).strip, file=sys.stderr)
    finally:
        if page:
            await page.close()
            browser.stop()


url = sys.argv[1]
asyncio.run(cleanup())
asyncio.run(get_info(url))
