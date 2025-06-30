// app/audioSubmission/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure not Edge runtime

export async function POST(req: NextRequest) {
  if (process.env.VERCEL) {
    return NextResponse.json({ error: "Uploads disabled in production" }, { status: 403 });
  }

  try {
    const formData = await req.formData();

    const file = formData.get("audio");
    const boxIndex = formData.get("boxIndex");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No audio file received" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optional: save to disk (local dev only)
    const fs = await import("fs/promises");
    const path = await import("path");
    const uploadDir = path.join(process.cwd(), "public", "audio","uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `recording-box-${boxIndex}.webm`;
    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, buffer);

    return NextResponse.json({ success: true, filename });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
