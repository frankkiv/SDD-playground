## ADDED Requirements

### Requirement: Export as PNG
The system SHALL allow users to export the current canvas view as a PNG image file. The export SHALL include all visible layers composited together.

#### Scenario: Export PNG
- **WHEN** user clicks the export PNG button
- **THEN** a PNG file is downloaded containing all visible layer content at the current canvas resolution

### Requirement: Save as JSON
The system SHALL allow users to save the entire whiteboard state as a JSON file. The JSON SHALL include all objects, layers, and their properties.

#### Scenario: Save whiteboard
- **WHEN** user clicks the save button
- **THEN** a JSON file is downloaded containing the complete whiteboard state (objects, layers, layer order)

### Requirement: Load from JSON
The system SHALL allow users to load a previously saved JSON file to restore a whiteboard state. Loading SHALL replace the current canvas content.

#### Scenario: Load whiteboard
- **WHEN** user clicks the load button and selects a valid JSON file
- **THEN** the canvas is cleared and restored to the saved state (all objects and layers)

#### Scenario: Invalid file
- **WHEN** user selects an invalid or corrupted file
- **THEN** an error message is shown and the current canvas is not affected
