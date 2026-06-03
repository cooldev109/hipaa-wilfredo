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

// Replace html-to-docx's table-based header with a clean tab-stop layout that
// mirrors the client's reference DOCX:
//   line 1: Aquamarina 10              [logo]            Tel. 787-407-4814
//   line 2: Urb. Villa Blanca                            Fax. 787-258-8225
//   line 3: Caguas PR 00725                              clinicarehabilitacion10@gmail.com
// The logo is inline in the center column (using the existing image
// relationship html-to-docx already created). Tab stops control alignment so
// the layout is identical to a hand-built Word header — no table borders,
// no cell artifacts.
//
// EMU conversions used for image dimensions (1 px @ 96 DPI = 9525 EMU):
//   280 px ≈ 2667000 EMU wide   (2x the previous 140 px)
//   200 px ≈ 1905000 EMU tall   (2x the previous 100 px; logo is roughly 1.4:1)
const LOGO_WIDTH_EMU = 2667000;
const LOGO_HEIGHT_EMU = 1905000;

function buildCleanHeaderXml(imageRid) {
  // Header is a borderless 3-column table (address | logo+subtitle | contact).
  // See assembly below.
  const rPr = `<w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="18"/><w:szCs w:val="18"/><w:color w:val="555555"/></w:rPr>`;

  // Inline drawing for the logo — used in the center column of line 1.
  const drawing = imageRid ? `<w:r><w:rPr><w:noProof/></w:rPr><w:drawing>
    <wp:inline distT="0" distB="0" distL="0" distR="0" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
      <wp:extent cx="${LOGO_WIDTH_EMU}" cy="${LOGO_HEIGHT_EMU}"/>
      <wp:effectExtent l="0" t="0" r="0" b="0"/>
      <wp:docPr id="1" name="Neuronita logo"/>
      <wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>
      <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
          <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
            <pic:nvPicPr><pic:cNvPr id="0" name="logo"/><pic:cNvPicPr/></pic:nvPicPr>
            <pic:blipFill>
              <a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="${imageRid}"/>
              <a:stretch><a:fillRect/></a:stretch>
            </pic:blipFill>
            <pic:spPr>
              <a:xfrm><a:off x="0" y="0"/><a:ext cx="${LOGO_WIDTH_EMU}" cy="${LOGO_HEIGHT_EMU}"/></a:xfrm>
              <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
            </pic:spPr>
          </pic:pic>
        </a:graphicData>
      </a:graphic>
    </wp:inline>
  </w:drawing></w:r>` : '';

  // Cells: address (left), contact (right-aligned), logo + subtitle (centered).
  const para = (text, align) => `<w:p><w:pPr>${align ? `<w:jc w:val="${align}"/>` : ''}<w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:r>${rPr}<w:t xml:space="preserve">${text}</w:t></w:r></w:p>`;
  const addrCell = para('Aquamarina 10') + para('Urb. Villa Blanca') + para('Caguas PR 00725');
  const contactCell = para('Tel. 787-407-4814', 'right') + para('Fax. 787-258-8225', 'right') + para('clinicarehabilitacion10@gmail.com', 'right');
  const subtitle = `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="40" w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="16"/><w:szCs w:val="16"/><w:color w:val="888888"/></w:rPr><w:t>Neuro-Cognitive Rehabilitation Clinic</w:t></w:r></w:p>`;
  const logoCell = `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>${drawing}</w:p>${subtitle}`;

  const noBorders = `<w:tblBorders><w:top w:val="none" w:sz="0" w:space="0"/><w:left w:val="none" w:sz="0" w:space="0"/><w:bottom w:val="none" w:sz="0" w:space="0"/><w:right w:val="none" w:sz="0" w:space="0"/><w:insideH w:val="none" w:sz="0" w:space="0"/><w:insideV w:val="none" w:sz="0" w:space="0"/></w:tblBorders>`;
  const noCellBorders = `<w:tcBorders><w:top w:val="none" w:sz="0" w:space="0"/><w:left w:val="none" w:sz="0" w:space="0"/><w:bottom w:val="none" w:sz="0" w:space="0"/><w:right w:val="none" w:sz="0" w:space="0"/></w:tcBorders>`;
  // vAlign=top is the key fix: address/contact stay at the TOP of the row
  // instead of vertically centering against the tall logo.
  const cell = (w, content) => `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${noCellBorders}<w:vAlign w:val="top"/></w:tcPr>${content}</w:tc>`;

  // Side columns equal (3150) so the 4500-twip logo column is centered on the
  // 10800-twip (7.5") content width; the logo is centered within that column.
  const tbl = `<w:tbl><w:tblPr><w:tblW w:w="10800" w:type="dxa"/><w:tblLayout w:type="fixed"/>${noBorders}<w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="0" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="3150"/><w:gridCol w:w="4500"/><w:gridCol w:w="3150"/></w:tblGrid><w:tr>${cell(3150, addrCell)}${cell(4500, logoCell)}${cell(3150, contactCell)}</w:tr></w:tbl>`;

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
${tbl}
</w:hdr>`;
}

async function rebuildHeaderWithTabStops(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const relsEntry = zip.file('word/_rels/header1.xml.rels');
  const headerEntry = zip.file('word/header1.xml');
  if (!headerEntry || !relsEntry) return buffer;

  // Pull the image rId from the existing rels (orphan cleanup left exactly one).
  const relsXml = await relsEntry.async('string');
  const imageMatch = relsXml.match(/<Relationship\s+Id="(rId\d+)"\s+Type="[^"]*\/image"/);
  const imageRid = imageMatch ? imageMatch[1] : null;

  zip.file('word/header1.xml', buildCleanHeaderXml(imageRid));
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
  .clinic-logo { max-height: 120px; }
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
    processed = await rebuildHeaderWithTabStops(processed);
    processed = await moveSectPrToEndOfBody(processed);
    return processed;
  } catch (err) {
    logger.error({ err }, 'DOCX generation failed');
    throw err;
  }
}

module.exports = { generateDocx };
