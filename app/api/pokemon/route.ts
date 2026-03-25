import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPokemonList } from "@/lib/drupal/pokemon";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "0");
  const pageSize = Number(searchParams.get("pageSize") ?? "20");
  const type = searchParams.get("type") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  try {
    const data = await getPokemonList(session.accessToken, {
      page,
      pageSize,
      type,
      search,
    });
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
