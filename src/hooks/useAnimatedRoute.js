import { useEffect, useState } from "react";

export default function useAnimatedRoute(points, speed = 30) {
    const [animatedPoints, setAnimatedPoints] = useState([]);

    useEffect(() => {

        if (!points || points.length === 0) {
            setAnimatedPoints([]);
            return;
        }

        setAnimatedPoints([points[0]]);

        let index = 1;

        const interval = setInterval(() => {

            setAnimatedPoints(prev => {

                if (index >= points.length) {
                    clearInterval(interval);
                    return prev;
                }

                const updated = [...prev, points[index]];
                index++;

                return updated;

            });

        }, speed);

        return () => clearInterval(interval);

    }, [points, speed]);

    return animatedPoints;
}
