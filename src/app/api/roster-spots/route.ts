import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId");

  if (!teamId) {
    return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("roster_spots")
    .select(`
      *,
      nfl_players (
        id,
        name,
        position,
        team,
        status
      )
    `)
    .eq("team_id", teamId);

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
  const { teamId, playerId, isStarter } = body;

  // Verify team ownership
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("user_id")
    .eq("id", teamId)
    .single();

  if (teamError) {
    return NextResponse.json({ error: teamError.message }, { status: 500 });
  }

  if (team.user_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("roster_spots")
    .insert({
      team_id: teamId,
      player_id: playerId,
      is_starter: isStarter,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { rosterSpotId, isStarter } = body;

  // Verify team ownership
  const { data: rosterSpot, error: rosterError } = await supabase
    .from("roster_spots")
    .select("team_id")
    .eq("id", rosterSpotId)
    .single();

  if (rosterError) {
    return NextResponse.json({ error: rosterError.message }, { status: 500 });
  }

  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("user_id")
    .eq("id", rosterSpot.team_id)
    .single();

  if (teamError) {
    return NextResponse.json({ error: teamError.message }, { status: 500 });
  }

  if (team.user_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("roster_spots")
    .update({ is_starter: isStarter })
    .eq("id", rosterSpotId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
