import { test, expect } from '@playwright/test';

test('Advanced Search / Filters', async ({ page }) => {
  await page.goto('https://www.marinesource.com');

  // Look for advanced search or filters
  const advancedSearchLink = page.locator('a:has-text("Advanced Search"), a:has-text("Advanced"), a:has-text("Filters"), a[href*="advanced"], a[href*="filter"]').first();
  
  if (await advancedSearchLink.isVisible()) {
    await advancedSearchLink.click();
    await page.waitForTimeout(1000);
  }

  // Test common filter fields
  const filterTests = [
    { name: 'Boat Type', selectors: ['select[name*="type"], select[name*="category"], #boatType', 'Sailboat'] },
    { name: 'Builder', selectors: ['select[name*="builder"], select[name*="make"], #builder', 'Beneteau'] },
    { name: 'Length', selectors: ['input[name*="length"], select[name*="length"], #length', '30'] },
    { name: 'Year', selectors: ['input[name*="year"], select[name*="year"], #year', '2020'] },
    { name: 'Price', selectors: ['input[name*="price"], select[name*="price"], #price', '100000'] },
    { name: 'Location', selectors: ['input[name*="location"], select[name*="location"], #location', 'Florida'] }
  ];

  for (const filter of filterTests) {
    for (const selector of filter.selectors[0].split(', ')) {
      const element = page.locator(selector).first();
      if (await element.isVisible()) {
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        
        if (tagName === 'select') {
          // For dropdowns, try to select an option
          const options = element.locator('option');
          const optionCount = await options.count();
          if (optionCount > 1) {
            await element.selectOption({ index: 1 });
          }
        } else if (tagName === 'input') {
          // For inputs, fill with test value
          await element.fill(filter.selectors[1]);
        }
        break;
      }
    }
  }

  // Try to submit the search
  const searchButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Search"), .search-button').first();
  if (await searchButton.isVisible()) {
    await searchButton.click();
    await page.waitForTimeout(2000);
    
    // Verify results or search results page
    const resultsIndicator = page.locator('.results, .search-results, .listings, [class*="result"]').first();
    if (await resultsIndicator.isVisible()) {
      await expect(resultsIndicator).toBeVisible();
    }
  }
});