# DevOps & Infrastructure: Fancrush - Talkline

**Version:** 1.0 (Phase 1 - MVP Focus)
**Date:** 2025-04-03

## 1. Overview

This document outlines the DevOps practices, infrastructure setup, deployment strategy, and monitoring approach for the Fancrush - Talkline project. The goal is to establish a reliable, repeatable, and scalable process for development and operations.

## 2. Development Workflow

* **Version Control:** Git hosted on GitHub (or similar).
* **Branching Strategy:** Gitflow (or GitHub Flow):
    * `main`: Represents production-ready code.
    * `develop`: Integration branch for upcoming release features.
    * `feature/`: Branches for developing new features (branched from `develop`).
    * `bugfix/`: Branches for fixing bugs (branched from `develop` or `main`).
    * `release/`: Branches for preparing releases (branched from `develop`).
* **Code Reviews:** Pull Requests (PRs) required for merging feature/bugfix branches into `develop` and for merging `release` into `main`. Require at least one approval.
* **Local Environment:** Developers run the Next.js app locally (`npm run dev`). Use `.env.local` for secrets. Use `ngrok`/`stripe listen` for webhook testing.
* **Code Quality:** Automated checks via ESLint, Prettier integrated into pre-commit hooks (using Husky/lint-staged) and CI pipeline.

## 3. Infrastructure

* **Hosting:** Vercel (recommended for Next.js) or Supabase Hosting. Provides seamless deployment, serverless functions for API routes, CDN, and SSL.
* **Database:** Supabase PostgreSQL (Managed service).
* **Authentication:** Supabase Auth (Managed service).
* **Storage:** Supabase Storage (Managed service, for Phase 2+).
* **Third-Party Services:** Vapi.ai, Twilio, Stripe (External SaaS platforms).

## 4. CI/CD (Continuous Integration / Continuous Deployment)

* **Platform:** GitHub Actions (or Vercel integrations).
* **CI Pipeline (Triggered on PRs to `develop`/`main`):**
    1.  Checkout code.
    2.  Set up Node.js environment.
    3.  Install dependencies (`npm ci`).
    4.  Run Linters/Formatters (`npm run lint`).
    5.  Run Unit & Integration Tests (`npm test`).
    6.  Build the application (`npm run build`).
    7.  *(Optional)* Run E2E Tests against a preview deployment.
* **CD Pipeline (Triggered on merge to `main`):**
    1.  Run CI steps.
    2.  Deploy to Production environment (e.g., `vercel deploy --prod`).
* **Preview Deployments:** Vercel automatically creates preview deployments for each PR, allowing for review before merging.

## 5. Environment Management

* **Local:** `.env.local` file (not committed to Git).
* **Staging:** Separate environment (e.g., dedicated Vercel project or branch deployment) configured with staging API keys for Supabase, Stripe (Test Mode), Twilio, Vapi.
* **Production:** Main deployment configured with production API keys via Vercel Environment Variables UI (or Supabase Hosting equivalent).

## 6. Database Management

* **Schema Changes:** Supabase Migrations managed via Supabase CLI.
    * Developers create migration files locally (`supabase migration new <name>`).
    * Apply migrations locally (`supabase db reset` or `supabase migration up`).
    * Commit migration files to Git.
    * CI/CD pipeline (or manual process for production) links the Supabase project and applies migrations (`supabase link --project-ref <ref>`, `supabase migration up`).
* **Backups:** Handled automatically by Supabase (configure Point-in-Time Recovery - PITR).
* **Seeding:** Use Supabase seeding capabilities (`supabase/seed.sql`) for populating initial data (e.g., test influencers) in development/staging environments.

## 7. Monitoring & Logging

* **Application Monitoring:**
    * Vercel Analytics (or Supabase Hosting equivalent) for web vitals, traffic insights.
    * Integrated error tracking service (e.g., Sentry, Logtail via Vercel integration) to capture frontend and backend errors.
* **Logging:**
    * API Routes/Server Components: Use `console.log`, `console.error`. Logs accessible via Vercel dashboard (Runtime Logs).
    * Supabase: Provides built-in logging for database queries and Auth events accessible in the Supabase dashboard.
    * Twilio/Stripe/Vapi: Utilize their respective dashboards for monitoring API usage, call logs, payment statuses, and errors.
* **Alerting:** Configure alerts based on error rates (Sentry/Logtail) or platform health metrics (Supabase/Vercel alerts). Set up alerts for critical webhook failures.

## 8. Secrets Management

* Use hosting provider's environment variable management (e.g., Vercel Environment Variables) for storing API keys and secrets securely.
* Avoid committing secrets directly to the codebase.
* Regularly rotate keys where possible/practical.
