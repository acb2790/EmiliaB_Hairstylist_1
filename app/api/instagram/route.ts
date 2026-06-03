import { NextResponse } from "next/server";

const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";

export async function GET() {
  if (!TOKEN) {
    return NextResponse.json({ posts: [] });
  }

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=${FIELDS}&limit=9&access_token=${TOKEN}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json({ posts: [] });
    }

    const data = await res.json();
    return NextResponse.json({ posts: data.data ?? [] });
  } catch {
    return NextResponse.json({ posts: [] });
  }
}
