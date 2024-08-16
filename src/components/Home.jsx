import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home({
  place,
  setPlace,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  predictedMagnitude,
  setPredictedMagnitude,
}) {
  //const [longitude, setLongitude] = useState("");
  //const [latitude, setLatitude] = useState("");
  const [depth, setDepth] = useState("");

  const [significance, setSignificance] = useState("");

  // const [magnitude, setMagnitude] = useState(null);

  useEffect(() => {
    if (place) {
      setPlace(place);
      setDepth("");
      setSignificance("");
      setPredictedMagnitude(null);
    }
  }, [place]);

  // console.log("location" + location);

  const handlePredict = async () => {
    if (!depth || !significance) {
      toast.error("Please enter both depth and significance values");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8001/predict", {
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
        depth: parseFloat(depth),

        significance: parseFloat(significance),
      });
      setPredictedMagnitude(response.data.magnitude);
    } catch (error) {
      console.error("Error predicting magnitude", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-2 pt-6 pb-8 mb-4 overflow-auto">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
      />
      <h1 className=" font-bold mb-4">Earthquake Magnitude Prediction</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Longitude:
          <input
            type="number"
            value={longitude}
            onChange={e => setLongitude(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Latitude:
          <input
            type="number"
            value={latitude}
            onChange={e => setLatitude(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Depth:
          <input
            type="number"
            value={depth}
            onChange={e => setDepth(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Significance:
          <input
            type="number"
            value={significance}
            onChange={e => setSignificance(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>
      <button
        onClick={handlePredict}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Predict
      </button>
      {predictedMagnitude !== null && (
        <div className="mt-4">
          <h2 className="text-xl">
            Predicted Magnitude: {Math.round(predictedMagnitude * 10) / 10}
          </h2>
        </div>
      )}
    </div>
  );
}

export default Home;
