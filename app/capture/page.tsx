'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextArea, Input } from '@progress/kendo-react-inputs';
import { storage } from '@/lib/storage';
import { Capture, CaptureType } from '@/lib/types';
import SignalLogo from '@/components/SignalLogo';
import CaptureIcon from '@/components/CaptureIcon';

const CAPTURE_TYPES: { type: CaptureType; label: string; placeholder: string; iconClass: string }[] = [
  { type: 'note', label: 'Note', placeholder: 'What just clicked for you?', iconClass: 'icon-box-purple' },
  { type: 'slide', label: 'Slide', placeholder: 'Describe the slide or paste the key stat...', iconClass: 'icon-box-blue' },
  { type: 'contact', label: 'Contact', placeholder: 'Name, role, what they work on, why relevant...', iconClass: 'icon-box-green' },
  { type: 'url', label: 'Link', placeholder: 'URL + why it matters to you', iconClass: 'icon-box-cyan' },
  { type: 'quote', label: 'Quote', placeholder: '"The exact words that hit different..."', iconClass: 'icon-box-yellow' },
];

export default function CapturePage() {
  const router = useRouter();
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [activeType, setActiveType] = useState<CaptureType>('note');
  const [content, setContent] = useState('');
  const [context, setContext] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setCaptures(storage.getCaptures()); }, []);

  const handleSave = () => {
    if (!content.trim()) return;
    const capture: Capture = {
      id: Date.now().toString(),
      type: activeType,
      content: content.trim(),
      context: context.trim() || undefined,
      timestamp: Date.now(),
    };
    storage.addCapture(capture);
    setCaptures(storage.getCaptures());
    setContent('');
    setContext('');
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleDelete = (id: string) => {
    storage.deleteCapture(id);
    setCaptures(storage.getCaptures());
  };

  const activeTypeDef = CAPTURE_TYPES.find(t => t.type === activeType)!;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SignalLogo size={32} />
          <span style={{ fontWeight: '700', fontSize: '17px', color: '#f1f0ff' }}>SignalAI</span>
          <span className="badge badge-violet">{captures.length} captured</span>
        </div>
        <button
          className="btn-neon"
          onClick={() => router.push('/synthesis')}
          disabled={captures.length === 0}
          style={{ width: 'auto', padding: '8px 20px', fontSize: '14px' }}
        >
          Synthesise ⚡ ({captures.length})
        </button>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Type selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CAPTURE_TYPES.map(t => (
            <button
              key={t.type}
              onClick={() => setActiveType(t.type)}
              className={`type-pill ${activeType === t.type ? 'active' : ''}`}
            >
              <CaptureIcon type={t.type} size={16} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Input card */}
        <div className="glass" style={{ padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div className={`icon-box ${activeTypeDef.iconClass}`}>
              <CaptureIcon type={activeTypeDef.type} size={20} />
            </div>
            <span style={{ fontWeight: '600', fontSize: '14px', color: '#ddd6fe' }}>
              Capture {activeTypeDef.label}
            </span>
          </div>

          <TextArea
            value={content}
            onChange={e => setContent(String(e.value))}
            placeholder={activeTypeDef.placeholder}
            rows={3}
            style={{ width: '100%', fontSize: '14px', marginBottom: '10px' }}
          />
          <Input
            value={context}
            onChange={e => setContext(String(e.value))}
            placeholder="📍 Context: which talk or conversation? (optional)"
            style={{ width: '100%', fontSize: '13px', marginBottom: '14px' }}
          />
          <button
            className="btn-neon"
            onClick={handleSave}
            disabled={!content.trim()}
          >
            {saved ? '✅ Saved!' : `Save ${activeTypeDef.label}`}
          </button>
        </div>

        {/* Feed */}
        {captures.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <CaptureIcon type="note" size={48} />
            </div>
            <p style={{ fontSize: '16px', marginBottom: '6px', color: 'rgba(196,181,253,0.5)' }}>Start capturing</p>
            <p style={{ fontSize: '13px', color: 'rgba(167,139,250,0.3)' }}>Every slide, note, and contact matters</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {captures.map(cap => {
              const typeDef = CAPTURE_TYPES.find(t => t.type === cap.type)!;
              return (
                <div key={cap.id} className="glass" style={{ padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div className={`icon-box ${typeDef.iconClass}`} style={{ width: '34px', height: '34px', flexShrink: 0 }}>
                    <CaptureIcon type={typeDef.type} size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', color: '#e9e4ff', lineHeight: '1.5', marginBottom: '4px' }}>{cap.content}</p>
                    {cap.context && (
                      <p style={{ fontSize: '11px', color: 'rgba(167,139,250,0.5)' }}>📍 {cap.context}</p>
                    )}
                    <p style={{ fontSize: '11px', color: 'rgba(167,139,250,0.3)', marginTop: '4px' }}>
                      {new Date(cap.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(cap.id)}
                    style={{ background: 'none', border: 'none', color: 'rgba(167,139,250,0.3)', cursor: 'pointer', fontSize: '18px', padding: '0', lineHeight: 1, flexShrink: 0 }}
                    onMouseOver={e => (e.currentTarget.style.color = '#f87171')}
                    onMouseOut={e => (e.currentTarget.style.color = 'rgba(167,139,250,0.3)')}
                  >×</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}