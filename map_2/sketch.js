var zips;
var sales;

var backgroundColor;
var highlightColor;
var unhighlightColor;
var dormantColor;
var waitingColor;

var faders = [];

//border of where map should be drawn
var mapX1, mapY1, mapX2, mapY2;

//var totalCount = 41556;
var totalCount = 124; //for now

var places = [];
var placeCount = 0;

//point boundaries
var minX, maxX, minY, maxY;

var typedString;
var typedChars = [];
var typedCount = 0;
var typedPartials = [];

var messageX, messageY;

var foundCount;
var chosen;

var notUpdatedCount = 0;

var zoomEnabled = false;
var zoomDepth = new Integrator();

var zoomX1;
var zoomY1;
var zoomX2;
var zoomY2;

var targetX1 = [];
var targetX2 = [];
var targetY1 = [];
var targetY2 = [];

var boundsX1, boundsY1;
var boundsX2, boundsY2;

'use strict';

function preload() {
  zips = loadStrings('zips.txt');
  sales = loadStrings('numPurchPerZip.txt');
}

function setup() {

  createCanvas(1000, 750);

  minX = -0.3667764;
  maxX = 0.35192886;
  minY = 0.4181981;
  maxY = 0.87044954;

  mapX1 = 30;
  mapX2 = width - mapX1;
  mapY1 = 20;
  mapY2 = height - mapY1;

  messageX = 40;
  messageY = height - 40;


  faders[0] = new Integrator(unhighlightColor, dormantColor);
  faders[0].attraction = 0.5;
  faders[0].setTarget(1);

  for (var i = 1; i < 6; i++) {
    faders[i] = new Integrator(unhighlightColor, highlightColor);
    faders[i].attraction = 0.5;
    faders[i].setTarget(1);
  }


  parseData(zips, sales);

  backgroundColor = color(100);
  highlightColor = color(250);
  unhighlightColor = color(150);
  dormantColor = color(200);
  waitingColor = color(175);

  zoomX1 = new Integrator(minX);
  zoomY1 = new Integrator(minY);
  zoomX2 = new Integrator(maxX);
  zoomY2 = new Integrator(maxY);

  targetX1[0] = minX;
  targetX2[0] = maxX;
  targetY1[0] = minY;
  targetY2[0] = maxY;


  //createCanvas(windowWidth, windowHeight);
  rectMode(RADIUS);
  ellipse(RADIUS);

  //var numZips = zips.length;
  //var numSales = sales.length;

}

function draw() {

  background(backgroundColor);
  updateAnimation();

  if (placeCount > 0) {

    for (var i = 0; i < placeCount; i++) {
      places[i].draw();
    }

    if (typedCount === 0) {
      fill(waitingColor);
      textAlign(LEFT);
      textSize(20);
      var message = "zipdecode by ben fry";
      // if all places are loaded
      if (placeCount == totalCount) {
        if (focused) {
          message = "type the digits of a zip code";
        } else {
          message = "click the map image to begin";
        }
      }
      text(message, messageX, messageY);

    } else {

      textSize(20);
      if (foundCount > 0) {
        //console.log("found: " + foundCount);
        if (!zoomEnabled && (typedCount == 4)) {
          for (var j = 0; j < placeCount; j++) {
            if (places[j].matchDepth == typedCount) {
              places[j].draw();
              //console.log("places of j.draw");
            }
          }
        }

        if (chosen !== null) {
          chosen.drawChosen();
        }

        fill(highlightColor);
        textAlign(LEFT);
        text(typedString, messageX, messageY);

      } else {

        fill(200, 0, 0); //bad color
        text(typedString, messageX, messageY);

      }
    }

    textSize(20);
    textAlign(RIGHT);
    fill(zoomEnabled ? highlightColor : unhighlightColor);
    text("zoom", width - 40, height - 40);
    textAlign(LEFT);

    //noLoop();

  }
}



// function windowResized() {
//   console.log("resize");
//   resizeCanvas(windowWidth, windowHeight);
//   redraw();

// }



function parseData(z, s) {

  //console.log("got here");
  var placeIndex = 0;

  //for (var i = 0; i < z.length; i++) {
  for (var i = 0; i < 2000; i++) {

    //console.log("got here");

    var zdata = split(z[i], "\t");

    var code = zdata[0];
    var x = zdata[1];
    var y = zdata[2];
    var locationz = zdata[3];

    //for (var j = 0; j < s.length; j++) {
    for (var j = 0; j < s.length; j++) {

      var jdata = split(s[j], "\t");
      var zip = jdata[0];
      var value = jdata[1];
      var numSales = jdata[2];

      if (code == zip) {
        //console.log("got here");
        //console.log(zip + " " + code);

        places[placeIndex++] = new Place(code, x, y, locationz, value, numSales);
        placeCount++;
        //console.log(placeCount);
      }
    }
  }
}



function updateAnimation() {

  var updated = false;

  for (var i = 0; i < 6; i++) {
    updated |= faders[i].update();
  }

  if (foundCount > 0) {
    zoomDepth.setTarget(typedCount);
    //console.log("typedCount: " + typedCount + " zoomDepth: " + zoomDepth.value);

  } else {
    zoomDepth.setTarget(typedCount - 1);
  }
  updated |= zoomDepth.update();
  //console.log("beep");
  updated |= zoomX1.update();
  updated |= zoomY1.update();
  updated |= zoomX2.update();
  updated |= zoomY2.update();

  // if the data is loaded, can optionally call noLoop() to save cpu
  if (placeCount == totalCount) { // if fully loaded
    if (!updated) {
      notUpdatedCount++;
      // after 20 frames of no updates, shut off the loop
      if (notUpdatedCount > 20) {
        noLoop();
        console.log("NoLoop");
        notUpdatedCount = 0;
      }
    } else {
      notUpdatedCount = 0;
    }
  }
}


function TX(_x) {

  // var a = map(_x, minX, maxX, mapX1, mapX2);
  // return a;

  if (zoomEnabled) {
    //console.log("zoomX1: " + zoomX1.value);
    return map(_x, zoomX1.value, zoomX2.value, mapX1, mapX2);

  } else {
    return map(_x, minX, maxX, mapX1, mapX2);
  }

}


function TY(_y) {

  // var b = map(_y, minY, maxY, mapY2, mapY1);
  // return b;

  if (zoomEnabled) {
    return map(_y, zoomY1.value, zoomY2.value, mapY2, mapY1);
  } else {
    return map(_y, minY, maxY, mapY2, mapY1);
  }

}

function mousePressed() {
  if ((mouseX > width - 100) && (mouseY > height - 50)) {
    zoomEnabled = !zoomEnabled;
    console.log(zoomEnabled);
    redraw();
  }
}


function keyPressed() {

  if ((key >= 0) && (key <= 9)) {

    //console.log(key + " " + typedCount);
    typedChars[typedCount] = key;
    //console.log(typedChars.length);
    typedCount++;

    updateTyped();

  }

  if (keyCode == BACKSPACE || keyCode == DELETE) {
    if (typedCount > 0) {
      typedCount--;
      typedChars.length--;
      //typedChars[typedCount] = key;
      //console.log(typedChars.length);
      for (var j = 0; j < typedCount; j++) {
        //console.log(typedChars[j]);
      }
    }

    updateTyped();
  }
}


function updateTyped() {

  //console.log("updateTyped");
  typedString = typedChars.join("");
  //console.log(typedString + " " + typedCount);

  //Un-highlight areas already typed past
  for (var i = 0; i < typedCount; i++) {
    faders[i].setTarget(0);
  }
  // // Highlight potential dots not yet selected by keys
  for (var j = typedCount; j < 6; j++) {
    faders[j].setTarget(1);
  }

  if (typedString !== null) {

    typedPartials[typedCount] = parseInt(typedString);

    for (var k = typedCount - 1; k > 0; --k) {
      typedPartials[k] = parseInt(typedPartials[k + 1] / 10);
      //console.log("TPL: " + typedPartials[k]);
    }

  }

  foundCount = 0;
  chosen = null;

  boundsX1 = maxX;
  boundsY1 = maxY;
  boundsX2 = minX;
  boundsY2 = minY;


  for (var l = 0; l < placeCount; l++) {
    // update boundaries of selection
    // and identify whether a particular place is chosen
    places[l].check();
  }

  calcZoom();
  loop(); // re-enable updates

}


function calcZoom() {

  //console.log("calcZoom");

  if (foundCount !== 0) {
    // given a set of min/max coords, expand in one direction so that the 
    // selected area includes the range with the proper aspect ratio



    var spanX = (boundsX2 - boundsX1);
    var spanY = (boundsY2 - boundsY1);

    //span X and Y are 0 once point is ID'ed?

    var midX = parseFloat(boundsX1 + boundsX2) / 2;
    var midY = parseFloat(boundsY1 + boundsY2) / 2;

    if ((spanX !== 0) && (spanY !== 0)) {
      var screenAspect = width / height;
      var spanAspect = spanX / spanY;

      if (spanAspect > screenAspect) {
        spanY = (spanX / width) * height; // wide

        //console.log("spanY: " + spanY);

      } else {
        spanX = (spanY / height) * width; // tall  

        //console.log("spanX: " + spanX);
      }
    } else { // if span is zero
      // use the span from one level previous
      spanX = parseFloat(targetX2[typedCount - 1] - targetX1[typedCount - 1]);
      spanY = parseFloat(targetY2[typedCount - 1] - targetY1[typedCount - 1]);

      //console.log("span: " + spanX + " " + spanY);

    }
    
    targetX1[typedCount] = parseFloat(midX - spanX / 2);
    targetX2[typedCount] = parseFloat(midX + spanX / 2);
    targetY1[typedCount] = parseFloat(midY - spanY / 2);
    targetY2[typedCount] = parseFloat(midY + spanY / 2);

    //console.log("targetY2: " + targetY2[typedCount]);
    
    


  } else if (typedCount !== 0) {
    // nothing found at this level, so set the zoom identical to the previous
    targetX1[typedCount] = targetX1[typedCount - 1];
    targetY1[typedCount] = targetY1[typedCount - 1];
    targetX2[typedCount] = targetX2[typedCount - 1];
    targetY2[typedCount] = targetY2[typedCount - 1];

    //console.log("targetY2: " + targetY2[typedCount]);

  }

  zoomX1.setTarget(parseFloat(targetX1[typedCount]));
  zoomY1.setTarget(parseFloat(targetY1[typedCount]));
  zoomX2.setTarget(parseFloat(targetX2[typedCount]));
  zoomY2.setTarget(parseFloat(targetY2[typedCount]));

  //console.log("targetY1: " + targetY1[typedCount]);

  if (!zoomEnabled) {
    zoomX1.set(zoomX1.target);
    zoomY1.set(zoomY1.target);
    zoomX2.set(zoomX2.target);
    zoomY2.set(zoomY2.target);

    //console.log("zoom: " + zoomX1.target);

  }
}



function Place(_code, _x, _y, _location, _value, _numSales) {
  this.code = _code;
  this.x = _x;
  this.y = _y;
  this.location = _location;
  this.value = _value;
  this.numSales = _numSales;

  this.partial = [];
  this.matchDepth = 0;
  this.count = 0;

  this.partial[5] = parseInt(this.code);
  this.partial[4] = parseInt(this.partial[5] / 10);
  this.partial[3] = parseInt(this.partial[4] / 10);
  this.partial[2] = parseInt(this.partial[3] / 10);
  this.partial[1] = parseInt(this.partial[2] / 10);

}

Place.prototype.draw = function() {

  var valScale = sqrt(this.value) / 7;

  var xx = TX(this.x);
  var yy = TY(this.y);

  //console.log("xx: " + xx + "  yy: " + yy);

  //if ((xx < 0) || (yy < 0) || (xx >= width) || (yy >= height)) return;

  //for hovering zips
  // var dist = 3;
  // if ((mouseX + dist > xx && mouseX - dist < xx) && (mouseY + dist > yy && mouseY - dist < yy)) {

  //   textSize(valScale * 2);
  //   //textSize(constrain(valScale, 10, 40));
  //   fill(255);
  //   text(this.code, xx, yy);
  //   fill(backgroundColor);

  // }

  if ((xx < 0) || (yy < 0) || (xx >= width) || (yy >= height)) {
    //console.log("oops");   
    return;
  }
  //console.log("zoomDepth: " + zoomDepth.value);
  //console.log(this.matchDepth + " " + typedCount);

  if ((zoomDepth.value < 2.8) || !zoomEnabled) { // show simple dots
    //pixels[((int) yy) * width + ((int) xx)] = faders[matchDepth].cvalue;
    //console.log("heyo");
    //set((int)xx, (int)yy, faders[matchDepth].colorValue);
    //fill(faders[this.matchDepth].colorValue, 50 + valScale);
    //stroke(faders[this.matchDepth].colorValue, 50 + valScale);

    fill(200, 50 + valScale);
    stroke(200, 50 + valScale);
    rect(xx, yy, valScale, valScale);

  } else { // show slightly more complicated dots
    noStroke();
    fill(200);

    console.log("1" + " " + this.matchDepth + " " + typedCount);

    if (this.matchDepth == typedCount) {

      if (typedCount == 4) { // on the fourth digit, show nums for the 5th

        textSize(constrain(valScale, 20, 40));
        text(this.code % 10, TX(this.x), TY(this.y));
      } else { // show a larger box for selections
        textSize(constrain(valScale, 20, 40));
        fill(200, 50);
        stroke(200, 50);
        rect(xx, yy, zoomDepth.value + valScale, zoomDepth.value + valScale);
      }
    } else { // show a slightly smaller box for unselected
      rect(xx, yy, zoomDepth.value - 1, zoomDepth.value - 1);

    }
  }
};

// update boundaries of selection
// and identify whether a particular place is chosen
Place.prototype.check = function() {

  this.matchDepth = 0;

  if (typedCount !== 0) {

    for (var i = typedCount; i > 0; --i) {

      if (typedPartials[i] == this.partial[i]) {
        //console.log("place.check");
        this.matchDepth = i;
        //console.log("matchDepth: " + this.matchDepth);
        //console.log("matchDepth: " + this.matchDepth);
        break; // since starting at end, can stop now
      }
    }
  }

  if (this.matchDepth == typedCount) {
    foundCount++;
    if (typedCount == 5) {
      chosen = this;
    }

    //console.log("Before: boundsX1: " + boundsX1 + " this.x: " + this.x);

    if (this.x < boundsX1) boundsX1 = this.x;
    if (this.y < boundsY1) boundsY1 = this.y;
    if (this.x > boundsX2) boundsX2 = this.x;
    if (this.y > boundsY2) boundsY2 = this.y;

    //console.log("After: boundsX1: " + boundsX1 + " this.x: " + this.x);
  }

};


Place.prototype.drawChosen = function() {


  noStroke();
  textSize(20);
  fill(200);
  // the chosen point has to be a little larger when zooming
  var size = zoomEnabled ? 6 : 4;
  rect(TX(this.x), TY(this.y), size, size);

  // calculate position to draw the text, slightly offset from the main point
  var textX = TX(this.x);
  var textY = TY(this.y) - size - 4;

  // don't go off the top.. (e.g. 59544)
  if (textY < 20) {
    textY = TY(this.y) + 20;
  }

  // don't run off the bottom.. (e.g. 33242)
  if (textY > (height - 5)) {
    textY = TY(this.y) - 20;
  }

  var xlocation = this.location + "  " + nf(this.code, 5) + " " + "Number of Sales: " + this.numSales + " " + "Total Sales: " + this.value;

  if (zoomEnabled) {
    textAlign(CENTER);
    text(xlocation, textX, textY);

  } else {
    var wide = textWidth(xlocation);

    if (textX > width / 3) {
      textX -= wide + 8;
    } else {
      textX += 8;
    }

    textAlign(LEFT);
    fill(highlightColor);
    text(xlocation, textX, textY);
  }

};





function Integrator() {

  this._DAMPING = 0.5;
  this._ATTRACTION = 0.2;

  this.damping;
  this.attaction;

  this.value = 0;
  this.vel = 0;
  this.accel = 0;
  this.force = 0;
  this.mass = 1;

  this.targeting = false;
  this.target = 0;

  if (arguments.length === 0) {
    this.value = 0;
    this.damping = this._DAMPING;
    this.attraction = this._ATTRACTION;
  } else {
    if (arguments.length === 1) {
      this.value = arguments[0];
      this.damping = this._DAMPING;
      this.attraction = this._ATTRACTION;
    } else {
      if (arguments.length === 3) {
        this.value = arguments[0];
        this.damping = arguments[1];
        this.attraction = arguments[2];
      }
    }
  }

  this.setTarget = function(t) {
    this.targeting = true;
    this.target = parseFloat(t);
  };

  this.set = function(v) {
    this.value = parseFloat(v);
  };

}


Integrator.prototype.update = function() {

  if (this.targeting) {

    this.force += parseFloat(this.attraction * (this.target - this.value));
    //console.log("update target: " + this.target);
  }
  this.accel = parseFloat(this.force / this.mass);
  this.vel = parseFloat((this.vel + this.accel) * this.damping);
  this.value += parseFloat(this.vel);

  this.force = 0;

  return (parseFloat(this.vel) > 0.0001);

};

Integrator.prototype.noTarget = function() {

  this.targeting = false;

};