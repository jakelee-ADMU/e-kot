const socket = io();

let map;
let jeepMarker = null;

function initMap() {
  map = L.map('map').setView([14.6394, 121.0778], 17);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);
  
  const bounds = [
    [14.6350, 121.0700],
    [14.6500, 121.0850]
  ];
  map.setMaxBounds(bounds);
  map.setMinZoom(16);
}

function updateUI(data) {
  document.getElementById('jeep-id').textContent = data.jeepId;
  document.getElementById('status').textContent = 'Tracking Active';
  document.getElementById('status').className = 'value status-active';
  document.getElementById('current-location').textContent = 
    `${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`;
  document.getElementById('nearest-stop').textContent = data.nearestStop || 'Moving...';
  
  const updateTime = new Date(data.timestamp);
  document.getElementById('last-update').textContent = updateTime.toLocaleTimeString();
}

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('initialLocations', (locations) => {
  console.log('Initial locations:', locations);
  const jeepIds = Object.keys(locations);
  if (jeepIds.length > 0) {
    const firstJeep = locations[jeepIds[0]];
    
    if (!jeepMarker) {
      const jeepIcon = L.divIcon({
        className: 'jeep-icon',
        html: '<div style="background: #4caf50; color: white; padding: 8px 12px; border-radius: 20px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">🚐 E-JEEP</div>',
        iconSize: [80, 30],
        iconAnchor: [40, 15]
      });
      
      jeepMarker = L.marker([firstJeep.latitude, firstJeep.longitude], { icon: jeepIcon }).addTo(map);
      jeepMarker.bindPopup('<strong>Live GPS Tracking</strong>');
    } else {
      jeepMarker.setLatLng([firstJeep.latitude, firstJeep.longitude]);
    }
    
    map.setView([firstJeep.latitude, firstJeep.longitude], 17);
    updateUI(firstJeep);
  }
});

socket.on('locationUpdate', (data) => {
  console.log('Location update:', data);
  
  const newLatLng = [data.latitude, data.longitude];
  
  if (!jeepMarker) {
    const jeepIcon = L.divIcon({
      className: 'jeep-icon',
      html: '<div style="background: #4caf50; color: white; padding: 8px 12px; border-radius: 20px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">🚐 E-JEEP</div>',
      iconSize: [80, 30],
      iconAnchor: [40, 15]
    });
    
    jeepMarker = L.marker(newLatLng, { icon: jeepIcon }).addTo(map);
    jeepMarker.bindPopup('<strong>Live GPS Tracking</strong>');
  } else {
    jeepMarker.setLatLng(newLatLng);
  }
  
  map.panTo(newLatLng);
  
  updateUI(data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  document.getElementById('status').textContent = 'Disconnected';
  document.getElementById('status').className = 'value status-waiting';
});

initMap();
