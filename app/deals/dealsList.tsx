"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/client"
import Link from "next/link"
import StatusSelect from "./StatusSelect"

const statusStyles: Record<string, { bg: string; color: string; dot: string }> = {
  active:   { bg: "rgba(139,92,246,0.1)", color: "#8B5CF6", dot: "#8B5CF6" },
  new:      { bg: "rgba(99,102,241,0.1)", color: "#6366F1", dot: "#6366F1" },
  inactive: { bg: "rgba(100,116,139,0.1)", color: "#64748B", dot: "#64748B" },
  won:      { bg: "rgba(16,185,129,0.1)", color: "#10B981", dot: "#10B981" },
  lost:     { bg: "rgba(239,68,68,0.1)", color: "#EF4444", dot: "#EF4444" },
}

export default function DealsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from("deals").select("*").eq("user_id", user?.id)
      return data
    },
  })

  if (isLoading)
    return <p className="text-sm p-4" style={{ color: "#565E80" }}>Загрузка...</p>

  return (
    <>
    {data?.length === 0 ? (
      <div className="rounded-xl p-12 flex items-center justify-center" style={{ border: "1px solid #1E2540", background: "#111627" }}>
        <p className="text-sm" style={{ color: "#565E80" }}>Сделок нет</p>
      </div>
    ) : (<div className="rounded-xl " style={{ border: "1px solid #1E2540", background: "#111627" }}>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid #1E2540" }}>
            {[
              { label: "Название", width: "35%" },
              { label: "Клиент", width: "25%" },
              { label: "Сумма", width: "20%" },
              { label: "Статус", width: "20%" },
            ].map(({ label, width }) => (
              <th
                key={label}
                className="text-left text-xs font-medium px-6 py-3 uppercase tracking-wider"
                style={{ color: "#565E80", width }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((deal, index) => {
            const s = statusStyles[deal.status] ?? statusStyles.inactive
            return (
              <tr key={deal.id ?? index} style={{ borderBottom: "1px solid #1E2540" }}>
                <td className="px-6 py-4 text-sm font-medium" style={{ color: "#E8EAFF" }}>
                  {deal.title}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                      style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6" }}
                    >
                      {deal.client?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) ?? "?"}
                    </div>
                    <span className="text-sm" style={{ color: "#565E80" }}>{deal.client}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium" style={{ color: "#E8EAFF" }}>
                  ₽ {Number(deal.amount).toLocaleString("ru-RU")}
                </td>
                <td className="px-6 py-4">
                    <StatusSelect id={deal.id} status={deal.status} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>)}
    </>
  )
}
