import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const sessionsPath = path.join(process.cwd(), "src/data/sessions.json");

// Global cache for Vercel read-only fallback
const globalRef = global as any;
if (globalRef.sessionsCache === undefined) {
  globalRef.sessionsCache = null;
}

// Helper to read sessions
async function readSessions() {
  if (globalRef.sessionsCache !== null) {
    return globalRef.sessionsCache;
  }
  try {
    const data = await fs.readFile(sessionsPath, "utf-8");
    globalRef.sessionsCache = JSON.parse(data);
    return globalRef.sessionsCache;
  } catch (error) {
    globalRef.sessionsCache = [];
    return [];
  }
}

// Helper to write sessions
async function writeSessions(sessions: any[]) {
  globalRef.sessionsCache = sessions;
  try {
    await fs.writeFile(sessionsPath, JSON.stringify(sessions, null, 2), "utf-8");
  } catch (error: any) {
    console.warn("Filesystem is read-only. Falling back to in-memory session cache:", error.message);
  }
}

export async function GET() {
  try {
    const sessions = await readSessions();
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ message: "Failed to read sessions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, mobile, table } = body;

    if (!name || !mobile || !table) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const sessions = await readSessions();
    
    // Check if session for this mobile/table already exists, remove it first to avoid duplicates
    const filteredSessions = sessions.filter(
      (s: any) => !(s.mobile === mobile && s.table === table)
    );

    const loginTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const sessionId = `sess-${Math.floor(100000 + Math.random() * 900000)}`;

    const newSession = {
      id: sessionId,
      name,
      mobile,
      table,
      loginTime,
    };

    filteredSessions.push(newSession);
    await writeSessions(filteredSessions);

    return NextResponse.json({ success: true, session: newSession });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ message: "Failed to create session" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing session ID" }, { status: 400 });
    }

    const sessions = await readSessions();
    const updatedSessions = sessions.filter((s: any) => s.id !== id);
    await writeSessions(updatedSessions);

    return NextResponse.json({ success: true, message: "Session removed" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete session" }, { status: 500 });
  }
}
