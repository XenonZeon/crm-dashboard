import ClientList from "./clientsList"
import ClientCount from "./clientCount"
import Link from "next/link"

export default function Clients() {
  return (
    <div className="p-8 animate-fade-slide">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-0.5" style={{ color: "#E8EAFF" }}>Клиенты</h1>
          <ClientCount />
        </div>
        <Link
          href="/clients/new"
          className="text-sm font-medium px-4 py-2 rounded-lg transition-all hover:opacity-80 text-white flex items-center gap-1"
          style={{ background: "#8B5CF6" }}
        >
          + Добавить клиента
        </Link>
      </div>
      <ClientList />
    </div>
  )
}
