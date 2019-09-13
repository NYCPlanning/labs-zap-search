/**
 *
 * @param {User Model Instance} user - must have userProjectParticipantTypes side-loaded
 * @param {Project Model Instance} project
 * Returns the participantType codes (e.g. 'CB', 'BB', or 'BP') of the userProjectParticipantTypes
 * associated with given User and Project.
 */
export default function (user, project) {
  if (user && project) {
    const filteredPartTypes = user.userProjectParticipantTypes.filter(partType => partType.project.id === project.id);
    const partTypesList = filteredPartTypes.models.map(partTypeModel => partTypeModel.participantType);
    return partTypesList;
  }
  return [];
}
