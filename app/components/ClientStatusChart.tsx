"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/client"

const COLORS: Record<string, string> = {
  active:   "#8B5CF6",
  new:      "#6366F1",
  inactive: "#64748B",
}

const LABELS: Record<string, string> = {
  active:   "Активные",
  new:      "Новые",
  inactive: "Неактив.",
}

export default function ClientStatusChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await supabase.from("clients").select("status")
      return data
    },
  })

  if (isLoading)
    return <div className="rounded-xl p-6" style={{ background: "#111627", border: "1px solid #1E2540" }} />

  const counts: Record<string, number> = {}
  data?.forEach((c) => { counts[c.status] = (counts[c.status] ?? 0) + 1 })
  const total = data?.length ?? 0
  const chartData = Object.entries(counts).map(([name, value]) => ({ name, value }))

  const centerValue = activeIndex !== null ? chartData[activeIndex]?.value : total
  const centerLabel = activeIndex !== null ? LABELS[chartData[activeIndex]?.name] : "всего"

  return (
    <div className="rounded-xl p-6" style={{ background: "#111627", border: "1px solid #1E2540" }}>
      <p className="font-medium mb-0.5" style={{ color: "#E8EAFF" }}>Клиенты по статусам</p>
      <p className="text-xs mb-4" style={{ color: "#565E80" }}>Распределение</p>

      <div className="flex items-center gap-6">

        <div className="relative shrink-0" style={{ width: 110, height: 110 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={52}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name] ?? "#565E80"}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                    strokeWidth={0}
                    style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                    onMouseEnter={() => setActiveIndex(index)}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold leading-none" style={{ color: "#E8EAFF" }}>
              {centerValue}
            </span>
            <span className="text-xs mt-0.5 text-center leading-tight" style={{ color: "#565E80", maxWidth: 60 }}>
              {centerLabel}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2.5">
          {chartData.map((entry, index) => {
            const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0
            const isActive = activeIndex === null || activeIndex === index
            return (
              <div
                key={entry.name}
                className="flex items-center gap-2 cursor-pointer transition-opacity"
                style={{ opacity: isActive ? 1 : 0.35 }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORS[entry.name] ?? "#565E80" }} />
                <span className="text-sm flex-1" style={{ color: "#E8EAFF" }}>
                  {LABELS[entry.name] ?? entry.name}
                </span>
                <span className="text-sm font-medium" style={{ color: COLORS[entry.name] ?? "#565E80" }}>
                  {entry.value}
                </span>
                <span className="text-xs w-8 text-right" style={{ color: "#565E80" }}>{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
