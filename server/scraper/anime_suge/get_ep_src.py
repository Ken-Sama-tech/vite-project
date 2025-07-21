import sys
import nodriver as uc
import asyncio


async def get_ep_src(url):
    page = None
    try:
        browser = await uc.start(headless=True, user_data_dir="C:\\Users\\galla\\AppData\\Local\\Temp")
        page = await browser.get(url)
        await browser.wait(2)
        await page.wait_for("div.media-controls-wrap")
        auto_play = await page.find("Auto Play", best_match=True)
        data_on = auto_play.__getattr__('data-on')
        auto_play_state = await auto_play.query_selector('i')

        is_on = str(data_on).replace("Auto Play", '').strip()
        state = str(auto_play_state).strip()

        if (is_on != state):
            await auto_play.click()
            await page.reload()

        await browser.wait(2)
        await page.wait_for("div#player iframe")
        iframe = await page.query_selector("div#player iframe")
        src = iframe.__getattr__('src')

        print(src)

    except Exception as e:
        print("Failed to get episode src:", e, file=sys.stderr)
    finally:
        if page:
            await page.close()

url = sys.argv[1]

asyncio.run(get_ep_src(url))
