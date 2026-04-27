"use client"

import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"

type Props = {
  id: number
}

export default function DeleteButton({ id }: Props) {
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: async () => {
      const supabase = createClient()
      const { error } = await supabase.from("deals").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      router.push("/deals")
    },
  })

  return (
    <button
      onClick={() => mutation.mutate()}
      className="text-red-400 font-medium rounded-lg px-4 py-2.5 transition-all text-sm cursor-pointer w-full hover:opacity-80"
      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
    >
      {mutation.isPending ? "Удаление..." : "Удалить сделку"}
    </button>
  )
}