[![CircleCI](https://circleci.com/gh/NYCPlanning/labs-zap-search/tree/develop.svg?style=svg)](https://circleci.com/gh/NYCPlanning/labs-zap-search/tree/develop)

# Zap Search

An ambitious web app for filtering and viewing NYC land use application records stored in DCP's Zoning Application Portal (ZAP).

## Prerequisite Tools

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/)
* [Ember CLI](https://ember-cli.com/)
* [Yarn](https://yarnpkg.com/)


## Prerequisite SSL Setup for Local Development
In order for cookies to work across both the client and the server during local development, we must have SSL setup for our development environment.

### Why is this necessary?
Google Chrome is beginning to enforce some restrictions on particular uses of cookies in cross-origin contexts. In our case, our server provides a cookie from one domain and is expected to be sent across subsequent requests via another. The only way to simulate this behavior as it works on a production environment is to run our local development servers with SSL enabled.

### Steps to setup SSL locally
1. Clone this repo and follow the steps in its README: https://github.com/NYCPlanning/local-cert-generator

2. Note that Step 1 generates two files in the `local-cert-generator` repo: `server.key` and `server.crt`. Later, you will need to copy/paste these files into the `labs-zap-search` repo to run the application (Steps 2 and 3 under "Running the App").

3. Open up your hosts file on your machine with admin permissions: `/etc/hosts`. For example, `sudo vim /etc/hosts`

4. Add the following line: `127.0.0.1 local.planninglabs.nyc` ![image](https://user-images.githubusercontent.com/3311663/78998629-fc437e00-7b16-11ea-81ef-edb19b4b1d90.png)

## Running the App
Once you have SSL enabled...
##### note: the client and server each run on their own node version, independent of each other. Refer to the .nvmrc of their respective folders to determine the appropriate node verion.
1. Clone `labs-zap-search` to your computer.
2. Navigate into the `server` folder.
    - Create the `development.env` file using variables stored on 1Password.
    - Copy the `server.key` and `server.crt` files from your `local-cert-generator` repo and paste both files into the `labs-zap-search/server/ssl/` folder.
    - Activate the compatible node version `nvm use`
    - Run `yarn` to install dependencies for the server.
    - Run `yarn run start:dev` to start a development server
3. Open a new terminal and navigate into the `client` folder.
    - Copy the `server.key` and `server.crt` files from your `local-cert-generator` repo and paste both files into the `labs-zap-search/client/ssl/` folder.
    - Activate the compatible node version `nvm use`
    - Run `yarn` to install dependencies for the client.
    - Run `yarn start:ssl` to start a development server

## Pre-commit linting and testing
 The client and server application node versions have become out of sync with each other. Consequently, the pre-commit hooks have been turned off until both the server and client are on the same node version.

 Husky is designed to use the node version set in the terminal PATH at the time the command is run. Whichever node version the developer chooses will be the one that the both the client and server are tested against. This can lead to weird cases where the client or server passes in the environment it's developed for but fails in the environment where its tests are run.

As the hooks have been disabled, please take care to run linting and testing scripts for the server and client before committing. These scripts are documented in their respective `package.json` files.

## Frontend and Backend Documentation
  - See [./client/](./client/) for more docs on running and modifying the frontend
  - See [./server/](./server/) for more docs on running and modifying the server side API

## Maintenance Mode

To enable "maintenance mode", set two environment variables in the frontend (Netlify) build environment:

MAINTENANCE_START='06/28/2021 19:00'
MAINTENANCE_END='06/29/2021 19:00'

Use the date format in the example above. This will warn of upcoming maintenance (if the start date is in the future), disable
the login, and disappear once the end period has passed.
