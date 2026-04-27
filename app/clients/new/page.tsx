"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/client"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import StatusDropdown from "../[id]/StatusDropdowm"
import { Controller } from "react-hook-form"

const schema = z.object({
  name: z.string().min(2, "Минимум 2 символа"),
  company: z.string().min(3, "Минимум 3 символа"),
  phone: z.string().min(7, "Минимум 7 символов"),
  email: z.string().email("Введите корректный email"),
  status: z.string().min(3, "Минимум 3 символа"),
})

type ClientForm = z.infer<typeof schema>

const fields: { name: keyof ClientForm; label: string; placeholder: string }[] = [
  { name: "name", label: "Имя", placeholder: "Иван Иванов" },
  { name: "company", label: "Компания", placeholder: "ООО Ромашка" },
  { name: "phone", label: "Телефон", placeholder: "+7 999 000 00 00" },
  { name: "email", label: "Email", placeholder: "ivan@example.com" },
  { name: "status", label: "Статус", placeholder: "new / active / inactive" },
]

export default function NewClient() {
  const { register, handleSubmit, control, formState: { errors } } = useForm<ClientForm>({
    resolver: zodResolver(schema),
  })
  const router = useRouter()

  async function onSubmit(data: ClientForm) {
    const supabase = createClient()
    const{data : {user}} = await supabase.auth.getUser()
    const { error } = await supabase.from("clients").insert({...data, user_id: user?.id})
    if (error) { console.log(error); return }
    router.push("/clients")
  }

  return (
    <div className="p-8 max-w-xl animate-fade-slide">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/clients" className="text-[#565E80] hover:text-[#E8EAFF] transition-colors text-sm">
          ← Назад
        </Link>
        <h1 className="text-[#E8EAFF] text-2xl font-bold">Новый клиент</h1>
      </div>

      <div className="bg-[#111627] border border-[#1E2540] rounded-xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {fields.map(({ name: fieldName, label, placeholder }) => (
          <div key={fieldName} className="flex flex-col gap-1.5">
          <label className="text-[#E8EAFF] text-sm">{label}</label>
          {fieldName === "status" ? (<Controller name="status" control={control} render={({ field }) => (
          <StatusDropdown value={field.value} onChange={field.onChange} />)} />) : (<input {...register(fieldName)}
            className="bg-[#0A0D1A] border border-[#1E2540] rounded-lg px-4 py-2.5 text-[#E8EAFF] placeholder-[#565E80] text-sm outline-none focus:border-[#6366F1] transition-colors"
            placeholder={placeholder}
          />)}
        </div>
      ))}

          <button
            type="submit"
            className="text-white font-medium rounded-lg py-2.5 mt-2 transition-all hover:opacity-80 text-sm cursor-pointer"
            style={{ background: "#8B5CF6" }}
          >
            Создать клиента
          </button>
        </form>
      </div>
    </div>
  )
}
