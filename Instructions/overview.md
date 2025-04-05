# Project Overview: Fancrush - Talkline

**Version:** 1.0 (Phase 1 - MVP Focus)
**Date:** 2025-04-03

## 1. Introduction

This document provides a high-level overview of the Fancrush - Talkline project. The goal is to create a web application enabling fans to have simulated phone conversations with AI-powered digital twins of their favorite online influencers.

## 2. Goals

* **Primary Goal:** Provide fans with a novel and engaging way to interact with influencers they follow.
* **Secondary Goals:**
    * Create a new revenue stream for online influencers.
    * Build a scalable platform capable of supporting multiple influencers and a large user base.
    * Offer a seamless user experience from discovery to conversation.
* **MVP Goal (Phase 1):** Validate the core fan experience – demo call, signup, purchasing minutes, and initiating paid PSTN (Public Switched Telephone Network) calls with manually onboarded influencers.

## 3. Core Concept

Fans visit a dedicated landing page for a specific influencer, linked from the influencer's social media bio (e.g., LinkTree). They can initiate a short (2-minute) demo call directly in their browser using the Vapi.ai Web SDK. To continue talking, users must sign up, purchase prepaid minute packs via Stripe, and can then initiate longer calls where the system connects their actual phone number to the AI twin via Twilio (or a similar PSTN provider). The AI interaction aims to mimic the influencer's voice and personality, though it's explicitly disclosed as an AI simulation in the fine print/terms.

## 4. Target Audience

* **Primary:** Fans and followers of online influencers (Instagram, TikTok, OnlyFans, etc.) seeking deeper connection or novel interaction.
* **Secondary:** Online influencers looking for new monetization methods and fan engagement tools.

## 5. Project Scope (Phased)

* **Phase 1 (MVP):** Focus on the core fan journey with manually configured influencer profiles and AI twins. Includes landing page, web demo call, user auth, minute purchasing, and PSTN call initiation/bridging. Manual admin via Supabase Studio.
* **Phase 2:** Introduce influencer self-service onboarding (application, asset upload) and a basic web-based admin panel.
* **Phase 3:** Automate AI twin creation (voice cloning, personality extraction), implement influencer payouts (Stripe Connect), and enhance dashboards.
* **Phase 4:** Polish, advanced features (auto-top-up, affiliate program), optimizations.

*(This document focuses primarily on Phase 1)*

## 6. Supporting Documentation Summary

This overview is supported by more detailed documents covering specific aspects of the project:

* **`backend.md`:** Details the backend architecture using Supabase (DB, Auth) and Next.js API Routes, covering data models, API endpoints for calls/payments, and webhook logic using Twilio/Stripe.
* **`frontend.md`:** Describes the Next.js/React frontend, utilizing Tailwind CSS and shadcn/ui for the user interface, focusing on key pages like the influencer landing page and account management, and integrating the Vapi Web SDK.
* **`third-party-libraries.md`:** Lists key external dependencies like Next.js, Supabase, Vapi, Twilio, Stripe, Tailwind CSS, and shadcn/ui, along with their purpose and documentation links.
* **`user-flow.md`:** Outlines the step-by-step journeys for fans (MVP: discovery, demo call, signup, purchase, PSTN call) and future influencer onboarding.
* **`testing-plan.md`:** Defines the testing strategy, including unit, integration, E2E (Playwright/Cypress), and manual testing, focusing on core flows, call quality, and payment reliability.
* **`devops.md`:** Covers the development workflow (Git, CI/CD via GitHub Actions/Vercel), infrastructure hosted on Vercel/Supabase, monitoring, logging, and database migration strategy.
* **`prd.md`:** Formalizes product requirements including goals, target audience, phased feature lists (MVP focus), non-functional requirements (performance, security), and success metrics.
* **`code-documentation.md`:** Sets standards for code comments (TSDoc/JSDoc), README files, conventional commit messages, and overall code clarity.
