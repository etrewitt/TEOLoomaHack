console.log("test");

var chunks = [];

var constraints = {video: true};

var COUNTER = 0;

// Put event listeners into place
window.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem("count")) {
        localStorage.setItem("count", "0");
    }
    // Grab elements, create settings, etc.
    var imgCanvas = document.getElementById("stillCanvas"),
        context = imgCanvas.getContext("2d"),
        video = document.getElementById("video"),
        vidCanvas = document.getElementById('videoCanvas');
        videoObj = { "video": true, "audio" : true },
        
        errBack = function(error) {
            console.log("Video capture error: ", error.code); 
        }
        onSuccess = function(stream){
            console.log("onSuccess");
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
                vidCanvas.style.display = "block";
                document.getElementById("stillCanvas").style.display = "none";
                document.getElementById("save_img").style.display = "none";
                document.getElementById("save_vid").style.display = "block";
            }
            
            document.getElementById("save_img").onclick = function() {
                COUNTER = COUNTER + 1;
             
                var blob;
                imgCanvas.toBlob(function(blob) {
                    var newImg = document.createElement("img"),
                    url = URL.createObjectURL(blob);

                    newImg.onload = function() {
                     // no longer need to read the blob so it's revoked
                    URL.revokeObjectURL(url);
                    };

                    newImg.src = url;
                    document.body.appendChild(newImg);
                }, "image/png");
                console.log(blob);
                localStorage.setItem(COUNTER, blob.toString());
            }
            /*
            document.getElementById("save_vid").onclick = function() {
                COUNTER = COUNTER + 1;               
                var blob = vidCanvas.toBlob();
                console.log(blob);
                localStorage.setItem(COUNTER, blob.toString());
            }
            */
            document.getElementById("view").onclick = function() {
                var count = localStorage.getItem("count");
                
                var byteCharacters = atob(localStorage.getItem("clip #" + count));
                var byteNumbers = new Array(byteCharacters.length);
                for (var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                var blob = new Blob([byteArray], { 'type' : "video/ogg; codecs=opus" });
                vidCanvas.src = window.URL.createObjectURL(blob);
            }

            mediaRecorder.ondataavailable = function(e) {
                console.log("data available");
                chunks.push(e.data);
            }

            mediaRecorder.onstop = function(e) {
                console.log('onstop fired');
                var blob = new Blob(chunks, { 'type' : 'video/ogg; codecs=opus' });
                vidCanvas.src = window.URL.createObjectURL(blob);
//                localStorage.setItem("clip #" + COUNTER, blob.toString())
                
                var reader = new window.FileReader();
                reader.readAsDataURL(blob); 
                reader.onloadend = function() {
                    base64data = reader.result;                
                    console.log(base64data );
                    var count = parseInt(localStorage.getItem("count"), 10);
                    localStorage.setItem("count", (count+1).toString());
                    localStorage.setItem("clip #" + count.toString(), base64data.toString())
                }
                
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
        document.getElementById("save_img").style.display = "block";
        document.getElementById("videoCanvas").style.display = "none";
        document.getElementById("save_vid").style.display = "none";
    });
}, false);
