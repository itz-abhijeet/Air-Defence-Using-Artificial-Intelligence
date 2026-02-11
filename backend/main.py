import socketio
import asyncio
import random
import math
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

# Request model for aircraft deployment
class AircraftDeployment(BaseModel):
    name: str
    fromLat: float
    fromLng: float
    toLat: float
    toLng: float
    isFriend: bool

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

@app.post("/api/generate-aircraft-params")
async def generate_aircraft_params(deployment: AircraftDeployment):
    """Generate AI-powered aircraft parameters."""
    await asyncio.sleep(0.5)  # Simulate AI processing
    
    # AI-generated aircraft types based on friend/foe status
    friendly_types = ['F-16 Fighting Falcon', 'Su-30MKI', 'Rafale', 'MiG-29', 'Tejas']
    hostile_types = ['J-20 Stealth Fighter', 'Su-57', 'F-35 Lightning', 'Chengdu J-10', 'Unknown Bogey']
    
    aircraft_type = random.choice(friendly_types if deployment.isFriend else hostile_types)
    
    # Calculate distance for ETA
    lat1, lng1 = deployment.fromLat, deployment.fromLng
    lat2, lng2 = deployment.toLat, deployment.toLng
    
    # Haversine distance
    R = 6371  # Earth's radius in km
    dLat = math.radians(lat2 - lat1)
    dLng = math.radians(lng2 - lng1)
    a = (math.sin(dLat / 2) ** 2 + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
         math.sin(dLng / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    
    # Generate realistic parameters
    altitude = random.randint(8000, 12000)  # meters
    velocity = random.randint(800, 1200)  # km/h
    speed = 0.03 + random.random() * 0.07  # map units per update
    
    # Calculate ETA
    eta_hours = distance / velocity
    eta_minutes = int(eta_hours * 60)
    
    fuel_level = random.randint(60, 95)
    weapon_status = "ARMED" if not deployment.isFriend else random.choice(["ARMED", "TRAINING", "PATROL"])
    
    return {
        "aircraftType": aircraft_type,
        "altitude": f"{altitude}m",
        "velocity": f"{velocity} km/h",
        "speed": speed,
        "fuelLevel": f"{fuel_level}%",
        "weaponStatus": weapon_status,
        "eta": f"{eta_minutes} min"
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

@sio.event
async def deployAircraft(sid, data):
    """Handle custom aircraft deployment from simulator."""
    global flights
    print(f"Deploying aircraft: {data['name']} from client {sid}")
    
    # Add the new aircraft to the flights list
    flights.append(data)
    
    # Broadcast updated flight data to all clients
    await sio.emit('flightData', flights)
    
    return {"status": "success", "message": f"Aircraft {data['name']} deployed"}

@sio.event
async def removeAircraft(sid, aircraft_id):
    """Handle aircraft removal from simulator."""
    global flights
    print(f"Removing aircraft: {aircraft_id} from client {sid}")
    
    # Remove the aircraft from the flights list
    flights = [f for f in flights if f['id'] != aircraft_id]
    
    # Broadcast updated flight data to all clients
    await sio.emit('flightData', flights)
    
    return {"status": "success", "message": f"Aircraft {aircraft_id} removed"}

if __name__ == "__main__":
    uvicorn.run("main:socket_app", host="0.0.0.0", port=3000, reload=True)

