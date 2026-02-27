import time
from playwright.sync_api import sync_playwright

def verify_references():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        try:
            print("Navigating to http://localhost:5173...")
            page.goto("http://localhost:5173", timeout=60000)

            # Wait for the app to load
            page.wait_for_load_state("networkidle")

            # Take a screenshot to verify all HyperEdit references are gone
            print("Taking screenshot...")
            page.screenshot(path="verification/references_verification.png")

            # Check for remaining "HyperEdit" text
            # We expect to find NO "HyperEdit" text in the visible UI, except maybe in hidden comments or metadata we can't see
            # But let's check the visible page text
            content = page.content()
            if "HyperEdit" in content:
                print("WARNING: Found 'HyperEdit' in page content!")
                # Print context
                start = content.find("HyperEdit")
                print(content[start-50:start+50])
            else:
                print("SUCCESS: 'HyperEdit' not found in page content.")

            # Check for "xIT" text
            if "xIT" in content:
                 print("SUCCESS: Found 'xIT' in page content.")
            else:
                 print("WARNING: 'xIT' NOT found in page content!")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_references.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_references()
