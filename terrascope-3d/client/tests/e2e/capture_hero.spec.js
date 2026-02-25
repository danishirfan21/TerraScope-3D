import { test, expect } from '@playwright/test';

test('capture radar chart hero', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForSelector('canvas');

  // Click around to find a building
  const coordinates = [[500, 500], [600, 400], [400, 600], [300, 300]];
  for (const [x, y] of coordinates) {
    await page.mouse.click(x, y);
    await page.waitForTimeout(1000);
    if (await page.isVisible('.property-panel')) break;
  }

  await page.screenshot({ path: '../../final_radar_hero.png' });
});
