'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { storage } from '@/lib/storage';
import { synthesiseCaptures } from '@/lib/claude';
import { SynthesisReport } from '@/lib/types';
import SignalLogo from '@/components/SignalLogo';

const LOADING_MESSAGES = [
  'Reading your captures...',
  'Identifying patterns across sessions...',
  'Extracting insights relevant to your work...',
  'Writing your follow-up emails...',
  'Calculating your conference ROI...',
  'Building your action plan...',
];

const CATEGORY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  technical: { bg: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: 'rgba(96,165,250,0.3)' },
  career: { bg: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: 'rgba(52,211,153,0.3)' },
  business: { bg: 'rgba(245,158,11,0.12)', color: '#fcd34d', border: 'rgba(251,191,36,0.3)' },
  tool: { bg: 'rgba(124,58,237,0.12)', color: '#c4b5fd', border: 'rgba(167,139,250,0.3)' },
  strategy: { bg: 'rgba(236,72,153,0.12)', color: '#f9a8d4', border: 'rgba(244,114,182,0.3)' },
  partnership: { bg: 'rgba(6,182,212,0.12)', color: '#67e8f9', border: 'rgba(34,211,238,0.3)' },
};

const VALUE_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  Exceptional: { color: '#6ee7b7', bg: 'rgba(16,185,129,0.15)', border: 'rgba(52,211,153,0.4)' },
  High: { color: '#93c5fd', bg: 'rgba(59,130,246,0.15)', border: 'rgba(96,165,250,0.4)' },
  Medium: { color: '#fcd34d', bg: 'rgba(245,158,11,0.15)', border: 'rgba(251,191,36,0.4)' },
  Low: { color: '#9ca3af', bg: 'rgba(107,114,128,0.15)', border: 'rgba(156,163,175,0.3)' },
};

export default function SynthesisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [report, setReport] = useState<SynthesisReport | null>(null);
  const [captureCount, setCaptureCount] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const existing = storage.getReport();
    if (existing) setReport(existing);
    setCaptureCount(storage.getCaptures().length);
  }, []);

  const handleSynthesise = async () => {
    const captures = storage.getCaptures();
    const profile = storage.getProfile();
    if (!captures.length || !profile) return;
    setLoading(true);
    setProgress(0);
    setReport(null);
    let msgIdx = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 14, 90));
      msgIdx = Math.min(msgIdx + 1, LOADING_MESSAGES.length - 1);
      setLoadingMsg(LOADING_MESSAGES[msgIdx]);
    }, 900);
    try {
      const result = await synthesiseCaptures(captures, profile);
      storage.setReport(result);
      setReport(result);
      setProgress(100);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const catStyle = (cat: string) => CATEGORY_STYLES[cat] ?? CATEGORY_STYLES.tool;
  const valStyle = (val: string) => VALUE_STYLES[val] ?? VALUE_STYLES.Medium;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div className="header">
        <button onClick={() => router.push('/capture')}
          style={{ background: 'none', border: 'none', color: 'rgba(196,181,253,0.6)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SignalLogo size={24} />
          <span style={{ fontWeight: '700', fontSize: '15px', color: '#f1f0ff' }}>AI Synthesis</span>
        </div>
        {report ? (
          <button className="btn-neon" onClick={() => router.push('/roi')}
            style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}>
            ROI Dashboard →
          </button>
        ) : <div style={{ width: '100px' }} />}
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Initial */}
        {!report && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🧠</div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f0ff', marginBottom: '12px' }}>
              Ready to synthesise
            </h2>
            <p style={{ color: 'rgba(196,181,253,0.6)', marginBottom: '8px', fontSize: '15px' }}>
              Claude will analyse all{' '}
              <span style={{ color: '#a78bfa', fontWeight: '600' }}>{captureCount} captures</span>
            </p>
            <p style={{ color: 'rgba(167,139,250,0.4)', fontSize: '13px', marginBottom: '40px' }}>
              Insights personalised to your work and challenges
            </p>
            <button className="btn-neon pulse-glow" onClick={handleSynthesise}
              style={{ maxWidth: '320px', margin: '0 auto', fontSize: '16px', padding: '14px 32px' }}>
              ⚡ Generate Intelligence Report
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '32px', animation: 'pulse 2s infinite' }}>⚡</div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#ddd6fe', marginBottom: '32px' }}>
              {loadingMsg}
            </h2>
            <div style={{ maxWidth: '300px', margin: '0 auto 16px' }}>
              <ProgressBar value={progress} style={{ height: '6px', borderRadius: '4px' }} />
            </div>
            <p style={{ color: 'rgba(167,139,250,0.4)', fontSize: '13px' }}>{progress}%</p>
          </div>
        )}

        {/* Report */}
        {report && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* ROI Banner */}
            <div className="roi-banner">
              <div style={{ fontSize: '56px', fontWeight: '800', color: '#a78bfa', lineHeight: 1, marginBottom: '6px' }}>
                {report.roiScore}
              </div>
              <div style={{ color: 'rgba(196,181,253,0.6)', fontSize: '13px', marginBottom: '12px' }}>
                Conference ROI Score
              </div>
              <span style={{
                display: 'inline-block', padding: '4px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: '700',
                background: valStyle(report.roiBreakdown.estimatedValue).bg,
                color: valStyle(report.roiBreakdown.estimatedValue).color,
                border: `1px solid ${valStyle(report.roiBreakdown.estimatedValue).border}`,
              }}>
                {report.roiBreakdown.estimatedValue} Value
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', fontSize: '12px', color: 'rgba(196,181,253,0.5)' }}>
                <span>📦 {report.roiBreakdown.insightsCaptured} captures</span>
                <span>👤 {report.roiBreakdown.connectionsToFollow} follow-ups</span>
                <span>⚡ {report.roiBreakdown.actionItemsGenerated} actions</span>
              </div>
            </div>

            {/* Top Insights */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f0ff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="icon-box icon-box-purple" style={{ width: '28px', height: '28px', fontSize: '14px' }}>🎯</span>
                Top Insights For You
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {report.topInsights.map((insight, i) => {
                  const cs = catStyle(insight.category);
                  return (
                    <div key={insight.id} className="insight-card">
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(167,139,250,0.3)',
                          fontSize: '13px', fontWeight: '800', color: '#a78bfa', flexShrink: 0,
                        }}>{i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#f1f0ff' }}>{insight.title}</span>
                            <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '100px', background: cs.bg, color: cs.color, border: `1px solid ${cs.border}`, letterSpacing: '0.04em' }}>
                              {insight.category}
                            </span>
                            <span style={{ fontSize: '11px', color: 'rgba(167,139,250,0.4)' }}>
                              {insight.relevanceScore}/10
                            </span>
                          </div>
                          <p style={{ fontSize: '13px', color: 'rgba(221,214,254,0.7)', lineHeight: '1.6', marginBottom: '10px' }}>
                            {insight.summary}
                          </p>
                          <div className="action-box">
                            ✅ <strong>Action this week:</strong> {insight.actionItem}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Items */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f0ff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="icon-box icon-box-yellow" style={{ width: '28px', height: '28px', fontSize: '14px' }}>⚡</span>
                This Week&apos;s Action Items
              </h3>
              <div className="glass" style={{ overflow: 'hidden', padding: 0 }}>
                {report.actionItems.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                    borderBottom: i < report.actionItems.length - 1 ? '1px solid rgba(167,139,250,0.08)' : 'none',
                  }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(124,58,237,0.5)', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: 'rgba(221,214,254,0.8)', lineHeight: '1.5' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-up Emails */}
            {report.followUpEmails.length > 0 && (
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f0ff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="icon-box icon-box-blue" style={{ width: '28px', height: '28px', fontSize: '14px' }}>📧</span>
                  Follow-up Emails Ready
                </h3>
                {report.followUpEmails.map((fu, i) => (
                  <div key={i} className="glass" style={{ padding: '16px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', fontSize: '14px', color: '#f1f0ff' }}>To: {fu.personName}</span>
                      <button className="copy-btn" onClick={() => handleCopy(fu.emailDraft, `email-${i}`)}>
                        {copied === `email-${i}` ? '✅ Copied' : 'Copy'}
                      </button>
                    </div>
                    <p style={{ fontSize: '11px', color: 'rgba(167,139,250,0.4)', marginBottom: '10px' }}>{fu.context}</p>
                    <p style={{ fontSize: '13px', color: 'rgba(221,214,254,0.7)', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{fu.emailDraft}</p>
                  </div>
                ))}
              </div>
            )}

            {/* LinkedIn Post */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f0ff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="icon-box icon-box-cyan" style={{ width: '28px', height: '28px', fontSize: '14px' }}>💼</span>
                Your LinkedIn Post
              </h3>
              <div className="glass" style={{ padding: '16px' }}>
                <p style={{ fontSize: '13px', color: 'rgba(221,214,254,0.75)', whiteSpace: 'pre-line', lineHeight: '1.7', marginBottom: '14px' }}>
                  {report.linkedInPost}
                </p>
                <button className="copy-btn" onClick={() => handleCopy(report.linkedInPost, 'linkedin')}>
                  {copied === 'linkedin' ? '✅ Copied!' : 'Copy to clipboard'}
                </button>
              </div>
            </div>

            {/* Regenerate */}
            <button onClick={handleSynthesise} style={{
              width: '100%', padding: '12px', borderRadius: '12px',
              border: '1px solid rgba(167,139,250,0.2)', background: 'transparent',
              color: 'rgba(196,181,253,0.5)', cursor: 'pointer', fontSize: '13px',
              transition: 'all 0.15s',
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)'; e.currentTarget.style.color = '#a78bfa'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)'; e.currentTarget.style.color = 'rgba(196,181,253,0.5)'; }}
            >
              ↻ Regenerate Report
            </button>

          </div>
        )}
      </div>
    </div>
  );
}