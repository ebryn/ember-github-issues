var Router = Ember.Router.extend(); // ensure we don't share routes between all Router instances

Router.map(function() {
  this.route('component-test');
  this.route('helper-test');
  this.resource('issues', {path: "issues/:issue_id"}, function() {
    // this.route('new');
  });

  this.resource('newIssues');
  this.resource('myIssues');
});

export default Router;
