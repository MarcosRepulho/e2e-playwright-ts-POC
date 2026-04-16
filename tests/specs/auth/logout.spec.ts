import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { InventoryPage } from '../../../pages/InventoryPage';

test.describe('Fluxo de logout', () => {
  test('deve deslogar e retornar para a página de login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    const inventory = new InventoryPage(page);
    await inventory.logout();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('deve deslogar a partir da página do carrinho', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    // navegar para o carrinho e então deslogar
    await page.goto('/cart.html');
    const inventory = new InventoryPage(page);
    await inventory.logout();

    await expect(page.locator('#login-button')).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
  });

  test('após logout, acesso direto a /inventory.html redireciona para login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    const inventory = new InventoryPage(page);
    await inventory.logout();

    // tentar acessar inventory diretamente
    await page.goto('/inventory.html');
    // deve ver o botão de login novamente
    await expect(page.locator('#login-button')).toBeVisible();
    await expect(page).not.toHaveURL(/inventory.html/);
  });
});
