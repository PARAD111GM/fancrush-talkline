# Frontend Architecture: Fancrush - Talkline

**Version:** 1.0 (Phase 1 - MVP Focus)
**Date:** 2025-04-03

## 1. Overview

The frontend provides the user interface for fans to discover influencers, interact with the AI demo, manage their accounts, purchase minutes, and initiate paid calls. It's built as a responsive web application optimized for both desktop and mobile browsers.

## 2. Technology Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **UI Library:** React
* **Styling:** Tailwind CSS
* **Component Library:** shadcn/ui (built on Radix UI & Tailwind)
* **Icons:** lucide-react
* **AI Web Call SDK:** Vapi.ai Web SDK (`@vapi-ai/web`)
* **State Management:** Primarily React built-in hooks (`useState`, `useEffect`, `useContext`, `useRef`). Global state management library (like Zustand or Jotai) might be considered later if complexity increases significantly.
* **Data Fetching:** Next.js server components for initial load, React Query (`@tanstack/react-query`) or SWR for client-side data fetching, caching, and mutations (recommended for API interactions from client components). Supabase client library (`@supabase/ssr`, `@supabase/supabase-js`) for direct interaction.

## 3. Project Structure (App Router)

/├── app/│   ├── (auth)/             # Route group for auth pages (login, signup)│   ├── (main)/             # Route group for main app pages requiring auth (account)│   ├── [influencer-slug]/  # Dynamic route for influencer landing pages│   │   ├── page.tsx            # Server Component (fetches data)│   │   └── InfluencerClientPage.tsx # Client Component (Vapi interaction, UI state)│   ├── api/                  # API Routes (Backend logic)│   ├── layout.tsx          # Root layout (providers, base styles)│   └── page.tsx            # Optional root page (e.g., marketing/redirect)├── components/│   ├── ui/                 # shadcn/ui components (auto-generated)│   └── shared/             # Custom shared components (Header, Footer, CallButton, MinuteDisplay)├── lib/                    # Utility functions, constants, client initializations│   ├── supabase/           # Supabase client helpers (server, browser)│   ├── stripe.ts           # Stripe client helpers (browser - for Checkout redirect)│   ├── vapi.ts             # Vapi related helpers/hooks│   └── utils.ts            # General utility functions├── public/                 # Static assets├── styles/                 # Global styles├── .env.local              # Environment variables└── ...                     # Config files (package.json, tsconfig.json, etc.)
## 4. Key Pages/Views (MVP)

* **Influencer Landing Page (`/[influencer-slug]`):**
    * Displays influencer details (name, images, greeting).
    * Features the "Talk Now" button initiating the Vapi web demo.
    * Shows call status/timer during the demo.
    * Includes secondary CTA to signup/login.
    * Displays fine print about AI simulation.
* **Signup Page (`/signup`):**
    * Form for email, password, and phone number input.
    * Includes phone number verification step (OTP input).
    * Uses Supabase Auth UI components or custom forms interacting with Supabase Auth JS library.
* **Login Page (`/login`):**
    * Form for email/password login.
    * Uses Supabase Auth UI components or custom forms.
* **Account Page (`/account`):**
    * Protected route, requires login.
    * Displays user's `available_minutes`.
    * Provides buttons/options to purchase minute packs (triggers Stripe Checkout).
    * Features the "Call Me Now" button to initiate PSTN calls (calls backend API).
    * Includes logout functionality.
* **Stripe Checkout/Portal:** External pages hosted by Stripe for payment processing. Redirects back to the app on success/cancellation.

## 5. UI/UX Principles

* **Modern & Clean:** Simple, intuitive interface using shadcn/ui components.
* **Visually Engaging:** Focus on influencer imagery on landing pages.
* **Mobile-First Responsive:** Design should adapt gracefully to various screen sizes.
* **Clear CTAs:** Primary actions (Talk Now, Call Me Now, Buy Minutes) should be prominent using the defined brand colors (Pink `#ED1A90`, Blue `#4989F5`).
* **Feedback:** Provide clear loading states (spinners) and feedback messages (toasts, alerts) for asynchronous operations (API calls, Vapi connection).
* **Accessibility:** Adhere to basic accessibility standards (semantic HTML, keyboard navigation, contrast).

## 6. Core Frontend Interactions

* **Vapi Web Demo Call:**
    * Client-side component initializes Vapi SDK (`@vapi-ai/web`).
    * Button click triggers `vapi.start(assistantId)`.
    * Vapi event listeners update UI state (connecting, talking, timer, error).
    * Timeout logic enforces 2-minute limit, triggers stop and displays signup modal (shadcn Dialog).
* **Authentication:**
    * Forms use Supabase JS client (`supabase.auth.signUp`, `supabase.auth.signInWithPassword`, `supabase.auth.verifyOtp`).
    * Auth state managed via Supabase Auth helpers, potentially using React Context for easy access across components.
* **Minute Purchase:**
    * Buttons on Account page trigger API call to `/api/stripe/create-checkout`.
    * On success, frontend receives Stripe Checkout session URL/ID and redirects the user to Stripe using `@stripe/stripe-js`.
* **PSTN Call Initiation:**
    * "Call Me Now" button triggers API call to `/api/calls/initiate-pstn`.
    * Frontend displays loading state while backend initiates the call.
    * Shows success/error message based on API response. (The actual call happens on the user's phone, not in the browser).
* **Data Display:** Fetching and displaying user minutes, influencer details using appropriate data fetching strategy (server components for initial load, client-side fetching for dynamic updates).
