import { supabase } from "@/lib/supabase";
import type {
  LeagueDetails,
  LeagueWithTeams,
  MatchupWithTeams,
  NFLPlayer,
  PlayerStats,
  TeamWithRoster,
  UserProfile,
} from "./types";

/**
 * Fetches a user's profile information
 * @param userId - The UUID of the user
 * @returns User profile data including email and timestamps
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Gets all leagues that a user is participating in
 * @param userId - The UUID of the user
 * @returns Array of leagues with their associated teams
 */
export async function getUserLeagues(
  userId: string,
): Promise<LeagueWithTeams[]> {
  const { data, error } = await supabase
    .from("leagues")
    .select(`
      *,
      teams!inner(*)
    `)
    .eq("teams.user_id", userId);

  if (error) throw error;
  return data;
}

/**
 * Fetches detailed information about a specific league
 * Including teams, user profiles, and roster information
 * @param leagueId - The UUID of the league
 * @returns Detailed league information with nested team and roster data
 */
export async function getLeagueDetails(
  leagueId: string,
): Promise<LeagueDetails> {
  const { data, error } = await supabase
    .from("leagues")
    .select(`
      *,
      teams (
        *,
        user_profiles (
          email
        ),
        roster_spots (
          *,
          nfl_players (*)
        )
      )
    `)
    .eq("id", leagueId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Gets all teams owned by a specific user
 * Including league info and complete roster details
 * @param userId - The UUID of the user
 * @returns Array of teams with their league and roster information
 */
export async function getUserTeams(userId: string): Promise<TeamWithRoster[]> {
  const { data, error } = await supabase
    .from("teams")
    .select(`
      *,
      leagues (*),
      roster_spots (
        *,
        nfl_players (*)
      )
    `)
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

/**
 * Retrieves all NFL players that are not currently on any team in the specified league
 * Useful for draft or waiver wire functionality
 * @param leagueId - The UUID of the league
 * @returns Array of available NFL players
 */
export async function getAvailablePlayers(
  leagueId: string,
): Promise<NFLPlayer[]> {
  const { data, error } = await supabase
    .from("nfl_players")
    .select("*")
    .not(
      "id",
      "in",
      supabase
        .from("roster_spots")
        .select("player_id")
        .eq("team.league_id", leagueId),
    );

  if (error) throw error;
  return data;
}

/**
 * Fetches statistical performance data for a specific player
 * Ordered by week for easy trend analysis
 * @param playerId - The UUID of the NFL player
 * @returns Array of weekly stats for the player
 */
export async function getPlayerStats(playerId: string): Promise<PlayerStats[]> {
  const { data, error } = await supabase
    .from("player_stats")
    .select("*")
    .eq("player_id", playerId)
    .order("week", { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Gets all matchups for a specific league and week
 * Includes detailed information about both home and away teams
 * @param leagueId - The UUID of the league
 * @param week - The week number to fetch matchups for
 * @returns Array of matchups with associated team details
 */
export async function getLeagueMatchups(
  leagueId: string,
  week: number,
): Promise<MatchupWithTeams[]> {
  const { data, error } = await supabase
    .from("matchups")
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*)
    `)
    .eq("league_id", leagueId)
    .eq("week", week);

  if (error) throw error;
  return data;
}
