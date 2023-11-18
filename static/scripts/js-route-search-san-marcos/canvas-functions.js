export function switchToVis() {
    document.getElementById('map').style.display = 'none';  // Oculta el mapa
    document.getElementById('vis-container').style.display = 'block';  // Muestra Vis.js
}

export function switchToMap() {
    document.getElementById('map').style.display = 'block';  // Oculta el mapa
    document.getElementById('vis-container').style.display = 'none';  // Muestra Vis.js
}

export function convertJsonToEdgesArray(data) {
    const edgesAray = [];

    data.forEach(node => {
        node.ids_adjacents.forEach(idAdjacent => {
            const edgeIds = [idAdjacent, node.id].sort((a, b) => a - b);
            const edge = {
                from: edgeIds[0],
                to: edgeIds[1],
                distance: parseFloat(Math.sqrt((node.position[0] - data[idAdjacent - 1].position[0]) ** 2 + (node.position[1] - data[idAdjacent - 1].position[1]) ** 2)).toFixed(2),
            };

            if (!edgesAray.some(e => (e.from === edge.from && e.to === edge.to))) {
                edgesAray.push(edge);
            }
        });
    });
    console.log(edgesAray)
    return edgesAray;
}

export function updatePositionAndEdgesOfNodes(nodesVisJs, nodesArray, network) {
    const data = network.body.data;
    const nodes = data.nodes;
    const edges = data.edges;
    const edgesModified = [];

    nodes.forEach(node => {
        // Accede a las propiedades del nodo
        const nodeId = node.id;
        const position = network.getPositions([nodeId]);
        const xPosition = position[nodeId].x;
        const yPosition = position[nodeId].y;

        // Verificamos si el nodo fue desplazado (está dentro de nodesVisjs)
        if (nodesVisJs.includes(nodeId)) {
            console.log(`---- Nodo desplazado: ${nodeId} ----`);
            console.log(`Nueva posicion: ${xPosition}, ${yPosition}`)
            console.log(`-- Actualizamos las posiciones en nodesArray --`);

            // Crear un objeto de nodo actualizado
            const updatedNode = {
                id: nodeId,
                title: `(${xPosition}, ${yPosition})`
            };

            // Actualizamos el nodo en la red
            network.body.data.nodes.update(updatedNode);

            // Actualizamos el nodo en el array
            nodesArray[nodeId - 1].position = [xPosition, yPosition];

            // Buscamos las aristas que tienen como extremo al nodo
            edges.forEach(edge => {
                if (edge.from == nodeId || edge.to == nodeId) {
                    edgesModified.push(edge)
                }
            })

            // Actualizamos las distancias de esta aristas
            edgesModified.forEach(edgeModified => {
                const nodeFromId = edgeModified.from;
                const nodeToId = edgeModified.to;

                const positionNodeFromId = [network.getPositions([nodeFromId])[nodeFromId].x, network.getPositions([nodeFromId])[nodeFromId].y];
                const positionNodeToId = [network.getPositions([nodeToId])[nodeToId].x, network.getPositions([nodeToId])[nodeToId].y];

                const newDistance = parseFloat(Math.sqrt((positionNodeFromId[0] - positionNodeToId[0]) ** 2 + (positionNodeFromId[1] - positionNodeToId[1]) ** 2)).toFixed(2);

                const updateEdge = {
                    id: edgeModified.id,
                    label: `   ${newDistance}   `,
                    from: edgeModified.from,
                    to: edgeModified.to,
                    width: 5,
                    color: 'black',
                    dashes: false,
                    font: edgeModified.font,
                }

                // Actualizamos la arista en la red
                network.body.data.edges.update(updateEdge);
            })
        }
    });
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
}

export function addNodesToMap(nodesUnmsmJson, map) {
    let nodesUnmsmGeoJson = convertToGeoJSON(nodesUnmsmJson);
    console.log(`GeoJSON: ${nodesUnmsmGeoJson}`);
    // Asegurarse de que el mapa esté cargado
    if (map.loaded()) {
        // Agregar fuente de datos
        map.addSource('entrances', {
            'type': 'geojson',
            'data': nodesUnmsmGeoJson
        });

        // Agregar capa de círculos
        map.addLayer({
            'id': 'entrances-layer',
            'type': 'circle',
            'source': 'entrances',
            'paint': {
                // Definimos el radio de los círculos utilizando la propiedad 'radius' de cada elemento
                'circle-radius': {
                    'property': 'radius',
                    'type': 'identity'
                },
                'circle-color': '#ff0000' // Color de los círculos
            }
        });
    } else {
        console.error('Map is not fully loaded yet.');
    }
}

