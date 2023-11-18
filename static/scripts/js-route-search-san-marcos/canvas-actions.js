import { convertJsonToEdgesArray } from './canvas-functions.js'

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
            improvedLayout: true, // No permite que vis.js mejore la disposición automáticamente
        },
        physics: {
            enabled: false, // Desactiva la simulación física
        },
        interaction: {
            zoomView: true, // No Bloquea el zoom con el mouse
            dragView: true, // No Bloquea el movimiento de la vista con el mouse
        },
    };

    let network = new vis.Network(canvas, data, options);

    return network;
}
