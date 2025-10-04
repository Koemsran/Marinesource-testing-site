import { test, expect } from '@playwright/test';

const homepageUrl = 'https://www.marinesource.com';
// TODO: Replace with your login session cookie of this website
const sessionName = 'n';
const sessionValue = '68df8ff671289919b753efe7';
const domain = '.marinesource.com';

// ====================== Check all loading and UI elements on homepage =====================

test('Homepage Load and UI Elements', async ({ page }) => {
  const response = await page.goto(homepageUrl);
  await page.waitForLoadState('load');

  // Basic checks
  expect(response?.status()).toBeLessThan(400);
  await expect(page).toHaveTitle(/Marine|Boat|Yacht|Source/i);

  // Check UI elements
  const logoLink = page.locator('header a[href="/"], nav a[href="/"]').first();
  await expect(logoLink).toBeVisible({ timeout: 10000 });
  
  const mainSearch = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="location"], input[placeholder*="boat"]').first();
  await expect(mainSearch).toBeVisible();
  
  const shopLink = page.locator('a:has-text("Shop")').first();
  const knowledgeHubLink = page.locator('a:has-text("Knowledge Hub")').first();
  
  await expect(shopLink).toBeVisible();
  await expect(knowledgeHubLink).toBeVisible();

  // Check images and footer
  const images = page.locator('img');
  const imageCount = await images.count();
  if (imageCount > 0) {
    await expect(images.first()).toBeVisible();
  }

  const footer = page.locator('footer, .footer').first();
  await expect(footer).toBeVisible();
});

// ====================== Check all navigation links on homepage =====================

test('Navigation Links', async ({ page }) => {
  await page.goto(homepageUrl);
  await page.waitForLoadState('load');

  // Test logo navigation
  const logoLink = page.locator('header a[href="/"], nav a[href="/"]').first();
  await logoLink.click();
  await page.waitForLoadState('load');
  await expect(page).toHaveURL(/https:\/\/(www\.)?marinesource\.com\/?/);

  // Reset to homepage for next tests
  await page.goto(homepageUrl);
  await page.waitForLoadState('load');
  
  // Test main navigation links
  const shopLink = page.locator('a:has-text("Shop")').first();
  await expect(shopLink).toBeVisible();
  await shopLink.click();
  await page.waitForURL('**/search**', { timeout: 10000 });
  expect(page.url()).toMatch(/https:\/\/marinesource\.com\/search(\?.*)?/);

  // Reset and test Knowledge Hub
  await page.goto(homepageUrl);
  await page.waitForLoadState('load');
  
  const knowledgeHubLink = page.locator('a:has-text("Knowledge Hub")').first();
  await expect(knowledgeHubLink).toBeVisible();
  await knowledgeHubLink.click();
  await page.waitForURL('**/blog**', { timeout: 10000 });
  expect(page.url()).toMatch(/https:\/\/marinesource\.com\/blog(\?.*)?/);

  // Reset and test "See All" link
  await page.goto(homepageUrl);
  await page.waitForLoadState('load');
  
  const seeAllLink = page.locator('a:has-text("See All")').first();
  await seeAllLink.isVisible();
  await seeAllLink.click();
  await page.waitForURL('**/search**', { timeout: 10000 });
  expect(page.url()).toMatch(/https:\/\/marinesource\.com\/search(\?.*)?/);

  // Reset and test "Shop New Arrivals" link
  await page.goto(homepageUrl);
  await page.waitForLoadState('load');
  
  const newArrivalsLink = page.locator('a:has-text("Shop New Arrivals"), a:has-text("New Arrivals")').first();
  await newArrivalsLink.isVisible();
  await newArrivalsLink.click();
  await page.waitForURL('**/search**', { timeout: 10000 });
  expect(page.url()).toMatch(/https:\/\/marinesource\.com\/search\?sort=date-desc/);

  // Test additional search category links (manufacturer, type, etc.)
  await page.goto(homepageUrl);
  await page.waitForLoadState('load');
  
  const searchLinks = page.locator('a[href*="search?"]');
  const searchCount = await searchLinks.count();
  
  if (searchCount > 1) {
    const secondSearch = searchLinks.nth(1);
    if (await secondSearch.isVisible()) {
      await secondSearch.click();
      await page.waitForURL('**/search**', { timeout: 10000 });
      expect(page.url()).toContain('search');
    }
  }
});

// // ====================== Check all buttons on homepage =====================

test('Contact Our Team Button - Multiple Clicks Test', async ({ page }) => {
  await page.goto(homepageUrl);
  await page.waitForLoadState('networkidle');
  
  const contactButton = page.locator('a:has-text("Contact Our Team"), button:has-text("Contact Our Team")').first();
  await expect(contactButton).toBeVisible({ timeout: 10000 });

  // Verify it's a mailto link
  const mailtoHref = await contactButton.getAttribute('href');
  expect(mailtoHref).toContain('mailto:');
  
  // First click
  console.log('Testing first click...');
  await contactButton.click();
  await page.waitForTimeout(2000);
  console.log('First click completed.');
  
  // Second click (where the problem occurs)
  console.log('Testing second click...');
  await contactButton.click();
  await page.waitForTimeout(300000); // Wait longer to catch timeout errors

  //Third click
  console.log('Testing third click...');
  await contactButton.click();
  await page.waitForTimeout(30000);
  
  // Verify button remains functional
  await expect(contactButton).toBeVisible();
  await expect(contactButton).toBeEnabled();
  
});

test('Test Get Access Button', async ({ page }) => {
  await page.goto(homepageUrl);
  await page.waitForLoadState('load');

  const getAccessButton = page.locator('button:has-text("Get Access"), a:has-text("Get Access")').first();
  await expect(getAccessButton).toBeVisible({ timeout: 5000 });
  
  // Check if email form is visible on the page
  const emailInput = page.locator('input[type="email"], input[placeholder*="Email"], input[name*="email"]').first();
  await expect(emailInput).toBeVisible({ timeout: 5000 });
  
  // Test the email signup flow
  await emailInput.fill('test@example.com');
  await getAccessButton.click();
  
  // Wait for success message to appear
  await page.waitForTimeout(3000);
  
  // Check for success message using the class selector that works
  const successMessage = page.locator('[class*="success"]');
  const isSuccessVisible = await successMessage.isVisible();
  
  if (!isSuccessVisible) {
    throw new Error('Get Access button email signup failed - no success message appeared');
  }
  
  // Verify success message is visible and we stay on marinesource.com
  await expect(successMessage).toBeVisible();
  expect(page.url()).toContain('marinesource.com');
});

test('Test Join Community Button - Logged In User', async ({ page, context }) => {
  
  // Add session cookies to simulate logged-in user
  await context.addCookies([
    { name: sessionName, value: sessionValue, domain: domain, path: '/' }
  ]);

  await page.goto(homepageUrl);
  await page.waitForLoadState('load');
  
  // Verify user is actually logged in by checking for logged-in indicators
  const userProfile = page.locator('[class*="profile"], [class*="user"], [data-testid*="user"]');
  const loginLink = page.locator('a:has-text("Login"), button:has-text("Login")');
  
  // Check if we see user profile elements or absence of login links
  const hasUserProfile = await userProfile.count() > 0;
  const hasLoginLink = await loginLink.isVisible().catch(() => false);
  
  if (!hasUserProfile && hasLoginLink) {
    console.log('⚠️ Warning: User may not be properly logged in');
  }
  
  const joinButton = page.locator('button:has-text("Join Community"), a:has-text("Join Community")').first();
  await expect(joinButton).toBeVisible({ timeout: 5000 });
  await joinButton.click();
  
  await page.waitForTimeout(3000);
  
  // Check if login modal appears (this should NOT happen for logged-in users)
  const loginModal = page.locator('div:has-text("Welcome to Marine Source"):has(button:has-text("Login"))').first();
  const isLoginModalVisible = await loginModal.isVisible().catch(() => false);
  
  if (isLoginModalVisible) {
    // FAIL the test if login modal appears for logged-in user
    throw new Error('🚨 BUG DETECTED: Login modal appeared for already logged-in user! This should not happen.');
  }
  
  // Verify page is still functional
  const header = page.locator('header');
  await expect(header).toBeVisible();
  
});