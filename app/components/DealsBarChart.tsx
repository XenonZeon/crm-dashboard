"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const mockData = [
  { month: "Янв", сделки: 3 },
  { month: "Фев", сделки: 5 },
  { month: "Мар", сделки: 4 },
  { month: "Апр", сделки: 7 },
  { month: "Май", сделки: 6 },
  { month: "Июн", сделки: 9 },
  { month: "Июл", сделки: 8 },
  { month: "Авг", сделки: 11 },
  { month: "Сен", сделки: 7 },
  { month: "Окт", сделки: 10 },
  { month: "Ноя", сделки: 13 },
  { month: "Дек", сделки: 12 },
]

export default function DealsBarChart() {
  return (
    <div className="rounded-xl p-6 relative" style={{ background: "#111627", border: "1px solid #1E2540" }}>
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="font-medium" style={{ color: "#E8EAFF" }}>Сделки по месяцам</p>
          <p className="text-xs mt-0.5" style={{ color: "#565E80" }}>2025–2026</p>
        </div>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6" }}
        >
          ↑ 18% к прошлому году
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={mockData} barCategoryGap="20%" margin={{ top: 16, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#1E2540" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#565E80", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#565E80", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ background: "#111627", border: "1px solid #1E2540", borderRadius: 8, color: "#E8EAFF" }}
            cursor={false}
          />
          <Bar
            dataKey="сделки"
            fill="rgba(139,92,246,0.35)"
            radius={[4, 4, 0, 0]}
            activeBar={{ fill: "#8B5CF6", radius: 4 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
