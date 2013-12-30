export default Ember.Route.extend({
  model: function() {
    return this.modelFor('application');
  },

  controllerName: 'index'
});