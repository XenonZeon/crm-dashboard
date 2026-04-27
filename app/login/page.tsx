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
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setErrorMsg("Неверный email или пароль")
      return
    }
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#080B14] flex items-center justify-center px-4 animate-fade-slide">
      <div className="bg-[#111627] border border-[#1E2540] rounded-xl p-8 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-[#6366F1] font-bold text-2xl mb-1">NexusFlow</h1>
          <p className="text-[#565E80] text-sm">Войдите в свой аккаунт</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#E8EAFF] text-sm">Email</label>
            <input
              {...register("email")}
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

          {errorMsg && (
            <p className="text-xs text-center" style={{ color: "#EF4444" }}>{errorMsg}</p>
          )}
          <button
            type="submit"
            className="text-white font-medium rounded-lg py-2.5 mt-2 transition-all hover:opacity-80 text-sm cursor-pointer"
            style={{ background: "#8B5CF6" }}
          >
            Войти
          </button>
          <Link
            href="/register"
            className="text-center text-sm transition-all hover:opacity-80 font-medium rounded-lg py-2.5"
            style={{ color: "#565E80" }}
          >
            Нет аккаунта? <span style={{ color: "#8B5CF6" }}>Зарегистрироваться</span>
          </Link>

        </form>
      </div>
    </div>
  )
}
