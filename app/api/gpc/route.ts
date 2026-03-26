import { NextResponse } from "next/server";
import { GPC_DATABASE, GPC_STATS } from "@/lib/data/gpc-dgmoss";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get("specialty");
  const frequency = searchParams.get("frequency");
  const limit = searchParams.get("limit");

  let results = GPC_DATABASE;

  if (specialty) {
    results = results.filter((gpc) => gpc.specialty === specialty);
  }

  if (frequency) {
    results = results.filter((gpc) => gpc.frequency === frequency);
  }

  if (limit) {
    results = results.slice(0, parseInt(limit));
  }

  return NextResponse.json({
    success: true,
    data: results,
    stats: GPC_STATS,
    count: results.length,
  });
}
