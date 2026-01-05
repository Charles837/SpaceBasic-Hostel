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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    const apps = await readApps();
    const idx = apps.findIndex((a: any) => a.id === id);
    if (idx === -1) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    apps[idx] = { ...apps[idx], ...body };
    await writeApps(apps);
    return NextResponse.json(apps[idx]);
  } catch (err: any) {
    return NextResponse.json({ message: err?.message ?? "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const apps = await readApps();
    const filtered = apps.filter((a: any) => a.id !== id);
    if (filtered.length === apps.length) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    await writeApps(filtered);
    return NextResponse.json({ message: "Deleted" });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message ?? "Invalid request" }, { status: 400 });
  }
}
