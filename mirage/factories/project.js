import { Factory, faker } from 'ember-cli-mirage';
import bblFeatureCollection from '../test-data/bbl-feature-collection';

export default Factory.extend({

  // dcp_projectid was deleted from Project model
  // Also, faker.random.uuid() seems broken:
  // https://github.com/Marak/faker.js/issues/790
  // id() {
  //   return faker.random.uuid();
  // },

  dcp_name() {
    return faker.random.number();
  },

  dcp_alterationmapnumber() {
    return faker.random.number();
  },

  dcp_borough() {
    return faker.random.arrayElement(['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']);
  },

  dcp_bsanumber() {
    return faker.random.number();
  },

  dcp_ceqrnumber() {
    return faker.random.number();
  },

  dcp_ceqrtype() {
    return faker.random.arrayElement(['Type I', 'Type II', 'Unlisted']);
  },

  dcp_certifiedreferred() {
    return faker.date.past();
  },

  dcp_currentenvironmentmilestone() {
    return faker.random.word();
  },

  dcp_currentmilestone() {
    return faker.random.word();
  },

  dcp_decpermitnumber() {
    return faker.random.number();
  },

  dcp_easeis() {
    return faker.random.word();
  },

  dcp_femafloodzonea() {
    return faker.random.arrayElement(['Flood Zone A', '']);
  },

  dcp_femafloodzonecoastala() {
    return faker.random.arrayElement(['Coastal Flood Zone', '']);
  },

  dcp_femafloodzoneshadedx() {
    return faker.random.arrayElement(['Shaded Flood Zone X', '']);
  },

  dcp_femafloodzonev() {
    return faker.random.arrayElement(['Flood Zone V', '']);
  },

  dcp_leadagencyforenvreview() {
    return faker.commerce.department();
  },

  dcp_leaddivision() {
    return faker.commerce.department();
  },

  dcp_lpcnumber() {
    return faker.random.number();
  },

  dcp_nydospermitnumber() {
    return faker.random.number();
  },

  dcp_previousactiononsite() {
    return faker.random.word();
  },

  dcp_projectbrief() {
    return `${faker.lorem.sentences()}. [Test](https://google.com)`;
  },

  dcp_projectname() {
    return `
      ${faker.random.arrayElement([faker.address.streetName(), faker.company.companyName()])}
      ${faker.random.arrayElement(['Rezoning', faker.address.streetSuffix()])}
    `;
  },

  dcp_publicstatus() {
    return faker.random.arrayElement(['Active', 'Approved', 'Withdrawn']);
  },

  dcp_hiddenprojectmetrictarget() {
    return faker.random.word();
  },

  dcp_sischoolseat() {
    return faker.random.boolean();
  },

  dcp_sisubdivision() {
    return faker.random.boolean();
  },

  dcp_ulurp_nonulurp() {
    return faker.random.arrayElement(['ULURP', 'Non-ULURP']);
  },

  dcp_wrpnumber() {
    return faker.random.number();
  },

  dcp_communitydistrict() {
    return faker.random.word();
  },

  dcp_communitydistricts: 'BX08;SI01;SI02;SI03',

  dcp_validatedcommunitydistricts() {
    return faker.random.word();
  },

  bbl_featurecollection() {
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

  milestones() {
    return [
      {
        dcp_name: 'ZC - Land Use Fee Payment ',
        milestonename: 'Land Use Fee Payment',
        dcp_plannedstartdate: '2018-10-31T01:21:46',
        dcp_plannedcompletiondate: '2018-11-02T01:21:46',
        dcp_actualstartdate: '2018-05-11T04:00:00',
        dcp_actualenddate: '2018-05-12T04:00:00',
        statuscode: 'Completed',
        dcp_milestonesequence: 28,
      },
      {
        dcp_name: 'ZC - Land Use Application Filed Review ',
        milestonename: 'Land Use Application Filed Review',
        dcp_plannedstartdate: '2018-11-03T01:21:46',
        dcp_plannedcompletiondate: '2018-12-03T02:21:46',
        dcp_actualstartdate: null,
        dcp_actualenddate: null,
        statuscode: 'Overridden',
        dcp_milestonesequence: 29,
      },
      {
        dcp_name: 'ZC - City Council Review ',
        milestonename: 'City Council Review',
        dcp_plannedstartdate: null,
        dcp_plannedcompletiondate: null,
        dcp_actualstartdate: '2016-04-22T01:40:24',
        dcp_actualenddate: '2022-05-02T01:40:24',
        statuscode: 'Not Started',
        dcp_milestonesequence: 60,
      },
      {
        dcp_name: 'ZC - Final Letter Sent ',
        milestonename: 'Final Letter Sent',
        dcp_plannedstartdate: '2018-04-22T01:40:24',
        dcp_plannedcompletiondate: '2018-05-02T01:40:24',
        dcp_actualstartdate: null,
        dcp_actualenddate: null,
        statuscode: 'Not Started',
        dcp_milestonesequence: 60,
      },
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

  afterCreate(project, server) {
    server.createList('action', 3, { project });
    server.create('hearing', { project });
  },
});
