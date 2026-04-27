import DealsList from "./dealsList"
import DealsStats from "./dealsStats"
import Link from "next/link"
import { createClient } from "@/lib/server"
import DeleteButton from "./DeleteButton"

export default async function Deals() {
  const supabase = await createClient()
  const { data: deals } = await supabase.from("deals").select("*")

  const total = deals?.length ?? 0
  const totalAmount = deals?.reduce((sum, d) => sum + Number(d.amount), 0) ?? 0

  return (
    <div className="p-8 animate-fade-slide">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#E8EAFF" }}>Сделки</h1>
          <p className="text-sm mt-0.5" style={{ color: "#565E80" }}>
            {total} сделок на ₽ {totalAmount.toLocaleString("ru-RU")}
          </p>
        </div>
        <Link
          href="/deals/new"
          className="text-sm font-medium px-4 py-2 rounded-lg transition-all hover:opacity-80 text-white"
          style={{ background: "#8B5CF6" }}
        >
          + Добавить сделку
        </Link>
      </div>

      <DealsStats deals={deals ?? []} />

      <DealsList />
    </div>
  )
}
