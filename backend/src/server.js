import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { documentRouter } from './routes/document.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & middleware ──────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Rate limiting ──────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ── Routes ─────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() }));
app.use('/api', documentRouter);

// ── 404 ────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Error handler ──────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 DocAI Server running on http://localhost:${PORT}`);
  console.log(`📄 API: http://localhost:${PORT}/api/document-analyze`);
  console.log(`💊 Health: http://localhost:${PORT}/health\n`);
});
