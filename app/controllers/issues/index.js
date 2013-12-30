/*globals alert */

import Assignee from "appkit/models/assignee";
import Comment from "appkit/models/comment";
import BufferedProxy from "appkit/utils/buffered-proxy";

export default Ember.ObjectController.extend(BufferedProxy, {
  assignees: function() {
    return Assignee.findAll();
  }.property(),

  flagNames: function() {
    return ['review', 'needsinfo'];
  }.property(),

  labelsText: function() {
    var labels = this.get('labels').mapProperty('name');
    return labels.join(", ");
  }.property('labels.[]'),

  actions: {
    save: function() {
      this.applyBufferedChanges();
      this.get('model').save();
    },

    saveComment: function() {
      var self = this,
          text = this.get('newCommentText'),
          comment = Comment.create({body: text, issueId: this.get('id')});

      comment.save().then(function() {
        self.get('model.commentModels').pushObject(comment);
        self.set('newCommentText', null);
      }, function(reason) {
        alert("Comment creation failed");
      });
    },

    saveFlag: function() {
      var model = this.get('model'),
          flags = model.get('flags');

      flags.pushObject({name: this.get('newFlagName'), requestee: this.get('newFlagRequestee')});

      this.setProperties({
        newFlagName: null,
        newFlagRequestee: null
      });

      model.save();
    },

    removeFlag: function(flag) {
      var model = this.get('model'),
          flags = model.get('flags');
      flags.removeObject(flag);
      model.save();
    }
  }
});