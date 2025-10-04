import { test, expect } from '@playwright/test';

const homepageUrl = 'https://www.marinesource.com';
// TODO: Replace with your login session cookie of this website
const sessionName = 'n';
const sessionValue = '68df8ff671289919b753efe7';
const domain = '.marinesource.com';

// Test boat listings from homepage
// test('Boat Listings display correctly', async ({ page }) => {
// await page.goto(`${homepageUrl}/search`);
//   await page.waitForLoadState('networkidle');

//   // Wait for boat container to load
//   const boatContainer = page.locator('div.container_container__fs29U').first();
//   await expect(boatContainer).toBeVisible();

//   // Get all boat items
//   const boatItems = page.locator('.search-results_item__BB03T');
//   const boatCount = await boatItems.count();
//   expect(boatCount).toBeGreaterThan(0);
//   const testCount = Math.min(boatCount, 10);

//   // Check each boat has required content
//   for (let i = 0; i < testCount; i++) {
//     const boat = boatItems.nth(i);

//     // Check image
//     const image = boat.locator('img');
//     await expect(image).toBeVisible();

//     // // Check price
//     const price = boat.locator('text=/\\$[\\d,]+/');
//     await expect(price).toBeVisible();

//     // // Check title/name
//     const title = boat.locator('[class*="title"], [class*="name"], h3, h4, h5');
//     await expect(title.first()).toBeVisible();

//     // // Check address/location
//     const address = boat.locator('[class*="search-results_address"]');
//     await expect(address).toBeVisible();
//   }
// });

// test('Test Save Boat Working Correctly', async ({ page, context }) => {
//   // Set authentication cookie
//   await context.addCookies([
//     { name: sessionName, value: sessionValue, domain: domain, path: '/' }
//   ]);

//   await page.goto(`${homepageUrl}/search`);
//   await page.waitForLoadState('networkidle');

//   // Get first boat and hover to show heart icon
//   const firstBoat = page.locator('.search-results_item__BB03T').first();
//   await expect(firstBoat).toBeVisible();
//   await firstBoat.hover();
  
//   // Find and verify heart icon is visible
//   const heartIcon = firstBoat.locator('.search-results_icons__hTETI button');
//   await expect(heartIcon).toBeVisible();
  
//   // Get the SVG path element for checking fill color
//   const heartPath = heartIcon.locator('svg path').first();
  
//   // Check initial state (unfilled)
//   const initialFill = await heartPath.getAttribute('fill');
//   expect(initialFill).toBe('#1C1C1C');
  
//   // Click to save/favorite
//   await heartIcon.click();
//   await page.waitForTimeout(1000);
//   await firstBoat.hover(); // Hover again to see updated state
  
//   // Verify heart is now filled
//   const filledFill = await heartPath.getAttribute('fill');
//   expect(filledFill).toBe('#fff');
  
// });

// test('Test Saved Boats List', async ({ page, context }) => {
//   // Set authentication cookie
//   await context.addCookies([
//     { name: sessionName, value: sessionValue, domain: domain, path: '/' }
//   ]);

//   await page.goto(`${homepageUrl}/favorites`);
//   await page.waitForLoadState('networkidle');

//   // Verify page header shows "Saved Boats"
//   const pageHeader = page.locator('.styles_h1__W7XX5');
//   await expect(pageHeader).toBeVisible();
  
//   // Find all saved boat cards
//   const savedBoatCards = page.locator('.search-results_item__BB03T');
//   const savedBoatCount = await savedBoatCards.count();
//   expect(savedBoatCount).toBeGreaterThan(0);
  
//   // Test each saved boat has critical content
//   for (let i = 0; i < savedBoatCount; i++) {
//     const boat = savedBoatCards.nth(i);

//     // Check image
//     const image = boat.locator('img');
//     await expect(image).toBeVisible();

//     // // Check price
//     const price = boat.locator('text=/\\$[\\d,]+/');
//     await expect(price).toBeVisible();

//     // // Check title/name
//     const title = boat.locator('[class*="title"], [class*="name"], h3, h4, h5');
//     await expect(title.first()).toBeVisible();

//     // // Check address/location
//     const address = boat.locator('[class*="search-results_address"]');
//     await expect(address).toBeVisible();
//   }
  
// });

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
  const descriptionSpan = await page.locator('[class*="description"] p').first();
  const contactForm = await page.locator('form, .contact, [class*="contact"]').first().isVisible({ timeout: 5000 });
  const imageCount = await page.locator('img').count();
  const locationInfo = await page.locator('[class*="location"], .location').first().isVisible({ timeout: 5000 });

  expect(page.url()).toContain('/boat/');
  expect(pageTitle).toMatch(/\w+/);
  expect(contactForm).toBeTruthy();
  expect(imageCount).toBeGreaterThan(2);
  expect(locationInfo).toBeTruthy();

  // Assert description is found and visible
  await expect(descriptionSpan).toBeVisible();

  // Check color and background
  const color = await descriptionSpan.evaluate(el => getComputedStyle(el).color);

  expect(color).not.toMatch(/rgb\(255,\s*255,\s*255\)/); // not white text

});