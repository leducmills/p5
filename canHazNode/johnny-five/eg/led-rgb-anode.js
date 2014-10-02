var five = require("../lib/johnny-five.js");

five.Board().on("ready", function() {
  var a = new five.Led.RGB({
    pins: {
      red: 3,
      green: 5,
      blue: 6
    },
    isAnode: true
  });

  this.repl.inject({
    a: a,
  });

  a.pulse();
});
