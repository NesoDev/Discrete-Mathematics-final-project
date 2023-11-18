import createSchedules from "./schedule_actions.js";

export async function sendCoursesToTheServer(courses) {
    try {
        const response = await fetch("/schedule-generator/api/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(courses),
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const processedData = await response.json();
        console.log("-- RECIBIENDO DATOS DEL BACKEND --");
        console.log(processedData);

        return createSchedules(processedData);
    } catch (error) {
        console.error("ERROR AL REALIZAR LA SOLICITUD AL BACKEND: ", error);
        throw error;
    }
}

export async function sendArchiveToTheServer(file) {
    const formData = new FormData();
    formData.append("pdf", file, file.name);

    try {
        const response = await fetch("/schedule-generator/api/file-upload", {
            method: "POST",
            body: formData
        });
        const coursesObject = await response.json();
        console.log("-- RECIBIENDO DATOS DEL BACKEND --");
        console.log(coursesObject);
        return coursesObject;
    } catch (error) {
        console.error("ERROR AL REALIZAR LA SOLICITUD AL BACKEND: ", error);
        throw error;
    }
}