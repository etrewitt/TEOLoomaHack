//var RecordRTC = require('recordrtc');
//var recorder = RecordRTC(mediaStream, { type: 'audio'});

console.log("test");

var chunks = [];

var constraints = {video: true};

var COUNTER = 0;

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
            console.log("onSuccess");
            video.src = window.URL.createObjectURL(stream);
            video.play();
            
            console.log("stream", stream);
//            var mediaRecorder = new MediaRecorder(stream);
            var recordRTC = RecordRTC(stream, {
                type: 'video' // audio or video or gif or canvas
            });

            document.getElementById("start").onclick = function() {
                chunks = [];
//                mediaRecorder.start();
                recordRTC.startRecording();
                console.log("recorder started");
            }

            document.getElementById("stop").onclick = function() {
//                mediaRecorder.stop();
                recordRTC.stopRecording();
                console.log("recorder stopped");
                replayer.style.display = "block";
                document.getElementById("stillCanvas").style.display = "none";
            }
            
            document.getElementById("save").onclick = function() {
                COUNTER = COUNTER + 1;
//                var uri = canvas.toDataURL();
                var uri = recordRTC.toURL();
                console.log(uri);
                localStorage.setItem(COUNTER, uri.toString());
            }
            
            document.getElementById("view").onclick = function() {
                console.log(localStorage.getItem(COUNTER));
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
        navigator.webkitGetUserMedia(videoObj, onSuccess(), errBack);
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
