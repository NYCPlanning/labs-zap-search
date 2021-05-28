[![CircleCI](https://circleci.com/gh/NYCPlanning/labs-zap-search/tree/develop.svg?style=svg)](https://circleci.com/gh/NYCPlanning/labs-zap-search/tree/develop)

# Zap Search

An ambitious web app for filtering and viewing NYC land use application records stored in DCP's Zoning Application Portal (ZAP).

## Development Setup 

### 1. Install prerequisite tools

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
  - This installation was tested using Node v12.18.4, v14.15.0
* [Ember CLI](https://ember-cli.com/)

### 2. Install frontend and backend packages 

```
> git clone https://github.com/NYCPlanning/labs-zap-search
> cd labs-zap-search
> yarn
> cd labs-zap-search/client
> yarn
> cd labs-zap-search/server
> yarn
```

### 3. Set up SSL and environment files
1. Clone this repo and follow the steps in its README: https://github.com/NYCPlanning/local-cert-generator

2. Note that Step 1 generates two files in the `local-cert-generator` repo: `server.key` and `server.crt`. Later, you will need to copy/paste these files into the `labs-zap-search` repo to run the application.

3. Open up your hosts file on your machine with admin permissions: `/etc/hosts`. For example, `sudo vim /etc/hosts`

4. Add the following line: `127.0.0.1 local.planninglabs.nyc` ![image](https://user-images.githubusercontent.com/3311663/78998629-fc437e00-7b16-11ea-81ef-edb19b4b1d90.png)

5. Navigate into the `server` folder.
    - Create the `development.env` file using variables stored on 1Password.
    - Copy the `server.key` and `server.crt` files from your `local-cert-generator` repo and paste both files into the `labs-zap-search/server/ssl/` folder.
6. Navigate into the `client` folder.
    - Copy the `server.key` and `server.crt` files from your `local-cert-generator` repo and paste both files into the `labs-zap-search/client/ssl/` folder.

## One-click startup 

At the root of this project, run 

```
yarn run start
```

This will spin up both the frontend (in the `/client` folder) and the server API (in `/server`).

## Frontend and Backend Documentation
  - See [./client/](./client/) for more docs on running and modifying the frontend
  - See [./server/](./server/) for more docs on running and modifying the server side API
