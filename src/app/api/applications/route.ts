import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "applications.json");

async function readApps() {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function writeApps(apps: any[]) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(apps, null, 2), "utf-8");
}

export async function GET() {
  const apps = await readApps();
  return NextResponse.json(apps);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newApp = {
      id: (globalThis as any).crypto?.randomUUID?.() ?? Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
      ...body,
    };
    const apps = await readApps();
    apps.unshift(newApp);
    await writeApps(apps);
    return NextResponse.json(newApp, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message ?? "Invalid request" }, { status: 400 });
  }
}
