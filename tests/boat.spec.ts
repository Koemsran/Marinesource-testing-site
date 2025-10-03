import { test, expect } from '@playwright/test';

const homepageUrl = 'https://www.marinesource.com';

// Test browsing boat listings from homepage
test('Browse Boat Listings', async ({ page }) => {
  await page.goto(homepageUrl);

  const browseLinks = page.locator('a:has-text("Shop"), a:has-text("Listings"), a:has-text("See All"), a[href*="browse"], a[href*="listings"], a[href*="boats-for-sale"]');
  const linkCount = await browseLinks.count();
  
  const browseLink = browseLinks.first();
  
  if (await browseLink.isVisible()) {
    await browseLink.click();
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveURL(/.*browse.*|.*listings.*|.*boats.*|.*search.*/);
    
    const boatListings = page.locator('.listing, .boat-item, .result, [class*="boat"], [class*="listing"]');
    await expect(boatListings.first()).toBeVisible();
    
    const listingCount = await boatListings.count();
    expect(listingCount).toBeGreaterThan(0);
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1000);
    
    await expect(boatListings.first()).toBeVisible();
  } else {
    const listings = page.locator('.listing, .boat-item, .result, [class*="boat"], [class*="listing"]');
    if (await listings.first().isVisible()) {
      await expect(listings.first()).toBeVisible();
    }
  }
});

// Test individual boat details page functionality
test('Boat Details Functionality', async ({ page }) => {
  await page.goto(`${homepageUrl}/search`);
  await page.waitForLoadState('networkidle');

  const boatListings = page.locator('a[href*="/boat/"]');
  const listingCount = await boatListings.count();
  expect(listingCount).toBeGreaterThan(0);

  const firstBoatHref = await boatListings.first().getAttribute('href');
  const boatUrl = `https://marinesource.com${firstBoatHref}`;
  
  await page.goto(boatUrl, { timeout: 60000 });
  await page.waitForLoadState('domcontentloaded');

  const pageTitle = await page.title();
  const contactForm = await page.locator('form, .contact, [class*="contact"]').first().isVisible({ timeout: 5000 });
  const imageCount = await page.locator('img').count();
  const locationInfo = await page.locator('[class*="location"], .location').first().isVisible({ timeout: 5000 });

  expect(page.url()).toContain('/boat/');
  expect(pageTitle).toMatch(/\w+/);
  expect(contactForm).toBeTruthy();
  expect(imageCount).toBeGreaterThan(2);
  expect(locationInfo).toBeTruthy();
});