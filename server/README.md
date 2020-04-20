[![CircleCI](https://circleci.com/gh/NYCPlanning/labs-zap-api/tree/develop.svg?style=svg)](https://circleci.com/gh/NYCPlanning/labs-zap-api/tree/develop)

# Labs Zap API
An [Nest](https://github.com/nestjs/nest) api that serves project data from the Zoning Application Portal (ZAP).

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod

# imposter development mode (authenticate as a specific user for debugging locally)
$ CRM_IMPOSTER_EMAIL=<somevalidemail@email.com> yarn run start:dev:skip-auth

```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Requirements

You'll need [git](https://git-scm.com/downloads) and [node.js](https://nodejs.org/en/) installed on your development machine.

## Local development

Clone this repository `git clone https://github.com/NYCPlanning/zap-api.git`

Navigate to the repo and install dependencies: `cd zap-api && npm install`

Create `development.env` with all the required environment variables.  

Start the development server.  `yarn run start`

### Local Database
#### Via Docker:
(TODO: Fix docker deployment, this may not work)

- To start a local PostGIS instance, run `docker run --name zap-development -p 5432:5432 -e POSTGRES_PASSWORD=password -d mdillon/postgis`
- Update `.env` to include DATABASE_URL `DATABASE_URL=postgres://postgres:password@0.0.0.0:5432/postgres`
- ssh onto the server and create a dump file of the PostgreSQL database `docker exec {containername} pg_dump -U postgres postgres > {filename}`
- Transfer the file back to local machine `scp {username}@{host}:{path-to-file} {localfilename}`
- Restore database on your local machine `cat {localfilename} | docker exec -i zap-development psql -U postgres`

#### On metal (i.e. without docker):
1. Connect to either the staging or prod databases and copy it to your machine locally.
` /path/to/pg_dump <staging/prod db url> -f <dump_file_name>.sql`
2. Create a blank database in your local PostGresSQL install.
3. Import the dump into your newly created local PostGresSQL install.
`/path/to/psql -d <local db url> -f /path/to/<dump_file_name>.sql`

A DB url example is `postgres://postgres@localhost/database`.

### Environment Variables
You'll need to create a `.env` file in the root of the repo, with the following environment variables:

`DATABASE_URL` - postgreSQL connection string

`HOST` - used to build out vector tile URLS, set it to 'http://localhost:3000' if developing locally

`RECAPTCHA_SITE_KEY` - Used for validating human-ness before feedback submission

`RECAPTCHA_SECRET_KEY` - Used for validating human-ness before feedback submission

`GITHUB_ACCESS_TOKEN` - An access token that allows for creating new issues in a github repo

`SLACK_VERIFICATION_TOKEN` - a token for verifying POST requests from a custom slack slash command

`SLACK_WEBHOOK_URL` - url for POSTing messages in a slack channel

`AIRTABLE_API_KEY` - api key for accessing the airtable with youtube video references

`SKIP_AUTH` - skips the authentication step and uses an email provided in variable `CRM_IMPOSTER_EMAIL`

`CRM_IMPOSTER_EMAIL` - when using SKIP_AUTH, this is the e-mail used to generate an access cookie

** NOTE: If CRM_IMPOSTER_EMAIL and SKIP_AUTH are configured correctly, the server log will print a new cookie. This cookie can be inserted into request headers for debugging **

#### Deprecated:

`CRM_IMPOSTER_ID` - ID used to simulate an "in-CRM" user — essentially force a specific CRM id to be returned

Others:

`ALLOWED_HOSTS` - List of allowed CORS request hosts
`AUTHORITY_HOST_URL` - Used for ADAL login
`CLIENT_ID` - Used for ADAL login
`CLIENT_SECRET` - Used for ADAL login
`CRM_HOST` - Used to query CRM API
`CRM_ADMIN_SERVICE_USER` - Used for /document uploads. Should be an account in CRM with admin permissions
`CRM_SIGNING_SECRET` - Used to sign JWT for this app's JWTs
`CRM_URL_PATH` - Used to query CRM API
`NYCID_CONSOLE_PASSWORD` - Used to decrypt/validate NYCID JWTs
`NYCID_HOST` - NYCID used. Not currently used.
`NYCID_USERNAME` - Username for NYCID. Not currently used.
`TENANT_ID` - Used for ADAL login
`TOKEN_PATH` - Used for ADAL login
`USER_API_KEY` - Used for ZAP API end users to update geoms

### Migrations

Migration files are used to predictably recreate a database schema, like how a commit history recreates a codebase. 

This project uses the [node-pg-migrate](https://github.com/salsita/node-pg-migrate) Node tool to create and run SQL-based migrations on the PostGresSQL database.

Migration files are stored the `/migrations folder`. They are automatically placed there upon creation.

Always use `node-pg-migrate` to create, manage and run migrations. The tool will make sure migrations are named so that they run in the order they are created.

This project has aliased `node-pg-migrate` as `yarn run migrate` (through the `scripts` property in `package.json`. So to use `node-pg-migrate`, in the terminal run
```
yarn run migrate <command> <options>
```

*IMPORTANT NOTE:* One caveat with migrations in this project is that they do not create the database from scratch. They should only be used after manually creating and seeding the (local or staging/prod) database. For a local database, this means after recreating it using either the "via Docker" or "on metal" instructions above. For staging and production databases, this means after the ETL scripts have finished according to the "Skyvia: Dropping then recreating tables" document. I.e. after step 13. 

Since the existing migrations are run on a database schema created elsewhere, it makes some assumptions about the state of the database.
One assumption is that the indexes that the migrations will create do not already exist. If they already exist, running the migrations will throw an error.
In that case, go into the `create-index*` migrations and uncomment the `dropIndexes(pgm);` function call at the top of the `exports.up` function.
This will make sure the indexes are dropped before they are created again.

#### Create a new migration file
```
yarn run migrate create <migration name with spaces>
```

#### Run all migrations (normal use)
```
DATABASE_URL=<db url> yarn run migrate up
```
The `DATABASE_URL` parameter This will override any DATABASE_URL environment variable that is set.

This command will run all migrations in the `/migrations` folder in the order they were created.

#### Undo and redo migrations

You can also undo migrations and redo them. You can use the `down` commmand to go backwards, or `redo` to go backwards and forwards again. 

For these commands, [see the CLI docs here](https://github.com/salsita/node-pg-migrate/blob/master/docs/cli.md).


### GDAL Dependency

The shapefile download endpoint requires the gdal `ogr2ogr` command to be available in the environment.  

For local development on a Mac, use `brew install gdal` and make sure the command `ogr2ogr` works in your terminal.

You can also use docker to run the api on port 3000 in development:

`docker run -it -v $PWD:/zap-api -p 3000:3000 -w /zap-api geodatagouv/node-gdal yarn run devstart`

This mounts your code in the docker container, and will use nodemon to restart when you save changes.

## Architecture

The api connects to a postgis database, and uses MapPLUTO hosted in Carto to retrieve tax lot geometries.  
We are also able to serve vector tiles directly from postGIS using `st_asmvt()`, so no extra vector tile processing is required in node.

### Routes

`GET /projects` - Get a paginated filtered list of projects

Use query Parameters for filtering:


    `page` *default '1'* - page offset

    `itemsPerPage` *default 30* - the number of projects to return with each request

    `community-districts[]` - array of community district codes (mn01, bx02)

    `action-types[]` - array of action types

    `boroughs[]` - array of borough names, including 'Citywide'

    `dcp_ceqrtype[]` - array of CEQR types

    `dcp_ulurp_nonulurp[]` - array of 'ULURP' or 'Non-ULURP'

    `dcp_femafloodzonev` *default false* - flood zone boolean

    `dcp_femafloodzonecoastala` *default false* - flood zone boolean

    `dcp_femafloodzonea` *default false* - flood zone boolean

    `dcp_femafloodzoneshadedx` *default false* - flood zone boolean

    `dcp_publicstatus[] ` *default ['Prefiled', Filed', 'In Public Review', Completed']* - the project's public status

    `dcp_certifiedreferred[]` - array of unix epoch timestamps to filter for date range

    `project_applicant_text` - string for text match filtering against the project name, project brief, and applicant name

    `ulurp_ceqr_text` - string for text match filtering against a project's ULURP numbers and CEQR number

    `block` - string for text match filtering against the tax blocks associated with a project


`GET /projects.{filetype}` - Start a download of projects data

    Available filetypes:
        - `csv` - tabular data only
        - `shp` - tabular data with polygon geometries
        - `geojson` - tabular data with polygon geometries

`GET /projects/:projectid` - Get one project

Used by the frontend to get JSON data for a single project.  Example:`/projects/2018K0356`

`GET /projects/tiles/:tileid/:z/:x/:y.mvt` - Get a vector tile for the

`GET /projects/:ceqrnumber` - A redirect query to make predictable URLs for zap projects using only a ceqr number.  if the ceqr number matches a project, returns a 301 redirect to the project page.  If the ceqr number cannot be found, returns a 301 redirect to the project filter page.

`GET /projects/:ulurpnumber` - A redirect query to make predictable URLs for zap projects using only a ulurp number.  if the ulurp number matches a project, returns a 301 redirect to the project page.  If the ulurp number cannot be found, returns a 301 redirect to the project filter page.


`GET /zap/:zapAcronym` - Get projects for a community district

Used by the [Community Profiles](https://communityprofiles.planning.nyc.gov/) site to list ZAP projects for a given community district.

## Deployment

This api is easily deployed with dokku.

Create a new remote: `git remote add dokku dokku@{host}:zap-api`
Deploy with a git push `git push dokku master` or alias another branch to master `git push dokku {other-branch}:master`

### Dockerfile Deployment
  This repo includes a `Dockerfile` which dokku will use to run the API.  See dokku's [Dockerfile Deployment](http://dokku.viewdocs.io/dokku/deployment/methods/dockerfiles/) docs for more info.

## Worker

This api includes a worker process (see `./Procfile`) that connects to the database and refreshes the materialized view `normalized_projects` every 30 minutes.  It will send slack messages to the #labs-bots channel to notify us of its status

The worker process will not run automatically.  It must be scaled using `dokku ps:scale {appname } worker=1`.

## Airtable
The `/projects/:projectid` endpoint uses `get-video-links` util to append an array of video links to a project's response.  The util does multiple calls to [this airtable](https://airtable.com/tblV8rUQQVwUoR2AI/) which links project ids with videos and timestamps.


## Contact us

You can find us on Twitter at [@nycplanninglabs](https://twitter.com/nycplanninglabs), or comment on issues and we'll follow up as soon as we can. If you'd like to send an email, use [labs_dl@planning.nyc.gov](mailto:labs_dl@planning.nyc.gov)
