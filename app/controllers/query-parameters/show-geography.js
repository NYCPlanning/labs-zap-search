import QueryParams from 'ember-parachute';
import Controller from '@ember/controller';

export const projectParams = new QueryParams({
  // meta
  'applied-filters': {
    defaultValue: ['community-districts', 'dcp_publicstatus', 'action-types'].sort(),
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value) {
      if (!value) return [];
      return value.split(',').sort();
    },
  },

  // filter values

  'boroughs': {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',');
    },
  },


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
    defaultValue: ['Filed', 'In Public Review', 'Complete'].sort(),
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
  dcp_femafloodzonev: {
    defaultValue: false,
    refresh: true,
  },
  dcp_femafloodzonecoastala: {
    defaultValue: false,
    refresh: true,
  },
  dcp_femafloodzonea: {
    defaultValue: false,
    refresh: true,
  },
  dcp_femafloodzoneshadedx: {
    defaultValue: false,
    refresh: true,
  },
  text_query: {
    defaultValue: '',
    refresh: true,
  },
  block: {
    defaultValue: '',
    refresh: true,
  },
});

export default Controller.extend(projectParams.Mixin);
