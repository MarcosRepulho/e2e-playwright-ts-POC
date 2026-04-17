import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { InventoryPage } from '../../../pages/InventoryPage';

test.describe('Fluxo do carrinho', () => {
  test('adiciona dois itens ao carrinho e remove na página do carrinho', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    const inventory = new InventoryPage(page);
    // adicionar dois itens usando os botões visíveis (mais resiliente a reordenações)
    const addButtons = page.locator('button:has-text("Add to cart")');
    await addButtons.first().click();
    await addButtons.first().click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // abrir o carrinho e verificar itens
    await inventory.openCart();
    await expect(page.locator('.cart_item')).toHaveCount(2);

    // remover ambos no carrinho (botões Remove disponíveis)
    const removeButtons = page.locator('button:has-text("Remove")');
    await removeButtons.first().click();
    await removeButtons.first().click();

    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('adiciona dois itens e remove a partir da página de inventário', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    const inventory = new InventoryPage(page);
    // adicionar dois itens usando os botões visíveis
    const addButtons2 = page.locator('button:has-text("Add to cart")');
    await addButtons2.first().click();
    await addButtons2.first().click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // remover a partir da página de inventário (clicando nos botões Remove visíveis)
    const removeButtons2 = page.locator('button:has-text("Remove")');
    await removeButtons2.first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await removeButtons2.first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});
