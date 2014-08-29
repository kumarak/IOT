$(function () {

   var socket = io.connect();
   var hostname = window.location.hostname;
   var client = BinaryClient('ws://' + hostname + ':9000');
//   var stream
   var session = {
       audio: true,
       video: false
   };
  
 client.on('open', function() {
    //alert('client on');
  // for the sake of this example let's put the stream in the window
     window.Stream = client.createStream();
  });

   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

   var onFail = function() {
    alert('sssabc')
   }

  function convertFloat32ToInt16(buffer) {
    l = buffer.length;
    buf = new Int16Array(l);
    while (l--) {
      buf[l] = Math.min(1, buffer[l])*0x7FFF;
       //buf[l] = buffer[l]*0xFFFF;
    }
    return buf.buffer;
  }


   function recorderProcess(e) {
    var left = e.inputBuffer.getChannelData(0);
    window.Stream.write(convertFloat32ToInt16(left));
    alert('sss');
   }

   var initializeRecorder = function(stream) {
    alert("sas");
    var audioContext = window.AudioContext ||
                      window.webkitAudioContext;

    var context = new audioContext();

    var microphone = context.createMediaStreamSource(stream);
    var bufferSize = 2048;

     // create a javascript node
    var recorder = context.createScriptProcessor(bufferSize, 1, 1);
    // specify the processing function
    recorder.onaudioprocess = recorderProcess;
    // connect stream to our recorder
    microphone.connect(recorder);
    // connect our recorder to the previous destination
    recorder.connect(context.destination);
  }

  var audioClick = false;
  var videoClick = false;
  var foodClick = false;
  var callClick = false;
  var micPermission = false;

  $("#foodButton").click(function() {
  	if(foodClick) return;
  	foodClick = true;
    socket.emit('keydown', 'food');
  });

  $("#videoButton").click(function() {
  	if(videoClick) return;
  	videoClick = true;
    socket.emit('keydown', 'video');
  });

  $("#callButton").click(function() {
  	if(callClick) return;
  	callClick = true;
    socket.emit('keydown', 'call');
  });

  $("#audioButton").click(function() {
   if(audioClick) return;
    audioClick = true;
//    if(!micPermission)
    navigator.getUserMedia(session, initializeRecorder, onFail);

    micPermission = true;
    socket.emit('keydown', 'audio');
  });

  socket.on('refresh', function(){
    location.reload(true);
    audioClick = false;
    videoClick = false;
    foodClick = false;
    callClick = false;
  });

});
