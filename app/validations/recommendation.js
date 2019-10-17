import {
  validateNumber,
  validatePresence,
} from 'ember-changeset-validations/validators';
import validatePresenceUnlessValue from '../validators/presence-unless-value';

const dateMessage = 'Please enter a valid date';
const numberMessage = 'Please enter a valid non-negative number';
const recommendationPresenceMessage = 'Please select a recommendation';
const dcpVotelocationPresenceMessage = 'Please enter a vote location';

// The following exports are Validation Maps to support ember-changesets
// used in forms like the recommendation form.
// See how they are imported and used in /app/templates/my-project/project/recommendations/add.js
// The ability to use Validation Maps like is thanks to the addon
// `ember-changeset-validations`. Read more about it here:
// https://github.com/poteto/ember-changeset-validations

/* Validations for Dispositions for All Actions */
export const dispositionForAllActionsValidations = {
  recommendation: validatePresence({
    presence: true,
    message: recommendationPresenceMessage,
  }),
};

export const bpDispositionForAllActionsValidations = {
  ...dispositionForAllActionsValidations,
};

export const cbBbDispositionForAllActionsValidations = {
  ...dispositionForAllActionsValidations,

  dcpVotinginfavorrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'recommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotingagainstrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'recommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotingabstainingonrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'recommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpTotalmembersappointedtotheboard: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'recommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotelocation: validatePresence({
    presence: true,
    message: dcpVotelocationPresenceMessage,
  }),

  dcpDateofvote: validatePresence({
    presence: true,
    message: dateMessage,
  }),
};

/* Validations for Dispositions by Action */
export const dispositionValidations = {
};

export const communityBoardDispositionValidations = {
  ...dispositionValidations,

  dcpVotinginfavorrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpCommunityboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotingagainstrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpCommunityboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotingabstainingonrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpCommunityboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpTotalmembersappointedtotheboard: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpCommunityboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpBoroughpresidentrecommendation: validatePresence({
    presence: false,
    message: recommendationPresenceMessage,
  }),

  dcpBoroughboardrecommendation: validatePresence({
    presence: false,
    message: recommendationPresenceMessage,
  }),

  dcpCommunityboardrecommendation: validatePresence({
    presence: true,
    message: recommendationPresenceMessage,
  }),
};

export const boroughBoardDispositionValidations = {
  ...dispositionValidations,

  dcpVotinginfavorrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpBoroughboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotingagainstrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpBoroughboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotingabstainingonrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpBoroughboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpTotalmembersappointedtotheboard: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpBoroughboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpBoroughpresidentrecommendation: validatePresence({
    presence: false,
    message: recommendationPresenceMessage,
  }),

  dcpBoroughboardrecommendation: validatePresence({
    presence: true,
    message: recommendationPresenceMessage,
  }),

  dcpCommunityboardrecommendation: validatePresence({
    presence: false,
    message: recommendationPresenceMessage,
  }),
};

export const boroughPresidentDispositionValidations = {
  ...dispositionValidations,

  dcpBoroughpresidentrecommendation: validatePresence({
    presence: true,
    message: recommendationPresenceMessage,
  }),

  dcpBoroughboardrecommendation: validatePresence({
    presence: false,
    message: recommendationPresenceMessage,
  }),

  dcpCommunityboardrecommendation: validatePresence({
    presence: false,
    message: recommendationPresenceMessage,
  }),
};
