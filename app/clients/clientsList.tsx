"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/client"
import Link from "next/link"

const statusStyles: Record<string, { bg: string; color: string; dot: string }> = {
  active:   { bg: "rgba(139,92,246,0.1)",  color: "#8B5CF6", dot: "#8B5CF6" },
  new:      { bg: "rgba(99,102,241,0.1)",  color: "#6366F1", dot: "#6366F1" },
  inactive: { bg: "rgba(100,116,139,0.1)", color: "#64748B", dot: "#64748B" },
}

function getInitials(name: string) {
  if (!name) return "?"
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function Avatar({ name }: { name: string }) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
      style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6" }}
    >
      {getInitials(name)}
    </div>
  )
}

export default function ClientList() {
  const { data, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from("clients").select("*").eq("user_id", user?.id)
      return data
    },
  })

  if (isLoading)
    return <p className="text-sm p-4" style={{ color: "#565E80" }}>Загрузка...</p>

  return (
    <>
    {data?.length === 0 ? (
      <div className="rounded-xl p-12 flex items-center justify-center" style={{ border: "1px solid #1E2540", background: "#111627" }}>
        <p className="text-sm" style={{ color: "#565E80" }}>Клиентов нет</p>
      </div>) : 
      (<div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1E2540", background: "#111627" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid #1E2540" }}>
              {["Имя", "Компания", "Email", "Телефон", "Статус", "Действие"].map((col) => (
                <th
                  key={col}
                  className="text-left text-xs font-medium px-6 py-3 uppercase tracking-wider"
                  style={{ color: "#565E80" }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((client, index) => {
              const s = statusStyles[client.status] ?? statusStyles.inactive
              return (
                <tr
                  key={client.id ?? index}
                  style={{ borderBottom: "1px solid #1E2540" }}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={client.name} />
                      <span className="text-sm font-medium" style={{ color: "#E8EAFF" }}>
                        {client.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm" style={{ color: "#565E80" }}>{client.company}</td>
                  <td className="px-6 py-3 text-sm" style={{ color: "#565E80" }}>{client.email}</td>
                  <td className="px-6 py-3 text-sm" style={{ color: "#565E80" }}>{client.phone}</td>
                  <td className="px-6 py-3">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 w-fit"
                      style={{ background: s.bg, color: s.color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                      {client.status === "active" ? "Активный" :
                      client.status === "new" ? "Новый" : client.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <Link
                      href={`clients/${client.id}`}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                      style={{ border: "1px solid #1E2540", color: "#565E80" }}
                    >
                      Открыть
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>)
      } 
    </>
  )
}
