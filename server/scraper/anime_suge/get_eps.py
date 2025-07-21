from bs4 import BeautifulSoup
import nodriver as uc
import asyncio
import sys
import json

url = sys.argv[1]


async def get_eps(url):
    page = None
    try:
        browser = await uc.start(headless=True, user_data_dir="C:\\Users\\galla\\AppData\\Local\\Temp")
        page = await browser.get(url)
        await browser.wait(2)
        await page.wait_for("div#media-episode div.range-wrap")

        wrapper = await page.query_selector("div.range-wrap")
        soup = BeautifulSoup(str(wrapper), "html.parser")
        data = []
        a = soup.find_all("a")
        for x in a:
            ep_num = x.get("href").find("ep-") + 3
            data.append(
                {
                    "ep": x.get("href")[ep_num:],
                    "title": x.get("title"),
                    "url": x.get("href")
                }
            )

        print(json.dumps(data))

    except Exception as e:
        print("Failed to get episode list:", e, file=sys.stderr)
    finally:
        if page:
            await page.close()

asyncio.run(get_eps(url))
