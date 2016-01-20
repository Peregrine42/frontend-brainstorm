describe("a network graph", function() {
  it("has nodes", function() {
    expect(Graph().nodes).toBeDefined();
  });
  
  it("has links", function() {
    expect(Graph().links).toBeDefined();
  })
});

describe("a graph view", function() {
  it("has a graph", function() {
    expect(GraphView({}).graph).toBeDefined();
  });
  
  it("has a render function", function() {
    expect(GraphView({}).render).toBeDefined();
  })
  
  describe(".render", function() {
    it("produces an svg circle for each node", function() {
      expect(GraphView({ nodes: [1, 2]}).render()).toEqual (
        [[ "circle", { cx: 0, cy: 0} ],
        [ "circle", { cx: 0, cy: 0} ]]
      )
    })
  })
})