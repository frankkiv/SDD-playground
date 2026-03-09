## ADDED Requirements

### Requirement: Room creation
The system SHALL allow a user to create a room and receive a short alphanumeric room code (6 characters) for sharing.

#### Scenario: Create room
- **WHEN** user clicks "建立房間" in the lobby
- **THEN** a room is created via PeerJS and a 6-character room code is displayed with a copy button

### Requirement: Room joining
The system SHALL allow a user to join an existing room by entering the room code.

#### Scenario: Join room
- **WHEN** user enters a valid room code and clicks "加入"
- **THEN** a P2P connection is established and both users enter the whiteboard

#### Scenario: Invalid room code
- **WHEN** user enters an invalid or expired room code
- **THEN** an error message is displayed

### Requirement: Initial state sync
The system SHALL synchronize the full whiteboard state from the host to the guest upon connection. The host sends a snapshot of all layers and objects.

#### Scenario: Guest receives state
- **WHEN** a guest joins a room where the host already has content
- **THEN** the guest's canvas is populated with all existing content from the host

### Requirement: Operation sync
The system SHALL synchronize all drawing operations in real-time between connected peers. Operations include: strokes, shapes, text, undo, redo, clear, layer changes.

#### Scenario: Sync a stroke
- **WHEN** user A draws a stroke while connected to user B
- **THEN** user B sees the stroke appear in real-time as user A draws

#### Scenario: Sync undo
- **WHEN** user A undoes an operation
- **THEN** user B's canvas reflects the undo (user A's object is removed)

### Requirement: Disconnect handling
The system SHALL detect peer disconnection and display a banner. Users SHALL be able to continue drawing offline after disconnection.

#### Scenario: Peer disconnects
- **WHEN** the connected peer disconnects or closes the browser
- **THEN** a "對方已離線" banner is displayed, and the user can continue drawing locally

### Requirement: Lobby UI
The system SHALL provide a lobby screen with options to create or join a room, consistent with existing game lobbies.

#### Scenario: Lobby layout
- **WHEN** user selects online mode
- **THEN** a lobby is shown with "建立房間" and "加入房間" options, matching the style of tic-tac-toe/gomoku lobbies
