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

  dcp_publicstatus_simp() {
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
    // The number of actions created here cannot be more than the number of unique
    // action codes in the action factory.
    server.createList('action', 7, { project });
  },
});
