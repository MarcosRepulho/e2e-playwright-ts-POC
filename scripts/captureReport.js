const fs = require('fs');
(async () => {
  try {
    const { chromium } = require('playwright');
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
    await page.goto('http://localhost:9333');
    // esperar pelo conteúdo da suíte
    await page.waitForSelector('text=Login flow');
    // localizar o item do teste inválido
    const testItem = await page.locator('text=should not login with invalid credentials').first();
    if (!testItem) {
      console.error('Elemento do teste inválido não encontrado');
    }
    // scroll to element and screenshot the surrounding area
    const box = await testItem.boundingBox();
    if (box) {
      const screenshotPath = 'reports/report-invalid-test.png';
      await page.screenshot({
        path: screenshotPath,
        clip: {
          x: Math.max(0, box.x - 20),
          y: Math.max(0, box.y - 120),
          width: Math.min(1100, box.width + 40),
          height: Math.min(700, box.height + 240),
        },
      });
      console.log('Screenshot salva em', screenshotPath);
    } else {
      // fallback: full page screenshot
      const screenshotPath = 'reports/report-invalid-test.png';
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log('Bounding box não encontrado — full page salvo em', screenshotPath);
    }
    await browser.close();
  } catch (e) {
    console.error('Erro ao capturar screenshot:', e.message);
    process.exit(1);
  }
})();
