import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const blocks = await prisma.availabilityBlock.findMany({
    orderBy: { startDate: "asc" },
    select: { id: true, startDate: true, endDate: true, label: true },
  });

  const mapped = blocks.map((b: { id: string; startDate: Date; endDate: Date; label: string | null }) => ({
    id: b.id,
    startDate: b.startDate.toISOString().split("T")[0],
    endDate: b.endDate.toISOString().split("T")[0],
    label: b.label,
  }));

  return NextResponse.json({ blocks: mapped });
}
