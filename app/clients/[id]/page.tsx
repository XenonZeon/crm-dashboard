import { createClient } from "@/lib/server"
import DeleteButton from "./deleteButton"
import EditForm from "./EditFrom"
import Link from "next/link"

export default async function ClientInfo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {data : {user}} = await supabase.auth.getUser()
  const { data } = await supabase.from("clients").select("*").eq("id", id).eq("user_id", user?.id)
  const client = data?.[0]

  const statusStyles: Record<string, { bg: string; color: string }> = {
    active:   { bg: "rgba(139,92,246,0.1)",  color: "#8B5CF6" },
    new:      { bg: "rgba(99,102,241,0.1)",  color: "#6366F1" },
    inactive: { bg: "rgba(100,116,139,0.1)", color: "#64748B" },
  }
  const s = statusStyles[client?.status] ?? statusStyles.inactive

  return (
    <div className="p-8 flex flex-col items-center animate-fade-slide">
      <div className="w-full max-w-2xl">
        <Link href="/clients" className="text-sm mb-6 inline-block transition-colors hover:text-white" style={{ color: "#565E80" }}>
          ← Назад к клиентам
        </Link>

        <div className="rounded-xl p-6 mb-4" style={{ background: "#111627", border: "1px solid #1E2540" }}>
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6" }}
              >
                {client?.name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: "#E8EAFF" }}>{client?.name}</h2>
                <p className="text-sm" style={{ color: "#565E80" }}>{client?.company}</p>
              </div>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: s.bg, color: s.color }}
            >
              {client?.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg p-3" style={{ background: "#0A0D1A" }}>
              <p className="text-xs mb-1" style={{ color: "#565E80" }}>Email</p>
              <p className="text-sm" style={{ color: "#E8EAFF" }}>{client?.email}</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "#0A0D1A" }}>
              <p className="text-xs mb-1" style={{ color: "#565E80" }}>Телефон</p>
              <p className="text-sm" style={{ color: "#E8EAFF" }}>{client?.phone}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-6 mb-4" style={{ background: "#111627", border: "1px solid #1E2540" }}>
          <h3 className="font-medium mb-4" style={{ color: "#E8EAFF" }}>Редактировать</h3>
          <EditForm
            name={client?.name}
            id={client?.id}
            phone={client?.phone}
            company={client?.company}
            email={client?.email}
            status={client?.status}
          />
        </div>

        <DeleteButton id={client?.id} />
      </div>
    </div>
  )
}
