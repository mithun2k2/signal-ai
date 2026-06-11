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

  const stripEmoji = (str: string) => str.replace(/[^\x00-\x7F]/g, '').trim();

  const handleExportJSON = () => {
    const data = JSON.stringify({ profile: storage.getProfile(), captures, report }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signalai-conference-report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    const profile = storage.getProfile();
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const addText = (text: string, size: number, bold = false, color = [30, 20, 60] as number[]) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(color[0], color[1], color[2]);
      const lines = doc.splitTextToSize(text, maxWidth) as string[];
      if (y + lines.length * size * 0.4 > 280) { doc.addPage(); y = 20; }
      doc.text(lines, margin, y);
      y += lines.length * size * 0.5 + 2;
    };

    const addDivider = () => {
      doc.setDrawColor(124, 58, 237);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
    };

    // Header bar
    doc.setFillColor(15, 10, 40);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(167, 139, 250);
    doc.text('SignalAI', margin, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(196, 181, 253);
    doc.text('Conference Intelligence Report', margin, 27);
    y = 45;

    // Meta
    addText(`Conference: ${profile?.conference || 'Conference'}`, 10, false, [100, 80, 150]);
    addText(`Attendee: ${profile?.name || 'Unknown'}`, 10, false, [100, 80, 150]);
    addText(`Generated: ${new Date().toLocaleDateString()}`, 10, false, [100, 80, 150]);
    y += 4;
    addDivider();

    // ROI Score
    addText('ROI SCORE', 11, true, [124, 58, 237]);
    addText(`${report.roiScore}/100 - ${report.roiBreakdown.estimatedValue} Value`, 18, true, [124, 58, 237]);
    addText(`Captures: ${captures.length}  |  Insights: ${report.topInsights.length}  |  Follow-ups: ${report.followUpEmails.length}  |  Actions: ${report.actionItems.length}`, 9, false, [100, 80, 150]);
    y += 4;
    addDivider();

    // Insights
    addText('TOP INSIGHTS', 11, true, [124, 58, 237]);
    y += 2;
    report.topInsights.forEach((ins, i) => {
      addText(`${i + 1}. ${stripEmoji(ins.title)} [${ins.category}] - ${ins.relevanceScore}/10`, 10, true, [30, 20, 60]);
      addText(stripEmoji(ins.summary), 9, false, [80, 70, 100]);
      addText(`Action: ${stripEmoji(ins.actionItem)}`, 9, false, [124, 58, 237]);
      y += 3;
    });
    addDivider();

    // Action Items
    addText('ACTION PLAN THIS WEEK', 11, true, [124, 58, 237]);
    y += 2;
    report.actionItems.forEach((item, i) => {
      addText(`${i + 1}. ${stripEmoji(item)}`, 9, false, [30, 20, 60]);
    });
    y += 4;
    addDivider();

    // Follow-up Emails
    if (report.followUpEmails.length > 0) {
      addText('FOLLOW-UP EMAILS', 11, true, [124, 58, 237]);
      y += 2;
      report.followUpEmails.forEach(fu => {
        addText(`To: ${fu.personName}`, 10, true, [30, 20, 60]);
        addText(`Context: ${fu.context}`, 9, false, [100, 80, 150]);
        addText(stripEmoji(fu.emailDraft), 9, false, [30, 20, 60]);
        y += 4;
      });
      addDivider();
    }

    // LinkedIn Post
    addText('LINKEDIN POST', 11, true, [124, 58, 237]);
    y += 2;
    addText(stripEmoji(report.linkedInPost), 9, false, [30, 20, 60]);
    y += 4;
    addDivider();

    // Footer
    addText('Generated by SignalAI - signal-ai-blond.vercel.app', 8, false, [124, 58, 237]);

    doc.save(`signalai-report-${profile?.name || 'conference'}.pdf`);
  };

  const STAT_CARDS = [
    { label: 'Captured', value: captures.length, color: '#a78bfa' },
    { label: 'Insights', value: report.topInsights.length, color: '#60a5fa' },
    { label: 'Follow-ups', value: report.followUpEmails.length, color: '#34d399' },
    { label: 'Actions', value: report.actionItems.length, color: '#fbbf24' },
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
              <div style={{ fontSize: '22px', fontWeight: '800', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(167,139,250,0.5)', marginTop: '6px', fontWeight: '600' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ROI Gauge */}
        <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(196,181,253,0.7)', marginBottom: '4px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
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
                labels={{ color: '#a78bfa', font: '12px sans-serif' }}
                line={{ color: 'rgba(167,139,250,0.15)' }}
                majorGridLines={{ visible: false }}
              />
            </ChartCategoryAxis>
            <ChartValueAxis>
              <ChartValueAxisItem
                labels={{ color: '#a78bfa', font: '11px sans-serif' }}
                line={{ visible: false }}
                majorGridLines={{ color: 'rgba(167,139,250,0.1)', dashType: 'dash' }}
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
                labels={{ color: '#a78bfa', font: '11px sans-serif' }}
                line={{ color: 'rgba(167,139,250,0.15)' }}
                majorGridLines={{ visible: false }}
              />
            </ChartCategoryAxis>
            <ChartValueAxis>
              <ChartValueAxisItem
                min={0} max={10}
                labels={{ color: '#a78bfa', font: '11px sans-serif' }}
                line={{ visible: false }}
                majorGridLines={{ color: 'rgba(167,139,250,0.1)', dashType: 'dash' }}
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
            Your Action Plan
          </h3>
          {report.actionItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 0', borderBottom: i < report.actionItems.length - 1 ? '1px solid rgba(167,139,250,0.07)' : 'none' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(124,58,237,0.4)', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '13px', color: 'rgba(221,214,254,0.75)', lineHeight: '1.5' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Export buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportJSON} className="btn-neon"
            style={{ flex: 1, background: 'linear-gradient(135deg, #0891b2, #06b6d4)', boxShadow: '0 0 20px rgba(6,182,212,0.3)', border: '1px solid rgba(34,211,238,0.4)' }}>
            Export JSON
          </button>
          <button onClick={handleExportPDF} className="btn-neon"
            style={{ flex: 1, background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 0 20px rgba(124,58,237,0.4)', border: '1px solid rgba(167,139,250,0.4)' }}>
            Export PDF
          </button>
        </div>

        {/* Reset */}
        <button onClick={() => { storage.clearAll(); router.push('/'); }} className="btn-neon"
          style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', boxShadow: '0 0 20px rgba(239,68,68,0.3)', border: '1px solid rgba(248,113,113,0.4)' }}>
          Clear & Start New Conference
        </button>

      </div>
    </div>
  );
}