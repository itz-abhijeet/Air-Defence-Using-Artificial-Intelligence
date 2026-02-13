import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import LoginOverlay from './components/LoginOverlay';
import NewsTicker from './components/NewsTicker';
import Simulator from './components/Simulator';

// Auto-detect backend URL: use env variable or construct from current host
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : `http://10.151.23.7:3000`); // Hardcoded for network access

console.log('🔧 Backend URL:', BACKEND_URL);
console.log('🌐 Hostname:', window.location.hostname);

const socket = io(BACKEND_URL);

function RadarView() {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for flight updates
    socket.on('flightData', (data) => {
      setFlights(data);

      // Update selected flight data if it exists
      if (selectedFlight) {
        const updated = data.find(f => f.id === selectedFlight.id);
        if (updated) setSelectedFlight(updated);
      }
    });

    return () => {
      socket.off('flightData');
    };
  }, [selectedFlight]);

  const handleFlightClick = (flight) => {
    setSelectedFlight(flight);
  };

  return (
    <div className="h-screen w-screen bg-tactical-dark text-white font-mono flex flex-col overflow-hidden relative">
      <div className="flex flex-grow relative z-0 h-full">
        <Sidebar selectedFlight={selectedFlight} />

        <div className="flex-grow h-full relative bg-black">
          <Map flights={flights} onFlightClick={handleFlightClick} />

          {/* Top Right Info */}
          <div className="absolute top-4 right-4 z-[400] bg-black bg-opacity-70 p-2 border border-tactical-cyan text-right pointer-events-none">
            <div className="text-tactical-cyan text-xl font-bold">DEFCON 4</div>
            <div className="text-xs text-gray-400">ENCRYPTION: AES-256</div>
            <div className="text-xs text-green-500">SYSTEM ONLINE</div>
          </div>

          {/* Simulator Button */}
          <div className="absolute top-4 left-4 z-[400]">
            <button
              onClick={() => navigate('/simulator')}
              className="px-4 py-2 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors border border-red-400"
            >
              🚀 SIMULATOR
            </button>
          </div>
        </div>
      </div>

      <NewsTicker />
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="h-screen w-screen bg-tactical-dark text-white font-mono">
        {!isLoggedIn && <LoginOverlay onLogin={() => setIsLoggedIn(true)} />}

        <Routes>
          <Route path="/" element={<RadarView />} />
          <Route path="/simulator" element={<Simulator socket={socket} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
