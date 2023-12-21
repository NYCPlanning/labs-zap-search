import { Factory, trait } from 'miragejs';
import { faker } from '@faker-js/faker';
import bblFeatureCollection from '../test-data/bbl-feature-collection';

export default Factory.extend({

  // dcpProjectid was deleted from Project model
  // Also, faker.random.uuid() seems broken:
  // https://github.com/Marak/faker.js/issues/790
  // id() {
  //   return faker.random.uuid();
  // },

  // dcpPublicStatus and dcpPublicstatusSimp should not receive random mock data
  // because their values are critical to expressing project state.

  // Domain is ['Noticed', Filed', 'In Public Review', 'Completed']
  dcpPublicstatus: 'Filed',

  // Domain is ['Noticed', 'Filed', 'In Public Review', 'Completed', 'Unknown']
  // This field is derived from dcpPublicstatus.
  // See https://github.com/NYCPlanning/zap-api/blob/develop/queries/projects/show.sql#L28
  dcpPublicstatusSimp: 'Filed',

  dcpName() {
    return faker.random.numeric();
  },

  dcpAlterationmapnumber() {
    return faker.random.numeric();
  },

  dcpBorough() {
    return faker.helpers.arrayElement(['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']);
  },

  dcpBsanumber() {
    return faker.random.numeric();
  },

  dcpCeqrnumber() {
    return faker.random.numeric();
  },

  dcpCeqrtype() {
    return faker.helpers.arrayElement(['Type I', 'Type II', 'Unlisted']);
  },

  dcpCertifiedreferred() {
    return faker.date.past();
  },

  dcpCurrentenvironmentmilestone() {
    return faker.random.word();
  },

  dcpCurrentmilestone() {
    return faker.random.word();
  },

  dcpDecpermitnumber() {
    return faker.random.numeric();
  },

  dcpEaseis() {
    return faker.random.word();
  },

  dcpFemafloodzonea() {
    return faker.helpers.arrayElement(['Flood Zone A', '']);
  },

  dcpFemafloodzoneshadedx() {
    return faker.helpers.arrayElement(['Shaded Flood Zone X', '']);
  },


  dcpLeadagencyforenvreview() {
    return faker.commerce.department();
  },

  dcpLeaddivision() {
    return faker.commerce.department();
  },

  dcpLpcnumber() {
    return faker.random.numeric();
  },

  dcpNydospermitnumber() {
    return faker.random.numeric();
  },

  dcpPreviousactiononsite() {
    return faker.random.word();
  },

  dcpProjectbrief() {
    return faker.lorem.paragraph(7);
  },

  dcpProjectname() {
    return `
      ${faker.helpers.arrayElement([faker.address.streetName(), faker.company.companyName()])}
      ${faker.helpers.arrayElement(['Rezoning', faker.address.streetSuffix()])}
    `;
  },

  projectCompleted() {
    return faker.date.past();
  },

  dcpHiddenprojectmetrictarget() {
    return faker.random.word();
  },

  dcpSischoolseat() {
    return faker.datatype.boolean();
  },

  dcpSisubdivision() {
    return faker.datatype.boolean();
  },

  dcpUlurpNonulurp() {
    return faker.helpers.arrayElement(['ULURP', 'Non-ULURP']);
  },

  dcpWrpnumber() {
    return faker.random.numeric();
  },

  dcpValidatedcommunitydistricts: 'X08,R01,R02,R03',

  bblFeaturecollection() {
    return bblFeatureCollection;
  },

  bbls() {
    return [
      '3026150001',
      '3026150006',
      '3026150025',
      '3026150125',
      '3026150002',
      '3026150019',
      '3026150050',
    ];
  },

  keywords() {
    return [
      'IBZ',
    ];
  },

  applicants() {
    return faker.company.companyName();
  },

  applicantteam() {
    return [
      {
        role: 'Applicant',
        name: 'BURLINGTON COAT FACTORY OF TEXAS, INC.',
      },
    ];
  },

  cycleTabs: trait({
    tab(i) {
      return faker.list.cycle('archive', 'reviewed', 'to-review', 'upcoming')(i);
    },
  }),

  withMilestones: trait({
    afterCreate(project, server) {
      server.createList('milestone', 10, { project });
    },
  }),

  withAssignments: trait({
    afterCreate(project, server) {
      server.createList('assignment', 2, { project, tab: 'to-review' });
    },
  }),

  withActions: trait({
    afterCreate(project, server) {
      project.update({
        actions: server.createList('action', 2, { project }),
      });
    },
  }),
});
