function Graph() {
  return {
    nodes: [],
    links: []
  }
}

function GraphView() {
  graph = { nodes: [1] }
  function render() {
    var rendered_nodes = graph.nodes.map(
      function(node) {
        return [ "circle", { cx: 40, cy: 40, r: 50 } ]
      }
    )
    return rendered_nodes
  }
  
  return {
    graph: graph,
    render: render
  }
}