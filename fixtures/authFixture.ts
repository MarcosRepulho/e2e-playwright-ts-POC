import { Page } from '@playwright/test';

export async function loginViaUI(page: Page, username = 'demo-user', password = 'demo-pass') {
  await page.goto('/login');
  await page.fill('#username', username);
  await page.fill('#password', password);
  await Promise.all([
    page.waitForNavigation({ url: '**/dashboard' }),
    page.click('button[type=submit]')
  ]);
}
