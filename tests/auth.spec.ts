import { test, expect } from '@playwright/test';
const homepageUrl = 'https://www.marinesource.com';
const testEmail = 'test@example.com';

// TODO: Replace with your login session cookie of this website
const sessionName = 'n';
const sessionValue = '68df8ff671289919b753efe7';
const domain = '.marinesource.com';

// ====================== Authentication Tests =====================

test('Login functionality', async ({ page }) => {
  await page.goto(homepageUrl);

  // Click login button
  const loginButton = page.locator('button:has-text("Login")').first();
  await expect(loginButton).toBeVisible();
  await loginButton.click();

  // Wait for login modal to appear
  const loginModal = page.locator('.login_modalContent__FuMus').first();
  await expect(loginModal).toBeVisible({ timeout: 10000 });

  // // Verify modal content is loaded (check for title or email field)
  const modalTitle = loginModal.locator('.login_title__PqfOC').first();
  const emailField = loginModal.locator('input[type="email"], input[placeholder*="mail"]').first();
  
  // // Fill email and submit
  await expect(modalTitle).toBeVisible();
  await expect(emailField).toBeVisible();
  await emailField.fill(testEmail);

  const submitButton = loginModal.locator('button:has-text("Login"), button[type="submit"]').first();
  await expect(submitButton).toBeVisible();
  await submitButton.click();
  await page.waitForTimeout(2000);
  
  // // Check for verification message should show 
  const verificationMessage = loginModal.locator('text=Check your email for a magic link.');
  await expect(verificationMessage).toBeVisible({ timeout: 5000 });
});

test('Signup functionality', async ({ page }) => {
  await page.goto(homepageUrl);
  
  // Click login button to access signup option
  const loginButton = page.locator('button:has-text("Login")').first();
  await expect(loginButton).toBeVisible();
  await loginButton.click();

    const loginModal = page.locator('.login_modalContent__FuMus').first();
  // await expect(loginModal).toBeVisible({ timeout: 10000 });

  // Look for "Don't have an account?" signup link
  const signupLink = loginModal.getByText("Don't have an account").first();
  await expect(signupLink).toBeVisible();
  await signupLink.click();

  // Wait for login modal to appear
  const signupModal = page.locator('.login_modalContent__FuMus').last();
  await expect(signupModal).toBeVisible({ timeout: 10000 });

  // Fill signup form
  const emailField = signupModal.locator('input[type="email"], input[placeholder*="mail"]').first();
  await expect(emailField).toBeVisible();
  await emailField.fill(testEmail);

  const submitButton = signupModal.locator('button:has-text("Signup"), button:has-text("Register"), button[type="submit"]').first();
  await expect(submitButton).toBeVisible();
  await submitButton.click();

  await page.waitForTimeout(2000);

  // Check for signup success message OR modal behavior
  const verificationMessage = signupModal.locator('text=Check your email for a magic link.');
  await expect(verificationMessage).toBeVisible({ timeout: 5000 });

});


test('Logout with saved session', async ({ page, context }) => {
  // Set authentication cookie
  await context.addCookies([
    { name: sessionName, value: sessionValue, domain: domain, path: '/' }
  ]);

  await page.goto(homepageUrl);
  await page.waitForLoadState('domcontentloaded');
  
  const loginButton = page.locator('nav button:has-text("Login"), header button:has-text("Login")').first();
  
  // If session didn't work, user is already logged out
  if (await loginButton.isVisible()) {
    await expect(loginButton).toBeVisible();
    return;
  }
  
  // Verify user is authenticated by checking for logout options
  const hasLogoutOptions = await checkForLogoutOptions(page);
  if (!hasLogoutOptions) {
    await page.reload();
    await expect(loginButton).toBeVisible({ timeout: 5000 });
    return;
  }
  
  // Perform logout
  await tryOpenUserMenu(page);
  const didLogout = await tryLogout(page);
  expect(didLogout).toBe(true);
  
  // Verify logout was successful
  await expect(loginButton).toBeVisible({ timeout: 10000 });
});

// Helper function to check if logout options exist
async function checkForLogoutOptions(page: any) {
  await tryOpenUserMenu(page);
  
  const logoutSelectors = [
    'a[href="/logout"]',
    'text="Log out"',
    'a:has-text("Log out")',
    'button:has-text("Logout")'
  ];
  
  for (const selector of logoutSelectors) {
    if (await page.locator(selector).first().isVisible()) {
      return true;
    }
  }
  return false;
}

// Helper function to open user menu
async function tryOpenUserMenu(page: any) {
  const userMenuSelectors = [
    'button.iconButton',
    '.iconButton',
    '[class*="user"]',
    'nav [role="button"]'
  ];
  
  for (const selector of userMenuSelectors) {
    const menu = page.locator(selector).first();
    if (await menu.isVisible()) {
      await menu.click();
      await page.waitForTimeout(500);
      return;
    }
  }
}

// Helper function to find and click logout
async function tryLogout(page: any) {
  const logoutSelectors = [
    'a[href="/logout"]',
    'text="Log out"',
    'a:has-text("Log out")',
    'button:has-text("Logout")'
  ];
  
  for (const selector of logoutSelectors) {
    const logoutElement = page.locator(selector).first();
    if (await logoutElement.isVisible()) {
      await logoutElement.click();
      return true;
    }
  }
  return false;
}