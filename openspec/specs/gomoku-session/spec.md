### Requirement: Setup screen for player names
The system SHALL display a setup screen with a mode selection (PvP or PvE) before the game starts. In PvP mode, both players can enter their names. In PvE mode, only one player enters their name and selects a difficulty level.

#### Scenario: Players enter custom names
- **WHEN** both players have entered their names and confirm
- **THEN** the game SHALL start using those names throughout the UI

#### Scenario: Player selects PvP mode
- **WHEN** the player selects "雙人對戰" mode
- **THEN** the system SHALL display two name input fields, identical to the current behavior

#### Scenario: Player selects PvE mode
- **WHEN** the player selects "單人挑戰" mode
- **THEN** the system SHALL display one name input field and three difficulty buttons (普通, 困難, 不可能)

#### Scenario: Player leaves name empty
- **WHEN** a player does not enter a name
- **THEN** the system SHALL use a default name ("黑方" or "白方")

#### Scenario: Player leaves name empty in PvE mode
- **WHEN** a player does not enter a name in PvE mode
- **THEN** the system SHALL use "黑方" as the default name and "電腦" as the AI's name

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

### Requirement: AI automatic move in PvE mode
The system SHALL automatically place the AI's stone when it is the AI's turn during a PvE game, without requiring any user interaction.

#### Scenario: AI plays after human move
- **WHEN** a human player places a stone in PvE mode and the game has not ended
- **THEN** the system SHALL automatically trigger the AI to place its stone after a delay

#### Scenario: AI plays first in odd rounds
- **WHEN** a new round starts in PvE mode and it is an odd-numbered round (AI goes first)
- **THEN** the system SHALL automatically trigger the AI to place its stone after a delay
