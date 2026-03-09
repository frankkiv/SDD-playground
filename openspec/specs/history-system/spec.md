### Requirement: Undo operation
The system SHALL support undoing the most recent drawing operation. Undo SHALL remove the last object added by the current user from the canvas.

#### Scenario: Undo a stroke
- **WHEN** user presses Ctrl+Z or clicks the undo button
- **THEN** the most recent drawing object is removed from the canvas and pushed to the redo stack

#### Scenario: Nothing to undo
- **WHEN** user attempts undo with an empty undo stack
- **THEN** nothing happens and the undo button appears disabled

### Requirement: Redo operation
The system SHALL support redoing a previously undone operation.

#### Scenario: Redo an undone stroke
- **WHEN** user presses Ctrl+Y or clicks the redo button
- **THEN** the most recently undone object is restored to the canvas

#### Scenario: Redo stack cleared on new action
- **WHEN** user draws a new object after undoing
- **THEN** the redo stack is cleared

### Requirement: Clear all
The system SHALL allow clearing all objects from all layers. This action SHALL be undoable.

#### Scenario: Clear canvas
- **WHEN** user clicks clear all button
- **THEN** all objects on all layers are removed, and the operation can be undone

### Requirement: Online undo scope
In online mode, undo SHALL only affect the current user's operations. Each user has their own undo/redo history.

#### Scenario: Undo own operation in online mode
- **WHEN** user A presses undo while connected to user B
- **THEN** only user A's most recent operation is undone, user B's operations are unaffected
