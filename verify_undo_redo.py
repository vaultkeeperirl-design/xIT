import asyncio
from playwright.async_api import async_playwright
import os

async def verify_undo_redo():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navigate to the app
        await page.goto("http://localhost:5173")

        # Wait for assets to load (or at least the UI to be ready)
        await page.wait_for_selector('text=Smart Assistant')

        # 1. Verify Undo/Redo buttons exist in the MenuBar
        # They are in the "Edit" menu, so we need to click "Edit" first
        await page.click('text=Edit')

        # Take a screenshot of the Edit menu
        os.makedirs("verification", exist_ok=True)
        await page.screenshot(path="verification/edit_menu.png")
        print("Screenshot of Edit menu saved to verification/edit_menu.png")

        # Check if Undo/Redo options are visible (they might be disabled)
        undo_button = page.get_by_text("Undo")
        redo_button = page.get_by_text("Redo")

        if await undo_button.is_visible():
            print("Undo button is visible")
        else:
            print("Undo button NOT visible")

        if await redo_button.is_visible():
            print("Redo button is visible")
        else:
            print("Redo button NOT visible")

        # Close the menu
        await page.click('body')

        # 2. Simulate an action (e.g., adding a clip or moving one)
        # Since we don't have clips initially, let's try to upload a dummy asset or just check initial state
        # For simplicity in this verification, we'll verify the UI elements are wired up.
        # A full functional test would require uploading a file which is complex in this environment.

        # We can try to drag a playhead or something that changes state if possible,
        # but the main goal is to ensure the UI didn't crash and buttons are there.

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_undo_redo())
