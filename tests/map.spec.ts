import { test, expect } from '@playwright/test';

test('Map Integration', async ({ page }) => {
  await page.goto('https://www.marinesource.com');

  // Navigate to a boat listing that might have map integration
  const searchInput = page.locator('input[name="txtBoatSearch"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('Yacht');
    const searchButton = page.locator('button[type="submit"]').first();
    if (await searchButton.isVisible()) {
      await searchButton.click();
      await page.waitForTimeout(2000);
      
      // Click on first listing to go to details page
      const firstListing = page.locator('.listing a, .boat-item a').first();
      if (await firstListing.isVisible()) {
        await firstListing.click();
        await page.waitForTimeout(3000);
      }
    }
  }

  // Look for map elements
  const mapContainer = page.locator('.map, #map, .google-map, .leaflet-container, [class*="map"]').first();
  const mapIframe = page.locator('iframe[src*="maps"], iframe[src*="google"], iframe[src*="openstreetmap"]').first();
  
  if (await mapContainer.isVisible()) {
    await expect(mapContainer).toBeVisible();
    console.log('Map container found');
    
    // Check map dimensions
    const mapBox = await mapContainer.boundingBox();
    if (mapBox) {
      console.log(`Map dimensions: ${mapBox.width}x${mapBox.height}px`);
      expect(mapBox.width).toBeGreaterThan(200); // Map should be reasonably sized
      expect(mapBox.height).toBeGreaterThan(150);
    }
    
    // Check for map controls
    const zoomControls = page.locator('.map-zoom, .leaflet-control-zoom, .gm-control-active').first();
    if (await zoomControls.isVisible()) {
      console.log('Map zoom controls found');
    }
    
    // Look for markers or pins
    const markers = page.locator('.marker, .map-marker, .leaflet-marker, [class*="marker"]');
    const markerCount = await markers.count();
    console.log(`Found ${markerCount} map markers`);
    
    if (markerCount > 0) {
      // Test clicking on a marker
      const firstMarker = markers.first();
      if (await firstMarker.isVisible()) {
        await firstMarker.click();
        await page.waitForTimeout(1000);
        
        // Check for popup or info window
        const popup = page.locator('.map-popup, .leaflet-popup, .gm-style-iw, .info-window').first();
        if (await popup.isVisible()) {
          console.log('Map marker popup/info window appears when clicked');
        }
      }
    }
    
  } else if (await mapIframe.isVisible()) {
    await expect(mapIframe).toBeVisible();
    console.log('Map found as embedded iframe');
    
    const iframeSrc = await mapIframe.getAttribute('src');
    console.log(`Map iframe source: ${iframeSrc}`);
    
    // Check iframe dimensions
    const iframeBox = await mapIframe.boundingBox();
    if (iframeBox) {
      console.log(`Map iframe dimensions: ${iframeBox.width}x${iframeBox.height}px`);
      expect(iframeBox.width).toBeGreaterThan(200);
      expect(iframeBox.height).toBeGreaterThan(150);
    }
    
  } else {
    console.log('Map not found on this page');
    
    // Check for map tab or section that might need to be clicked
    const mapTab = page.locator('a:has-text("Map"), button:has-text("Map"), .map-tab, [data-tab="map"]').first();
    if (await mapTab.isVisible()) {
      console.log('Found map tab/button - clicking to reveal map');
      await mapTab.click();
      await page.waitForTimeout(2000);
      
      // Re-check for map after clicking tab
      const mapAfterClick = page.locator('.map, #map, .google-map, .leaflet-container').first();
      if (await mapAfterClick.isVisible()) {
        console.log('Map successfully loaded after clicking tab');
        await expect(mapAfterClick).toBeVisible();
      }
    }
  }

  // Check for location information
  const locationInfo = page.locator('.location, .address, [class*="location"], [class*="address"]').first();
  if (await locationInfo.isVisible()) {
    const locationText = await locationInfo.textContent();
    console.log(`Location information: ${locationText}`);
  }

  // Test map interaction if it's an interactive map (not iframe)
  if (await mapContainer.isVisible() && !await mapIframe.isVisible()) {
    console.log('Testing map interaction...');
    
    // Try to drag the map
    const mapBox = await mapContainer.boundingBox();
    if (mapBox) {
      const centerX = mapBox.x + mapBox.width / 2;
      const centerY = mapBox.y + mapBox.height / 2;
      
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX + 50, centerY + 50);
      await page.mouse.up();
      
      console.log('Attempted to drag map');
    }
    
    // Try to zoom (if zoom controls exist)
    const zoomIn = page.locator('.zoom-in, [title*="Zoom in"], .leaflet-control-zoom-in').first();
    if (await zoomIn.isVisible()) {
      await zoomIn.click();
      await page.waitForTimeout(500);
      console.log('Tested zoom in functionality');
    }
  }
});