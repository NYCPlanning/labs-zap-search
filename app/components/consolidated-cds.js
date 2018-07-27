import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { tagName } from '@ember-decorators/component';
import _ from 'underscore';

const boroLookup = (boroPrefix) => {
  if (boroPrefix === 'MN') return 'Manhattan';
  if (boroPrefix === 'BX') return 'Bronx';
  if (boroPrefix === 'BK') return 'Brooklyn';
  if (boroPrefix === 'QN') return 'Queens';
  if (boroPrefix === 'SI') return 'Staten Island';
}

@tagName('span')
export default class ProjectListComponent extends Component {

  @argument cds;
  @argument cdlink = false;

  @computed('cds')
  get consolodatedCDs() {
    const { cds } = this;
    const cdsArray = cds.split(';')
    const noDoubleZeroes = cdsArray.filter(d => d.substring(2) !== '00');
    let boroughGroups = _.toArray(_.groupBy(noDoubleZeroes, (d) => d.substring(0,2)));

    boroughGroups = boroughGroups.map(group => {
      const boroName = boroLookup(group[0].substring(0,2));

      return {
        boroName,
        cds: group.map(d => parseInt(d.substring(2))),
      }
    })

    return boroughGroups
  }
}
