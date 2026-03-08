## ADDED Requirements

### Requirement: Tool selection bar
The system SHALL display a bottom toolbar with tool buttons: Pen, Highlighter, Eraser, Rectangle, Circle, Arrow, Text, Pan. The active tool SHALL be visually highlighted.

#### Scenario: Select a tool
- **WHEN** user clicks a tool button in the toolbar
- **THEN** the tool becomes active, its button is highlighted, and cursor changes accordingly

### Requirement: Tool options panel
The system SHALL display contextual options for the selected tool: color picker and line width selector for drawing tools, font size for text tool.

#### Scenario: Show pen options
- **WHEN** pen or highlighter tool is active
- **THEN** color picker and line width selector are visible in the toolbar area

#### Scenario: Show text options
- **WHEN** text tool is active
- **THEN** color picker and font size selector are visible

### Requirement: Action buttons
The system SHALL provide action buttons for: Undo, Redo, Clear All, Export PNG, Save (JSON), Load (JSON).

#### Scenario: Action buttons always visible
- **WHEN** the whiteboard is open
- **THEN** undo, redo, clear, export, save, and load buttons are accessible from the toolbar

### Requirement: Layer panel toggle
The system SHALL provide a button to toggle a side panel showing the layer list with add/delete/visibility/reorder controls.

#### Scenario: Open layer panel
- **WHEN** user clicks the layer panel toggle button
- **THEN** a side panel slides in showing all layers with controls

### Requirement: Online connection controls
The system SHALL display connection status and room controls when in online mode: room code display, copy button, disconnect button.

#### Scenario: Show room code
- **WHEN** user is connected in online mode
- **THEN** the room code is visible with a copy button

### Requirement: Dark theme consistency
The toolbar and all UI elements SHALL use a dark theme consistent with existing SDD-playground projects (dark backgrounds, subtle borders, accent colors).

#### Scenario: Visual consistency
- **WHEN** user opens the whiteboard
- **THEN** the UI uses dark theme colors matching the SDD-playground design language
