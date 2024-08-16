const express = require('express');
const router = express.Router();
const axios = require('axios');

// In-memory cache to store earthquake data
const cache = {};

// Function to calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Define the route to get earthquake data
router.get('/', async (req, res) => {
  const { lat, lng, radius } = req.query;

  if (!lat || !lng || !radius) {
    return res.status(400).json({ error: 'Latitude, longitude, and radius are required' });
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const radiusNum = parseFloat(radius);

  if (isNaN(latNum) || isNaN(lngNum) || isNaN(radiusNum) || radiusNum < 1 || radiusNum > 1000) {
    return res.status(400).json({ error: 'Latitude, longitude must be numbers and radius must be a number between 1 and 150' });
  }

  // Check if data is in the cache
  const cacheKey = `${latNum}_${lngNum}_${radiusNum}`;
  if (cache[cacheKey]) {
    console.log('Serving from cache');
    return res.json(cache[cacheKey]);
  }

  try {
    const response = await axios.get('https://earthquake.usgs.gov/fdsnws/event/1/query', {
      params: {
        format: 'geojson',
        latitude: latNum,
        longitude: lngNum,
        maxradius:  radiusNum // Radius in kilometers
      }
    });

    const data = response.data.features;

    if (data.length === 0) {
      return res.json({ message: 'No earthquakes found within the specified radius.' });
    }

    // Calculate distances and filter by radius
    const filteredData = data
      .map(earthquake => {
        const eqLat = earthquake.geometry.coordinates[1];
        const eqLon = earthquake.geometry.coordinates[0];
        const distance = calculateDistance(latNum, lngNum, eqLat, eqLon);
        return { ...earthquake, distance };
      })
      .filter(earthquake => earthquake.distance <= radiusNum) // Filter by radius
      .sort((a, b) => a.distance - b.distance); // Sort by distance

    // Cache the result
    cache[cacheKey] = { ...response.data, features: filteredData };

    res.json({ ...response.data, features: filteredData });
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    res.status(500).json({ error: 'Error fetching earthquake data' });
  }
});

module.exports = router;
