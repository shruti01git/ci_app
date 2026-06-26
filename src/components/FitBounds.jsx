import { useEffect, useMemo } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function FitBounds({ events }) {

  const map = useMap();

  const bounds = useMemo(() => {

    if (!events.length) return null;

    return L.latLngBounds(
      events.map((e) => [e.lat, e.lng])
    );

  }, [events]);

  useEffect(() => {

    if (bounds) {

      map.fitBounds(bounds.pad(0.2), {
        animate: true
      });

    }

  }, [bounds, map]);

  return null;
}