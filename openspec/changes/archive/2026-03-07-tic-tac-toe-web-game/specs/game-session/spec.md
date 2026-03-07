## ADDED Requirements

### Requirement: Setup screen for player names
The system SHALL display a setup screen before the game starts where both players can enter their names.

#### Scenario: Players enter custom names
- **WHEN** both players have entered their names and confirm
- **THEN** the game SHALL start using those names throughout the UI

#### Scenario: Player leaves name empty
- **WHEN** a player does not enter a name
- **THEN** the system SHALL use a default name ("Player 1" or "Player 2")

### Requirement: Display current player turn
The system SHALL always display which player's turn it currently is during gameplay.

#### Scenario: Turn indicator updates after each move
- **WHEN** a player places a mark
- **THEN** the turn indicator SHALL immediately update to show the other player's name

### Requirement: Handle game end
The system SHALL display the game result when the game ends (win or draw).

#### Scenario: A player wins
- **WHEN** a player achieves three in a row
- **THEN** the system SHALL display that player's name as the winner

#### Scenario: Game ends in a draw
- **WHEN** all cells are filled with no winner
- **THEN** the system SHALL display a draw result message

### Requirement: Play again with alternating first turn
The system SHALL offer a "Play Again" action after each round that resets the board while keeping scores, with first turn alternating each round.

#### Scenario: Play Again after any round result
- **WHEN** the user selects "Play Again"
- **THEN** the board SHALL be cleared
- **THEN** the scores SHALL remain unchanged
- **THEN** the player who went second in the previous round SHALL go first in the new round

### Requirement: Full restart
The system SHALL offer a "Restart" action that resets the board and all scores and returns to the setup screen.

#### Scenario: User selects Restart
- **WHEN** the user selects "Restart"
- **THEN** the board, scores, and player names SHALL be cleared
- **THEN** the system SHALL return to the setup screen
