# AI Agent Guidelines

## Version Control Policy

All AI agents and bots working on this project must follow strict version control.
The version format is `MAJOR.MINOR.PATCH` (e.g., `1.2.3`).

- **MAJOR** (`X.0.0`): Major updates and breaking changes.
- **MINOR** (`0.X.0`): New features and significant improvements.
- **PATCH** (`0.0.X`): Bugfixes, patches, and minor updates.

**CRITICAL RULE:**
You must **NEVER** submit a Pull Request or commit code without incrementing the version number in `package.json`.

- Check the current version in `package.json`.
- Determine the type of change (Major, Minor, or Patch).
- Increment the corresponding number.
- Reset lower-order numbers to 0 if incrementing Major or Minor.

Example:
- Current: `0.0.2`
- Bugfix -> `0.0.3`
- New Feature -> `0.1.0`
- Major Update -> `1.0.0`
