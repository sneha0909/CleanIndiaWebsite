import React, { useEffect, useRef } from "react";

const apiKey = "AIzaSyA6iTv5EZiD487CQwyq07hiZU64LGBLu7U";
const mapApiJs = "https://maps.googleapis.com/maps/api/js";

function loadAsyncScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    Object.assign(script, {
      type: "text/javascript",
      async: true,
      src,
    });
    script.addEventListener("load", () => resolve(script));
    document.head.appendChild(script);
  });
}

function GoogleLocationForm({ venueforLocation }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const initMapScript = () => {
    if (window.google) {
      return Promise.resolve();
    }
    const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`;
    return loadAsyncScript(src);
  };

  const initMap = () => {
    if (!mapContainerRef.current) return;

    const mapOptions = {
      center: { lat: 28.6139, lng: 77.209 },
      zoom: 6,
    };

    mapRef.current = new window.google.maps.Map(
      mapContainerRef.current,
      mapOptions
    );

    // Define the origin and destination
    const origin = "Hyderabad University, Hyderabad, India";
    console.log(origin);
    const destination = venueforLocation;

    // Get the latitude and longitude for the origin and destination using the Geocoding API
    Promise.all([
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${origin}&key=${apiKey}`
      ).then((res) => res.json()),
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=${apiKey}`
      ).then((res) => res.json()),
    ]).then(([originResult, destinationResult]) => {
      const originLocation = originResult.results[0].geometry.location;
      const destinationLocation =
        destinationResult.results[0].geometry.location;

      // Set the markers for the origin and destination
      const originMarker = new window.google.maps.Marker({
        position: originLocation,
        map: mapRef.current,
        title: origin,
        label: "Hyderabad University",
      });

      const destinationMarker = new window.google.maps.Marker({
        position: destinationLocation,
        map: mapRef.current,
        title: destination,
        label: venueforLocation,
      });

      // Set the directions service and renderer
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: mapRef.current,
      });

      // Set the directions request
      const directionsRequest = {
        origin: originLocation,
        destination: destinationLocation,
        travelMode: "DRIVING",
      };

      // Get the directions and display them on the map
      directionsService.route(directionsRequest, function (result, status) {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        }
      });
    });
  };

  useEffect(() => {
    initMapScript().then(() => {
      initMap();
    });
  }, []);

  return (
    <>
      <div className="GoogleMapsContainer">
        <div className="GoogleMaps" ref={mapContainerRef}></div>
      </div>
    </>
  );
}

export default GoogleLocationForm;
