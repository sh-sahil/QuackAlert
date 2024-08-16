import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { fetchCoordinates, reverseGeocode } from "../services/api"; // Adjust the path as needed
import "leaflet/dist/leaflet.css";
import MapScreen from "../components/MapScreen";
import ResiableSplitView from "../components/ResiableSplitView";

import Home from "../components/Home";

import HomeCharts from "../components/HomeCharts";

const HomePage = () => {
  const [place, setPlace] = useState("");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  const [selectedLatLon, setSelectedLatLon] = useState(null);
  const [earthquakeInfo, setEarthquakeInfo] = useState(null);
  const [radius, setRadius] = useState(10);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [predictedMagnitude, setPredictedMagnitude] = useState(null);

  // /loading
  const [isChartLoading, setIsChartLoading] = useState(false);

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };


  const handleMapClick = useCallback(
    async latlng => {
      setSelectedLatLon(latlng);
      try {
        setIsChartLoading(true);
        const response = await axios.get(`http://localhost:5000/geocoding`, {
          params: {
            lat: latlng.lat,
            lng: latlng.lng,
            radius: radius,
          },
        });
        setEarthquakeInfo(response.data);

        // Fetch place name using reverse geocoding
        const placeResponse = await reverseGeocode(latlng.lat, latlng.lng);
        setPlace(placeResponse);
        setLatitude(latlng.lat);
        setLongitude(latlng.lng);
      } catch (err) {
        setError(err.message);
        setEarthquakeInfo(null);
      } finally {
        setIsChartLoading(false);
      }
    },
    [radius]
  );


  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const coords = await fetchCoordinates(place);
      setLocation(coords);
      setLatitude(coords.lat);
      setLongitude(coords.lng);
      setError("");
    } catch (err) {
      setError(err.message);
      setLocation(null);
    }
  };

  useEffect(() => {
    if (selectedLatLon) {
      handleMapClick(selectedLatLon); // Fetch data initially if there is a selected location
    }
  }, [selectedLatLon, radius, handleMapClick]);

  return (
    <div className="w-screen h-screen flex">
      <div className="h-full w-[20%] bg-black p-4">
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            {/* <label htmlFor="place" className="block mb-2 text-sm font-medium text-gray-900">
              Please Enter Place
            </label> */}
            <input
              type="text"
              id="place"
              value={place}
              onChange={e => setPlace(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="e.g., Mumbai"
              required
            />
          </div>
          <button
            type="submit"
            className=" mb-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
          >
            Search
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <Home
          place={place}
          setPlace={setPlace}
          latitude={latitude} // Add this line
          setLatitude={setLatitude} // Add this line
          longitude={longitude} // Add this line
          setLongitude={setLongitude} // Add this line
          predictedMagnitude={predictedMagnitude}
          setPredictedMagnitude={setPredictedMagnitude}
        />
      </div>

      <ResiableSplitView direction="vertical">
        <MapScreen
          place={place}
          location={location}
          selectedLatLon={selectedLatLon}
          earthquakeInfo={earthquakeInfo}
          onMapClick={handleMapClick}
          predictedMagnitude={predictedMagnitude}
        />
        <HomeCharts
          isChartLoading={isChartLoading}
          earthquakeInfo={earthquakeInfo}
          selectedLatLon={selectedLatLon}
          setSelectedLatLon={setSelectedLatLon}
          setRadius={setRadius}
        />
      </ResiableSplitView>
    </div>
  );
};

export default HomePage;
