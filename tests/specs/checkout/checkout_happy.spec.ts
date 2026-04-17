import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { InventoryPage } from '../../../pages/InventoryPage';

test('checkout — fluxo feliz: adiciona itens e finaliza pedido', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('standard_user', 'secret_sauce');

  // adicionar dois itens distintos
  const addButtons = page.locator('button:has-text("Add to cart")');
  await addButtons.nth(0).click();
  await addButtons.nth(1).click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  const inventory = new InventoryPage(page);
  await inventory.openCart();
  await expect(page.locator('.cart_item')).toHaveCount(2);

  // iniciar checkout
  await page.click('button:has-text("Checkout")');

  // preencher informações de envio
  await page.fill('[data-test="firstName"]', 'Marcos');
  await page.fill('[data-test="lastName"]', 'Repulho');
  await page.fill('[data-test="postalCode"]', '12345');
  await page.click('[data-test="continue"]');

  // finalizar pedido
  await page.click('[data-test="finish"]');
  await expect(page.locator('.complete-header')).toHaveText(/THANK YOU/i);
});
