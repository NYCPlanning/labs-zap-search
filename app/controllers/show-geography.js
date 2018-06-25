import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import QueryParams from 'ember-parachute';

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
  status: {
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
  action_status: {
    defaultValue: false,
    refresh: true,
  },
});

const ParachuteController = Controller.extend(projectParams.Mixin);

export default class ShowGeographyController extends ParachuteController {
  // project filters
  @computed('meta.total', 'page')
  get noMoreRecords() {
    const pageTotal = this.get('meta.pageTotal');
    const total = this.get('meta.total');
    const page = this.get('page');

    return (pageTotal < 30) || ((page * 30) === total);
  }

  @action
  resetPagination() {
    // reset pagination
    this.set('page', 1);
    this.get('store').unloadAll('project');
  }

  @action
  mutateArray(key, value) {
    const values = this.get(key);
    this.resetPagination();

    if (values.includes(value)) {
      values.removeObject(value);
    } else {
      values.pushObject(value);
    }

    this.set(key, values)
  }

  @action
  replaceProperty(key, value = []) {
    this.resetPagination();
    this.get('community-districts').pushObject('BK12');
    this.set(key, value.map(({ code }) => code));
  }

  @action
  toggleBoolean(key) {
    this.resetPagination();

    this.set(key, !this.get(key));
  }
}
