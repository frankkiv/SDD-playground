## ADDED Requirements

### Requirement: Setup screen for player names
The system SHALL display a setup screen with a mode selection (PvP, PvE, or Online) before the game starts. In PvP mode, both players can enter their names. In PvE mode, only one player enters their name and selects a difficulty level. In Online mode, the player is navigated to the OnlineLobby screen.

#### Scenario: Players enter custom names
- **WHEN** both players have entered their names and confirm
- **THEN** the game SHALL start using those names throughout the UI

#### Scenario: Player selects PvP mode
- **WHEN** the player selects "雙人對戰" mode
- **THEN** the system SHALL display two name input fields, identical to the current behavior

#### Scenario: Player selects PvE mode
- **WHEN** the player selects "單人挑戰" mode
- **THEN** the system SHALL display one name input field and three difficulty buttons (普通, 困難, 不可能)

#### Scenario: Player selects online mode
- **WHEN** the player selects "線上對戰" mode
- **THEN** the system SHALL navigate to the OnlineLobby screen instead of starting a local game

#### Scenario: Player leaves name empty
- **WHEN** a player does not enter a name
- **THEN** the system SHALL use a default name ("Player 1" or "Player 2")

#### Scenario: Player leaves name empty in PvE mode
- **WHEN** a player does not enter a name in PvE mode
- **THEN** the system SHALL use "Player 1" as the default name and "電腦" as the AI's name

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

### Requirement: AI automatic move in PvE mode
The system SHALL automatically place the AI's mark when it is the AI's turn during a PvE game, without requiring any user interaction.

#### Scenario: AI plays after human move
- **WHEN** a human player places a mark in PvE mode and the game has not ended
- **THEN** the system SHALL automatically trigger the AI to place its mark after a delay

#### Scenario: AI plays first in odd rounds
- **WHEN** a new round starts in PvE mode and it is an odd-numbered round (AI goes first)
- **THEN** the system SHALL automatically trigger the AI to place its mark after a delay
