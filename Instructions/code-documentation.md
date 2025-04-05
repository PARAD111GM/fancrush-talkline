# Code Documentation Standards: Fancrush - Talkline

**Version:** 1.0
**Date:** 2025-04-03

## 1. Introduction

Consistent and clear code documentation is essential for maintainability, collaboration, and onboarding new developers. This document outlines the standards and guidelines for documenting the Fancrush - Talkline codebase.

## 2. General Principles

* **Clarity:** Write comments and documentation that are easy to understand. Avoid jargon where possible or explain it.
* **Conciseness:** Be brief but informative. Avoid overly long or redundant comments.
* **Accuracy:** Ensure comments and documentation accurately reflect the code's behavior and are updated when the code changes.
* **Purposeful:** Focus on *why* the code exists or *why* a particular approach was taken, rather than simply restating *what* the code does (unless the 'what' is complex).

## 3. Code Comments

* **File Headers:** Consider adding a brief header comment at the top of complex files explaining the file's purpose and main exports.
* **Function/Method Headers (TSDoc/JSDoc):**
    * All exported functions, methods, and complex internal functions should have TSDoc/JSDoc blocks.
    * Include a brief description of the function's purpose.
    * Use `@param` to describe each parameter (including its type if not obvious).
    * Use `@returns` to describe the return value.
    * Use `@throws` to document potential errors thrown.
    * Use `@example` to provide usage examples where helpful.
    * Use `@see` to link to related functions or documentation.
    * Use `@deprecated` if applicable.
    ```typescript
    /**
     * Initiates a PSTN call via Twilio to connect a user and an AI assistant.
     * Requires the user to be authenticated and have sufficient minutes.
     *
     * @param userId - The UUID of the authenticated user initiating the call.
     * @param influencerId - The UUID of the target influencer.
     * @returns A promise resolving to an object indicating success or failure.
     * @throws Error if Twilio API call fails or user validation fails.
     * @example
     * const result = await initiatePstnCall('user-uuid-123', 'influencer-uuid-456');
     * if (!result.success) console.error(result.error);
     */
    async function initiatePstnCall(userId: string, influencerId: string): Promise<{ success: boolean; error?: string }> {
      // ... implementation ...
    }
    ```
* **Inline Comments:**
    * Use inline comments (`//`) to explain complex logic, workarounds, assumptions, or the purpose of non-obvious code sections.
    * Explain the "why" behind a piece of code if it's not immediately clear.
    * Mark temporary code, TODOs, or FIXMEs clearly:
        ```typescript
        // TODO: Refactor this logic to be more efficient (FAN-123)
        // FIXME: Addresses edge case where user hangs up immediately (FAN-456)
        // HACK: Workaround for library bug XYZ, remove when fixed.
        ```
* **React Components:**
    * Use TSDoc for component props interfaces/types.
    * Add comments explaining complex state logic or effects (`useEffect`).

## 4. README Files

* **Root `README.md`:**
    * Project title and brief description.
    * Links to key documentation (this file, PRD, architecture docs).
    * Instructions for setting up the development environment (`.env.local` variables needed, prerequisites).
    * Instructions for running the project locally (`npm install`, `npm run dev`).
    * Instructions for running tests (`npm test`).
    * Overview of the project structure.
    * Deployment information (link to Vercel/hosting).
* **Subdirectory `README.md` (Optional):** Consider adding README files to complex directories (e.g., `/lib/twilio/`) explaining the purpose and usage of the modules within that directory.

## 5. Commit Messages

* Follow Conventional Commits specification ([https://www.conventionalcommits.org/](https://www.conventionalcommits.org/)).
* Format: `<type>[optional scope]: <description>`
    * Examples:
        * `feat: add stripe checkout endpoint`
        * `fix(auth): correct phone verification logic`
        * `docs: update backend api documentation`
        * `refactor(ui): simplify landing page component`
        * `test: add unit tests for minute deduction`
        * `chore: update npm dependencies`
* Use imperative mood in the description (e.g., "add" not "added" or "adds").
* Keep the subject line concise (<= 50 chars).
* Provide more detail in the commit body if necessary. Reference relevant issue numbers (e.g., `Closes FAN-123`).

## 6. Type Definitions (TypeScript)

* Use clear and descriptive names for types and interfaces.
* Leverage TypeScript's utility types where appropriate.
* Generate types from external sources where possible (e.g., Supabase schema).

## 7. Review

* Code reviews should include checks for documentation quality and adherence to these standards.
* Periodically review and update documentation to ensure it remains accurate as the codebase evolves.
