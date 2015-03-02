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
      window.resizeTo(1300, 850);
      post_id = 1;
      //initTable();
      getPostID(data);
      canvas = sketch.createCanvas(1000, 750);
      canvas.id("canvas");
      canvas.size(1000, 750);
      canvas.position(200, 10);
      var text = sketch.createDiv("Data" + '<br>' + "Press P to Post" + '<br>' + "Press L to Load" + '<br>');
      text.style("font-size", "12px");
      text.position(10, 10);

    };

    sketch.draw = function() {

    };

    sketch.mousePressed = function() {

      console.log("mousePressed");

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
        console.log("load");
        sketch.loadJSON('https://data.sparkfun.com/output/jqw90z7AZEcbzRGD8K36.json?page=1', gotData);
      }

      if (sketch.key == '1') {
        graph1();
      }

      if (sketch.key == '2') {
        graph2();
      }

      if (sketch.key == '3') {
        graph3();
      }

      if (sketch.key == '4') {
        graph4();
      }

      if (sketch.key == '5') {
        graph5();
      }

      if (sketch.key == '6') {
        graph6();
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
        console.log('error');
        return;
      } else {
        console.log('got something');
        parseData(stream);

      }
    }


    function parseData(stream) {


      labelLength = Object.keys(stream[0]).length;
      streamLabels = new Array(labelLength);

      for (var r = 0; r < labelLength; r++) {
        streamLabels[r] = Object.keys(stream[0])[r];
      }

      dataArray = new Array(labelLength);
      for (i = 0; i < labelLength; i++) {
        dataArray[i] = new Array(stream.length);
      }

      for (var a = 0; a < streamLabels.length; a++) {

        var lab = streamLabels[a];

        for (var b = 0; b < stream.length; b++) {

          dataArray[a][b] = stream[b][lab];

        }
      }
    }

    function chartInit() {

      fillC = "rgba(" + parseInt(sketch.random(255)) + "," + parseInt(sketch.random(255)) + "," + 0 + "," + 0.2 + ")";
      strokeC = "rgba(" + parseInt(sketch.random(255)) + "," + parseInt(sketch.random(255)) + "," + 0 + "," + 0.2 + ")";
      pointC = "rgba(" + parseInt(sketch.random(255)) + "," + parseInt(sketch.random(255)) + "," + 0 + "," + 0.2 + ")";
      pointStrokeC = "rgba(" + parseInt(sketch.random(255)) + "," + parseInt(sketch.random(255)) + "," + 0 + "," + 0.2 + ")";
      pointHiFill = "rgba(" + parseInt(sketch.random(255)) + "," + parseInt(sketch.random(255)) + "," + 0 + "," + 0.2 + ")";
      pointHiStroke = "rgba(" + parseInt(sketch.random(255)) + "," + parseInt(sketch.random(255)) + "," + 0 + "," + 0.2 + ")";
    }



    function graph1() {

      chartInit();

      var chartSchema = {
        labels: dataArray[0],
        datasets: [{
          label: streamLabels[1],
          fillColor: fillC,
          strokeColor: strokeC,
          pointColor: pointC,
          pointStrokeColor: pointStrokeC,
          pointHighlightFill: pointHiFill,
          pointHighlightStroke: pointHiStroke,
          data: dataArray[1],
        }, {
          label: streamLabels[2],
          data: dataArray[2],
          fillColor: fillC,
          strokeColor: strokeC,
        }]
      };

      graphLoaded = true;

      var doit = function() {
        console.log("onload");
        var ctx = document.getElementById("canvas").getContext("2d");
        window.myLine = new Chart(ctx).Line(chartSchema, {
          responsive: true
        });
      };

      if (graphLoaded === true) {
        doit();
      }
    }


    function graph2() {

      chartInit();

      //var type = Bar;

      var chartSchema = {
        labels: dataArray[0],
        datasets: [{
          label: streamLabels[1],
          fillColor: fillC,
          strokeColor: strokeC,
          pointColor: pointC,
          pointStrokeColor: pointStrokeC,
          pointHighlightFill: pointHiFill,
          pointHighlightStroke: pointHiStroke,
          data: dataArray[1],
        }, {
          label: streamLabels[2],
          data: dataArray[2],
          fillColor: fillC,
          strokeColor: strokeC,

        }]
      };

      graphLoaded = true;

      var doit = function() {
        console.log("onload");
        var ctx = document.getElementById("canvas").getContext("2d");
        window.myLine = new Chart(ctx).Bar(chartSchema, {
          responsive: true
        });
      };

      if (graphLoaded === true) {
        doit();
      }
    }


    function graph3() {

      chartInit();

      var chartSchema = {
        labels: dataArray[0],
        datasets: [{
          label: streamLabels[1],
          fillColor: fillC,
          strokeColor: strokeC,
          pointColor: pointC,
          pointStrokeColor: pointStrokeC,
          pointHighlightFill: pointHiFill,
          pointHighlightStroke: pointHiStroke,
          data: dataArray[1],
        }, {
          label: streamLabels[2],
          data: dataArray[2],
          fillColor: fillC,
          strokeColor: strokeC,

        }]
      };

      graphLoaded = true;

      var doit = function() {
        console.log("onload");
        var ctx = document.getElementById("canvas").getContext("2d");
        window.myLine = new Chart(ctx).Radar(chartSchema, {
          responsive: true
        });
      };

      if (graphLoaded === true) {
        doit();
      }
    }



    function graph4() {

      chartInit();

      //var type = Bar;

      var chartSchema = [
        {
          value: dataArray[2][0],
          color: fillC,
          highlight: pointHiFill,
          label: streamLabels[1],
        },
        {
          value: dataArray[2][1],
          color: fillC,
          highlight: pointHiFill,
          label: streamLabels[2],
        }
        
        ];
      

      graphLoaded = true;

      var doit = function() {
        console.log("onload");
        var ctx = document.getElementById("canvas").getContext("2d");
        window.myLine = new Chart(ctx).PolarArea(chartSchema, {
          responsive: true
        });
      };

      if (graphLoaded === true) {
        doit();
      }
    }

    function graph5() {

      chartInit();

      //var type = Bar;

      var chartSchema = [
        {
          value: dataArray[2][0],
          color: fillC,
          highlight: pointHiFill,
          label: streamLabels[1],
        },
        {
          value: dataArray[2][1],
          color: fillC,
          highlight: pointHiFill,
          label: streamLabels[2],
        }
        
        ];

      graphLoaded = true;

      var doit = function() {
        console.log("onload");
        var ctx = document.getElementById("canvas").getContext("2d");
        window.myLine = new Chart(ctx).Pie(chartSchema, {
          //responsive: true
        });
      };

      if (graphLoaded === true) {
        doit();
      }
    }


    function graph6() {

      chartInit();

      //var type = Bar;

      var chartSchema = [
        {
          value: dataArray[2][0],
          color: fillC,
          highlight: pointHiFill,
          label: streamLabels[1],
        },
        {
          value: dataArray[2][1],
          color: pointHiFill,
          highlight: fillC,
          label: streamLabels[2],
        }
        
        ];

      graphLoaded = true;

      var doit = function() {
        console.log("onload");
        var ctx = document.getElementById("canvas").getContext("2d");
        window.myLine = new Chart(ctx).Pie(chartSchema, {
          //responsive: true
        });
      };

      if (graphLoaded === true) {
        doit();
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