
import { sendDataToServer, readJson } from "./api.js";
import { getRoute } from "./api-map-box.js";
import { createEdgesVis, createNodesVis, renderNodesVis, updatePositionAndEdgesOfNodes, switchToVis, drawRoutes} from "./canvas-functions.js";
import { addRouteToMap, createMap, switchToMap } from "./map-functions.js";
import { uploadJson } from "./canvas-functions.js";
import { fillInputs } from "./menu-functions.js";

let path = 'static/files/nodes_unmsm.json';
let nodes;
let points;
let network;
let routes = [];

document.addEventListener("DOMContentLoaded", async () => {

    let canvasContainer = document.querySelector(".canvas-container");
    let mapContainer = document.querySelector(".map-container");
    let buttonUploadJson = document.querySelector(".button-upload-json");
    let inputSelectStartLocate = document.querySelector("#select-start-locate");
    let inputSelectEndLocate = document.querySelector("#select-end-locate");
    let buttonSearchRoute = document.querySelector(".button-search-route");
    let buttonShowMap = document.querySelector(".button-show-map");

    let containerButtonHiddenShow = document.querySelector(".container-button-hidden-show");
    let buttonHidden = document.querySelector("#button-hidden-icon");
    let buttonShow = document.querySelector("#button-show-icon");

    let buttonExchangeInput = document.querySelector(".arrows-icon");

    
    const map = createMap();

    console.log("--- LEYENDO JSON ---")
    points = await readJson(path);
    console.log("--- JSON LEIDO ---")
    console.log(`Points: ${points}`)

    console.log("--- LLENAMOS LOS SELECTS ---")
    fillInputs(inputSelectStartLocate, inputSelectEndLocate, points);

    buttonShow.style.display = "none";

    containerButtonHiddenShow.addEventListener('click', function(event) {
        if (event.target === buttonHidden) {
            let containerInputsButton = document.querySelector(".container-inputs-button-show");
            containerInputsButton.classList.add('container-inputs-button-hidden');
            containerInputsButton.classList.remove('container-inputs-button-show');
            buttonHidden.style.display = 'none';
            buttonShow.style.display = 'block';
        }
        if (event.target === buttonShow) {
            let containerInputsButton = document.querySelector(".container-inputs-button-hidden");
            containerInputsButton.classList.add('container-inputs-button-show');
            containerInputsButton.classList.remove('container-inputs-button-hidden');
            buttonHidden.style.display = 'block';
            buttonShow.style.display = 'none';
        }
    });

    buttonExchangeInput.addEventListener('click', () => {
        [inputSelectStartLocate.value, inputSelectEndLocate.value] = [inputSelectEndLocate.value, inputSelectStartLocate.value]
    })

    buttonShowMap.addEventListener('click', () => {
        switchToMap();
        fillInputs(inputSelectStartLocate, inputSelectEndLocate, points);
    });

    buttonUploadJson.addEventListener('click', () => {
        console.log("-- ABRIENDO EXPLORADOR DE ARCHIVOS --");
        switchToVis();
        uploadJson()
            .then(selectedFile => {
                console.log("-- ANALIZANDO EL ARCHIVO JSON --");

                let fileReader = new FileReader();

                fileReader.onload = function (event) {
                    try {
                        nodes = JSON.parse(event.target.result);

                        if (Array.isArray(nodes)) {

                            fillInputs(inputSelectStartLocate, inputSelectEndLocate, nodes);

                            let visNodes = createNodesVis(nodes);
                            let visEdges = createEdgesVis(nodes);

                            if (network) {
                                network.destroy();
                            }

                            network = renderNodesVis(visNodes, visEdges, canvasContainer);

                            network.on("dragEnd", function (event) {
                                const nodesMoved = event.nodes;
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

                fileReader.readAsText(selectedFile);
            })
            .catch(error => {
                console.error("ERROR:", error);
            });
    });

    buttonSearchRoute.addEventListener('click', async () => {
        console.log("-- BOTÓN BUSCAR RUTAS PRESIONADO --");
        if (canvasContainer.style.display === 'block') {
            if (inputSelectStartLocate.value !== "" && inputSelectEndLocate.value !== "") {
                console.log("--- OBTENIENDO RUTAS ---")
                console.log(`Nodo origen : ${inputSelectStartLocate.value}`);
                console.log(`Nodo destino : ${inputSelectEndLocate.value}`);
                routes = await sendDataToServer(nodes, inputSelectStartLocate.value, inputSelectEndLocate.value);
                console.log(`RUTAS: ${routes}`);
                drawRoutes(routes, network);
            } else {
                alert("Elija opciones válidas")
            }
        } else {
            let idStart = inputSelectStartLocate.value;
            let idEnd = inputSelectEndLocate.value;

            let positionsStart = points[idStart].entrances;
            let positionsEnd = points[idEnd].entrances;

            positionsStart.forEach((positionStart, i) => {
                positionsEnd.forEach((positionEnd, j) => {
                    console.log(`EntranceStart-${i}: ${positionStart}`);
                    console.log(`EntranceEnd-${j}: ${positionEnd}`);
                    getRoute(positionStart,positionEnd, map);
                })
            })
        }
    })
});