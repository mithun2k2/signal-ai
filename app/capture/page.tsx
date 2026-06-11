'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@progress/kendo-react-buttons';
import { TextArea, Input } from '@progress/kendo-react-inputs';
import { storage } from '@/lib/storage';
import { Capture, CaptureType } from '@/lib/types';

const CAPTURE_TYPES: { type: CaptureType; emoji: string; label: string; placeholder: string }[] = [
  { type: 'note', emoji: '📝', label: 'Note', placeholder: 'What just clicked for you?' },
  { type: 'slide', emoji: '📊', label: 'Slide', placeholder: 'Describe the slide or paste the key stat...' },
  { type: 'contact', emoji: '👤', label: 'Contact', placeholder: 'Name, role, what they work on, why relevant...' },
  { type: 'url', emoji: '🔗', label: 'Link', placeholder: 'URL + why it matters to you' },
  { type: 'quote', emoji: '💬', label: 'Quote', placeholder: '"The exact words that hit different..."' },
];

export default function CapturePage() {
  const router = useRouter();
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [activeType, setActiveType] = useState<CaptureType>('note');
  const [content, setContent] = useState('');
  const [context, setContext] = useState('');

  useEffect(() => {
    setCaptures(storage.getCaptures());
  }, []);

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
  };

  const handleDelete = (id: string) => {
    storage.deleteCapture(id);
    setCaptures(storage.getCaptures());
  };

  const activeTypeDef = CAPTURE_TYPES.find(t => t.type === activeType)!;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <span className="font-bold text-lg">SignalAI</span>
          <span className="bg-violet-900 text-violet-300 text-xs font-semibold px-2 py-1 rounded-full">
            {captures.length} captured
          </span>
        </div>
        <Button
          themeColor="primary"
          onClick={() => router.push('/synthesis')}
          disabled={captures.length === 0}
          style={{ background: '#7c3aed', border: 'none', borderRadius: '8px', fontWeight: '600' }}
        >
          Synthesise → ({captures.length})
        </Button>
      </div>

      <div className="max-w-2xl mx-auto p-6">

        {/* Type Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {CAPTURE_TYPES.map(t => (
            <button
              key={t.type}
              onClick={() => setActiveType(t.type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all text-sm ${
                activeType === t.type
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* Input Card */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
          <TextArea
            value={content}
            onChange={e => setContent(String(e.value))}
            placeholder={activeTypeDef.placeholder}
            rows={3}
            style={{ width: '100%', fontSize: '15px', marginBottom: '12px' }}
          />
          <Input
            value={context}
            onChange={e => setContext(String(e.value))}
            placeholder="Context: which talk or conversation? (optional)"
            style={{ width: '100%', fontSize: '14px', marginBottom: '16px' }}
          />
          <Button
            themeColor="primary"
            onClick={handleSave}
            disabled={!content.trim()}
            style={{
              width: '100%',
              padding: '10px',
              fontWeight: '600',
              background: '#7c3aed',
              border: 'none',
              borderRadius: '10px',
            }}
          >
            Save {activeTypeDef.emoji} {activeTypeDef.label}
          </Button>
        </div>

        {/* Captures Feed */}
        <div className="space-y-3">
          {captures.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <div className="text-5xl mb-4">📡</div>
              <p className="text-lg">Start capturing.</p>
              <p className="text-sm mt-1">Every slide, note, and contact matters.</p>
            </div>
          ) : (
            captures.map(cap => {
              const typeDef = CAPTURE_TYPES.find(t => t.type === cap.type)!;
              return (
                <div key={cap.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex gap-3">
                  <span className="text-xl mt-0.5">{typeDef.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm leading-relaxed">{cap.content}</p>
                    {cap.context && (
                      <p className="text-gray-500 text-xs mt-1">📍 {cap.context}</p>
                    )}
                    <p className="text-gray-700 text-xs mt-1">
                      {new Date(cap.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(cap.id)}
                    className="text-gray-700 hover:text-red-500 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}