import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const menuPath = path.join(process.cwd(), "src/data/menu.json");

// Global cache for Vercel read-only fallback
const globalRef = global as any;
if (globalRef.menuCache === undefined) {
  globalRef.menuCache = null;
}

export async function GET() {
  try {
    if (globalRef.menuCache !== null) {
      return NextResponse.json(globalRef.menuCache);
    }
    const data = await fs.readFile(menuPath, "utf-8");
    globalRef.menuCache = JSON.parse(data);
    return NextResponse.json(globalRef.menuCache);
  } catch (error) {
    console.error("Error reading menu.json:", error);
    return NextResponse.json({ message: "Failed to load menu data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ message: "Invalid menu data format" }, { status: 400 });
    }

    globalRef.menuCache = body;
    try {
      await fs.writeFile(menuPath, JSON.stringify(body, null, 2), "utf-8");
    } catch (e: any) {
      console.warn("Filesystem is read-only. Falling back to in-memory menu cache:", e.message);
    }
    return NextResponse.json({ message: "Menu updated successfully", data: body });
  } catch (error) {
    console.error("Error writing menu.json:", error);
    return NextResponse.json({ message: "Failed to save menu data" }, { status: 500 });
  }
}
