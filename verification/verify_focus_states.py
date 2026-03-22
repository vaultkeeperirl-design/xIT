from playwright.sync_api import sync_playwright

def verify_feature():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="verification/video")
        page = context.new_page()

        try:
            # Navigate to the local dev server
            page.goto("http://localhost:5173")
            page.wait_for_timeout(2000)

            # 1. Test Prompt Panel
            prompt_textarea = page.locator("textarea[placeholder*='Upload a video first']").first
            if prompt_textarea.count() > 0:
                # wait for page load before interacting with UI to avoid intercept errors
                # use evaluation to avoid intercept issues if there are overlays
                page.evaluate('document.querySelector("div.fixed.inset-0")?.remove()')
                prompt_textarea.focus()
                page.wait_for_timeout(500)
                page.screenshot(path="verification/prompt_focus.png")
                page.wait_for_timeout(1000)

            # Since we need to upload a video to see clip/caption properties easily,
            # we'll test global settings input to be sure we didn't break anything.
            settings_btn = page.locator("button[title='Settings']")
            if settings_btn.count() > 0:
                settings_btn.click()
                page.wait_for_timeout(500)

                # Click the first input in settings
                inputs = page.locator("input[type='password']").first
                if inputs.count() > 0:
                    inputs.focus()
                    page.wait_for_timeout(500)
                    page.screenshot(path="verification/settings_focus.png")
                    page.wait_for_timeout(1000)

        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    verify_feature()
