
import { sendDataToServer, readJson } from "./api.js";
import { getRoute } from "./api-map-box.js";
import { createEdgesVis, createNodesVis, renderNodesVis, updatePositionAndEdgesOfNodes, switchToVis} from "./canvas-functions.js";
import { addRouteToMap, createMap, switchToMap } from "./map-functions.js";
import { uploadJson } from "./canvas-functions.js";
import { fillInputs } from "./menu-functions.js";

let path = 'static/files/nodes_unmsm.json';
let nodes;
let points;
let network; // Variable para mantener la instancia de la red vis.js
let routes = [];

document.addEventListener("DOMContentLoaded", async () => {

    let canvasContainer = document.querySelector(".canvas-container");
    let mapContainer = document.querySelector(".map-container");
    let buttonUploadJson = document.querySelector(".button-upload-json");
    let inputSelectStartLocate = document.querySelector("#select-start-locate");
    let inputSelectEndLocate = document.querySelector("#select-end-locate");
    let buttonSearchRoute = document.querySelector(".button-search-route");
    let buttonShowMap = document.querySelector(".button-show-map");

    //Creamos el mapa
    const map = createMap();

    console.log("--- LEYENDO JSON ---")
    points = await readJson(path);
    console.log("--- JSON LEIDO ---")
    console.log(`Points: ${points}`)

    console.log("--- LLENAMOS LOS SELECTS ---")
    fillInputs(inputSelectStartLocate, inputSelectEndLocate, points);

    // Agregamos un evento al boton mostrar mapa
    buttonShowMap.addEventListener('click', () => {
        switchToMap();
        fillInputs(inputSelectStartLocate, inputSelectEndLocate, points);
    });

    // Agregamos un evento al boton cargar json
    buttonUploadJson.addEventListener('click', () => {
        console.log("-- ABRIENDO EXPLORADOR DE ARCHIVOS --");
        // Hacemos visible el canvas cantainer e invisilizamos al map container
        switchToVis();
        uploadJson()
            .then(selectedFile => {
                console.log("-- ANALIZANDO EL ARCHIVO JSON --");

                let fileReader = new FileReader();

                fileReader.onload = function (event) {
                    try {
                        // Parsea el contenido como JSON y conviértelo en un arreglo
                        nodes = JSON.parse(event.target.result);

                        // Verifica si el resultado es un arreglo
                        if (Array.isArray(nodes)) {

                            // Llenaremos los inputs de nodos
                            fillInputs(inputSelectStartLocate, inputSelectEndLocate, nodes);

                            // Crea los nodos en el formato esperado por vis.js
                            let visNodes = createNodesVis(nodes);
                            let visEdges = createEdgesVis(nodes);

                            // Limpia la red existente antes de renderizar una nueva
                            if (network) {
                                network.destroy();
                            }
                            // Renderiza los nodos utilizando vis.js
                            network = renderNodesVis(visNodes, visEdges, canvasContainer);

                            network.on("dragEnd", function (event) {
                                // El evento contiene información sobre los nodos que se han movido
                                const nodesMoved = event.nodes; // Array de IDs de los nodos movidos
                                updatePositionAndEdgesOfNodes(nodesMoved, nodes, network);
                                network.redraw();
                            })
                        } else {
                            console.error("El contenido del archivo no es un arreglo JSON válido.");
                        }
                    } catch (error) {
                        console.error("ERROR al analizar el JSON:", error);
                    }
                };

                // Lee el contenido del archivo como texto
                fileReader.readAsText(selectedFile);
            })
            .catch(error => {
                console.error("ERROR:", error);
            });
    });

    // Agregamos un evento al boton Buscar Rutas
    buttonSearchRoute.addEventListener('click', async () => {
        console.log("-- BOTÓN BUSCAR RUTAS PRESIONADO --");
        if (canvasContainer.style.display === 'block') {
            if (inputSelectStartLocate.value !== "" && inputSelectEndLocate.value !== "") {
                console.log("--- OBTENIENDO RUTAS ---")
                console.log(`Nodo origen : ${inputSelectStartLocate.value}`);
                console.log(`Nodo destino : ${inputSelectEndLocate.value}`);
                routes = await sendDataToServer(nodes, inputSelectStartLocate.value, inputSelectEndLocate.value);
                console.log(`RUTAS: ${routes}`);
            } else {
                alert("Elija opciones válidas")
            }
        } else {
            let idStart = inputSelectStartLocate.value;
            let idEnd = inputSelectEndLocate.value;

            // Calculamos las rutas para cada entrada del punto de orgien y destino
            let positionsStart = points[idStart].entrances;
            let positionsEnd = points[idEnd].entrances;

            positionsStart.forEach((positionStart, i) => {
                positionsEnd.forEach((positionEnd, j) => {
                    console.log(`EntranceStart-${i}: ${positionStart}`);
                    console.log(`EntranceEnd-${j}: ${positionEnd}`);
                    getRoute(positionStart,positionEnd, map);
                })
            })

            //console.log("--- OBTENIENDO DIRECCIONES ---")
            //getDirections(positionStart,positionEnd, map)
        }
    })
});
