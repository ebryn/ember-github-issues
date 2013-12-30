module gh from "appkit/utils/github";
import camelizeKeys from "appkit/utils/camelize_keys";

var attr = Ember.attr;

export default Ember.Model.extend({
  id: attr(),
  issueId: attr(),
  body: attr(),
  user: attr(),
  createdAt: attr()
}).reopenClass({
  adapter: Ember.Adapter.extend({
    findQuery: function(klass, records, params) {
      var url = "repos/emberjs/ember.js/issues/" + params.issueId + "/comments";

      return gh.ajax(url).then(function(json) {
        json.issueId = params.issueId;
        records.load(klass, camelizeKeys(json));
        return records;
      });
    },

    createRecord: function(record) {
      var url = "repos/emberjs/ember.js/issues/" + record.get('issueId') + "/comments";

      return gh.post(url, record.getProperties('body')).then(function(json) {
        record.load(json.id, camelizeKeys(json));
        record.didCreateRecord();
        return record;
      });
    }
  }).create()
});