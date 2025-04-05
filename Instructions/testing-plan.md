# Testing Plan: Fancrush - Talkline

**Version:** 1.0 (Phase 1 - MVP Focus)
**Date:** 2025-04-03

## 1. Introduction

This document outlines the testing strategy for the Fancrush - Talkline application to ensure quality, functionality, and reliability, particularly focusing on the Phase 1 MVP.

## 2. Testing Goals

* Verify all functional requirements of the MVP are met.
* Ensure a smooth and intuitive user experience for the core fan flow.
* Validate the reliability of core backend processes (call initiation, minute tracking, payments).
* Identify and fix critical bugs before launch.
* Ensure basic security checks are passed.
* Verify responsiveness across major devices (desktop, mobile).

## 3. Testing Levels

* **Unit Testing:**
    * *Scope:* Individual functions, components, utility methods.
    * *Tools:* Jest, React Testing Library.
    * *Focus:* Testing pure functions (e.g., duration formatting), component rendering logic (given specific props), utility functions (e.g., Supabase client wrappers - mocked).
    * *Location:* Co-located with code (`*.test.ts` or `__tests__` directory).
* **Integration Testing:**
    * *Scope:* Interactions between different parts of the system, particularly API endpoints and database operations.
    * *Tools:* Jest, Supertest (for API endpoint testing), Supabase test helpers (if available), potentially mocking third-party APIs (Stripe, Twilio, Vapi).
    * *Focus:* Testing API route handlers (correct responses, status codes, authentication checks), database CRUD operations (verifying data integrity after API calls), webhook handler logic (simulating webhook payloads).
* **End-to-End (E2E) Testing:**
    * *Scope:* Simulating complete user flows through the browser interface.
    * *Tools:* Playwright or Cypress.
    * *Focus:* Testing the core fan user flow: Landing Page -> Demo Call -> Signup -> Login -> Purchase Minutes (mocked/test mode Stripe) -> Initiate PSTN Call (verify initiation, cannot easily test actual call content E2E). Testing form submissions, navigation, UI state changes based on actions.
* **Manual Testing:**
    * *Scope:* Exploratory testing, usability checks, real-world scenario testing, areas difficult to automate.
    * *Focus:*
        * **Call Quality:** Making actual demo calls and PSTN calls (using test accounts/numbers) to assess voice quality, latency, AI responsiveness.
        * **Payment Flow:** Performing real (test mode) Stripe transactions.
        * **Cross-Browser/Device Testing:** Manually checking layout and functionality on target browsers (Chrome, Firefox, Safari) and devices (iOS, Android, Desktop).
        * **Edge Cases:** Testing invalid inputs, network interruptions, concurrent actions.
        * **Usability:** Assessing the overall flow and ease of use.

## 4. Testing Strategy & Focus Areas (MVP)

* **Priority 1: Core Fan Flow**
    * E2E tests covering signup, login, minute purchase, PSTN call initiation button click.
    * Integration tests for `/api/stripe/create-checkout`, `/api/webhooks/stripe`, `/api/calls/initiate-pstn`, `/api/webhooks/call-status`.
    * Manual testing of the entire flow, including actual demo and PSTN calls (using test credentials/numbers) and Stripe test payments.
* **Priority 2: Vapi Web SDK Integration**
    * E2E tests for starting/stopping the demo call.
    * Manual testing of demo call quality and the 2-minute timeout/popup logic.
* **Priority 3: Authentication & Authorization**
    * Integration tests for API route protection.
    * E2E tests for login/signup forms, protected routes access.
    * Manual testing of login/logout, session handling.
* **Priority 4: Minute Tracking Logic**
    * Integration tests verifying atomic updates to `available_minutes` via Stripe and Twilio webhooks.
    * Manual testing: check minute balance before/after purchase and before/after calls.
* **Priority 5: UI & Responsiveness**
    * Manual testing across different screen sizes.
    * Component tests ensuring basic rendering.

## 5. Test Environment

* **Local Development:** Unit tests, integration tests (with mocked services or live dev instances), manual testing. Use `ngrok`/`stripe listen` for webhooks.
* **Staging Environment:** A dedicated deployment mirroring production. Used for E2E tests, UAT (User Acceptance Testing), and more thorough manual testing with test credentials for third-party services.
* **Production Environment:** Smoke testing after deployment. Ongoing monitoring.

## 6. Test Data Management

* Use Supabase seeding or manual setup in development/staging databases for test users and influencers.
* Use Stripe test mode API keys and test card numbers.
* Use Twilio test credentials if available, or dedicated test numbers.
* Use development/test Vapi assistants.

## 7. Bug Tracking

* Use project management tool (e.g., GitHub Issues, Jira) to log, prioritize, and track bugs found during testing. Include steps to reproduce, environment details, and severity.
