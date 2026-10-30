import fs from 'node:fs';
import { createCanvas, DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas';
Object.assign(globalThis, { DOMMatrix, ImageData, Path2D });
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync('Thappor-Man-20-Game-Scenarios.pdf')), useSystemFonts: true }).promise;
fs.mkdirSync('assets/scenes', { recursive: true });
const texts = [];
for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = createCanvas(viewport.width, viewport.height);
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
  const crop = createCanvas(1400, 788);
  crop.getContext('2d').drawImage(canvas, canvas.width * .0465, canvas.height * .2695, canvas.width * .9075, canvas.height * .4905, 0, 0, 1400, 788);
  fs.writeFileSync(`assets/scenes/${String(i).padStart(2,'0')}.webp`, crop.toBuffer('image/webp', 85));
  texts.push((await page.getTextContent()).items.map(x => x.str).join('\n'));
}
fs.writeFileSync('assets/pdf-text.json', JSON.stringify(texts, null, 2));
