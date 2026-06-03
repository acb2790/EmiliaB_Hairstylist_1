import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const blocks = await prisma.availabilityBlock.findMany({
    orderBy: { startDate: "asc" },
  });

  const mapped = blocks.map((b: { id: string; startDate: Date; endDate: Date; label: string | null }) => ({
    id: b.id,
    startDate: b.startDate.toISOString().split("T")[0],
    endDate: b.endDate.toISOString().split("T")[0],
    label: b.label,
  }));

  return NextResponse.json({ blocks: mapped });
}

export async function POST(req: NextRequest) {
  const { startDate, endDate, label } = await req.json();

  if (!startDate) {
    return NextResponse.json({ error: "startDate is required" }, { status: 400 });
  }

  const block = await prisma.availabilityBlock.create({
    data: {
      startDate: new Date(startDate),
      endDate: new Date(endDate ?? startDate),
      label: label || null,
    },
  });

  return NextResponse.json({
    block: {
      id: block.id,
      startDate: block.startDate.toISOString().split("T")[0],
      endDate: block.endDate.toISOString().split("T")[0],
      label: block.label,
    },
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await prisma.availabilityBlock.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
