import $ from 'jquery';
import Component from '@ember/component';

export default Component.extend({
  didRender: function() {
    $(this.element).foundation();
  },
});
