'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartTitle,
  ChartLegend,
} from '@progress/kendo-react-charts';
import { RadialGauge } from '@progress/kendo-react-gauges';
import { storage } from '@/lib/storage';
import { SynthesisReport, Capture } from '@/lib/types';

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
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-400 mb-6">No report yet. Run synthesis first.</p>
          <button
            onClick={() => router.push('/synthesis')}
            className="text-violet-400 hover:text-violet-300 border border-violet-800 px-6 py-2 rounded-xl"
          >
            → Go to Synthesis
          </button>
        </div>
      </div>
    );
  }

  const capturesByType = ['note', 'slide', 'contact', 'url', 'quote'].map(type => ({
    type,
    count: captures.filter(c => c.type === type).length,
  }));

  const insightScores = report.topInsights.map(i => i.relevanceScore);
  const insightLabels = report.topInsights.map(i =>
    i.title.length > 18 ? i.title.slice(0, 18) + '...' : i.title
  );

  const gaugeOptions = {
    value: report.roiScore,
     pointer: { value: report.roiScore },
      scale: {
      min: 0,
      max: 100,
      majorUnit: 20,
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => router.push('/synthesis')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <span className="font-bold">Conference ROI Dashboard</span>
        <span className="text-violet-400 text-sm font-semibold">ForgeAI</span>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Captured', value: captures.length, color: 'text-violet-400' },
            { label: 'Insights', value: report.topInsights.length, color: 'text-blue-400' },
            { label: 'Follow-ups', value: report.followUpEmails.length, color: 'text-green-400' },
            { label: 'Actions', value: report.actionItems.length, color: 'text-yellow-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ROI Gauge */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="font-bold text-center mb-2">Overall Conference ROI Score</h3>
          <div className="flex justify-center">
            <RadialGauge
              {...gaugeOptions}
              style={{ width: 280, height: 180 }}
            />
          </div>
          <div className="text-center mt-2">
            <span className="text-4xl font-bold text-violet-400">{report.roiScore}</span>
            <span className="text-gray-400 ml-2 text-lg">/ 100</span>
            <div className="text-gray-500 text-sm mt-1">{report.roiBreakdown.estimatedValue} Value</div>
          </div>
        </div>

        {/* Captures by Type */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="font-bold mb-4">Captures by Type</h3>
          <Chart style={{ height: 220 }}>
            <ChartTitle text="" />
            <ChartLegend visible={false} />
            <ChartCategoryAxis>
              <ChartCategoryAxisItem
                categories={capturesByType.map(d => d.type)}
              />
            </ChartCategoryAxis>
            <ChartSeries>
              <ChartSeriesItem
                type="column"
                data={capturesByType.map(d => d.count)}
                color="#7c3aed"
                border={{ width: 0 }}
              />
            </ChartSeries>
          </Chart>
        </div>

        {/* Insight Relevance */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="font-bold mb-4">Insight Relevance Scores</h3>
          <Chart style={{ height: 220 }}>
            <ChartTitle text="" />
            <ChartLegend visible={false} />
            <ChartCategoryAxis>
              <ChartCategoryAxisItem categories={insightLabels} />
            </ChartCategoryAxis>
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

        {/* Action Items Summary */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="font-bold mb-4">⚡ Your Action Plan</h3>
          <div className="space-y-2">
            {report.actionItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-5 h-5 rounded-full border-2 border-violet-500 flex-shrink-0" />
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Export */}
        <button
          onClick={handleExport}
          className="w-full py-3 rounded-xl border border-gray-700 text-gray-400 hover:border-violet-600 hover:text-violet-400 transition-all text-sm"
        >
          📥 Export Full Conference Report (JSON)
        </button>

        {/* New Conference */}
        <button
          onClick={() => {
            storage.clearAll();
            router.push('/');
          }}
          className="w-full py-3 rounded-xl border border-gray-800 text-gray-600 hover:border-red-900 hover:text-red-400 transition-all text-sm"
        >
          🗑 Clear & Start New Conference
        </button>

      </div>
    </div>
  );
}