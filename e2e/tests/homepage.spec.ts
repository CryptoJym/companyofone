import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Company of One/);
  });

  test('displays hero section with main heading', async ({ page }) => {
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    
    const heading = heroSection.locator('h1');
    await expect(heading).toContainText('Build Your Solo Empire');
  });

  test('navigation menu is accessible', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check main navigation links
    await expect(nav.locator('a[href="/products"]')).toBeVisible();
    await expect(nav.locator('a[href="/services"]')).toBeVisible();
    await expect(nav.locator('a[href="/about"]')).toBeVisible();
  });

  test('CTA buttons are clickable', async ({ page }) => {
    const ctaButton = page.locator('button:has-text("Get Started")').first();
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();
    
    await ctaButton.click();
    // Verify navigation or modal opens
    await expect(page).toHaveURL(/\/signup|\/register/);
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile menu button is visible
    const mobileMenuButton = page.locator('button[aria-label="Menu"]');
    await expect(mobileMenuButton).toBeVisible();
    
    // Click mobile menu
    await mobileMenuButton.click();
    
    // Check mobile menu is open
    const mobileMenu = page.locator('[role="navigation"]');
    await expect(mobileMenu).toBeVisible();
  });

  test('page loads without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(consoleErrors).toHaveLength(0);
  });

  test('accessibility - no violations', async ({ page }) => {
    // Note: Install @axe-core/playwright for full accessibility testing
    // const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    // expect(accessibilityScanResults.violations).toEqual([]);
    
    // Basic accessibility checks
    const images = await page.locator('img').all();
    for (const img of images) {
      await expect(img).toHaveAttribute('alt');
    }
    
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('performance - page loads quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});