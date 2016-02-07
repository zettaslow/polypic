/**
 * Created by btsmith on 2/6/2016.
 */
var video = document.querySelector('video');
var constraints = window.constraints = {
    audio: false,
    video: true
};

function hasGetUserMedia() {

    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
                || navigator.msGetUserMedia);
}

if(hasGetUserMedia())
{
    //Good to go, do nothing
     webcamStuff();
}
else
{
    alert('getUserMedia() is not supported in your browser');
}

function webcamStuff()
{
    navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

    var errorCallback = function(err) {
        console.log('Rejected', err);
    };

    MediaStreamTrack.getSources(function(sourceInfos){
        var audioSource = null;
        var videoSource = null;

        for(var i = 0; i != sourceInfos.length; ++i)
        {
            var sourceInfo = sourceInfos[i];
            if(sourceInfo.kind === 'audio') {
                console.log(sourceInfo.id, sourceInfo.label || 'microphone');

                audioSource = sourceInfo.id;
            }
            else if(sourceInfo.kind === 'video')
            {
                console.log(sourceInfo.id, sourceInfo.label || 'camera');

                videoSource = sourceInfo.id;
            }
            else
            {
                console.log("some other kind of source: ", sourceInfo);
            }
        }

        sourceSelected(audioSource, videoSource);
    });


    navigator.getUserMedia({video:true, audio: false},
        function(localMediaStream){
            var video = document.querySelector('video');
            video.src = window.URL.createObjectURL(localMediaStream);

            //onloadedmetadata doesn't fire in chrome when using it with getUserMedia
            video.onloadedmetadata(function(e){
                //Ready to go. Do some stuff

            });
        }, errorCallback);
}

function webcamAttempt(){
    navigator.getUserMedia = ( navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia);

    if(navigator.getUserMedia)
        alert("CAMERA WORKS");
    else
    {
        alert("CAMERA ISN'T SUPPORTED");
    }

    navigator.getUserMedia(constraints)
        .then(function(stream){
            var videoTracks = stream.getVideoTracks();

            console.log('Got stream with constraints: ', constraints);
            console.log('Using video device: ' + videoTracks[0].label);
            stream.ondended = function() {
                console.log('Stream ended');
            }
            window.stream = stream;
            video.srcObject = stream;
        }).catch(function(error) {
        if(error.name === 'ConstraintNotSatisfiedError'){
        errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
            constraints.video.width.exact + ' px is not supported by your device.');
          } else if (error.name === 'PermissionDeniedError') {
            errorMsg('Permissions have not been granted to use your camera and ' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.');
    }
    errorMsg('getUserMedia error: ' + error.name, error);

    });
}

function errorMsg(msg, error)
{
    errorElement.innerHTML += '<p>' + msg + '</p>';
    if(typeof error !== 'undefined') {
        console.error(error);
    }
}

function sourceSelected(audioSource, videoSource)
{
    var constraints = {
        audio: {
            optional: [{sourceId: audioSource}]
        },
        video: {
            optional: [{sourceId: videoSource}]
        }
    };

    navigator.getUserMedia(constraints);
}