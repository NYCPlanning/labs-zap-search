import DS from 'ember-data';

const {
  Model, attr,
} = DS;

export default class ZoningResolutionModel extends Model {
  @attr()
  dcpZoningresolution;
}
