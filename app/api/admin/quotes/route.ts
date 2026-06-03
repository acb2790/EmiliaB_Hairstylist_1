import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const mapped = quotes.map((q: { id: string; name: string; email: string; phone: string | null; eventType: string; eventDate: Date; eventDateEnd: Date | null; location: string; guests: number | null; message: string | null; status: string; createdAt: Date }) => ({
    id: q.id,
    name: q.name,
    email: q.email,
    phone: q.phone,
    eventType: q.eventType,
    eventDate: q.eventDate.toISOString().split("T")[0],
    eventDateEnd: q.eventDateEnd ? q.eventDateEnd.toISOString().split("T")[0] : undefined,
    location: q.location,
    guests: q.guests,
    message: q.message,
    status: q.status,
    createdAt: q.createdAt.toISOString(),
  }));

  await prisma.quoteRequest.updateMany({
    where: { status: "new" },
    data: { status: "seen" },
  });

  return NextResponse.json({ quotes: mapped });
}
