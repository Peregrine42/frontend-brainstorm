function compareObjects(old, newObj) {
  var verboseDiff = {};
  var different = false;
  Object.keys(newObj).forEach(function(key) {
    keyDiff = old[key] !== newObj[key];
    if (keyDiff) different = true;
    if (keyDiff) verboseDiff[key] = newObj[key];
  })
  if (different) return verboseDiff;
  return "same";
}

function fillUp(list, length, dummy) {
  while (list.length < length) {
    list.push(dummy)
  }
}

function compare(oldDom, newDom) {
  var diff = [];
  var different = false;
  if (oldDom.length < newDom.length) {
    fillUp(oldDom, newDom.length, $.extend(true, [], ["", {}, []]));
  }
  newDom.forEach(function(el, index) {
    labelDiff = el[0] === oldDom[index][0] ? "same" : newDom[index][0];
    if (labelDiff === "same") {
      attrDiff = compareObjects(oldDom[index][1], el[1]);
    } else {
      attrDiff = el[1];
    }
    childDiff = compare(oldDom[index][2], el[2])
    if (labelDiff != "same" || attrDiff != "same" || childDiff != "same") {
      diff.push([labelDiff, attrDiff, childDiff])
      different = true;
    } else {
      diff.push("same");
    }
  })
  if (different) return diff;
  return "same";
}

var oldDom = [];
var newDom = [
  [ "line", { x1: 40, y1: 40, x2: 60, y2: 60 }, [] ]
];
var diff = compare(oldDom, newDom);
console.log(
  "zero to initial", diff,
  JSON.stringify(diff) === JSON.stringify(
    [[ "line", { x1: 40, y1: 40, x2: 60, y2: 60 }, "same" ]]
  )
);

var oldDom = $.extend(true, [], newDom);
var newDom = [
  [ "line", { x1: 40, y1: 40, x2: 70, y2: 60 }, [] ]
]
var diff = compare(oldDom, newDom);
console.log(
  "update", diff,
  JSON.stringify(diff) === JSON.stringify([[ "same", { x2: 70 }, "same" ]])
);

var oldDom = $.extend(true, [], newDom);
var diff = compare(oldDom, newDom);
console.log(
  "same", diff,
  JSON.stringify(diff) === JSON.stringify("same")
);

var oldDom = $.extend(true, [], newDom);
var newDom = [
  [ "line", { x1: 0, y1: 0, x2: 0, y2: 60 }, [] ]
]
var diff = compare(oldDom, newDom);
console.log(
  "big update", diff,
  JSON.stringify(diff) === JSON.stringify(
    [[ "same", { x1: 0, y1: 0, x2: 0 }, "same" ]]
  )
);

var oldDom = $.extend(true, [], newDom);
var newDom = [
  [ "line", { x1: 0, y1: 0, x2: 0, y2: 60 }, [] ],
  [ "rect", { x1: 40, y1: 30, x2: 0, y2: 60 }, [] ]
]
var diff = compare(oldDom, newDom);
console.log(
  "addition", diff,
  JSON.stringify(diff) === JSON.stringify(
    [
      "same",
      [ "rect", { x1: 40, y1: 30, x2: 0, y2: 60 }, "same" ]
    ]
  )
);

var oldDom = $.extend(true, [], newDom);
var newDom = [
  [ "rect", { x1: 40, y1: 30, x2: 0, y2: 60 }, [] ]
]
var diff = compare(oldDom, newDom);
console.log(
  "deletion", diff,
  JSON.stringify(diff) === JSON.stringify(
    [
      [ "rect", { x1: 40, y1: 30, x2: 0, y2: 60 }, "same" ]
    ]
  )
);
