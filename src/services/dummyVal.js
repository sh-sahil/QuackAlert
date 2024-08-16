// utils/generateRandomAreas.js

export const generateRandomAreas = numAreas => {
  const areas = [];
  for (let i = 0; i < numAreas; i++) {
    const lat = 51 + Math.random() * 1; // Random latitude around 51
    const lng = -0.1 + Math.random() * 0.1; // Random longitude around -0.1
    const shading = Math.random() > 0.5 ? "light" : "dark"; // Random shading

    areas.push({
      id: i,
      coordinates: [
        [lat, lng],
        [lat + 0.1, lng],
        [lat + 0.1, lng + 0.1],
        [lat, lng + 0.1],
      ],
      shading,
    });
  }
  return areas;
};
