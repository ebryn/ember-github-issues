/* globals hljs */

export default Ember.Component.extend({
  didInsertElement: function() {
    hljs.highlightBlock(this.get('element'));
  }
});