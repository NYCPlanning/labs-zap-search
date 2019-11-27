import { Factory, faker, trait } from 'ember-cli-mirage';
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

  // Domain is ['Filed', 'Certified', 'Approved', 'Withdrawn']
  dcpPublicstatus: 'Filed',

  // Domain is ['Filed', 'In Public Review', 'Completed', 'Unknown']
  // This field is derived from dcpPublicstatus.
  // See https://github.com/NYCPlanning/zap-api/blob/develop/queries/projects/show.sql#L28
  dcpPublicstatusSimp: 'Filed',

  dcpName() {
    return faker.random.number();
  },

  dcpAlterationmapnumber() {
    return faker.random.number();
  },

  dcpBorough() {
    return faker.random.arrayElement(['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']);
  },

  dcpBsanumber() {
    return faker.random.number();
  },

  dcpCeqrnumber() {
    return faker.random.number();
  },

  dcpCeqrtype() {
    return faker.random.arrayElement(['Type I', 'Type II', 'Unlisted']);
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
    return faker.random.number();
  },

  dcpEaseis() {
    return faker.random.word();
  },

  dcpFemafloodzonea() {
    return faker.random.arrayElement(['Flood Zone A', '']);
  },

  dcpFemafloodzonecoastala() {
    return faker.random.arrayElement(['Coastal Flood Zone', '']);
  },

  dcpFemafloodzoneshadedx() {
    return faker.random.arrayElement(['Shaded Flood Zone X', '']);
  },

  dcpFemafloodzonev() {
    return faker.random.arrayElement(['Flood Zone V', '']);
  },

  dcpLeadagencyforenvreview() {
    return faker.commerce.department();
  },

  dcpLeaddivision() {
    return faker.commerce.department();
  },

  dcpLpcnumber() {
    return faker.random.number();
  },

  dcpNydospermitnumber() {
    return faker.random.number();
  },

  dcpPreviousactiononsite() {
    return faker.random.word();
  },

  dcpProjectbrief() {
    return faker.lorem.paragraph(7);
  },

  dcpProjectname() {
    return `
      ${faker.random.arrayElement([faker.address.streetName(), faker.company.companyName()])}
      ${faker.random.arrayElement(['Rezoning', faker.address.streetSuffix()])}
    `;
  },

  projectCompleted() {
    return faker.date.past();
  },

  dcpHiddenprojectmetrictarget() {
    return faker.random.word();
  },

  dcpSischoolseat() {
    return faker.random.boolean();
  },

  dcpSisubdivision() {
    return faker.random.boolean();
  },

  dcpUlurpNonulurp() {
    return faker.random.arrayElement(['ULURP', 'Non-ULURP']);
  },

  dcpWrpnumber() {
    return faker.random.number();
  },

  dcpCommunitydistrict() {
    return faker.random.word();
  },

  dcpCommunitydistricts: 'BX08;SI01;SI02;SI03',

  dcpValidatedcommunitydistricts() {
    return faker.random.word();
  },

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
      server
        .createList('action', 2, { project });
    },
  }),

  withActionsAndDispositions: trait({
    afterCreate(project, server) {
      server
        .createList('action', 2, { project });

      server
        .createList('disposition', 2, { project });

      // server.db.actions.update({
      //   dispositions: server.schema.dispositions.all(),
      // });
    },
  }),
});
