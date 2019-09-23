import {
  validateNumber,
  validatePresence,
} from 'ember-changeset-validations/validators';
import validatePresenceUnlessValue from '../validators/presence-unless-value';

const commentPresenceMessage = 'Please enter a comment';
const dateMessage = 'Please enter a valid date';
const numberMessage = 'Please enter a valid non-negative number';
const recommendationPresenceMessage = 'Please select a recommendation';
const votelocationPresenceMessage = 'Please enter a vote location';

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

  consideration: validatePresence({
    presence: true,
    message: commentPresenceMessage,
  }),
};

export const bpDispositionForAllActionsValidations = {
  ...dispositionForAllActionsValidations,
};

export const cbBbDispositionForAllActionsValidations = {
  ...dispositionForAllActionsValidations,

  votinginfavorrecommendation: [
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

  votingagainstrecommendation: [
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

  votingabstainingonrecommendation: [
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

  totalmembersappointedtotheboard: [
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

  votelocation: validatePresence({
    presence: true,
    message: votelocationPresenceMessage,
  }),

  dateofvote: validatePresence({
    presence: true,
    message: dateMessage,
  }),
};

/* Validations for Dispositions by Action */
export const dispositionValidations = {
  consideration: validatePresence({
    presence: true,
    message: commentPresenceMessage,
  }),
};

export const communityBoardDispositionValidations = {
  ...dispositionValidations,

  votinginfavorrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'communityboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  votingagainstrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'communityboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  votingabstainingonrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'communityboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  totalmembersappointedtotheboard: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'communityboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  boroughpresidentrecommendation: validatePresence({
    presence: false,
    message: recommendationPresenceMessage,
  }),

  boroughboardrecommendation: validatePresence({
    presence: false,
    message: recommendationPresenceMessage,
  }),

  communityboardrecommendation: validatePresence({
    presence: true,
    message: recommendationPresenceMessage,
  }),
};

export const boroughBoardDispositionValidations = {
  ...dispositionValidations,

  votinginfavorrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'boroughboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  votingagainstrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'boroughboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  votingabstainingonrecommendation: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'boroughboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  totalmembersappointedtotheboard: [
    validatePresenceUnlessValue({
      presence: true,
      unless: 'boroughboardrecommendation',
      value: 'Waived',
      message: numberMessage,
    }),
    validateNumber({
      positive: true,
      allowBlank: true,
      message: numberMessage,
    }),
  ],

  boroughpresidentrecommendation: validatePresence({
    presence: false,
    message: recommendationPresenceMessage,
  }),

  boroughboardrecommendation: validatePresence({
    presence: true,
    message: recommendationPresenceMessage,
  }),

  communityboardrecommendation: validatePresence({
    presence: false,
    message: recommendationPresenceMessage,
  }),
};

export const boroughPresidentDispositionValidations = {
  ...dispositionValidations,

  boroughpresidentrecommendation: validatePresence({
    presence: true,
    message: recommendationPresenceMessage,
  }),

  boroughboardrecommendation: validatePresence({
    presence: false,
    message: recommendationPresenceMessage,
  }),

  communityboardrecommendation: validatePresence({
    presence: false,
    message: recommendationPresenceMessage,
  }),
};
