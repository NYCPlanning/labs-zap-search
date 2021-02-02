# Running the server API individually 
This folder contains the source for [Nest](https://github.com/nestjs/nest) API that reads from and writes to the CRM database.

## Development Quickstart
1. Create a `development.env` at the root of this folder. Acquire file contents from 1Pass.

2. Run the server using one of the following commands
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod

```

## Testing

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
