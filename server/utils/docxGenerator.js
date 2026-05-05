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
  .header-table { border: 0; border-collapse: collapse; }
  .header-table tr { border: 0; }
  .header-table td { border: 0; padding: 2px 6px; vertical-align: middle; }
  .header-table .header-left { text-align: left; font-size: 9pt; color: #555555; }
  .header-table .header-right { text-align: right; font-size: 9pt; color: #555555; }
  .header-table .header-center { text-align: center; }
  .header-table .clinic-sub { font-size: 8pt; color: #888888; }
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

// Split the report HTML into:
//   - body: everything except the .header block
//   - header: a 3-column table that becomes the Word page header (repeats on every page)
// IMPORTANT: no inline styles on td elements — that crashes html-to-docx with
// "Invalid XML name: @w". Column widths set via the html `width` attribute.
function splitHeader(htmlBody) {
  const re = /<div class="header">\s*<div class="header-left">([\s\S]*?)<\/div>\s*<div class="header-center">([\s\S]*?)<\/div>\s*<div class="header-right">([\s\S]*?)<\/div>\s*<\/div>/;
  const match = htmlBody.match(re);
  if (!match) {
    return { body: htmlBody, header: null };
  }
  const [, left, center, right] = match;
  const body = htmlBody.replace(re, '');
  const header = `
    <table class="header-table" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td width="33%" class="header-left">${left}</td>
        <td width="34%" class="header-center">${center}</td>
        <td width="33%" class="header-right">${right}</td>
      </tr>
    </table>
  `;
  return { body, header };
}

async function generateDocx(htmlBody, doctorSignature, parentSignature, font = 'default') {
  try {
    let { body, header } = splitHeader(htmlBody);

    // Inject signatures into the body
    if (doctorSignature) {
      body = body.replace(
        '<div class="signature-line" id="doctor-signature"></div>',
        `<div class="signature-line" id="doctor-signature"><img src="${doctorSignature}" /></div>`
      );
    }
    if (parentSignature) {
      body = body.replace(
        '<div class="signature-line" id="parent-signature"></div>',
        `<div class="signature-line" id="parent-signature"><img src="${parentSignature}" /></div>`
      );
    }

    const css = buildCss(font);
    const wrap = (inner) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${inner}</body></html>`;

    const docxBuffer = await HTMLtoDOCX(wrap(body), header ? wrap(header) : null, {
      table: { row: { cantSplit: true } },
      header: !!header,
      footer: false,
      pageNumber: false,
      orientation: 'portrait',
      // Top margin includes space reserved for the page header (the 3-col table + a divider)
      margins: { top: 1700, right: 720, bottom: 720, left: 720, header: 360 }
    });

    return docxBuffer;
  } catch (err) {
    logger.error({ err }, 'DOCX generation failed');
    throw err;
  }
}

module.exports = { generateDocx };
