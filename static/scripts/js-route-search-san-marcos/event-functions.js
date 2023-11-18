export function uploadJson(){
    return new Promise((resolve) => {
        let inputJson = document.createElement("input");
        inputJson.type = "file";
        inputJson.accept = ".json";
        inputJson.click();
        inputJson.addEventListener("change", function () {
            let selectedFile = inputJson.files[0];
            console.log("ARCHIVO SELECCIONADO: ", selectedFile.name);
            resolve(selectedFile);
        });
    });
}