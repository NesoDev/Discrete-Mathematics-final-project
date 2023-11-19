import { addNodesToMap } from "./canvas-functions.js";

mapboxgl.accessToken = 'pk.eyJ1IjoibHVpcy1sdCIsImEiOiJjbGwxeHk3cmExZWczM2dyM3BrZnA3ZTV5In0.HAJy5jLsbNgPuOFFk22q2Q';

var initialCoordinates = [-77.083943, -12.0565];

var bounds = [
    [-77.0884, -12.061398731476459], // Coordenadas del suroeste [lng, lat]
    [-77.07942532562103, -12.051447701183207]  // Coordenadas del noreste [lng, lat]
];

let id;

let jsonNodes = [];

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
    id = jsonNodes.length;
    createNodeMapBox(coordinates, id, map);
});

function createNodeMapBox(coordinates, id, map) {
    let node = {
        "id": id, // Usando un número en lugar de un string
        "name": `Node ${id}`, // Proporcionando un nombre descriptivo
        "entrances": [
            {
                "position": coordinates
            }
        ]
    };

    console.log(`Node added with id: ${id}`);
    
    jsonNodes.push(node);
    console.log(`Nodes : ${jsonNodes}`)
    addNodesToMap(jsonNodes, map); // Asegúrate de que esta función maneje correctamente los nodos existentes
    return id + 1; // Incrementa el id para el próximo nodo
}


map.on('load', () => {
    if (!jsonNodes) {
        addNodesToMap(jsonNodes, map)
    };
})
// Puedes hacer lo que desees con las coordenadas, como agregar un marcador.