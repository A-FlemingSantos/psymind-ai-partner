from playwright.sync_api import sync_playwright

def verify_auth_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Test Login Flow
        print("Testing Login Flow...")
        page.goto("http://localhost:5173/login")
        page.fill("input[type='email']", "test@example.com")
        page.fill("input[type='password']", "password123")
        page.click("button[type='submit']")

        # Verify redirection to workspace
        page.wait_for_url("**/workspace")
        if "workspace" in page.url:
            print("Login -> Workspace redirection successful!")
        else:
            print(f"Login failed to redirect. Current URL: {page.url}")

        # Test Register Flow
        print("Testing Register Flow...")
        page.goto("http://localhost:5173/register")
        page.fill("input[placeholder='João Silva']", "Test User")
        page.fill("input[type='email']", "newuser@example.com")
        page.fill("input[id='password']", "password123")
        page.fill("input[id='confirmPassword']", "password123")
        page.check("input[type='checkbox']")
        page.click("button[type='submit']")

        # Verify redirection to workspace
        page.wait_for_url("**/workspace")
        if "workspace" in page.url:
            print("Register -> Workspace redirection successful!")
        else:
            print(f"Register failed to redirect. Current URL: {page.url}")

        browser.close()

if __name__ == "__main__":
    verify_auth_flow()
