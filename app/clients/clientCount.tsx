"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/client"

export default function ClientCount() {
  const { data } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await supabase.from("clients").select("*")
      return data
    },
  })

  return (
    <p className="text-sm" style={{ color: "#565E80" }}>
      {data ? `${data.length} контактов` : ""}
    </p>
  )
}
