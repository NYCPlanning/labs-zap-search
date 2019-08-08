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
* `ember serve --environment=devlocal` - Sends api calls to `localhost:3000`, assumes you are running [labs-zap-api](https://github.com/NYCPlanning/labs-zap-api) locally.
* Visit your app at [http://localhost:4200](http://localhost:4200).

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
