var FIREBASE_URL = "https://ember-github-issues.firebaseio.com/";

export function update(url, data) {
  var ref = new Firebase(FIREBASE_URL + url);

  return new Ember.RSVP.Promise(function(resolve, reject) {
    ref.update(data, function(error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export function get(url) {
  var ref = new Firebase(FIREBASE_URL + url);

  return new Ember.RSVP.Promise(function(resolve, reject) {
    ref.once('value', function(snapshot) {
      resolve(snapshot.val());
    });
  });

}