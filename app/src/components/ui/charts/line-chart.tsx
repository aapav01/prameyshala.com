'use client'
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Props = {
  chartData: { name: string; grade: number; attempt: String; }[];
  XAxisDatakey: any;
  YAxisDatakey: any;
}

export default function LineChartComponent({ chartData, XAxisDatakey, YAxisDatakey }: Props) {

  return (
    <ResponsiveContainer width="100%" height={450}>
      <LineChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={XAxisDatakey} />
        <YAxis dataKey={YAxisDatakey} domain={[0, 10]} tickCount={6} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="grade" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

