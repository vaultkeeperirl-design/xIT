from playwright.sync_api import sync_playwright
import os
import time

def verify_reframe_tool():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Arrange: Go to the app homepage
        page.goto("http://localhost:5173")
        page.wait_for_load_state("networkidle")

        # 2. Act: Open the "View" menu and verify "Auto-Reframe Tool" exists
        # Note: The MenuBar implementation might not be using standard accessible roles/labels perfectly yet,
        # so we'll look for text if roles fail.

        # Click the "View" menu button
        page.get_by_role("button", name="View").click()

        # Verify the menu item exists
        reframe_menu_item = page.get_by_text("Auto-Reframe Tool")
        if not reframe_menu_item.is_visible():
            print("Auto-Reframe Tool menu item not visible")
            # Take a screenshot of the menu
            page.screenshot(path="verification/menu_verification.png")
        else:
            print("Auto-Reframe Tool menu item found")
            # Click it to toggle the tool (though we might not see it without a selected clip)
            reframe_menu_item.click()

        # Take a screenshot of the main UI
        page.screenshot(path="verification/reframe_tool_ui.png")

        browser.close()

if __name__ == "__main__":
    verify_reframe_tool()
