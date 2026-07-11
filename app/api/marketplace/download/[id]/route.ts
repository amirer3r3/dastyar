import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { auth } from "@/auth";
import {
  getPackage,
  hasPurchased,
  incrementDownload,
  UPLOADS_DIR,
} from "@/app/lib/marketplace";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const pkg = await getPackage(id);
  if (!pkg) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const allowed = await hasPurchased(session.user.id, id);
  if (!allowed) {
    return NextResponse.json({ error: "Purchase required" }, { status: 403 });
  }

  await incrementDownload(id);

  if (!pkg.filePath) {
    const placeholder = `پکیج: ${pkg.title}\n\nاین فایل نمونه است.\nفایل واقعی توسط فروشنده آپلود نشده.`;
    return new NextResponse(placeholder, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(pkg.fileName)}"`,
      },
    });
  }

  const fullPath = path.join(UPLOADS_DIR, pkg.filePath);
  try {
    const buffer = await fs.readFile(fullPath);
    const ext = path.extname(pkg.fileName).toLowerCase();
    const contentType =
      ext === ".pdf"
        ? "application/pdf"
        : ext === ".zip"
          ? "application/zip"
          : "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(pkg.fileName)}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
