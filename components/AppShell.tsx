"use client"

import { usePathname } from "next/navigation"
import Sidebar from "./Sidebar"

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/clients": "Клиенты",
  "/clients/new": "Новый клиент",
  "/deals": "Сделки",
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/register"

  if (isAuthPage) {
    return <div className="min-h-screen" style={{ background: "#080B14" }}>{children}</div>
  }

  const title = pageTitles[pathname] ?? "NexusFlow"

  return (
    <div className="flex min-h-screen" style={{ background: "#080B14" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="flex items-center justify-between px-8 h-16 border-b shrink-0"
          style={{ borderColor: "#1E2540" }}
        >
          <div>
            <h1 className="font-semibold text-base" style={{ color: "#E8EAFF" }}>{title}</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
