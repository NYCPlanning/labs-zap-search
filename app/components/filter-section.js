import Component from '@ember/component';
import { computed, action } from '@ember-decorators/object';
import { classNames, className } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { contains } from 'ember-composable-helpers/helpers/contains';

const filterLookup = {
  'Project Name / Description / Applicant': {
    tooltipvalue: 'Type in a word or phrase that exists within a project name, description, or applicant name.',
  },
  'Certification / Referral Date': {
    tooltipvalue: 'Move the sliders along the timeline to filter projects by certification date. Grab in between the sliders to move the entire selected date range along the timeline.',
  },
    'ULURP / CEQR Number': {
    tooltipvalue: 'Begin typing a Uniform Land Use Review Procedure (ULURP) or City Environmental Quality Review (CEQR) number.',
  },
    'Project Stage': {
    tooltipvalue: "Click the checkboxes to filter the list by a project's stage in the application process. “Filed” refers to applications that have been submitted but have not yet started the public review process. “In Public Review” refers to applications that have graduated to the public review process. “Complete” refers to applications that have been Approved, Disapproved, Withdrawn or Terminated.",
  },
    'Borough / Block': {
    tooltipvalue: 'Unless projects fall under the category of "Citywide", they will only exist within one borough. Selecting multiple boroughs will return projects that exist in any one of the selected options. Different boroughs may have the same block number, so filter by borough first before typing in a 4-digit block number in order to better locate your desired results.',
  },
    'Community District': {
    tooltipvalue: 'Filter by community district in each borough by either typing the community district name (e.g. “Brooklyn 1”) or by selecting from the dropdown list. Multiple community districts can be selected at one time.',
  },
    'Action Type': {
    tooltipvalue: 'Filter by action type by either typing the code/name of the action or by selecting from the dropdown list. Action type refers to city planning land use actions that accompany a project. There may be multiple land use actions attached to an application. Many action types have been retired and are listed for historical projects only. Searching by one action type should return all projects that include that action, and multiple action types can be selected at one time.',
  },
      'CEQR Type': {
    tooltipvalue: 'The City Environmental Quality Review (CEQR) type determines the environmental review process for land use actions. Only certain minor actions, designated Type II, are exempt from environmental review. There will be one CEQR type per project, so clicking multiple checkboxes will return projects with any one of the selected options.',
  },
      'FEMA Flood Zone': {
    tooltipvalue: 'Projects may be located within multiple flood zones. Selecting multiple checkboxes will return projects that are at least partially located withinin all of the selected zones.',
  },
      'ULURP': {
    tooltipvalue: 'Applications can either follow the Uniform Land Use Review Procedure (ULURP) or are designated as Non-ULURP, and are therefore not restricted to ULURP rules and timing.',
  }
}


@classNames('filter')
export default class FilterSectionComponent extends Component {
  @argument
  filterTitle = '';

  @argument
  filterNames;

  @argument
  appliedFilters;

  @className
  @computed('filterNames', 'appliedFilters')
  get activeState() {
    const filterNames = this.get('filterNames');
    const appliedFilters = this.get('appliedFilters');

    return contains(filterNames, appliedFilters) ? 'active' : 'inactive';
  }

  @className
  @computed('filterTitle')
  get dasherizedFilterTitle() {
    const dasherizedFilterTitle = this.get('filterTitle').dasherize();
    return `filter-section-${dasherizedFilterTitle}`;
  }

  @computed('filterTitle')
  get tooltip() {
    const filterTitle = this.get('filterTitle');
    const tooltipvalue = filterLookup[filterTitle].tooltipvalue;
    const  tooltip   = `${tooltipvalue}`;
    return  tooltip; 
 }

  @argument
  mutateArray() {}

  @action
  mutateWithAction() {
   const filterNames = this.get('filterNames');
   this.get('mutateArray')('applied-filters', filterNames);
  }

  /*
    This special action wraps a given passed action with a
    notifier trigger.
  */
  @action
  delegateMutation(action = function() {}, ...params) {
    action(...params);
    this.notifyAppliedFilters();
  }

  /*
    Groupings of filters were originally IMPLIED based on the markup.
    Now filter-section explicitly knows these groupings and can
    enforce changes to their state if needed.
  */
  notifyAppliedFilters() {
    const filterNames = this.get('filterNames');
    const appliedFilters = this.get('appliedFilters');

    if (!contains(filterNames, appliedFilters)) {
      this.get('mutateArray')('applied-filters', filterNames)
    }
  }
}
