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