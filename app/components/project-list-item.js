import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import _ from 'underscore';

const boroLookup = (boroPrefix) => {
  if (boroPrefix === 'MN') return 'Manhattan';
  if (boroPrefix === 'BX') return 'Bronx';
  if (boroPrefix === 'BK') return 'Brooklyn';
  if (boroPrefix === 'QN') return 'Queens';
  if (boroPrefix === 'SI') return 'Staten Island';
}

export default class ProjectListComponent extends Component {
  @computed('project.dcp_communitydistricts')
  get consolodatedCDs() {
    const delimitedCDs = this.get('project.dcp_communitydistricts');
    const cdsArray = delimitedCDs.split(';')
    let boroughGroups = _.toArray(_.groupBy(cdsArray, (d) => d.substring(0,2)));

    boroughGroups = boroughGroups.map(group => {
      const boroName = boroLookup(group[0].substring(0,2));

      return {
        boroName,
        cds: group.map(d => parseInt(d.substring(2))),
      }
    })

    return boroughGroups
  }

  @computed('project.applicants')
  get firstApplicant() {
    const applicants = this.get('project.applicants');
    return applicants ? applicants.split(';')[0] : 'Unknown';
  }

  @argument
  project = {};
}
