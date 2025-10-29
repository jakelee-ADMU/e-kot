# E-Kot: E-Jeep Real-Time Tracker

Real-time GPS tracking system for ADMU campus e-jeeps using phone GPS.

## How It Works

1. **Phone = GPS Tracker**: Open the tracking page on a phone and allow GPS access
2. **Real-time Updates**: Phone sends GPS coordinates every few seconds
3. **Live Map**: Watch the e-jeep move on the map in real-time
4. **ADMU Campus Only**: Map is limited to campus boundaries

## Quick Start

### Step 1: Start the Server
```bash
npm install
npm start
```

### Step 2: Track with Phone
On your phone, open:
```
http://YOUR_COMPUTER_IP:5000/track.html
```

Click "Start Tracking" and allow GPS access.

### Step 3: View the Map
On any device, open:
```
http://YOUR_COMPUTER_IP:5000
```

Watch the map update as the phone moves around campus!

## Finding Your Computer's IP

**Mac/Linux:**
```bash
ifconfig | grep inet
```

**Windows:**
```bash
ipconfig
```

## Tech Stack

- **Backend**: Node.js + Express + Socket.IO
- **Frontend**: Leaflet.js + Geolocation API
- **Real-time**: WebSocket communication

## API Endpoint

**POST /api/location/update**
```json
{
  "jeepId": "PHONE-GPS",
  "latitude": 14.6394,
  "longitude": 121.0778,
  "timestamp": 1234567890
}
```

## Deployment

Ready to deploy to Render:
1. Push to GitHub
2. Connect to Render
3. Deploy!

Use the deployed URL on your phone for tracking from anywhere.

## License

ISC
