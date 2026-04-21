import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';
const API_KEY = process.env.REACT_APP_API_KEY || 'sk_track2_987654321';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' }
});

export async function analyzeDocument(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target.result.split(',')[1];
        const fileType = detectFileType(file);
        const { data } = await api.post('/document-analyze', {
          fileName: file.name,
          fileType,
          fileBase64: base64
        });
        resolve(data);
      } catch (err) {
        reject(err.response?.data?.error || err.message);
      }
    };
    reader.onerror = () => reject('Failed to read file');
    reader.readAsDataURL(file);
  });
}

function detectFileType(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx' || ext === 'doc') return 'docx';
  return 'image';
}

export async function getSupportedFormats() {
  const { data } = await api.get('/supported-formats');
  return data.formats;
}
