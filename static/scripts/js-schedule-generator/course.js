export function createSectionHTML(courses, idCourse, numberSection) {
    let sectionRow = document.createElement("tr");
    sectionRow.classList.add("sectionRow");
    sectionRow.id = "course-" + String(idCourse) + "-" + String(numberSection);
    /**************************************************************************************/

    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<    NUMBER SECTION    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    let sectionCell = document.createElement("td");
    sectionCell.classList.add("section-cell");
    sectionCell.textContent = numberSection + 1;

    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<    THEORY    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    let scheduleCellTheory = document.createElement("td");
    scheduleCellTheory.classList.add("schedule-cell-theory");
    /*------------------------------------------------------------------------------------*/
    let days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    /*------------------------------------------------------------------------------------*/
    let divScheduleCellTheory = document.createElement("div");
    divScheduleCellTheory.classList.add("div-schedule-cell");
    /*------------------------------------------------------------------------------------*/
    let daySelectTheory = document.createElement("select");
    daySelectTheory.classList.add("day-select-theory");
    daySelectTheory.id = "day-select-theory-" + String(idCourse) + "-" + String(numberSection);
    days.forEach(day => {
        let option = document.createElement("option");
        option.textContent = day;
        daySelectTheory.append(option);
    });
    daySelectTheory.value = courses[idCourse].secciones[numberSection].teoria.dia;
    /*------------------------------------------------------------------------------------*/
    let timeInputStartTheory = document.createElement("input");
    timeInputStartTheory.classList.add("time-input-start-theory");
    timeInputStartTheory.id = "time-input-start-theory-" + String(idCourse) + "-" + String(numberSection);
    timeInputStartTheory.type = "time";
    timeInputStartTheory.value = courses[idCourse].secciones[numberSection].teoria.inicio;
    /*------------------------------------------------------------------------------------*/
    let timeInputEndTheory = document.createElement("input");
    timeInputEndTheory.classList.add("time-input-end-theory");
    timeInputEndTheory.id = "time-input-end-theory-" + String(idCourse) + "-" + String(numberSection);
    timeInputEndTheory.type = "time";
    timeInputEndTheory.value = courses[idCourse].secciones[numberSection].teoria.fin;
    /*------------------------------------------------------------------------------------*/
    divScheduleCellTheory.appendChild(daySelectTheory);
    divScheduleCellTheory.appendChild(timeInputStartTheory);
    divScheduleCellTheory.appendChild(timeInputEndTheory);
    /*------------------------------------------------------------------------------------*/
    scheduleCellTheory.appendChild(divScheduleCellTheory);

    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<    PRACTICE    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    let scheduleCellPractice = document.createElement("td");
    scheduleCellPractice.classList.add("schedule-cell-practice");
    /*------------------------------------------------------------------------------------*/
    let divScheduleCellPractice = document.createElement("div");
    divScheduleCellPractice.classList.add("div-schedule-cell");
    /*------------------------------------------------------------------------------------*/
    let daySelectPractice = document.createElement("select");
    daySelectPractice.classList.add("day-select-practice");
    daySelectPractice.id = "day-select-practice-" + String(idCourse) + "-" + String(numberSection);
    days.forEach(day => {
        let option = document.createElement("option");
        option.textContent = day;
        daySelectPractice.append(option);
    });
    daySelectPractice.value = courses[idCourse].secciones[numberSection].practica.dia;
    /*------------------------------------------------------------------------------------*/
    let timeInputStartPractice = document.createElement("input");
    timeInputStartPractice.classList.add("time-input-start-practice");
    timeInputStartPractice.id = "time-input-start-practice-" + String(idCourse) + "-" + String(numberSection);
    timeInputStartPractice.type = "time";
    timeInputStartPractice.value = courses[idCourse].secciones[numberSection].practica.inicio;
    /*------------------------------------------------------------------------------------*/
    let timeInputEndPractice = document.createElement("input");
    timeInputEndPractice.classList.add("time-input-end-practice");
    timeInputEndPractice.id = "time-input-end-practice-" + String(idCourse) + "-" + String(numberSection);
    timeInputEndPractice.type = "time";
    timeInputEndPractice.value = courses[idCourse].secciones[numberSection].practica.fin;
    /*------------------------------------------------------------------------------------*/
    divScheduleCellPractice.appendChild(daySelectPractice);
    divScheduleCellPractice.appendChild(timeInputStartPractice);
    divScheduleCellPractice.appendChild(timeInputEndPractice);
    /*------------------------------------------------------------------------------------*/
    scheduleCellPractice.appendChild(divScheduleCellPractice);

    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<    PREFERENCE    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    let preferenceCell = document.createElement("td");
    preferenceCell.classList.add("preference-cell");
    /*------------------------------------------------------------------------------------*/
    let preferenceInput = document.createElement("input");
    preferenceInput.classList.add("preference-input");
    preferenceInput.id = "preference-input-" + String(idCourse) + "-" + String(numberSection);
    preferenceInput.type = "number";
    //preferenceInput.placeholder = "0";
    preferenceInput.value = courses[idCourse].secciones[numberSection].preferencia;
    /*------------------------------------------------------------------------------------*/
    preferenceCell.appendChild(preferenceInput);

    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<    BUTTONS SECTION    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    let sectionButtons = document.createElement("td");
    sectionButtons.classList.add("section-buttons");
    sectionButtons.rowSpan = "1";
    /*------------------------------------------------------------------------------------*/
    let sectionButtonsImgContainer = document.createElement("div");
    sectionButtonsImgContainer.classList.add("section-buttons-img-container");
    /*------------------------------------------------------------------------------------*/
    let imgButtonAddSection = document.createElement("img");
    imgButtonAddSection.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1696465691/Coming_Soon_3_-PhotoRoom.png-PhotoRoom_bnwpyn.png";
    imgButtonAddSection.classList.add("add-section-img");
    imgButtonAddSection.id = "add-section-img-" + String(idCourse) + "-" + String(numberSection);
    /*------------------------------------------------------------------------------------*/
    let imgButtonRemoveSection = document.createElement("img");
    imgButtonRemoveSection.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1696463672/Coming_Soon_1_-PhotoRoom.png-PhotoRoom_deujxe.png";
    imgButtonRemoveSection.classList.add("remove-section-img");
    imgButtonRemoveSection.id = "remove-section-img-" + String(idCourse) + "-" + String(numberSection);

    let curso = courses[idCourse];
    if (numberSection != curso.secciones.length - 1) {
        imgButtonAddSection.style.display = "none";
        imgButtonRemoveSection.style.display = "none";
    }
    if (curso.secciones.length == 1) {
        imgButtonRemoveSection.style.display = "none";
    }
    /*------------------------------------------------------------------------------------*/
    sectionButtonsImgContainer.appendChild(imgButtonAddSection);
    sectionButtonsImgContainer.appendChild(imgButtonRemoveSection);
    /*------------------------------------------------------------------------------------*/
    sectionButtons.appendChild(sectionButtonsImgContainer);
    /**************************************************************************************/
    sectionRow.appendChild(sectionCell);
    sectionRow.appendChild(scheduleCellTheory);
    sectionRow.appendChild(scheduleCellPractice);
    sectionRow.appendChild(preferenceCell);
    sectionRow.appendChild(sectionButtons);

    return sectionRow;
}

export function createCourseHTML(courseName, idCourse, quantitySections) {
    let courseRow = document.createElement("tr");
    courseRow.classList.add("course-row");
    courseRow.id = "course-row-" + String(idCourse);

    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<< BUTTON REMOVE COURSE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    let removeCourseCell = document.createElement("td");
    removeCourseCell.classList.add("course-button-remove");

    removeCourseCell.rowSpan = String(quantitySections);
    /*------------------------------------------------------------------------------------*/
    let divRemoveCourseCell = document.createElement("div");
    divRemoveCourseCell.classList.add("course-button-remove-img-container");
    /*------------------------------------------------------------------------------------*/
    let imgRemoveCourse = document.createElement("img");
    imgRemoveCourse.classList.add("remove-course-img");
    imgRemoveCourse.id = "course-button-remove-" + String(idCourse);
    imgRemoveCourse.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1696463672/Coming_Soon_1_-PhotoRoom.png-PhotoRoom_deujxe.png";
    /*------------------------------------------------------------------------------------*/
    divRemoveCourseCell.appendChild(imgRemoveCourse);
    removeCourseCell.appendChild(divRemoveCourseCell);
    /*------------------------------------------------------------------------------------*/
    courseRow.appendChild(removeCourseCell);

    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< COURSE NAME >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    let courseNameCell = document.createElement("td");
    courseNameCell.rowSpan = String(quantitySections);
    courseNameCell.classList.add("course-name-cell");
    courseNameCell.textContent = courseName;
    courseNameCell.id = "course-name-cell-" + String(idCourse);
    /*------------------------------------------------------------------------------------*/
    courseRow.appendChild(courseNameCell);

    return courseRow;
}