import rawData from '../db-data/default';

export default function(server) {
  server.loadFixtures('users');

  server.createList('assignment', 10, 'withProject');
}
