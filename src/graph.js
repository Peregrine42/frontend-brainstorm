function Graph() {
  return {
    nodes: [],
    links: []
  }
}

function NodeView(refresh) {

  return { render: render }

  function onmove(node_data, dx, dy, new_x, new_y, event) {
    node_data.x = new_x - node_data.offset_x;
    node_data.y = new_y - node_data.offset_y;
    refresh();
  }
  function onstart(node_data, x, y) {
    node_data.offset_x = x - node_data.x;
    node_data.offset_y = y - node_data.y;
  }

  function render(node_data) {
    return [
      "circle",
      {
        cx: node_data.x,
        cy: node_data.y,
        fill: "#fff",
        r: 25,
        drag: {
          tag: "drag",
          action: {
            onmove: onmove.bind(null, node_data),
            onstart: onstart.bind(null, node_data)
          }
        }
      }
    ]
  }
}

function GraphView(emit, refresh) {
  var graph = Graph();
  graph.nodes.push({x: 100, y: 100, foo: "bar"})
  graph.nodes.push({x: 300, y: 100, foo: "bar"})

  function render() {
    var rendered_nodes = graph.nodes.map(
      function(node) {
        return [ NodeView.bind(null, refresh), node ]
      }
    )
    return rendered_nodes
  }

  return {
    graph: graph,
    render: render
  }
}
