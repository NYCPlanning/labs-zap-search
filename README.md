[![CircleCI](https://circleci.com/gh/NYCPlanning/labs-zap-search/tree/develop.svg?style=svg)](https://circleci.com/gh/NYCPlanning/labs-zap-search/tree/develop)

# labs-zap-search

An ambitious web app for filtering and viewing NYC land use application records stored in DCP's Zoning Application Portal (ZAP).

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone https://github.com/NYCPlanning/labs-zap-search` this repository
* `cd labs-zap-search`
* Install dependencies `yarn`

## Running / Development

### Standalone using Mirage data
The app can be served on your machine standalone by stubbing [the backend (zap-api)](https://github.com/NYCPlanning/zap-api) using Mirage. The app has been configured with a few [Mirage Scenarios](https://github.com/NYCPlanning/labs-zap-search/tree/develop/mirage/scenarios), which represent different sets of data for different user types. You can select the scenario when serving the app:

```
MIRAGE_SCENARIO=<scenario> ember s
```

Where `<scenario>` can be replaced with one of the following
- community-board
- borough-president

`<scenario>` can also be a path to your own scenario file.

If the app is loaded without specifying the `MIRAGE_SCENARIO` parameter, it will load a stale scenario.
See [mirage/README.md](./mirage/README.md) for details on what data the scenario contains and how it is generated.

### Connecting to a local backend
The app can also be served locally and connected to a locally run [zap-api backend](https://github.com/NYCPlanning/zap-api).

```
HOST_API=http://localhost:3000 ember serve --environment=devlocal
```

The frontend will then send api calls to `localhost:3000`, assuming you are running the zap-api locally. (Remember to set `SKIP_AUTH=true` in your development.env file in the zap-api project folder)

Sign in by going to `localhost:4200/login#access_token=test`

After running the backend you will see a message in your terminal saying `SKIP_AUTH is true! The cookie token is token=<your-token>; Path=/; HttpOnly. Add this to your request headers.`

Visit `localhost:4200/login#access_token=<your-token>` to sign in

### Connecting to staging or production

```
HOST_API=https://zap-api-staging.herokuapp.com ember s -e devlocal
```

### Create test scenarios

* Create a new scenario file under mirage/scenarios/
  * Make sure its default export is a function

### Running Tests

* `ember test`
* `ember test --server`

### Deploying

Deployment is handled through Netlify.

Commits to the following 3 branches trigger deploys:

 - master
 - develop
 - develop-future

## Contact us

You can find us on Twitter at [@nycplanninglabs](https://twitter.com/nycplanninglabs), or comment on issues and we'll follow up as soon as we can. If you'd like to send an email, use [labs_dl@planning.nyc.gov](mailto:labs_dl@planning.nyc.gov)
