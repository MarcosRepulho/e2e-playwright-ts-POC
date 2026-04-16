import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // seletores da página de inventário para abrir o menu e deslogar
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async openMenu() {
    // abre o menu lateral
    await this.menuButton.click();
  }

  async logout() {
    // realiza logout e aguarda voltar para a tela de login
    await this.openMenu();
    await this.logoutLink.click();
    await this.page.waitForSelector('#login-button');
  }
}
