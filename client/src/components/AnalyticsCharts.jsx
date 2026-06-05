import { memo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const colors = ["#10b981", "#f59e0b"];

function AnalyticsCharts({ statusDistribution, weeklyActivity }) {
  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-5" aria-label="Task analytics charts">
      <ChartCard title="Task status" subtitle="Current workspace distribution" className="xl:col-span-2">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={82} paddingAngle={4}>
                {statusDistribution.map((item, index) => <Cell key={item.name} fill={colors[index]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-5">{statusDistribution.map((item, index) => <span key={item.name} className="flex items-center gap-2 text-xs text-slate-500"><span className="size-2 rounded-full" style={{ backgroundColor: colors[index] }} />{item.name}: {item.value}</span>)}</div>
      </ChartCard>
      <ChartCard title="Weekly activity" subtitle="Tasks created during the last 7 days" className="xl:col-span-3">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyActivity} margin={{ top: 20, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b833" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip cursor={{ fill: "#6366f110" }} contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 12 }} />
              <Bar dataKey="created" name="Tasks created" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={34} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </section>
  );
}

function ChartCard({ title, subtitle, children, className }) {
  return <article className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900 ${className}`}><h2 className="font-bold tracking-tight">{title}</h2><p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>{children}</article>;
}

export default memo(AnalyticsCharts);
