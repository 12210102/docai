import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

/**
 * Extract plain text from a buffer depending on file type.
 * @param {Buffer} buffer
 * @param {'pdf'|'docx'|'image'} fileType
 * @returns {Promise<string>}
 */
export async function extractText(buffer, fileType) {
  const type = fileType.toLowerCase().trim();

  if (type === 'pdf') {
    const data = await pdfParse(buffer);
    if (!data.text?.trim()) throw new Error('No readable text found in PDF');
    return data.text;
  }

  if (type === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    if (!result.value?.trim()) throw new Error('No readable text found in DOCX');
    return result.value;
  }

  if (['image', 'img', 'png', 'jpg', 'jpeg', 'tiff', 'bmp', 'webp'].includes(type)) {
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng', { logger: () => {} });
    if (!text?.trim()) throw new Error('No readable text found in image');
    return text;
  }

  throw Object.assign(new Error(`Unsupported fileType: "${fileType}". Use pdf, docx, or image.`), { status: 400 });
}
