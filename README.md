### NestJS Boilerplate

This Boilerplate provides a NestJS project written in TS with:
- Sequelize with Postgres
- Healthcheck module
- Config module (for .env file)
- Base prefix /api
- Nest-pino Logger

### Installation

`npm install`

### Running

This boilerplate requires docker or a local PostgreSQL installation.  If using a local PostgreSQL database, see `app.module.ts` for credentials, and make sure there are matching credentials in the database and the source code.

#### Docker

There is a `docker-compose.local.yml` file for starting Docker.

`docker compose -f docker-compose.local.yml up`


### Run the project

Then, run Nest as usual:

`npm run start:dev`
