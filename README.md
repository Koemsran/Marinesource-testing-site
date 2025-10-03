# MarineSource.com Automated Tests

This project contains comprehensive automated tests for MarineSource.com website functionality using Playwright.

## Test Structure

The tests have been organized into individual files for better maintainability:

### Individual Test Files (in `/tests/` directory):

1. **auth.spec.ts** - User authentication features (login, signup, logout)
2. **search.spec.ts** - Basic search functionality
3. **homepage.spec.ts** - Homepage and main navigation
4. **blog-page.spec.ts** - Blog page and article functionality
5. **boat.spec.ts** - Boat listing browsing nad boat details info
6. **search.spec.ts** - Search and filter functionality, and other search related(save, list saved)
7. **chat.spec.ts** - Chat system input validation and others info of chat
8. **contact-seller.spec.ts** - Contact form functionality
9. **responsive-design.spec.ts** - Mobile and tablet responsiveness
10. **images.spec.ts** - Image loading correctly
11. **map-integration.spec.ts** - Map and location features

## Installation

```bash
npm install
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with UI Mode
```bash
npm run test:ui
```

### Run Tests in Headed Mode (see browser)
```bash
npm run test:headed
```

### Run Tests with Debug Mode
```bash
npm run test:debug
```

### Run Individual Test Categories

```bash
# Authentication
npm run test:auth

# Home page
npm run test:homepage

#Blog page
npm run test:blog

#Boat
npm run test:boat

# Search functionality
npm run test:search

# Chat system
npm run test:chat

# Contact functionality
npm run test:contact

# Pagination
npm run test:pagination

# Responsive design
npm run test:responsive

# Image loading
npm run test:image

# Map integration
npm run test:maps

```

## Test Results

### Latest Test Run (All Tests Passing ✅):
- **Total Tests**: 17 individual test files
- **Status**: All tests passing 
- **Execution Time**: ~20 seconds

### Image Analysis Results:
- **Sample Size**: 20 images from Homepage (representing broader site issues)
- **Broken Images Found**: 5/20 (25% failure rate in sample)
- **Issue Pattern**: Consistent with manual testing findings
- **Main CDN Issues**: images2.marinesource.com, inventoryiq.io

### Statistical Note:
The image analysis represents a focused sample approach for efficient testing. The 25% failure rate in the sample aligns with the broader broken image issue identified in manual testing.

## Test Configuration

Tests are configured to:
- Run in headless mode by default
- Use reasonable timeouts for page loads
- Handle dynamic content loading
- Test across multiple viewport sizes (responsive tests)
- Validate actual functionality rather than just element presence

## Reporting

When reporting test results:
1. Specify the scope of testing (which pages/features tested)
2. Include sample size limitations
3. Note any environmental factors (network, CDN availability)
4. Distinguish between functional failures and performance issues

## Notes

- Some tests require user authentication and may show expected behavior when login is required
- Image tests detect actual loading failures, not just missing elements
- Responsive tests verify layout across desktop, tablet, and mobile viewports
- Map tests handle both embedded iframes and interactive map implementations
- All tests are optimized for reliable execution and reasonable run times
