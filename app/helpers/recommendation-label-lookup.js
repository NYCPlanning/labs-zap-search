import { helper } from '@ember/component/helper';
import { RECOMMENDATION_OPTIONSET_BY_PARTICIPANT_TYPE_LOOKUP } from 'labs-zap-search/controllers/my-projects/assignment/recommendations/add';

export default helper(function recommendationLabelLookup([participantType, labelCode], { objectMode = false }) {
  const optionSet = RECOMMENDATION_OPTIONSET_BY_PARTICIPANT_TYPE_LOOKUP[participantType] || [];
  const option = optionSet.findBy('code', labelCode);

  if (objectMode) return option;

  return option.label;
});
