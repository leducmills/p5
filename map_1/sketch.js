var lines = [];
var records = [];
var recordCount;

var backgroundColor = new p5.Color(100); // dark background color
var dormantColor = new p5.Color(150); // initial color of the map
var highlightColor = new p5.Color(250); // color for selected points
var unhighlightColor = new p5.Color(150); // color for points that are not selected
var waitingColor = new p5.Color(175); // "please type a zip code" message
var badColor = new p5.Color(200, 0, 0); // text color when nothing found

var faders = new Array(6);

// border of where the map should be drawn on screen   
var mapX1, mapY1;
var mapX2, mapY2;

// column numbers in the data file
var CODE = 0;
var X = 1;
var Y = 2;
var NAME = 3;

var totalCount; // total number of places
var places = [];
var placeCount; // number of places loaded

// min/max boundary of all points
var minX, maxX;
var minY, maxY;

// typing and selection  
//PFont font;
var typedString;
var typedChars = new Array(5);
var typedCount;
var typedPartials = new Array(6);

var messageX, messageY;

var foundCount;
var chosen;

// smart updates
var notUpdatedCount = 0;

// zoom
var zoomEnabled = false;
var zoomDepth = new Integrator();

//integrator
var zoomX1;
var zoomY1;
var zoomX2;
var zoomY2;

var targetX1 = new Array(6);
var targetY1 = new Array(6);
var targetX2 = new Array(6);
var targetY2 = new Array(6);

// boundary of currently valid points at this typedCount
var boundsX1, boundsY1;
var boundsX2, boundsY2;


function setup() {
  createCanvas(1200, 800);

  mapX1 = 30;
  mapX2 = width - mapX1;
  mapY1 = 20;
  mapY2 = height - mapY1;

  //printArray(PFont.list());
  // font = createFont("Georgia", 20);
  // textFont(font);

  textSize(20);
  textFont("Georgia");

  messageX = 40;
  messageY = height - 40;

  //faders.push(new ColorIntegrator[6]);
  // for (var i = 0; i < 6; i++) {
  //   faders[i] = new ColorIntegrator();
  // }
  //faders = new ColorIntegrator();



  // When nothing is typed, all points are shown with a color called
  // "dormant," which is brighter than when not highlighted, but 
  // not as bright as the highlight color for a selection.
   faders[0] = new ColorIntegrator(unhighlightColor, dormantColor);
   faders[0].attraction = 0.5;
   faders[0].target(1);

  for (var j = 1; j < 6; j++) {
    faders[j] = new ColorIntegrator(unhighlightColor, highlightColor);
    faders[j].attraction = 0.5;
    faders[j].target(1);
  }

  readData();

  correlateData();

  zoomX1 = new Integrator(minX);
  zoomY1 = new Integrator(minY);
  zoomX2 = new Integrator(maxX);
  zoomY2 = new Integrator(maxY);

  targetX1[0] = minX;
  targetX2[0] = maxX;
  targetY1[0] = minY;
  targetY2[0] = maxY;

  rectMode(CENTER);
  ellipseMode(CENTER);
  //frameRate(15);	

}


function readData() {
  new Slurper();

  lines = loadStrings("data/numPurchPerZip.txt");
  records = new Record([lines.length]);

  //records = new Record();


  console.log(lines.length);
  
  for (var i = 0; i < lines.length; i++) {
    var pieces = split(lines[i], TAB); // Load data into array
    if (pieces.length == 3) {
      records[recordCount] = new Record(pieces);
      recordCount++;
    }
    println(recordCount);
  }
  if (recordCount != records.length) {
    records = subset(records, 0, recordCount);
  }
}

function correlateData() {

  for (var i = 0; i < places.length; i++) {
    for (var j = 0; j < records.length; j++) {

      if (places[i].code == records[j].zipCode) {
        println(places[i].code + " " + records[j].zipCode);

        places[i].count = records[j].count;
        places[i].totVal = records[j].totalValue;

      }
    }
  }
}


function parseInfo(line) {

  var infoString = line.substring(2); // remove the #
  var infoPieces = split(infoString, ',');
  totalCount = Integer.parseInt(infoPieces[0]);
  minX = Float.parseFloat(infoPieces[1]);
  maxX = Float.parseFloat(infoPieces[2]);
  minY = Float.parseFloat(infoPieces[3]);
  maxY = Float.parseFloat(infoPieces[4]);
}


function parsePlace(line) {
  var pieces = split(line, TAB);

  var zip = Integer.parseInt(pieces[CODE]);
  var x = Float.parseFloat(pieces[X]);
  var y = Float.parseFloat(pieces[Y]);
  var name = pieces[NAME];

  return new Place(zip, name, x, y);
}


// change message from 'click inside the window'
function focusGained() {
  redraw();
}

// change message to 'click inside the window'
function focusLost() {
  redraw();
}

// this method is empty in p5
function mouseEntered() {
  requestFocus();
}




function draw() {

  background(backgroundColor);
  updateAnimation();

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
      if (!zoomEnabled && (typedCount == 4)) {
        // re-draw the chosen ones, because they're often occluded
        // by the non-selected points
        for (var j = 0; j < placeCount; j++) {
          if (places[j].matchDepth == typedCount) {
            places[j].draw();
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
      fill(badColor);
      text(typedString, messageX, messageY);
    }
  }

  // draw "zoom" text toggle
  textSize(20);
  textAlign(RIGHT);
  fill(zoomEnabled ? highlightColor : unhighlightColor);
  text("zoom", width - 40, height - 40);
  textAlign(LEFT);

}

function updateAnimation() {
  var updated = false;

  for (var i = 0; i < 6; i++) {
    updated |= faders[i].update();
  }

  if (foundCount > 0) {
    zoomDepth.target(typedCount);
  } else {
    zoomDepth.target(typedCount - 1);
  }
  updated |= zoomDepth.update();

  updated |= zoomX1.update();
  updated |= zoomY1.update();
  updated |= zoomX2.update();
  updated |= zoomY2.update();

  // if the data is loaded, can optionally call noLoop() to save cpu
  if (placeCount === totalCount) { // if fully loaded
    if (!updated) {
      notUpdatedCount++;
      // after 20 frames of no updates, shut off the loop
      if (notUpdatedCount > 150) {
        //noLoop();
        notUpdatedCount = 0;
      }
    } else {
      notUpdatedCount = 0;
    }
  }
}

function TX(x) {
  if (zoomEnabled) {
    return map(x, zoomX1.value, zoomX2.value, mapX1, mapX2);

  } else {
    return map(x, minX, maxX, mapX1, mapX2);
  }
}


function TY(y) {
  if (zoomEnabled) {
    return map(y, zoomY1.value, zoomY2.value, mapY2, mapY1);

  } else {
    return map(y, minY, maxY, mapY2, mapY1);
  }
}


function mousePressed() {
  if ((mouseX > width - 100) && (mouseY > height - 50)) {
    zoomEnabled = !zoomEnabled;
    redraw();
  }

  //println(TX(mouseX) + " " + TY(mouseY) + "    " + mouseX + " " + mouseY);

}

function keyPressed() {

  //typedCount++;

  if ((key == BACKSPACE) || (key == DELETE)) {
    if (typedCount > 0) {
      typedCount--;
    }
    updateTyped();

  } else if ((key >= '0') && (key <= '9')) {
    if (typedCount != 5) { // only 5 digits
      if (foundCount > 0) { // don't allow to keep typing bad
        typedChars[typedCount++] = key;
      }
    }
  }
  updateTyped();
}

function updateTyped() {
  typedString = subset(typedChars, 0, typedCount);

  println("typedString: " + typedString);

  // Un-highlight areas already typed past
  for (var i = 0; i < typedCount; i++) faders[i].target(0);
  // Highlight potential dots not yet selected by keys
  for (var i = typedCount; i < 6; i++) faders[i].target(1);


  if (!typedString.isEmpty()) {

    typedPartials[typedCount] = Integer.valueOf(typedString);
    println(typedString);

    for (var j = typedCount - 1; j > 0; --j) {
      typedPartials[j] = typedPartials[j + 1] / 10;
    }

  }

  foundCount = 0;
  chosen = null;


  boundsX1 = maxX;
  boundsY1 = maxY;
  boundsX2 = minX;
  boundsY2 = minY;

  for (var i = 0; i < placeCount; i++) {
    // update boundaries of selection
    // and identify whether a particular place is chosen
    places[i].check();
  }

  calcZoom();

  loop(); // re-enable updates

}



function Record() {

  var totalValue;
  var count;
  var zipCode;

  this.read = function(pieces) {

    this.zipCode = pieces[0];
    this.totalValue = pieces[1];
    this.count = pieces[2];

  };
}

function calcZoom() {

  if (foundCount != 0) {
    // given a set of min/max coords, expand in one direction so that the 
    // selected area includes the range with the proper aspect ratio

    var spanX = (boundsX2 - boundsX1);
    var spanY = (boundsY2 - boundsY1);

    var midX = (boundsX1 + boundsX2) / 2;
    var midY = (boundsY1 + boundsY2) / 2;

    if ((spanX != 0) && (spanY != 0)) {
      var screenAspect = width / height;
      var spanAspect = spanX / spanY;

      if (spanAspect > screenAspect) {
        spanY = (spanX / width) * height; // wide

      } else {
        spanX = (spanY / height) * width; // tall          
      }
    } else { // if span is zero
      // use the span from one level previous
      spanX = targetX2[typedCount - 1] - targetX1[typedCount - 1];
      spanY = targetY2[typedCount - 1] - targetY1[typedCount - 1];
    }
    targetX1[typedCount] = midX - spanX / 2;
    targetX2[typedCount] = midX + spanX / 2;
    targetY1[typedCount] = midY - spanY / 2;
    targetY2[typedCount] = midY + spanY / 2;

  } else if (typedCount != 0) {
    // nothing found at this level, so set the zoom identical to the previous
    targetX1[typedCount] = targetX1[typedCount - 1];
    targetY1[typedCount] = targetY1[typedCount - 1];
    targetX2[typedCount] = targetX2[typedCount - 1];
    targetY2[typedCount] = targetY2[typedCount - 1];
  }

  zoomX1.target(targetX1[typedCount]);
  zoomY1.target(targetY1[typedCount]);
  zoomX2.target(targetX2[typedCount]);
  zoomY2.target(targetY2[typedCount]);

  if (!zoomEnabled) {
    zoomX1.set(zoomX1.target);
    zoomY1.set(zoomY1.target);
    zoomX2.set(zoomX2.target);
    zoomY2.set(zoomY2.target);
  }
}


function Place(code, name, x, y) {

  this.code = code;
  this.name = name;
  this.x = lon;
  this.y = lat;

  var matchDepth;
  var totVal;
  var count;

  partial = [6];
  partial[5] = code;
  partial[4] = partial[5] / 10;
  partial[3] = partial[4] / 10;
  partial[2] = partial[3] / 10;
  partial[1] = partial[2] / 10;
  //}


  this.check = function() {
    // default to zero levels of depth that match
    matchDepth = 0;

    if (typedCount !== 0) {
      // Start from the greatest depth, and work backwards to see how many 
      // items match. Want to figure out the maximum match, so better to 
      // begin from the end. 
      // The multiple levels of matching are important because more than one
      // depth level might be fading at a time.
      for (var j = typedCount; j > 0; --j) {
        if (typedPartials[j] == partial[j]) {
          matchDepth = j;
          break; // since starting at end, can stop now
        }
      }
    }

    //if (partial[typedCount] == partialCode) {
    if (matchDepth == typedCount) {
      foundCount++;
      if (typedCount == 5) {
        chosen = this;
      }

      if (x < boundsX1) boundsX1 = x;
      if (y < boundsY1) boundsY1 = y;
      if (x > boundsX2) boundsX2 = x;
      if (y > boundsY2) boundsY2 = y;
    }
  };

  this.draw = function() {

    //float valScale = totVal / 1000;
    var valScale = sqrt(totVal) / 7;

    var xx = TX(x);
    var yy = TY(y);

    //for hovering zips
    var dist = 3;
    if ((mouseX + dist > xx && mouseX - dist < xx) && (mouseY + dist > yy && mouseY - dist < yy)) {

      textSize(valScale * 2);
      //textSize(constrain(valScale, 10, 40));
      fill(255);
      text(code, xx, yy);
      fill(backgroundColor);

    }

    // if (xx < 0) || yy < 0) {

    // }

    console.log(xx);

    //if (xx < 0) || (yy < 0) || (xx >= width) || (yy >= height) return;

    if ((zoomDepth.value < 2.8) || !zoomEnabled) { // show simple dots
      //pixels[((int) yy) * width + ((int) xx)] = faders[matchDepth].cvalue;

      //set((int)xx, (int)yy, faders[matchDepth].colorValue);
      fill(faders[matchDepth].colorValue, 50 + valScale);
      stroke(faders[matchDepth].colorValue, 50 + valScale);
      rect(xx, yy, valScale, valScale);

    } else { // show slightly more complicated dots
      noStroke();

      fill(faders[matchDepth].colorValue);
      //rect(TX(nlon), TY(nlat), depther.value-1, depther.value-1);

      if (matchDepth == typedCount) {
        if (typedCount == 4) { // on the fourth digit, show nums for the 5th
          textSize(constrain(valScale, 20, 40));
          text(code % 10, TX(x), TY(y));
        } else { // show a larger box for selections
          textSize(constrain(valScale, 20, 40));
          fill(faders[matchDepth].colorValue, 50);
          stroke(faders[matchDepth].colorValue, 50);
          rect(xx, yy, zoomDepth.value + valScale, zoomDepth.value + valScale);
        }
      } else { // show a slightly smaller box for unselected
        rect(xx, yy, zoomDepth.value - 1, zoomDepth.value - 1);
      }
    }
  };


  this.drawChosen = function() {
    noStroke();
    textSize(20);
    fill(faders[matchDepth].colorValue);
    // the chosen point has to be a little larger when zooming
    var size = zoomEnabled ? 6 : 4;
    rect(TX(x), TY(y), size, size);

    // calculate position to draw the text, slightly offset from the main point
    var textX = TX(x);
    var textY = TY(y) - size - 4;

    // don't go off the top.. (e.g. 59544)
    if (textY < 20) {
      textY = TY(y) + 20;
    }

    // don't run off the bottom.. (e.g. 33242)
    if (textY > height - 5) {
      textY = TY(y) - 20;
    }



    var location = name + "  " + nf(code, 5) + '\n' + "Number of Sales: " + count + '\n' + "Total Sales: " + totVal;

    if (zoomEnabled) {
      textAlign(CENTER);
      text(location, textX, textY);

    } else {
      var wide = textWidth(location);

      if (textX > width / 3) {
        textX -= wide + 8;
      } else {
        textX += 8;
      }

      textAlign(LEFT);
      fill(highlightColor);
      text(location, textX, textY);
    }
  };
}

function Slurper() {

  var result;

  function preload() {

    result = loadStrings('data/zips.txt');

    line = result[0];
    parseInfo(line);

    places = new Place[totalCount];

    for (var i = 0; i < totalCount; i++) {
      places[placeCount] = parsePlace(line);
      placeCount++;
    }

  }



}


// Slurper() {
// 	Thread thread = new Thread(this);
// 	thread.start();
// }

// public void run() {
// 	try {
// 		InputStream input = openStream("zips.gz");
// 		BufferedReader reader = createReader(input);

// 		// first get the info line
// 		String line = reader.readLine();
// 		parseInfo(line);

// 		places = new Place[totalCount];

// 		// parse each of the rest of the lines
// 		while ((line = reader.readLine()) != null) {
// 			places[placeCount] = parsePlace(line);
// 			placeCount++;
// 		}
// 	} catch (IOException e) {
// 		e.printStackTrace();
// 	}
// }
//}


function Integrator() {

  var DAMPING = 0.5; // formerly 0.9f
  var ATTRACTION = 0.2; // formerly 0.1f

  var value = 0;
  var vel = 0;
  var accel = 0;
  var force = 0;
  var mass = 1;

  var damping; //     = DAMPING;
  var attraction; //  = ATTRACTION;

  var targeting; // = false;
  var target; //      = 0;


  this.Integrator = function() {
    this.value = 0;
    this.damping = DAMPING;
    this.attraction = ATTRACTION;
  }


  this.Integrator = function(value) {
    this.value = value;
    this.damping = DAMPING;
    this.attraction = ATTRACTION;
  }


  this.Integrator = function(value, damping, attraction) {
    this.value = value;
    this.damping = damping;
    this.attraction = attraction;
  }


  this.set = function(v) {
    value = v;
    //targeting = false  ?
  }


  this.update = function() { // default dtime = 1.0
    if (targeting) {
      force += attraction * (target - value);
    }

    accel = force / mass;
    vel = (vel + accel) * damping; /* e.g. 0.90 */
    value += vel;

    force = 0; // implicit reset

    return (vel > 0.0001);
  }


  this.target = function(t) {
    targeting = true;
    target = t;
  }


  this.noTarget = function() {
    targeting = false;
  }
}



function ColorIntegrator(_color0, _color1) {

    var r0, g0, b0, a0;
    var rs, gs, bs, as;
    this.color0 = _color0;
    this.color1 = _color1;

    var colorValue;

    var a1 = (color0 >> 24) & 0xff;
    var r1 = (color0 >> 16) & 0xff;
    var g1 = (color0 >> 8) & 0xff;
    var b1 = (color0) & 0xff;

    var a2 = (color1 >> 24) & 0xff;
    var r2 = (color1 >> 16) & 0xff;
    var g2 = (color1 >> 8) & 0xff;
    var b2 = (color1) & 0xff;

    r0 = r1 / 255.0;
    g0 = g1 / 255.0;
    b0 = b1 / 255.0;
    a0 = a1 / 255.0;

    rs = (r2 - r1) / 255.0;
    gs = (g2 - g1) / 255.0;
    bs = (b2 - b1) / 255.0;
    as = (a2 - a1) / 255.0;

  this.update = function() {

    var updated = Integrator.update();

    if (updated) {
      colorValue =
        ((((a0 + as * value) * 255) << 24) |
        (((r0 + rs * value) * 255) << 16) |
        (((g0 + gs * value) * 255) << 8) |
        (((b0 + bs * value) * 255)));
    }

    return updated;
  }


  this.get = function() {
    return colorValue;
  }
}