# Backend Architecture: Fancrush - Talkline

**Version:** 1.0 (Phase 1 - MVP Focus)
**Date:** 2025-04-03

## 1. Overview

The backend provides the core services for user management, data storage, payment processing, call initiation logic, and communication with third-party APIs. For Phase 1 (MVP), it relies heavily on Supabase for BaaS capabilities and Next.js API Routes (Route Handlers) for custom server-side logic.

## 2. Technology Stack

* **Backend-as-a-Service (BaaS):** Supabase
    * **Database:** Supabase PostgreSQL
    * **Authentication:** Supabase Auth (Email/Password, Phone Verification)
    * **Storage:** Supabase Storage (Used in Phase 2+ for influencer assets)
* **API Framework:** Next.js API Routes (Route Handlers) hosted within the Next.js application.
* **PSTN Calling:** Twilio (Programmable Voice API, Verify API for OTP - optional)
* **Payments:** Stripe (Stripe API, Stripe Checkout)
* **Language:** TypeScript

## 3. Data Models (Supabase PostgreSQL - MVP Schema)

* **`users`:** Managed by Supabase Auth. Contains `id`, `email`, `phone`, etc.
* **`profiles`:** Extends `users` table (one-to-one relation via `id` FK to `auth.users`).
    * `id` (uuid, FK, PK)
    * `updated_at` (timestamp)
    * `available_minutes` (integer, default: 0)
    * `phone_number` (text, nullable) - *User's verified phone number*
    * `phone_verified` (boolean, default: false)
    * `stripe_customer_id` (text, nullable) - *For linking to Stripe payments*
* **`influencers`:** Stores data about each influencer (manually populated in MVP).
    * `id` (uuid, PK)
    * `created_at` (timestamp)
    * `name` (text)
    * `slug` (text, unique) - *Used in URLs*
    * `profile_image_url` (text, nullable)
    * `landing_page_image_urls` (text[], nullable) - *Array of image URLs*
    * `greeting_copy` (text, nullable) - *Text for landing page*
    * `vapi_assistant_id` (text, nullable) - *ID of the corresponding Vapi AI Assistant*
* **`call_logs`:** Records details of each call attempt.
    * `id` (uuid, PK)
    * `user_id` (uuid, FK to `auth.users.id`)
    * `influencer_id` (uuid, FK to `influencers.id`)
    * `call_type` (enum: 'web_demo', 'pstn')
    * `platform_call_sid` (text, nullable) - *SID from Twilio/Vapi*
    * `start_time` (timestamp)
    * `end_time` (timestamp, nullable)
    * `duration_seconds` (integer, nullable) - *Actual billed duration*
    * `minutes_deducted` (integer, nullable) - *Minutes removed from user balance*
    * `status` (text: 'initiated', 'answered', 'completed', 'failed', 'busy', 'no-answer')
* **`transactions`:** Records successful minute purchases.
    * `id` (uuid, PK)
    * `user_id` (uuid, FK to `auth.users.id`)
    * `stripe_charge_id` (text, unique, nullable) - *From Stripe payment intent/charge*
    * `amount_paid_cents` (integer)
    * `currency` (text, e.g., 'usd')
    * `minutes_purchased` (integer)
    * `created_at` (timestamp)

*(Schema will expand in later phases for influencer applications, payouts, etc.)*

## 4. API Endpoints (Next.js API Routes - MVP)

Authentication (JWT from Supabase Auth) is required for protected routes. Server-side Supabase client needed for accessing user data securely.

* **`POST /api/stripe/create-checkout`:**
    * *Input:* `{ priceId: string, quantity: number (usually 1) }`
    * *Auth:* Required (User must be logged in).
    * *Action:* Creates a Stripe Checkout session for the specified Price ID. Associates the session with the authenticated `user_id` and potentially creates/uses `stripe_customer_id`. Includes `cancel_url` and `success_url` pointing back to the application. Returns the Checkout Session URL/ID.
* **`POST /api/webhooks/stripe`:**
    * *Input:* Stripe Event Object (Webhook).
    * *Auth:* None (Verified via Stripe signature).
    * *Action:* Handles `checkout.session.completed` events. Verifies signature. Retrieves `user_id` from session metadata. Updates the corresponding user's `available_minutes` in the `profiles` table (atomic increment). Creates a record in the `transactions` table. Returns 200 OK to Stripe. Needs robust error handling and idempotency checks (e.g., checking `stripe_charge_id` in `transactions`).
* **`POST /api/calls/initiate-pstn`:**
    * *Input:* `{ influencerId: string }` (Passed in request body).
    * *Auth:* Required.
    * *Action:*
        1.  Verify user authentication (get user ID from Supabase session).
        2.  Retrieve user's profile (`available_minutes`, `phone_number`, `phone_verified`) from DB using user ID.
        3.  Check if `available_minutes > 0` and `phone_verified == true`. Return 400 error if not.
        4.  Retrieve target influencer's `vapi_assistant_id` from DB using `influencerId`. Return 404 if not found.
        5.  Use Twilio API client (initialized with Account SID/Auth Token):
            * Initiate call to user's `phone_number`. Set status callback URL to `/api/webhooks/call-status`. Pass `userId` and `influencerId` as custom parameters if possible, or associate the `CallSid` later.
            * On user answer (via webhook or TwiML), use TwiML `<Dial>` verb to connect to the Vapi Assistant SIP endpoint (or other connection method provided by Vapi for PSTN). Ensure Vapi endpoint receives necessary context if required.
            * Alternatively, create two call legs and bridge them using Twilio Conference or `<Dial><Sip>` / `<Dial><Number>`.
        6.  Log the initiation attempt in `call_logs` with status 'initiated' and the `platform_call_sid`.
        7.  Return success (e.g., 200 OK) or failure (e.g., 500 Internal Server Error, 402 Payment Required if minutes check fails) status to the frontend.
* **`POST /api/webhooks/call-status`:**
    * *Input:* Twilio Call Status Callback Webhook Payload (includes `CallSid`, `CallStatus`, `CallDuration` on completion).
    * *Auth:* None (Recommended: Verify Twilio signature).
    * *Action:* Handles call status updates.
        1.  Identify the call via `CallSid`. Retrieve associated `userId` and `influencerId` (from `call_logs` or custom parameters).
        2.  Update the `call_logs` record with the current `CallStatus`.
        3.  On `completed` status:
            * Get `CallDuration` (in seconds).
            * Calculate `minutes_deducted` (e.g., `Math.ceil(CallDuration / 60)`).
            * Atomically decrement `available_minutes` in the user's `profiles` record by `minutes_deducted`. Handle potential race conditions or insufficient funds during the call (though initial check should prevent most).
            * Update the `call_logs` record with final status, `duration_seconds`, and `minutes_deducted`.
        4.  Return TwiML (e.g., `<Response/>`) or 200 OK to Twilio. Needs careful handling of different callback events during the call lifecycle.
* **`POST /api/auth/verify-phone` (Example - If using custom verification):**
    * *Input:* `{ action: 'send' | 'check', phoneNumber?: string, code?: string }`
    * *Auth:* Required.
    * *Action:*
        * If `action: 'send'`: Use Twilio Verify API (or Supabase Auth) to send an OTP code to the provided `phoneNumber`. Store temporary verification request data if needed.
        * If `action: 'check'`: Use Twilio Verify API (or Supabase Auth) to check the provided `code` against the `phoneNumber`. If valid, update the user's `profiles` record: set `phone_number` and `phone_verified = true`.
        * Return success/failure status.

## 5. Authentication & Authorization

* **Authentication:** Handled by Supabase Auth. JWT tokens passed in request headers are verified by backend API routes using Supabase helper libraries.
* **Authorization:**
    * API routes check if a user is authenticated.
    * Logic within routes ensures users can only access/modify their own data (e.g., fetch their profile, initiate calls using their minutes).
    * Role-based access control (Admin vs User vs Influencer) will be implemented in later phases using Supabase custom claims or RLS policies.

## 6. Key Backend Logic

* **Minute Tracking:** Atomic updates to `available_minutes` in the `profiles` table are crucial to prevent race conditions. Handled primarily by Stripe webhook (increment) and Twilio call status webhook (decrement).
* **Call Bridging:** Core logic using Twilio API to connect the user's phone to the Vapi AI endpoint. Requires careful handling of call states and potential failures.
* **Webhook Handling:** Securely verifying and processing asynchronous events from Stripe and Twilio. Requires idempotency and robust error logging.
