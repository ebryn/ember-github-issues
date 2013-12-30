import Issue from "appkit/models/issue";

export default Ember.Route.extend({
  model: function(params) {
    return Issue.fetch(params.issue_id);
  }
});