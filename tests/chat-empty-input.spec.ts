import { test, expect } from '@playwright/test';

/**
 * Test Feature: Chat System Empty Input Validation
 * 
 * Description: Test if the chat system handles empty messages correctly.
 * This test checks what happens when users try to send empty messages or messages with only spaces.
 * 
 * What this test does:
 * 1. Go to a boat page with chat system
 * 2. Try to send completely empty message
 * 3. Try to send message with only spaces
 * 4. Check how the chat system responds to these inputs
 * 
 * Expected behavior: Chat system should validate input before allowing submission
 * Test purpose: Verify input validation works properly for user experience
 */

// Test chat system input validation - ensures empty and whitespace-only messages are rejected
test('Chat System Empty Input Validation', async ({ page }) => {
  await page.goto('https://www.marinesource.com');
  
  // Navigate to a boat listing first to access chat
  const searchInput = page.locator('input[name="txtBoatSearch"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('Yacht');
    const searchButton = page.locator('button[type="submit"]').first();
    if (await searchButton.isVisible()) {
      await searchButton.click();
      await page.waitForTimeout(2000);
      
      // Click on first listing
      const firstListing = page.locator('.listing a, .boat-item a').first();
      if (await firstListing.isVisible()) {
        await firstListing.click();
        await page.waitForTimeout(3000);
      }
    }
  }

  // Look for Marine Source chat system
  const chatTextArea = page.locator('textarea[placeholder*="Type your question"], input[placeholder*="Type your question"]').first();
  const askButton = page.locator('button:has-text("Ask"), .ask-button, [class*="ask"]').first();
  
  if (await chatTextArea.isVisible()) {
    // Test 1: Submit completely empty input
    await chatTextArea.clear();
    await chatTextArea.click();
    
    if (await askButton.isVisible()) {
      await askButton.click();
    } else {
      await chatTextArea.press('Enter');
    }
    
    await page.waitForTimeout(3000);
    
    // Check if Marine Source responded to empty input
    const marineSourceResponses = page.locator('text="Marine Source"').locator('xpath=following-sibling::*');
    
    if (await marineSourceResponses.count() > 0) {
      const latestResponse = marineSourceResponses.last();
      const responseText = await latestResponse.textContent();
      
      // FAIL the test - empty input should not generate responses
      expect(false, `Chat system should not respond to empty input but got response: "${responseText}"`).toBeTruthy();
    }
    
    // Test 2: Whitespace-only input
    await chatTextArea.clear();
    await chatTextArea.fill('   '); // Just spaces
    
    if (await askButton.isVisible()) {
      await askButton.click();
    } else {
      await chatTextArea.press('Enter');
    }
    
    await page.waitForTimeout(3000);
    
    // Check if Marine Source responded to whitespace-only input
    const whitespaceResponses = page.locator('text="Marine Source"').locator('xpath=following-sibling::*');
    const currentResponseCount = await whitespaceResponses.count();
    
    if (currentResponseCount > await marineSourceResponses.count()) {
      const latestResponse = whitespaceResponses.last();
      const responseText = await latestResponse.textContent();
      
      // FAIL the test - whitespace-only input should not generate responses
      expect(false, `Chat system should not respond to whitespace-only input but got response: "${responseText}"`).toBeTruthy();
    }
    
  } else {
    // FAIL the test if we can't find the chat system to test
    expect(false, 'Chat system not accessible - cannot test empty input validation. Check if chat is available on boat detail pages.').toBeTruthy();
  }
});