import DS from 'ember-data';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

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

export const PARTICIPANT_TYPE_RECOMMENDATION_TYPE_LOOKUP = {
  'Borough President': 'dcpBoroughpresidentrecommendation',
  'Borough Board': 'dcpBoroughboardrecommendation',
  'Community Board': 'dcpCommunityboardrecommendation',
};

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

  @attr('string', { defaultValue: '' }) dcpRecommendationsubmittedbyValue;

  // sourced from a left join with contact table
  // e.g. 'QN CB6', 'BX BP', 'MN BB'
  @alias('dcpRecommendationsubmittedbyValue') fullname;

  @attr('string', { defaultValue: null }) dcpName;

  // sourced from dcp_dcpPublichearinglocation
  @attr('string', { defaultValue: null }) dcpPublichearinglocation;

  @attr('number', { defaultValue: null }) dcpIspublichearingrequired;

  @attr('string', { defaultValue: null }) dcpRepresenting;

  // sourced from dcp_dcpDateofpublichearing
  @attr('date', { defaultValue: null }) dcpDateofpublichearing;

  @attr('string', { defaultValue: null }) dcpNameofpersoncompletingthisform;

  // sourced from dcp_projectactionid in dcp_projectaction table
  // e.g. 9bbfbec7-2407-ea11-a9aa-001dd8308025

  @attr('string', { defaultValue: '' }) dcpProjectactionValue;

  @alias('dcpProjectactionValue') dcpProjectaction;
  // Not needed
  // @attr('string', { defaultValue: '' }) formCompleterName;

  // Not needed
  // @attr('string', { defaultValue: '' }) formCompleterTitle;

  // #### Recommendation Type per Each of the 3 Participants ####
  // sourced from dcp_dcpBoroughpresidentrecommendation
  // e.g. 'Favorable', 'Conditional Favorable', 'Unfavorable', 'Conditional Unfavorable',
  // 'No Objection', 'Waiver of Recommendation', N/A is defualt

  // sourced from dcp_dcpBoroughboardrecommendation
  // e.g. 'Favorable', 'Conditional Favorable', 'Unfavorable', 'Conditional Unfavorable',
  // 'No Objection', 'Waiver of Recommendation', N/A is defualt

  // sourced from dcp_dcpCommunityboardrecommendation
  // e.g. 'Favorable', 'Conditional Favorable', 'Unfavorable', 'Conditional Unfavorable',
  // 'No Objection', 'Waiver of Recommendation', N/A is defualt


  // TODO: These are duplicates??? Are they numbers or strings?
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

  @attr('string', { defaultValue: '' }) dcpBoroughboardrecommendation;

  @attr('string', { defaultValue: '' }) dcpCommunityboardrecommendation;

  @attr('string', { defaultValue: '' }) dcpBoroughpresidentrecommendation;

  @attr('string', { defaultValue: '' }) statuscode;

  @attr('string', { defaultValue: '' }) statecode;

  @attr() documents;

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
  @computed('fullname', 'dcpRepresenting')
  get fullNameLongFormat() {
    const boroughLookup = {
      MN: 'Manhattan',
      BX: 'Bronx',
      QN: 'Queens',
      BK: 'Brooklyn',
      SI: 'Staten Island',
    };

    // shortName = e.g. 'QNCB5'
    const shortName = this.get('fullname');
    // borough = e.g. 'Queens'
    const borough = shortName !== null ? (boroughLookup[shortName.substring(0, 2)] || '') : '';
    // participantType = e.g. "Community Board"
    const participantType = this.get('dcpRepresenting');
    // cbNumber = e.g. QNCB5 --> 5
    const cbNumber = shortName !== null ? shortName.substring(5) : '';
    // concat together
    // CBs have numbers whereas BPs and BBs do not
    if (participantType === 'Community Board') {
      return borough.concat(' ', participantType, ' ', cbNumber);
    }
    return borough.concat(' ', participantType);
  }

  // the recommendation based on the user type
  // e.g. a Community Board will have a dcpCommunityboardrecommendation `Favorable`
  @computed('dcpRepresenting', 'dcpCommunityboardrecommendation', 'dcpBoroughboardrecommendation', 'dcpBoroughpresidentrecommendation')
  get recommendationLabel() {
    // participantType e.g. `Borough Board`
    const participantType = this.get('dcpRepresenting');
    // e.g. `conditional favorable`
    return this.get(PARTICIPANT_TYPE_RECOMMENDATION_TYPE_LOOKUP[participantType]);
  }

  @computed('statecode', 'statuscode', 'dcpRepresenting', 'dcpIspublichearingrequired')
  get showHearingDetails() {
    if (
      (['Active', 'Inactive'].includes(this.get('statecode')))
          && (['Saved', 'Submitted', 'Not Submitted'].includes(this.get('statuscode')))
          && (this.get('dcpIspublichearingrequired') === 717170000)
          && (['Borough President', 'Borough Board', 'Community Board'].includes(this.get('dcpRepresenting')))
    ) { return true; }
    return false;
  }

  @computed('statecode', 'statuscode', 'dcpRepresenting')
  get showRecommendationDetails() {
    if (
      (this.get('statecode') === 'Inactive')
          && (['Submitted', 'Not Submitted'].includes(this.get('statuscode')))
          && (['Borough President', 'Borough Board', 'Community Board'].includes(this.get('dcpRepresenting')))
    ) { return true; }
    return false;
  }
}
