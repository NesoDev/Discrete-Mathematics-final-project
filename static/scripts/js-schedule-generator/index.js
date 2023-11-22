import { uploadFilePDF, addCourse, addSection, removeCourse, removeSection, updateCoursesObject, showOverLaySection, closeOverLaySection, sendCoursesButtonPressed } from "./events_actions.js";
import { renderCourses } from "./user_interface.js";
import { sendArchiveToTheServer } from "./api.js";


let body = document.querySelector("body");
let tableBody = document.querySelector("tbody");
let courses = [
    {
        "nombre": "curso 1",
        "secciones": [
            {
                "id": 0,
                "teoria": {
                    "dia": "Lunes",
                    "inicio": "08:00",
                    "fin": "10:00"
                },
                "practica": {
                    "dia": "Lunes",
                    "inicio": "10:00",
                    "fin": "12:00"
                },
                "preferencia": 2
            },
            {
                "id": 1,
                "teoria": {
                    "dia": "Martes",
                    "inicio": "14:00",
                    "fin": "16:00"
                },
                "practica": {
                    "dia": "Miércoles",
                    "inicio": "08:00",
                    "fin": "10:00"
                },
                "preferencia": 1
            }
        ]
    },
    {
        "nombre": "curso 2",
        "secciones": [
            {
                "id": 0,
                "teoria": {
                    "dia": "Jueves",
                    "inicio": "08:00",
                    "fin": "10:00"
                },
                "practica": {
                    "dia": "Viernes",
                    "inicio": "10:00",
                    "fin": "12:00"
                },
                "preferencia": 1
            },
            {
                "id": 1,
                "teoria": {
                    "dia": "Viernes",
                    "inicio": "14:00",
                    "fin": "16:00"
                },
                "practica": {
                    "dia": "Viernes",
                    "inicio": "16:00",
                    "fin": "18:00"
                },
                "preferencia": 2
            }
        ]
    },

    {
        "nombre": "curso 3",
        "secciones": [
            {
                "id": 0,
                "teoria": {
                    "dia": "Miércoles",
                    "inicio": "14:00",
                    "fin": "16:00"
                },
                "practica": {
                    "dia": "Miércoles",
                    "inicio": "16:00",
                    "fin": "18:00"
                },
                "preferencia": 2
            },
            {
                "id": 1,
                "teoria": {
                    "dia": "Sábado",
                    "inicio": "08:00",
                    "fin": "10:00"
                },
                "practica": {
                    "dia": "Sábado",
                    "inicio": "10:00",
                    "fin": "12:00"
                },
                "preferencia": 1
            }
        ]
    },
    {
        "nombre": "curso 4",
        "secciones": [
            {
                "id": 0,
                "teoria": {
                    "dia": "Sábado",
                    "inicio": "14:00",
                    "fin": "16:00"
                },
                "practica": {
                    "dia": "Sábado",
                    "inicio": "16:00",
                    "fin": "18:00"
                },
                "preferencia": 1
            },
            {
                "id": 1,
                "teoria": {
                    "dia": "Lunes",
                    "inicio": "14:00",
                    "fin": "16:00"
                },
                "practica": {
                    "dia": "Lunes",
                    "inicio": "16:00",
                    "fin": "18:00"
                },
                "preferencia": 2
            }
        ]
    },
    {
        "nombre": "curso 5",
        "secciones": [
            {
                "id": 0,
                "teoria": {
                    "dia": "Miércoles",
                    "inicio": "14:00",
                    "fin": "16:00"
                },
                "practica": {
                    "dia": "Miércoles",
                    "inicio": "16:00",
                    "fin": "18:00"
                },
                "preferencia": 2
            },
            {
                "id": 1,
                "teoria": {
                    "dia": "Jueves",
                    "inicio": "14:00",
                    "fin": "16:00"
                },
                "practica": {
                    "dia": "Jueves",
                    "inicio": "16:00",
                    "fin": "18:00"
                },
                "preferencia": 1
            }
        ]
    },
    {
        "nombre": "curso 6",
        "secciones": [
            {
                "id": 0,
                "teoria": {
                    "dia": "Martes",
                    "inicio": "10:00",
                    "fin": "12:00"
                },
                "practica": {
                    "dia": "Martes",
                    "inicio": "12:00",
                    "fin": "14:00"
                },
                "preferencia": 3
            },
            {
                "id": 1,
                "teoria": {
                    "dia": "Miércoles",
                    "inicio": "10:00",
                    "fin": "12:00"
                },
                "practica": {
                    "dia": "Miércoles",
                    "inicio": "12:00",
                    "fin": "14:00"
                },
                "preferencia": 2
            }
        ]
    },
    {
        "nombre": "curso 7",
        "secciones": [
            {
                "id": 0,
                "teoria": {
                    "dia": "Jueves",
                    "inicio": "10:00",
                    "fin": "12:00"
                },
                "practica": {
                    "dia": "Jueves",
                    "inicio": "12:00",
                    "fin": "14:00"
                },
                "preferencia": 1
            },
            {
                "id": 1,
                "teoria": {
                    "dia": "Viernes",
                    "inicio": "08:00",
                    "fin": "10:00"
                },
                "practica": {
                    "dia": "Viernes",
                    "inicio": "10:00",
                    "fin": "12:00"
                },
                "preferencia": 2
            }
        ]
    },
    {
        "nombre": "curso 8",
        "secciones": [
            {
                "id": 0,
                "teoria": {
                    "dia": "Lunes",
                    "inicio": "12:00",
                    "fin": "14:00"
                },
                "practica": {
                    "dia": "Lunes",
                    "inicio": "14:00",
                    "fin": "16:00"
                },
                "preferencia": 3
            },
            {
                "id": 1,
                "teoria": {
                    "dia": "Martes",
                    "inicio": "08:00",
                    "fin": "10:00"
                },
                "practica": {
                    "dia": "Martes",
                    "inicio": "10:00",
                    "fin": "12:00"
                },
                "preferencia": 1
            }
        ]
    }
];

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

document.addEventListener("DOMContentLoaded", function () {
    renderCourses(courses, tableBody);
    let inputNameCourse = document.getElementById("input-name-course");
    let buttonRegisterNameCourse = document.getElementById("button-register-name-course");
    let buttonUploadPdf = document.getElementById("button-load-pre-registration-form");
    let buttonGenerateSchedule = document.getElementById("button-generate-schedule");
    let table = document.querySelector("table");

    buttonRegisterNameCourse.addEventListener("click", function () {
        console.log("-- CURSO REGISTRADO --");
        let nameCourse = inputNameCourse.value;
        if (nameCourse.trim() != "") {
            addCourse(courses, nameCourse, tableBody);
            inputNameCourse.value = "";
        } else {
            alert(`¡ INGRESE EL NOMBRE DE UN CURSO VÁLIDO !`);
        }
    })

    buttonUploadPdf.addEventListener("click", function () {
        console.log("-- ABRIENDO EXPLORADOR DE ARCHIVOS --");

        uploadFilePDF()
            .then(selectedFile => {
                console.log("-- ENVIANDO ARCHIVO AL BACKEND --");
                return sendArchiveToTheServer(selectedFile);
            })
            .then(coursesFile => {
                console.log("-- DATOS RECIBIDOS DEL BACKEND --");
                console.log(courses);
                courses = coursesFile
                renderCourses(courses, tableBody);
            })
            .catch(error => {
                console.error("ERROR:", error);
            });
    });

    inputNameCourse.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            console.log("-- CURSO REGISTRADO --");
            let nameCourse = inputNameCourse.value;
            if (nameCourse.trim() != "") {
                addCourse(courses, nameCourse, tableBody);
                inputNameCourse.value = "";
            } else {
                alert(`¡ INGRESE EL NOMBRE DE UN CURSO VÁLIDO !`);
            }
        }
    });

    buttonGenerateSchedule.addEventListener("click", async function () {
        sendCoursesButtonPressed(courses, body);
    })

    table.addEventListener("click", function (event) {
        updateCoursesObject(courses);
        if (event.target.classList.contains("remove-section-img")) {
            let idButtonRemove = event.target.id;
            let idSection = parseInt(idButtonRemove.split("-")[4]);
            let idCourse = parseInt(idButtonRemove.split("-")[3]);

            removeSection(courses, idCourse, idSection, tableBody);
        }

        if (event.target.classList.contains("add-section-img")) {
            let idButtonAdd = event.target.id;
            let idCourse = parseInt(idButtonAdd.split("-")[3]);

            addSection(courses, idCourse, tableBody);
        }

        if (event.target.classList.contains("remove-course-img")) {
            let idButtonRemove = event.target.id;
            let idCourse = parseInt(idButtonRemove.split("-")[3]);

            removeCourse(courses, idCourse, tableBody);
        }
    });
})