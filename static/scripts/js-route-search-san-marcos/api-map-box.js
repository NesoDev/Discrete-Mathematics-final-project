import { addRouteToMap } from "./map-functions.js";

export function getRoute(start, end, map) {
    mapboxgl.accessToken = 'pk.eyJ1IjoibHVpcy1sdCIsImEiOiJjbGwxeHk3cmExZWczM2dyM3BrZnA3ZTV5In0.HAJy5jLsbNgPuOFFk22q2Q';

    const url_1 = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]}%2C${start[1]}%3B${end[0]}%2C${end[1]}?alternatives=true&continue_straight=true&geometries=geojson&overview=full&steps=true&access_token=${mapboxgl.accessToken}`;
    const url_2 = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]}%2C${start[1]}%3B${end[0]}%2C${end[1]}?alternatives=true&continue_straight=true&geometries=geojson&overview=full&steps=true&access_token=${mapboxgl.accessToken}`;

    // Utiliza Promise.all para esperar a que ambas solicitudes se completen
    Promise.all([fetch(url_1), fetch(url_2)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            const walkingRoute = data[0].routes[0].geometry;
            const drivingRoute = data[1].routes[0].geometry;

            console.log(`Walking Route: ${JSON.stringify(walkingRoute)}`);
            console.log(`Driving Route: ${JSON.stringify(drivingRoute)}`);

            // Agregar una ruta de caminata al mapa con color rojo
            addRouteToMap(walkingRoute, map, 'walking', '#FF0000');
            // Agregar una ruta de conducción al mapa con color verde
            addRouteToMap(drivingRoute, map, 'driving', '#00FF00');

        })
        .catch(error => console.error('Error al obtener direcciones:', error));
}
