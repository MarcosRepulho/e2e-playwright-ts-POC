import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';

test.describe('Fluxo de login', () => {
  test('deve autenticar com credenciais válidas', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    // credenciais padrão do saucedemo
    await login.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('não deve autenticar com credenciais inválidas', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    // credenciais inválidas - não aguardar navegação
    await login.username.fill('invalid_user');
    await login.password.fill('wrong_pass');
    await login.submit.click();
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
    await expect(page).not.toHaveURL(/inventory.html/);
  });

  test('não deve autenticar usuário bloqueado', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    // usuário bloqueado no saucedemo
    await login.username.fill('locked_out_user');
    await login.password.fill('secret_sauce');
    await login.submit.click();
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    await expect(page).not.toHaveURL(/inventory.html/);
  });

  test('não deve autenticar com usuário vazio', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.username.fill('');
    await login.password.fill('secret_sauce');
    await login.submit.click();
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toHaveText('Epic sadface: Username is required');
    await expect(page).not.toHaveURL(/inventory.html/);
  });

  test('não deve autenticar com senha vazia', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.username.fill('standard_user');
    await login.password.fill('');
    await login.submit.click();
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toHaveText('Epic sadface: Password is required');
    await expect(page).not.toHaveURL(/inventory.html/);
  });

  test("deve autenticar 'problem_user' (com comportamento conhecido)", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    // 'problem_user' faz login, mas pode apresentar falhas visuais
    await login.username.fill('problem_user');
    await login.password.fill('secret_sauce');
    await Promise.all([
      page.waitForNavigation({ url: '**/inventory.html' }),
      login.submit.click()
    ]);
    await expect(page).toHaveURL(/inventory.html/);
    // checar título de produtos como prova de login
    await expect(page.locator('text=Products')).toBeVisible();
  });
});
