const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
(async () => {
  try {
    const { chromium } = require('playwright');
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } });

    const filePath = path.resolve(__dirname, '..', 'reports', 'html', 'index.html');
    if (!fs.existsSync(filePath)) {
      console.error('Arquivo não encontrado:', filePath);
      process.exit(1);
    }

    const fileUrl = pathToFileURL(filePath).href;
    let navigated = false;
    try {
      await page.goto(fileUrl, { waitUntil: 'load', timeout: 10000 });
      navigated = true;
    } catch (err) {
      console.warn('Falha ao abrir via file:// — tentando setContent():', err.message);
      const html = fs.readFileSync(filePath, 'utf8');
      await page.setContent(html, { waitUntil: 'load', timeout: 10000 });
    }

    // esperar por algum texto identificador da suíte
    await page.waitForSelector('text=Login flow', { timeout: 5000 });

    const locator = page.locator('text=should not login with invalid credentials').first();
    if (!(await locator.count())) {
      console.error('Não encontrei o item do teste inválido no relatório.');
      await browser.close();
      process.exit(1);
    }

    const box = await locator.boundingBox();
    const screenshotPath = path.resolve(__dirname, '..', 'reports', 'report-invalid-test.png');
    if (box) {
      const clip = {
        x: Math.max(0, box.x - 20),
        y: Math.max(0, box.y - 120),
        width: Math.min(1100, box.width + 40),
        height: Math.min(900, box.height + 240)
      };
      await page.screenshot({ path: screenshotPath, clip });
      console.log('Screenshot salva em', screenshotPath);
    } else {
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log('Bounding box não encontrado — full page salvo em', screenshotPath);
    }

    await browser.close();
    process.exit(0);
  } catch (e) {
    console.error('Erro ao capturar screenshot:', e);
    process.exit(1);
  }
})();
