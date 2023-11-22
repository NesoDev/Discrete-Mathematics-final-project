export function fillInputs(inputStartNodes, inputEndNodes, nodes) {
    inputStartNodes.innerHTML = "";
    inputEndNodes.innerHTML = "";

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
        let optionStart = document.createElement("option");
        optionStart.value = node.id;
        optionStart.textContent = ('name' in node)?`${node.name}`:`Nodo ${node.id}`;
        inputStartNodes.appendChild(optionStart);

        let optionEnd = document.createElement("option");
        optionEnd.value = node.id;
        optionEnd.textContent = ('name' in node)?`${node.name}`:`Nodo ${node.id}`;
        inputEndNodes.appendChild(optionEnd);
    });
}