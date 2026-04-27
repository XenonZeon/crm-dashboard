"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"

type Props = {
  id: number
  status: string
}

const statusStyles: Record<string, { bg: string; color: string; dot: string }> = {
  active: { bg: "rgba(139,92,246,0.1)", color: "#8B5CF6", dot: "#8B5CF6" },
  won:    { bg: "rgba(16,185,129,0.1)", color: "#10B981", dot: "#10B981" },
  lost:   { bg: "rgba(239,68,68,0.1)",  color: "#EF4444", dot: "#EF4444" },
  new:    { bg: "rgba(99,102,241,0.1)", color: "#6366F1", dot: "#6366F1" },
}

export default function StatusSelect({ id, status }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const supabase = createClient()
      const{error} = await supabase.from("deals").update({ status: newStatus }).eq("id", id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] })
      router.refresh()
    },
  })

  const s = statusStyles[status] ?? statusStyles.new

  return (
    <div className="relative">
      <span
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 w-fit cursor-pointer select-none"
        style={{ background: s.bg, color: s.color }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
        {status}
      </span>

      {isOpen && (
        <div
          className="absolute top-7 left-0 z-10 rounded-lg overflow-hidden"
          style={{ background: "#111627", border: "1px solid #1E2540", minWidth: 100 }}
        >
          {["active", "won", "lost", "new"].filter((s) => s !== status).map((s) => {
            const st = statusStyles[s]
            return (
              <div
                key={s}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer text-xs transition-all hover:opacity-80"
                style={{ color: st.color }}
                onClick={() => {
                  mutation.mutate(s)
                  setIsOpen(false)
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                {s}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
