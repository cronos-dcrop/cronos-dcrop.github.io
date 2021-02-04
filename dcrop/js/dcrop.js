let connected = false;
let isStarted = false;

const options = Ayame.defaultOptions;
options.clientId = clientId ? clientId : options.clientId;
if (signalingKey) {
  options.signalingKey = signalingKey;
}
options.video.direction = 'recvonly';
options.audio.direction = 'recvonly';
let remoteVideo = null;
let conn;
const disconnect = () => {
  if (conn) {
    conn.disconnect();
  }
}
let dataChannel = null;
const label = 'dataChannel';
const startConn = async () => {
  options.video.codec = videoCodec;
  conn = Ayame.connection(signalingUrl, roomId, options, true);
  console.log("fromIframe >> RoomId = " + roomId);
  conn.on('connect', (e) => {
    connected = true;
  });
  conn.on('open', async (e) => {
    dataChannel = await conn.createDataChannel(label);
    if (dataChannel) {
      //dataChannel.onmessage = onMessage;
    }
  });
  conn.on('datachannel', (channel) => {
    if (!dataChannel) {
      dataChannel = channel;
      //dataChannel.onmessage = onMessage;
    }
  });
  conn.on('disconnect', (e) => {
    console.log(e);
    remoteVideo.srcObject = null;
    dataChannel = null;
    window.location.reload(1);
  });

  conn.on('addstream', (e) => {
    createVideoIfNotExistent();
    remoteVideo.srcObject = e.stream;
  });

  conn.connect(null);
};
document.querySelector("#roomIdInput").value = roomId;
let lblCameraName = document.getElementById("cameraName");
let cameraName = roomId;
cameraName = cameraName.replace("cronos-dcrop@", "");
lblCameraName.innerHTML = cameraName;
document.querySelector("#clientIdInput").value = options.clientId;

window.onload = function () {
  startConn();
  //checkAndReconnect();
  //consoleLog();
  start();
}

const sleep = ms => new Promise(resolve =>
  setTimeout(resolve, ms)
);

const start = async () => {
  if (!isStarted) {
    doWorkAsync();
  }
  isStarted = true;
}

async function doWorkAsync() {
  while (true) {
    await sleep(2000);
    if (!connected) {
      console.log("retrying to connect");
      window.location.reload(1);
    }
  }
}

function createVideoIfNotExistent() {
  if (remoteVideo == null) {
    var video = document.createElement("video");
    video.style.visibility = "visible";
    video.id = "remote-video";
    video.autoplay = "true";
    video.muted = "true";
    video.style.objectFit = "cover";
    video.onmouseover = function () {
      showControls();
    }
    video.onmouseleave = function () {
      hideControls();
    }

    document.getElementById("videoContainer").appendChild(video);
    remoteVideo = document.querySelector('#remote-video');
  }
}

function showControls() {
  let controls = document.getElementsByClassName("control");
  for (var i = 0; i < controls.length; i++) {
    let control = controls[i];
    control.style.visibility = "visible";
  }
}

function hideControls() {
  let controls = document.getElementsByClassName("control");
  for (var i = 0; i < controls.length; i++) {
    let control = controls[i];
    control.style.visibility = "hidden";
  }
  let popup = document.getElementById("cameraAdjustmentsMenu");
  popup.style.display = "";
}

function switchAspect() {
  if (remoteVideo != null) {
    let icon = document.getElementById("aspectControl");
    if (remoteVideo.style.objectFit == "cover") {
      remoteVideo.style.objectFit = "unset";
      icon.innerHTML = '<i class="fas fa-expand noselect"></i>';
    } else {
      remoteVideo.style.objectFit = "cover";
      icon.innerHTML = '<i class="fas fa-compress noselect"></i>';
    }
  }
}

function muteUnmute() {
  if (remoteVideo != null) {
    let icon = document.getElementById("speakerControl");
    if (remoteVideo.muted === false) {
      remoteVideo.muted = true;
      icon.innerHTML = '<i class="fas fa-volume-mute noselect"></i>';
    } else {
      remoteVideo.muted = false;
      icon.innerHTML = '<i class="fas fa-volume-up noselect"></i>';
    }
  }
}

function fullScreen() {
  if (remoteVideo != null) {
    openFullscreen(remoteVideo);
  }
}

function openFullscreen(myVideo) {
  var elem = myVideo
  console.log(elem)
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}