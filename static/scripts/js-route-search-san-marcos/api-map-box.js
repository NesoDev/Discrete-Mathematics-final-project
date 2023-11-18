import { addNodesToMap } from "./canvas-functions.js";

mapboxgl.accessToken = 'tu_token';

var initialCoordinates = [-77.083943, -12.0565];

var bounds = [
    [-77.0884, -12.061398731476459], // Coordenadas del suroeste [lng, lat]
    [-77.07942532562103, -12.051447701183207]  // Coordenadas del noreste [lng, lat]
];

var map = new mapboxgl.Map({
    container: 'map', // el id del contenedor en tu HTML
    style: 'mapbox://styles/mapbox/streets-v11', // el estilo del mapa
    center: initialCoordinates, // coordenadas de la Ciudad Universitaria UNMSM
    zoom: 10, // nivel de acercamiento inicial
    maxBounds: bounds,
});

// Agrega un control de navegación al mapa (opcional)
map.addControl(new mapboxgl.NavigationControl());

// Evento que se dispara cuando se hace clic en el mapa
map.on('click', function (e) {
    const coordinates = e.lngLat.toArray(); // Obtiene las coordenadas del clic
    console.log('Coordenadas del clic:', coordinates);
});

const nodesUnmsmJson = [
    {
        "id": 0,
        "name": "Facultad de Ingenieria en Sistemas e Informática",
        "entrances": [
            {
                "position": [-77.08571748750853, -12.053674246767855]
            }
        ]
    },
    {
        "id": 1,
        "name": "Puerta 2",
        "entrances": [
            {
                "position": [-77.07965746774524, -12.059500283486685]
            }
        ]
    },
    {
        "id": 2,
        "name": "Clínica Universitaria",
        "entrances": [
            {
                "position": [-77.08214323765738, -12.055620215860728]
            },
            {
                "position": [-77.08214323765840, -12.055620215860728]
            }
        ]
    },
    {
        "id": 3,
        "name": "Facultad de Educación",
        "entrances": [
            {
                "position": [-77.0851315838208, -12.055464489189447]
            }
        ]
    }
];
map.on('load', () => {
    addNodesToMap(nodesUnmsmJson, map);
})
// Puedes hacer lo que desees con las coordenadas, como agregar un marcador.