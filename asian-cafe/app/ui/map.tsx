import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 43.03063768063868,
  lng: -76.00305307438082, 
};

export default function Map() {
  return (
    <iframe
      className="w-full h-[450px]"
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?q=place_id:ChIJHaafit2N2YkRJayOwjeox1U&key=AIzaSyDLaujafTBCDtHV-DrNEbdUUZ-_Xo4h1RQ`}>
    </iframe>

    // <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
    //   <GoogleMap
    //     mapContainerStyle={containerStyle}
    //     center={center}
    //     zoom={10}
    //   >
    //     <Marker position={center} />
    //   </GoogleMap>
    // </LoadScript>
  );
};