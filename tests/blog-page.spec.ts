import { test, expect } from '@playwright/test';

const homepageUrl = 'https://www.marinesource.com';
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

// Test clicking on blog posts to navigate to individual post pages
test('Individual Post Pages', async ({ page }) => {
  await page.goto(blogPageUrl);
  
  // List of items that could represent blog posts and click the first one
  const blogPostItems = page.locator('a[class*="styles_itemContainer"]');
  await blogPostItems.first().click();

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/\/blog\/.+/);

  // Check page make sure nav is still visible
  const header = page.locator('.new-navigation_navigation__0clnq');
  await expect(header).toBeVisible();

  // Check blog post content is visible
  const postContent = page.locator('header, main, footer');
  expect(await postContent.count()).toBe(3);
  for (let i = 0; i < await postContent.count(); i++) {
    await expect(postContent.nth(i)).toBeVisible();
  }

  // Check "Back" button is visible and can back to blog page
  const backButton = page.locator('a[class*="blog_back__VVmUY"]').first();
  await expect(backButton).toBeVisible();
  await backButton.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(blogPageUrl);

});

// Test search functionality with the "price" keyword and check for broken links
test('Search Features', async ({ page }) => {
  await page.goto(blogPageUrl);
  await page.waitForLoadState('networkidle');

  // ========== Search for "price" ==========

  const searchInput = page.locator('.styles_searchInput__4e2ia');
  await expect(searchInput).toBeVisible();
  
  await searchInput.fill('price');
  await page.waitForTimeout(1000);

  // Check if search results update
  const blogPosts = page.locator('a[class*="styles_itemContainer"]');
  const postCount = await blogPosts.count();
  expect(postCount).toBeGreaterThan(0);

  // Check for undefined/broken links
  let validLinks = 0;
  let problemsFound = [];

  for (let i = 0; i < postCount; i++) {
    const href = await blogPosts.nth(i).getAttribute('href');
    
    if (!href || href.includes('undefined')) {
      problemsFound.push(`Post ${i + 1}: Invalid link - ${href}`);
    } else {
      validLinks++;
    }
  }
  console.log(`Valid links: ${validLinks}/${postCount}`);
  expect(validLinks).toBeGreaterThan(0);

  await searchInput.clear();
  await page.waitForTimeout(1000);

});

// // Test image-based slider navigation arrows (next/previous functionality)
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

// // Test pagination buttons to verify page numbers change (1 of 6 → 2 of 6)
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
    console.log('No next button found; possibly only one page of results.');
    expect(initialPageText).toContain('of');
  }
});
