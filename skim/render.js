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

function Arc(index, centerX, centerY, startAngle, endAngle, innerR, outerR) {
  return { render: render };
  
  function asPath(centerX, centerY, startAngle, endAngle, innerR, outerR) {
    var radians = Math.PI / 180,
      largeArc = +(endAngle - startAngle > 180);
      outerX1 = centerX + outerR * Math.cos((startAngle-90) * radians),
      outerY1 = centerY + outerR * Math.sin((startAngle-90) * radians),
      outerX2 = centerX + outerR * Math.cos((endAngle-90) * radians),
      outerY2 = centerY + outerR * Math.sin((endAngle-90) * radians),
      innerX1 = centerX + innerR * Math.cos((endAngle-90) * radians),
      innerY1 = centerY + innerR * Math.sin((endAngle-90) * radians),
      innerX2 = centerX + innerR * Math.cos((startAngle-90) * radians),
      innerY2 = centerY + innerR * Math.sin((startAngle-90) * radians);
    
    // build the path array
    var path = [
      ["M", outerX1, outerY1], //move to the start point
      ["A", outerR, outerR, 0, largeArc, 1, outerX2, outerY2], //draw the outer edge of the arc
      ["L", innerX1, innerY1], //draw a line inwards to the start of the inner edge of the arc
      ["A", innerR, innerR, 0, largeArc, 0, innerX2, innerY2], //draw the inner arc
      ["z"] //close the path
    ];                   
    return path;
  };
  function fillColor(index) {
    return "rgb(40, " + ((4-index)/4)*255 + ", " + (index/4)*255 + ")"
  }
  function render() {
    return [
      "#arc" + index, "path",
      {
        path: asPath(centerX, centerY, startAngle, endAngle, innerR, outerR),
        "stroke-width": 1,
        "stroke": "rgb(100,100,100)",
        fill: fillColor(index)
      }
    ]
  }
  
}

function Column(point, index, dataLength, totalWidth, totalHeight) {
  var datum = point.value;
  var id = point.id;
  var width = totalWidth/dataLength;
  return {
    render: render,
    topFromBottom: topFromBottom 
  };
  function topFromBottom() {
    return totalHeight - (datum * totalHeight);
  }
  function fillColor(datum) {
    if (datum > 0.8) { return "rgb(222, 59, 30)" }
    return "rgb(40, 172, 73)";
  }
  function strokeColor(datum) {
    if (datum > 0.8) { return "rgb(221, 103, 103)" };
    return "rgb(49, 102, 63)";
  }
  function render() {
    return (
      [ "#" + id, "rect", 
        { x: (width * index) - width, 
          y: topFromBottom(), 
          width: width, 
          height: datum * totalHeight,
          fill: fillColor(datum),
          "stroke-width": 1,
          "stroke": strokeColor(datum)
        }
      ]
    )
  }
}

function Graph(maxColumns) {
  var data = [];
  var width = 800;
  var height = 200;
  return { 
    render: render,
    addDatum: addDatum,
    addData: addData
  };
  function addData(newData) {
    newData.forEach(function(d) {
      addDatum(d);
    })
  }
  function addDatum(d) { 
    if (data.length >= maxColumns) { data.shift(); }
    data.push(d);
  }
  function render() {
    var columns = data.map(function(datum, index) {
      return Column(datum, index, data.length, width, height).render();
    })
    return columns.concat(ThresholdPie(data, [0.3, 0.5]).render());
  }
}

function ThresholdPie(data, thresholds) {
  return { render: render }
  function render() {
    var hist = thresholds.map(function(threshold, index) {
      return data.filter(
        function(d) { return d.value < threshold }
      ).length
    }).reverse();
    var total = data.length;
    var arcs = hist.map(function(h, index) {
      return Arc(index, 300, 350, 0, ((h/total) * 360), 40, 100).render();
    });
    return [
      Arc(hist.length, 300, 350, 0, 359.9, 40, 100).render()
    ].concat(arcs);
  }
}

function newDatum(value) {
  idCount += 1;
  return {value: value, id: idCount};
}
function success(response) {
  var resp = JSON.parse(response);
  graph.addDatum(newDatum(resp.value));
  oldDom = updateComponent(graph, oldDom);
  idCount += 1;
}
function initialSuccess(response) {
  var resp = JSON.parse(response);
  resp.forEach(function(r) {
    graph.addDatum({value: r.value, id: idCount});
    idCount += 1;
  });
  updateComponent(graph, oldDom);
  oldDom = updateComponent(graph, oldDom);
}

var oldDom = [];

var host = "http://localhost:3000"
var idCount = 0;
var graph = Graph(60);
$.ajax({
  crossDomain: true,
  url: host + "/initial",
  success: initialSuccess,
  cache: false
});
setInterval(function() {
  $.ajax({
    crossDomain: true,
    url: host + "/",
    success: success,
    cache: false
  });
}, 2000)