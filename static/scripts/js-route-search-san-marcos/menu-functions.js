export function fillInputs(inputStartNodes, inputEndNodes, nodes) {
    //Eliminamos el contenido anterior de ambos select
    inputStartNodes.innerHTML = "";
    inputEndNodes.innerHTML = "";

    // Agregamos las opciones por defecto para cada select
    let optionDefaultStart = document.createElement("option");
    optionDefaultStart.value = "";
    optionDefaultStart.disabled = true;
    optionDefaultStart.selected = true;
    optionDefaultStart.textContent = "Seleccione su origen";
    inputStartNodes.appendChild(optionDefaultStart);

    let optionDefaultEnd = document.createElement("option");
    optionDefaultEnd.value = "";
    optionDefaultEnd.disabled = true;
    optionDefaultEnd.selected = true;
    optionDefaultEnd.textContent = "Seleccione su destino";
    inputEndNodes.appendChild(optionDefaultEnd);

    console.log(`Tipo de points: ${typeof(nodes)}`);
    nodes.forEach(node => {
        // Crear una etiqueta option para inputStartNodes
        let optionStart = document.createElement("option");
        optionStart.value = node.id;
        optionStart.textContent = ('name' in node)?`${node.name}`:`Nodo ${node.id}`;
        inputStartNodes.appendChild(optionStart);

        // Crear una etiqueta option para inputEndNodes
        let optionEnd = document.createElement("option");
        optionEnd.value = node.id;
        optionEnd.textContent = ('name' in node)?`${node.name}`:`Nodo ${node.id}`;
        inputEndNodes.appendChild(optionEnd);
    });
}