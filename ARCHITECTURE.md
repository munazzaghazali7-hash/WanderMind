# WanderMind Architecture

## Tech Stack
-   **Frontend**: React 19, Vite, TypeScript
-   **Styling**: Tailwind CSS 4 (Vanilla CSS philosophy)
-   **State Management**: Zustand (Client-side persistent session)
-   **AI Engine**: Google Gemini API (via `@google/generative-ai`)
-   **Maps**: Google Maps API (via `@vis.gl/react-google-maps`)
-   **Testing**: Vitest, React Testing Library
-   **Deployment**: Google Cloud Run (Dockerized)

## Design Patterns
1.  **Service-Oriented Logic**: AI generation logic is encapsulated in `src/services/gemini.ts`, allowing for easy swapping of models or mock data.
2.  **Atomic Components**: UI is broken down into small, reusable components in `src/components`, separating the Onboarding flow from the Dashboard.
3.  **Utility-First Helpers**: Complex calculations (like budget tracking) are extracted into pure utility functions for maximum testability.
4.  **Observer Pattern**: Zustand provides a reactive state that allows the Dashboard to update in real-time as criteria or itineraries change.

## Security Considerations
-   **API Key Management**: Sensitive keys are handled via Vite environment variables.
-   **Input Sanitization**: AI-generated content is treated as untrusted and parsed carefully via JSON schemas.
-   **No Backend**: By eliminating the backend, we remove entire classes of server-side vulnerabilities (SQLi, SSRF, etc.) and ensure zero user data persistence.

## Accessibility (A11y)
-   Semantic HTML structure.
-   ARIA labels for interactive elements.
-   Keyboard-friendly navigation.
-   Responsive design for all device types.
