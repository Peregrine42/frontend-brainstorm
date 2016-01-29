function findById(dom, el) {
  var result = false;
  dom.forEach(function(candidate) {
    if (el[0] === candidate[0]) { 
      result = candidate; 
      return;
    }
  })
  return result;
}

function findByIdFromContainer(dom, container) {
  var el = container.item;
  var result = findById(dom, el);
  if (!result) { return false }
  return { index: container.index, item: result, oldItem: el };
}

function map(array, func) {
  var result = [];
  array.forEach(function(item) {
    result.push(func(item));
  })
  return result;
}

function flatMap(array, func) {
  return Array.prototype.concat.apply([], array.map(func));
}

function compareValues(key, values) {
  oldValue = values[0];
  newValue = values[1];
  if (oldValue === newValue) return false;
  return [ key, newValue ];
}

function pairKeys(oldObj, newObj) {
  return map(Object.keys(newObj), function(key) {
    var newValue = newObj[key];
    var oldValue = oldObj[key];
    return [key, [oldValue, newValue]];
  })
}

function mergeIntoObject(objArray) {
  var result = {};
  objArray.forEach(function(obj) {
    result[obj[0]] = obj[1];
  })
  return result
}

function compact(arr) {
  var result = [];
  arr.forEach(function(item) {
    if (item) { result.push(item) };
  })
  return result;
}

function objIsEmpty(obj) {
  for(var prop in obj) {
    if (obj.hasOwnProperty(prop)) return obj;
  }
  return false;
}

function compareObjects(oldObj, newObj) {
  var keyPairs = pairKeys(oldObj, newObj);
  var differentKeyPairs = map(keyPairs, (function(pair) { 
    return compareValues(pair[0], pair[1]);
  } ) )
  return objIsEmpty(mergeIntoObject(compact(differentKeyPairs)));
}

function filter(arr, func) {
  result = [];
  arr.forEach(function(item) { if(func(item)) { result.push(item) } })
  return result;
}

function withIndex(arr) {
  result = [];
  arr.forEach(function(item, index) { result.push([index, item]) });
  return result;
}

function withIndexOnObject(arr) {
  result = [];
  arr.forEach(function(item, index) { 
    result.push( { index: index, item: item } ) 
  });
  return result;
}

function notFoundIn(list, el) {
  return !(findById(list, el[1]));
}

function makeDestroyAction(path, indexed_el) {
  var index = indexed_el[0];
  var el = indexed_el[1];
  return [ path + index, "destroy", el[0] ]
}

function makeCreateAction(path, indexed_el) {
  var index = indexed_el[0];
  var el = indexed_el[1];
  return [ path + index, "create", el[0], el[1], el[2] ];
}

function compareObjectAndChildren(path, index, oldEl, el) {
  var actions = [];
  var attrDiff = compareObjects(oldEl[2], el[2]);
  if (attrDiff) { actions.push([path + index, "update", el[0], attrDiff]) }
  var childActions = compare(oldEl[3], el[3], path + index + ".");
  if (childActions) { 
    childActions.forEach(function(a) { actions.push(a) }) 
  }
  return actions;
}

function compareContainers(path, container) {
  var actions = compareObjectAndChildren(
    path, container.index, container.item, container.oldItem
  );
  return actions;
}

function compare(oldDom, newDom, path) {
  if (!path) { path = "." }
  if (!oldDom) { oldDom = [] }
  if (!newDom) { newDom = [] }
  var actions = [];
  
  var oldDomWithIndex = withIndex(oldDom);
  var deletedElements = filter(oldDomWithIndex, notFoundIn.bind(null, newDom));
  var deleteActions = map(deletedElements, makeDestroyAction.bind(this, path));
  
  var newDomWithIndex = withIndex(newDom);
  var createdElements = filter(newDomWithIndex, notFoundIn.bind(null, oldDom));
  var createActions = map(createdElements, makeCreateAction.bind(this, path));
  
  var newDomWithIndex = withIndexOnObject(newDom);
  var elementsInBothDoms = map(
    newDomWithIndex, findByIdFromContainer.bind(null, oldDom)
  );
  var updateActions = flatMap(
    compact(elementsInBothDoms), compareContainers.bind(null, path)
  );
  
  var actions = actions.concat(deleteActions);
  var actions = actions.concat(createActions);
  var actions = actions.concat(updateActions);
  return actions;
}

var oldDom = [];
var newDom = [
  [ "#1", "line", { x1: 40, y1: 40, x2: 60, y2: 60 }, [] ]
];
var diff = compare(oldDom, newDom);
console.log(
  "zero to initial", diff,
  JSON.stringify(diff) === JSON.stringify(
    [[ ".0", "create", "#1", "line", { x1: 40, y1: 40, x2: 60, y2: 60 } ]]
  )
);

var oldDom = $.extend(true, [], newDom);
var newDom = [
  [ "#1", "line", { x1: 40, y1: 40, x2: 70, y2: 60 }, [] ]
]
var diff = compare(oldDom, newDom);
console.log(
  "update", diff,
  JSON.stringify(diff) === JSON.stringify(
    [[ ".0", "update", "#1", { x2: 70 } ]]
  )
);

var oldDom = $.extend(true, [], newDom);
var diff = compare(oldDom, newDom);
console.log(
  "same", diff,
  JSON.stringify(diff) === JSON.stringify([])
);

var oldDom = $.extend(true, [], newDom);
var newDom = [
  [ "#1", "line", { x1: 0, y1: 0, x2: 0, y2: 60 }, [] ]
]
var diff = compare(oldDom, newDom);
console.log(
  "big update", diff,
  JSON.stringify(diff) === JSON.stringify(
    [[ ".0", "update", "#1", { x1: 0, y1: 0, x2: 0 } ]]
  )
);

var oldDom = $.extend(true, [], newDom);
var newDom = [
  [ "#1", "line", { x1: 0, y1: 0, x2: 0, y2: 60 }, [] ],
  [ "#2", "rect", { x1: 40, y1: 30, x2: 0, y2: 60 }, [] ]
]
var diff = compare(oldDom, newDom);
console.log(
  "addition", diff,
  JSON.stringify(diff) === JSON.stringify(
    [
      [ ".1", "create", "#2", "rect", { x1: 40, y1: 30, x2: 0, y2: 60 } ]
    ]
  )
);

var oldDom = $.extend(true, [], newDom);
var newDom = [
  [ "#2", "rect", { x1: 40, y1: 30, x2: 0, y2: 60 }, [] ]
]
var diff = compare(oldDom, newDom);
console.log(
  "deletion", diff,
  JSON.stringify(diff) === JSON.stringify(
    [
      [ ".0", "destroy", "#1" ]
    ]
  )
);

var oldDom = $.extend(true, [], newDom);
var newDom = [
  [ "#2", "rect", { x1: 40, y1: 30, x2: 0, y2: 60 }, [
      [ "#3", "mini-rect", { foo: "bar" } ] 
    ]
  ]
]
var diff = compare(oldDom, newDom);
console.log(
  "creating a nested node", diff,
  JSON.stringify(diff) === JSON.stringify(
    [
      [ ".0.0", "create", "#3", "mini-rect", { foo: "bar" } ]
    ]
  )
);

var oldDom = $.extend(true, [], newDom);
var newDom = [
  [ "#2", "rect", { x1: 40, y1: 30, x2: 0, y2: 60 }, [
      [ "#3", "mini-rect", { foo: "baz" } ] 
    ]
  ]
]
var diff = compare(oldDom, newDom);
console.log(
  "updating a nested node", diff,
  JSON.stringify(diff) === JSON.stringify(
    [
      [ ".0.0", "update", "#3", { foo: "baz" } ]
    ]
  )
);
