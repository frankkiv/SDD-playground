## MODIFIED Requirements

### Requirement: Setup screen for player names
The system SHALL display a setup screen with a mode selection (PvP or PvE) before the game starts. In PvP mode, both players can enter their names. In PvE mode, only one player enters their name and selects a difficulty level.

#### Scenario: Player selects PvP mode
- **WHEN** the player selects "雙人對戰" mode
- **THEN** the system SHALL display two name input fields, identical to the current behavior

#### Scenario: Player selects PvE mode
- **WHEN** the player selects "單人挑戰" mode
- **THEN** the system SHALL display one name input field and three difficulty buttons (普通, 困難, 不可能)

#### Scenario: Player leaves name empty in PvE mode
- **WHEN** a player does not enter a name in PvE mode
- **THEN** the system SHALL use "黑方" as the default name and "電腦" as the AI's name

## ADDED Requirements

### Requirement: AI automatic move in PvE mode
The system SHALL automatically place the AI's stone when it is the AI's turn during a PvE game, without requiring any user interaction.

#### Scenario: AI plays after human move
- **WHEN** a human player places a stone in PvE mode and the game has not ended
- **THEN** the system SHALL automatically trigger the AI to place its stone after a delay

#### Scenario: AI plays first in odd rounds
- **WHEN** a new round starts in PvE mode and it is an odd-numbered round (AI goes first)
- **THEN** the system SHALL automatically trigger the AI to place its stone after a delay
