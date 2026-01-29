# Format.ps1 Functional Requirements

**Reminder:** If any new permanent functionality is added to Format.ps1, update this requirements file to reflect the changes.

- Runs **'pnpm run format'** from the project root, passing any additional arguments. **pnpm is required. Do not use npm or yarn.**
- Exits with the same code as the format process (0 for success, nonzero for failure).
- Must be called from the scripts folder but run from the project root.
