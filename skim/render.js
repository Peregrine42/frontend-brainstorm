// The components
function Tetronimo() {
  return {render: render}
  function render() {
    return [ 
      "#4", "path", { 
      path: 
        "M 250 250 l 0 -50 l -50 0 l 0 -50 l -50 0 l 0 50 l -50 0 l 0 50 z",
      "stroke-width": 5
      } 
    ]
  }
}
function Path() {
  return {render: render}
  function buildPath(origin) {
    
  }
  function render(color, origin) {
    newPath = buildPath(origin)
    return [ 
      "#1", "path", { 
      path: 
        "M30 30 l10 10",
      "stroke-dasharray": "-",
      stroke: color,
      "stroke-width": 3,
      "arrow-end": "oval-wide-long"
      } 
    ]
  }
}
function Circle() {
  return {render: render}
  function render(radius, origin) {
    return [ 
      "#3", "circle", { 
        x: origin.x, 
        y: origin.y, 
        r: radius,
        "stroke-width": 3
      }
    ]
  }
}
function Canvas() {
  return { 
    render: render,
    state: {
      color: "rgb(0, 0, 0)",
      radius: 50,
      origin: { x: 0, y: 0 }
    } 
  };
  
  function render() {
    var color = this.state.color;
    var radius = this.state.radius;
    var origin = this.state.origin;
    return [
      Tetronimo().render(),
      Circle().render(radius, origin),
      Path().render(color, origin)
    ]
  }
}

// initial setup
var target = document.getElementById("container");
var paper = Raphael(target);

var TYPE = 1;
var ID = 2;
var SHAPE_NAME = 3;
var ATTRIBUTES = 4;

function updateShape(shape, attributes) {
  shape.attr(attributes);
}

// how to draw a path
function createPath(action) {
  var attrs = action[ATTRIBUTES];
  var path = paper.path(attrs.path);
  updateShape(path, attrs);
  return path;
}

// how to draw a circle
function createCircle(action) {
  var attrs = action[ATTRIBUTES];
  var circle = paper.circle(attrs.x, attrs.y, attrs.r);
  updateShape(circle, attrs);
  return circle;
}

function createShape(action) {
  if (action[SHAPE_NAME] === "path") {
    return createPath(action);
  } else if (action[SHAPE_NAME] === "circle") {
    return createCircle(action);
  }
}

var shapes = {};
function create(action) {
  var shape = createShape(action);
  shapes[action[ID]] = shape;
}

function findShape(action, shapes) {
  return shapes[action[ID]]
}

function update(action) {
  var shape = findShape(action, shapes);
  updateShape(shape, action);
}

function patch(diff) {
  diff.forEach(function(action) {
    if (action[TYPE] === "create") {
      create(action);
    } else if (action[TYPE] === "update") {
      update(action);
    } else if (action[TYPE] === "destroy") {
      destroy(action);
    }
  });
}
function destroy(action) {
  var shape = findShape(action, shapes);
  shape.remove();
}  

function updateComponent(component, oldDom, state) {
  var newDom = component.render(state);
  var diff = compare(oldDom, newDom);
  console.log("diff", diff);
  patch(diff);
  return newDom;
}

var oldDom = [];
var canvas = Canvas();
var oldDom = updateComponent(canvas, oldDom);

canvas.state.radius = 200;
var oldDom = updateComponent(canvas, oldDom);

canvas.state.radius = canvas.state.radius * 2;
var oldDom = updateComponent(canvas, oldDom);

// var oldDom = $.extend(true, [], newDom);
// var newDom = [
//   Path().render(),
//   Circle().render(),
//   Tetronimo().render()
// ]
// var diff = compare(oldDom, newDom);
// console.log(diff);
// patch(diff);