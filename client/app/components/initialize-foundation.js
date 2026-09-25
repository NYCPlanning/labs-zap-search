import $ from 'jquery';
import Component from '@ember/component';

export default Component.extend({
  didRender() {
    // foundation-sites requires jQuery
    // eslint-disable-next-line ember/no-jquery
    $(this.element).foundation();
  },
});
