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

  var z = 1;
  var x = 0;

  var url = "https://data.sparkfun.com/input/9JJ6bKq9Qxtn72zjL0v6?private_key=xzzYvrPp8Xs1YGrW6N7p&timestamp=3.24&value=";

  sketch.preload = function() {
    sketch.loadJSON('https://data.sparkfun.com/output/9JJ6bKq9Qxtn72zjL0v6.json?page=1', gotData);
    //httpGet(url);
  };

  sketch.setup = function() {
    sketch.ellipseMode(sketch.CENTER);
    sketch.createCanvas(800, 600);
    //loadJSON('http://api.openweathermap.org/data/2.5/weather?q=NewYork,USA&units=imperial', gotData);
    //loadJSON('https://data.sparkfun.com/output/1nnVEoaAbDS3r2YRb9Ob.json?page=1', gotData);
    //sketch.noLoop();
    sketch.background(255);
    sketch.stroke(0);
    sketch.loadJSON('https://data.sparkfun.com/output/9JJ6bKq9Qxtn72zjL0v6.json?page=1', gotData);
    
  };

  sketch.draw = function() {
    //sketch.background(255);
    //sketch.fill(0);
    //sketch.rect(sketch.mouseX, sketch.mouseY, 50, 50);
  };

  sketch.mousePressed = function() {
    
    x = sketch.mouseX;
    sketch.println(x);
    httpGet(url + x);
    sketch.loadJSON('https://data.sparkfun.com/output/9JJ6bKq9Qxtn72zjL0v6.json?page=1', gotData);

    //sketch.redraw();

  };

  function gotData(stream) {

    sketch.background(255);
    z = 1;

    if (this.responseText === 0) {
      sketch.println('error');
    } else {

      sketch.println('got something');

      var length = stream.length;
      sketch.println(length);

      var interval = sketch.width / length;

      for (var i = 0; i < length; i++) {

        var data = stream[i].value;
        data = sketch.map(data, 0, sketch.width, sketch.height, 0);
        
        sketch.stroke(sketch.random(1, 255), 0, 0);
        sketch.ellipse(z, data, 5, 5);
        
        if(i > 0) {
          var data2 = stream[i-1].value;
          data2 = sketch.map(data2, 0, sketch.width, sketch.height, 0);
          sketch.line(z, data2, z + interval, data);
        }
        
        z += interval;
        
      }
      //var data1 = stream[1].load;
      //println(data1);
    }
  }
};

var myp5 = new p5(s);

function httpGet(theUrl) {
  var xmlHttp = null;
  xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}








