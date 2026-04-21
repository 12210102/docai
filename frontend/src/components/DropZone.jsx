import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ACCEPTED = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp'], 'image/tiff': ['.tiff'], 'image/bmp': ['.bmp']
};

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export default function DropZone({ onFile, disabled }) {
  const [dragError, setDragError] = useState('');

  const onDrop = useCallback((accepted, rejected) => {
    setDragError('');
    if (rejected.length) {
      const err = rejected[0].errors[0];
      setDragError(err.code === 'file-too-large' ? 'File exceeds 20MB limit.' : 'Unsupported file type.');
      return;
    }
    if (accepted.length) onFile(accepted[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: ACCEPTED, maxSize: MAX_SIZE, multiple: false, disabled
  });

  return (
    <div style={{ width: '100%' }}>
      <div {...getRootProps()} style={{
        border: `2px dashed ${isDragActive ? '#6c63ff' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 20,
        padding: '56px 32px',
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: isDragActive ? 'rgba(108,99,255,0.08)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.5 : 1
      }}>
        <input {...getInputProps()} />

        <div style={{ fontSize: 48, marginBottom: 16 }}>
          {isDragActive ? '📂' : '📄'}
        </div>

        <p style={{ fontSize: 18, fontWeight: 600, color: '#f0f0f8', marginBottom: 8 }}>
          {isDragActive ? 'Drop your document here' : 'Drop your document or click to browse'}
        </p>
        <p style={{ fontSize: 14, color: '#8b8ba0', marginBottom: 20 }}>
          PDF, DOCX, or Image (PNG, JPG, WEBP) · Max 20MB
        </p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['PDF', 'DOCX', 'PNG', 'JPG', 'WEBP'].map(fmt => (
            <span key={fmt} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
              background: 'rgba(108,99,255,0.12)', color: '#8b84ff',
              border: '1px solid rgba(108,99,255,0.25)'
            }}>{fmt}</span>
          ))}
        </div>
      </div>

      {dragError && (
        <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8, textAlign: 'center' }}>
          {dragError}
        </p>
      )}
    </div>
  );
}
