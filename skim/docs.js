// Ok. Here is what the client code looks like when you use skim
// (in an ideal world).

var usefulMessage = UsefulMessage();

var skim = SkimJQuery(Skim, $); // this needs written

var store = Hoverboard({ // this needs imported
  message: function (state, value) {
    return { "message-text": "Hello!" };
  }
});

store.getState(function(props) {
  skim.render(
    usefulMessage(props, store),
    document.getElementById('message-target')
  );
});

// The definition of UsefulMessage could go something like:
function UsefulMessage(currentProps, store) {
  return { render: render };
  
  function render() {
    return (
      [ "div", {}, [
          "p", { content: currentProps["message-text"] }
        ]
      ]
    )
  }
}