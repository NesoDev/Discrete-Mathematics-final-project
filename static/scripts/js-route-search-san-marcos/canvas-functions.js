import { fillInputs } from "./menu-functions.js";

export function switchToVis() {
    let inputSelectStartLocate = document.querySelector("#select-start-locate");
    let inputSelectEndLocate = document.querySelector("#select-end-locate");

    document.getElementById('map').style.display = 'none';  // Oculta el mapa
    document.getElementById('vis-container').style.display = 'block';  // Muestra Vis.js

    document.querySelector('.button-show-map').style.background = '#1f646e';
    document.querySelector('#map-icon').style.filter = 'brightness(1.2)';

    document.querySelector('.button-upload-json').style.background = '#00d47e';
    document.querySelector('#nodes-icon').style.filter = 'brightness(10)';

    fillInputs(inputSelectStartLocate, inputSelectEndLocate, []);
}

export function uploadJson() {
    return new Promise((resolve) => {
        let inputJson = document.createElement("input");
        inputJson.type = "file";
        inputJson.accept = ".json";
        inputJson.click();
        inputJson.addEventListener("change", function () {
            let selectedFile = inputJson.files[0];
            console.log("ARCHIVO SELECCIONADO: ", selectedFile.name);
            resolve(selectedFile);
        });
    });
}

export function createNodesVis(nodes) {
    return new vis.DataSet(nodes.map(node => ({
        id: node.id,
        label: `   ${node.id}   `,
        x: node.position[0],
        y: node.position[1],
        title: ` (${node.position[0]}, ${node.position[1]})`,
        color: {
            background: '#643dff',
            border: 'white',
            highlight: {
                background: '#ffd400',
                border: '#ffb300',
            },
        },
        font: {
            face: 'sans-serif',
            color: 'white',
            size: 25,
        },
        shape: 'circle',
        size: 70,
    })));
}

export function createEdgesVis(nodes) {
    let edgesArray = convertJsonToEdgesArray(nodes);
    return new vis.DataSet(edgesArray.map((edge, i) => ({
        id: i,
        label: `   ${edge.distance}   `,
        from: edge.from,
        to: edge.to,
        width: 5,
        color: 'black',
        dashes: false,
        font: {
            face: 'sans-serif',
            color: '#643dff',
            size: 20,
        },
    })));
}

export function renderNodesVis(nodes, edges, canvas) {
    let data = {
        nodes: nodes,
        edges: edges
    };

    let options = {
        layout: {
            improvedLayout: true,
        },
        physics: {
            enabled: false, 
        },
        interaction: {
            zoomView: true,
            dragView: true,
        },
    };

    let network = new vis.Network(canvas, data, options);

    return network;
}

export function updatePositionAndEdgesOfNodes(nodesVisJs, nodesArray, network) {
    const data = network.body.data;
    const nodes = data.nodes;
    const edges = data.edges;
    const edgesModified = [];

    nodes.forEach(node => {
        const nodeId = node.id;
        const position = network.getPositions([nodeId]);
        const xPosition = position[nodeId].x;
        const yPosition = position[nodeId].y;

        if (nodesVisJs.includes(nodeId)) {
            console.log(`---- Nodo desplazado: ${nodeId} ----`);
            console.log(`Nueva posicion: ${xPosition}, ${yPosition}`)
            console.log(`-- Actualizamos las posiciones en nodesArray --`);

            const updatedNode = {
                id: nodeId,
                title: `(${xPosition}, ${yPosition})`
            };

            network.body.data.nodes.update(updatedNode);

            nodesArray[nodeId - 1].position = [xPosition, yPosition];

            edges.forEach(edge => {
                if (edge.from == nodeId || edge.to == nodeId) {
                    edgesModified.push(edge)
                }
            })

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

                network.body.data.edges.update(updateEdge);
            })
        }
    });
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

function generatePastelColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = Math.random() * 360;
        const saturation = 50 + Math.random() * 10;
        const lightness = 70 + Math.random() * 10;
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
}

export function drawRoutes(routes, network) {
    const colors = generatePastelColors(routes.length);

    routes.forEach((route, i) => {
        route.forEach((nodeId, nodeIndex) => {
            console.log(`---- Coloreando Nodo : ${nodeId} ----`);

            let nodeColor = colors[i];
            if (nodeIndex === 0 || nodeIndex === route.length - 1) {
                nodeColor = '#000';
            }

            const updatedNode = {
                id: nodeId,
                color: {
                    background: nodeColor,
                    border: 'white',
                }
            };

            network.body.data.nodes.update(updatedNode);
        });
    });
}