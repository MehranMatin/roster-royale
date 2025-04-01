"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createLeague(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const name = formData.get("name") as string;
  const maxTeams = parseInt(formData.get("maxTeams") as string);
  const scoringType = formData.get("scoringType") as "standard" | "ppr";

  const { data, error } = await supabase
    .from("leagues")
    .insert({
      name,
      owner_id: user.id,
      max_teams: maxTeams,
      scoring_type: scoringType,
      settings: {
        max_teams: maxTeams,
        scoring_type: scoringType,
      },
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/dashboard");
  return data;
}

export async function joinLeague(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const leagueId = formData.get("leagueId") as string;
  const teamName = formData.get("teamName") as string;

  // First check if league exists and has space
  const { data: league, error: leagueError } = await supabase
    .from("leagues")
    .select("max_teams")
    .eq("id", leagueId)
    .single();

  if (leagueError) throw leagueError;

  // Count current teams
  const { count, error: countError } = await supabase
    .from("teams")
    .select("*", { count: "exact", head: true })
    .eq("league_id", leagueId);

  if (countError) throw countError;

  if (count && count >= league.max_teams) {
    throw new Error("League is full");
  }

  // Create team
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .insert({
      name: teamName,
      user_id: user.id,
      league_id: leagueId,
    })
    .select()
    .single();

  if (teamError) throw teamError;
  revalidatePath("/dashboard");
  return team;
}

export async function updateLineup(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const teamId = formData.get("teamId") as string;
  const playerId = formData.get("playerId") as string;
  const isStarter = formData.get("isStarter") === "true";

  const { data, error } = await supabase
    .from("roster_spots")
    .update({ is_starter: isStarter })
    .eq("team_id", teamId)
    .eq("player_id", playerId)
    .select()
    .single();

  if (error) throw error;
  revalidatePath(`/teams/${teamId}`);
  return data;
}
