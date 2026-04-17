const fs = require('fs');
const path = require('path');
const os = require('os');
const zlib = require('zlib');
const { Buffer } = require('buffer');
(async () => {
  try {
    const html = fs.readFileSync(
      path.join(__dirname, '..', 'reports', 'html', 'index.html'),
      'utf8'
    );
    const m = html.match(/<template id="playwrightReportBase64">([\s\S]*?)<\/template>/);
    if (!m) {
      console.error('template not found');
      process.exit(1);
    }
    const b64 = m[1].trim();
    const zipPath = path.join(__dirname, '..', 'reports', 'html', 'report.zip');
    fs.writeFileSync(zipPath, Buffer.from(b64, 'base64'));
    console.log('Wrote zip to', zipPath);
    // unzip
    const unzipDir = path.join(__dirname, '..', 'reports', 'html', '_unzipped');
    if (!fs.existsSync(unzipDir)) fs.mkdirSync(unzipDir, { recursive: true });
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(unzipDir, true);
    console.log('Extracted to', unzipDir);
    // list files
    function walk(dir) {
      const results = [];
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) results.push(...walk(full));
        else results.push(full);
      }
      return results;
    }
    const files = walk(unzipDir);
    console.log('Files in zip:');
    files.forEach((f) => console.log(' -', path.relative(unzipDir, f)));
    // try to find report json or html
    const possible = files.filter((f) => /report|index|results|playwright/i.test(f));
    console.log('Possible report files:');
    possible.forEach((f) => console.log(' -', path.relative(unzipDir, f)));
    // search for test title strings inside extracted files
    const searchTerms = [
      'should not login with invalid credentials',
      'should login with valid credentials',
      'Login flow',
    ];
    for (const term of searchTerms) {
      console.log('\nSearching for:', term);
      let found = false;
      for (const f of files) {
        const ext = path.extname(f).toLowerCase();
        if (['.html', '.json', '.js', '.txt', '.md'].includes(ext)) {
          const txt = fs.readFileSync(f, 'utf8');
          if (txt.includes(term)) {
            console.log(' Found in', path.relative(unzipDir, f));
            found = true;
            break;
          }
        }
      }
      if (!found) console.log(' Not found');
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
