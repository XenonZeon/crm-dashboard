"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import Link from "next/link"
import { useState } from "react"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const onSubmit = async (data: FormData) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setErrorMsg("Не удалось зарегистрироваться. Попробуйте другой email.")
      return
    }
    setSent(true)
  }
  if (sent) {
    return (
      <div className="min-h-screen bg-[#080B14] flex items-center justify-center px-4">
        <div className="bg-[#111627] border border-[#1E2540] rounded-xl p-8 w-full max-w-md text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(139,92,246,0.15)" }}>
            <span className="text-2xl">✉️</span>
          </div>
          <h2 className="text-[#E8EAFF] font-bold text-xl mb-2">Подтвердите почту</h2>
          <p className="text-sm mb-1" style={{ color: "#565E80" }}>Мы отправили письмо на</p>
          <p className="text-sm font-medium mb-6" style={{ color: "#8B5CF6" }}>{email}</p>
          <Link
            href="/login"
            className="block text-white font-medium rounded-lg py-2.5 transition-all hover:opacity-80 text-sm"
            style={{ background: "#8B5CF6" }}
          >
            Перейти к входу
          </Link>
        </div>
      </div>
    )
  }
  return (
        <div className="min-h-screen bg-[#080B14] flex items-center justify-center px-4">
        <div className="bg-[#111627] border border-[#1E2540] rounded-xl p-8 w-full max-w-md">
            <div className="mb-8 text-center">
            <h1 className="text-[#6366F1] font-bold text-2xl mb-1">NexusFlow</h1>
            <p className="text-[#565E80] text-sm">Регистрация в панели</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-[#E8EAFF] text-sm">Email</label>
                <input
                {...register("email")}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-[#0A0D1A] border border-[#1E2540] rounded-lg px-4 py-2.5 text-[#E8EAFF] placeholder-[#565E80] text-sm outline-none focus:border-[#6366F1] transition-colors"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[#E8EAFF] text-sm">Пароль</label>
                <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="bg-[#0A0D1A] border border-[#1E2540] rounded-lg px-4 py-2.5 text-[#E8EAFF] placeholder-[#565E80] text-sm outline-none focus:border-[#6366F1] transition-colors"
                />
            </div>

            <button
                type="submit"
                className="text-white font-medium rounded-lg py-2.5 mt-2 transition-all hover:opacity-80 text-sm cursor-pointer"
                style={{ background: "#8B5CF6" }}
            >
                Зарегистрироваться
            </button>
            {errorMsg && (
              <p className="text-xs text-center" style={{ color: "#EF4444" }}>{errorMsg}</p>
            )}
            <Link
              href="/login"
              className="text-center text-sm transition-all hover:opacity-80 font-medium rounded-lg py-2.5"
              style={{ color: "#565E80" }}
            >
              Уже есть аккаунт? <span style={{ color: "#8B5CF6" }}>Войти</span>
            </Link>
            </form>
        </div>
        </div>
  )
}
