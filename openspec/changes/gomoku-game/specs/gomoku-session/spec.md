## ADDED Requirements

### Requirement: Setup screen for player names
The system SHALL display a setup screen before the game starts where both players can enter their names.

#### Scenario: Players enter custom names
- **WHEN** both players have entered their names and confirm
- **THEN** the game SHALL start using those names throughout the UI

#### Scenario: Player leaves name empty
- **WHEN** a player does not enter a name
- **THEN** the system SHALL use a default name ("黑方" or "白方")

### Requirement: Display current player turn
The system SHALL display which player's turn it currently is during gameplay, including their name and stone color.

#### Scenario: Turn indicator updates after each move
- **WHEN** a player places a stone
- **THEN** the turn indicator SHALL update to show the other player's name and color

### Requirement: Handle game end
The system SHALL display the game result when the game ends (win or draw).

#### Scenario: A player wins
- **WHEN** a player achieves five in a row
- **THEN** the system SHALL display that player's name as the winner

#### Scenario: Game ends in a draw
- **WHEN** all intersections are filled with no winner
- **THEN** the system SHALL display a draw result message

### Requirement: Scoreboard
The system SHALL display both players' win counts and the draw count, persisted across rounds within a session.

#### Scenario: Score updates on win
- **WHEN** a player wins a round
- **THEN** that player's win count SHALL increment by one

#### Scenario: Score updates on draw
- **WHEN** a round ends in a draw
- **THEN** the draw count SHALL increment by one

### Requirement: Play again with alternating first turn
The system SHALL offer a "Play Again" action that resets the board while keeping scores, with first turn alternating each round.

#### Scenario: Play Again
- **WHEN** the user selects "Play Again"
- **THEN** the board SHALL be cleared, scores kept, and the player who went second in the previous round SHALL go first

### Requirement: Full restart
The system SHALL offer a "Restart" action that resets the board, scores, and returns to the setup screen.

#### Scenario: User selects Restart
- **WHEN** the user selects "Restart"
- **THEN** the board, scores, and player names SHALL be cleared and the system SHALL return to the setup screen
