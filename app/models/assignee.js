var attr = Ember.attr;

export default Ember.Model.extend({
  id: attr(),
  login: attr()
}).reopenClass({
  adapter: Ember.RESTAdapter.extend({
    buildURL: function() {
      return this._super.apply(this, arguments).replace(".json", "");
    }
  }).create(),

  url: "https://api.github.com/repos/emberjs/ember.js/assignees"
});