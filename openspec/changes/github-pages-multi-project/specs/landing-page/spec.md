## ADDED Requirements

### Requirement: Landing page lists all projects
The root URL (`https://<user>.github.io/SDD-playground/`) SHALL serve a static HTML page that lists all deployed sub-projects as clickable links.

#### Scenario: User visits root URL
- **WHEN** a user navigates to `https://<user>.github.io/SDD-playground/`
- **THEN** the page SHALL display a list of all deployed sub-project names, each linking to its respective sub-path

### Requirement: Landing page auto-generates project links
The deployment workflow SHALL automatically generate the project link list during build time by scanning the built project directories, so no manual updates to the landing page are needed when projects are added or removed.

#### Scenario: New project appears on landing page
- **WHEN** a new sub-project is added and deployed
- **THEN** the landing page SHALL include a link to the new project without any manual edits to the landing page source

### Requirement: Landing page styling
The landing page SHALL use a dark theme consistent with the project aesthetic, with a title, brief description, and visually clear project cards or links.

#### Scenario: Page renders correctly
- **WHEN** a user views the landing page on a desktop browser
- **THEN** the page SHALL display a styled layout with readable text, project links, and no broken styles
