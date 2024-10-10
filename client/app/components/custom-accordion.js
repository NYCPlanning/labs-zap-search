import Ember from "ember";
import foundation from "foundation-sites";
require('foundation-sites');
export default Ember.Component.extend({
  initFoundation: Ember.on('didInsertElement', function () {
    Ember.run.next(() => {
      Ember.$(document).jquery(foundation)
    });
  })
  // initAccordion: function() {
  //   this.$(document).foundation('accordion', {
      
  //   });
  //   console.log("sldkj");

  // }.on('didInsertElement')
  
  // didInsertElement() {
  //   // this._super(...arguments);
  //   console.log("sldkfj");
  //   Ember.run.scheduleOnce('didInsertElement', this, function() {
  //     this.$().foundation('accordion', 'reflow');
  //   });
  //   // this.$().foundation(
  //   //   'accordion'
  //   // )
  // },
  // didInsertElement() {
  //   console.log("hi");
  //   Ember.$(document).foundation();
  // }
 
});