import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const galleryPath = path.join(process.cwd(), "src/data/gallery.json");

// Global cache for Vercel read-only fallback
const globalRef = global as any;
if (globalRef.galleryCache === undefined) {
  globalRef.galleryCache = null;
}

export async function GET() {
  try {
    if (globalRef.galleryCache !== null) {
      return NextResponse.json(globalRef.galleryCache);
    }
    const data = await fs.readFile(galleryPath, "utf-8");
    globalRef.galleryCache = JSON.parse(data);
    return NextResponse.json(globalRef.galleryCache);
  } catch (error) {
    console.error("Error reading gallery.json:", error);
    return NextResponse.json({ message: "Failed to load gallery data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ message: "Invalid gallery data format" }, { status: 400 });
    }

    globalRef.galleryCache = body;
    try {
      await fs.writeFile(galleryPath, JSON.stringify(body, null, 2), "utf-8");
    } catch (e: any) {
      console.warn("Filesystem is read-only. Falling back to in-memory gallery cache:", e.message);
    }
    return NextResponse.json({ message: "Gallery updated successfully", data: body });
  } catch (error) {
    console.error("Error writing gallery.json:", error);
    return NextResponse.json({ message: "Failed to save gallery data" }, { status: 500 });
  }
}
