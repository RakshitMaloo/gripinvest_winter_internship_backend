import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Low Risk", value: 40 },
  { name: "Medium Risk", value: 30 },
  { name: "High Risk", value: 30 },
];

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

export default function PortfolioChart() {
  return (
    <PieChart width={400} height={300}>
      <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
