import axios from 'axios';

// Function to fetch earthquake data
export const fetchEarthquakeData = async (year = '2023', magnitude = 4.5) => {
  try {
    // Convert year to a number
    const yearNum = parseInt(year, 10);
    
    // Constructing the URL for the API request
    const starttime = `${yearNum}-01-01`;
    const endtime = `${yearNum + 1}-01-01`; // Increment year correctly
    
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${starttime}&endtime=${endtime}&minmagnitude=${magnitude}`;
    
    // Fetching data from the USGS Earthquake API
    const response = await fetch(url);
    
    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    // Parsing the response as JSON
    const data = await response.json();

  

    // Mapping the data to required format
    return data.features.map(feature => ({
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
      magnitude: feature.properties.mag,
    }));

  } catch (error) {
    // Logging errors if any
    console.error('Error fetching earthquake data:', error);
    return []; // Return an empty array in case of error
  }
};
