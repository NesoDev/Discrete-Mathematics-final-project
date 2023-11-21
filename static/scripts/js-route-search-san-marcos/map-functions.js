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
    // Coordenadas y limites iniciales
    const initialCoordinates = [-77.083943, -12.0565];
    const bounds = [
        [-77.0884, -12.061398731476459], // Suroeste
        [-77.07942532562103, -12.051447701183207]  // Noreste
    ];

    // Inicializamos el mapa
    console.log("--- CREANDO MAPA ---");
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: initialCoordinates,
        zoom: 10,
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
                    // Aquí incluimos el radio que será utilizado en la definición de la capa
                    "radius": 4 // Este es el radio en píxeles
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
    const sourceId = 'entrances'; // El ID de tu fuente, asegúrate de que sea único y consistente

    // Verifica si la fuente ya existe
    if (map.getSource(sourceId)) {
        // Actualiza los datos de la fuente existente
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
        // Crea la fuente ya que no existe
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

        // Añadir la capa utilizando la fuente, si aún no se ha añadido
        map.addLayer({
            'id': 'nodes-layer',
            'type': 'circle', // o 'circle' si prefieres usar círculos
            'source': sourceId,
            'paint': {
                // Definimos el radio de los círculos utilizando la propiedad 'radius' de cada elemento
                'circle-radius': {
                    'property': 'radius',
                    'type': 'identity'
                },
                'circle-color': '#ff0000' // Color de los círculos
            }
            // Agrega aquí más propiedades para definir cómo quieres que se vean los nodos
        });
    }
};

export function addRouteToMap(routeGeometry, map, routeId, routeColor) {
    console.log(`--- AGREGANDO RUTA AL MAPA (ID: ${routeId}) ---`);
    // Verifica si la ruta ya existe en el mapa y la actualiza, o la agrega si no existe
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
                'line-color': routeColor, // Color de la ruta (especificado al llamar a la función)
                'line-width': 8 // Grosor de la ruta
            }
        });
    }
}