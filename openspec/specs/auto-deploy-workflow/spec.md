## ADDED Requirements

### Requirement: Auto-detect sub-projects
The workflow SHALL scan the repository root for directories containing a `package.json` file with a `build` script, and treat each as a deployable sub-project.

#### Scenario: New project added
- **WHEN** a new directory with `package.json` (containing a `build` script) is pushed to `main`
- **THEN** the workflow SHALL automatically include it in the next build and deploy cycle without any workflow file changes

#### Scenario: Non-project directories ignored
- **WHEN** a directory exists without a `package.json` (e.g., `openspec/`, `.github/`)
- **THEN** the workflow SHALL skip it during the build phase

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

### Requirement: Deploy to GitHub Pages
The workflow SHALL deploy the unified `_site/` directory to GitHub Pages using the official `actions/deploy-pages` action, triggered on pushes to the `main` branch.

#### Scenario: Successful deployment
- **WHEN** all builds succeed and the workflow pushes to GitHub Pages
- **THEN** each sub-project SHALL be accessible at `https://<user>.github.io/SDD-playground/<project-name>/`

### Requirement: Vite base path configuration
Each Vite sub-project SHALL have its `vite.config.js` configured with `base: '/SDD-playground/<project-name>/'` to ensure correct asset resolution under the GitHub Pages sub-path.

#### Scenario: Assets load correctly
- **WHEN** a user navigates to `https://<user>.github.io/SDD-playground/<project-name>/`
- **THEN** all JS, CSS, and other assets SHALL load without 404 errors
