export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  server.createList('project', 10);
  server.createList('geography', 10);
}
