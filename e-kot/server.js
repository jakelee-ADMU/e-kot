const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let jeepLocations = {};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', connectedClients: io.engine.clientsCount });
});

app.post('/api/location/update', (req, res) => {
  const { jeepId, latitude, longitude, timestamp, nearestStop } = req.body;
  
  if (!jeepId || !latitude || !longitude) {
    return res.status(400).json({ error: 'Invalid data: jeepId, latitude, and longitude required' });
  }
  
  const locationData = {
    jeepId,
    latitude,
    longitude,
    timestamp: timestamp || Date.now(),
    nearestStop: nearestStop || 'Unknown'
  };
  
  jeepLocations[jeepId] = locationData;
  
  io.emit('locationUpdate', locationData);
  
  res.status(200).json({ success: true, data: locationData });
});

app.get('/api/location/:jeepId', (req, res) => {
  const { jeepId } = req.params;
  const location = jeepLocations[jeepId];
  
  if (!location) {
    return res.status(404).json({ error: 'Jeep not found' });
  }
  
  res.json(location);
});

app.get('/api/locations', (req, res) => {
  res.json(jeepLocations);
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.emit('initialLocations', jeepLocations);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://0.0.0.0:${PORT} to view the tracker`);
});
