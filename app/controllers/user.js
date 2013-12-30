module gh from "appkit/utils/github";

export default Ember.ObjectController.extend({
  login: function() {
    var self = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      var fb = new Firebase('https://ember-github-issues.firebaseio.com');
      var auth = new FirebaseSimpleLogin(fb, function(error, user) {
        if (!user || error) { reject(error); }

        gh.auth(user.accessToken);
        localStorage.githubAccessToken = user.accessToken;
        self.set('model', user);
        resolve(user);
      });

      auth.login('github', {
        rememberMe: true,
        scope: 'user,repo'
      });
    });
  },

  logout: function() {
    delete localStorage.githubAccessToken;
    location.reload();
  }
});