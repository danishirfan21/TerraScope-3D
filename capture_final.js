const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173?debug=true');

  // Wait for Cesium to load buildings
  await page.waitForTimeout(5000);

  // Capture Performance Overlay in Default Mode
  await page.screenshot({ path: 'final_default_debug.png' });

  // Toggle Investor Mode
  await page.click('input[type="checkbox"]'); // The Switch for Investor Mode
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'final_investor_mode.png' });

  // Select a property to show Property Panel and Focus Mode
  await page.mouse.click(640, 360); // Click center to pick a building
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'final_property_selected.png' });

  await browser.close();
})();
