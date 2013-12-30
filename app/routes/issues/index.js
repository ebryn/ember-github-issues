export default Ember.Route.extend({
  model: function() {
    return this.modelFor('issues');
  },

  deactivate: function() {
    this.controllerFor('issues/index').discardBufferedChanges();
  }
});