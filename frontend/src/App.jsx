import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import LoginOverlay from './components/LoginOverlay';
import NewsTicker from './components/NewsTicker';

// Connect to backend (adjust URL if needed, e.g., for production)
const socket = io('http://localhost:3000');

function App() {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      {!isLoggedIn && <LoginOverlay onLogin={() => setIsLoggedIn(true)} />}

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
        </div>
      </div>

      <NewsTicker />
    </div>
  );
}

export default App;
