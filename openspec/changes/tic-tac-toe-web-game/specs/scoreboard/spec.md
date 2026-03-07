## ADDED Requirements

### Requirement: Track wins per player
The system SHALL maintain a win count for each player across rounds within a session.

#### Scenario: Win count increments after a player wins
- **WHEN** a player wins a round
- **THEN** that player's win count SHALL increase by 1
- **THEN** the other player's win count SHALL remain unchanged

### Requirement: Track draw count
The system SHALL maintain a count of rounds that ended in a draw.

#### Scenario: Draw count increments after a draw
- **WHEN** a round ends in a draw
- **THEN** the draw count SHALL increase by 1

### Requirement: Display scoreboard during gameplay
The system SHALL display the current score for both players and the draw count at all times during a session.

#### Scenario: Scoreboard is visible during a round
- **WHEN** the game is in progress
- **THEN** both players' names, their win counts, and the draw count SHALL be visible on screen

### Requirement: Scores persist across rounds
The system SHALL retain all scores when "Play Again" is selected.

#### Scenario: Play Again preserves scores
- **WHEN** the user selects "Play Again"
- **THEN** the scoreboard SHALL display the accumulated scores from all previous rounds

### Requirement: Scores reset on full restart
The system SHALL reset all scores to zero when "Restart" is selected.

#### Scenario: Restart clears scoreboard
- **WHEN** the user selects "Restart"
- **THEN** all win counts and the draw count SHALL return to zero
