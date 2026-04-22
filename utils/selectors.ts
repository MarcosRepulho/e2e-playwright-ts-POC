export const combine = (...sels: string[]) => sels.filter(Boolean).join(', ');

export const SELECTORS = {
  login: {
    username: combine('[data-testid="username"]', '#user-name'),
    password: combine('[data-testid="password"]', '#password'),
    submit: combine('[data-testid="login-button"]', '#login-button'),
  },
  inventory: {
    menuButton: combine('[data-testid="menu-button"]', '#react-burger-menu-btn'),
    logoutLink: combine('[data-testid="logout-link"]', '#logout_sidebar_link'),
    cartLink: combine('[data-testid="cart-link"]', '.shopping_cart_link'),
    cartBadge: combine('[data-testid="cart-badge"]', '.shopping_cart_badge'),
    inventoryItems: combine('[data-testid="inventory-item"]', '.inventory_item'),
    cartList: combine('[data-testid="cart-list"]', '.cart_list'),
    cartItem: combine('[data-testid="cart-item"]', '.cart_item'),
  },
};
