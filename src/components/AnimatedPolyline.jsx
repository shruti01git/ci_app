import { Polyline } from "react-leaflet";
import useAnimatedRoute from "../hooks/useAnimatedRoute";

export default function AnimatedPolyline({
    positions,
    color = "#3B82F6"
}) {

    const animatedPositions = useAnimatedRoute(positions);

    return (
        <Polyline
            positions={animatedPositions}
            pathOptions={{
                color,
                weight:5,
                opacity:0.9
            }}
        />
    );

}