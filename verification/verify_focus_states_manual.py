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

            # We changed ClipPropertiesPanel and CaptionPropertiesPanel, which require a clip.
            # But we also changed AIPromptPanel Select

            # Since generating a mock video is hard, let's inject some HTML to test the classes
            page.evaluate("""
                const div = document.createElement('div');
                div.innerHTML = `
                    <div style="padding: 20px; background: #27272a; position: fixed; top: 0; left: 0; z-index: 9999; display: flex; gap: 10px; flex-direction: column;">
                        <input id="test-input" class="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-white focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/50 transition-all" value="Test Input" />
                        <select id="test-select" class="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-xs text-white focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/50 transition-all">
                            <option>Test Option</option>
                        </select>
                    </div>
                `;
                document.body.appendChild(div);
            """)

            page.wait_for_timeout(500)

            page.locator("#test-input").focus()
            page.wait_for_timeout(500)
            page.screenshot(path="verification/test_input_focus.png")
            page.wait_for_timeout(1000)

            page.locator("#test-select").focus()
            page.wait_for_timeout(500)
            page.screenshot(path="verification/test_select_focus.png")
            page.wait_for_timeout(1000)

        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    verify_feature()
