# User Flows: Fancrush - Talkline

**Version:** 1.0 (Phase 1 - MVP Focus)
**Date:** 2025-04-03

This document outlines the primary user flows for fans (MVP) and influencers (Phase 2+).

## 1. Fan User Flow (MVP)

This flow describes the journey of a fan interacting with the platform for the first time.

1.  **Discovery:** Fan sees a link to `fancrush.com/[influencer-slug]` on the influencer's social media profile (LinkTree, bio, etc.) and clicks it.
2.  **Landing Page:** Fan arrives at the specific influencer's landing page.
    * Sees influencer's name, images, greeting message.
    * Sees "Talk Now (2 min Demo)" button.
3.  **Initiate Demo Call:** Fan clicks "Talk Now".
    * UI shows loading/connecting state.
    * Vapi Web SDK initiates call in the browser.
    * UI updates to show call timer and "End Call" button.
    * Fan talks with the AI for up to 2 minutes.
4.  **Demo Call Ends:**
    * **Scenario A (Timeout):** 2-minute timer expires. Call automatically stops.
    * **Scenario B (Manual End):** Fan clicks "End Call".
    * **Result:** A modal dialog appears prompting the user to "Sign Up" or "Login" to continue talking.
5.  **Signup:** Fan clicks "Sign Up".
    * Redirected to `/signup` page.
    * Enters Email, Password, Phone Number.
    * Receives OTP via SMS (or chosen method).
    * Enters OTP code to verify phone number.
    * Account created. Redirected to `/account` page.
6.  **Login:** Fan clicks "Login".
    * Redirected to `/login` page.
    * Enters Email and Password.
    * Logged in. Redirected to `/account` page.
7.  **Account Page (First View):**
    * Sees `Available Minutes: 0`.
    * Sees options to "Buy Minutes" (e.g., +10 min, +30 min buttons).
    * Sees "Call Me Now" button (likely disabled as minutes are 0).
8.  **Purchase Minutes:** Fan clicks a "Buy Minutes" button (e.g., "+10 min for $X.XX").
    * Frontend calls backend (`/api/stripe/create-checkout`).
    * User is redirected to Stripe Checkout page.
    * User enters payment details and completes purchase on Stripe.
    * User is redirected back to a success page or the `/account` page within the app.
    * *Meanwhile:* Stripe sends `checkout.session.completed` webhook to `/api/webhooks/stripe`. Backend verifies and updates user's `available_minutes`.
9.  **Account Page (After Purchase):**
    * User navigates back or refreshes the `/account` page.
    * Sees `Available Minutes: 10` (or purchased amount).
    * "Call Me Now" button is now enabled.
10. **Initiate PSTN Call:** Fan clicks "Call Me Now".
    * Frontend calls backend (`/api/calls/initiate-pstn`).
    * UI shows loading/initiation state (e.g., "Calling your phone...").
    * Backend uses Twilio to:
        * Call the fan's verified phone number.
        * Connect the fan to the Vapi AI assistant upon answer.
    * Fan receives a call on their actual phone. Answers.
    * Fan talks with the AI influencer.
11. **PSTN Call Ends:**
    * Fan hangs up their phone (or AI ends the call).
    * Twilio sends `completed` webhook to `/api/webhooks/call-status`.
    * Backend calculates duration, deducts minutes from user's profile. Updates call log.
12. **Subsequent Visits:** Logged-in user visits `/account`, sees remaining minutes, can top up or initiate calls if minutes > 0.

## 2. Influencer User Flow (Phase 2 onwards)

This flow describes the journey for an influencer joining the platform.

1.  **Discovery:** Influencer learns about Fancrush - Talkline (marketing, referral).
2.  **Visit Application Page:** Influencer goes to `/for-creators`. Reads value proposition.
3.  **Submit Application:** Clicks "Apply", fills form (name, email, social links). Submits. Sees "Application Received" message.
4.  **Admin Review:** Admin reviews application via Admin Panel. Approves.
5.  **Receive Invite:** Influencer receives approval email with a unique signup link.
6.  **Create Account:** Clicks link, sets password. Account created. Redirected to Influencer Dashboard.
7.  **Onboarding (Dashboard):**
    * Upload required audio files (for voice cloning).
    * Upload required photos (for landing page).
    * Initiate and complete the AI Personality Interview call.
    * Submits assets for review/processing. Sees "Pending AI Creation" status.
8.  **AI Twin Creation:** Backend/Admin process runs (voice cloning, personality config, Vapi setup). Admin marks as "Active".
9.  **Activation:** Influencer receives "Your Talkline is Live!" email.
10. **Active Dashboard:** Logs in.
    * Sees shareable link to their landing page.
    * Views usage stats/earnings.
    * Enters payout information (Stripe Connect onboarding).
    * Manages basic settings.
