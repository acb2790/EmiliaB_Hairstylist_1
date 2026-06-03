import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ skipped: true, reason: "No token configured" });
  }

  const res = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
  );

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: "Refresh failed", detail: err }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json({
    success: true,
    expires_in_days: Math.round(data.expires_in / 86400),
  });
}
