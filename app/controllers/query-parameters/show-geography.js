import QueryParams from 'ember-parachute';
import Controller from '@ember/controller';

export const projectParams = new QueryParams({
  // pagination
  page: {
    defaultValue: 1,
    refresh: true,
  },

  // filter values
  'community-districts': {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',');
    },
  },
  'action-types': {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',');
    },
  },
  'action-reasons': {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',');
    },
  },
  dcp_publicstatus: {
    defaultValue: ['Filed', 'Certified', 'Complete'].sort(),
    refresh: true,
    serialize(value) {
      value = value.filter(d => d !== '')
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',').sort();
    },
  },
  dcp_ceqrtype: {
    defaultValue: ['Type I', 'Type II', 'Unlisted', 'Unknown'].sort(),
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',').sort();
    },
  },
  dcp_ulurp_nonulurp: {
    defaultValue: ['ULURP', 'Non-ULURP'].sort(),
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',').sort();
    },
  },
  dcp_femafloodzonea: {
    defaultValue: false,
    refresh: true,
  },
  dcp_femafloodzonecoastala: {
    defaultValue: false,
    refresh: true,
  },
  dcp_femafloodzoneshadedx: {
    defaultValue: false,
    refresh: true,
  },
  dcp_femafloodzonev: {
    defaultValue: false,
    refresh: true,
  },

  // params for whether filters are applied or not
  stage: {
    defaultValue: true,
    refresh: true,
  },
  cds: {
    defaultValue: true,
    refresh: true,
  },
  ceqr: {
    defaultValue: false,
    refresh: true,
  },
  fema: {
    defaultValue: false,
    refresh: true,
  },
  ulurp: {
    defaultValue: false,
    refresh: true,
  },
  'action-type': {
    defaultValue: false,
    refresh: true,
  },
  'action-reason': {
    defaultValue: false,
    refresh: true,
  },
});

export default Controller.extend(projectParams.Mixin);

