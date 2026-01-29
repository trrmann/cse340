# Start.ps1 Functional Requirements

**Reminder:** If any new permanent functionality is added to Start.ps1, update this requirements file to reflect the changes.

- Runs **'pnpm run start'** from the project root in a new PowerShell window. **pnpm is required. Do not use npm or yarn.**
- After starting the server, opens the localhost URL to the correct port in the default browser.
- Informs the user to check dev-server.log for output/errors if the window closes unexpectedly.
- Outputs status messages for server start.
