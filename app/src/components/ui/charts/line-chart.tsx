'use client'
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Props = {
  chartData: { name: string; grade: number; attempt: number }[];
}

export default function LineChartComponent({ chartData }: Props) {

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
        <XAxis dataKey="attempt" />
        <YAxis dataKey='grade' />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="grade" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

