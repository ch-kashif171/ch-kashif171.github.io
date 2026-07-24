import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = path.join(root, 'cv.html');
const pdfPath = path.join(root, 'cv.pdf');

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA ?? '', 'Google\\Chrome\\Application\\chrome.exe'),
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);

  return candidates.find((candidate) => fs.existsSync(candidate));
}

const executablePath = findChrome();
if (!executablePath) {
  console.error('Chrome or Edge not found. Set CHROME_PATH to your browser executable.');
  process.exit(1);
}

if (!fs.existsSync(htmlPath)) {
  console.error(`Missing ${htmlPath}`);
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, {
    waitUntil: 'networkidle0',
  });

  await page.emulateMediaType('print');
  await page.addStyleTag({
    content: `
      .page {
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
        margin: 0 !important;
        box-shadow: none !important;
        width: 210mm !important;
        height: 297mm !important;
      }
      .page + .page { page-break-before: always !important; }
      html, body {
        background: #fff !important;
        min-height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    `,
  });

  await page.pdf({
    path: pdfPath,
    printBackground: true,
    format: 'A4',
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  console.log(`Wrote ${pdfPath}`);
} finally {
  await browser.close();
}
