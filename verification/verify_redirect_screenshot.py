from playwright.sync_api import sync_playwright

def verify_redirect_screenshot():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Test Login Flow
        print("Testing Login Flow...")
        page.goto("http://localhost:5173/login")
        page.fill("input[type='email']", "test@example.com")
        page.fill("input[type='password']", "password123")
        page.click("button[type='submit']")

        # Wait for redirect
        page.wait_for_url("**/workspace")
        page.wait_for_selector("text=Hello, what's on your mind?")

        # Screenshot
        page.screenshot(path="verification/redirect_success.png")
        print("Screenshot taken at verification/redirect_success.png")

        browser.close()

if __name__ == "__main__":
    verify_redirect_screenshot()
