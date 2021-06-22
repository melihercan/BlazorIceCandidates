var localStream;
var peerConnection;

var peerConnectionConfig = {
    'iceServers': [
        { 'urls': 'stun:stun.stunprotocol.org:3478' },
        { 'urls': 'stun:stun.l.google.com:19302' },
    ]
};


function getUserMediaSuccess(stream) {
    console.log('===================================== Got stream');
    localStream = stream;

    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    peerConnection.onicecandidate = gotIceCandidate;

    console.log('######## Connection created');

    //peerConnection.addStream(localStream);
    var videoTracks = localStream.getVideoTracks();
    var audioTracks = localStream.getAudioTracks();
    peerConnection.addTrack(videoTracks[0]);
    peerConnection.addTrack(audioTracks[0]);

    console.log('######## Sending Offer');
    peerConnection.createOffer().then(createdDescription).catch(errorHandler);
}

export function start() {
    console.log('===================================== Starting');

    var constraints = {
        video: true,
        audio: true,
    };

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(getUserMediaSuccess).catch(errorHandler);
    } else {
        alert('Your browser does not support getUserMedia API');
    }
}

function gotIceCandidate(event) {
    console.log('===> OnIceCandidate');
    if (event.candidate != null) {
        console.log('######## Sending ICE Candidate');
        console.log(JSON.stringify({ 'ice': event.candidate }));
    }
}

function createdDescription(description) {
    peerConnection.setLocalDescription(description).then(function () {
        console.log('######## Local description set');
    }).catch(errorHandler);
}

function errorHandler(error) {
    console.log(error);
}

