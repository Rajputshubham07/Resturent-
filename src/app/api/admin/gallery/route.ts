import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const galleryPath = path.join(process.cwd(), "src/data/gallery.json");

export async function GET() {
  try {
    const data = await fs.readFile(galleryPath, "utf-8");
    return NextResponse.json(JSON.parse(data));
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

    await fs.writeFile(galleryPath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ message: "Gallery updated successfully", data: body });
  } catch (error) {
    console.error("Error writing gallery.json:", error);
    return NextResponse.json({ message: "Failed to save gallery data" }, { status: 500 });
  }
}
