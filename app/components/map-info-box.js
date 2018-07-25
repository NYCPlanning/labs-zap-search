import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { classNames } from '@ember-decorators/component';

@classNames('map-info-box')

export default class mapInfoBoxComponent extends Component {
  @argument
  legend = true;

  @argument
  disclaimer = true;
}
