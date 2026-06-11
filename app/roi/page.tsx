'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Chart, ChartSeries, ChartSeriesItem,
  ChartCategoryAxis, ChartCategoryAxisItem,
  ChartTitle, ChartLegend, ChartValueAxis, ChartValueAxisItem,
} from '@progress/kendo-react-charts';
import { RadialGauge } from '@progress/kendo-react-gauges';
import { storage } from '@/lib/storage';
import { SynthesisReport, Capture } from '@/lib/types';
import SignalLogo from '@/components/SignalLogo';

export default function ROIDashboard() {
  const router = useRouter();
  const [report, setReport] = useState<SynthesisReport | null>(null);
  const [captures, setCaptures] = useState<Capture[]>([]);

  useEffect(() => {
    setReport(storage.getReport());
    setCaptures(storage.getCaptures());
  }, []);

  if (!report) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <p style={{ color: 'rgba(196,181,253,0.6)', marginBottom: '20px' }}>No report yet. Run synthesis first.</p>
          <button className="btn-neon" onClick={() => router.push('/synthesis')} style={{ width: 'auto', padding: '10px 24px' }}>
            → Go to Synthesis
          </button>
        </div>
      </div>
    );
  }

  const capturesByType = ['note', 'slide', 'contact', 'url', 'quote'].map(type => ({
    type, count: captures.filter(c => c.type === type).length,
  }));

  const insightScores = report.topInsights.map(i => i.relevanceScore);
  const insightLabels = report.topInsights.map(i =>
    i.title.length > 16 ? i.title.slice(0, 16) + '…' : i.title
  );

  const gaugeOptions = {
    value: report.roiScore,
    pointer: { value: report.roiScore },
    scale: {
      min: 0, max: 100, majorUnit: 20,
      ranges: [
        { from: 0, to: 40, color: '#ef4444' },
        { from: 40, to: 70, color: '#f59e0b' },
        { from: 70, to: 100, color: '#10b981' },
      ],
    },
  };

  const handleExport = () => {
    const data = JSON.stringify({ profile: storage.getProfile(), captures, report }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signalai-conference-report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const STAT_CARDS = [
    { label: 'Captured', value: captures.length, icon: '📦', iconClass: 'icon-box-purple' },
    { label: 'Insights', value: report.topInsights.length, icon: '🎯', iconClass: 'icon-box-blue' },
    { label: 'Follow-ups', value: report.followUpEmails.length, icon: '📧', iconClass: 'icon-box-green' },
    { label: 'Actions', value: report.actionItems.length, icon: '⚡', iconClass: 'icon-box-yellow' },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div className="header">
        <button onClick={() => router.push('/synthesis')}
          style={{ background: 'none', border: 'none', color: 'rgba(196,181,253,0.6)', cursor: 'pointer', fontSize: '14px' }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SignalLogo size={24} />
          <span style={{ fontWeight: '700', fontSize: '15px', color: '#f1f0ff' }}>ROI Dashboard</span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(167,139,250,0.5)', letterSpacing: '0.06em' }}>
          FORGEAI
        </span>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {STAT_CARDS.map(stat => (
            <div key={stat.label} className="stat-card">
              <div className={`icon-box ${stat.iconClass}`} style={{ width: '32px', height: '32px', fontSize: '16px', margin: '0 auto 8px' }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#f1f0ff', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(167,139,250,0.5)', marginTop: '4px', fontWeight: '600' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ROI Gauge */}
        <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(196,181,253,0.7)', marginBottom: '4px', letterSpacing: '0.04em', textTransform: 'uppercase'}}>
            Overall Conference ROI Score
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
            <RadialGauge {...gaugeOptions} style={{ width: 260, height: 160 }} />
          </div>
          <div>
            <span style={{ fontSize: '40px', fontWeight: '800', color: '#a78bfa' }}>{report.roiScore}</span>
            <span style={{ fontSize: '18px', color: 'rgba(167,139,250,0.4)', marginLeft: '6px' }}>/100</span>
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(196,181,253,0.5)', marginTop: '4px' }}>
            {report.roiBreakdown.estimatedValue} Value
          </div>
        </div>

        {/* Captures by type chart */}
        <div className="glass" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(196,181,253,0.7)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Captures by Type
          </h3>
          <Chart style={{ height: 200 }}>
            <ChartTitle text="" />
            <ChartLegend visible={false} />
            <ChartCategoryAxis>
              <ChartCategoryAxisItem
                categories={capturesByType.map(d => d.type)}
                labels={{ color: 'rgba(196,181,253,0.5)', font: '12px sans-serif' }}
                line={{ color: 'rgba(167,139,250,0.1)' }}
                majorGridLines={{ visible: false }}
              />
            </ChartCategoryAxis>
            <ChartValueAxis>
              <ChartValueAxisItem
                labels={{ color: 'rgba(196,181,253,0.4)', font: '11px sans-serif' }}
                line={{ visible: false }}
                majorGridLines={{ color: 'rgba(167,139,250,0.08)' }}
              />
            </ChartValueAxis>
            <ChartSeries>
              <ChartSeriesItem
                type="column"
                data={capturesByType.map(d => d.count)}
                color="#7c3aed"
                border={{ width: 0 }}
                overlay={{ gradient: 'sharpBevel' }}
              />
            </ChartSeries>
          </Chart>
        </div>

        {/* Insight relevance chart */}
        <div className="glass" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(196,181,253,0.7)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Insight Relevance Scores
          </h3>
          <Chart style={{ height: 200 }}>
            <ChartTitle text="" />
            <ChartLegend visible={false} />
            <ChartCategoryAxis>
              <ChartCategoryAxisItem
                categories={insightLabels}
                labels={{ color: 'rgba(196,181,253,0.5)', font: '11px sans-serif' }}
                line={{ color: 'rgba(167,139,250,0.1)' }}
                majorGridLines={{ visible: false }}
              />
            </ChartCategoryAxis>
            <ChartValueAxis>
              <ChartValueAxisItem
                min={0} max={10}
                labels={{ color: 'rgba(196,181,253,0.4)', font: '11px sans-serif' }}
                line={{ visible: false }}
                majorGridLines={{ color: 'rgba(167,139,250,0.08)' }}
              />
            </ChartValueAxis>
            <ChartSeries>
              <ChartSeriesItem
                type="bar"
                data={insightScores}
                color="#06b6d4"
                border={{ width: 0 }}
              />
            </ChartSeries>
          </Chart>
        </div>

        {/* Action plan */}
        <div className="glass" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(196,181,253,0.7)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ⚡ Your Action Plan
          </h3>
          {report.actionItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 0', borderBottom: i < report.actionItems.length - 1 ? '1px solid rgba(167,139,250,0.07)' : 'none' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(124,58,237,0.4)', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '13px', color: 'rgba(221,214,254,0.75)', lineHeight: '1.5' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Export */}
        <button onClick={handleExport} style={{
          width: '100%', padding: '12px', borderRadius: '12px',
          border: '1px solid rgba(167,139,250,0.2)', background: 'transparent',
          color: 'rgba(196,181,253,0.5)', cursor: 'pointer', fontSize: '13px', transition: 'all 0.15s',
        }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)'; e.currentTarget.style.color = '#a78bfa'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)'; e.currentTarget.style.color = 'rgba(196,181,253,0.5)'; }}
        >
          📥 Export Full Conference Report (JSON)
        </button>

        {/* Reset */}
        <button onClick={() => { storage.clearAll(); router.push('/'); }} style={{
          width: '100%', padding: '12px', borderRadius: '12px',
          border: '1px solid rgba(239,68,68,0.15)', background: 'transparent',
          color: 'rgba(239,68,68,0.35)', cursor: 'pointer', fontSize: '13px', transition: 'all 0.15s',
        }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = 'rgba(239,68,68,0.6)'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = 'rgba(239,68,68,0.35)'; }}
        >
          🗑 Clear & Start New Conference
        </button>

      </div>
    </div>
  );
}