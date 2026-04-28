# MyStore Backend API  

This project features a storefront backend API built using TypeScript and Node.Js with Postgresql.

## Setting up  

### 1. Installing dependencies  

Make sure you have:  

* Node.Js (v18+)
* npm
* Docker
* Docker compose

Then install required dependencies present in the `package.json` file at the root of the project

```bash
npm install
```

### 2. Database setup (using Docker)

This project utilizes postgresql running in a docker container

```bash
docker compose up --build -d
```

This command starts the database using the `docker-compose.yml` file at the root of the project

### 3. Environment variables

Although these should be kept secret in a .env file, the used variables are shown in this section for evaluation process of the project (as asked if submitting using a GitHub repo)

```.env
# address and port for main application
SERVER=localhost
PORT=8080

DB_USER=dbuser
DB_PASSWORD=dbuser123
DB_NAME=storefront_db
DB_TEST_NAME=storefront_db_test
DB_PORT=5432

# Bcrypt and JWT secrets
SALT=10
PEPPER=mystoresupersecretpassword!23
JWT_SECRET=secretjwtstorefrontkey!23
```

### 4. Database migrations

This project uses db-migrate for database migrations, the following scripts can be used for migration and rolling back on both `dev` and `test` environments  

For development environment  

```bash
npm run migrate:up_dev # Use for migrating on the dev environment
npm run migrate:down_dev # Use for rolling back migrations on the test environment (Tests run on this database so this must be run before running test command)
```

For testing environment  

```bash
npm run migrate:up_test # Use for migrating on the dev environment
npm run migrate:down_test # Use for rolling back migrations on the test environment
```

### 5. Scripts

The following scripts can be used along with the above `db-migrate` scripts

* `npm run build` : Builds the application using Typescript (tsc).
* `npm run start` : runs `npm run build` and starts the server on address `SERVER` and port `PORT` environment variable.
* `npm run dev` : runs `npm run build` and starts the server on address `SERVER` and port `PORT` environment variable in development mode using nodemon.
* `npm run test` : runs `npm run build` and tests suites using jasmine and supertest.

Details of the used scripts:  

```json
    "start": "npm run build && tsx src/server.ts",
    "build": "tsc",
    "dev": "npm run build && nodemon --watch src --ext ts --exec tsx src/server.ts",
    "test": "npm run build && jasmine-ts",

    "migrate:up_dev": "db-migrate up -e dev",
    "migrate:up_test": "db-migrate up -e test",
    "migrate:down_dev": "db-migrate down -c=5 -e dev",
    "migrate:down_test": "db-migrate down -c=5 -e test"
```

### 6. Starting the server

Finally you can start the server by running

```bash
npm run start
```

Which will start on `http://localhost:8080` by default

Checking Endpoint `GET http://localhost:8080/api` will return a json message indicating the server is up and running

```json
{
    "message":"Server is up"
}
```

### 7. Ports details of the server and the database

By default, the server works on the address and port specified in the `Environment variables` which are `localhost` and `8080`but can be changed. If an error occurs during getting them it will run normally on `localhost:8080`.

For the database, it runs on port `5432` which is specified in the `Environment variables` and can be changed. If an error occurs during getting it the database will run normally on port `5432`.

### 8. Routes and requirements

Other information (like Endpoints, routes, and database schema can be found in the `REQUIREMENTS.md` file)
