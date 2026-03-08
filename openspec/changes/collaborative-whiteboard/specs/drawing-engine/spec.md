## ADDED Requirements

### Requirement: Freehand drawing (Pen tool)
The system SHALL allow users to draw freehand strokes on the canvas by clicking and dragging. Each stroke SHALL be recorded as an object with tool type, color, line width, layer ID, and an array of points.

#### Scenario: Draw a stroke
- **WHEN** user selects the pen tool and drags on the canvas
- **THEN** a smooth line is rendered following the cursor path, and a stroke object is added to the current layer

#### Scenario: Stroke properties
- **WHEN** user draws with pen tool
- **THEN** the stroke uses the currently selected color and line width

### Requirement: Highlighter tool
The system SHALL provide a highlighter tool that draws semi-transparent strokes (opacity ~0.3) with a wider default width, simulating a real highlighter effect.

#### Scenario: Draw with highlighter
- **WHEN** user selects the highlighter tool and drags on the canvas
- **THEN** a semi-transparent stroke is rendered, and the stroke object is stored with tool type "highlighter"

### Requirement: Eraser tool
The system SHALL provide an eraser tool that removes strokes it touches. The eraser SHALL remove entire stroke objects (not partial pixels).

#### Scenario: Erase a stroke
- **WHEN** user selects the eraser tool and drags over existing strokes
- **THEN** any stroke whose path intersects with the eraser path is removed from the canvas

### Requirement: Shape tool (Rectangle)
The system SHALL allow users to draw rectangles by clicking a start point and dragging to define the opposite corner.

#### Scenario: Draw a rectangle
- **WHEN** user selects rectangle shape tool, clicks and drags on canvas
- **THEN** a rectangle preview follows the cursor during drag, and on release a rectangle object is added with position, dimensions, color, and line width

### Requirement: Shape tool (Circle/Ellipse)
The system SHALL allow users to draw ellipses by clicking a center point and dragging to define the radius.

#### Scenario: Draw an ellipse
- **WHEN** user selects circle shape tool, clicks and drags on canvas
- **THEN** an ellipse preview follows the cursor during drag, and on release an ellipse object is added

### Requirement: Shape tool (Arrow)
The system SHALL allow users to draw arrow lines by clicking a start point and dragging to an end point. The arrow SHALL have an arrowhead at the end point.

#### Scenario: Draw an arrow
- **WHEN** user selects arrow shape tool, clicks and drags on canvas
- **THEN** an arrow line with arrowhead is rendered from start to end point

### Requirement: Text tool
The system SHALL allow users to place text on the canvas by clicking a position and typing. A text input SHALL appear at the clicked position.

#### Scenario: Add text
- **WHEN** user selects text tool and clicks on canvas
- **THEN** an inline text input appears at that position
- **WHEN** user types text and presses Enter or clicks away
- **THEN** the text is rendered on the canvas as a text object with position, content, font size, and color

### Requirement: Color selection
The system SHALL provide a color picker with at least 8 preset colors and a custom color input. The selected color SHALL apply to all drawing tools.

#### Scenario: Change drawing color
- **WHEN** user selects a different color from the color picker
- **THEN** subsequent drawing operations use the new color

### Requirement: Line width selection
The system SHALL provide at least 4 line width options for drawing tools. The selected width SHALL apply to pen, highlighter, shapes, and eraser size.

#### Scenario: Change line width
- **WHEN** user selects a different line width
- **THEN** subsequent drawing operations use the new width
