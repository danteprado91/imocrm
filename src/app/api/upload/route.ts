import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 900;
const QUALITY = 80;

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const isImage = file.type.startsWith("image/");

  let outputBuffer: Buffer;

  if (isImage) {
    try {
      outputBuffer = await sharp(Buffer.from(bytes))
        .resize(MAX_WIDTH, MAX_HEIGHT, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: QUALITY })
        .toBuffer();
    } catch {
      outputBuffer = Buffer.from(bytes);
    }
  } else {
    outputBuffer = Buffer.from(bytes);
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${filename}`, outputBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });
    return NextResponse.json({ url: blob.url });
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  const filepath = path.join(dir, filename);
  await mkdir(dir, { recursive: true });
  await writeFile(filepath, outputBuffer);
  return NextResponse.json({ url: `/uploads/${filename}` });
}
