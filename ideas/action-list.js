actions = [
  [ "create", "circle",  "#circle1" ],
  [ "move",   "#circle1", 0, 0 ],
  [ "radius", "#circle1", 5],
  
  [ "for_each value in @dns_data", 
    [
      [ "create", "rect", ".rect" ],
      [ "move", ".rect(last).bottom-left", "#circle1" ],
      [ "move", ".rect(last).top-right", 100, 100 ],
      [ "scale", ".rect(last).width", data.length ],
      [ "scale", ".rect(last).height", 100*value ],

      [ "move", "#circle1", ".rect(last).bottom-right" ]
    ]
  ]
]

var oldVDom = {};
var raphaelExpert = function(targetElement) {
  var paper = Raphael(targetElement);
  
  var raphaelFunctions = {
    "create-circle": function(element_id) {},
    "update-circle": function(element_id, key, value) {},
    "delete-circle": function(element_id) {}
  }
  
  return { translate: translate }
  
  function translate(diffActions) {
    var domActions = diffActions.map(function(action) {
      raphaelFunctions[action.name].bind(null, action.args)
    })
    return domActions
  }
};

var domExpert = raphaelExpert("#container");

window.setInterval(function() {
  var newVDom = play(actions, dns_data);
  var diff = compare(oldVDom, newVDom);
  var diffActions = walk(diff);
  var domActions = domExpert.translate(diff);
  domActions.forEach(function(action) { action() });
}, 1000)