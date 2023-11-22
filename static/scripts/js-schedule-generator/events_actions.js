import { renderCourses } from "./user_interface.js";
import { sendCoursesToTheServer } from "./api.js";
import { createCanvas, createIndicatorOfActualSchedule } from "./schedule_actions.js";
const { jsPDF } = window.jspdf;

export function uploadFilePDF() {
    return new Promise((resolve, reject) => {
        let inputPDF = document.createElement("input");
        inputPDF.type = "file";
        inputPDF.accept = ".pdf";
        inputPDF.click();
        inputPDF.addEventListener("change", function () {
            let selectedFile = inputPDF.files[0];
            console.log("ARCHIVO SELECCIONADO: ", selectedFile.name);
            resolve(selectedFile);
        });
    });
}

export function addCourse(courses, nameCourse, tableBody) {
    console.log(`-- AGREGANDO CURSO --`);
    let idCourse = courses.findIndex(course => course.nombre === nameCourse);
    if (idCourse == -1) {
        console.log(`El curso ${nameCourse} aun no estaba registrado`)
        let newCourse = {
            nombre: nameCourse,
            secciones: [
            ]
        };
        courses.push(newCourse);
        idCourse = courses.findIndex(course => course.nombre === nameCourse);
        addSection(courses, idCourse, tableBody);
    } else if (courses.length !== 0) {
        console.log(`El curso ${nameCourse} ya estaba registrado`);
        addSection(courses, idCourse, tableBody);
    }
}

export function removeCourse(courses, idCourse, tableBody) {
    console.log(`-- ELIMINANDO CURSO --`);
    if (idCourse >= 0 && idCourse < courses.length) {
        courses.splice(idCourse, 1);
        renderCourses(courses, tableBody);
    }
}

export function addSection(courses, idCourse, tableBody) {
    console.log(`-- AGREGANDO NUEVA SECCION --`);
    let course = courses[idCourse];
    let idSection = course.secciones.length;

    let newSection = {
        id: idSection,
        teoria: {
            dia: "",
            inicio: "00:00",
            fin: "00:00",
        },
        practica: {
            dia: "",
            inicio: "00:00",
            fin: "00:00",
        },
        preferencia: 0
    };
    course.secciones.push(newSection);
    renderCourses(courses, tableBody);
}

export function removeSection(courses, idCourse, numberSection, tableBody) {
    console.log(`-- ELIMINANDO SECCION ${numberSection} del curso ${idCourse} ---`);
    let course = courses[idCourse];
    if (numberSection >= 0 && numberSection < course.secciones.length) {
        course.secciones.splice(numberSection, 1);
        renderCourses(courses, tableBody);
    }
}

export function updateCoursesObject(courses) {
    courses.forEach((course, idCourse) => {
        console.log(`--- ACTUALIZANDO DICCIONARIO ---`);
        console.log(`-- ACTUALIZANDO CURSO ${idCourse} --`);
        course.secciones.forEach((section, sectionNumber) => {
            console.log(`-- ACTUALIZANDO SECCION ${sectionNumber} --`);

            let daySelectTheory = document.getElementById(`day-select-theory-${idCourse}-${sectionNumber}`);
            let timeInputStartTheory = document.getElementById(`time-input-start-theory-${idCourse}-${sectionNumber}`);
            let timeInputEndTheory = document.getElementById(`time-input-end-theory-${idCourse}-${sectionNumber}`);

            let daySelectPractice = document.getElementById(`day-select-practice-${idCourse}-${sectionNumber}`);
            let timeInputStartPractice = document.getElementById(`time-input-start-practice-${idCourse}-${sectionNumber}`);
            let timeInputEndPractice = document.getElementById(`time-input-end-practice-${idCourse}-${sectionNumber}`);

            let preferenceInput = document.getElementById(`preference-input-${idCourse}-${sectionNumber}`);

            section.teoria.dia = daySelectTheory.value;
            section.teoria.inicio = timeInputStartTheory.value;
            section.teoria.fin = timeInputEndTheory.value;
            console.log(`- Teoría: ${daySelectTheory.value} de ${timeInputStartTheory.value} a ${timeInputEndTheory.value}`);
            section.practica.dia = daySelectPractice.value;
            section.practica.inicio = timeInputStartPractice.value;
            section.practica.fin = timeInputEndPractice.value;
            console.log(`- Práctica: ${daySelectPractice.value} de ${timeInputStartPractice.value} a ${timeInputEndPractice.value}`);
            section.preferencia = preferenceInput.value;
        });
    });
    console.log(`-- ACTUALIZANDO DICCIONARIO CURSOS --`);
    console.log(courses);
}

export async function showOverLaySection(overlappedElement) {
    if (window.scrollY !== 0) {
        await returnToTop();
    }
    console.log("-- YA ESTAMOS EN LA PARTE SUPERIOR --");

    console.log("  EMPEZAMOS A CREAR LA CAPA SOLAPANTE  ");
    // Creamos la capa solapante
    let overlaySection = document.createElement("section");
    overlaySection.classList.add('overlay-section');
    overlaySection.id = 'overlay-section';
    overlaySection.classList.add('show');

    document.querySelector("header").classList.add("header-over-lay");

    let headerOfOverLay = document.createElement("div");
    headerOfOverLay.classList.add('header-of-overlay');

    let divIconLeft = document.createElement("div");
    let imgIconBack = document.createElement("img");
    divIconLeft.classList.add("div-icon-left");
    let containerImgIconBack = document.createElement("div");
    containerImgIconBack.classList.add("container-img-icon-back");
    imgIconBack.classList.add("icon-of-header-over-lay");
    imgIconBack.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1699839878/back_icon_vak79d.png";

    containerImgIconBack.appendChild(imgIconBack)

    divIconLeft.appendChild(containerImgIconBack);

    let divIconRight = document.createElement("div");
    let imgIconDownload = document.createElement("img");
    divIconRight.classList.add("div-icon-right");
    let containerImgIconDownload = document.createElement("div");
    containerImgIconDownload.classList.add("container-img-icon-download");
    imgIconDownload.classList.add("icon-of-header-over-lay");
    imgIconDownload.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1699840238/download-icon_iszxzg.png";

    containerImgIconDownload.appendChild(imgIconDownload);

    let imgIconAnime = document.createElement("img");
    imgIconAnime.classList.add("icon-anime-of-header-over-lay");
    imgIconAnime.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1699839849/anime_girl_nyvdoe.gif";

    divIconRight.appendChild(containerImgIconDownload);
    divIconRight.appendChild(imgIconAnime);

    headerOfOverLay.appendChild(divIconLeft);
    headerOfOverLay.appendChild(divIconRight);

    overlaySection.appendChild(headerOfOverLay);

    overlappedElement.classList.add('no-scroll');

    document.querySelector(".logo-nesoApp").classList.add("logo-nesoApp-over-lay");
    document.querySelector(".name-app").classList.add("name-app-over-lay");

    overlappedElement.appendChild(overlaySection);

    return document.querySelector(".overlay-section");
}

export function closeOverLaySection(overlappedElement, overlappingElement) {
    overlappingElement.remove();
    overlappedElement.classList.remove("no-scroll");
    document.querySelector("header").classList.remove("header-over-lay");
    document.querySelector(".logo-nesoApp").classList.remove("logo-nesoApp-over-lay");
    document.querySelector(".name-app").classList.remove("name-app-over-lay");
}

function returnToTop() {
    return new Promise(resolve => {
        let targetElement = document.querySelector("body");

        const targetOffset = targetElement.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
        });

        window.addEventListener('scroll', function handler() {
            if (window.scrollY === targetOffset) {
                window.removeEventListener('scroll', handler);
                resolve();
            }
        });
    });
}

export async function sendCoursesButtonPressed(courses, body) {
    try {
        console.log("-- BUTTON SEND COURSES PRESIONADO --");
        if (!courses || courses.length === 0) {
            alert(`¡ NO EXISTEN CURSOS REGISTRADOS !`);
        } else {
            updateCoursesObject(courses);
            console.log(`-- ENVIANDO DATOS AL BACKEND --`);

            const overlaySection = await showOverLaySection(body);

            console.log("overLaySection terminó de crearse");

            let headerOfOverLaySection = document.querySelector(".header-of-overlay");
            headerOfOverLaySection.addEventListener("mouseover", () => {
                headerOfOverLaySection.style.opacity = 1;
            });

            setTimeout(() => {
                headerOfOverLaySection.style.opacity = 0;
            }, 3000);

            headerOfOverLaySection.addEventListener("mouseleave", () => {
                setTimeout(() => {
                    headerOfOverLaySection.style.opacity = 0;
                }, 3000);
            });

            let buttonBackOfHeaderOfOverLaySection = document.querySelector(".container-img-icon-back");

            buttonBackOfHeaderOfOverLaySection.addEventListener("click", function () {
                console.log("Botón hacia atrás presionado");
                closeOverLaySection(body, overlaySection);
            });

            let buttondownloadOfHeaderOfOverLaySection = document.querySelector(".container-img-icon-download");

            buttondownloadOfHeaderOfOverLaySection.addEventListener("click", () => {
                let scheduleToDownload = document.querySelector(".container-table-schedule");
            
                const rect = scheduleToDownload.getBoundingClientRect();
                const realWidth = rect.width;
                const realHeight = rect.height;
            
                var PDF_Width = realWidth;
                var PDF_Height = realHeight;
            
                var canvas_image_width = PDF_Width;
                var canvas_image_height = PDF_Height;
            
                html2canvas(scheduleToDownload).then(function (canvas) {
                    var imgData = canvas.toDataURL("image/jpeg", 1.0);
                    var pdf = new jsPDF('landscape', 'pt', [PDF_Width, PDF_Height]);
                    pdf.addImage(imgData, 'JPEG', 0, 0, canvas_image_width, canvas_image_height); // Usar (0, 0) como posición
            
                    pdf.save("nesoHorario.pdf");
                });
            });
            

            overlaySection.addEventListener("click", function (event) {
                if (event.target === overlaySection) {
                    closeOverLaySection(body, overlaySection);
                }
            });

            const schedulesHTML = await sendCoursesToTheServer(courses);

            console.log(`Schedules HTML: ${schedulesHTML}`);

            createIndicatorOfActualSchedule(overlaySection);

            let indexActualSchedule = 0;
            createCanvas(schedulesHTML, indexActualSchedule, overlaySection);

            let textQuantityOfSchedules = document.querySelector(".text-quantity-of-schedules");
            textQuantityOfSchedules.textContent = schedulesHTML.length;

            let buttonBeforeSchedule = document.querySelector(".button-before-schedule");
            let buttonAfterSchedule = document.querySelector(".button-after-schedule");

            buttonBeforeSchedule.addEventListener('click', () => {
                console.log("Botón hacia atrás presionado");
                indexActualSchedule = previousSchedule(indexActualSchedule, schedulesHTML, overlaySection);
            });

            buttonAfterSchedule.addEventListener('click', () => {
                console.log("Botón hacia adelante presionado");
                indexActualSchedule = nextSchedule(indexActualSchedule, schedulesHTML, overlaySection);
            });

        }
    } catch (error) {
        console.error('Error en el manejo de la promesa:', error);
    }
}

function nextSchedule(indexActualSchedule, schedulesHTML, overlaySection) {
    if (indexActualSchedule < schedulesHTML.length - 1) {
        indexActualSchedule += 1;
        console.log(`Horario Actual : ${indexActualSchedule}`);
        let canvas = document.querySelector(".canvas");
        let displayedSchedule = document.querySelector(".container-table-schedule");
        canvas.replaceChild(schedulesHTML[indexActualSchedule], displayedSchedule)

        let actualSchedule = document.querySelector(".indicator-actual-page");
        actualSchedule.textContent = indexActualSchedule + 1;
    }
    return indexActualSchedule;
}

function previousSchedule(indexActualSchedule, schedulesHTML, overlaySection) {
    if (indexActualSchedule > 0) {
        indexActualSchedule -= 1;
        console.log(`Horario Actual : ${indexActualSchedule}`);
        let canvas = document.querySelector(".canvas");
        let displayedSchedule = document.querySelector(".container-table-schedule");
        canvas.replaceChild(schedulesHTML[indexActualSchedule], displayedSchedule);

        let actualSchedule = document.querySelector(".indicator-actual-page");
        actualSchedule.textContent = indexActualSchedule + 1;
    }
    return indexActualSchedule;
}
