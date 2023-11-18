
export async function sendDataToServer(nodesArray, idNodeStart, idNodeEnd) {
    try {
        let data = {'node_start_id':idNodeStart, 'node_end_id':idNodeEnd, 'nodes':nodesArray};

        const response = await fetch("/route-min/api/calculate-routes-min", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const processedData = await response.json();
        console.log("-- RECIBIENDO DATOS DEL BACKEND --");
        console.log(processedData);

        return processedData;
    } catch (error) {
        console.error("ERROR AL REALIZAR LA SOLICITUD AL BACKEND: ", error);
        throw error;
    }
}

