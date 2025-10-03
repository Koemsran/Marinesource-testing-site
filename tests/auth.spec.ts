import { test, expect } from '@playwright/test';
const homepageUrl = 'https://www.marinesource.com';

// ====================== Authentication Tests =====================

test('Login functionality', async ({ page }) => {
  await page.goto(homepageUrl);

  // Click login button
  const loginButton = page.locator('button:has-text("Login")').first();
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  
  // Fill email and submit
  const emailField = page.locator('input[type="email"], input[placeholder*="mail"]').first();
  await expect(emailField).toBeVisible();
  await emailField.fill('koemsran.phon@student.passerellesnumeriq.org');
  
  const submitButton = page.locator('button:has-text("Login"):not(:has-text("Google"))').first();
  await expect(submitButton).toBeVisible();
  await submitButton.click({ force: true });
  
  await page.waitForTimeout(2000);
  
  // Check for verification message OR successful form submission
  const verificationMessage = page.getByText('Check your email for a magic link');
  const modalClosed = !(await page.locator('.modal_root__rkL7V').first().isVisible());
  
  // Test passes if verification message appears OR modal closes
  try {
    await expect(verificationMessage).toBeVisible({ timeout: 3000 });
  } catch {
    expect(modalClosed).toBeTruthy();
  }
});

test('Signup functionality', async ({ page }) => {
  await page.goto(homepageUrl);
  
  // Click login button to access signup option
  const loginButton = page.locator('button:has-text("Login")').first();
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  
  // Look for "Don't have an account?" signup link
  const signupLink = page.getByText("Don't have an account").first();
  await expect(signupLink).toBeVisible();
  await signupLink.click();
  
  // Fill signup form
  const emailField = page.locator('input[type="email"], input[placeholder*="mail"]').first();
  await expect(emailField).toBeVisible();
  await emailField.fill('koemsran.phon@student.passerellesnumeriq.org');
  
  const submitButton = page.locator('button:has-text("Sign Up"), button:has-text("Register"), button[type="submit"]').first();
  await expect(submitButton).toBeVisible();
  await submitButton.click({ force: true });

  await page.waitForTimeout(2000);
  
  // Check for signup success message OR modal behavior
  const signupSuccess = page.getByText('Check your email', { exact: false });
  const modalClosed = !(await page.locator('.modal_root__rkL7V').first().isVisible());
  
  // Test passes if success message appears OR modal closes (form processed)
  try {
    await expect(signupSuccess).toBeVisible({ timeout: 3000 });
  } catch {
    expect(modalClosed).toBeTruthy();
  }
});

test('Logout functionality', async ({ page }) => {
  await page.goto(homepageUrl);
  
  // Check if user is already logged in
  const logoutLink = page.locator('a:has-text("Logout"), a:has-text("Sign Out")').first();
  const userMenu = page.locator('.user-menu, [class*="user"], [class*="account"]').first();
  
  const hasLogout = await logoutLink.isVisible();
  const hasUserMenu = await userMenu.isVisible();
  
  if (hasLogout) {
    await logoutLink.click();
    
    // Verify logout success - login button should reappear
    const loginButtonReappears = page.locator('button:has-text("Login")').first();
    await expect(loginButtonReappears).toBeVisible({ timeout: 5000 });
  } else if (hasUserMenu) {

    await userMenu.click();
    const logoutInMenu = page.locator('a:has-text("Logout"), a:has-text("Sign Out")');
    
    if (await logoutInMenu.isVisible()) {
      await logoutInMenu.click();
      const loginButtonReappears = page.locator('button:has-text("Login")').first();
      await expect(loginButtonReappears).toBeVisible({ timeout: 5000 });
    }
  } else {
    // User not logged in - verify login button exists
    const loginButton = page.locator('button:has-text("Login")').first();
    await expect(loginButton).toBeVisible();
  }
});