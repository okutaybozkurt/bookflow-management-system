import { NextResponse } from "next/server";
import { clearSystemData, seedGoldenData, seedJunkData } from "@/lib/data/seeder";

export async function POST(request: Request) {
  try {
    const { mode } = await request.json();

    console.log(`🔄 Reset Başlatıldı: ${mode} modu hazırlanıyor...`);

    // 1. Clear old system data
    await clearSystemData();

    // 2. Seed new data based on mode
    if (mode === 'junk') {
      await seedJunkData();
    } else {
      await seedGoldenData();
    }

    return NextResponse.json({ success: true, message: `${mode} modu başarıyla yüklendi.` });
  } catch (error: any) {
    console.error("Reset Hatası:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Veritabanı sıfırlanırken bir hata oluştu." 
    }, { status: 500 });
  }
}
