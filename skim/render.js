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
    endPoint = { x: 150 - origin.x, y: 100 - origin.y };
    return (
      "M" + origin.x + " " + origin.y + " l " + endPoint.x + " " + endPoint.y
    )
  }
  function render(color, origin) {
    var newPath = buildPath(origin);
    return [ 
      "#1", "path", { 
        path: newPath,
        "stroke-dasharray": "-",
        stroke: color,
        "stroke-width": 3,
        "arrow-end": "oval-wide-long",
        "arrow-start": "oval-wide-long"
      } 
    ]
  }
}
function Circle() {
  return {render: render}
  function render(radius, origin) {
    return [ 
      "#3", "circle", { 
        cx: origin.x, 
        cy: origin.y, 
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

function createRect(action) {
  var attrs = action[ATTRIBUTES];
  var rect = paper.rect(0,0,50,50);
  updateShape(rect, attrs);
  return rect;
}

function createShape(action) {
  if (action[SHAPE_NAME] === "path") {
    return createPath(action);
  } else if (action[SHAPE_NAME] === "circle") {
    return createCircle(action);
  } else if (action[SHAPE_NAME] === "rect") {
    return createRect(action);
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

function updateComponent(component, oldDom) {
  var newDom = component.render();
  var diff = compare(oldDom, newDom);
  patch(diff);
  return newDom;
}

// var oldDom = [];
// var canvas = Canvas();
// var oldDom = updateComponent(canvas, oldDom);
// 
// canvas.state.radius = 35;
// var oldDom = updateComponent(canvas, oldDom);
// 
// canvas.state.radius = canvas.state.radius * 2;
// canvas.state.origin.x = 400;
// canvas.state.origin.y = 300;
// var oldDom = updateComponent(canvas, oldDom);

var data = [
  { value: 0.5, id: 0 },
  { value: 0.1, id: 1 },
  { value: 0.4, id: 2 },
  { value: 0.2, id: 3 },
  { value: 0.7, id: 4 },
  { value: 0.9, id: 5 },
  { value: 1,   id: 6 },
  { value: 0.4, id: 7 }
]

function Column(point, index, width, height) {
  var datum = point.value;
  var id = point.id;
  return { 
    render: render,
    topFromBottom: topFromBottom 
  };
  function topFromBottom() {
    return height - (datum * height);
  }
  function render() {
    return (
      [ "#" + id, "rect", 
        { x: width * index, 
          y: topFromBottom(), 
          width: width, 
          height: datum * height }
      ]
    )
  }
}

function Graph(data) {
  return { render: render };
  function render() {
    var columns = data.map(function(datum, index) {
      return Column(datum, index, (500/data.length), 500).render();
    })
    return columns;
  }
}

var oldDom = [];
var graph = Graph(data);
updateComponent(graph, oldDom);