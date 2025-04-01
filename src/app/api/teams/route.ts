import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get("leagueId");

  if (!leagueId) {
    return NextResponse.json({ error: "League ID is required" }, {
      status: 400,
    });
  }

  const { data, error } = await supabase
    .from("teams")
    .select(`
      *,
      roster_spots (
        id,
        is_starter,
        nfl_players (
          id,
          name,
          position,
          team
        )
      )
    `)
    .eq("league_id", leagueId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, leagueId } = body;

  // Check if league exists and has space
  const { data: league, error: leagueError } = await supabase
    .from("leagues")
    .select("max_teams")
    .eq("id", leagueId)
    .single();

  if (leagueError) {
    return NextResponse.json({ error: leagueError.message }, { status: 500 });
  }

  // Count current teams
  const { count, error: countError } = await supabase
    .from("teams")
    .select("*", { count: "exact", head: true })
    .eq("league_id", leagueId);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if (count && count >= league.max_teams) {
    return NextResponse.json({ error: "League is full" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("teams")
    .insert({
      name,
      user_id: user.id,
      league_id: leagueId,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
