'use client';

import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';

interface DataPoint {
  date: string;
  [key: string]: string | number;
}

interface PerformanceChartProps {
  data: DataPoint[];
  lines: {
    key: string;
    color: string;
    name: string;
  }[];
  height?: number;
}

export function PerformanceChart({
  data,
  lines,
  height = 400,
}: PerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          className="text-muted-foreground text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis
          className="text-muted-foreground text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.name}
            stroke={`hsl(var(${line.color}))`}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
