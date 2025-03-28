-- Insert user profiles
INSERT INTO user_profiles (id, email) VALUES
('9a408bde-4c30-4069-a42f-89536f40cb77', 'batman@dc.com'),
('a03af806-c64a-468d-97a1-1e2a2f987fc2', 'superman@dc.com'),
('a2e6ee23-74ef-40d5-b92d-032ac54da039', 'wonderwoman@dc.com'),
('a3e6ee23-74ef-40d5-b92d-032ac54da039', 'flash@dc.com'),
('d4c45bb0-4100-4de1-9b85-b7bbd24456e4', 'joker@dc.com'),
('dc94f120-5d6f-45fa-8f00-ebe93f20e3f1', 'penguin@dc.com'),
('e98675f1-0f08-41c1-8169-a63632c32d7f', 'lexluthor@dc.com'),
('c78d8bcd-f92c-417a-bcae-9a50888f5622', 'doomsday@dc.com');

-- Create a league
INSERT INTO leagues (id, name, description, owner_id, max_teams, scoring_type, season_year) VALUES
(gen_random_uuid(), 'Gotham Fantasy League', 'Competitive league for Gotham''s finest', 
'9a408bde-4c30-4069-a42f-89536f40cb77', 12, 'PPR', 2025);

-- Create teams
INSERT INTO teams (id, name, user_id, league_id) 
SELECT gen_random_uuid(), 'Dark Knights', '9a408bde-4c30-4069-a42f-89536f40cb77', id 
FROM leagues WHERE name = 'Gotham Fantasy League';

INSERT INTO teams (id, name, user_id, league_id)
SELECT gen_random_uuid(), 'Boy Wonders', 'a03af806-c64a-468d-97a1-1e2a2f987fc2', id
FROM leagues WHERE name = 'Gotham Fantasy League';

-- Insert NFL Players
INSERT INTO nfl_players (id, first_name, last_name, position, nfl_team, jersey_number) VALUES
-- Quarterbacks
(gen_random_uuid(), 'Patrick', 'Mahomes', 'QB', 'KC', 15),
(gen_random_uuid(), 'Josh', 'Allen', 'QB', 'BUF', 17),
(gen_random_uuid(), 'Lamar', 'Jackson', 'QB', 'BAL', 8),
(gen_random_uuid(), 'Jalen', 'Hurts', 'QB', 'PHI', 1),

-- Running Backs
(gen_random_uuid(), 'Christian', 'McCaffrey', 'RB', 'SF', 23),
(gen_random_uuid(), 'Saquon', 'Barkley', 'RB', 'PHI', 26),
(gen_random_uuid(), 'Jonathan', 'Taylor', 'RB', 'IND', 28),
(gen_random_uuid(), 'Austin', 'Ekeler', 'RB', 'LAC', 30),
(gen_random_uuid(), 'Derrick', 'Henry', 'RB', 'TEN', 22),
(gen_random_uuid(), 'Tony', 'Pollard', 'RB', 'DAL', 20),
(gen_random_uuid(), 'Breece', 'Hall', 'RB', 'NYJ', 20),
(gen_random_uuid(), 'Kenneth', 'Walker', 'RB', 'SEA', 9),
(gen_random_uuid(), 'Jahmyr', 'Gibbs', 'RB', 'DET', 26),
(gen_random_uuid(), 'Bijan', 'Robinson', 'RB', 'ATL', 7),
(gen_random_uuid(), 'De''Von', 'Achane', 'RB', 'MIA', 28),
(gen_random_uuid(), 'Javonte', 'Williams', 'RB', 'DEN', 33),

-- Wide Receivers
(gen_random_uuid(), 'Justin', 'Jefferson', 'WR', 'MIN', 18),
(gen_random_uuid(), 'CeeDee', 'Lamb', 'WR', 'DAL', 88),
(gen_random_uuid(), 'Amon-Ra', 'St. Brown', 'WR', 'DET', 14),
(gen_random_uuid(), 'Tyreek', 'Hill', 'WR', 'MIA', 10),
(gen_random_uuid(), 'Ja''Marr', 'Chase', 'WR', 'CIN', 1),
(gen_random_uuid(), 'Stefon', 'Diggs', 'WR', 'BUF', 14),
(gen_random_uuid(), 'Deebo', 'Samuel', 'WR', 'SF', 19),
(gen_random_uuid(), 'DK', 'Metcalf', 'WR', 'SEA', 14),
(gen_random_uuid(), 'DeVonta', 'Smith', 'WR', 'PHI', 6),
(gen_random_uuid(), 'Brandon', 'Aiyuk', 'WR', 'SF', 11),
(gen_random_uuid(), 'Chris', 'Olave', 'WR', 'NO', 12),
(gen_random_uuid(), 'Garrett', 'Wilson', 'WR', 'NYJ', 17),

-- Tight Ends
(gen_random_uuid(), 'Travis', 'Kelce', 'TE', 'KC', 87),
(gen_random_uuid(), 'Sam', 'LaPorta', 'TE', 'DET', 87),
(gen_random_uuid(), 'T.J.', 'Hockenson', 'TE', 'MIN', 87),
(gen_random_uuid(), 'Mark', 'Andrews', 'TE', 'BAL', 89),

-- Kickers
(gen_random_uuid(), 'Harrison', 'Butker', 'K', 'KC', 7),
(gen_random_uuid(), 'Justin', 'Tucker', 'K', 'BAL', 9),
(gen_random_uuid(), 'Brandon', 'Aubrey', 'K', 'DAL', 17),
(gen_random_uuid(), 'Jake', 'Elliott', 'K', 'PHI', 4),

-- Defense/Special Teams
(gen_random_uuid(), 'San Francisco', '49ers', 'DEF', 'SF', NULL),
(gen_random_uuid(), 'Dallas', 'Cowboys', 'DEF', 'DAL', NULL),
(gen_random_uuid(), 'Philadelphia', 'Eagles', 'DEF', 'PHI', NULL),
(gen_random_uuid(), 'Baltimore', 'Ravens', 'DEF', 'BAL', NULL);

-- Insert roster spots
INSERT INTO roster_spots (id, team_id, player_id, position, is_starter)
SELECT 
    gen_random_uuid(),
    t.id,
    p.id,
    p.position,
    true
FROM teams t
CROSS JOIN nfl_players p
WHERE t.name = 'Dark Knights' 
AND p.first_name IN ('Patrick', 'Christian');

-- Insert player stats
INSERT INTO player_stats (id, player_id, week, season_year, passing_yards, passing_tds, rushing_yards, rushing_tds, points_scored)
SELECT 
    gen_random_uuid(),
    id,
    1,
    2024,
    CASE position
        WHEN 'QB' THEN 328
        ELSE 0
    END,
    CASE position
        WHEN 'QB' THEN 3
        ELSE 0
    END,
    CASE position
        WHEN 'RB' THEN 145
        WHEN 'QB' THEN 15
        ELSE 0
    END,
    CASE position
        WHEN 'RB' THEN 2
        ELSE 0
    END,
    CASE position
        WHEN 'QB' THEN 25.62
        WHEN 'RB' THEN 28.5
        ELSE 0
    END
FROM nfl_players
WHERE position IN ('QB', 'RB');

-- Insert matchups
INSERT INTO matchups (id, league_id, week, season_year, home_team_id, away_team_id, home_team_score, away_team_score)
SELECT 
    gen_random_uuid(),
    l.id,
    1,
    2024,
    t1.id,
    t2.id,
    105.5,
    98.2
FROM leagues l
JOIN teams t1 ON t1.name = 'Dark Knights'
JOIN teams t2 ON t2.name = 'Boy Wonders';