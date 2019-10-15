import rawData from '../db-data/default';

export default function(server) {
  server.create('user', 'withAssignments');
}
