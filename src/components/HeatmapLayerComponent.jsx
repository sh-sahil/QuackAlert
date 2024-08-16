import React, { useEffect, useRef } from 'react';
import { useMap, useMapEvent } from 'react-leaflet';
import 'leaflet.heat';

const HeatmapLayerComponent = ({ points }) => {
  const map = useMap();
  const heatmapLayerRef = useRef(null);
  const layerVisible = useRef(true);

  useEffect(() => {
    if (points.length > 0) {
      if (!heatmapLayerRef.current) {
        // Initialize heatmap layer if it doesn't exist
        heatmapLayerRef.current = L.heatLayer(
          points.map(point => [point.lat, point.lng, point.intensity]),
          {
            radius: 20,
            blur: 15,
            maxZoom: 10,
            gradient: {
              0.1: 'blue',
              0.2: 'cyan',
              0.4: 'lime',
              0.6: 'yellow',
              0.8: 'red',
              1.0: 'darkred'
            }
          }
        );
        heatmapLayerRef.current.addTo(map);
      } else {
        // Update heatmap layer data
        heatmapLayerRef.current.setLatLngs(
          points.map(point => [point.lat, point.lng, point.intensity])
        );
      }
    } else {
      // Remove heatmap layer if points are empty
      if (heatmapLayerRef.current) {
        map.removeLayer(heatmapLayerRef.current);
        heatmapLayerRef.current = null; // Clear the reference
      }
    }
  }, [points, map]); // Ensure map is stable, avoid potential issues with map reference

  // Handle map movement events to manage layer visibility
  useMapEvent('movestart', () => {
    if (heatmapLayerRef.current && layerVisible.current) {
      map.removeLayer(heatmapLayerRef.current);
      layerVisible.current = false;
    }
  });

  useMapEvent('moveend', () => {
    if (heatmapLayerRef.current && !layerVisible.current) {
      heatmapLayerRef.current.addTo(map);
      layerVisible.current = true;
    }
  });

  return null;
};

export default HeatmapLayerComponent;
