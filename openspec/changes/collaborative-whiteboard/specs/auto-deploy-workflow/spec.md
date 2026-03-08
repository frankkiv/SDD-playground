## MODIFIED Requirements

### Requirement: Build all sub-projects
The workflow SHALL run `npm ci` and `npm run build` for each detected sub-project, collecting the build output into a unified deployment directory structured as `_site/<project-name>/`. The landing page generator's `name_map` SHALL include `'whiteboard': '電子白板'` for proper Chinese display name rendering.

#### Scenario: Successful build
- **WHEN** all detected sub-projects build successfully
- **THEN** the workflow SHALL produce a `_site/` directory containing each project's build output under its project name subdirectory

#### Scenario: Build failure
- **WHEN** a sub-project's build fails
- **THEN** the workflow SHALL fail the entire deployment and report which project failed

#### Scenario: Whiteboard project display name
- **WHEN** the landing page is generated
- **THEN** the whiteboard project SHALL be displayed with the name "電子白板"
