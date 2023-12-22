import Component from '@ember/component';

export default class InfoTooltip extends Component {
  tagName = 'span'

  // @argument
  tip = ''

  // @argument
  icon = 'info-circle'

  popperOptions = {
    modifiers: {
      preventOverflow: {
        escapeWithReference: false
      }
    }
  };
}
