export default Ember.ArrayController.extend({
  needs: ['user'],
  user: Em.computed.alias('controllers.user'),

  newIssues: Ember.computed.filter('model', function(issue) {
    return issue.labels.length === 0;
  }),

  // Can't use Ember.computed.filter because it only allows a single DK?
  myIssues: function() {
    var issues = this.get('model');
    var currentUser = this.get('user.username');

    return issues.filter(function(issue) {
      return issue.get('assignee') === currentUser ||
             (issue.get('flags') || []).findProperty('requestee', currentUser);
    });
  }.property('model.[]', 'user.username')
});