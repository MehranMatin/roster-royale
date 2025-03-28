export type UserProfile = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type League = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  max_teams: number;
  scoring_type: "PPR" | "HALF_PPR" | "STANDARD";
  created_at: string;
  season_year: number;
};

export type Team = {
  id: string;
  name: string;
  user_id: string;
  league_id: string;
  created_at: string;
};

export type NFLPlayer = {
  id: string;
  first_name: string;
  last_name: string;
  position: "QB" | "RB" | "WR" | "TE" | "K" | "DEF";
  nfl_team: string;
  jersey_number: number | null;
  status: "ACTIVE" | "INJURED" | "SUSPENDED";
  created_at: string;
  updated_at: string;
};

export type RosterSpot = {
  id: string;
  team_id: string;
  player_id: string;
  position: "QB" | "RB" | "WR" | "TE" | "K" | "DEF" | "BENCH";
  is_starter: boolean;
  created_at: string;
};

export type PlayerStats = {
  id: string;
  player_id: string;
  week: number;
  season_year: number;
  passing_yards: number;
  passing_tds: number;
  rushing_yards: number;
  rushing_tds: number;
  receiving_yards: number;
  receiving_tds: number;
  receptions: number;
  fumbles: number;
  two_point_conversions: number;
  field_goals: number;
  extra_points: number;
  points_scored: number;
  created_at: string;
};

export type Matchup = {
  id: string;
  league_id: string;
  week: number;
  season_year: number;
  home_team_id: string;
  away_team_id: string;
  home_team_score: number;
  away_team_score: number;
  created_at: string;
};

// Types for joined queries
export type LeagueWithTeams = League & {
  teams: Team[];
};

export type TeamWithRoster = Team & {
  leagues: League;
  roster_spots: (RosterSpot & {
    nfl_players: NFLPlayer;
  })[];
};

export type LeagueDetails = League & {
  teams: (Team & {
    user_profiles: Pick<UserProfile, "email">;
    roster_spots: (RosterSpot & {
      nfl_players: NFLPlayer;
    })[];
  })[];
};

export type MatchupWithTeams = Matchup & {
  home_team: Team;
  away_team: Team;
};
