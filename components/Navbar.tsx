"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"

export default function Navbar(){
    const router = useRouter()
    const handleSignOut = async () => {
        const supabase = createClient()
        const{error} = await supabase.auth.signOut()
        router.push("/login")
    }
    return(
        <nav className="flex gap-4"> 
            <Link href="/clients">Клиенты</Link>
            <Link href="/deals">Сделки</Link>
            <Link href="/clients/new">Добавить клиента</Link>
            <button onClick={handleSignOut}>SignOut</button>
        </nav>
    )
}