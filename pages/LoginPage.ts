import { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../utils/selectors';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    this.page = page;
    // seletores da página de login do saucedemo (centralizados)
    this.username = page.locator(SELECTORS.login.username);
    this.password = page.locator(SELECTORS.login.password);
    this.submit = page.locator(SELECTORS.login.submit);
  }

  async goto() {
    // navega para a página inicial (login)
    await this.page.goto('/');
  }

  async login(user: string, pass: string): Promise<void> {
    await this.username.fill(user);
    await this.password.fill(pass);
    await Promise.all([
      this.page.waitForNavigation({ url: '**/inventory.html' }),
      this.submit.click(),
    ]);
  }

  async isLogged(): Promise<boolean> {
    // verifica se a página de produtos está visível
    return this.page.locator('text=Products').isVisible();
  }
}
