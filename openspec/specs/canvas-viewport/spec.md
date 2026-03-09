### Requirement: Canvas panning
The system SHALL allow users to pan the canvas viewport by using a dedicated pan tool (drag to pan) or by holding Space + drag.

#### Scenario: Pan with pan tool
- **WHEN** user selects pan tool and drags on canvas
- **THEN** the viewport moves to reveal different areas of the canvas

#### Scenario: Pan with Space key
- **WHEN** user holds Space and drags on canvas (regardless of current tool)
- **THEN** the viewport pans, and releasing Space returns to the previous tool

### Requirement: Canvas zooming
The system SHALL allow users to zoom in and out using mouse wheel (or pinch gesture on touch devices). Zoom SHALL be centered on the cursor position.

#### Scenario: Zoom with mouse wheel
- **WHEN** user scrolls mouse wheel up/down on the canvas
- **THEN** the viewport zooms in/out centered on the cursor position

#### Scenario: Zoom limits
- **WHEN** user zooms beyond minimum (0.1x) or maximum (5x) scale
- **THEN** the zoom level is clamped and does not exceed the limits

### Requirement: Coordinate transformation
The system SHALL transform screen coordinates to canvas coordinates and vice versa, accounting for current pan offset and zoom level. All drawing operations SHALL use canvas coordinates.

#### Scenario: Draw while zoomed and panned
- **WHEN** user draws on the canvas while zoomed in and panned
- **THEN** the stroke is recorded in canvas coordinates, and renders correctly at any zoom/pan level

### Requirement: Zoom indicator
The system SHALL display the current zoom percentage. Users SHALL be able to click to reset to 100%.

#### Scenario: Reset zoom
- **WHEN** user clicks the zoom indicator
- **THEN** the viewport resets to 100% zoom centered on the current view
