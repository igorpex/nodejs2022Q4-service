# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Prepare .env file

Use .env file.
If it is not presented, rename env.exampe file to .env file.
Change ports for Node (default PORT=4000) and Postgres (POSTGRES_PORT=5432) if needed.



## Running application

Run Docker (i.e. Docker desktop). It is required to start docker containers.

```
docker-compose up -d -V --build
```

It will create images and run containers with Node and Postgres.

If test do not work, make migration running npm script

```
npm run prisma:migrate
<!-- or -->
npx prisma migrate dev --name init
<!-- where 'init' is name of migration -->
```
Then start containers again with docker-compose

## Using
Use Postman or Thunder Client to connect to API.
Use port from .env file (default 4000).
API docs can be found in 'doc' folder. Use with Swagger (swagger.io)

If you change source code, server will re-start automatically (nest starting in watch mode).

To stop containers, use:

```
docker-compose down
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

