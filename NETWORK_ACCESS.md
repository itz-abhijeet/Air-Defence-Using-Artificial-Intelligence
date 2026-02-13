# Network Access - Quick Start Guide

## ✅ Configuration Complete!

Your S-EYE application is now fully configured for network access.

## Current Network Details

**Your IP Address**: `10.151.23.7`

## Access URLs

### For You (Local):
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

### For Your Friend (Network):
- **Main Radar**: `http://10.151.23.7:5173`
- **Simulator**: `http://10.151.23.7:5173/simulator`
- Backend API: `http://10.151.23.7:3000`

## What Was Fixed

### Problem
The frontend was hardcoded to use `localhost:3000` which only works on your computer.

### Solution
✅ Updated all components to auto-detect the backend URL:
- `App.jsx` - Socket.IO connection
- `Sidebar.jsx` - Target analysis API
- `Simulator.jsx` - Aircraft deployment API

The app now automatically uses:
- `localhost:3000` when accessed locally
- `10.151.23.7:3000` when accessed from network

## Important: Restart Required!

**You MUST restart the frontend server** for changes to take effect:

```bash
# In the terminal running npm run dev:
# 1. Press Ctrl+C to stop
# 2. Run again:
npm run dev
```

The backend is already running correctly on `0.0.0.0:3000`.

## Testing

After restarting:

1. **You**: Open `http://localhost:5173` - should work
2. **Friend**: Open `http://10.151.23.7:5173` - should work
3. **Both**: Deploy aircraft from simulator - both should see it
4. **Both**: Click on aircraft - target analysis should work

## Troubleshooting

### If your friend can't connect:

1. **Windows Firewall**: Allow ports 3000 and 5173
   - Open Windows Defender Firewall
   - "Allow an app or feature through Windows Defender Firewall"
   - Find Node.js and Python, check both Private and Public

2. **Verify same network**: Both should have same default gateway
   ```bash
   ipconfig | findstr "Default Gateway"
   ```

3. **Check backend is running**: Your friend can test `http://10.151.23.7:3000` in browser

### If IP changes:

Your IP might change if you reconnect to WiFi. To find your new IP:
```bash
ipconfig | findstr /i "ipv4"
```

Then share the new IP with your friend.

## How It Works

The frontend now uses this logic:
```javascript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
  `http://${window.location.hostname}:3000`;
```

- When you access via `localhost:5173` → connects to `localhost:3000`
- When friend accesses via `10.151.23.7:5173` → connects to `10.151.23.7:3000`

Perfect for local network collaboration! 🚀
