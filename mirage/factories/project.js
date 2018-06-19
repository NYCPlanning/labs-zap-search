import { Factory, faker } from 'ember-cli-mirage';
import bblFeatureCollection from '../test-data/bbl-feature-collection'

export default Factory.extend({
  dcp_projectid() {
    return faker.random.uuid();
  },

  dcp_name() {
    return faker.random.number();
  },

  dcp_alterationmapnumber() {
    return faker.random.number();
  },

  dcp_applicant_customer() {
    return faker.company.companyName();
  },

  dcp_applicanttype() {
    return faker.random.arrayElement(['Private', 'Other Public Agency', 'DCP']);
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
    return faker.random.arrayElement(['Shaded Flood Zone X','']);
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
    return faker.lorem.sentences();
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

  dcp_communitydistricts() {
    return faker.random.word();
  },

  dcp_validatedcommunitydistricts() {
    return faker.random.word();
  },

  bbl_featurecollection() {
    return bblFeatureCollection;
  },

  bbls() {
    return [
      "3026150001",
      "3026150006",
      "3026150025",
      "3026150125",
      "3026150002",
      "3026150019",
      "3026150050"
    ];
  },

  actions() {
    return [
      {
        "dcp_name": "UK-Unknown Action",
        "dcp_ulurpnumber": null,
        "dcp_prefix": null,
        "statuscode": "Active"
      }
    ];
  },

  milestones() {
    return [
      {
        "dcp_name": "UK - Project  Created  ",
        "dcp_plannedstartdate": "2018-04-12T21:00:15",
        "dcp_plannedcompletiondate": "2018-04-13T21:00:15",
        "statuscode": "Overridden",
        "dcp_milestonesequence": 0
      },
      {
        "dcp_name": "UK - Informational Interest Meeting Prep  ",
        "dcp_plannedstartdate": "2018-04-14T21:00:15",
        "dcp_plannedcompletiondate": "2018-07-13T21:00:15",
        "statuscode": "Overridden",
        "dcp_milestonesequence": 17
      },
      {
        "dcp_name": "UK-Prepare Pre-Application Statement",
        "dcp_plannedstartdate": "2018-03-28T04:00:00",
        "dcp_plannedcompletiondate": "2018-03-28T04:00:00",
        "statuscode": "Completed",
        "dcp_milestonesequence": 18
      },
      {
        "dcp_name": "UK - Review Pre-Application Statement  ",
        "dcp_plannedstartdate": "2018-07-14T21:00:15",
        "dcp_plannedcompletiondate": "2018-08-03T21:00:15",
        "statuscode": "Completed",
        "dcp_milestonesequence": 19
      },
      {
        "dcp_name": "UK - Interdivisional Meeting Prep  ",
        "dcp_plannedstartdate": "2018-05-11T01:04:49",
        "dcp_plannedcompletiondate": "2018-05-21T01:04:49",
        "statuscode": "Completed",
        "dcp_milestonesequence": 20
      },
      {
        "dcp_name": "UK - Finalize Actions  ",
        "dcp_plannedstartdate": "2018-05-11T01:14:16",
        "dcp_plannedcompletiondate": "2018-07-10T01:14:16",
        "statuscode": "In Progress",
        "dcp_milestonesequence": 21
      }
    ];
  },

  keywords() {
    return [
      "IBZ"
    ];
  },
});
