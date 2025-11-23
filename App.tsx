import React, { useState, useMemo } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { AnalysisView } from './components/AnalysisView';
import { parseCSV, calculateStats } from './utils/csvHelper';
import { analyzeStudentData } from './services/geminiService';
import { StudentRecord, AIAnalysisResult, AnalysisStatus } from './types';
import { ChartIcon, CodeIcon } from './components/Icons';

function App() {
  const [data, setData] = useState<StudentRecord[]>([]);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stats = useMemo(() => calculateStats(data), [data]);

  const handleDataLoaded = (csvContent: string) => {
    try {
      const parsedData = parseCSV(csvContent);
      if (parsedData.length === 0) {
        alert("No valid data found in CSV");
        return;
      }
      setData(parsedData);
      // Reset analysis when new data loads
      setAnalysisStatus(AnalysisStatus.IDLE);
      setAiResult(null);
      setErrorMsg(null);
    } catch (e) {
      console.error(e);
      alert("Error parsing CSV");
    }
  };

  const handleAnalyze = async () => {
    if (data.length === 0) return;
    
    setAnalysisStatus(AnalysisStatus.ANALYZING);
    setErrorMsg(null);
    
    try {
      // Send stats and a small sample of rows to avoid token limits
      const sample = data.slice(0, 15); 
      const result = await analyzeStudentData(stats, sample);
      setAiResult(result);
      setAnalysisStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      setAnalysisStatus(AnalysisStatus.ERROR);
      setErrorMsg(err.message || "Failed to analyze data. Please check your API Key.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <ChartIcon className="text-white w-6 h-6" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">EduAnalytics Pro</h1>
                <p className="text-xs text-slate-500 font-medium">Student Performance System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                System Active
             </div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Transform Student Data into Actionable Insights</h2>
                    <p className="text-slate-500 max-w-xl mx-auto text-lg">
                        Upload your CSV data to generate instant visualizations, identify performance gaps, and get AI-powered recommendations.
                    </p>
                </div>
                <FileUpload onDataLoaded={handleDataLoaded} />
                
                {/* Feature highlights for empty state */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
                    {[
                        { title: "Instant Visualization", desc: "Automatic generation of performance charts and grade distributions." },
                        { title: "AI Analysis", desc: "Powered by Gemini to detect trends and suggest curriculum improvements." },
                        { title: "Python Export", desc: "Get generated Python code to run the analysis offline using Pandas." }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">
                            <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
                            <p className="text-sm text-slate-500">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
          ) : (
            <>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Class Performance Dashboard</h2>
                    <button 
                        onClick={() => setData([])}
                        className="text-sm text-red-600 hover:text-red-700 font-medium bg-red-50 px-4 py-2 rounded-lg transition-colors"
                    >
                        Reset Data
                    </button>
                </div>

                {/* Main Stats and Charts */}
                <Dashboard data={data} stats={stats} />

                {/* AI Section */}
                <AnalysisView 
                    result={aiResult} 
                    loading={analysisStatus === AnalysisStatus.ANALYZING}
                    error={errorMsg}
                    onAnalyze={handleAnalyze}
                />
            </>
          )}

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} EduAnalytics Pro. Powered by React, Tailwind & Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;