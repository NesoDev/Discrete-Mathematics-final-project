import { fillInputs } from "./menu-functions.js";

export function switchToMap() {
    let inputSelectStartLocate = document.querySelector("#select-start-locate");
    let inputSelectEndLocate = document.querySelector("#select-end-locate");

    document.getElementById('map').style.display = 'block';  // Oculta el mapa
    document.getElementById('vis-container').style.display = 'none';  // Muestra Vis.js

    document.querySelector('.button-upload-json').style.background = '#1f646e';
    document.querySelector('#nodes-icon').style.filter = 'brightness(1.2)';

    document.querySelector('.button-show-map').style.background = '#00d47e';
    document.querySelector('#map-icon').style.filter = 'brightness(10)';

    fillInputs(inputSelectStartLocate, inputSelectEndLocate, []);
}

export function createMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibmVzb2RldiIsImEiOiJjbGw0YzBhbm0wM25sM3FyeTV4c3ExOHZxIn0.TDC6KD-aJ_2gFo36-eDO5A';

    const initialCoordinates = [-77.083943, -12.0565];

    const expansionFactor = 0.001; 
    const bounds = [
        [-77.0884 - expansionFactor, -12.061398731476459 - expansionFactor],
        [-77.07942532562103 + expansionFactor, -12.051447701183207 + expansionFactor]
    ];

    console.log("--- CREANDO MAPA ---");
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: initialCoordinates,
        zoom: 20,
        maxBounds: bounds,
    });
    console.log("--- MAPA CREADO ---");


    return map;
}

function convertToGeoJSON(data) {
    console.log("CONVIRTIENDO EL JSON A UN GeoJSON");
    return {
        "type": "FeatureCollection",
        "features": data.flatMap(item =>
            item.entrances.map(entrance => ({
                "type": "Feature",
                "properties": {
                    "id": item.id,
                    "name": item.name,
                    "radius": 4
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": entrance.position
                }
            }))
        )
    };
};

export function addNodesToMap(jsonNodes, map) {
    const sourceId = 'entrances';

    if (map.getSource(sourceId)) {
        map.getSource(sourceId).setData({
            'type': 'FeatureCollection',
            'features': jsonNodes.map(node => ({
                'type': 'Feature',
                'properties': {
                    'id': node.id,
                    'name': node.name
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': node.entrances[0].position
                }
            }))
        });
    } else {
        map.addSource(sourceId, {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': jsonNodes.map(node => ({
                    'type': 'Feature',
                    'properties': {
                        'id': node.id,
                        'name': node.name
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': node.entrances[0].position
                    }
                }))
            }
        });

        map.addLayer({
            'id': 'nodes-layer',
            'type': 'circle',
            'source': sourceId,
            'paint': {
                'circle-radius': {
                    'property': 'radius',
                    'type': 'identity'
                },
                'circle-color': '#ff0000'
            }
        });
    }
};

export function addRouteToMap(routeGeometry, map, routeId, routeColor) {
    console.log(`--- AGREGANDO RUTA AL MAPA (ID: ${routeId}) ---`);
    if (map.getSource(`route-${routeId}`)) {
        map.getSource(`route-${routeId}`).setData(routeGeometry);
    } else {
        map.addLayer({
            id: `route-${routeId}`,
            type: 'line',
            source: {
                type: 'geojson',
                data: routeGeometry
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': routeColor,
                'line-width': 20
            }
        });
    }
}