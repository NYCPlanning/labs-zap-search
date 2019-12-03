import {
  validateNumber,
  validatePresence,
} from 'ember-changeset-validations/validators';
import validatePresenceUnlessValue from '../validators/presence-unless-value';

const dateMessage = 'Please enter a valid date';
const numberMessage = 'Please enter a valid non-negative number';
const recommendationPresenceMessage = 'Please select a recommendation';
const dcpVotelocationPresenceMessage = 'Please enter a vote location';
const maxLengthMessage = 'Total may not exceed 99';

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

export const cbDispositionForAllActionsValidations = {
  ...dispositionForAllActionsValidations,

  dcpVotinginfavorrecommendation: [
    validateNumber({
      lte: 99,
      allowBlank: true,
      message: maxLengthMessage,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'recommendation',
      value: 717170008,
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotingagainstrecommendation: [
    validateNumber({
      lte: 99,
      allowBlank: true,
      message: maxLengthMessage,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'recommendation',
      value: 717170008,
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotingabstainingonrecommendation: [
    validateNumber({
      lte: 99,
      allowBlank: true,
      message: maxLengthMessage,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'recommendation',
      value: 717170008,
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpTotalmembersappointedtotheboard: [
    validateNumber({
      lte: 99,
      allowBlank: true,
      message: maxLengthMessage,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'recommendation',
      value: 717170008,
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

export const bbDispositionForAllActionsValidations = {
  ...dispositionForAllActionsValidations,

  dcpVotinginfavorrecommendation: [
    validateNumber({
      lte: 99,
      allowBlank: true,
      message: maxLengthMessage,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'recommendation',
      value: 717170002,
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotingagainstrecommendation: [
    validateNumber({
      lte: 99,
      allowBlank: true,
      message: maxLengthMessage,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'recommendation',
      value: 717170002,
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotingabstainingonrecommendation: [
    validateNumber({
      lte: 99,
      allowBlank: true,
      message: maxLengthMessage,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'recommendation',
      value: 717170002,
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpTotalmembersappointedtotheboard: [
    validateNumber({
      lte: 99,
      allowBlank: true,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'recommendation',
      value: 717170002,
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
    validateNumber({
      lte: 99,
      allowBlank: true,
      message: maxLengthMessage,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpCommunityboardrecommendation',
      value: 717170008,
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotingagainstrecommendation: [
    validateNumber({
      lte: 99,
      allowBlank: true,
      message: maxLengthMessage,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpCommunityboardrecommendation',
      value: 717170008,
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotingabstainingonrecommendation: [
    validateNumber({
      lte: 99,
      allowBlank: true,
      message: maxLengthMessage,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpCommunityboardrecommendation',
      value: 717170008,
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpTotalmembersappointedtotheboard: [
    validateNumber({
      lte: 99,
      allowBlank: true,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpCommunityboardrecommendation',
      value: 717170008,
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
    validateNumber({
      lte: 99,
      allowBlank: true,
      message: maxLengthMessage,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpBoroughboardrecommendation',
      value: 717170002,
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotingagainstrecommendation: [
    validateNumber({
      lte: 99,
      allowBlank: true,
      message: maxLengthMessage,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpBoroughboardrecommendation',
      value: 717170002,
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpVotingabstainingonrecommendation: [
    validateNumber({
      lte: 99,
      allowBlank: true,
      message: maxLengthMessage,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpBoroughboardrecommendation',
      value: 717170002,
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  dcpTotalmembersappointedtotheboard: [
    validateNumber({
      lte: 99,
      allowBlank: true,
    }),
    validatePresenceUnlessValue({
      presence: true,
      unless: 'dcpBoroughboardrecommendation',
      value: 717170002,
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
