
var x = 1;

function setup() {
  createCanvas(800, 600);
  //loadJSON('http://api.openweathermap.org/data/2.5/weather?q=NewYork,USA&units=imperial', gotData);
  //loadJSON('https://data.sparkfun.com/output/1nnVEoaAbDS3r2YRb9Ob.json?page=1', gotData);
  noLoop();
  background(255);
  stroke(0);

}

function draw() {

loadJSON('https://data.sparkfun.com/output/1nnVEoaAbDS3r2YRb9Ob.json?page=1', gotData);

}

function gotData(stream) {

  if (this.responseText == 0) {
    println('error');
  } else {

    println('got something');

   var length = stream.length;
   println(length);
   
   var interval = width/length;
   
   for(var i =0; i < length; i++) {
     
     var data = stream[i].load;
     data = map(data,0,50,height,0);
     stroke(200,0,0,data/2);
     ellipse(x, data, 5, 5);
     x+=interval;
   }
   
   //var data1 = stream[1].load;
   //println(data1);
   
  }

}

function mousePressed() {

redraw();

}