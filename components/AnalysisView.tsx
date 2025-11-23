import React, { useState } from 'react';
import { AIAnalysisResult } from '../types';
import { AIIcon, CheckIcon, AlertIcon, CodeIcon, ReportIcon } from './Icons';

interface AnalysisViewProps {
  result: AIAnalysisResult | null;
  loading: boolean;
  error: string | null;
  onAnalyze: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ result, loading, error, onAnalyze }) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'code'>('insights');

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-slate-800">Analyzing Data with Gemini AI...</h3>
        <p className="text-slate-500 mt-2">Identifying trends, outliers, and correlations.</p>
      </div>
    );
  }

  if (!result && !error) {
    return (
      <div className="bg-indigo-900 text-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <AIIcon className="w-6 h-6 text-indigo-300" />
            Unlock Deep Insights
          </h3>
          <p className="text-indigo-200 max-w-lg">
            Use Google Gemini to analyze student performance, detect at-risk students, and generate Python analysis scripts automatically.
          </p>
        </div>
        <button
          onClick={onAnalyze}
          className="px-6 py-3 bg-white text-indigo-900 rounded-lg font-bold hover:bg-indigo-50 transition-colors shadow-md whitespace-nowrap"
        >
          Start AI Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Error State */}
        {error && (
            <div className="p-4 bg-red-50 border-b border-red-100 text-red-700 flex items-center gap-3">
                <AlertIcon className="w-5 h-5" />
                {error}
                <button onClick={onAnalyze} className="ml-auto text-sm font-semibold hover:underline">Retry</button>
            </div>
        )}

      {/* Tabs */}
      {result && (
        <>
            <div className="flex border-b border-slate-200">
                <button
                onClick={() => setActiveTab('insights')}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors ${
                    activeTab === 'insights'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
                >
                <ReportIcon className="w-4 h-4" />
                Strategic Insights
                </button>
                <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors ${
                    activeTab === 'code'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
                >
                <CodeIcon className="w-4 h-4" />
                Python Source Code
                </button>
            </div>

            <div className="p-6">
                {activeTab === 'insights' ? (
                <div className="space-y-8">
                    <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Executive Summary</h4>
                    <p className="text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                        {result.summary}
                    </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Key Trends Detected</h4>
                        <ul className="space-y-3">
                        {result.keyTrends.map((trend, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                            <span className="mt-0.5 bg-blue-100 text-blue-600 rounded-full p-1">
                                <AlertIcon className="w-3 h-3" />
                            </span>
                            <span className="text-slate-700 text-sm">{trend}</span>
                            </li>
                        ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Recommendations</h4>
                        <ul className="space-y-3">
                        {result.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                            <span className="mt-0.5 bg-green-100 text-green-600 rounded-full p-1">
                                <CheckIcon className="w-3 h-3" />
                            </span>
                            <span className="text-slate-700 text-sm">{rec}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                    </div>
                </div>
                ) : (
                <div>
                    <div className="flex justify-between items-center mb-4">
                    <div>
                        <h4 className="font-semibold text-slate-800">Generated Python Analysis Script</h4>
                        <p className="text-sm text-slate-500">Run this code locally to reproduce analysis and charts.</p>
                    </div>
                    <button 
                        onClick={() => navigator.clipboard.writeText(result.pythonScript)}
                        className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-700 transition-colors"
                    >
                        Copy Code
                    </button>
                    </div>
                    <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed">
                    {result.pythonScript}
                    </pre>
                </div>
                )}
            </div>
        </>
      )}
    </div>
  );
};