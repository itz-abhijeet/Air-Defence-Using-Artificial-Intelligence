# Jyoti Chaksu
*Advanced AI-Enabled Air Defense Interface*

## Project Overview

**Jyoti Chaksu** is a sophisticated, real-time air defense command center dashboard that combines modern web technologies with AI-powered threat detection capabilities. The name "Jyoti Chaksu" translates to "Light Eye" in Sanskrit, symbolizing the system's ability to illuminate and identify aerial threats with precision and clarity.

This high-fidelity military-themed interface provides defense personnel with comprehensive situational awareness through real-time radar tracking, AI-powered aircraft identification, and integrated security protocols. The system simulates a professional-grade command center environment with tactical dark UI elements and immersive radar animations.

## Tech Stack

### Backend Technologies
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **HTTP Server** - Built-in Node.js HTTP server

### Frontend Technologies
- **HTML5** - Modern markup language
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (ES6+)** - Client-side scripting
- **Leaflet.js** - Interactive mapping library
- **Chart.js** - Data visualization library

### AI & Integration
- **Azure Custom Vision API** - AI-powered aircraft identification (simulated)
- **Real-time Data Processing** - Live flight tracking and analysis

### Development Tools
- **NPM** - Package management
- **Git** - Version control

## Project Workflow & Information

### System Architecture

1. **Server Layer (app.js)**
   - Express server handles HTTP requests and static file serving
   - Socket.io manages real-time communication between server and clients
   - Mock API endpoints simulate Azure Custom Vision integration
   - Flight data generator creates realistic aircraft movement patterns

2. **Client Layer (Frontend)**
   - Interactive map interface using Leaflet.js for geographical visualization
   - Real-time chart updates showing signal density patterns
   - Biometric authentication simulation for security
   - Terminal-style logging for system feedback

3. **Data Flow**
   - Server generates simulated flight data with realistic movement patterns
   - Socket.io broadcasts updates to connected clients every second
   - Client receives data and updates map markers in real-time
   - User interactions trigger AI analysis requests to mock API endpoints

### Key Features

- **Real-time Radar Tracking**: Live visualization of aircraft positions with smooth movement animations
- **AI Target Recognition**: Simulated Azure Custom Vision integration for aircraft identification
- **Biometric Security**: Immersive login sequence with fingerprint scanning simulation
- **Tactical Interface**: Military-grade dark theme with neon accents and radar sweep animations
- **Live Data Feeds**: Scrolling news ticker and real-time signal density monitoring
- **Interactive Map**: Click-to-analyze functionality for detailed threat assessment

### Installation & Setup

1. **Clone Repository**
   ```bash
   git clone [repository-url]
   cd jyoti-chaksu
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Application**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:3000`

4. **Access Dashboard**
   Open browser and navigate to `http://localhost:3000`

### Usage Workflow

1. **Authentication**: System starts with biometric scan simulation
2. **Dashboard Access**: Main interface loads with live radar display
3. **Target Tracking**: Aircraft appear as real-time blips on the map
4. **Threat Analysis**: Click any aircraft marker to initiate AI analysis
5. **Results Display**: System shows aircraft type, confidence level, and threat assessment
6. **Continuous Monitoring**: Real-time updates maintain situational awareness

### Demo Features

- **Full Screen Mode**: Press F11 for immersive experience
- **Simulated AI**: Mock Azure integration ensures reliable demo performance
- **Dynamic Data**: Realistic aircraft movement patterns for engaging presentations
- **Security Theater**: Biometric login creates professional atmosphere
