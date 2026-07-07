import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ordersPath = path.join(process.cwd(), "src/data/orders.json");

// Global cache for Vercel read-only fallback
const globalRef = global as any;
if (globalRef.ordersCache === undefined) {
  globalRef.ordersCache = null;
}

async function readOrders() {
  if (globalRef.ordersCache !== null) {
    return globalRef.ordersCache;
  }
  try {
    const data = await fs.readFile(ordersPath, "utf-8");
    globalRef.ordersCache = JSON.parse(data);
    return globalRef.ordersCache;
  } catch (error) {
    globalRef.ordersCache = [];
    return [];
  }
}

async function writeOrders(orders: any[]) {
  globalRef.ordersCache = orders;
  try {
    await fs.writeFile(ordersPath, JSON.stringify(orders, null, 2), "utf-8");
  } catch (error: any) {
    console.warn("Filesystem is read-only. Falling back to in-memory orders cache:", error.message);
  }
}

export async function GET() {
  try {
    const orders = await readOrders();
    // Return newest orders first
    const sortedOrders = [...orders].reverse();
    return NextResponse.json(sortedOrders);
  } catch (error) {
    return NextResponse.json({ message: "Failed to read orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ message: "Missing order ID or status" }, { status: 400 });
    }

    const orders = await readOrders();
    let updated = false;

    const updatedOrders = orders.map((order: any) => {
      if (order.id === id) {
        updated = true;
        return { ...order, status };
      }
      return order;
    });

    if (!updated) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    await writeOrders(updatedOrders);
    return NextResponse.json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json({ message: "Failed to update order" }, { status: 500 });
  }
}
