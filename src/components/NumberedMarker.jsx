import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import EventPopup from "./EventPopup";

function createNumberIcon(number) {

  return L.divIcon({

    className: "",

    html: `
      <div class="route-number-marker">
        ${number}
      </div>
    `,

    iconSize: [30, 30],

    iconAnchor: [15, 15]

  });

}

export default function NumberedMarker({
  event,
  index,
}) {

  return (

    <Marker
      position={[event.lat, event.lng]}
      icon={createNumberIcon(index + 1)}
      zIndexOffset={2500}
    >

      <Popup>

        <EventPopup event={event} />

      </Popup>

    </Marker>

  );

}