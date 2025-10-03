import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

function EventMap({ lat, lng }) {
  const center = { lat, lng };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

export default EventMap;
