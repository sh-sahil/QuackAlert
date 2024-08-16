import { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingOverlay from '../components/LoadingOverlay'; // Import the LoadingOverlay component
import MapWithDirection from '../components/MapWithDirection';

const Evacuation = () => {

  const [userInfo, setUserInfo] = useState(null);
  const [destinationLatLon, setDestinationLatLon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableLoader, setTableLoader] = useState(false); // New state for table loading
  const [error, setError] = useState(null);
  const [safePlaces, setSafePlaces] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        try {
          const response = await axios.get(`http://localhost:5000/details/${storedEmail}`);
          setUserInfo(response.data.user);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to fetch user data.');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const updateLocation = async () => {
      if (userInfo && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await axios.post('http://localhost:5000/location/update-location', {
              email: userInfo.email,
              lat: latitude,
              long: longitude,
            });
            console.log('Location updated successfully');

            // Set tableLoader to true before fetching safe places
            setTableLoader(true);
            // Fetch safe places based on the updated location
            const safePlacesResponse = await axios.get(`http://localhost:5000/safeplaces?lat=${latitude}&lon=${longitude}`);
            setSafePlaces(safePlacesResponse.data);
            console.log('Safe places:', safePlacesResponse.data);

            // Set tableLoader to false after fetching safe places
            setTableLoader(false);
          } catch (err) {
            console.error('Error updating location:', err);
            setTableLoader(false); // Ensure loader is hidden in case of error
          }
        }, (err) => {
          console.error('Error getting geolocation:', err);
          setTableLoader(false); // Ensure loader is hidden in case of error
        });
      }
    };

    updateLocation();
  }, [userInfo]);

  return (
    <LoadingOverlay isLoading={loading}>
      {!userInfo ? (
        <div>Please make sure you are logged in.</div>
      ) : (
        <div className="flex h-screen">
          {/* Table Container */}
          <div className="w-1/2 h-full overflow-auto flex flex-col relative">
            <LoadingOverlay isLoading={tableLoader} /> {/* Table loader overlay */}
            <div className="p-1.5 flex-1">
              <div className="overflow-hidden h-full">
                <table className="min-w-full divide-y divide-gray-200 h-full">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Latitude</th>
                      <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Longitude</th>
                      <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safePlaces.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-800">Loading Pls Wait.</td>
                      </tr>
                    ) : (
                      safePlaces.map((place, index) => (
                        <tr key={index} className="odd:bg-white even:bg-gray-100">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{`Place ${index + 1}`}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{place.lat.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{place.lon.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                            <button
                              type="button"
                              className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                              onClick={() => handlePlaceClick(place)}
                            >
                              View Directions
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Side Div */}
          <div className="w-1/2 h-full bg-gray-300 flex items-center justify-center">
            {/* display Map */}
            <MapWithDirection
              userLatLon={{ lat: userInfo.lat, lon: userInfo.long }}
              destinationLatLon={destinationLatLon}
            />


          </div>
        </div>
      )}
    </LoadingOverlay>
  );

  function handlePlaceClick(place) {
    console.log('Selected place:', place);
    setDestinationLatLon(place);
  }
};

export default Evacuation;
