### Requirement: Heuristic position scoring
The system SHALL evaluate each empty intersection by scanning four directions (horizontal, vertical, two diagonals) for both the AI's stones and the opponent's stones, recognizing standard patterns (five-in-a-row, open four, closed four, open three, closed three, open two, closed two) and assigning scores based on a predefined score table.

#### Scenario: AI evaluates positions
- **WHEN** it is the AI's turn
- **THEN** the system SHALL compute a score for every empty intersection considering both offensive (AI's patterns) and defensive (opponent's patterns) value

### Requirement: AI selects highest-scored position
The system SHALL select the empty intersection with the highest combined score as the AI's move.

#### Scenario: AI picks best move
- **WHEN** position scores have been computed
- **THEN** the AI SHALL place its stone at the intersection with the highest score

#### Scenario: Empty board first move
- **WHEN** the board is completely empty and it is the AI's turn
- **THEN** the AI SHALL place its stone at the center intersection (9, 9)

### Requirement: Three difficulty levels
The system SHALL support three AI difficulty levels that control the amount of random noise added to position scores.

#### Scenario: Normal difficulty
- **WHEN** the difficulty is "normal"
- **THEN** the system SHALL add random noise of ±5000 to each position's score before selecting

#### Scenario: Hard difficulty
- **WHEN** the difficulty is "hard"
- **THEN** the system SHALL add random noise of ±500 to each position's score before selecting

#### Scenario: Impossible difficulty
- **WHEN** the difficulty is "impossible"
- **THEN** the system SHALL use raw scores without any noise

### Requirement: AI move delay
The system SHALL delay the AI's move by approximately 500ms to simulate thinking time.

#### Scenario: AI takes time to move
- **WHEN** it is the AI's turn
- **THEN** the system SHALL wait approximately 500ms before placing the AI's stone

#### Scenario: Board locked during AI thinking
- **WHEN** the AI is computing its move
- **THEN** all board intersections SHALL be non-interactive

### Requirement: AI thinking indicator
The system SHALL display a visual indicator when the AI is computing its move.

#### Scenario: Thinking message shown
- **WHEN** it is the AI's turn and the delay is active
- **THEN** the turn indicator SHALL display "電腦思考中..."
