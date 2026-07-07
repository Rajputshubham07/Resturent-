import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ordersPath = path.join(process.cwd(), "src/data/orders.json");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mobile = searchParams.get("mobile");

    if (!mobile) {
      return NextResponse.json({ message: "Missing mobile number" }, { status: 400 });
    }

    let orders = [];
    try {
      const data = await fs.readFile(ordersPath, "utf-8");
      orders = JSON.parse(data);
    } catch (e) {
      orders = [];
    }

    // Filter orders by mobile number and return newest first
    const customerOrders = orders
      .filter((order: any) => order.mobileNumber === mobile)
      .reverse();

    return NextResponse.json(customerOrders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}
