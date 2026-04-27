"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/client"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Controller } from "react-hook-form"
import StatusDropdown from "./StatusDpordown"
import { useState } from "react"


const schema = z.object({
  title: z.string().min(2, "Минимум 2 символа"),
  client: z.string().min(3, "Минимум 3 символа"),
  amount: z.number().min(1, "Минимум 1 символов"),
  status: z.string().min(3, "Минимум 3 символов"),
})

type DealForm = z.infer<typeof schema>

const fields: { name: keyof DealForm; label: string; placeholder: string }[] = [
  { name: "title", label: "Название сделки", placeholder: "It-аутсорсинг" },
  { name: "client", label: "Имя клиента", placeholder: "Иван Иванов" },
  { name: "amount", label: "Сумма", placeholder: "1,000,000" },
  { name: "status", label: "Статус", placeholder: " active / won / lost" },
]

export default function NewDeal() {
  const { register, handleSubmit, control, formState: { errors } } = useForm<DealForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      status : "active"
    }
  })
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function onSubmit(data: DealForm) {
    const supabase = createClient()
    const{data : {user}} = await supabase.auth.getUser()
    const { error } = await supabase.from("deals").insert({...data, user_id: user?.id})
    if (error) { setErrorMsg("Не удалось создать сделку"); return }
    router.push("/deals")
  }

  return (
    <div className="p-8 max-w-xl animate-fade-slide">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/clients" className="text-[#565E80] hover:text-[#E8EAFF] transition-colors text-sm">
          ← Назад
        </Link>
        <h1 className="text-[#E8EAFF] text-2xl font-bold">Новая сделка</h1>
      </div>

      <div className="bg-[#111627] border border-[#1E2540] rounded-xl p-6 ">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {fields.map(({ name, label, placeholder }) => (
            <div key={name} className="flex flex-col gap-1.5">
              <label className="text-[#E8EAFF] text-sm">{label}</label>
              { name  === "status" ? (
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <StatusDropdown value={field.value} onChange={field.onChange} />
                )}
          />) : (<input {...register(name, { valueAsNumber: name === "amount" })}
                type={name === "amount" ? "number" : "text"}
                placeholder={placeholder}
                className="bg-[#0A0D1A] border border-[#1E2540] rounded-lg px-4 py-2.5 text-[#E8EAFF] placeholder-[#565E80] text-sm outline-none focus:border-[#6366F1] transition-colors" />)
              } 
              {errors[name] && (
                <p className="text-red-400 text-xs">{errors[name]?.message}</p>
              )}
            </div>
          ))}

          {errorMsg && (
            <p className="text-xs text-center" style={{ color: "#EF4444" }}>{errorMsg}</p>
          )}
          <button
            type="submit"
            className="text-white font-medium rounded-lg py-2.5 mt-2 transition-all hover:opacity-80 text-sm cursor-pointer"
            style={{ background: "#8B5CF6" }}
          >
            Создать сделку
          </button>
        </form>
      </div>
    </div>
  )
}
