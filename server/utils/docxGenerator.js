const HTMLtoDOCX = require('html-to-docx');
const logger = require('./logger');

const FONT_FAMILY = {
  default: 'Calibri',
  inter: 'Calibri'
};

// CSS used inside the docx body. html-to-docx supports a limited subset
// (font-family, font-size, font-weight, color, background-color, text-align).
function buildCss(fontKey) {
  const family = FONT_FAMILY[fontKey] || FONT_FAMILY.default;
  return `
  body { font-family: '${family}', Arial, sans-serif; font-size: 11pt; color: #1a1a1a; }
  h1 { font-size: 16pt; color: #5B2C8E; }
  h2 { font-size: 14pt; color: #5B2C8E; text-align: center; }
  h3 { font-size: 11pt; color: #5B2C8E; text-transform: uppercase; }
  h4 { font-size: 10pt; color: #5B2C8E; }
  p { font-size: 11pt; }
  table { border-collapse: collapse; width: 100%; }
  th { background-color: #5B2C8E; color: #FFFFFF; padding: 6px 10px; text-align: left; font-weight: bold; font-size: 10pt; }
  td { padding: 5px 10px; font-size: 10pt; }
  ul { margin-left: 20px; }
  .clinic-logo { max-height: 60px; }
  .hygiene-image img { max-width: 240px; }
  .header-left, .header-right { font-size: 9pt; color: #555555; }
  .header-center { text-align: center; }
  .clinic-name { font-size: 16pt; color: #5B2C8E; }
  .clinic-sub { font-size: 8pt; color: #888888; }
  .report-title { font-size: 14pt; color: #5B2C8E; text-align: center; font-weight: bold; }
  `;
}

// html-to-docx ignores flexbox and is fragile with inline styles on table cells,
// so we just stack the three header sections vertically. The clinic logo + name
// remain prominently centered; address and contact info follow as plain blocks.
function adaptHtmlForDocx(htmlBody) {
  return htmlBody.replace(
    /<div class="header">\s*<div class="header-left">([\s\S]*?)<\/div>\s*<div class="header-center">([\s\S]*?)<\/div>\s*<div class="header-right">([\s\S]*?)<\/div>\s*<\/div>/,
    (_, left, center, right) => `
      <div class="header-center" style="text-align:center;">${center}</div>
      <p style="text-align:center; font-size:9pt; color:#555555;">${left.replace(/<br\s*\/?>/g, ' • ')}</p>
      <p style="text-align:center; font-size:9pt; color:#555555;">${right.replace(/<br\s*\/?>/g, ' • ')}</p>
    `
  );
}

async function generateDocx(htmlBody, doctorSignature, parentSignature, font = 'default') {
  try {
    let finalHtml = adaptHtmlForDocx(htmlBody);

    // Inject signatures the same way as the PDF generator does
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

    const docxBuffer = await HTMLtoDOCX(fullHtml, null, {
      table: { row: { cantSplit: true } },
      footer: false,
      pageNumber: false,
      orientation: 'portrait',
      margins: { top: 720, right: 720, bottom: 720, left: 720 } // 0.5"
    });

    return docxBuffer;
  } catch (err) {
    logger.error({ err }, 'DOCX generation failed');
    throw err;
  }
}

module.exports = { generateDocx };
