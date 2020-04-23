import Component from '@ember/component';
import { classNames } from '@ember-decorators/component';

@classNames('map-info-box')

export default class mapInfoBoxComponent extends Component {
  // @argument
  legend = true;

  // @argument
  disclaimer = true;
}
