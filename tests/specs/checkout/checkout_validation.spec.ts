import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';

test('checkout — validações: campos obrigatórios', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('standard_user', 'secret_sauce');

  // adicionar um item e iniciar checkout
  await page.locator('button:has-text("Add to cart")').first().click();
  await page.locator('.shopping_cart_link').click();
  await page.click('button:has-text("Checkout")');

  // não preencher firstName para disparar validação
  await page.fill('[data-test="lastName"]', 'Repulho');
  await page.fill('[data-test="postalCode"]', '12345');
  await page.click('[data-test="continue"]');

  // erro de validação visível
  await expect(page.locator('[data-test="error"]')).toBeVisible();
});
