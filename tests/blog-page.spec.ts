import { test, expect } from '@playwright/test';

const homepageUrl = 'https://marinesource.com';
const blogPageUrl = 'https://marinesource.com/blog';

// Test blog page loadding and navigation to/from homepage and shop page
test('Navigation & Page Load', async ({ page }) => {
  await page.goto(homepageUrl);

  const blogLink = page.locator('a[href*="blog"], a:has-text("Blog"), a:has-text("Knowledge Hub")').first();
  await expect(blogLink).toBeVisible();
  await blogLink.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(blogPageUrl);
  
  const shopLink = page.locator('a:has-text("Shop")').first();
  await expect(shopLink).toBeVisible();
  
  await shopLink.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/.*search.*|.*shop.*/);
  
  await page.goBack();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(blogPageUrl);
  
  const blogContent = page.locator('main, .main, .content');
  await expect(blogContent).toBeVisible();
});

// Test blog page content: header, posts, images, author info, and footer
test('Page Header, Body, and Footer Content', async ({ page }) => {
  await page.goto(blogPageUrl);
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveTitle(/blog|knowledge|marine|MarineSource|Our Blog Posts/i);
  
  const header = page.locator('header');
  await expect(header).toBeVisible();
  
  const mainContent = page.locator('main, .main, .content, [role="main"]');
  await expect(mainContent).toBeVisible();

  const blogPosts = page.locator('div:has(h2), div:has(h3), [class*="card"], [class*="item"], article');
  expect(await blogPosts.count()).toBeGreaterThan(0);
  
  const visibleImages = page.locator('img:visible');
  expect(await visibleImages.count()).toBeGreaterThan(0);
  await expect(visibleImages.first()).toBeVisible();
  
  const authorInfo = page.locator(':has-text("Rachael"), :has-text("Robert"), :has-text("Jon")');
  await expect(authorInfo.first()).toBeVisible();
  
  const footer = page.locator('footer, .footer');
  await expect(footer).toBeVisible();
});

// Test clicking on blog posts to open individual post pages and navigate back
test('Individual Post Pages', async ({ page }) => {
  await page.goto(blogPageUrl);
  await page.waitForLoadState('networkidle');

  const blogPostItems = page.locator('div:has(h2), div:has(h3), [class*="card"], [class*="item"], a[href*="blog"]');
  expect(await blogPostItems.count()).toBeGreaterThan(0);

  const firstPostItem = blogPostItems.first();
  await expect(firstPostItem).toBeVisible();
  
  const postTitleLink = firstPostItem.locator('a, h2, h3').first();
  await expect(postTitleLink).toBeVisible();
  await postTitleLink.click();
  await page.waitForLoadState('networkidle');

  await expect(page).not.toHaveURL(/.*\/blog\/?$/);
  
  const postTitle = page.locator('h1, h2').first();
  await expect(postTitle).toBeVisible();
  
  const authorInfo = page.locator(':has-text("Robert"), :has-text("Rachael"), :has-text("Jon")').first();
  await expect(authorInfo).toBeVisible();
  
  const postContent = page.locator('main, article, .content, [role="main"]');
  await expect(postContent).toBeVisible();
  
  const backLink = page.locator('a:has-text("Back"), a:has-text("Blog"), a[href*="blog"]').first();
  await expect(backLink).toBeVisible();
  await backLink.click();
  await page.waitForLoadState('networkidle');
  
  await expect(page).toHaveURL(blogPageUrl);
});

// Test search functionality with "boat" keyword and sorting features
test('Sorting & Search Features', async ({ page }) => {
  await page.goto(blogPageUrl);
  await page.waitForLoadState('domcontentloaded');

  const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Name"], [class*="search"] input');
  expect(await searchInput.count()).toBeGreaterThan(0);
  await expect(searchInput.first()).toBeVisible();
    
  await searchInput.first().fill('boat');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);

  const searchResults = page.locator('div:has(h2), div:has(h3), [class*="card"], [class*="item"], article');
  const hasResults = await searchResults.count() > 0;
  const noResultsMsg = page.locator(':has-text("No results"), :has-text("not found"), :has-text("No posts")');
  expect(hasResults || await noResultsMsg.count() > 0).toBeTruthy();
    
  await searchInput.first().clear();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  
  const sortElement = page.locator('[class*="sort"], button:has-text("By Date"), select');
  await expect(sortElement.first()).toBeVisible();
  
  const postTitles = page.locator('h2:not(:has-text("Our Blog Posts")), h3:not(:has-text("Our Blog Posts"))');
  await expect(postTitles.first()).toBeVisible();
  const initialTitles = await postTitles.allTextContents();
  expect(initialTitles.length).toBeGreaterThan(0);
  
  await sortElement.first().click();
  await page.waitForTimeout(2000);
  
  const afterSortTitles = await postTitles.allTextContents();
  expect(afterSortTitles.length).toBeGreaterThan(0);
});

// Test image-based slider navigation arrows (next/previous functionality)
test('Slider', async ({ page }) => {
  await page.goto(blogPageUrl);
  await page.waitForLoadState('domcontentloaded');

  const nextArrow = page.locator('img[class*="arrowForward"], [class*="arrowForward"]');
  const prevArrow = page.locator('img[class*="arrowBack"], [class*="arrowBack"]');
  
  await expect(nextArrow.first()).toBeVisible();
  await expect(prevArrow.first()).toBeVisible();
  
  await nextArrow.first().click();
  await page.waitForTimeout(1000);
  
  await prevArrow.first().click();
  await page.waitForTimeout(1000);
  
  const blogContent = page.locator('h1:visible, h2:visible').first();
  await expect(blogContent).toBeVisible();
});

// Test pagination buttons to verify page numbers change (1 of 6 → 2 of 6)
test('Pagination', async ({ page }) => {
  await page.goto(blogPageUrl);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);

  const paginationText = page.locator(':has-text("of")');
  await expect(paginationText.first()).toBeVisible();
  
  const initialPageText = await paginationText.first().textContent();
  
  const nextButton = page.locator('[class*="arrowForward"], [class*="arrow_forward"], button[aria-label*="next"], button:has-text("›"), button:has-text(">")');
  const prevButton = page.locator('[class*="arrowBack"], [class*="arrow_back"], button[aria-label*="prev"], button:has-text("‹"), button:has-text("<")');
  
  const hasNext = await nextButton.count() > 0;
  const hasPrev = await prevButton.count() > 0;
  
  if (hasNext) {
    await nextButton.first().click();
    await page.waitForTimeout(2000);
    
    const afterNextText = await paginationText.first().textContent();
    expect(afterNextText).not.toBe(initialPageText);
    
    if (hasPrev) {
      await prevButton.first().click();
      await page.waitForTimeout(2000);
      
      const afterPrevText = await paginationText.first().textContent();
      expect(afterPrevText).not.toBe(afterNextText);
    }
  } else {
    expect(initialPageText).toContain('of');
  }
});

// Test basic responsive design - page works on mobile viewport
test('Responsive Design', async ({ page }) => {
  await page.goto(blogPageUrl);
  
  await page.setViewportSize({ width: 375, height: 667 });
  const header = page.locator('header');
  await expect(header).toBeVisible();
  
  const blogContent = page.locator('main, .main, .content');
  await expect(blogContent).toBeVisible();
});