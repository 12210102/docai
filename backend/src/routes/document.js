import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { extractText } from '../services/extractor.js';
import { analyseDocument } from '../services/analyzer.js';

export const documentRouter = Router();

/**
 * POST /api/document-analyze
 * Body: { fileName, fileType, fileBase64 }
 * Header: x-api-key
 */
documentRouter.post('/document-analyze', authenticate, async (req, res, next) => {
  try {
    const { fileName, fileType, fileBase64 } = req.body;

    if (!fileName || !fileType || !fileBase64) {
      return res.status(400).json({ error: 'Missing required fields: fileName, fileType, fileBase64' });
    }

    // Decode base64
    let buffer;
    try {
      buffer = Buffer.from(fileBase64, 'base64');
    } catch {
      return res.status(400).json({ error: 'Invalid base64 string in fileBase64 field' });
    }

    // Extract text
    const text = await extractText(buffer, fileType);

    // AI Analysis
    const analysis = await analyseDocument(text);

    return res.json({
      status: 'success',
      fileName,
      fileType,
      processedAt: new Date().toISOString(),
      ...analysis
    });

  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
});

/**
 * GET /api/supported-formats
 */
documentRouter.get('/supported-formats', (_req, res) => {
  res.json({
    formats: [
      { type: 'pdf', label: 'PDF Document', extensions: ['.pdf'], icon: 'pdf' },
      { type: 'docx', label: 'Word Document', extensions: ['.docx'], icon: 'word' },
      { type: 'image', label: 'Image (OCR)', extensions: ['.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.webp'], icon: 'image' }
    ]
  });
});
