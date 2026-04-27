type Deal = { status: string; amount: number }

export default function DealsStats({ deals }: { deals: Deal[] }) {
  const stats = [
    { label: "Всего сделок", value: deals.length, color: "#E8EAFF" },
    { label: "В работе", value: deals.filter((d) => d.status === "active").length, color: "#8B5CF6" },
    { label: "Выиграно", value: deals.filter((d) => d.status === "won").length, color: "#10B981" },
    { label: "Проиграно", value: deals.filter((d) => d.status === "lost").length, color: "#EF4444" },
  ]

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl p-5" style={{ background: "#111627", border: "1px solid #1E2540" }}>
          <p className="text-sm mb-2" style={{ color: "#565E80" }}>{stat.label}</p>
          <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
