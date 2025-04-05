import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

async function seedGameData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Create Batman's league
  const batmanId = "9a408bde-4c30-4069-a42f-89536f40cb77";
  const supermanId = "a03af806-c64a-468d-97a1-1e2a2f987fc2";

  const { data: league, error: leagueError } = await supabase
    .from("leagues")
    .insert({
      name: "Gotham Fantasy League",
      description: "Competitive league for Gotham's finest",
      owner_id: batmanId,
      max_teams: 12,
      scoring_type: "PPR",
      season_year: 2024,
    })
    .select()
    .single();

  if (leagueError) throw leagueError;
  console.log("Created Gotham Fantasy League");

  // Create teams
  const teams = [
    {
      name: "Dark Knights",
      user_id: batmanId,
    },
    {
      name: "Boy Wonders",
      user_id: supermanId,
    },
  ];

  for (const team of teams) {
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .insert({
        name: team.name,
        user_id: team.user_id,
        league_id: league.id,
      })
      .select()
      .single();

    if (teamError) throw teamError;
    console.log(`Created team: ${team.name}`);

    // Store team data for later use
    if (team.name === "Dark Knights") {
      // Create roster spots for Dark Knights
      const { data: players, error: playersError } = await supabase
        .from("nfl_players")
        .select("id, position")
        .in("first_name", ["Patrick", "Christian"]);
      if (playersError) throw playersError;

      for (const player of players) {
        const { error: rosterError } = await supabase
          .from("roster_spots")
          .insert({
            team_id: teamData.id,
            player_id: player.id,
            position: player.position,
            is_starter: true,
          });
        if (rosterError) throw rosterError;
        console.log(`Created roster spot for ${player.position} player`);
      }
    }
  }

  // Create matchup
  const { data: teams_data, error: teamsQueryError } = await supabase
    .from("teams")
    .select("id, name")
    .in("name", ["Dark Knights", "Boy Wonders"]);
  if (teamsQueryError) throw teamsQueryError;

  const darkKnights = teams_data.find((t) => t.name === "Dark Knights");
  const boyWonders = teams_data.find((t) => t.name === "Boy Wonders");

  if (!darkKnights || !boyWonders) {
    throw new Error("Could not find teams for matchup");
  }

  const { error: matchupError } = await supabase
    .from("matchups")
    .insert({
      league_id: league.id,
      week: 1,
      season_year: 2024,
      home_team_id: darkKnights.id,
      away_team_id: boyWonders.id,
      home_team_score: 105.5,
      away_team_score: 98.2,
    });
  if (matchupError) throw matchupError;
  console.log("Created matchup");
}

seedGameData().catch(console.error);
