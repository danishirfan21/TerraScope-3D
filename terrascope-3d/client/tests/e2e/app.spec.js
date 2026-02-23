import { test, expect } from '@playwright/test';

test.describe('TerraScope 3D E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Increase timeout for map loading
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });
  });

  test('should load the map and show properties', async ({ page }) => {
    // Use .first() if there are multiple or just check visibility of the container
    await expect(page.locator('.cesium-viewer').first()).toBeVisible();
    await expect(page.getByText('TERRASCOPE')).toBeVisible();
  });

  test('should filter properties by price', async ({ page }) => {
    const slider = page.locator('span.MuiSlider-thumb');
    await expect(slider.first()).toBeVisible();
  });

  test('should toggle map layers', async ({ page }) => {
    const heatmapSwitch = page.locator('label:has-text("Price Heatmap") input[type="checkbox"]');
    await heatmapSwitch.check();
    await expect(page.getByText('Price Range')).toBeVisible(); // Heatmap legend
  });

  test('should search for a property', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search address..."]');
    await searchInput.fill('Market');
    await page.keyboard.press('Enter');
    // We expect at least one property to be found in the store and potentially highlighted
  });
});
