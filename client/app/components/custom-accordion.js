import Ember from "ember";
export default Ember.Component.extend({
  didInsertElement: function() {
    $(document).foundation(); // this will only load the section component
  }
});