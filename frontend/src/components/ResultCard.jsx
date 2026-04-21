import { useState } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const SENTIMENT_CONFIG = {
  Positive: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', emoji: '😊' },
  Neutral:  { color: '#6c63ff', bg: 'rgba(108,99,255,0.1)', border: 'rgba(108,99,255,0.25)', emoji: '😐' },
  Negative: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)',  emoji: '😟' }
};

const DOC_ICONS = {
  Invoice:'🧾', Contract:'📑', Report:'📊', Letter:'✉️',
  Article:'📰', Resume:'👤', Legal:'⚖️', Other:'📄'
};

function Stat({ label, value, sub }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.07)', padding: '16px 20px'
    }}>
      <p style={{ fontSize: 12, color: '#8b8ba0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 700, color: '#f0f0f8' }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: '#55556a', marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

function Tag({ children, color = '#6c63ff' }) {
  return (
    <span style={{
      display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 13,
      background: `${color}18`, color, border: `1px solid ${color}33`, fontWeight: 500
    }}>{children}</span>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: '#8b8ba0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>{title}</h3>
      {children}
    </div>
  );
}

export default function ResultCard({ result, onReset }) {
  const [copied, setCopied] = useState(false);
  const sConfig = SENTIMENT_CONFIG[result.sentiment] || SENTIMENT_CONFIG.Neutral;

  const sentimentScore = result.sentimentScore ?? 0;
  const scorePercent = Math.round(((sentimentScore + 1) / 2) * 100);

  const pieData = [
    { name: 'Score', value: scorePercent },
    { name: 'Rest', value: 100 - scorePercent }
  ];

  const entityData = [
    { subject: 'Names', A: result.entities?.names?.length || 0 },
    { subject: 'Dates', A: result.entities?.dates?.length || 0 },
    { subject: 'Orgs', A: result.entities?.organizations?.length || 0 },
    { subject: 'Amounts', A: result.entities?.amounts?.length || 0 },
    { subject: 'Locations', A: result.entities?.locations?.length || 0 },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ width: '100%' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 16, marginBottom: 28, flexWrap: 'wrap'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 24 }}>{DOC_ICONS[result.documentType] || '📄'}</span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f0f0f8' }}>{result.fileName}</h2>
          </div>
          <p style={{ fontSize: 13, color: '#8b8ba0' }}>
            Processed {new Date(result.processedAt).toLocaleString()} · {result.language || 'English'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleCopy} style={{
            padding: '8px 16px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)', color: '#f0f0f8',
            border: '1px solid rgba(255,255,255,0.1)', fontWeight: 500, transition: 'all 0.15s'
          }}>{copied ? '✅ Copied' : '📋 Copy JSON'}</button>
          <button onClick={onReset} style={{
            padding: '8px 16px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
            background: 'rgba(108,99,255,0.15)', color: '#8b84ff',
            border: '1px solid rgba(108,99,255,0.3)', fontWeight: 500, transition: 'all 0.15s'
          }}>+ New Document</button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 28 }}>
        <Stat label="Word Count" value={result.wordCount?.toLocaleString()} />
        <Stat label="Reading Time" value={`${result.readingTime} min`} />
        <Stat label="Characters" value={result.charCount?.toLocaleString()} />
        <Stat label="Document Type" value={result.documentType || 'Other'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

        {/* Sentiment */}
        <div style={{
          background: sConfig.bg, border: `1px solid ${sConfig.border}`,
          borderRadius: 16, padding: '24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <Section title="Sentiment">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 32 }}>{sConfig.emoji}</span>
              <div>
                <p style={{ fontSize: 24, fontWeight: 700, color: sConfig.color }}>{result.sentiment}</p>
                <p style={{ fontSize: 13, color: '#8b8ba0' }}>Score: {sentimentScore.toFixed(2)}</p>
              </div>
            </div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" startAngle={90} endAngle={-270}>
                    <Cell fill={sConfig.color} />
                    <Cell fill="rgba(255,255,255,0.05)" />
                  </Pie>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill={sConfig.color} fontSize={18} fontWeight={700}>{scorePercent}%</text>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        {/* Entity Radar */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '24px'
        }}>
          <Section title="Entity Distribution">
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={entityData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b8ba0', fontSize: 12 }} />
                  <Radar name="Entities" dataKey="A" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>
      </div>

      {/* Summary */}
      <div style={{
        background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)',
        borderRadius: 16, padding: '24px', marginBottom: 24
      }}>
        <Section title="AI Summary">
          <p style={{ fontSize: 15, color: '#d0d0e8', lineHeight: 1.75 }}>{result.summary}</p>
        </Section>
      </div>

      {/* Key Topics */}
      {result.keyTopics?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Section title="Key Topics">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {result.keyTopics.map(t => <Tag key={t} color="#6c63ff">{t}</Tag>)}
            </div>
          </Section>
        </div>
      )}

      {/* Entities */}
      <Section title="Extracted Entities">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { label: '👤 People', key: 'names', color: '#6c63ff' },
            { label: '🏢 Organizations', key: 'organizations', color: '#3b82f6' },
            { label: '📅 Dates', key: 'dates', color: '#f59e0b' },
            { label: '💰 Amounts', key: 'amounts', color: '#22c55e' },
            { label: '📍 Locations', key: 'locations', color: '#ec4899' }
          ].map(({ label, key, color }) => {
            const items = result.entities?.[key] || [];
            return (
              <div key={key} style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.07)', padding: '16px'
              }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#8b8ba0', marginBottom: 10 }}>{label}</p>
                {items.length === 0
                  ? <p style={{ fontSize: 13, color: '#55556a', fontStyle: 'italic' }}>None found</p>
                  : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {items.map((item, i) => <Tag key={i} color={color}>{item}</Tag>)}
                    </div>
                }
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
