# Lint.ps1 Functional Requirements

**Reminder:** If any new permanent functionality is added to Lint.ps1, update this requirements file to reflect the changes.

- Runs **'pnpm run lint'** from the project root, passing any additional arguments. **pnpm is required. Do not use npm or yarn.**
- If the initial lint run fails, rerun lint as a fix (e.g., with '--fix'), capture that result, and then retest lint.
- After a fix attempt, always rerun lint to verify the result and return the exit code of the retest.
- Exits with the same code as the final lint process (0 for success, nonzero for failure).
- Must be called from the scripts folder but run from the project root.
