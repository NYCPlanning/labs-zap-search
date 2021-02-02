# Running the Frontend individually 

This folder is the source code for the frontend Ember app. It can be run standalone, with or without the server-side API.

## Standalone using Mirage data
One way to serve the app standalone is by stubbing the backend using Mirage. The app has been configured with a few [Mirage Scenarios](https://github.com/NYCPlanning/labs-zap-search/tree/develop/client/mirage/scenarios), which represent different sets of data for different user types. You can select the scenario when serving the app:

```
MIRAGE_SCENARIO=<scenario> ember s
```

Where `<scenario>` can be replaced with one of the following
- community-board
- borough-president

`<scenario>` can also be a path to your own scenario file.

If the app is loaded without specifying the `MIRAGE_SCENARIO` parameter, it will load a stale scenario.
See [mirage/README.md](./client/mirage/README.md) for details on what data the scenario contains and how it is generated.

### Logging in

After serving the app with Mirage, sign in by going to `localhost:4200/login#access_token=test`

## Connecting to a local backend
The app can also be served locally and manually connected to a locally run [zap-api backend](../server).

```
HOST_API=http://localhost:3000 ember serve --environment=devlocal
```

The frontend will then send api calls to `localhost:3000`, assuming you are running the zap-api locally. (Remember to set `SKIP_AUTH=true` in your development.env file in the zap-api project folder)

### Logging in
After running the backend you will see a message in your backend terminal saying `SKIP_AUTH is true! The cookie token is token=<your-token>; Path=/; HttpOnly. Add this to your request headers.`

Visit `localhost:4200/login#access_token=<your-token>` to sign in

### Connecting to staging or production
You can even connect to the API on staging on production, instead of on your machine.

```
HOST_API=https://zap-api-staging.herokuapp.com ember s -e devlocal
```

## How to create new test scenarios

* Create a new scenario file under mirage/scenarios/
  * Make sure its default export is a function

## Running Tests

* `ember test`
* `ember test --server`

## Deploying

Deployment is handled through Netlify.

Commits to the following 3 branches trigger deploys:

 - master
 - develop
 - develop-future

