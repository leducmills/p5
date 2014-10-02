// Public URL
// http://data.sparkfun.com/streams/9JJ6bKq9Qxtn72zjL0v6
// Public Key
// 9JJ6bKq9Qxtn72zjL0v6
// Delete Key
// n33wx7VXorhpQazw63GE
// This key can only be used once.  Keep this key secret, and in a safe place.  You will not be able to retrieve it.
// Private Key
// xzzYvrPp8Xs1YGrW6N7p

//var five = require("serialport");

var s = function(sketch) {

  var x = 0;
  var y = 100;

  var url = "https://data.sparkfun.com/input/9JJ6bKq9Qxtn72zjL0v6?private_key=xzzYvrPp8Xs1YGrW6N7p&timestamp=3.24&value=";

  sketch.preload = function() {
    //httpGet(url);
  };

  sketch.setup = function() {
    sketch.createCanvas(700, 410);
  };

  sketch.draw = function() {
    sketch.background(0);
    sketch.fill(255);
    sketch.rect(sketch.mouseX, sketch.mouseY, 50, 50);
  };

  sketch.mousePressed = function() {

    x = sketch.mouseX;
    sketch.println(x);
    httpGet(url + x);

  };
};

var myp5 = new p5(s);

function httpGet(theUrl) {
  var xmlHttp = null;
  xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}





