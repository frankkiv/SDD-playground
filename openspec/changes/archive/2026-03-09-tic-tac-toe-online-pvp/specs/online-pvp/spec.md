## ADDED Requirements

### Requirement: Room creation
The system SHALL allow a player to create a room, generating a 6-character alphanumeric code and waiting for an opponent to join.

#### Scenario: Host creates room
- **WHEN** a player clicks "建立房間"
- **THEN** the system SHALL create a PeerJS connection, display the room code, and show a "等待對手加入..." status

#### Scenario: Host sees room code
- **WHEN** a room is successfully created
- **THEN** the system SHALL display the 6-character code prominently with a copy button

### Requirement: Room joining
The system SHALL allow a player to join an existing room by entering the 6-character code.

#### Scenario: Guest joins room
- **WHEN** a player enters a valid room code and clicks "加入"
- **THEN** the system SHALL connect to the host's Peer and both players SHALL enter the game

#### Scenario: Invalid room code
- **WHEN** a player enters an invalid or expired room code
- **THEN** the system SHALL display an error message "無法連線，請確認房間代碼"

### Requirement: Move synchronization
The system SHALL synchronize moves between connected players in real-time via WebRTC DataChannel.

#### Scenario: Player makes a move
- **WHEN** a player places their mark
- **THEN** the system SHALL send the move to the opponent and the opponent's board SHALL update immediately

#### Scenario: Receiving opponent's move
- **WHEN** a move message is received from the opponent
- **THEN** the system SHALL place the opponent's mark on the board and update the turn

### Requirement: Role assignment
The system SHALL assign X (first player) to the host and O (second player) to the guest.

#### Scenario: Host is X
- **WHEN** a game starts in online mode
- **THEN** the host SHALL play as X and move first

### Requirement: Disconnection handling
The system SHALL detect when the opponent disconnects and notify the player.

#### Scenario: Opponent disconnects
- **WHEN** the WebRTC connection is lost during a game
- **THEN** the system SHALL display "對手已離線" and provide a button to return to the setup screen

### Requirement: Play again in online mode
The system SHALL support playing again when both players agree.

#### Scenario: One player requests rematch
- **WHEN** a player clicks "再來一局" in online mode
- **THEN** the system SHALL send a restart request to the opponent and show "等待對手同意..."

#### Scenario: Both players agree to rematch
- **WHEN** both players have requested or acknowledged a rematch
- **THEN** the system SHALL reset the board and start a new game
