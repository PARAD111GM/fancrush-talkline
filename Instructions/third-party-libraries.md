# Third-Party Libraries & Services: Fancrush - Talkline

**Version:** 1.0 (Phase 1 - MVP Focus)
**Date:** 2025-04-03

This document lists the key external libraries, frameworks, and services used in the Fancrush - Talkline project.

## 1. Core Framework & UI

* **Next.js:** (React Framework)
    * *Purpose:* Provides structure for frontend and backend API routes, server-side rendering, routing (App Router), optimizations.
    * *Docs:* [https://nextjs.org/docs](https://nextjs.org/docs)
* **React:** (JavaScript Library)
    * *Purpose:* Core library for building the user interface components.
    * *Docs:* [https://react.dev/](https://react.dev/)
* **Tailwind CSS:** (Utility-First CSS Framework)
    * *Purpose:* Styling the application using utility classes.
    * *Docs:* [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
* **shadcn/ui:** (UI Component Library)
    * *Purpose:* Provides accessible, themeable, and composable UI components built with Radix UI and Tailwind CSS (e.g., Button, Dialog, Input). Added via CLI.
    * *Docs:* [https://ui.shadcn.com/docs](https://ui.shadcn.com/docs)
* **lucide-react:** (Icon Library)
    * *Purpose:* Provides SVG icons used within the UI components. Typically installed as a dependency by shadcn/ui.
    * *Docs:* [https://lucide.dev/guide/packages/lucide-react](https://lucide.dev/guide/packages/lucide-react)

## 2. Backend & Data

* **Supabase:** (Backend-as-a-Service Platform)
    * *Purpose:* Provides PostgreSQL database, user authentication, authorization (RLS/Policies), instant APIs, storage, and potentially hosting.
    * *Libraries:* `@supabase/supabase-js`, `@supabase/ssr`, `@supabase/auth-ui-react`
    * *Docs:* [https://supabase.com/docs](https://supabase.com/docs)
* **TypeScript:** (Programming Language)
    * *Purpose:* Adds static typing to JavaScript for improved developer experience and code quality.
    * *Docs:* [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)

## 3. Communication & AI

* **Vapi.ai:** (AI Voice Conversation Platform)
    * *Purpose:* Provides the AI assistant capabilities, voice synthesis/recognition, and conversation management. Used for both web demo and PSTN calls.
    * *Libraries:* `@vapi-ai/web` (Frontend Web SDK)
    * *Docs:* [https://docs.vapi.ai/](https://docs.vapi.ai/)
* **Twilio:** (Cloud Communications Platform)
    * *Purpose:* Used for PSTN call initiation, bridging calls between user phone and Vapi endpoint, sending/verifying SMS OTPs (optional).
    * *Libraries:* `twilio` (Node.js helper library for backend)
    * *Docs:* [https://www.twilio.com/docs](https://www.twilio.com/docs)

## 4. Payments

* **Stripe:** (Online Payment Processing Platform)
    * *Purpose:* Handles purchasing of minute packs, secure payment processing, subscription management (future), and potentially payouts (future - Stripe Connect).
    * *Libraries:* `stripe` (Node.js library for backend), `@stripe/stripe-js`, `@stripe/react-stripe-js` (Frontend libraries for Checkout/Elements)
    * *Docs:* [https://stripe.com/docs](https://stripe.com/docs)

## 5. Development & Tooling

* **Node.js:** (JavaScript Runtime)
    * *Purpose:* Executes JavaScript/TypeScript code server-side and provides the npm ecosystem.
    * *Docs:* [https://nodejs.org/](https://nodejs.org/)
* **npm / yarn:** (Package Managers)
    * *Purpose:* Managing project dependencies.
* **ESLint:** (Linter)
    * *Purpose:* Code analysis to find problematic patterns or enforce style guides.
* **Prettier:** (Code Formatter)
    * *Purpose:* Enforces consistent code formatting.
* **Git:** (Version Control System)
    * *Purpose:* Tracking changes in the codebase.
* **GitHub / GitLab / etc.:** (Code Hosting & Collaboration)
    * *Purpose:* Repository hosting, issue tracking, CI/CD integration.
* **ngrok / Stripe CLI:** (Development Tools)
    * *Purpose:* Exposing local development server for webhook testing.

*(Versions should be managed via `package.json`)*
