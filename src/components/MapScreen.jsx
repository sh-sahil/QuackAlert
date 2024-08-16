import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import HeatmapLayerComponent from "./HeatmapLayerComponent";
import { fetchEarthquakeData } from "../services/earthquakeApi";
import "leaflet.heat";
import GroupButton from "./GroupButton"; // Import the GroupButton component
import LoadingOverlay from "./LoadingOverlay";
// Fixing marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationUpdater = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 13, {
        duration: 1.5, // Duration in seconds
      });
    }
  }, [location, map]);

  return null;
};

const ClickHandler = ({ onClick }) => {
  useMapEvents({
    click(event) {
      onClick(event.latlng);
    },
  });

  return null;
};

const MapScreen = ({
  place,
  location,
  selectedLatLon,
  earthquakeInfo,
  onMapClick,
  predictedMagnitude,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [points, setPoints] = useState([]);
  const [error, setError] = useState(null);
  const mapRef = useRef();

  // filters on map
  const [magnitude, setMagnitude] = useState(4.0);
  const [year, setYear] = useState(2023);

  useEffect(() => {
    setIsLoading(true);
    const getEarthquakeData = async () => {
      try {
        const earthquakeData = await fetchEarthquakeData(year, magnitude);
        setPoints(earthquakeData);

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    // console.log(Magnitude: ${value});
    getEarthquakeData();
  }, [year, magnitude]); // Added year and magnitude to the dependency array

  // handle GroupButton click
  const handleButtonClick = value => {
    // Check if the value exists in yearButtons array
    const yearButton = yearButtons.find(button => button.value === value);
    if (yearButton && value !== year) {
      setYear(value);
    }

    // Check if the value exists in magnitudeButtons array
    const magnitudeButton = magnitudeButtons.find(button => button.value === value);
    if (magnitudeButton && value !== magnitude) {
      setMagnitude(value); // Update magnitude state
    }
  };

  const defaultPosition = [20, 0]; // Centered on the world
  const maxZoom = 15; // Set your desired maximum zoom level here
  const minZoom = 2; // Restrict minimum zoom level here
  const bounds = [
    [-90, -180],
    [90, 180],
  ]; // Set map boundaries

  // Button configurations
  const yearButtons = [
    { label: "2023", value: "2023", color: "blue" },
    { label: "2022", value: "2022", color: "blue" },
    { label: "2021", value: "2021", color: "blue" },
    { label: "2020", value: "2020", color: "blue" },
  ];

  const magnitudeButtons = [
    { label: "4.0+", value: "4.0", color: "lime" },
    { label: "5.0+", value: "5.0", color: "yellow" },
    { label: "6.0+", value: "6.0", color: "red" },
    { label: "7.0+", value: "7.0", color: "darkred" },
  ];

  // Todays date
  function formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    // Function to get the ordinal suffix
    const getOrdinalSuffix = day => {
      const j = day % 10;
      const k = Math.floor(day / 10);
      if (k === 1) return "th";
      if (j === 1) return "st";
      if (j === 2) return "nd";
      if (j === 3) return "rd";
      return "th";
    };

    const ordinalDay = day + getOrdinalSuffix(day);

    return `${ordinalDay} ${month} ${year}`;
  }

  const today = new Date();
  const formattedDate = formatDate(today);

  return (
    <>
      <MapContainer
        className="z-20 overflow-hidden"
        center={defaultPosition}
        zoom={2}
        maxZoom={maxZoom}
        minZoom={minZoom}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%" }}
        whenCreated={mapInstance => (mapRef.current = mapInstance)}
      >
        <LoadingOverlay isLoading={isLoading}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {location && (
            <Marker position={[location.lat, location.lng]}>
              <Popup>
                Latitude: {location.lat} <br /> Longitude: {location.lng}
              </Popup>
            </Marker>
          )}

          {selectedLatLon && (
            <Marker position={[selectedLatLon.lat, selectedLatLon.lng]}>
              <Popup>
                Latitude: {selectedLatLon.lat} <br /> Longitude: {selectedLatLon.lng} <br />
                {earthquakeInfo ? (
                  <>
                    Magnitude:{" "}
                    {predictedMagnitude !== null && Math.round(predictedMagnitude * 10) / 10} <br />
                    Location: {place} <br />
                    Date: {formattedDate}
                  </>
                ) : (
                  "No earthquake data available for this location"
                )}
              </Popup>
            </Marker>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <HeatmapLayerComponent points={points} style={{with:'100%', height:'100%'}} />
          <LocationUpdater location={location} />
          <ClickHandler onClick={onMapClick} />
        </LoadingOverlay>
      </MapContainer>

      {/* GroupButton at bottom-left corner */}
      <div style={{ position: "absolute", bottom: "2px", left: "10px" }} className="z-30">
        <GroupButton buttons={yearButtons} onButtonClick={handleButtonClick} />
      </div>

      {/* GroupButton at bottom-right corner */}
      <div style={{ position: "absolute", bottom: "2px", right: "20px" }} className="z-30">
        <GroupButton buttons={magnitudeButtons} onButtonClick={handleButtonClick} />
      </div>
    </>
  );
};

export default MapScreen;
