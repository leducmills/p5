var daValue;

var five = require("johnny-five"),
board, sensor1;
    // or "./lib/johnny-five" when running from the source
  board = new five.Board();

  board.on("ready", function() {

  sensor1 = new five.Sensor({
  	pin: "A2",
  	freq: 500
  });
  // Create an Led on pin 13 and strobe it on/off
  // Optionally set the speed; defaults to 100ms
  (new five.Led(13)).strobe(500);
  
  board.repl.inject({
  	sen: sensor1
  });

  sensor1.on("data", function() {
  	console.log(this.value, this.raw);
  	daValue = this.value;
    
  });
});


function setup() {
  createCanvas(640,480);


  noLoop();


}

function draw() {
	//var sensorDiv = createDiv("Value " + sensor1.value);

}

function mousePressed() {

redraw();

}

// http://data.sparkfun.com/input/kW8O0w1lBNh3mpLEqjV0Uvlqbyo?private_key=pDaOz3XljdHM5DQZ3baRu4z7RmX&value=VALUE1&=time=VALUE2


// PUBLIC KEY: kW8O0w1lBNh3mpLEqjV0Uvlqbyo
// PRIVATE KEY:  pDaOz3XljdHM5DQZ3baRu4z7RmX
// DELETE KEY:  vO23yxvYLZcQO6nJ2wm1TpRONZJ