/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    sio = require('socket.io'),
    gpio = require('pi-gpio'),
    crypto = require('crypto'),
    tank = {},
    servoPin  = 18,
    app = module.exports = express.createServer(),
    io = sio.listen(app);

var sys = require('sys'),
    exec = require('child_process').exec; 


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

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

app.listen(3000);
console.log('Listening %d in %s mode', app.address().port, app.settings.env);

tank.initPins = function(){
    gpio.open(servoPin)
};

function puts(error, stdout, stderr) { sys.puts(stdout) };

tank.moveForward = function(){
    gpio.write(servoPin, 1)
    exec("sudo /home/pi/LED/IOT/servo", puts);
    console.log('setting servo pin\n')
};

tank.stopAllMotors = function(){
    gpio.write(servoPin, 0);
};

io.sockets.on('connection', function(socket) {
  
  socket.on('keydown', function(dir) {
    switch(dir){
     case 'up':
	console.log('move up');
        tank.moveForward();
        break;
    }
  });

  socket.on('keyup', function(dir){
    tank.stopAllMotors();
  });

});

tank.initPins();
