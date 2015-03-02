// Public URL
//https://data.sparkfun.com/streams/jqw90z7AZEcbzRGD8K36
// Public Key
//jqw90z7AZEcbzRGD8K36
// Delete Key
// n33wx7VXorhpQazw63GE
//q3yrzw8o9Yc5JBeyN8Yk
// Private Key
//zzplG0NYvWteJbGrDjyY

//var five = require("serialport");

//http://data.sparkfun.com/input/[publicKey]?private_key=[privateKey]&post_id=[value]&sensor1=[value]&sensor2=[value]&sensor3=[value]&time=[value]

var pub_key = "jqw90z7AZEcbzRGD8K36";
var pri_key = "zzplG0NYvWteJbGrDjyY";

var post_id;
var sensor1;
var sensor2;
var sensor3;
var time;

var canvas;
var url;
var data;

var columnTitles = ["PostID", "Sensor 1", "Sensor 2", "Sensor 3", "Time"];


var table = new p5.Table();

var loadUrl = "https://data.sparkfun.com/output/jqw90z7AZEcbzRGD8K36.json";

var s = function(sketch) {

  sketch.preload = function() {
    console.log("preload");
    data = sketch.loadJSON('https://data.sparkfun.com/output/jqw90z7AZEcbzRGD8K36.json');
    console.log("done loading");
  };

  sketch.setup = function() {

    post_id = 1;
    initTable();
    getPostID(data);
    canvas = sketch.createCanvas(1000, 750);
    canvas.id("canvas");
    canvas.size(1000, 750);
    canvas.position(200, 10);
    var text = sketch.createDiv("Table Data" + '<br>' + "Press P to Post" + '<br>' + "Press L to Load" + '<br>');
    text.style("font-size", "12px");
    text.position(10, 10);

  };

  sketch.draw = function() {

    // if(table.getRows !== null) {
    //   drawTable();
    // }

  };

  sketch.mousePressed = function() {

    console.log("mousePressed");
    //x = sketch.mouseX;
    //sketch.println(x);
    //httpGet(url);
    //sketch.loadJSON('https://data.sparkfun.com/output/jqw90z7AZEcbzRGD8K36.json?page=1', gotData);

    //sketch.redraw();

    var s1 = table.getColumn('Sensor 1');

    for (var i = 0; i < s1.length; i++) {

      sketch.ellipse(200, s1[i], 25, 25);
      sketch.text(s1[i], 200, s1[i]);

    }


  };

  sketch.keyPressed = function() {


    //console.log(sketch.key);

    //post random data
    if (sketch.key == 'P') {
      console.log("post");
      post_id++;
      sensor1 = parseInt(sketch.random(0, 255));
      sensor2 = parseInt(sketch.random(0, 1023));
      sensor3 = sketch.random(0, 20);
      time = new Date();
      url = "https://data.sparkfun.com/input/" + pub_key + "?private_key=" + pri_key + "&post_id=" + post_id + "&sensor1=" + sensor1 + "&sensor2=" + sensor2 + "&sensor3=" + sensor3 + "&time=" + time;

      httpGet(url);
      console.log("posted: " + url);
    }

    if (sketch.key == 'L') {
      table.clearRows();
      console.log("load");
      sketch.background(200);
      sketch.loadJSON('https://data.sparkfun.com/output/jqw90z7AZEcbzRGD8K36.json?page=1', gotData);
      //gotData();
    }

    if (sketch.key == '1') {
      graph1();
    }

    if (sketch.key == '2') {
      graph2();
    }


  };

  function getPostID(stream) {

    console.log("getPostId happens");
    if (this.responseText === 0) {
      console.log("getPostID error");
    } else {

      var length = stream.length;
      post_id = stream[0].post_id;
      console.log(post_id);

    }
  }

  function gotData(stream) {


    sketch.background(200);

    if (this.responseText === 0) {
      sketch.println('error');
      return;
    } else {

      sketch.println('got something');

      var newRow;

      var length = stream.length;
      sketch.println(length);

      for (var i = 0; i < length; i++) {

        newRow = table.addRow();
        newRow.set('Post ID', stream[i].post_id);
        newRow.set('Sensor 1', stream[i].sensor1);
        newRow.set('Sensor 2', stream[i].sensor2);
        newRow.set('Sensor 3', stream[i].sensor3);
        newRow.set('Time', stream[i].time);

      }
      drawTable();
      //loop();
    }
  }


  function initTable() {

    table.addColumn('Post ID');
    table.addColumn('Sensor 1');
    table.addColumn('Sensor 2');
    table.addColumn('Sensor 3');
    table.addColumn('Time');

  }


  function graph1() {

    var graphLoaded = false;

    console.log("graph1");
    
    
    
    var getLabels = function() {
      
      var labelString = "";
      
      for(var i = 0; i < columnTitles.length; i++) {
        labelString = labelString + columnTitles[i] + ', ';
      }
      
      return labelString;
      
    };

    var randomScalingFactor = function() {
      return Math.round(Math.random() * 100);
    };
    

    var lineChartData = {
      labels: [columnTitles[0], columnTitles[1], columnTitles[2], columnTitles[3], columnTitles[4]],
      //labels: [getLabels()],
      datasets: [{
        label: "My First dataset",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
      }, {
        label: "My Second dataset",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]

      }]
    };

    graphLoaded = true;

    var doit = function() {
      console.log("onload");
      var ctx = document.getElementById("canvas").getContext("2d");
      window.myLine = new Chart(ctx).Line(lineChartData, {
        responsive: true
      });
    };

    if (graphLoaded === true) {
      doit();
    }


  }

  function graph2() {
    
    var lineChartData = {
      labels: [columnTitles[0], columnTitles[1], columnTitles[2], columnTitles[3], columnTitles[4]],
      //labels: [getLabels()],
      datasets: [{
        label: "My First dataset",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
      }, {
        label: "My Second dataset",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]

      }]
    };
    
    
    var data = function() {
      
      this.labels = [];
      this.dataSets = [];
      
      for(var i = 0; i < columnTitles.length; i++) {
        labels[i] = columnTitles[i];
      }
      
      
      
    };
    

  }


  function drawTable() {


    var rows = table.getRows();
    var textX = 10;
    var textY = 10;
    console.log("draw table");
    var dataString = "";

    sketch.textSize(10);
    sketch.fill(0);

    for (var i = rows.length - 1; i > 0; i--) {

      dataString = dataString + " " + rows[i].get('Post ID') + " " +
        rows[i].get('Sensor 1') + " " +
        rows[i].get('Sensor 2') + " " +
        rows[i].get('Sensor 3') + " " + '<br>';
      //rows[i].get('Time') + '<br>';

    }

    var dataDiv = sketch.createDiv(dataString);
    dataDiv.style("font-size", "10px");
    dataDiv.position(10, 60);
    sketch.noLoop();
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