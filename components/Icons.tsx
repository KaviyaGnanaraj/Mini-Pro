import React from 'react';
import { 
  UploadCloud, 
  BarChart3, 
  FileText, 
  Code2, 
  BrainCircuit, 
  AlertCircle,
  CheckCircle2,
  Download
} from 'lucide-react';

export const UploadIcon = ({ className }: { className?: string }) => <UploadCloud className={className} />;
export const ChartIcon = ({ className }: { className?: string }) => <BarChart3 className={className} />;
export const ReportIcon = ({ className }: { className?: string }) => <FileText className={className} />;
export const CodeIcon = ({ className }: { className?: string }) => <Code2 className={className} />;
export const AIIcon = ({ className }: { className?: string }) => <BrainCircuit className={className} />;
export const AlertIcon = ({ className }: { className?: string }) => <AlertCircle className={className} />;
export const CheckIcon = ({ className }: { className?: string }) => <CheckCircle2 className={className} />;
export const DownloadIcon = ({ className }: { className?: string }) => <Download className={className} />;