import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';

test('carrinho persiste após reload da página', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('standard_user', 'secret_sauce');

  // adicionar dois itens
  const addButtons = page.locator('button:has-text("Add to cart")');
  await addButtons.nth(0).click();
  await addButtons.nth(1).click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  // recarregar a página e verificar persistência
  await page.reload();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  // abrir carrinho e conferir contagem
  await page.locator('.shopping_cart_link').click();
  await expect(page.locator('.cart_item')).toHaveCount(2);
});
