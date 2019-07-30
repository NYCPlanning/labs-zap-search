export default function(server) {
  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  const seedCBUser = server.create('user', {
    id: 1,
    email: 'qncb5@planning.nyc.gov',
    landUseParticipant: 'QNCB5',
  });
  const seedCBUserProjects = [
    server.create('project', {
      id: 1,
    }),
    server.create('project', {
      id: 2,
    }),
  ];
  seedCBUser.projects = seedCBUserProjects;

  const seedBPUser = server.create('user', {
    id: 2,
    email: 'bxbp@planning.nyc.gov',
    landUseParticipant: 'BXBP',
  });
  const seedBPUserProjects = [
    server.create('project', {
      id: 3,
    }),
    server.create('project', {
      id: 4,
    }),
  ];
  seedBPUser.projects = seedBPUserProjects;

  server.create('userProjectParticipantType', {
    user: seedCBUser,
    project: seedCBUserProjects[0],
    participantType: 'CB',
  });

  server.create('userProjectParticipantType', {
    user: seedCBUser,
    project: seedCBUserProjects[1],
    participantType: 'CB',
  });

  server.create('userProjectParticipantType', {
    user: seedBPUser,
    project: seedBPUserProjects[0],
    participantType: 'BB',
  });

  server.create('userProjectParticipantType', {
    user: seedBPUser,
    project: seedBPUserProjects[0],
    participantType: 'BP',
  });

  server.create('userProjectParticipantType', {
    user: seedBPUser,
    project: seedBPUserProjects[1],
    participantType: 'BP',
  });
}
