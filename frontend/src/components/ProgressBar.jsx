export default function ProgressBar({ status, progress }) {
  const labels = {
    uploading: 'Reading document...',
    analyzing: 'AI is analysing your document...',
    done: 'Analysis complete!',
    error: 'Something went wrong'
  };

  const colors = { uploading: '#6c63ff', analyzing: '#6c63ff', done: '#22c55e', error: '#ef4444' };
  const color = colors[status] || '#6c63ff';

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'rgba(255,255,255,0.04)', borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.07)', padding: '20px 24px'
      }}>
        {status === 'analyzing' && (
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            border: `2px solid rgba(108,99,255,0.3)`,
            borderTopColor: '#6c63ff',
            animation: 'spin 0.8s linear infinite',
            flexShrink: 0
          }} />
        )}
        {status === 'done' && <span style={{ fontSize: 20 }}>✅</span>}
        {status === 'error' && <span style={{ fontSize: 20 }}>❌</span>}
        {status === 'uploading' && <span style={{ fontSize: 20 }}>📤</span>}

        <div style={{ flex: 1, textAlign: 'left' }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#f0f0f8', marginBottom: 8 }}>
            {labels[status]}
          </p>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: `linear-gradient(90deg, ${color}, ${color}cc)`,
              borderRadius: 3,
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
        <span style={{ fontSize: 13, color: '#8b8ba0', flexShrink: 0 }}>{progress}%</span>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
