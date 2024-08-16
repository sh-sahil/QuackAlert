// routes/getsafeplace.js
const express = require('express');
const axios = require('axios');

const router = express.Router();

// Fetch Earthquake Data Function
const fetchEarthquakeData = async () => {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}`;

  try {
    const response = await axios.get(url);
    return response.data.features;
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return [];
  }
};

// Haversine Distance Function
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => degrees * Math.PI / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Generate Potential Safe Places
const generatePotentialPlaces = (currentLat, currentLon, radius = 1) => {
  const potentialPlaces = [];
  const numPlaces = 100; // Number of potential places to generate

  for (let i = 0; i < numPlaces; i++) {
    const randomLat = currentLat + (Math.random() - 0.5) * radius / 111;
    const randomLon = currentLon + (Math.random() - 0.5) * radius / 111;
    potentialPlaces.push({ lat: randomLat, lon: randomLon });
  }

  return potentialPlaces;
};

// Filter Safe Places
const filterSafePlaces = (places, earthquakes) => {
  return places.filter(place => {
    return !earthquakes.some(earthquake => {
      const [lon, lat] = earthquake.geometry.coordinates;
      return haversineDistance(lat, lon, place.lat, place.lon) <= 1;
    });
  }).slice(0, 10);
};

// Find Safe Places Based on User's Location
const findSafePlaces = async (currentLat, currentLon) => {
  const earthquakes = await fetchEarthquakeData();
  const potentialPlaces = generatePotentialPlaces(currentLat, currentLon);
  const safePlaces = filterSafePlaces(potentialPlaces, earthquakes);
  return safePlaces;
};

// API Endpoint to Get Safe Places
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  try {
    const safePlaces = await findSafePlaces(parseFloat(lat), parseFloat(lon));
    res.status(200).json(safePlaces);
  } catch (error) {
    console.error('Error finding safe places:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
