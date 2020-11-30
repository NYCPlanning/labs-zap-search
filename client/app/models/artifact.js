import Model, { attr, belongsTo } from '@ember-data/model';

export default class ArtifactModel extends Model {
  @belongsTo('project', { async: false })
  project;

  @attr()
  dcpArtifactdocumentlocation;

  @attr()
  versionnumber;

  @attr()
  dcpSubmittedfilename;

  @attr()
  dcpArtifactsid;

  @attr()
  dcpName;

  @attr()
  modifiedon;

  @attr()
  dcpPackagetype;

  @attr()
  dcpVisibility;

  @attr({ defaultValue: () => [] })
  documents;
}
