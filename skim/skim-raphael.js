var target = document.getElementById("container");
var paper = Raphael(target);

var TYPE = 1;
var ID = 2;
var SHAPE_NAME = 3;
var ATTRIBUTES = 4;

function RaphaelSkim(Raphael) {
  return { updateComponent: updateComponent }
  
  function updateShape(shape, attributes) {
    shape.attr(attributes);
  }
  
  function updateShapeAtCreation(shape, attributes) {
    shape.attr(attributes);
  }
  
  function createPath(action) {
    var attrs = action[ATTRIBUTES];
    var path = paper.path(attrs.path);
    updateShapeAtCreation(path, attrs);
    return path;
  }
  
  function createCircle(action) {
    var attrs = action[ATTRIBUTES];
    var circle = paper.circle(attrs.x, attrs.y, attrs.r);
    updateShapeAtCreation(circle, attrs);
    return circle;
  }
  
  function createRect(action) {
    var attrs = action[ATTRIBUTES];
    var rect = paper.rect(0, 0, 0, 0);
    updateShapeAtCreation(rect, attrs);
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
    if (shapes[action[ID]]) { return shapes[action[ID]]};
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
    shapes[action[ID]] = undefined;
  }  
  
  function updateComponent(component, oldDom) {
    var newDom = component.render();
    var diff = compare(oldDom, newDom);
    patch(diff);
    return newDom;
  }
}

