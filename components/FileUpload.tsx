import React, { useRef, useState } from 'react';
import { UploadIcon, DownloadIcon } from './Icons';
import { generateSampleData } from '../utils/csvHelper';

interface FileUploadProps {
  onDataLoaded: (csvContent: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onDataLoaded(content);
    };
    reader.readAsText(file);
  };

  const loadSample = () => {
    onDataLoaded(generateSampleData());
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-slate-300 hover:border-indigo-400 bg-white'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <UploadIcon className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Upload Student Data CSV
        </h3>
        <p className="text-slate-500 mb-6">
          Drag and drop your file here, or click to browse.
        </p>
        
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex justify-center gap-4">
            <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
            Select File
            </button>
            <button
            onClick={loadSample}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
             <DownloadIcon className="w-4 h-4" /> Load Sample
            </button>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-400">
          Supported Format: CSV with headers (e.g., Name, ID, Math, Physics, Attendance)
        </p>
      </div>
    </div>
  );
};