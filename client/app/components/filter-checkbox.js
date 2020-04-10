import Component from '@ember/component';

/**
 * The FilterCheckboxComponent renders markup for the checkbox, handles display
 * logic for the state. It does not itself mutate anything.
 */
export default class FilterCheckboxComponent extends Component {
  /**
   * Label for checkbox which gets displayed and used for stylistic display logic.
   * @argument{String|Number}
   * @required
   */
  value = '';

  /**
   * Currently selected checkbox options; used to compare whether selected
   * @argument{Array}
   * @required
   */
  currentValues = [];
}
