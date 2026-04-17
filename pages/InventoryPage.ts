import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly inventoryItems: Locator;

  constructor(page: Page) {
    this.page = page;
    // seletores da página de inventário para abrir o menu e deslogar
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.inventoryItems = page.locator('.inventory_item');
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

  async addItemByIndex(index: number) {
    const addBtn = this.inventoryItems.nth(index).locator('button:has-text("Add to cart")');
    await addBtn.waitFor({ state: 'visible', timeout: 5000 });
    await addBtn.click();
    // aguardar o botão mudar para "Remove"
    const removeBtn = this.inventoryItems.nth(index).locator('button:has-text("Remove")');
    await removeBtn.waitFor({ state: 'visible', timeout: 5000 });
  }

  async removeItemByIndex(index: number) {
    const removeBtn = this.inventoryItems.nth(index).locator('button:has-text("Remove")');
    await removeBtn.waitFor({ state: 'visible', timeout: 5000 });
    await removeBtn.click();
    // aguardar o botão voltar para "Add to cart" (ou desaparecer)
    const addBtn = this.inventoryItems.nth(index).locator('button:has-text("Add to cart")');
    await addBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
  }

  async getCartCount(): Promise<number> {
    const cnt = await this.cartBadge.count();
    if (cnt === 0) return 0;
    const text = await this.cartBadge.innerText();
    return parseInt(text, 10) || 0;
  }

  async openCart() {
    await this.cartLink.click();
    await this.page.waitForSelector('.cart_list');
  }

  async removeFromCartByIndex(index: number) {
    const btn = this.page.locator('.cart_item').nth(index).locator('button:has-text("Remove")');
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    // aguardar remoção do item do carrinho
    await this.page
      .locator('.cart_item')
      .nth(index)
      .waitFor({ state: 'detached', timeout: 5000 })
      .catch(() => undefined);
  }
}
