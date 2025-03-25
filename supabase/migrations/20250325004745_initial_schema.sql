-- Create tables for fantasy football app
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leagues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    max_teams INTEGER DEFAULT 12,
    scoring_type VARCHAR(20) DEFAULT 'PPR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    season_year INTEGER NOT NULL,
    CONSTRAINT valid_scoring_type CHECK (scoring_type IN ('PPR', 'HALF_PPR', 'STANDARD'))
);

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, league_id)
);

CREATE TABLE nfl_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    position VARCHAR(5) NOT NULL,
    nfl_team VARCHAR(50),
    jersey_number INTEGER,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_position CHECK (position IN ('QB', 'RB', 'WR', 'TE', 'K', 'DEF'))
);

CREATE TABLE roster_spots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    player_id UUID REFERENCES nfl_players(id) ON DELETE CASCADE,
    position VARCHAR(5) NOT NULL,
    is_starter BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, player_id),
    CONSTRAINT valid_position CHECK (position IN ('QB', 'RB', 'WR', 'TE', 'K', 'DEF', 'BENCH'))
);

CREATE TABLE player_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES nfl_players(id) ON DELETE CASCADE,
    week INTEGER NOT NULL,
    season_year INTEGER NOT NULL,
    passing_yards INTEGER DEFAULT 0,
    passing_tds INTEGER DEFAULT 0,
    rushing_yards INTEGER DEFAULT 0,
    rushing_tds INTEGER DEFAULT 0,
    receiving_yards INTEGER DEFAULT 0,
    receiving_tds INTEGER DEFAULT 0,
    receptions INTEGER DEFAULT 0,
    fumbles INTEGER DEFAULT 0,
    two_point_conversions INTEGER DEFAULT 0,
    field_goals INTEGER DEFAULT 0,
    extra_points INTEGER DEFAULT 0,
    points_scored DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, week, season_year)
);

CREATE TABLE matchups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
    week INTEGER NOT NULL,
    season_year INTEGER NOT NULL,
    home_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    away_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    home_team_score DECIMAL(7,2) DEFAULT 0,
    away_team_score DECIMAL(7,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(league_id, week, season_year, home_team_id),
    UNIQUE(league_id, week, season_year, away_team_id)
);

-- Create indexes for common queries
CREATE INDEX idx_roster_spots_team ON roster_spots(team_id);
CREATE INDEX idx_roster_spots_player ON roster_spots(player_id);
CREATE INDEX idx_player_stats_player_week ON player_stats(player_id, week, season_year);
CREATE INDEX idx_matchups_league_week ON matchups(league_id, week, season_year);