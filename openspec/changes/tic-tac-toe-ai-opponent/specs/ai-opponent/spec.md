## ADDED Requirements

### Requirement: AI uses Minimax algorithm
The system SHALL use the Minimax algorithm to determine the optimal move for the AI opponent, evaluating all possible game states to find the best outcome.

#### Scenario: AI selects optimal move on impossible difficulty
- **WHEN** the difficulty is set to "impossible" and it is the AI's turn
- **THEN** the AI SHALL always select the move with the highest Minimax score

### Requirement: Three difficulty levels
The system SHALL support three AI difficulty levels that control how often the AI plays the optimal move.

#### Scenario: Normal difficulty
- **WHEN** the difficulty is "normal"
- **THEN** the AI SHALL play the Minimax-optimal move 30% of the time and a random valid move 70% of the time

#### Scenario: Hard difficulty
- **WHEN** the difficulty is "hard"
- **THEN** the AI SHALL play the Minimax-optimal move 80% of the time and a random valid move 20% of the time

#### Scenario: Impossible difficulty
- **WHEN** the difficulty is "impossible"
- **THEN** the AI SHALL always play the Minimax-optimal move

### Requirement: AI move delay
The system SHALL delay the AI's move by approximately 500ms to simulate thinking time and provide a natural gameplay experience.

#### Scenario: AI takes time to move
- **WHEN** it is the AI's turn
- **THEN** the system SHALL wait approximately 500ms before placing the AI's mark on the board

#### Scenario: Board is locked during AI thinking
- **WHEN** the AI is thinking (during the delay period)
- **THEN** all board cells SHALL be non-interactive until the AI has placed its mark

### Requirement: AI thinking indicator
The system SHALL display a visual indicator when the AI is computing its move.

#### Scenario: Thinking message shown
- **WHEN** it is the AI's turn and the delay period is active
- **THEN** the turn indicator SHALL display "電腦思考中..."
