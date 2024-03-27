import QueryParams from 'ember-parachute';
import Controller from '@ember/controller';
import moment from 'moment';

/**
 * All query parameters used in show-geography controller.
 * See https://github.com/offirgolan/ember-parachute for documentation.
 */
export const projectParams = new QueryParams({
/**
 * List of applied filters by their respective key name(s). For example,
 * the value of `applied-filters` will include references to some of the
 * query params listed below.
 *
 * This list value is used by the show-geography route to determine which
 * filters it should send to the API.
 */
  'applied-filters': {
    defaultValue: ['dcp_publicstatus'].sort(),
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value) {
      if (!value) return [];
      return value.split(',').sort();
    },
  },

  /**
   * Query parameters for all filters
   */
  dcp_certifiedreferred: {
    defaultValue: [
      parseInt(moment().subtract(5, 'years').utc().endOf('year')
        .format('X'), 10), // UTC timestamp 5 yrs ago
      parseInt(moment().utc().endOf('year').format('X'), 10), // UTC timestamp now
    ],
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',').map(date => parseInt(date, 10));
    },
  },
  boroughs: {
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
  'zoning-resolutions': {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',');
    },
  },
  dcp_applicability: {
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
    defaultValue: ['Noticed', 'In Public Review'].sort(),
    refresh: true,
    serialize(value) {
      value = value.filter(d => d !== '');
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',').sort();
    },
  },
  distance_from_point: {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',').sort();
    },
  },
  radius_from_point: {
    defaultValue: 600,
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
  project_applicant_text: {
    defaultValue: '',
    refresh: true,
  },
  block: {
    defaultValue: '',
    refresh: true,
  },
  blocks_in_radius: {
    defaultValue: [],
    refresh: true,
  },
  dcp_ulurp_nonulurp: {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',');
    },
  },
});

export default Controller.extend(projectParams.Mixin);
