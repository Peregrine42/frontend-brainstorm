function Graph() {
  return {
    nodes: [],
    links: []
  }
}

function GraphView(graph) {
  function render() {
    var rendered_nodes = graph.nodes.map(
      function(node) {
        return [ "circle", { cx: 0, cy: 0 } ]
      }
    )
    return rendered_nodes
  }
  
  return {
    graph: graph,
    render: render
  }
}