import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter } from 'recharts';
import { StudentRecord, ColumnStats } from '../types';

interface DashboardProps {
  data: StudentRecord[];
  stats: ColumnStats[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data, stats }) => {
  const chartColors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

  // Identify attendance column for scatter plot
  const attendanceKey = stats.find(s => s.field.toLowerCase().includes('attendance'))?.field;
  const scoreKeys = stats.filter(s => !s.field.toLowerCase().includes('attendance') && !s.field.toLowerCase().includes('id')).map(s => s.field);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Overview Cards */}
      <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.field} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <p className="text-sm font-medium text-slate-500 uppercase">{stat.field}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{stat.average}</span>
              <span className="text-xs text-slate-400">avg</span>
            </div>
            {stat.passingRate !== undefined && (
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${stat.passingRate > 75 ? 'bg-green-500' : stat.passingRate > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${stat.passingRate}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Performance Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Subject Performance Distribution</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.filter(s => !s.field.toLowerCase().includes('attendance') && !s.field.toLowerCase().includes('id'))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="field" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Legend />
              <Bar dataKey="average" name="Average Score" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="max" name="Highest Score" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Attendance vs Performance Scatter (If attendance exists) */}
       {attendanceKey && scoreKeys.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Correlation: Attendance vs {scoreKeys[0]}</h3>
            <p className="text-sm text-slate-500 mb-6">Visualizing how attendance impacts performance in {scoreKeys[0]}</p>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" dataKey={attendanceKey} name="Attendance" unit="%" stroke="#64748b" />
                        <YAxis type="number" dataKey={scoreKeys[0]} name="Score" stroke="#64748b" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px' }} />
                        <Scatter name="Students" data={data} fill="#8b5cf6" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
       )}

      {/* Raw Data Table Preview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2 overflow-hidden">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Student Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-medium">
              <tr>
                {Object.keys(data[0] || {}).map((header) => (
                  <th key={header} className="px-6 py-3">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.slice(0, 10).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  {Object.values(row).map((val, vIdx) => (
                    <td key={vIdx} className="px-6 py-3 whitespace-nowrap">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > 10 && (
          <div className="mt-4 text-center text-sm text-slate-500">
            Showing first 10 rows of {data.length} records
          </div>
        )}
      </div>
    </div>
  );
};