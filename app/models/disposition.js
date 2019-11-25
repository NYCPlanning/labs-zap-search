import DS from 'ember-data';
import { computed } from '@ember/object';

const {
  Model, attr, belongsTo,
} = DS;

export const STATUSCODES = [
  { Label: 'Draft', Value: 1 },
  { Label: 'Saved', Value: 717170000 },
  { Label: 'Submitted', Value: 2 },
  { Label: 'Deactivated', Value: 717170001 },
  { Label: 'Not Submitted', Value: 717170002 },
];

export const STATECODES = [
  { Label: 'Active', Value: 0 },
  { Label: 'Inactive', Value: 1 },
];

// mirrors @attr but allows for computed a
// value for serialization
export function attrComputed(...keys) {
  return computed(...keys).meta({
    type: 'number',
    isAttribute: true,
    kind: 'attribute',
  });
}

export default class DispositionModel extends Model {
  // DB table: dcp_communityboarddisposition

  @belongsTo('project') project;

  // @belongsTo('action', { async: true }) action;
  @computed('project')
  get action() {
    return this.project.get('actions').findBy('id', this.dcpProjectaction);
  }

  @belongsTo('assignment', { async: true }) assignment;

  // sourced from a left join with contact table
  // e.g. 'QN CB6', 'BX BP', 'MN BB'
  @attr('string', { defaultValue: '' }) fullname;

  // sourced from dcp_dcpPublichearinglocation
  @attr('string', { defaultValue: null }) dcpPublichearinglocation;

  @attr('string', { defaultValue: null }) dcpIspublichearingrequired;

  // sourced from dcp_dcpDateofpublichearing
  @attr('date', { defaultValue: null }) dcpDateofpublichearing;

  @attr('string', { defaultValue: 'ZAP LUP Portal' }) dcpNameofpersoncompletingthisform;

  // sourced from dcp_projectactionid in dcp_projectaction table
  // e.g. 9bbfbec7-2407-ea11-a9aa-001dd8308025
  @attr('string', { defaultValue: '' }) dcpProjectaction;
  // Not needed
  // @attr('string', { defaultValue: '' }) formCompleterName;

  // Not needed
  // @attr('string', { defaultValue: '' }) formCompleterTitle;

  // #### Recommendation Type per Each of the 3 Participants ####
  // sourced from dcp_dcpBoroughpresidentrecommendation
  // e.g. 'Favorable', 'Conditional Favorable', 'Unfavorable', 'Conditional Unfavorable',
  // 'Received after Clock Expired', 'No Objection', 'Waiver of Recommendation', N/A is defualt

  // sourced from dcp_dcpBoroughboardrecommendation
  // e.g. 'Favorable', 'Unfavorable', 'Waiver of Recommendation', 'Non-Complying', N/A as default

  // sourced from dcp_dcpCommunityboardrecommendation
  // 'Approved', 'Approved with Modifications/Conditions', 'Disapproved', 'Disapproved with Modifications/Conditions',
  // 'Non-Complying', 'Vote Quorum Not Present', 'Received after Clock Expired', 'No Objection', 'Waiver of Recommendation',
  // N/A as default

  @attr('number', { defaultValue: null }) dcpBoroughpresidentrecommendation;

  @attr('number', { defaultValue: null }) dcpBoroughboardrecommendation;

  @attr('number', { defaultValue: null }) dcpCommunityboardrecommendation;

  // sourced from dcp_dcpConsideration
  // memo, exta information from participant
  @attr('string', { defaultValue: '' }) dcpConsideration;

  // sourced from dcp_dcpVotelocation
  @attr('string', { defaultValue: '' }) dcpVotelocation;

  // calculate this upon form submission
  @attr('date') dcpDatereceived;

  // link to dcp_dcpDateofvote
  // TODO: investigate the format server expects.
  // potentially switch back to "Date" attribute type, if compatible with
  // backend
  @attr('date', { defaultValue: null }) dcpDateofvote;

  // sourced from statuscode
  // Label: 'Draft', 'Value': 1
  // Label: 'Saved', 'Value': 717170000
  // Label: 'Submitted', 'Value': 2
  // Label: 'Deactivated', 'Value': 717170001
  // Label: 'Not Submitted', 'Value': 717170002
  @attrComputed(
    // recommendations
    'dcpDateofvote',
    'dcpBoroughpresidentrecommendation',
    'dcpBoroughboardrecommendation',
    'dcpCommunityboardrecommendation',
    'dcpIspublichearingrequired',

    // hearings
    'dcpPublichearinglocation',
    'dcpDateofpublichearing',
  )
  get statuscode() {
    if (this.dcpBoroughpresidentrecommendation !== null
      || this.dcpBoroughboardrecommendation !== null
      || this.dcpCommunityboardrecommendation !== null
    ) return STATUSCODES.findBy('Label', 'Submitted').Value;

    if (
      this.dcpIspublichearingrequired !== null
    ) return STATUSCODES.findBy('Label', 'Saved').Value;

    if (this.dcpPublichearinglocation
      || this.dcpDateofpublichearing
    ) return STATUSCODES.findBy('Label', 'Saved').Value;

    return STATUSCODES.findBy('Label', 'Draft').Value;
  }

  @attrComputed('statuscode')
  get statecode() {
    if (
      STATUSCODES.findBy('Value', this.statuscode).Label === 'Saved'
      || STATUSCODES.findBy('Value', this.statuscode).Label === 'Draft'
    ) return STATECODES.findBy('Label', 'Active').Value;

    return STATECODES.findBy('Label', 'Inactive').Value;
  }

  // sourced from dcp_docketdescription
  @attr('string') dcpDocketdescription;

  // sourced from dcp_dcpVotinginfavorrecommendation
  @attr('number') dcpVotinginfavorrecommendation;

  // sourced from dcp_votingagainstrecommendation
  @attr('number') dcpVotingagainstrecommendation;

  // sourced from dcp_votingabstainingonrecommendation
  @attr('number') dcpVotingabstainingonrecommendation;

  // sourced from dcp_totalmembersappointedtotheboard
  @attr('number') dcpTotalmembersappointedtotheboard;

  // sourced from dcp_wasaquorumpresent
  // NOTE: when this is defined as boolean, it automatically changes to false from null
  // we want this to be null until a user selects yes or no
  @attr({ defaultValue: null }) dcpWasaquorumpresent;

  // fullname = e.g. 'QN CB5'
  // recommendationSubmittedByFullName = e.g. `Queens Community Board 5`
  @computed('fullname')
  get fullNameLongFormat() {
    const boroughLookup = {
      MN: 'Manhattan',
      BX: 'Bronx',
      QN: 'Queens',
      BK: 'Brooklyn',
      SI: 'Staten Island',
    };

    const participantLookup = {
      BP: 'Borough President',
      BB: 'Borough Board',
      CB: 'Community Board',
    };

    // shortName = e.g. 'QNCB5'
    const shortName = this.get('fullname');
    // borough = e.g. 'Queens'
    const borough = boroughLookup[shortName.substring(0, 2)];
    // participantTypeAbbr = e.g. 'CB'
    const participantTypeAbbr = shortName.substring(3, 5);
    // participantType = e.g. "Community Board"
    const participantType = participantLookup[participantTypeAbbr];
    // cbNumber = e.g. QNCB5 --> 5
    const cbNumber = shortName.substring(5);
    // concat together
    // CBs have numbers whereas BPs and BBs do not
    if (participantTypeAbbr === 'CB') {
      return borough.concat(' ', participantType, ' ', cbNumber);
    }
    return borough.concat(' ', participantType);
  }
}
