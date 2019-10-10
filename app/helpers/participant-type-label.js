import { helper } from '@ember/component/helper';

const PARTICIPANT_TYPE_LABEL_LOOKUP = {
  BB: 'Borough Board',
  BP: 'Borough President',
  CB: 'Community Board',
};

export default helper(function participantTypeLabel(params) {
  const [participantType] = params;
  return PARTICIPANT_TYPE_LABEL_LOOKUP[participantType];
});
