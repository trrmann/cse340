# ValidatePort.ps1 Requirements

## Purpose

Ensure a specified port is available for use by the application. If the port is in use, identify and optionally terminate the process using it.

## Functional Requirements

1. **Port Availability Check**
   - The script must accept a port number as a parameter.
   - It must check if the port is currently in use.
2. **Process Identification**
   - If the port is in use, the script must identify the process (name, PID, path) using the port.
3. **User Popup Prompt for Action**
   - The script must present a popup message to the user with Yes/No options:
     - **Yes**: Attempt to kill the process using the port.
     - **No**: Exit gracefully, informing the user that the workflow is cancelled.
4. **Post-Kill Verification and User Notification**
   - After attempting to kill the process, the script must re-check if the port is free.
   - It must present a popup message with an OK button only, informing the user whether the port was successfully freed or not.
   - If the port is free, the script must exit successfully (exit code 0).
   - If the port is still in use, the script must exit with an error (exit code 1).
5. **Edge Case Handling**
   - If the process cannot be identified, the script must inform the user and exit with an error.
   - If the kill operation fails, the script must inform the user and exit with an error.
   - If a new process takes over the port immediately after killing, the script must inform the user and exit with an error.

## Non-Functional Requirements

1. The script must be robust and handle all edge cases gracefully.
2. All user prompts must use GUI popups when possible; fallback to console prompts if not interactive.
3. The script must be compatible with Windows PowerShell 5.1+ and PowerShell Core 7+.
4. All messages must be clear and actionable.
