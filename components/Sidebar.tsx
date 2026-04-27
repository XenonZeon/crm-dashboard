"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { LayoutDashboard, Users, Briefcase, LogOut } from "lucide-react"

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Клиенты", icon: Users },
  { href: "/deals", label: "Сделки", icon: Briefcase },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <aside
      className="flex flex-col shrink-0"
      style={{ width: "240px", minHeight: "100vh", background: "#0A0D1A", borderRight: "1px solid #1E2540" }}
    >
      <div className="flex items-center gap-2 px-6 h-16" style={{ borderBottom: "1px solid #1E2540" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ background: "#8B5CF6" }}
        >
          N
        </div>
        <div>
          <p className="font-bold text-sm leading-tight" style={{ color: "#E8EAFF" }}>NexusFlow</p>
          <p className="text-xs" style={{ color: "#565E80" }}>CRM Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all hover:opacity-80"
              style={
                isActive
                  ? { background: "rgba(139,92,246,0.15)", color: "#8B5CF6" }
                  : { color: "#565E80" }
              }
            >
              <Icon size={17} />
              {label}
              {isActive && (
                <div
                  className="ml-auto w-1 h-4 rounded-full"
                  style={{ background: "#8B5CF6" }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4" style={{ borderTop: "1px solid #1E2540" }}>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-all hover:opacity-80"
          style={{ color: "#565E80" }}
        >
          <LogOut size={17} />
          Выйти
        </button>
      </div>
    </aside>
  )
}
