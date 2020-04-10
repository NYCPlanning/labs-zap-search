Database Notes

## normalized_projects (materialized view)
The filter queries served at `/projects` depend on a materialized view called `normalized_projects`.  The SQL for this materialized view is maintained in the `/migrations` directory, with all other DB schemas.
To update the materialized view, create appropriate migrations in that directory, and run them against necessary databases.

### Refreshing the materialized view
The data from zap are updated once an hour, so the materialized view is set up with a cron job to run on the hour.

The host machine should have an environment variable `DATABASE_URL`.  

The cron job runs an ephemeral docker container that links to the postgis container: `docker run -it --rm --link zap-postgis:postgres postgres psql $DATABASE_URL -c "REFRESH MATERIALIZED VIEW normalized_projects"`
