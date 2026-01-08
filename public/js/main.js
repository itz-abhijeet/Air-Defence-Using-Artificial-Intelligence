
// Initialize Map
const map = L.map('map', {
    zoomControl: false,
    attributionControl: false
}).setView([20.5937, 78.9629], 5);

// Add Tile Layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Custom Icons
const friendlyIcon = L.divIcon({
    className: 'custom-icon',
    html: '<div style="background-color: #00e5ff; width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 10px #00e5ff;"></div>',
    iconSize: [10, 10]
});

const threatIcon = L.divIcon({
    className: 'custom-icon',
    html: '<div style="background-color: #ff1744; width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 10px #ff1744;" class="blip-pulse"></div>',
    iconSize: [10, 10]
});

// Socket.io Connection
const socket = io();
const markers = {};

socket.on('flightData', (flights) => {
    flights.forEach(flight => {
        const { id, lat, lng, isFriend, type } = flight;

        if (markers[id]) {
            markers[id].setLatLng([lat, lng]);
        } else {
            const icon = isFriend ? friendlyIcon : threatIcon;
            const marker = L.marker([lat, lng], { icon: icon }).addTo(map);

            marker.on('click', () => {
                handleTargetSelection(flight);
            });

            markers[id] = marker;
        }
    });
});

// --- UI Interactivity ---

// Target Selection Logic
function handleTargetSelection(flight) {
    const termLog = document.getElementById('terminal-log');
    const targetImgContainer = document.getElementById('target-image-container');

    // UI Feedback
    termLog.innerHTML += `> TRACKING TARGET: ${flight.id}...<br>`;
    termLog.innerHTML += `> INITIATING AZURE AI SCAN...<br>`;
    termLog.scrollTop = termLog.scrollHeight;

    targetImgContainer.innerHTML = '<span class="text-tactical-cyan animate-pulse">SCANNING...</span>';

    // Call Mock API
    fetch('/api/analyze')
        .then(res => res.json())
        .then(data => {
            // Update Terminal
            termLog.innerHTML += `> IDENTIFIED: ${data.tagName.toUpperCase()}<br>`;
            termLog.innerHTML += `> CONFIDENCE: ${data.probability}%<br>`;
            termLog.innerHTML += `> THREAT LEVEL: ${data.probability > 90 ? 'CRITICAL' : 'HIGH'}<br>`;
            termLog.scrollTop = termLog.scrollHeight;

            // Update Image
            // Using a generic aircraft placeholder for now
            targetImgContainer.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/F-16_Fighting_Falcon.jpg/300px-F-16_Fighting_Falcon.jpg" class="h-full w-full object-cover filter sepia brightness-50 contrast-125">`;
        })
        .catch(err => {
            console.error(err);
            termLog.innerHTML += `> ERROR: CONNECTION LOST<br>`;
        });
}

// Chart.js Initialization
const ctx = document.getElementById('signalChart').getContext('2d');
const signalChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array(20).fill(''),
        datasets: [{
            label: 'Signal Density',
            data: Array(20).fill(0).map(() => Math.random() * 100),
            borderColor: '#00e5ff',
            borderWidth: 1,
            pointRadius: 0,
            fill: true,
            backgroundColor: 'rgba(0, 229, 255, 0.1)'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
            x: { display: false },
            y: { display: false, min: 0, max: 100 }
        },
        plugins: { legend: { display: false } }
    }
});

// Update Chart every 100ms
setInterval(() => {
    const data = signalChart.data.datasets[0].data;
    data.shift();
    data.push(Math.random() * 100);
    signalChart.update();
}, 100);

// News Ticker
const news = [
    "INDIAN AIR FORCE DEPLOYS NEW S-400 SQUADRON TO WESTERN SECTOR",
    "DRDO SUCCESSFULLY TESTS HYPERSONIC MISSILE TECHNOLOGY",
    "UNIDENTIFIED DRONES SPOTTED NEAR BORDER REGION - ALERT LEVEL RAISED",
    "NAVY CONDUCTS JOINT EXERCISES IN INDIAN OCEAN REGION",
    "DEFENSE MINISTRY APPROVES BUDGET FOR AI SURVEILLANCE SYSTEMS"
];

const tickerEl = document.getElementById('news-ticker');
tickerEl.innerHTML = news.join(" +++ ") + " +++ " + news.join(" +++ ");

// Biometric Login Logic
setTimeout(() => {
    const status = document.getElementById('login-status');
    status.innerText = "Subject Identified. Analyzing...";
    status.classList.remove('text-red-500');
    status.classList.add('text-tactical-cyan');

    setTimeout(() => {
        status.innerText = "ACCESS GRANTED";
        status.classList.add('text-green-500');

        setTimeout(() => {
            document.getElementById('login-overlay').style.display = 'none';
        }, 1000);
    }, 1500);
}, 2000);
