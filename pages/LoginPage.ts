import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    this.page = page;
    // seletores da página de login do saucedemo
    this.username = page.locator('#user-name');
    this.password = page.locator('#password');
    this.submit = page.locator('#login-button');
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
