# S-EYE: Advanced AI-Enabled Air Defense Interface

## Imagine Cup Prototype
**Team:** [Your Team Name]
**Project:** S-EYE (Sudarshan-EYE)

A high-fidelity, military-themed command center dashboard built with Node.js, Socket.io, and simulated Azure AI integration.

## Features
*   **Tactical Dark UI:** Immersive interface with neon accents and radar animations.
*   **Real-time Radar:** Live tracking of simulated aircraft using Leaflet.js.
*   **AI Target Recognition:** Mock Azure Custom Vision integration to identify aircraft.
*   **Biometric Security:** Simulated retinal scan login sequence.
*   **Live Feeds:** Scrolling geopolitical news ticker and real-time signal density charts.

## Installation

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Server:**
    ```bash
    node app.js
    ```
    *   Server will start on `http://localhost:3000` (or the port defined in `PORT`).

3.  **Access Dashboard:**
    *   Open your browser and navigate to `http://localhost:3000`.

## Imagine Cup Demo Tips

1.  **Full Screen Mode:** Press `F11` in your browser for the full immersive experience.
2.  **The "Azure" Hook:** During the demo, explain that the "Target Recognition" feature connects to an Azure Custom Vision endpoint trained on thousands of military aircraft images. The current prototype mocks this response for reliability during the presentation.
3.  **Real-time Data:** The aircraft blips are simulated to ensure a busy airspace during the short demo window, avoiding reliance on rate-limited public APIs.
4.  **Security:** The "Biometric Login" at the start sets the mood. Let it play out before starting your pitch.

## Tech Stack
*   **Backend:** Node.js, Express, Socket.io
*   **Frontend:** HTML5, Tailwind CSS, Leaflet.js, Chart.js
*   **AI:** Azure Custom Vision (Simulated Integration)
