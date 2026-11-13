const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function clickByText(page, tag, textSubstr) {
  return page.evaluate((tag, textSubstr) => {
    const elements = Array.from(document.querySelectorAll(tag));
    const target = elements.find(el => el.textContent.includes(textSubstr));
    if (target) {
      target.click();
      return true;
    }
    return false;
  }, tag, textSubstr);
}

async function run() {
  console.log('📸 Launching Puppeteer to capture Judge Verification Proof...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  // 1. Load Dashboard
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const outDir = path.join(__dirname, '..', 'public');
  const artifactDir = '/Users/samarthr/.gemini/antigravity/brain/21468e88-f767-4ba3-b77f-d004b74d5acb';

  await page.screenshot({ path: path.join(outDir, 'proof-step01-dashboard.png') });
  console.log('✓ Captured proof-step01-dashboard.png');

  // 2. Click Step 01: Simulate Sales
  console.log('Clicking STEP 01: Simulate Sales...');
  await clickByText(page, 'button', 'STEP 01');

  // Wait for rush hour modal
  await new Promise(r => setTimeout(r, 600));
  await clickByText(page, 'button', 'Skip to Report');

  // Wait for Step 02 Report Modal
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, 'proof-step02-report.png') });
  console.log('✓ Captured proof-step02-report.png');

  // 3. Click Proceed to Step 03
  console.log('Clicking Proceed to STEP 03: Trigger Milk Shock...');
  await clickByText(page, 'button', 'STEP 03');

  // Wait for Step 03 Milk Shock Modal
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, 'proof-step03-milk-shock.png') });
  console.log('✓ Captured proof-step03-milk-shock.png');

  // 4. Click Pivot Option & Apply Strategy
  console.log('Selecting Pivot Menu: Fitness & Herbal Kadha...');
  await clickByText(page, 'h5', 'Pivot Menu');
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: path.join(outDir, 'proof-step03-decision-selected.png') });
  console.log('✓ Captured proof-step03-decision-selected.png');

  await clickByText(page, 'button', 'Confirm & Apply Strategy');
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(outDir, 'proof-step03-decision-resolved.png') });
  console.log('✓ Captured proof-step03-decision-resolved.png');

  // Copy all proof files to artifact directory
  const files = [
    'proof-step01-dashboard.png',
    'proof-step02-report.png',
    'proof-step03-milk-shock.png',
    'proof-step03-decision-selected.png',
    'proof-step03-decision-resolved.png'
  ];

  for (const f of files) {
    const src = path.join(outDir, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(artifactDir, f));
    }
  }

  await browser.close();
  console.log('🎉 All Judge Proof Screenshots successfully generated and archived!');
}

run().catch(err => {
  console.error('Puppeteer proof script failed:', err);
  process.exit(1);
});
