var oldDom = [];
var newDom = [
  [ "#1", "line", { 
    x1: 90, 
    y1: 70, 
    x2: 50, 
    y2: 80, 
    "stroke-dasharray": "-."
  }, [] ],
  [ "#2", "line", { x1: 40, y1: 40, x2: 50, y2: 60 }, [] ],
  [ "#3", "circle", { x: 50, y: 80, r: 50 }, [] ],
];
var diff = compare(oldDom, newDom);

// initial setup
var target = document.getElementById("container");
var paper = Raphael(target);


var SHAPE_NAME = 3;
var ATTRIBUTES = 4;

// how to draw a line
function createLine(action) {
  var lineAttrs = action[ATTRIBUTES];
  var pathString = 
    "M " + lineAttrs.x1 + 
    " " + lineAttrs.y1 + 
    " l " + lineAttrs.x2 + 
    " " + lineAttrs.y2;
  var path = paper.path(pathString);
  path.attr({"stroke-dasharray": lineAttrs["stroke-dasharray"] })
}

function createCircle(action) {
  var attrs = action[ATTRIBUTES];
  paper.circle(attrs.x, attrs.y, attrs.r);
}

diff.forEach(function(action) {
  if (action[SHAPE_NAME] === "line") {
    createLine(action);
  } else if (action[SHAPE_NAME] === "circle") {
    createCircle(action);
  }
});
