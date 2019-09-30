import { Factory, faker } from 'ember-cli-mirage';
import bblFeatureCollection from '../test-data/bbl-feature-collection';

export default Factory.extend({

  // dcpProjectid was deleted from Project model
  // Also, faker.random.uuid() seems broken:
  // https://github.com/Marak/faker.js/issues/790
  // id() {
  //   return faker.random.uuid();
  // },

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

  dcpPublicstatus() {
    return faker.random.arrayElement(['Active', 'Approved', 'Withdrawn']);
  },

  dcpPublicstatusSimp() {
    return faker.random.arrayElement(['Active', 'Approved', 'Withdrawn']);
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

  afterCreate(project, server) {
    // The number of actions created here cannot be more than the number of unique
    // action codes in the action factory.
    server.createList('action', 7, { project });
  },
});
