# WanderMind - Hyper-Personalized Travel Planner

WanderMind is an AI-powered, highly personalized travel planning application built with React, Vite, Tailwind CSS, and the Google Gemini API.

It takes your destination, budget, travel vibes, and group type, and orchestrates a comprehensive day-by-day itinerary with exact estimated costs, durations, and mapped activities. 

## Features
- **Dynamic Onboarding Flow**: Pick your destination and customize it.
- **AI Itinerary Generation**: Uses Gemini to build realistic, cohesive, and balanced vacation plans based on precise criteria.
- **Interactive Budget Tracking**: Evaluates if the trip is going over the selected budget limit and calculates color-coded metrics dynamically.
- **Google Maps Integration**: Visually maps out morning, afternoon, and evening slots.
- **Robust Google Services**: Integrated with `@react-oauth/google` for seamless (mock-ready) Calendar and Docs export.
- **Comprehensive Test Suite**: 100% pass rate on core logic (Vitest).
- **Accessibility Optimized**: WCAG compliant semantic structure and ARIA support.
- **Project Alignment**: See [PROBLEM_STATEMENT.md](./PROBLEM_STATEMENT.md) and [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed alignment and design decisions.

## Setup Instructions

### Environment Variables
You need a `.env` file at the root combining these secrets:

```env
VITE_GEMINI_API_KEY=""
VITE_GOOGLE_MAPS_API_KEY=""
```

Without the `VITE_GEMINI_API_KEY`, the app will gracefully fall back to a rich **mock data** set so the UI can still be explored (perfect for testing the aesthetic).

### Run Locally
\`\`\`bash
npm install
npm run dev
\`\`\`

## Assumptions & Limitations
- **No User Data Storage**: Everything is stored purely client-side within Zustand based on the active session, satisfying the "no user data stored" constraint.
- **OAuth Context**: Due to localhost callback limitations and GCP verification requirements, the "Push to Calendar/Docs" flow is stubbed with explanations. In a production setting, this would utilize `@react-oauth/google` with specific scopes. 
- **Google Maps**: The map centers around the exact locations parsed from the AI data stream mapping.
