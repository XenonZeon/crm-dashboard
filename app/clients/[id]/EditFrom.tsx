"use client"

import { useForm } from "react-hook-form"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"
import StatusDropdown from "./StatusDropdowm"
import { Controller } from "react-hook-form"

type Props = {
  name: string
  company: string
  email: string
  phone: string
  status: string
  id: number
}

const fields: { name: keyof Props; label: string }[] = [
  { name: "name", label: "Имя" },
  { name: "company", label: "Компания" },
  { name: "email", label: "Email" },
  { name: "phone", label: "Телефон" },
  { name: "status", label: "Статус" },
]

export default function EditForm({ name, company, email, phone, status, id }: Props) {
  const { register, handleSubmit, control } = useForm<Props>({
    defaultValues: { name, company, email, phone, status, id },
  })
  const router = useRouter()

  async function onSubmit(data: Props) {
    const supabase = createClient()
    const {data : {user}} = await supabase.auth.getUser()
    const { error } = await supabase.from("clients").update(data).eq("id", id).eq("user_id", user?.id)
    if (error) { console.log(error); return }
    router.push("/clients")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {fields.map(({ name: fieldName, label }) => (
        <div key={fieldName} className="flex flex-col gap-1.5">
          <label className="text-[#E8EAFF] text-sm">{label}</label>
          {fieldName === "status" ? (<Controller name="status" control={control} render={({ field }) => (
          <StatusDropdown value={field.value} onChange={field.onChange} />)} />) : (<input {...register(fieldName)}
            className="bg-[#0A0D1A] border border-[#1E2540] rounded-lg px-4 py-2.5 text-[#E8EAFF] placeholder-[#565E80] text-sm outline-none focus:border-[#6366F1] transition-colors"
          />)}
        </div>
      ))}
      <button
        type="submit"
        className="text-white font-medium rounded-lg py-2.5 transition-colors text-sm cursor-pointer hover:opacity-80"
        style={{ background: "#8B5CF6" }}
      >
        Сохранить
      </button>
    </form>
  )
}
