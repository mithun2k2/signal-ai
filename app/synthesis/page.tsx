'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@progress/kendo-react-buttons';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { storage } from '@/lib/storage';
import { synthesiseCaptures } from '@/lib/claude';
import { SynthesisReport } from '@/lib/types';

const LOADING_MESSAGES = [
  'Reading your captures...',
  'Identifying patterns across sessions...',
  'Extracting insights relevant to your work...',
  'Writing your follow-up emails...',
  'Calculating your conference ROI...',
  'Building your action plan...',
];

export default function SynthesisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [report, setReport] = useState<SynthesisReport | null>(null);
  const [captureCount, setCaptureCount] = useState(0);

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

  const getCategoryColor = (cat: string) => ({
    technical: 'bg-blue-900 text-blue-300',
    career: 'bg-green-900 text-green-300',
    business: 'bg-yellow-900 text-yellow-300',
    tool: 'bg-purple-900 text-purple-300',
  }[cat] ?? 'bg-gray-800 text-gray-300');

  const getValueColor = (val: string) => ({
    Exceptional: 'bg-green-900 text-green-300',
    High: 'bg-blue-900 text-blue-300',
    Medium: 'bg-yellow-900 text-yellow-300',
    Low: 'bg-gray-800 text-gray-400',
  }[val] ?? 'bg-gray-800 text-gray-300');

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => router.push('/capture')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <span className="font-bold">AI Synthesis</span>
        {report && (
          <Button
            onClick={() => router.push('/roi')}
            style={{ background: '#7c3aed', border: 'none', borderRadius: '8px', fontWeight: '600' }}
          >
            ROI Dashboard →
          </Button>
        )}
        {!report && <div className="w-24" />}
      </div>

      <div className="max-w-2xl mx-auto p-6">

        {/* Initial State */}
        {!report && !loading && (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">🧠</div>
            <h2 className="text-2xl font-bold mb-3">Ready to synthesise</h2>
            <p className="text-gray-400 mb-2">
              Claude will analyse all <span className="text-violet-400 font-semibold">{captureCount} captures</span>
            </p>
            <p className="text-gray-500 text-sm mb-10">
              Insights will be personalised to your work and challenges
            </p>
            <Button
              themeColor="primary"
              onClick={handleSynthesise}
              style={{
                padding: '14px 32px',
                fontSize: '18px',
                fontWeight: '700',
                background: '#7c3aed',
                border: 'none',
                borderRadius: '14px',
              }}
            >
              ⚡ Generate My Intelligence Report
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-7xl mb-8 animate-pulse">⚡</div>
            <h2 className="text-xl font-semibold mb-8 text-gray-300">{loadingMsg}</h2>
            <div className="max-w-sm mx-auto">
              <ProgressBar value={progress} style={{ height: '8px', borderRadius: '4px' }} />
            </div>
            <p className="text-gray-600 text-sm mt-4">{progress}%</p>
          </div>
        )}

        {/* Report */}
        {report && (
          <div className="space-y-6">

            {/* ROI Banner */}
            <div className="bg-gradient-to-r from-violet-950 to-blue-950 rounded-2xl p-6 border border-violet-800 text-center">
              <div className="text-6xl font-bold text-violet-400">{report.roiScore}</div>
              <div className="text-gray-400 mt-1">Conference ROI Score</div>
              <span className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${getValueColor(report.roiBreakdown.estimatedValue)}`}>
                {report.roiBreakdown.estimatedValue} Value
              </span>
              <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
                <span>📦 {report.roiBreakdown.insightsCaptured} captures</span>
                <span>👤 {report.roiBreakdown.connectionsToFollow} follow-ups</span>
                <span>⚡ {report.roiBreakdown.actionItemsGenerated} actions</span>
              </div>
            </div>

            {/* Top Insights */}
            <div>
              <h3 className="font-bold text-lg mb-3">🎯 Top Insights For You</h3>
              <div className="space-y-3">
                {report.topInsights.map((insight, i) => (
                  <div key={insight.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <div className="flex items-start gap-3">
                      <span className="text-violet-400 font-bold text-lg min-w-[24px]">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold text-white">{insight.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(insight.category)}`}>
                            {insight.category}
                          </span>
                          <span className="text-xs text-gray-500">relevance: {insight.relevanceScore}/10</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3 leading-relaxed">{insight.summary}</p>
                        <div className="bg-violet-950 border border-violet-800 rounded-lg px-3 py-2 text-sm text-violet-300">
                          ✅ <strong>Action this week:</strong> {insight.actionItem}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Items */}
            <div>
              <h3 className="font-bold text-lg mb-3">⚡ This Week&apos;s Action Items</h3>
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                {report.actionItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 border-b border-gray-800 last:border-0">
                    <div className="w-5 h-5 rounded-full border-2 border-violet-500 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-up Emails */}
            {report.followUpEmails.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3">📧 Follow-up Emails Ready</h3>
                {report.followUpEmails.map((fu, i) => (
                  <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">To: {fu.personName}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(fu.emailDraft)}
                        className="text-xs text-violet-400 hover:text-violet-300 border border-violet-800 px-3 py-1 rounded-lg"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-gray-500 text-xs mb-3">{fu.context}</p>
                    <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">{fu.emailDraft}</p>
                  </div>
                ))}
              </div>
            )}

            {/* LinkedIn Post */}
            <div>
              <h3 className="font-bold text-lg mb-3">💼 Your LinkedIn Post</h3>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed mb-4">
                  {report.linkedInPost}
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(report.linkedInPost)}
                  className="text-xs text-violet-400 hover:text-violet-300 border border-violet-800 px-3 py-1 rounded-lg"
                >
                  Copy to clipboard
                </button>
              </div>
            </div>

            {/* Regenerate */}
            <button
              onClick={handleSynthesise}
              className="w-full py-3 rounded-xl border border-gray-700 text-gray-400 hover:border-violet-600 hover:text-violet-400 transition-all text-sm"
            >
              ↻ Regenerate Report
            </button>

          </div>
        )}
      </div>
    </div>
  );
}