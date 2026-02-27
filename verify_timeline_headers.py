
import time
from playwright.sync_api import sync_playwright

def verify_timeline_headers():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to app...")
        try:
            page.goto("http://localhost:5173", timeout=60000)

            # Wait for the app to load - look for the timeline or track names
            print("Waiting for timeline...")
            page.wait_for_selector("text=V1", timeout=10000)
            page.wait_for_selector("text=A1", timeout=10000)

            # Give it a moment to fully render styles
            time.sleep(2)

            # Take a screenshot of the entire page
            print("Taking screenshot...")
            page.screenshot(path="verification_timeline.png")

            print("Screenshot saved to verification_timeline.png")

        except Exception as e:
            print(f"Error: {e}")
            # Take a screenshot anyway to see what happened
            page.screenshot(path="error_state.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_timeline_headers()
