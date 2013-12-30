import Issue from "appkit/models/issue";

export default Ember.Route.extend({
  beforeModel: function() {
    return this.controllerFor('user').login();
  },

  model: function() {
    return Issue.fetchAll();
  },

  actions: {
    logout: function() {
      this.controllerFor('user').logout();
    }
  }
});
