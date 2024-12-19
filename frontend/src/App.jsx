import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapController = ({ onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      console.log("Map instance is ready:", map);
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
};

const App = () => {
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Fetch markers from backend on load
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/markers/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched markers:", data);
        setMarkers(data);
      })
      .catch((error) => console.error("Error fetching markers:", error));
  }, []);

  const handleMapClick = (e) => {
    if (!e.latlng) {
      console.error("latlng is undefined:", e);
      return;
    }
    const { lat, lng } = e.latlng;
    const name = prompt("Enter a name for this marker:");
  
    if (name) {
      const newMarker = { name, latitude: lat, longitude: lng };
  
      fetch("http://127.0.0.1:8000/api/markers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMarker),
      })
        .then((response) => response.json())
        .then((savedMarker) => {
          console.log("Marker saved:", savedMarker);
          setMarkers((prevMarkers) => [...prevMarkers, savedMarker]);
        })
        .catch((error) => console.error("Error saving marker:", error));
    }
  };

  const deleteMarker = (id) => {
    console.log(`Attempting to delete marker with ID: ${id}`);
    console.log(`DELETE URL: http://127.0.0.1:8000/api/markers/${id}/`);
  
    fetch(`http://127.0.0.1:8000/api/markers/${id}/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Marker deleted successfully:", id);
          setMarkers((prevMarkers) =>
            prevMarkers.filter((marker) => marker.id !== id)
          );
        } else {
          console.error("Failed to delete marker:", response.status, response.statusText);
        }
      })
      .catch((error) => console.error("Error deleting marker:", error));
  };
  
  

  useEffect(() => {
    if (mapInstance) {
      mapInstance.on("click", handleMapClick);
    }
    return () => {
      if (mapInstance) {
        mapInstance.off("click", handleMapClick);
      }
    };
  }, [mapInstance]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search location..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (mapInstance) {
              fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`)
                .then((response) => response.json())
                .then((data) => {
                  if (data.length > 0) {
                    const { lat, lon } = data[0];
                    mapInstance.setView([lat, lon], 13);
                    L.marker([lat, lon]).addTo(mapInstance).bindPopup(query).openPopup();
                  } else {
                    alert("Location not found.");
                  }
                });
            }
          }
        }}
      />
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.latitude, marker.longitude]}>
            <Popup>
              {marker.name}
              <br />
              <button onClick={() => deleteMarker(marker.id)}>Delete</button>
            </Popup>
          </Marker>
        ))}
        <MapController onMapReady={setMapInstance} />
      </MapContainer>
    </div>
  );
};

export default App;
