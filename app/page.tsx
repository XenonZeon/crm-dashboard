import { createClient } from "@/lib/server"
import DealsBarChart from "./components/DealsBarChart"
import ClientStatusChart from "./components/ClientStatusChart"
import { Users, Layers, DollarSign } from "lucide-react"
import Link from "next/link"


function getInitials(name: string) {
  if (!name) return "?"
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
} 

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { count: clientsCount } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)
  const { data: recentClients } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user?.id)
    .limit(4)
  
  const {data : deals} = await supabase.from("deals").select("*").eq("user_id", user?.id)
  const {data : recentDeals} = await supabase.from("deals").select("*").eq("user_id", user?.id).limit(5)

  const activeDeals = deals?.filter((deal) => deal.status == "active") ?? []
  const revenue = deals?.filter((deal) => deal.status == "won").reduce((acc, deal) => acc + deal.amount, 0)

  const stats = [
    { label: "Всего клиентов", value: clientsCount ?? 0, color: "#E8EAFF", icon: Users },
    { label: "Активных сделок", value: (activeDeals.length ?? 0), color: "#8B5CF6", icon: Layers },
    { label: "Выручка", value: `₽ ${revenue.toLocaleString("ru-RU") ?? 0}`, color: "#8B5CF6", icon: DollarSign },
  ]

  const statusStyles: Record<string, { bg: string; color: string }> = {
    active:   { bg: "rgba(139,92,246,0.1)", color: "#8B5CF6" },
    new:      { bg: "rgba(99,102,241,0.1)", color: "#6366F1" },
    inactive: { bg: "rgba(100,116,139,0.1)", color: "#64748B" },
  }

  return (
      <div className="p-8">
        {/* Стат карточки */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map(({ label, value, color, icon: Icon }, i) => (
            <div key={label} className="rounded-xl p-5 animate-fade-slide" style={{ background: "#111627", border: "1px solid #1E2540", animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm" style={{ color: "#565E80" }}>{label}</p>
                <Icon size={18} style={{ color: "#565E80" }} />
              </div>
              <p className="text-3xl font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 animate-fade-slide" style={{ animationDelay: "0.3s" }}>
          <div className="col-span-2">
            <DealsBarChart />
          </div>
          <ClientStatusChart />
        </div>


        <div className="rounded-xl p-6 mb-6 flex flex-col animate-fade-slide" style={{ animationDelay: "0.4s", background: "#111627", border: "1px solid #1E2540", minHeight: 120 }}>
          <p className="font-medium mb-4" style={{ color: "#E8EAFF" }}>Последние сделки</p>
          <div className="flex flex-col gap-3 flex-1">
            {recentDeals?.length == 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm" style={{ color: "#565E80" }}>Сделок нет</p>
              </div>
            ) : (recentDeals?.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #1E2540" }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6" }}>
                    {getInitials(deal.client)}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#E8EAFF" }}>{deal.title}</p>
                    <p className="text-xs" style={{ color: "#565E80" }}>{deal.client}</p>
                  </div>
                </div>
                <p className="text-sm font-medium" style={{ color: "#E8EAFF" }}>{`₽ ${deal.amount.toLocaleString("ru-RU") ?? 0}`}</p>
              </div>
            )))}
          </div>
        </div>

        {recentClients?.length == 0 ? (
          <div className="rounded-xl p-12 flex items-center justify-center animate-fade-slide" style={{ animationDelay: "0.5s", background: "#111627", border: "1px solid #1E2540" }}>
            <p className="text-sm" style={{ color: "#565E80" }}>Клиентов нет</p>
          </div>
        ) :
        (<div className="rounded-xl p-6 animate-fade-slide" style={{ animationDelay: "0.5s", background: "#111627", border: "1px solid #1E2540" }}>
          <p className="font-medium mb-4" style={{ color: "#E8EAFF" }}>Последние клиенты</p>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #1E2540" }}>
                {["Имя", "Компания", "Email", "Статус"].map((col) => (
                  <th key={col} className="text-left text-xs font-medium pb-3 uppercase tracking-wider" style={{ color: "#565E80" }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentClients?.map((client) => {
                const s = statusStyles[client.status] ?? statusStyles.inactive
                return (
                  <tr key={client.id} style={{ borderBottom: "1px solid #1E2540" }}>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                          style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6" }}>
                          {getInitials(client.name)}
                        </div>
                        <span className="text-sm font-medium" style={{ color: "#E8EAFF" }}>{client.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm" style={{ color: "#565E80" }}>{client.company}</td>
                    <td className="py-3 text-sm" style={{ color: "#565E80" }}>{client.email}</td>
                    <td className="py-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: s.bg, color: s.color }}>
                        {client.status === "active" ? "Активный" : client.status === "new" ? "Новый" : client.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>)}
      </div>
  )
}
