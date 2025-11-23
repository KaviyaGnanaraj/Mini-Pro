import { StudentRecord, ColumnStats } from '../types';

export const parseCSV = (csvText: string): StudentRecord[] => {
  const lines = csvText.split('\n').filter((line) => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const data: StudentRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length === headers.length) {
      const record: StudentRecord = {};
      let isValid = true;
      headers.forEach((header, index) => {
        let value: string | number = currentLine[index].trim().replace(/^"|"$/g, '');
        // Attempt to convert to number if possible
        if (!isNaN(Number(value)) && value !== '') {
            value = Number(value);
        }
        record[header] = value;
      });
      if (isValid) data.push(record);
    }
  }
  return data;
};

export const calculateStats = (data: StudentRecord[]): ColumnStats[] => {
  if (data.length === 0) return [];

  const numericKeys = Object.keys(data[0]).filter((key) => 
    typeof data[0][key] === 'number' && key.toLowerCase() !== 'id'
  );

  return numericKeys.map((key) => {
    const values = data.map((d) => d[key] as number);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Assume passing is > 40% of Max or > 40 absolute if reasonable scale
    const passingThreshold = max <= 4 ? 2 : 40; 
    const passingCount = values.filter(v => v >= passingThreshold).length;

    return {
      field: key,
      average: parseFloat(avg.toFixed(2)),
      min,
      max,
      passingRate: parseFloat(((passingCount / values.length) * 100).toFixed(1))
    };
  });
};

export const generateSampleData = (): string => {
  return `StudentName,StudentID,Mathematics,Physics,ComputerScience,Attendance
Alice Johnson,1001,85,90,92,95
Bob Smith,1002,65,70,75,80
Charlie Brown,1003,45,50,55,60
David Wilson,1004,95,98,99,98
Eva Davis,1005,72,68,80,85
Frank Miller,1006,55,60,58,70
Grace Lee,1007,88,85,90,92
Hannah White,1008,35,40,42,50
Ian Clark,1009,78,82,85,88
Jane Doe,1010,92,94,96,96`;
};