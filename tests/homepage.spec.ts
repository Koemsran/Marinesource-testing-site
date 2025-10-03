import { test, expect } from '@playwright/test';

const homepageUrl = 'https://www.marinesource.com';

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

// ====================== Check all buttons on homepage =====================

test('Contact Our Team Button Functionality', async ({ page }) => {
    await page.goto(homepageUrl);
    await page.waitForLoadState('networkidle');
    
    // Locate the Contact Our Team button
    const contactButton = page.locator('a:has-text("Contact Our Team"), button:has-text("Contact Our Team")').first();
    await expect(contactButton).toBeVisible({ timeout: 10000 });

    // Verify it's a mailto link
    const mailtoHref = await contactButton.getAttribute('href');
    expect(mailtoHref).toContain('mailto:');
    
    // Test first click
    await contactButton.click();
    await page.waitForTimeout(1000);
    
    // Verify button remains functional after first click
    await expect(contactButton).toBeVisible();
    await expect(contactButton).toBeEnabled();
    
    // Test second click to ensure button remains responsive
    await contactButton.click();
    await page.waitForTimeout(1000);
    
    // Final verification that button is still functional
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

test('Test Join Community Button', async ({ page }) => {
  await page.goto(homepageUrl);
  await page.waitForLoadState('load');
  
  const joinButton = page.locator('button:has-text("Join Community"), a:has-text("Join Community")').first();
  await expect(joinButton).toBeVisible({ timeout: 5000 });
  await joinButton.click();
  
  await page.waitForTimeout(3000);
  
  const loginModal = page.locator('div:has-text("Welcome to Marine Source"):has(button:has-text("Login"))').first();
  const isLoginModalVisible = await loginModal.isVisible().catch(() => false);
  
  if (!isLoginModalVisible) {
    throw new Error('Join Community button did not show login modal as expected');
  }
  
  // Verify login modal appears correctly
  await expect(loginModal).toBeVisible();
});
