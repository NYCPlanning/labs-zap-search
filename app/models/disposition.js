import DS from 'ember-data';
import { computed } from '@ember/object';

const {
  Model, attr, belongsTo,
} = DS;

export default class DispositionModel extends Model {
  // DB table: dcp_communityboarddisposition

  @belongsTo('project') project;

  @belongsTo('action', { async: true }) action;

  @belongsTo('assignment', { async: true }) assignment;

  // sourced from dcp_dcpPublichearinglocation
  @attr('string', { defaultValue: '' }) dcpPublichearinglocation;

  // sourced from dcp_dcpDateofpublichearing
  @attr('date', { defaultValue: null }) dcpDateofpublichearing;

  // sourced from dcp_recommendationsubmittedbyname
  // e.g. 'QNCB6', 'BXBP', 'MNBB'
  @attr('string', { defaultValue: '' }) dcpRecommendationsubmittedbyname;

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

  @attr('string', { defaultValue: '' }) dcpBoroughpresidentrecommendation;

  @attr('string', { defaultValue: '' }) dcpBoroughboardrecommendation;

  @attr('string', { defaultValue: '' }) dcpCommunityboardrecommendation;

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

  // sourced from statecode
  // "Active" vs "Inactive"
  @attr('string') statecode;

  // sourced from statuscode
  // e.g. 'Draft', 'Saved', 'Submitted', 'Deactivated', 'Not Submitted'
  @attr('string') statuscode;

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

  // dcpRecommendationsubmittedbyname = e.g. 'QNCB5'
  // recommendationSubmittedByFullName = e.g. `Queens Community Board 5`
  @computed('dcpRecommendationsubmittedbyname')
  get recommendationSubmittedByFullName() {
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
    const shortName = this.get('dcpRecommendationsubmittedbyname');
    // borough = e.g. 'Queens'
    const borough = boroughLookup[shortName.substring(0, 2)];
    // participantTypeAbbr = e.g. 'CB'
    const participantTypeAbbr = shortName.substring(2, 4);
    // participantType = e.g. "Community Board"
    const participantType = participantLookup[participantTypeAbbr];
    // cbNumber = e.g. QNCB5 --> 5
    const cbNumber = shortName.substring(4);
    // concat together
    // CBs have numbers whereas BPs and BBs do not
    if (participantTypeAbbr === 'CB') {
      return borough.concat(' ', participantType, ' ', cbNumber);
    }
    return borough.concat(' ', participantType);
  }
}
