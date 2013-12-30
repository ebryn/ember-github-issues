export default Ember.Handlebars.makeBoundHelper(function(text) {
  return new Handlebars.SafeString(markdown.toHTML(text));
});

