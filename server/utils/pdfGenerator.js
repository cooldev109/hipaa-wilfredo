const puppeteer = require('puppeteer');
const logger = require('./logger');

const FONT_OPTIONS = {
  default: {
    family: "'Segoe UI', Arial, Helvetica, sans-serif",
    fontImport: ''
  },
  inter: {
    family: "'Inter', 'Segoe UI', Arial, sans-serif",
    fontImport: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`
  }
};

function buildCss(fontKey) {
  const font = FONT_OPTIONS[fontKey] || FONT_OPTIONS.default;
  return `
  ${font.fontImport}
  @page { margin: 60px 50px; size: letter; }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: ${font.family};
    font-size: 11pt;
    color: #1a1a1a;
    line-height: 1.5;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #5B2C8E;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }

  .header-left, .header-right { font-size: 9pt; color: #555; }
  .header-right { text-align: right; }

  .header-center { text-align: center; }
  .clinic-logo { max-height: 60px; width: auto; display: block; margin: 0 auto 4px; }
  .clinic-name { font-size: 18pt; color: #5B2C8E; margin: 0; letter-spacing: 2px; }
  .clinic-sub { font-size: 8pt; color: #888; margin: 0; }

  .report-title {
    text-align: center;
    font-size: 14pt;
    color: #5B2C8E;
    margin: 15px 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .section {
    margin-bottom: 14px;
    page-break-inside: avoid;
  }

  h3 {
    font-size: 11pt;
    color: #5B2C8E;
    border-bottom: 1px solid #ddd;
    padding-bottom: 3px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  p { margin-bottom: 6px; text-align: justify; }

  ul { margin-left: 20px; margin-bottom: 8px; }
  li { margin-bottom: 3px; }

  .info-table { width: 100%; margin-bottom: 10px; }
  .info-table td { padding: 2px 8px; font-size: 10.5pt; }
  .info-table td:first-child { width: 180px; color: #555; }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0;
    font-size: 10pt;
  }

  .data-table th {
    background-color: #5B2C8E;
    color: white;
    padding: 6px 10px;
    text-align: left;
    font-weight: 600;
    font-size: 9pt;
  }

  .data-table td {
    padding: 5px 10px;
    border-bottom: 1px solid #e5e5e5;
  }

  .data-table tr:nth-child(even) td { background-color: #f9f7ff; }

  .signatures {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    padding-top: 20px;
  }

  .signature-block {
    text-align: center;
    width: 45%;
  }

  .signature-line {
    min-height: 60px;
    border-bottom: 1px solid #333;
    margin-bottom: 5px;
  }

  .signature-line img {
    max-height: 55px;
    display: block;
    margin: 0 auto;
  }

  .signature-block p {
    font-size: 9pt;
    color: #555;
    text-align: center;
    margin: 2px 0;
  }
`;
}

async function generatePdf(htmlBody, doctorSignature, parentSignature, font = 'default') {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Inject signatures into HTML if present
    let finalHtml = htmlBody;
    if (doctorSignature) {
      finalHtml = finalHtml.replace(
        '<div class="signature-line" id="doctor-signature"></div>',
        `<div class="signature-line" id="doctor-signature"><img src="${doctorSignature}" /></div>`
      );
    }
    if (parentSignature) {
      finalHtml = finalHtml.replace(
        '<div class="signature-line" id="parent-signature"></div>',
        `<div class="signature-line" id="parent-signature"><img src="${parentSignature}" /></div>`
      );
    }

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><style>${buildCss(font)}</style></head>
        <body>${finalHtml}</body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: { top: '60px', bottom: '60px', left: '50px', right: '50px' }
    });

    return pdfBuffer;
  } catch (err) {
    logger.error({ err }, 'PDF generation failed');
    throw err;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { generatePdf };
