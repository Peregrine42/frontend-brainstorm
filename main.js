var h = maquette.h;
var projector = maquette.createProjector();

function renderMaquette() {
  return h('div.landscape', [
    h('p', 'hello from maquette!')
  ]);
};

// Initializes the projector
$(document).ready(function() {
  projector.append(document.body, renderMaquette);
});
