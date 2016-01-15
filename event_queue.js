var parse_JSON = function(e) {
  return { "payload": JSON.parse(e.payload) }
}

var extract = function(label, e) {
  return { "x": e.payload[label] }
}

var add_to_history = function(label, e) {
  var new_value = e[label]
  return { "history": orch.new_from_adding(new_label, e._last.history) }
}

// not pure - but only interacts with the DOM if patching necessary
var with_template_from_file = function(target_element, template_filename, e) {
  template_string = load_template(template_filename)
  generated_html = slm(template_string, { "e": e })
  new_tree = html2hscript(generated_html)
  patches = diff(e._last.tree, new_tree)
  patch_with_$(target_element.raw, patches) // this is the tricky bit -
                                            // writing a patch function
                                            // that takes a set of patches,
                                            // and outputs jquery
                                            // functions
}


orch().on("new_from_server")
  .pipe(parse_JSON)
  .emit("new_json")

orch().on("new_json")
  .pipe(extract.bind(null, "x"))
  .emit("new_x")

orch().on("new_json")
  .pipe(extract.bind(null, "y"))
  .emit("new_y")

orch().on("new_x")
  .pipe(add_to_history.bind(null, "x"))
  .emit("new_x_history")

orch().on("new_x_history")
  .replace_$("#list_of_x")    // all events sent through this pipeline will have access to a vdom representation of the object
  .with_template_from_file("template.slm")

orch().emit("new_from_server", { "payload": "{ x: 5, extra: 10 }" })

orch().on("foo")
  .wait_for("bar")       // each 'foo' will not be garbage collected
  .unless("cleanup")     // unless the 'cleanup' event fires, which garbage collects all 'foos'
  .return_as("foobar")   // 'foo' is paired with a 'bar' -> both sets of attributes are passed to the new event
                         // you cannot chain this - too complicated
orch().emit("cleanup")
  .every(3000)

orch().on("new_y")
  .pipe(parse_JSON)
  .pipe() // etc...

orch().use("new_from_server")
  .and_any_dependents()
  .with_only("new_y")

orch().use("new_from_server")
  .and_any_dependents()
  .with_only("new_x", "new_z")

// event setup and transformation
.on
.pipe
.emit

// activation
.use
.and_any_dependents
.with_only

// timing
.every

// synchronisation
.wait_for
.unless

// outputting to DOM
.with_template_from_file
.replace_$
