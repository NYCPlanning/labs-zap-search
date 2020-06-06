import Component from '@ember/component';
import { computed } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import _ from 'underscore';

const boroLookup = (boroPrefix) => {
  if (boroPrefix === 'M') return 'Manhattan';
  if (boroPrefix === 'X') return 'Bronx';
  if (boroPrefix === 'K') return 'Brooklyn';
  if (boroPrefix === 'Q') return 'Queens';
  if (boroPrefix === 'R') return 'Staten Island';

  return null;
};

@tagName('span')
export default class ProjectListComponent extends Component {
  // @argument
  cds = '';

  // @argument
  cdlink = false;

  @computed('cds')
  get consolodatedCDs() {
    const { cds } = this;
    const cdsArray = (cds || '').split(',');
    const noDoubleZeroes = cdsArray.filter(d => d.substring(1) !== '00');
    let boroughGroups = _.toArray(_.groupBy(noDoubleZeroes, d => d.substring(0, 1)));

    boroughGroups = boroughGroups.map((group) => {
      const boroName = boroLookup(group[0].substring(0, 1));

      return {
        boroName,
        cds: group.map(d => parseInt(d.substring(1), 10)),
      };
    });

    return boroughGroups;
  }
}
