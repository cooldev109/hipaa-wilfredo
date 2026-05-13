const HTMLtoDOCX = require('html-to-docx');
const JSZip = require('jszip');
const logger = require('./logger');

// html-to-docx duplicates inline images (creates one media file per image
// occurrence, plus an extra orphan) and declares relationships for all of
// them — even unreferenced copies. MS Word rejects files with dangling
// relationships ("Word experienced an error trying to open the file").
// This pass scans each part's .rels file, finds image relationships whose
// rId is not referenced by the corresponding part, and removes both the rel
// entry and the media file.
async function removeOrphanImages(buffer) {
  const zip = await JSZip.loadAsync(buffer);

  const partsToCheck = [
    { part: 'word/document.xml', rels: 'word/_rels/document.xml.rels' },
    { part: 'word/header1.xml', rels: 'word/_rels/header1.xml.rels' },
    { part: 'word/footer1.xml', rels: 'word/_rels/footer1.xml.rels' }
  ];

  const mediaToDelete = new Set();
  let changed = false;

  for (const { part, rels } of partsToCheck) {
    const partEntry = zip.file(part);
    const relsEntry = zip.file(rels);
    if (!partEntry || !relsEntry) continue;

    const partXml = await partEntry.async('string');
    let relsXml = await relsEntry.async('string');

    // Match image relationships: <Relationship Id="rIdN" Type=".../image" Target="media/xxx.png".../>
    const relRe = /<Relationship\s+Id="(rId\d+)"\s+Type="[^"]*\/image"\s+Target="([^"]+)"[^/]*\/>/g;
    let m, anyChanged = false;
    while ((m = relRe.exec(relsXml)) !== null) {
      const [full, rId, target] = m;
      // Is this rId referenced anywhere in the part XML? html-to-docx uses
      // ns-prefixed attributes like ns19:embed="rId2", so a substring match
      // for `"rId2"` is sufficient.
      if (!partXml.includes(`"${rId}"`)) {
        relsXml = relsXml.replace(full, '');
        anyChanged = true;
        // Resolve to absolute zip path: relsTarget is relative to the part's folder
        const partFolder = part.replace(/\/[^/]+$/, '');
        const mediaPath = target.startsWith('/') ? target.slice(1) : `${partFolder}/${target}`;
        mediaToDelete.add(mediaPath);
      }
    }
    if (anyChanged) {
      // collapse blank lines left behind by removed Relationship elements
      relsXml = relsXml.replace(/\n\s*\n/g, '\n');
      zip.file(rels, relsXml);
      changed = true;
    }
  }

  for (const m of mediaToDelete) {
    if (zip.file(m)) {
      zip.remove(m);
      changed = true;
    }
  }

  if (!changed) return buffer;
  return zip.generateAsync({ type: 'nodebuffer' });
}

// OOXML schema requires <w:sectPr> to be the LAST child of <w:body>, but
// html-to-docx emits it as the FIRST child. MS Word's strict validator
// refuses to open files with this ordering ("Word experienced an error
// trying to open the file"). Mammoth and other lenient parsers accept it.
// We move the block from the start of <w:body> to just before </w:body>.
async function moveSectPrToEndOfBody(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const docEntry = zip.file('word/document.xml');
  if (!docEntry) return buffer;
  let xml = await docEntry.async('string');

  const bodyOpenRe = /<w:body>\s*(<w:sectPr>[\s\S]*?<\/w:sectPr>)\s*/;
  const m = xml.match(bodyOpenRe);
  if (!m) return buffer; // sectPr not at start — nothing to move

  const sectPr = m[1];
  // Remove the misplaced sectPr (and the whitespace right after <w:body>)
  xml = xml.replace(bodyOpenRe, '<w:body>');
  // Inject it just before </w:body>
  xml = xml.replace(/<\/w:body>/, `${sectPr}</w:body>`);

  zip.file('word/document.xml', xml);
  return zip.generateAsync({ type: 'nodebuffer' });
}

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
  .hp-logo { text-align: center; margin: 0; }
  .hp-sub { text-align: center; font-size: 9pt; color: #888888; margin: 0; }
  .hp-info { text-align: center; font-size: 9pt; color: #555555; margin: 0; }
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
//   - header: 3-column page-header table (address | logo | contact)
//
// Borders are removed by combining `border="0"` on the <table> (suppresses
// tblBorders) with inline `style="border:none"` on each <td> (suppresses
// tcBorders). Verified: with both, html-to-docx emits neither border element.
// Inline `width:%` on td crashes html-to-docx, so cells auto-size by content.
function splitHeader(htmlBody) {
  const re = /<div class="header">\s*<div class="header-left">([\s\S]*?)<\/div>\s*<div class="header-center">([\s\S]*?)<\/div>\s*<div class="header-right">([\s\S]*?)<\/div>\s*<\/div>/;
  const match = htmlBody.match(re);
  if (!match) {
    return { body: htmlBody, header: null };
  }
  const [, left, center, right] = match;
  const body = htmlBody.replace(re, '');

  const header = `
    <table border="0">
      <tr>
        <td style="border:none">${left}</td>
        <td style="border:none">${center}</td>
        <td style="border:none">${right}</td>
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
      // Top margin includes space reserved for the page header (the 3-col table + a divider).
      // IMPORTANT: footer and gutter must be explicit integers; if omitted,
      // html-to-docx serializes them as the literal string "undefined" which
      // makes MS Word refuse to open the file.
      margins: { top: 1700, right: 720, bottom: 720, left: 720, header: 360, footer: 720, gutter: 0 }
    });

    let processed = await removeOrphanImages(docxBuffer);
    processed = await moveSectPrToEndOfBody(processed);
    return processed;
  } catch (err) {
    logger.error({ err }, 'DOCX generation failed');
    throw err;
  }
}

module.exports = { generateDocx };
