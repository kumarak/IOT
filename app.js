var express = require('express');
var http = require('http');
var fs = require('fs');
var routes = require('./routes');
var sio = require('socket.io');
var gpio = require('pi-gpio');
var crypto = require('crypto');
var async = require('async');
var wav = require('wav');
var BinaryServer = require('binaryjs').BinaryServer;
var server = BinaryServer({port: 9000});
var lame = require('lame');

var servo = {};
var app = module.exports = express.createServer();
var io = sio.listen(app);
var Speaker = require('speaker');
var mic = require('microphone');
//var Analyzer = require('web-audio-analyser')(mic);
var sys = require('sys');
var exec = require('child_process').exec;

var audioOptions = {channels: 2, bitDepth: 16, sampleRate: 44100};

var speaker = new Speaker({
  channels: 2,          // 1 channel
  bitDepth: 16,         // 16-bit samples
  sampleRate: 44100,    // 48,000 Hz sample rate
  signed:true
});

// express framework
// Configuration
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes
app.get('/', routes.index);

app.listen(3000);
//console.log('Listening %d in %s mode', app.address().port, app.settings.env);

var decoder = lame.Decoder();
var songs = ['/home/pi/akshayk-iot/intel.mp3'];

// Recursive function that plays song with index 'i'.
function playSong(i) {
  //var speaker1    = new Speaker(audioOptions);
  //var inputStream = fs.createReadStream('/home/pi/akshayk-iot/intel.mp3');
  // Pipe the read data into the decoder and then out to the speakers
  //inputStream.pipe(decoder).pipe(speaker1);
  //speaker.on('flush', function(){
  //});
}


servo.initPins = function(){ };

function puts(error, stdout, stderr) { sys.puts(stdout) };

servo.food = function(socket){
    exec("sudo /home/pi/iotproject/servo", puts);
    console.log('setting servo pin\n');
};

servo.video = function(socket) {
    exec("sudo killmotion", puts);
    exec("/home/pi/akshayk-iot/start.sh", puts);
    app.get('/', routes.index);
    console.log('Start video\n');
    socket.emit('refresh', 0);
}

servo.audio = function(socket) {
     playSong(0);
     console.log('Start audio\n');
     socket.emit('refresh', 0);
}

var audioOptions = {channels: 2, bitDepth: 16, sampleRate: 44100};

var songs = [ ];

function done() {
  console.log("AUdio finished")
}

servo.call_ = function() {
    mic.startCapture({'mp3output' : false});
    var audio_analyzer = new Analyzer(mic.audioStream);
    mic.audioStream.on('data', function(data) {
        //process.stdout.write(data);
    });
    console.log('Call\n')
}

servo.stopAll = function(){

};

// receive io sockets 
io.sockets.on('connection', function(socket) {
  sequence = 0;
  socket.on('keydown', function(dir) {
    switch(dir){
     case 'food':
        servo.food(socket);
        break;
      case 'video':
        servo.video(socket);
        break;
      case 'audio':
        servo.audio(socket);
        break;
      case 'call':
        servo.call_()
        break;
    }
  });

  //socket.emit('refresh', sequence++);

  socket.on('disconnect', function() {
     console.log('disconneted\n');
  });

  socket.on('keyup', function(dir){
    servo.stopAll();
  });

  socket.on('stream', function(stream, meta){
        stream.on('data', function(data){
            //speaker.write(leftchannel);
        });
    });

});

server.on('connection', function(client){
  console.log('binaryjs connection\n');
  var fileWriter = null;

  client.on('stream', function(stream, meta) {
    var fileWriter = new wav.FileWriter('demo.wav', {
      channels: 2,
      sampleRate: 44100,
      bitDepth: 16
    });

    stream.on('data', function(data){
       console.log('streaming');
       process.stdout.write(data);
       stream.pipe(fileWriter);
       stream.pipe(speaker);
       //speaker.write(data);
    });
    //stream.pipe(fileWriter);
    stream.on('end', function() {
       fileWriter.end();
       speaker.end();
    });
  });

  client.on('close', function() {
    if (fileWriter != null) {
      fileWriter.end();
    }
  });
  //
});

// create http servers
http.createServer(function(req, res){
    fs.readFile('./www/index.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
}).listen(8000);

servo.initPins();
