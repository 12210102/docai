/**
 * DocAI API Test Script (Node.js)
 *
 * Usage:
 *   node test_api.js <path-to-file> <pdf|docx|image>
 *
 * Examples:
 *   node test_api.js sample.pdf pdf
 *   node test_api.js contract.docx docx
 *   node test_api.js receipt.png image
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';
const API_KEY  = process.env.API_KEY  || 'sk_track2_987654321';

async function testHealth() {
  const res = await fetch('http://localhost:5000/health');
  const data = await res.json();
  console.log(`\n✅ Health: ${data.status} (v${data.version})`);
}

async function testAuthFailure() {
  console.log('\n🔐 Testing auth failure...');
  const res = await fetch(`${BASE_URL}/document-analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': 'wrong-key' },
    body: JSON.stringify({ fileName: 'x.pdf', fileType: 'pdf', fileBase64: 'abc' })
  });
  const data = await res.json();
  console.log(`   Status: ${res.status} (expected 401) — ${data.error}`);
}

async function testDocument(filePath, fileType) {
  const fileName = path.basename(filePath);
  const fileBase64 = fs.readFileSync(filePath).toString('base64');

  console.log(`\n📄 Analysing: ${fileName} [${fileType}]`);
  console.log('   Sending to API...');

  const start = Date.now();
  const res = await fetch(`${BASE_URL}/document-analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
    body: JSON.stringify({ fileName, fileType, fileBase64 })
  });

  const data = await res.json();
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  if (res.ok) {
    console.log(`\n✅ Success in ${elapsed}s\n`);
    console.log(`   📝 Summary:\n   ${data.summary}`);
    console.log(`\n   🏷️  Sentiment: ${data.sentiment} (score: ${data.sentimentScore})`);
    console.log(`   📌 Document Type: ${data.documentType}`);
    console.log(`   📊 Words: ${data.wordCount} | Reading: ${data.readingTime} min`);
    console.log(`\n   🔍 Entities:`);
    Object.entries(data.entities).forEach(([k, v]) => {
      if (v.length) console.log(`      ${k}: ${v.join(', ')}`);
    });
    console.log(`\n   💡 Key Topics: ${data.keyTopics?.join(', ')}`);
  } else {
    console.log(`\n❌ Error ${res.status}: ${data.error}`);
  }
}

async function main() {
  const [filePath, fileType] = process.argv.slice(2);

  await testHealth();
  await testAuthFailure();

  if (filePath && fileType) {
    await testDocument(filePath, fileType);
  } else {
    console.log('\nℹ️  Tip: pass a file to test the full pipeline:');
    console.log('   node test_api.js sample.pdf pdf\n');
  }
}

main().catch(console.error);
