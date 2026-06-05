"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const pieLabel = (entry: { name?: string; value?: number }) => `${entry.name ?? ""}: ${entry.value ?? 0}`;

export function DashboardCharts({ propertiesByType }: { propertiesByType: { type: string; count: number }[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Imóveis por tipo</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={propertiesByType}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="type" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Distribuição</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={propertiesByType} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={90} label={pieLabel}>
              {propertiesByType.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
