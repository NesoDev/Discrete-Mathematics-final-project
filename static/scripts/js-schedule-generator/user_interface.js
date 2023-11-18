import { createCourseHTML, createSectionHTML } from "./course.js";

function isCoursesEmpty() {
    let containerTr = document.createElement("tr");

    let containerTd1 = document.createElement("td");

    let containerTd2 = document.createElement("td");
    containerTd2.colSpan = "5";

    let containerTd3 = document.createElement("td");

    let containerDiv = document.createElement("div");
    containerDiv.textContent = "No hay cursos registrados";
    containerDiv.style = `
        padding: 80px; display: flex; 
        justify-content: center; 
        align-items: center; 
        color: #643dff;
        border-radius: 0.2rem; 
        background: rgba(179, 141, 255, 0.3);
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        border: 1px solid #fff;
        backdrop-filter: blur(2px);
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        font-size: 25px;
    `;

    containerTd2.appendChild(containerDiv);
    containerTr.appendChild(containerTd1);
    containerTr.appendChild(containerTd2);
    containerTr.appendChild(containerTd3);

    return containerTr;
}

export function renderCourses(courses, tableBody) {
    console.log(`-- RENDERIZANDO CURSOS --`);
    console.log(courses);
    tableBody.innerHTML = "";

    if (!courses || courses.length === 0) {
        tableBody.appendChild(isCoursesEmpty());
    } else {
        courses.forEach((course, idCourse) => {
            console.log(`-- RENDERIZANDO CURSO ${idCourse} --`);
            let newCourse = createCourseHTML(course.nombre, idCourse, course.secciones.length);
            tableBody.appendChild(newCourse);
            course.secciones.forEach((section, sectionNumber) => {
                console.log(`-- RENDERIZANDO SECCION ${sectionNumber} --`);
                let newSection = createSectionHTML(courses, idCourse, sectionNumber);
                if (section.id === 0) {
                    let sectionChildrens = Array.from(newSection.children);
                    sectionChildrens.forEach(children => {
                        newCourse.appendChild(children);
                    });
                } else {
                    tableBody.appendChild(newSection);
                }
            });
        });
    }
}

export function isSchedulesEmpty() {
    let textMessage = document.createElement("h3")
    textMessage.textContent = "No fue posible generar un horario";
    textMessage.style.cssText = `
        font-family: 'Raleway', sans-serif;
        font-size: 25px;
        font-weight: 300;
        color: white;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    `;

    return textMessage;
}