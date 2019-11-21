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

* `ember serve` - Uses dummy API responses provided by mirage
* `HOST_API=http://localhost:3000 ember serve --environment=devlocal` - Sends api calls to `localhost:3000`, assumes you are running [labs-zap-api](https://github.com/NYCPlanning/labs-zap-api) locally. Make sure you have `SKIP_AUTH=true` in your development.env file. 
Sign in by going to `localhost:4200/login#access_token=test`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Create test scenarios

* Create a new scenario file under mirage/scenarios/
  * Make sure its default export is a function
* Run your local development server with the environment variable:
  `MIRAGE_SCENARIO=your-scenario-file ember s`

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
