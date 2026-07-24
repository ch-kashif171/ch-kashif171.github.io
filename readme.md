# CV PDF Generator

A one-command PDF generator has been added for future CV updates.

## Usage

```bash
npm install          # First time only
npm run cv:pdf       # Regenerates cv.pdf from cv.html
```

## What's Included

- **scripts/generate-cv-pdf.mjs**
    - Generates a 3-page A4 PDF from `cv.html`.
    - Automatically applies print styles during export.

- **package.json**
    - Adds the `cv:pdf` script.
    - Includes `puppeteer-core` as a development dependency.

- **.gitignore**
    - Ignores the `node_modules/` directory.

## Browser Detection

The script automatically detects **Google Chrome** or **Microsoft Edge** on Windows.

If automatic detection does not work, specify the browser executable manually:

```bash
set CHROME_PATH=C:\path\to\chrome.exe
npm run cv:pdf
```

## Updating the PDF

Whenever you make changes to `cv.html`, regenerate the PDF by running:

```bash
npm run cv:pdf
```

This refreshes `cv.pdf`, which can then be used by your portfolio or website download links.