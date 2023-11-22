import { addRouteToMap } from "./map-functions.js";

export function getRoute(start, end, map) {
    mapboxgl.accessToken = 'pk.eyJ1IjoibmVzb2RldiIsImEiOiJjbGw0YzBhbm0wM25sM3FyeTV4c3ExOHZxIn0.TDC6KD-aJ_2gFo36-eDO5A';

    const url_1 = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]}%2C${start[1]}%3B${end[0]}%2C${end[1]}?alternatives=true&continue_straight=true&geometries=geojson&overview=full&steps=true&access_token=${mapboxgl.accessToken}`;
    const url_2 = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]}%2C${start[1]}%3B${end[0]}%2C${end[1]}?alternatives=true&continue_straight=true&geometries=geojson&overview=full&steps=true&access_token=${mapboxgl.accessToken}`;

    Promise.all([fetch(url_1), fetch(url_2)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            const walkingRoute = data[0].routes[0].geometry;
            const drivingRoute = data[1].routes[0].geometry;

            console.log(`Walking Route: ${JSON.stringify(walkingRoute)}`);
            console.log(`Driving Route: ${JSON.stringify(drivingRoute)}`);

            addRouteToMap(walkingRoute, map, 'walking', '#8942d1');
            addRouteToMap(drivingRoute, map, 'driving', '#00d47e');

        })
        .catch(error => console.error('Error al obtener direcciones:', error));
}
