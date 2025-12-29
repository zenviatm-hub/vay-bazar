import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/c69a072d-ed96-46c0-9622-bcd79aba2572',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/user/route.ts:6',message:'GET /api/user called',data:{phase:process.env.NEXT_PHASE||'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'build-debug',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  const user = await getCurrentUser()
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/c69a072d-ed96-46c0-9622-bcd79aba2572',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/user/route.ts:8',message:'getCurrentUser result',data:{hasUser:!!user},timestamp:Date.now(),sessionId:'debug-session',runId:'build-debug',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }
  return NextResponse.json(user)
}


