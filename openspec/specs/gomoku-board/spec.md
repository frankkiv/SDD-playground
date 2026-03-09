### Requirement: 19x19 grid rendering
The system SHALL render a 19x19 Go-style grid using SVG lines, with intersections clearly visible on a dark background.

#### Scenario: Board displays on load
- **WHEN** the game screen is shown
- **THEN** the system SHALL display a 19x19 grid with 18x18 line segments in each direction, forming 361 intersections

### Requirement: Stones placed on intersections
The system SHALL render stones (black or white circles) at grid intersections, not inside cells.

#### Scenario: Stone appears at clicked intersection
- **WHEN** a player clicks near a grid intersection
- **THEN** a stone of the current player's color SHALL appear centered on that intersection

### Requirement: Click targets snap to nearest intersection
The system SHALL calculate the nearest grid intersection from the click position and place the stone there. Clicks too far from any intersection (beyond half the grid spacing) SHALL be ignored.

#### Scenario: Click between intersections
- **WHEN** a player clicks between two intersections
- **THEN** the stone SHALL be placed at the nearest intersection

### Requirement: Hover preview
The system SHALL display a semi-transparent preview stone at the nearest intersection when the player hovers over the board, indicating where a stone would be placed.

#### Scenario: Hover shows preview
- **WHEN** a player hovers over the board during their turn
- **THEN** a semi-transparent stone of the current player's color SHALL appear at the nearest empty intersection

#### Scenario: No preview on occupied intersection
- **WHEN** a player hovers near an occupied intersection
- **THEN** no preview stone SHALL be displayed

### Requirement: Board scales to fit viewport
The system SHALL use an SVG viewBox so the board scales to fit the available screen space without scrolling.

#### Scenario: Board fits on desktop screen
- **WHEN** the game is viewed on a desktop browser
- **THEN** the entire 19x19 board SHALL be visible without scrolling

### Requirement: Winning stones highlighted
The system SHALL visually highlight the five (or more) connected stones that form the winning line.

#### Scenario: Win detected
- **WHEN** a player achieves five in a row
- **THEN** the winning stones SHALL be highlighted with a distinct visual effect (glow or color change)

#### Scenario: Non-winning stones dimmed
- **WHEN** the game ends
- **THEN** all stones not part of the winning line SHALL be dimmed
