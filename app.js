const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Mock Azure Custom Vision API Endpoint
app.get('/api/analyze', (req, res) => {
    // Simulated random response
    const threats = ['Rafale', 'Su-30MKI', 'J-20', 'F-16', 'Mirage 2000'];
    const selectedThreat = threats[Math.floor(Math.random() * threats.length)];
    const confidence = (Math.random() * (99.9 - 85.0) + 85.0).toFixed(2);

    // Simulate processing delay
    setTimeout(() => {
        res.json({
            tagName: selectedThreat,
            probability: confidence,
            boundingBox: {
                left: Math.random() * 0.5,
                top: Math.random() * 0.5,
                width: 0.4,
                height: 0.3
            }
        });
    }, 1500);
});

// Basic route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Simulated Flight Data Generator (Stateful)
let flights = [];

function initFlights() {
    const numFlights = 5 + Math.floor(Math.random() * 5); // 5-10 flights
    for (let i = 0; i < numFlights; i++) {
        const isFriend = Math.random() > 0.3; // 70% friendly
        flights.push({
            id: `FLT-${1000 + i}`,
            lat: 15 + Math.random() * 10, // Approx Central India
            lng: 75 + Math.random() * 10,
            bearing: Math.floor(Math.random() * 360),
            speed: 0.05 + Math.random() * 0.05, // Speed in degrees per update (simulated knot speed conversion)
            isFriend: isFriend,
            type: isFriend ? 'FRIENDLY' : 'UNKNOWN/THREAT'
        });
    }
}

function updateFlightData() {
    if (flights.length === 0) initFlights();

    flights.forEach(flight => {
        // Move flight based on bearing and speed
        const rad = flight.bearing * (Math.PI / 180);
        flight.lat += flight.speed * Math.cos(rad);
        flight.lng += flight.speed * Math.sin(rad);

        // Simple boundary check (bounce off edges of India-ish box)
        if (flight.lat < 8 || flight.lat > 32) {
            flight.bearing = 180 - flight.bearing;
        }
        if (flight.lng < 68 || flight.lng > 88) {
            flight.bearing = 360 - flight.bearing;
        }

        // Normalize bearing
        flight.bearing = (flight.bearing + 360) % 360;

        // Small random course correction for realism
        flight.bearing += (Math.random() - 0.5) * 10;
    });

    return flights;
}

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected');

    // Send initial data
    if (flights.length === 0) initFlights();
    socket.emit('flightData', flights);

    // Send updates every 1 second (faster for smoother look)
    const interval = setInterval(() => {
        socket.emit('flightData', updateFlightData());
    }, 1000);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
