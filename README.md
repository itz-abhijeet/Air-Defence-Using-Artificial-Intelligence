# S-EYE (Sudarshan Eye)
*Advanced AI-Enabled Air Defense Interface*

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Python](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss)

## Project Overview

**S-EYE (Sudarshan Eye)** is a sophisticated, real-time air defense command center dashboard that combines modern web technologies with AI-powered threat detection capabilities. The name symbolizes the all-seeing eye of defense, providing comprehensive situational awareness.

This high-fidelity military-themed interface provides defense personnel with real-time radar tracking, AI-powered aircraft identification, and integrated security protocols through an immersive tactical dark UI.

## Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite 7** - Next-generation build tool
- **Tailwind CSS 4** - Utility-first CSS framework
- **Leaflet.js** - Interactive mapping library
- **Chart.js** - Data visualization
- **Socket.io Client** - Real-time communication

### Backend
- **Python 3.12+** - Server-side runtime
- **FastAPI** - Modern async web framework
- **Socket.io (python-socketio)** - Real-time bidirectional events
- **Uvicorn** - ASGI server

### AI & Integration
- **Azure Custom Vision API** - AI-powered aircraft identification (simulated)
- **Real-time Data Processing** - Live flight tracking and analysis

## Project Structure

```
S-EYE/
├── backend/
│   ├── main.py           # FastAPI + Socket.io server
│   ├── requirements.txt  # Python dependencies
│   └── venv/             # Virtual environment
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginOverlay.jsx  # Biometric auth simulation
│   │   │   ├── Map.jsx           # Leaflet radar map
│   │   │   ├── Sidebar.jsx       # Flight info panel
│   │   │   └── NewsTicker.jsx    # Scrolling news feed
│   │   ├── App.jsx       # Main application
│   │   ├── main.jsx      # React entry point
│   │   └── index.css     # Global styles + Tailwind
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.12+**

### 1. Clone Repository
```bash
git clone https://github.com/itz-abhijeet/Air-Defence-Using-Artificial-Intelligence.git
cd Air-Defence-Using-Artificial-Intelligence
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server (runs on port 3000)
uvicorn main:socket_app --reload --port 3000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server (runs on port 5173)
npm run dev
```

### 4. Access Dashboard
Open browser and navigate to `http://localhost:5173`

## Key Features

- **🎯 Real-time Radar Tracking** - Live visualization of aircraft positions with smooth animations
- **🤖 AI Target Recognition** - Simulated Azure Custom Vision for aircraft identification
- **🔐 Biometric Security** - Immersive fingerprint scanning login simulation
- **🎨 Tactical Interface** - Military-grade dark theme with neon cyan/red accents
- **📰 Live Data Feeds** - Scrolling news ticker and signal density monitoring
- **🗺️ Interactive Map** - Click-to-analyze functionality for threat assessment

## Usage Workflow

1. **Authentication** - Biometric scan simulation (~4.5 seconds)
2. **Dashboard Access** - Main interface loads with live radar display
3. **Target Tracking** - Aircraft appear as real-time blips on the map
4. **Threat Analysis** - Click any aircraft marker to initiate AI analysis
5. **Results Display** - View aircraft type, confidence level, and threat status
6. **Continuous Monitoring** - Real-time socket updates maintain awareness

## Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server with HMR
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Development
```bash
cd backend
uvicorn main:socket_app --reload --port 3000
```

## License

ISC License

## Author

**Abhijeet** - [GitHub](https://github.com/itz-abhijeet)
