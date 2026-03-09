### Requirement: Alternating turns
The system SHALL alternate turns between black and white, with black always playing first in the first round.

#### Scenario: Black goes first
- **WHEN** a new game starts in round 1
- **THEN** black SHALL be the first to place a stone

#### Scenario: Turns alternate
- **WHEN** a player places a stone
- **THEN** the turn SHALL switch to the other player

### Requirement: Five in a row wins
The system SHALL declare a winner when a player has five or more consecutive stones in a horizontal, vertical, or diagonal line.

#### Scenario: Horizontal win
- **WHEN** a player has 5 consecutive stones in a horizontal line
- **THEN** the system SHALL declare that player the winner and return the winning stone positions

#### Scenario: Vertical win
- **WHEN** a player has 5 consecutive stones in a vertical line
- **THEN** the system SHALL declare that player the winner and return the winning stone positions

#### Scenario: Diagonal win (top-left to bottom-right)
- **WHEN** a player has 5 consecutive stones along a ↘ diagonal
- **THEN** the system SHALL declare that player the winner and return the winning stone positions

#### Scenario: Diagonal win (top-right to bottom-left)
- **WHEN** a player has 5 consecutive stones along a ↙ diagonal
- **THEN** the system SHALL declare that player the winner and return the winning stone positions

#### Scenario: More than five counts as win
- **WHEN** a player has 6 or more consecutive stones in any direction
- **THEN** the system SHALL still declare that player the winner (no overline restriction)

### Requirement: Draw detection
The system SHALL declare a draw when all 361 intersections are occupied and no player has won.

#### Scenario: Board full with no winner
- **WHEN** all intersections are filled and no five-in-a-row exists
- **THEN** the system SHALL declare a draw

### Requirement: Cannot place on occupied intersection
The system SHALL prevent placing a stone on an intersection that already has a stone.

#### Scenario: Click on occupied position
- **WHEN** a player clicks on an intersection that already has a stone
- **THEN** the system SHALL ignore the click and not change the board state
