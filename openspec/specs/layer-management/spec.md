### Requirement: Default layer
The system SHALL create a default layer named "圖層 1" when a new whiteboard session starts. All drawing operations SHALL target the active layer.

#### Scenario: Initial state
- **WHEN** user opens the whiteboard
- **THEN** one default layer "圖層 1" exists and is active

### Requirement: Add layer
The system SHALL allow users to add new layers. New layers SHALL be added above the current active layer with auto-generated names ("圖層 2", "圖層 3", etc.).

#### Scenario: Add a new layer
- **WHEN** user clicks the add layer button
- **THEN** a new layer is created above the active layer and becomes the new active layer

### Requirement: Delete layer
The system SHALL allow users to delete layers. Deleting a layer SHALL remove all objects on that layer. The last remaining layer SHALL NOT be deletable.

#### Scenario: Delete a layer
- **WHEN** user deletes a layer that is not the only layer
- **THEN** the layer and all its objects are removed, and the next layer becomes active

#### Scenario: Cannot delete last layer
- **WHEN** user attempts to delete the only remaining layer
- **THEN** the delete action is disabled or prevented

### Requirement: Toggle layer visibility
The system SHALL allow users to toggle the visibility of each layer. Hidden layers SHALL not be rendered but their objects are preserved.

#### Scenario: Hide a layer
- **WHEN** user toggles a layer's visibility off
- **THEN** all objects on that layer are hidden from the canvas view

### Requirement: Reorder layers
The system SHALL allow users to reorder layers by dragging them in the layer panel. Objects render in layer order (bottom layer first).

#### Scenario: Move layer up
- **WHEN** user drags a layer above another layer in the panel
- **THEN** the layer order changes and the canvas re-renders accordingly

### Requirement: Active layer selection
The system SHALL allow users to switch the active layer by clicking it in the layer panel. All drawing operations target the active layer.

#### Scenario: Switch active layer
- **WHEN** user clicks a different layer in the panel
- **THEN** that layer becomes active and subsequent drawings are added to it
