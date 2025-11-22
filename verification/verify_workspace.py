from playwright.sync_api import sync_playwright

def verify_workspace():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Wait for the server to be ready (simple wait, retry logic is better but keeping it simple)
        page.goto("http://localhost:5173/workspace")

        # Wait for the "Atelier" text to appear in the sidebar
        page.wait_for_selector("text=Atelier")

        # Wait for the "Hello, what's on your mind?" text
        page.wait_for_selector("text=Hello, what's on your mind?")

        # Take a screenshot
        page.screenshot(path="verification/workspace.png")

        browser.close()

if __name__ == "__main__":
    verify_workspace()
