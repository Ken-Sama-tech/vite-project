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
            data.append(
                {
                    "ep": x.get("href")[-1:],
                    "title": x.get("title"),
                    "url": x.get("href")
                }
            )

        return data

    except Exception as e:
        print("Failed to get episode list:", e, file=sys.stderr)
    finally:
        if page:
            await page.close()

data = asyncio.run(get_eps(url))
print(json.dumps(data))
