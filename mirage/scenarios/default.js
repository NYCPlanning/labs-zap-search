import rawData from '../db-data/default';

export default function(server) {
  server.db.loadData(rawData);
}
