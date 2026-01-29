import socketio
import asyncio
import random
import math
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI and Socket.IO
app = FastAPI()
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
socket_app = socketio.ASGIApp(sio, app)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Flight Simulation State
flights = []

def init_flights():
    """Initialize random flights."""
    global flights
    flights = []
    num_flights = 5 + random.randint(0, 5)  # 5-10 flights
    for i in range(num_flights):
        is_friend = random.random() > 0.3  # 70% friendly
        flights.append({
            "id": f"FLT-{1000 + i}",
            "lat": 15 + random.random() * 10,  # Approx Central India
            "lng": 75 + random.random() * 10,
            "bearing": random.randint(0, 360),
            "speed": 0.05 + random.random() * 0.05,
            "isFriend": is_friend,
            "type": "FRIENDLY" if is_friend else "UNKNOWN/THREAT"
        })

def update_flights():
    """Update flight positions."""
    global flights
    if not flights:
        init_flights()

    for flight in flights:
        # Move flight based on bearing and speed
        rad = math.radians(flight["bearing"])
        flight["lat"] += flight["speed"] * math.cos(rad)
        flight["lng"] += flight["speed"] * math.sin(rad)

        # Boundary check (bounce)
        if flight["lat"] < 8 or flight["lat"] > 32:
            flight["bearing"] = 180 - flight["bearing"]
        if flight["lng"] < 68 or flight["lng"] > 88:
            flight["bearing"] = 360 - flight["bearing"]

        # Normalize bearing
        flight["bearing"] = (flight["bearing"] + 360) % 360

        # Small random course correction
        flight["bearing"] += (random.random() - 0.5) * 10

    return flights

# Background Task for Flight Updates
async def broadcast_flight_data():
    """Emit flight updates every 1 second."""
    while True:
        if not flights:
            init_flights()
        data = update_flights()
        await sio.emit('flightData', data)
        await asyncio.sleep(1)

@app.on_event("startup")
async def startup_event():
    # Start background task
    asyncio.create_task(broadcast_flight_data())

# REST API Endpoints
@app.get("/api/analyze")
async def analyze_target():
    """Simulate Azure Custom Vision Analysis."""
    await asyncio.sleep(1.5)  # Simulate processing delay
    
    threats = ['Rafale', 'Su-30MKI', 'J-20', 'F-16', 'Mirage 2000']
    selected_threat = random.choice(threats)
    confidence = round(random.uniform(85.0, 99.9), 2)
    
    return {
        "tagName": selected_threat,
        "probability": str(confidence),
        "boundingBox": {
            "left": random.random() * 0.5,
            "top": random.random() * 0.5,
            "width": 0.4,
            "height": 0.3
        }
    }

@app.get("/")
async def root():
    return {"message": "S-EYE Backend Operational"}

# Socket.IO Events
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    if not flights:
        init_flights()
    await sio.emit('flightData', flights, room=sid)

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

if __name__ == "__main__":
    uvicorn.run("main:socket_app", host="0.0.0.0", port=3000, reload=True)
