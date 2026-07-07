import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const menuPath = path.join(process.cwd(), "src/data/menu.json");

export async function GET() {
  try {
    const data = await fs.readFile(menuPath, "utf-8");
    return NextResponse.json(JSON.parse(data));
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

    await fs.writeFile(menuPath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ message: "Menu updated successfully", data: body });
  } catch (error) {
    console.error("Error writing menu.json:", error);
    return NextResponse.json({ message: "Failed to save menu data" }, { status: 500 });
  }
}
