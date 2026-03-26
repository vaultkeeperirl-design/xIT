import os
import time
from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:5173")
    page.wait_for_timeout(3000)

    # Need to trigger File -> Settings from the menu
    page.get_by_role("button", name="File", exact=True).click()
    page.wait_for_timeout(1000)

    page.get_by_text("Settings").click()
    page.wait_for_timeout(2000)

    # Focus the first password input
    page.get_by_label("OpenAI API Key").focus()
    page.wait_for_timeout(1000)

    # Take screenshot
    page.screenshot(path="verification/screenshots/settings_focus.png")
    page.wait_for_timeout(500)

    # Click cancel to close
    page.get_by_role("button", name="Cancel").click()
    page.wait_for_timeout(2000)

    # Click on "Smart Assistant" in case it's not active
    try:
        page.get_by_role("button", name="Smart Assistant").click()
        page.wait_for_timeout(1000)
    except:
        pass

    # The AI prompt textarea has a placeholder. Let's just focus the first one.
    # But note: it might be disabled since no video is uploaded.
    # To check the focus state, it might not show if it's disabled.
    # We can use evaluate to remove the disabled attribute for the screenshot.
    page.evaluate('''() => {
        const textareas = document.querySelectorAll('textarea');
        if (textareas.length > 0) {
            textareas[0].removeAttribute('disabled');
        }
    }''')
    page.wait_for_timeout(500)

    # Now focus it
    page.locator('textarea').first.focus()
    page.wait_for_timeout(1000)

    # Take screenshot
    page.screenshot(path="verification/screenshots/prompt_focus.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    os.makedirs("verification/screenshots", exist_ok=True)
    os.makedirs("verification/videos", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification/videos",
            viewport={"width": 1280, "height": 720}
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
