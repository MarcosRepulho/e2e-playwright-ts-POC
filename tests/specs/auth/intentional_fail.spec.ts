import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';

// await expect(page).toHaveURL(/inventory.html/);
// Cenário intencionalmente falho: espera que o usuário bloqueado consiga logar.
test('cenário intencionalmente falho — locked_out_user deveria autenticar', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();

  // tentar logar com usuário bloqueado (no sistema ele é negado)
  await login.username.fill('locked_out_user');
  await login.password.fill('secret_sauce');
  await login.submit.click();

  // expectativa incorreta de sucesso — este assert deve falhar
  await expect(page).toHaveURL(/inventory.html/);
});
