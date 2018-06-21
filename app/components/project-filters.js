import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action, computed } from '@ember-decorators/object';

const CdLookup = [
  ['BK01', '1', 'Brooklyn'],
  ['BK02', '2', 'Brooklyn'],
  ['BK03', '3', 'Brooklyn'],
  ['BK04', '4', 'Brooklyn'],
  ['BK05', '5', 'Brooklyn'],
  ['BK06', '6', 'Brooklyn'],
  ['BK07', '7', 'Brooklyn'],
  ['BK08', '8', 'Brooklyn'],
  ['BK09', '9', 'Brooklyn'],
  ['BK10', '10', 'Brooklyn'],
  ['BK11', '11', 'Brooklyn'],
  ['BK12', '12', 'Brooklyn'],
  ['BK13', '13', 'Brooklyn'],
  ['BK14', '14', 'Brooklyn'],
  ['BK15', '15', 'Brooklyn'],
  ['BK16', '16', 'Brooklyn'],
  ['BK17', '17', 'Brooklyn'],
  ['BK18', '18', 'Brooklyn'],
  ['BX01', '1', 'Bronx'],
  ['BX02', '2', 'Bronx'],
  ['BX03', '3', 'Bronx'],
  ['BX04', '4', 'Bronx'],
  ['BX05', '5', 'Bronx'],
  ['BX06', '6', 'Bronx'],
  ['BX07', '7', 'Bronx'],
  ['BX08', '8', 'Bronx'],
  ['BX09', '9', 'Bronx'],
  ['BX10', '10', 'Bronx'],
  ['BX11', '11', 'Bronx'],
  ['BX12', '12', 'Bronx'],
  ['MN01', '1', 'Manhattan'],
  ['MN02', '2', 'Manhattan'],
  ['MN03', '3', 'Manhattan'],
  ['MN04', '4', 'Manhattan'],
  ['MN05', '5', 'Manhattan'],
  ['MN06', '6', 'Manhattan'],
  ['MN07', '7', 'Manhattan'],
  ['MN08', '8', 'Manhattan'],
  ['MN09', '9', 'Manhattan'],
  ['MN10', '10', 'Manhattan'],
  ['MN11', '11', 'Manhattan'],
  ['MN12', '12', 'Manhattan'],
  ['QN01', '1', 'Queens'],
  ['QN02', '2', 'Queens'],
  ['QN03', '3', 'Queens'],
  ['QN04', '4', 'Queens'],
  ['QN05', '5', 'Queens'],
  ['QN06', '6', 'Queens'],
  ['QN07', '7', 'Queens'],
  ['QN08', '8', 'Queens'],
  ['QN09', '9', 'Queens'],
  ['QN10', '10', 'Queens'],
  ['QN11', '11', 'Queens'],
  ['QN12', '12', 'Queens'],
  ['QN13', '13', 'Queens'],
  ['QN14', '14', 'Queens'],
  ['SI01', '1', 'Staten Island'],
  ['SI02', '2', 'Staten Island'],
  ['SI03', '3', 'Staten Island'],
  ['SI95', '95', 'Staten Island'],
].map(([code, num, boro]) => ({ code, num, boro, searchField: `${boro} ${num}` }));

export default class ProjectFiltersComponent extends Component {
  classNames = ['project-filters'];

  @argument projectFilters = null;

  communityDistrictOptions = CdLookup

  @argument
  @action
  mutateArray() {}

  @argument
  @action
  replaceProperty() {}

  @argument
  @action
  toggleBoolean() {}

  @computed('projectFilters.community-districts')
  get selectedDistricts() {
    const selected = this.get('projectFilters.community-districts');
    return this.get('communityDistrictOptions').filter(({ code } = {}) => selected.includes(code))
  }
}
