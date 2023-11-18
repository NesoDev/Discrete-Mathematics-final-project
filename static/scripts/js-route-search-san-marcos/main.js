
import { sendDataToServer } from "./api.js";
import { createEdgesVis, createNodesVis, renderNodesVis } from "./canvas-actions.js";
import { switchToMap, switchToVis, updatePositionAndEdgesOfNodes } from "./canvas-functions.js";
import { uploadJson } from "./event-functions.js";
import { fillInputs } from "./menu-functions.js";

let nodes;
let network; // Variable para mantener la instancia de la red vis.js
let routes = [];

document.addEventListener("DOMContentLoaded", () => {
    
    let canvas = document.querySelector(".canvas-container");
    let buttonUploadJson = document.querySelector(".button-upload-json");
    let inputSelectStartLocate = document.querySelector("#select-start-locate");
    let inputSelectEndLocate = document.querySelector("#select-end-locate");
    let buttonSearchRoute = document.querySelector(".button-search-route");
    let buttonShowMap = document.querySelector(".button-show-map");

    buttonShowMap.addEventListener('click', () => {
        switchToMap();
        fillInputs(inputSelectStartLocate, inputSelectEndLocate, []);
    })

    buttonUploadJson.addEventListener('click', () => {
        console.log("-- ABRIENDO EXPLORADOR DE ARCHIVOS --");

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

                            // Hacemos visible el canvas cantainer e invisilizamos al map container
                            switchToVis();

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
                            network = renderNodesVis(visNodes, visEdges, canvas);

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

    buttonSearchRoute.addEventListener('click', async () => {
        console.log("-- BOTÓN BUSCAR RUTAS PRESIONADO --");
        if (inputSelectStartLocate.value !== "" && inputSelectEndLocate.value !== "") {
            console.log(`Nodo origen : ${inputSelectStartLocate.value}`);
            console.log(`Nodo destino : ${inputSelectEndLocate.value}`);
            routes = await sendDataToServer(nodes, inputSelectStartLocate.value, inputSelectEndLocate.value);
            console.log(`RUTAS: ${routes}`);
        } else {
            if (!nodes) {
                alert("Carge un archivo Json");
            } else {
                alert("No ha seleccionado opciones válidas");
            }
        }
    })

    
});
