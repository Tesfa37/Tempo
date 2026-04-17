import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const admin = createServiceClient();

  const [profileRes, eventsRes, redemptionsRes, conversationsRes] =
    await Promise.all([
      admin.from("profiles").select("*").eq("id", user.id).single(),
      admin
        .from("point_events")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      admin
        .from("redemptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      admin
        .from("fit_conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  const exportData = {
    exported_at: new Date().toISOString(),
    profile: profileRes.data,
    point_events: eventsRes.data ?? [],
    redemptions: redemptionsRes.data ?? [],
    fit_conversations: conversationsRes.data ?? [],
  };

  const today = new Date().toISOString().slice(0, 10);

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="tempo-data-export-${today}.json"`,
    },
  });
}
