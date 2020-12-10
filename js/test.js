var baseUrl = "./tester.html?roomId=cronos-dcrop@${camera-id}";

window.onload = function () {
    let parameters = getUrlParameters();
    openCamera(parameters);
}

function getUrlParameters() {
    var search = location.search.substring(1);
    if (search) {
        return JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) { return key === "" ? value : decodeURIComponent(value) })
    } else {
        return JSON.parse("{}");
    }
}

function openCamera(parameters) {
    if (parameters) {
        let url;
        if (parameters.cameraId) {
            url = baseUrl.replace('${camera-id}', parameters.cameraId);
        }

        if (parameters.signalingKey) {
            url += "&signalingKey=nlDKxZiEOiH_LSk79hK9lBqS6abY4-gBCEzNBL9tGUNkEGQ1";
        }

        if (parameters.h264) {
            url += "&videoCodec=H264";
        }
        console.log(parameters);
        let cameraDisplay = document.getElementById('cameraDisplay');

        cameraDisplay.src = url;
    }

}

function log(txt) {
    let logBox = document.getElementById("logBox");
    logBox.innerHTML += txt + '\n';
}