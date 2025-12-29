import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }
  return NextResponse.json(user)
}


