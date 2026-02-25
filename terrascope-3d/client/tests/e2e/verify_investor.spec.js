
import { test, expect } from '@playwright/test';

test('Investor Mode transformation debug', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  test.setTimeout(60000);

  await page.goto('http://localhost:5173');

  // Wait for body to be ready
  await page.waitForSelector('body');

  // Take a screenshot immediately to see what's happening
  await page.screenshot({ path: 'debug_load.png' });

  // Log the body content
  const bodyContent = await page.evaluate(() => document.body.innerHTML);
  console.log('BODY CONTENT LENGTH:', bodyContent.length);
  if (bodyContent.length < 500) {
      console.log('BODY CONTENT:', bodyContent);
  }

  // Try to find the title
  const title = page.locator('text=TERRASCOPE 3D');
  await title.waitFor({ state: 'visible', timeout: 30000 });

  // Toggle Investor Mode
  const investorToggle = page.getByLabel('INVESTOR MODE');
  await investorToggle.click();

  // Check for Dashboard
  await expect(page.locator('text=Enterprise Intelligence')).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: 'debug_investor_active.png' });
});
