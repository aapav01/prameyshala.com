'use client'
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle } from 'recharts';

type Props = {
  chartData: { name: string; grade: number; }[];
  XAxisDatakey: any;
  YAxisDatakey: any;
}

export default function BarChartComponent({ chartData, XAxisDatakey, YAxisDatakey }: Props) {
  const alternatingColors = chartData.map((_, index) => index % 2 === 0 ? '#8884d8' : '#82ca9d');

  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart
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
        <Bar dataKey="grade" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

