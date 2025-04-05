# Product Requirements Document (PRD): Fancrush - Talkline

**Version:** 1.0
**Date:** 2025-04-03
**Status:** Draft (Focus on Phase 1 MVP)

## 1. Introduction

Fancrush - Talkline is a web application designed to provide fans with a unique opportunity to engage in simulated phone conversations with AI-powered digital twins of their favorite online influencers. This document outlines the product requirements, features, and goals, initially focusing on the Minimum Viable Product (MVP).

## 2. Goals & Objectives

* **Overall Goal:** Become the leading platform for AI-driven fan-influencer voice interactions.
* **MVP Goal:** Validate the core fan experience and technical feasibility.
    * **Objective 1:** Achieve X number of completed demo calls within the first month post-launch.
    * **Objective 2:** Achieve Y number of registered users purchasing minutes within the first month.
    * **Objective 3:** Demonstrate reliable PSTN call connection and minute deduction.
    * **Objective 4:** Gather user feedback on call quality and overall experience.
* **Long-Term Goals:** Scale platform to support hundreds of influencers, introduce influencer self-service and payouts, achieve profitability.

## 3. Target Audience

* **Fans:** Followers (typically 16-35 age range) of online influencers across platforms like Instagram, TikTok, YouTube, OnlyFans, etc., who desire a more personal or novel form of interaction.
* **Influencers:** Content creators seeking innovative ways to engage their audience and generate additional revenue.

## 4. Features (Phased Rollout)

### Phase 1: MVP - Core Fan Experience

* **F1.1 (Fan): Influencer Landing Page:**
    * REQ1.1.1: Display influencer name, profile image, gallery images, and greeting message fetched dynamically based on URL slug.
    * REQ1.1.2: Prominent "Talk Now (2 min Demo)" button.
    * REQ1.1.3: Secondary CTA buttons for Login/Signup.
    * REQ1.1.4: Footer with Terms/Privacy links and AI simulation disclosure.
* **F1.2 (Fan): Vapi Web Demo Call:**
    * REQ1.2.1: Initiate in-browser call via Vapi Web SDK upon clicking "Talk Now".
    * REQ1.2.2: Display call timer and connection status.
    * REQ1.2.3: Limit call duration to 2 minutes.
    * REQ1.2.4: Provide button to end call manually.
    * REQ1.2.5: Display modal dialog prompting Login/Signup upon call end/timeout.
* **F1.3 (Fan): User Authentication:**
    * REQ1.3.1: Allow users to sign up using Email and Password.
    * REQ1.3.2: Require users to provide and verify a phone number during signup (via OTP).
    * REQ1.3.3: Allow registered users to log in using Email and Password.
    * REQ1.3.4: Provide basic session management (login persistence, logout).
* **F1.4 (Fan): Account Management (Basic):**
    * REQ1.4.1: Display user's available minute balance on a dedicated `/account` page (requires login).
    * REQ1.4.2: Allow users to log out.
* **F1.5 (Fan): Minute Purchase:**
    * REQ1.5.1: Provide options (e.g., buttons) on the account page to purchase predefined minute packs (e.g., 10, 30 minutes).
    * REQ1.5.2: Integrate with Stripe Checkout for secure payment processing.
    * REQ1.5.3: Redirect user to Stripe Checkout page upon selecting a minute pack.
    * REQ1.5.4: Update user's minute balance automatically upon successful payment confirmation (via Stripe webhook).
* **F1.6 (Fan): PSTN Call Initiation:**
    * REQ1.6.1: Provide a "Call Me Now" button on the account page, enabled only if `available_minutes > 0`.
    * REQ1.6.2: Clicking the button triggers a backend process to initiate a PSTN call connecting the user's verified phone number to the relevant influencer's Vapi AI assistant via Twilio.
    * REQ1.6.3: Provide visual feedback to the user that the call is being initiated.
* **F1.7 (Backend): Minute Deduction:**
    * REQ1.7.1: Accurately track the duration of completed PSTN calls (via Twilio webhooks).
    * REQ1.7.2: Deduct the appropriate number of minutes (rounded up) from the user's balance upon call completion.
* **F1.8 (Admin): Manual Setup:**
    * REQ1.8.1: Allow admin to manually add/configure influencer profiles and Vapi Assistant IDs via Supabase Studio.

### Phase 2: Influencer Onboarding & Basic Admin UI

* **F2.1 (Influencer):** Application page and submission form.
* **F2.2 (Admin):** Basic web UI to review and approve/reject applications.
* **F2.3 (Influencer):** Account creation via secure email link.
* **F2.4 (Influencer):** Basic dashboard to upload audio/photos.
* **F2.5 (Admin):** Basic web UI to view influencer/fan lists.

### Phase 3: AI Automation & Payouts

* **F3.1 (Influencer):** AI Personality Interview feature.
* **F3.2 (Backend):** Automated pipeline for voice cloning and Vapi configuration.
* **F3.3 (Influencer):** Dashboard displays usage stats/earnings estimates.
* **F3.4 (Influencer):** Stripe Connect integration for payout setup.
* **F3.5 (Admin):** Enhanced admin panel for financial reporting and payout management.

### Phase 4: Polish & Advanced Features

* **F4.1 (Fan):** Auto-top-up feature.
* **F4.2 (Influencer):** Affiliate program.
* **F4.3 (Admin):** Promo code system.

## 5. Design & UI/UX

* **Theme:** Light, modern, clean.
* **Primary Color (CTA):** Bright Pink (`#ED1A90`)
* **Accent Color:** Bright Blue (`#4989F5`)
* **Layout:** Responsive (Mobile, Tablet, Desktop).
* **Key Elements:** High-quality influencer imagery, clear typography, intuitive navigation, prominent call-to-action buttons.
* *(Link to Figma/Design Mockups - Placeholder)*

## 6. Functional Requirements (MVP Summary)

* Users must be able to initiate a 2-min demo call.
* Users must be able to sign up with email/password and verified phone number.
* Users must be able to log in.
* Users must be able to purchase minutes via Stripe Checkout.
* Users must be able to see their available minute balance.
* Users must be able to initiate a PSTN call if they have minutes > 0.
* Backend must accurately deduct minutes after completed PSTN calls.
* System must handle basic errors gracefully (e.g., payment failure, call connection issues).

## 7. Non-Functional Requirements (MVP Focus)

* **Performance:** Landing page load time < 3 seconds. API response times < 500ms (p95).
* **Scalability:** MVP infrastructure (Supabase, Vercel, Twilio) should handle initial user load (e.g., 100s of concurrent users, dozens of concurrent calls - verify provider limits).
* **Reliability:** Core services (Auth, DB, Call Initiation, Payment Webhooks) should have high availability. Aim for >99.5% uptime.
* **Security:** Protect user data (PII, payment info handled by Stripe), prevent unauthorized access, secure API keys, implement webhook signature verification.
* **Usability:** Core fan flow should be intuitive and require minimal instruction.

## 8. Success Metrics (MVP)

* Number of unique visitors to landing pages.
* Demo call initiation rate (% of visitors clicking "Talk Now").
* Demo call completion rate.
* Signup conversion rate (% of demo users signing up).
* Minute purchase conversion rate (% of registered users buying minutes).
* Average number of minutes purchased per user.
* PSTN call initiation rate (% of users with minutes clicking "Call Me Now").
* Average PSTN call duration.
* User retention rate (e.g., % users returning after 1 week).
* Qualitative feedback from user surveys/interviews.
* Error rates (frontend/backend).
* API response times & uptime.
