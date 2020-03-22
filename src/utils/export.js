export default function downLoad(content, fileName) {
    var aEle = document.createElement("a"),
        blob = new Blob([JSON.stringify(content, null, 4)]);
    aEle.download = fileName;
    aEle.href = URL.createObjectURL(blob);
    aEle.click();
}