import { isSchedulesEmpty } from "./user_interface.js";

export default function createSchedules(schedules) {
    let schedulesHTML = [];
    console.log(`--- CREANDO HORARIOS HTML ---`);

    let sortedSchedules = sortSchedulesForHours(schedules);
    sortedSchedules.forEach((schedule, i) => {
        console.log(`HORARIO ${i} ORDENADO`);
        schedule.forEach((row, j) => {
            console.log(`row ${j} hora de inicio ${row[0].inicio}`);
        })
    })

    sortedSchedules.forEach((schedule, index) => {
        console.log(`** CREANDO HORARIO ${index} **`)
        schedulesHTML.push(createSchedule(schedule));
        console.log(`***--- HORARIO ${index} CREADO Y AGREGADO A SCHEDULES ---***`)
    });

    console.log(schedulesHTML);
    return schedulesHTML;
};

function sortSchedulesForHours(schedules) {
    let sortedSchedules = []
    schedules.forEach(schedule => {
        sortedSchedules.push(quicksortTimeArrays(schedule))
    })
    return sortedSchedules;
}

function quicksortTimeArrays(arrays) {
    return arrays.sort((a, b) => {
        const timeA = a[0].inicio;
        const timeB = b[0].inicio;

        // Convertimos las horas a Date
        const dateA = new Date(`2000-01-01T${timeA}`);
        const dateB = new Date(`2000-01-01T${timeB}`);

        // Obtenemos la diferencia en milesegundos
        return dateA - dateB;
    });
}

function createSchedule(schedule) {
    console.log("   Creando canvas HTML   ");
    let containerTableSchedule = document.createElement("div");
    containerTableSchedule.classList.add("container-table-schedule");

    console.log("   Creando tabla HTML  ");
    // Creamos una tabla
    let tableSchedule = document.createElement("table");
    tableSchedule.classList.add("table-schedule");

    console.log("   Creando cabecera HTML   ");
    // Creamos la cabecera
    let tHead = document.createElement("thead");
    tHead.classList.add("header-table-schedule");

    console.log("   Llenamos cabecera HTML   ");
    // LLenamos la cabecera
    let textContent = ["Hora", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    textContent.forEach(text => {
        let thHTML = document.createElement("th");
        thHTML.classList.add("header-schedule");
        thHTML.textContent = text;

        tHead.appendChild(thHTML)
    })
    console.log("   Agregamos la cabecera HTML a la tabla HTML  ");
    tableSchedule.appendChild(tHead);

    let courseColors = new Map();
    let pastelColors =  [
        "#FFD700",
        "#98FB98",
        "#FFA07A",
        "#DCD0FF",
        "#FFFF99",
        "#FFB6C1",
        "#B0E0E6",
        "#D3D3D3",
        "#FFB6C1",
        "#FFD700",
        "#ADD8E6",
        "#FF69B4",
        "#98FB98",
        "#DDA0DD",
        "#FF6347",
        "#7B68EE",
        "#B0C4DE",
        "#FFD700",
        "#AFEEEE"
    ]
    
    let colorIndex = 0;

    console.log("   Creando cuerpo HTML   ");
    
    let tBodyHTML = document.createElement("tbody");
    tBodyHTML.classList.add("table-body-schedule");

    console.log("   LLenamos cuerpo HTML   ");
    
    schedule.forEach((row, i) => {
        console.log(`----grupo ${i}----`);
        console.log(row);
        let trHTML = document.createElement("tr");

        let tdHTML = document.createElement("td");
        tdHTML.classList.add("container-hours-lapse");

        let hourInit = row[0].inicio;
        console.log(`hora de inicio : ${hourInit}`);

        let hourEnd = new Date(`2000-01-01T${hourInit}:00`);
        hourEnd.setHours(hourEnd.getHours() + 1);
        hourEnd = hourEnd.toTimeString().slice(0, 5);
        console.log(`hora de fin : ${hourEnd}`);

        tdHTML.textContent = `${hourInit} - ${hourEnd}`;
        console.log(`Hour cell : ${tdHTML.textContent}`);

        trHTML.appendChild(tdHTML);
        row.slice(0, row.length).forEach((cell, j) => {

            if (!courseColors.has(cell.id) && cell.id !== '*') {
                courseColors.set(cell.id, pastelColors[colorIndex++ % pastelColors.length]);
            }

            

            console.log(`----diccionario ${j}----`);
            console.log(cell);
            let tdHTML = document.createElement("td");
            tdHTML.classList.add("container-class");
            tdHTML.rowSpan = cell.row;
            tdHTML.textContent = cell.nombre;
            console.log(tdHTML.textContent)
            
            if (cell.id !== '*') {
                tdHTML.style.backgroundColor = courseColors.get(cell.id);
            }

            trHTML.appendChild(tdHTML);
        })

        tBodyHTML.appendChild(trHTML);
    })

    console.log("   Agregamos el cuerpo HTML a la tabla HTML  ");
    tableSchedule.appendChild(tBodyHTML);

    containerTableSchedule.appendChild(tableSchedule);

    return containerTableSchedule;
};

export function createIndicatorOfActualSchedule(overlaySection) {
    // Creamos un contenedor para el indicador de horario actual
    let containerIndicatorActualPage = document.createElement("div");
    containerIndicatorActualPage.classList.add("container-of-indicator-actual-page");

    let text1 = document.createElement("span");
    text1.classList.add("text-1-of-container-of-indicator-actual-page");
    text1.textContent = "Horario";
    containerIndicatorActualPage.appendChild(text1);

    // Creamos un indicador de horario actual
    let indicatorActualPage = document.createElement("div");
    indicatorActualPage.classList.add("indicator-actual-page");
    containerIndicatorActualPage.appendChild(indicatorActualPage);

    let text2 = document.createElement("span");
    text2.classList.add("text-2-of-container-of-indicator-actual-page");
    text2.textContent = "de";
    containerIndicatorActualPage.appendChild(text2);

    let quantitySchedules = document.createElement("span");
    quantitySchedules.classList.add("text-quantity-of-schedules");
    containerIndicatorActualPage.appendChild(quantitySchedules);

    overlaySection.appendChild(containerIndicatorActualPage);
}

function createScrollButtons() {
    let buttonBeforeSchedule = document.createElement("img");
    buttonBeforeSchedule.classList.add("button-scrooll-schedules");
    buttonBeforeSchedule.classList.add("button-before-schedule");
    buttonBeforeSchedule.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1699952412/11_rixjho.png";

    let buttonAfterSchedule = document.createElement("img");
    buttonAfterSchedule.classList.add("button-scrooll-schedules");
    buttonAfterSchedule.classList.add("button-after-schedule");
    buttonAfterSchedule.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1699952412/10_b1uefl.png";

    return { buttonBeforeSchedule, buttonAfterSchedule };
}

export function createCanvas(schedulesHTML, indexActualSchedule, overlaySection) {
    console.log("Creando canvas");
    let canvas = document.createElement("div");
    canvas.classList.add("canvas");
    if (!schedulesHTML || schedulesHTML.length === 0) {
        console.log("Schedules está vacío");
        canvas.appendChild(isSchedulesEmpty());
    } else {
        console.log("Creamos los botones");
        let { buttonBeforeSchedule, buttonAfterSchedule } = createScrollButtons();
        console.log("Agregamos el boton izquierdo");
        canvas.appendChild(buttonBeforeSchedule);
        console.log("Agregamos el scheduleHTML");
        canvas.appendChild(schedulesHTML[indexActualSchedule]);
        console.log("Agregamos el boton derecho");
        canvas.appendChild(buttonAfterSchedule);

        let actualPageIndicator = document.querySelector(".indicator-actual-page");
        actualPageIndicator.textContent = indexActualSchedule + 1;
    }

    overlaySection.appendChild(canvas);
}