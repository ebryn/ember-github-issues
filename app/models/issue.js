import camelizeKeys from "appkit/utils/camelize_keys";
import Comment from "appkit/models/comment";
module fb from "appkit/utils/firebase";
module gh from "appkit/utils/github";

export default Ember.Object.extend({
  id: null,
  title: null,
  customStatus: null,
  flags: null,

  commentModels: function(key, value) {
    return Comment.find({issueId: this.get('id')});
  }.property(),

  isPullRequest: function() {
    return !!this.get('pullRequest.htmlUrl');
  }.property('pullRequest'),

  files: function() {
    var id = this.get('id'),
        files = Ember.ArrayProxy.create({content: []});

    gh.ajax("repos/emberjs/ember.js/pulls/" + id + "/files").then(function(json) {
      files.set('content', camelizeKeys(json));
    });

    return files;
  }.property(),

  init: function() {
    this._super();
    if (!this.get('flags')) { this.set('flags', []); }
  },

  save: function() {
    var self = this,
        id = this.get('id'),
        firebasePromise = fb.update("issues/" + id, {
          customStatus: this.get('customStatus'),
          flags: this.get('flags').slice() // FIXME: _super is getting set on the array, causes issue with FB
        }),
        githubPromise = gh.patch("repos/emberjs/ember.js/issues/" + id, {
          assignee: this.get('assignee.login')
        });

    return Ember.RSVP.hash({firebase: firebasePromise, github: githubPromise}).then(function(values) {
      self.setProperties(camelizeKeys(values.github));
      return self;
    });
  }
}).reopenClass({
  fromJSON: function(json) {
    json.assignee = json.assignee && json.assignee.login;
    return this.create(camelizeKeys(json));
  },

  fetch: function(id) {
    var self = this;

    return Ember.RSVP.hash({
      firebase: fb.get("issues/" + id),
      github: gh.ajax("repos/emberjs/ember.js/issues/" + id)
    }).then(function(values) {
      values.github.id = values.github.number; // ignore GH id
      return self.fromJSON(Ember.merge(values.github, values.firebase));
    });
  },

  fetchAll: function() {
    var self = this;

    return Ember.RSVP.hash({
      firebase: fb.get("issues"),
      github: gh.getAll("repos/emberjs/ember.js/issues")
    }).then(function(values) {
      var records = [],
          attrs;

      for (var i = 0, l = values.github.length; i < l; i++) {
        attrs = values.github[i];
        attrs.id = attrs.number; // ignore GH id
        records.push(self.fromJSON(Ember.merge(attrs, values.firebase[attrs.number])));
      }

      return records;
    });
  }
});