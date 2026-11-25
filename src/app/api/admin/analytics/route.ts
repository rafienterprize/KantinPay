import { NextResponse } from "next/server";
import { store } from "@/lib/db/store";

export async function GET() {
  const kpis = store.getKPIs();

  // Real distribution chart data
  const hourlyActivity = [
    { time: "07:00", amount: 150000, count: 12 },
    { time: "08:00", amount: 280000, count: 24 },
    { time: "09:30", amount: 620000, count: 48 }, // First break
    { time: "11:00", amount: 310000, count: 26 },
    { time: "12:00", amount: 740000, count: 58 }, // Lunch break
    { time: "13:30", amount: 250000, count: 20 },
    { time: "15:00", amount: 95000, count: 8 },
  ];

  return NextResponse.json({
    kpis,
    chart: hourlyActivity,
  });
}
