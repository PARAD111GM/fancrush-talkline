# Fancrush - Talkline

A Next.js application that enables fans to have simulated phone conversations with AI-powered digital twins of their favorite online influencers.

## Features

- Free 2-minute demo calls within the browser
- User signup with phone verification
- Minute pack purchases through Stripe
- PSTN calls to talk with AI influencers
- Accurate minute tracking and billing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account (for payments)
- Twilio account (for PSTN calls)
- Vapi.ai account (for AI voice)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/fancrush-talkline.git
cd fancrush-talkline
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Vapi
VAPI_API_KEY=your_vapi_api_key
NEXT_PUBLIC_VAPI_WEB_SDK_KEY=your_vapi_web_sdk_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technology Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth), Next.js API Routes
- **AI Voice:** Vapi.ai
- **PSTN Calls:** Twilio
- **Payments:** Stripe

## Project Structure

- `/app`: Next.js App Router pages and layouts
- `/components`: React components
- `/lib`: Utility functions and service clients
- `/public`: Static assets
- `/supabase`: Supabase configurations and migrations

## License

This project is licensed under the MIT License. 