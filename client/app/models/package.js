import Model, { attr, belongsTo } from '@ember-data/model';

export default class PackageModel extends Model {
  @belongsTo('project', { async: false })
  project;

  @attr('number')
  statuscode;

  @attr('date')
  dcpStatusdate;

  @attr('date')
  dcpPackagesubmissiondate

  @attr('number')
  statecode;

  @attr('number')
  dcpPackagetype;

  @attr('number')
  dcpVisibility;

  @attr('number')
  dcpPackageversion

  @attr('string')
  dcpPackagenotes

  @attr({ defaultValue: () => [] })
  documents;
}
