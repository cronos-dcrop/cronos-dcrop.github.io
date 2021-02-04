let dcropController = {};

//AWS
dcropController.controlUrl = "http://3.112.48.95:8080/execute?";
//LOCAL
//dcropController.controlUrl = "http://localhost:8080/execute?";

dcropController.makeRequest = function (method, url, data) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        if (method == "POST" && data) {
            xhr.send(data);
        } else {
            xhr.send();
        }
    });
}

dcropController.restartStream = function (dcropid) {
    if(dcropid){
        dcropid = String(dcropid).replace('cronos-dcrop@','');
    }
    var cmd = `${dcropController.controlUrl}command=restartStream&dcropid=${dcropid}`;
    dcropController.makeRequest('POST', cmd, {});
}