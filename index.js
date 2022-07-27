// const { data } = require("cheerio/lib/api/attributes");

let file = document.querySelector(".file");
let key = document.querySelector(".key");
let encodeButton = document.querySelector(".encode-button");
let decodeButton = document.querySelector(".decode-button");
let areaOne = document.querySelector(".step-one");
let areaTwo = document.querySelector(".step-two");
let output = document.querySelector(".output");
let load = document.querySelector(".load");
encodeButton.addEventListener('click', async e => {
    if (file.files[0] && key.value) {
        console.log(file.files[0]);
        load.classList.remove('hide');
        output.classList.add('hide');
        let fr = new FileReader();
        fr.onload = e => {
            let data64 = e.target.result;
            let cypher = CryptoJS.AES.encrypt(data64, key.value).toString();
            let cypherFile = renderFile(cypher, file.files[0].name + "cypher", file.files[0].type);
            output.href = URL.createObjectURL(cypherFile);
            output.download = "enscript-" + file.files[0].name;
            output.classList.remove("hide");
            load.classList.add("hi  de");
        }
        fr.readAsDataURL(file.files[0]);
    }
    else {
        alert(!file.files[0] ? "Select file" : !key.value ? "Enter key" : "");
    }
});
decodeButton.addEventListener('click', e => {
    if (file.files[0] && key.value) {
        console.log(file.files[0]);
        output.classList.add('hide');
        load.classList.remove('hide');
        let fr = new FileReader();
        fr.onload = e => {
            let cypherText = e.target.result;
            try {
                let data64 = CryptoJS.AES.decrypt(cypherText, key.value).toString(CryptoJS.enc.Utf8);
                fetch(data64)
                .then(response => response.blob())
                .then(blob => {
                    let dataFile = renderFile(blob, file.files[0].name + "cypher", file.files[0].type);
                    output.href = URL.createObjectURL(dataFile);
                    output.download = "descrypt-" + file.files[0].name;
                    output.classList.remove("hide");
                    load.classList.add("hide");
                });
            } catch (error) {
                alert("Cannot descrypt with this key");
            }
        }
        fr.readAsText(file.files[0]);
    }
    else {
        alert(!file.files[0] ? "Select file" : !key.value ? "Enter key" : "");
    }
});

function renderFile(data64, fileName, fileType) {
    let file = new File([data64], fileName, { type: fileType });
    console.log(file);
    return file;
}