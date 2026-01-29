# Build.ps1 Functional Requirements

**Reminder:** If any new permanent functionality is added to Build.ps1, update this requirements file to reflect the changes.

- Runs **'pnpm run build'** from the project root if a build script exists in package.json. **pnpm is required. Do not use npm or yarn.**
- If no build script exists, outputs a message and skips the build step (for Node.js/Express projects without a build step).
- Exits with the same code as the build process (0 for success, nonzero for failure).
- Must be called from the scripts folder but run from the project root.
