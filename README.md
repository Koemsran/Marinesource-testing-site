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