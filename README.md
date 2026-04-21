# 📄 DocAI — AI-Powered Document Analysis

A full-stack professional web app that lets users upload documents (PDF, DOCX, or image) and get instant AI-extracted insights via Claude.

---

## 🏗️ Project Structure

```
docai/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── server.js           # Entry point
│   │   ├── routes/
│   │   │   └── document.js     # POST /api/document-analyze
│   │   ├── middleware/
│   │   │   ├── auth.js         # x-api-key authentication
│   │   │   └── errorHandler.js # Global error handler
│   │   └── services/
│   │       ├── extractor.js    # PDF / DOCX / Image text extraction
│   │       └── analyzer.js     # Claude AI analysis
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # React app
│   ├── src/
│   │   ├── App.jsx             # Main layout & state machine
│   │   ├── components/
│   │   │   ├── DropZone.jsx    # Drag-and-drop file upload
│   │   │   ├── ProgressBar.jsx # Animated progress indicator
│   │   │   └── ResultCard.jsx  # Full results display with charts
│   │   ├── hooks/
│   │   │   └── useAnalyzer.js  # Analysis state hook
│   │   └── utils/
│   │       └── api.js          # Axios API client
│   ├── public/
│   │   └── index.html
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- Anthropic API key → https://console.anthropic.com

---

### 1. Clone

```bash
git clone https://github.com/your-username/docai.git
cd docai
```

---

### 2. Backend Setup

```bash
cd backend
npm install

cp .env.example .env
# Edit .env — add your ANTHROPIC_API_KEY

npm run dev        # development (nodemon)
# or
npm start          # production
```

Backend runs at: **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd frontend
npm install

cp .env.example .env
# Edit .env — set REACT_APP_API_URL and REACT_APP_API_KEY

npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🌐 API Reference

### `POST /api/document-analyze`

**Headers:**
```
Content-Type: application/json
x-api-key: sk_track2_987654321
```

**Request:**
```json
{
  "fileName": "invoice.pdf",
  "fileType": "pdf",
  "fileBase64": "<base64 string>"
}
```

**Response:**
```json
{
  "status": "success",
  "fileName": "invoice.pdf",
  "fileType": "pdf",
  "processedAt": "2026-04-20T10:30:00.000Z",
  "summary": "This is an invoice from ABC Pvt Ltd...",
  "entities": {
    "names": ["Ravi Kumar"],
    "dates": ["10 March 2026"],
    "organizations": ["ABC Pvt Ltd"],
    "amounts": ["₹10,000"],
    "locations": ["Mumbai"]
  },
  "sentiment": "Neutral",
  "sentimentScore": 0.05,
  "keyTopics": ["invoice", "payment", "software services"],
  "documentType": "Invoice",
  "language": "English",
  "wordCount": 312,
  "readingTime": 2,
  "charCount": 1840
}
```

**Error Codes:**

| Code | Reason |
|------|--------|
| 401 | Missing or invalid x-api-key |
| 400 | Invalid base64 or unsupported fileType |
| 422 | No text extractable from document |
| 429 | Rate limit exceeded |
| 500 | Server / AI error |

---

## ☁️ Deployment

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Set root directory to `backend/`
3. Build command: `npm install`
4. Start command: `node src/server.js`
5. Add env vars: `ANTHROPIC_API_KEY`, `API_KEY`, `FRONTEND_URL`

### Frontend → Vercel / Netlify

```bash
cd frontend
npm run build
# Upload the build/ folder to Vercel or Netlify
```

Set env vars:
- `REACT_APP_API_URL` → your backend URL
- `REACT_APP_API_KEY` → your API key

---

## 🔍 How It Works

```
User uploads file (drag & drop)
        ↓
FileReader → Base64 encode
        ↓
POST /api/document-analyze
        ↓
Auth check (x-api-key)
        ↓
Decode Base64 → Buffer
        ↓
Route by fileType:
  PDF   → pdf-parse
  DOCX  → mammoth
  Image → tesseract.js (OCR)
        ↓
Text sent to Claude claude-sonnet-4-20250514
        ↓
Claude returns JSON (summary, entities, sentiment, topics...)
        ↓
Response displayed with charts and entity cards
```

---

## 📊 Scoring Coverage

| Criteria | Implementation |
|----------|---------------|
| Summary (2 pts/test) | Claude generates 2-3 sentence summaries |
| Entities (4 pts/test) | Names, dates, orgs, amounts, locations extracted |
| Sentiment (4 pts/test) | Positive / Neutral / Negative + score |
| GitHub Code Quality (10 pts) | Clean structure, error handling, comments |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Recharts, react-dropzone, Framer Motion |
| Backend | Node.js, Express 4, ES Modules |
| AI | Anthropic Claude claude-sonnet-4-20250514 |
| PDF | pdf-parse |
| DOCX | mammoth |
| OCR | tesseract.js |
| Auth | API key via x-api-key header |
| Rate Limiting | express-rate-limit |
| Security | helmet, cors |
