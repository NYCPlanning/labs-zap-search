import { helper } from '@ember/component/helper';

const RECOMMENDATION_FIELD_BY_PARTICIPANT_TYPE_LOOKUP = {
  BB: 'boroughboardrecommendation',
  BP: 'boroughpresidentrecommendation',
  CB: 'communityboardrecommendation',
};

export default helper(function recFieldByParttypeLookup(params) {
  const [participantType] = params;
  return RECOMMENDATION_FIELD_BY_PARTICIPANT_TYPE_LOOKUP[participantType];
});
