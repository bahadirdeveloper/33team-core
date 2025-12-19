
import { NextResponse } from "next/server";

// GET /api/health
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const urlToCheck = searchParams.get("url");

    if (!urlToCheck) {
        return NextResponse.json({ status: "ok", service: "TeamCore API" });
    }

    try {
        // Simple fetch check
        const res = await fetch(urlToCheck);
        if (res.ok) {
            return NextResponse.json({ status: "up", statusCode: res.status });
        } else {
            return NextResponse.json({ status: "down", statusCode: res.status });
        }
    } catch (err: any) {
        return NextResponse.json({ status: "error", message: err.message });
    }
}
