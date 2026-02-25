import { test } from '@playwright/test';

test('capture enterprise assets', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173?debug=true');

  // Wait for Cesium to load buildings
  await page.waitForTimeout(10000);

  // Capture Performance Overlay in Default Mode
  await page.screenshot({ path: '../../final_default_debug.png' });

  // Toggle Investor Mode (First switch in the toolbar)
  await page.click('.MuiSwitch-input');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '../../final_investor_mode.png' });

  // Select a property
  await page.mouse.click(640, 360);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '../../final_property_selected.png' });
});
