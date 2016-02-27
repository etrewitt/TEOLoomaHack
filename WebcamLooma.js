console.log("test");

var chunks = [];

var constraints = {video: true};

// Put event listeners into place
window.addEventListener("DOMContentLoaded", function() {
    // Grab elements, create settings, etc.
    var canvas = document.getElementById("stillCanvas"),
        context = canvas.getContext("2d"),
        video = document.getElementById("video"),
        replayer = document.getElementById('videoCanvas');
        videoObj = { "video": true },
        errBack = function(error) {
            console.log("Video capture error: ", error.code); 
        }
        onSuccess = function(stream){
            video.src = window.URL.createObjectURL(stream);
            video.play();
            
            console.log("stream", stream);
            var mediaRecorder = new MediaRecorder(stream);

            document.getElementById("start").onclick = function() {
                chunks = [];
                mediaRecorder.start();
                console.log("recorder started");
            }

            document.getElementById("stop").onclick = function() {
                mediaRecorder.stop();
                console.log("recorder stopped");
                replayer.style.display = "block";
                document.getElementById("stillCanvas").style.display = "none";
            }

            mediaRecorder.ondataavailable = function(e) {
                console.log("data available");
                chunks.push(e.data);
            }

            mediaRecorder.onstop = function(e) {
                console.log('onstop fired');
                var blob = new Blob(chunks, { 'type' : 'video/ogv; codecs=opus' });
                replayer.src = window.URL.createObjectURL(blob);
            };

            mediaRecorder.onwarning = function(e) {
                console.log('onwarning fired');
            };

            mediaRecorder.onerror = function(e) {
                console.log('onerror fired');
            };
        };

    // Put video listeners into place
    if(navigator.getUserMedia) { // Standard
        console.log("navigator.getUserMedia");
        navigator.getUserMedia(videoObj, onSuccess, errBack);
    } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
        console.log("navigator.webkitGetUserMedia");
        navigator.webkitGetUserMedia(videoObj, onSuccess, errBack);
    } else if(navigator.mozGetUserMedia) { // WebKit-prefixed
        console.log("navigator.mozGetUserMedia");
        navigator.mozGetUserMedia(videoObj, onSuccess, errBack);
    }

    // Trigger photo take
    document.getElementById("snap").addEventListener("click", function() {
        context.drawImage(video, 0, 0, 640, 480);
        document.getElementById("stillCanvas").style.display = "block";
        document.getElementById("videoCanvas").style.display = "none";
    });
}, false);

var record = document.getElementById('start');
var stop = document.getElementById('stop');
var video = document.getElementById('videoCanvas');
video.setAttribute('controls', '');

var chunks = [];

var constraints = {video: true};

var onSuccess = function(stream) {
  console.log("stream", stream);
  var mediaRecorder = new MediaRecorder(stream);

  record.onclick = function() {
    chunks = [];
    mediaRecorder.start();
    console.log("recorder started");
  }

  stop.onclick = function() {
    mediaRecorder.stop();
    console.log("recorder stopped");
    video.style.display = "block";
    document.getElementById("stillCanvas").style.display = "none";
  }

  mediaRecorder.ondataavailable = function(e) {
    console.log("data available");
    chunks.push(e.data);
  }

  mediaRecorder.onstop = function(e) {
    console.log('onstop fired');
    var blob = new Blob(chunks, { 'type' : 'video/ogv; codecs=opus' });
    video.src = window.URL.createObjectURL(blob);
  };

  mediaRecorder.onwarning = function(e) {
    console.log('onwarning fired');
  };

  mediaRecorder.onerror = function(e) {
    console.log('onerror fired');
  };
};

var onError = function(err) {
  console.log('The following error occured: ' + err);
}

navigator.getUserMedia(constraints, onSuccess, onError);
