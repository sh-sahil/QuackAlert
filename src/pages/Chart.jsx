import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const [csvData, setCsvData] = useState([]);
  const [activeTab, setActiveTab] = useState("earthquakeBar");

  useEffect(() => {
    Papa.parse("src/assets/earthquake_mag_depth.csv", {
      download: true,
      header: true,
      complete: results => {
        setCsvData(results.data);
      },
    });
  }, []);

  // Line chart data and options
  const lineData = {
    labels: csvData.map(row => row.place),
    datasets: [
      {
        label: "Magnitude",
        data: csvData.map(row => parseFloat(row.magnitudo)),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
      },
      {
        label: "Depth",
        data: csvData.map(row => parseFloat(row.depth)),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Earthquake Magnitude and Depth",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Places",
        },
        ticks: {
          autoSkip: true,
          maxRotation: 90,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Magnitude / Depth",
        },
        beginAtZero: true,
      },
    },
  };

  // Bar chart data and options
  const barData = {
    labels: [
      "United States",
      "Turkey",
      "Iceland",
      "Colombia",
      "Greece",
      "New Zealand",
      "Italy",
      "Philippines",
      "Mexico",
      "France",
      "Japan",
      "Indonesia",
      "Chile",
      "Spain",
      "Argentina",
      "China",
      "Canada",
      "Costa Rica",
      "Portugal",
      "Switzerland",
      "Germany",
      "El Salvador",
      "Nicaragua",
      "Kazakhstan",
      "Romania",
      "Puerto Rico",
      "Guatemala",
      "Austria",
      "Venezuela",
      "Serbia",
      "Bolivia",
      "Kyrgyzstan",
      "Panama",
      "Slovenia",
      "Syria",
      "Croatia",
      "Bulgaria",
      "Tajikistan",
      "Russia",
      "Svalbard and Jan Mayen",
      "Norway",
      "Morocco",
      "Peru",
      "Afghanistan",
      "Dominican Republic",
      "Albania",
      "Honduras",
      "India",
      "Sweden",
      "Czech Republic",
    ],
    datasets: [
      {
        label: "Number of Earthquakes",
        data: [
          53198, 20855, 17441, 17114, 14871, 13831, 11901, 10252, 8140, 6509, 5947, 4666, 4338,
          3525, 3209, 3081, 2577, 2137, 2042, 1794, 1701, 1629, 1563, 1524, 1490, 1303, 1202, 1201,
          1198, 1108, 1082, 1067, 961, 956, 948, 905, 818, 722, 721, 602, 602, 600, 578, 575, 573,
          555, 541, 497, 483, 456,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Number of Earthquakes in 50 Countries (2024)",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Countries",
        },
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Earthquakes",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container mx-auto p-4" style={{ marginBottom: "50px" }}>
      <h1 className="text-3xl font-bold underline mb-8">Earthquake Data Overview</h1>

      {/* Tabs Navigation */}
      <div className="tabs flex justify-around mb-8">
        <button
          className={`tab-button ${activeTab === "earthquakeBar" ? "active" : ""}`}
          onClick={() => setActiveTab("earthquakeBar")}
          style={{
            backgroundColor: activeTab === "earthquakeBar" ? "#007bff" : "#e9ecef",
            color: activeTab === "earthquakeBar" ? "#fff" : "#000",
            borderRadius: "5px",
            padding: "10px 20px",
          }}
        >
          Earthquake Data by Country
        </button>
        <button
          className={`tab-button ${activeTab === "powerBI" ? "active" : ""}`}
          onClick={() => setActiveTab("powerBI")}
          style={{
            backgroundColor: activeTab === "powerBI" ? "#007bff" : "#e9ecef",
            color: activeTab === "powerBI" ? "#fff" : "#000",
            borderRadius: "5px",
            padding: "10px 20px",
          }}
        >
          Natural Disaster Data
        </button>
        <button
          className={`tab-button ${activeTab === "magnitudeDepth" ? "active" : ""}`}
          onClick={() => setActiveTab("magnitudeDepth")}
          style={{
            backgroundColor: activeTab === "magnitudeDepth" ? "#007bff" : "#e9ecef",
            color: activeTab === "magnitudeDepth" ? "#fff" : "#000",
            borderRadius: "5px",
            padding: "10px 20px",
          }}
        >
          Magnitude & Depth Analysis
        </button>
        <button
          className={`tab-button ${activeTab === "map" ? "active" : ""}`}
          onClick={() => setActiveTab("map")}
          style={{
            backgroundColor: activeTab === "map" ? "#007bff" : "#e9ecef",
            color: activeTab === "map" ? "#fff" : "#000",
            borderRadius: "5px",
            padding: "10px 20px",
          }}
        >
          Earthquake Map
        </button>
      </div>

      {/* Tabs Content */}
      <div className="tab-content">
        {activeTab === "earthquakeBar" && (
          <div
            className="chart-container mx-auto my-6"
            style={{ width: "95%", borderBottom: "2px solid #ddd", paddingBottom: "20px" }}
          >
            <Bar data={barData} options={barOptions} />
          </div>
        )}

        {activeTab === "powerBI" && (
          <div
            className="iframe-container mx-auto my-12"
            style={{
              width: "1170px",
              height: "500px",
              margin: "0 auto",
              // border: "2px solid #ddd",
              // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              // paddingBottom: "10px",
            }}
          >
            <iframe
              title="NaturalDisaster"
              width="1200"
              height="610"
              src="https://app.powerbi.com/view?r=eyJrIjoiOTA3MDlhMDAtZDc1ZC00ZjRhLTljYWItM2FlNjY3YWY3MmM4IiwidCI6ImQxZjE0MzQ4LWYxYjUtNGEwOS1hYzk5LTdlYmYyMTNjYmM4MSIsImMiOjEwfQ%3D%3D"
              frameborder="0"
              allowfullscreen="true"
            ></iframe>
          </div>
        )}

        {activeTab === "magnitudeDepth" && (
          <div
            className="chart-container mx-auto my-6"
            style={{ width: "95%", borderBottom: "2px solid #ddd", paddingBottom: "20px" }}
          >
            <Line data={lineData} options={lineOptions} />
          </div>
        )}

        {activeTab === "map" && (
          <div
            className="iframe-container mx-auto my-6"
            style={{ border: "2px solid #ddd", paddingBottom: "20px" }}
          >
            <iframe
              title="Earthquake map"
              aria-label="Map"
              id="datawrapper-chart-swoLy"
              src="https://datawrapper.dwcdn.net/swoLy/1/"
              scrolling="no"
              frameBorder="0"
              className="w-full"
              style={{ minWidth: "100% !important", border: "none" }} // Remove internal border
              height="523"
              data-external="1"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;
