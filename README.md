# neubooking-backend
## Backend for the Neubooking web-app
> This aplication is a copy of booking.com website created with the intent of practicing my fullstack abilities


## How to contribute with the application

- Download [Node](https://nodejs.org/) on v20.14.0
- Run `npm install` to install all node dependencies
- Create a `.env` file and create the following virable:
    - `MONGO` = `<mongodb_deployment_database>`
    - `TEST_MONGO` = `<mongodb_test_database>`
    - `JWT` = `<JWT key>`
    - `NODE_ENV` = development
- Make sure the scrpits on `package.json` contain these commands:
    - `"start"`: `"cross-env NODE_ENV=development nodemon index.js"`
    - `"test"`: `"cross-env NODE_ENV=testing mocha --exit"`
- Make sure you dependencies on `package.json` looks like this:
    - `"chai": "^5.1.1"`,
    - `"chai-http": "^5.0.0"`,
    - `"cors": "^2.8.5"`,
    - `"cross-env": "^7.0.3"`,
    - `"dotenv": "^16.3.1"`,
    - `"express": "^4.18.2"`,
    - `"mocha": "^10.5.0"`,
    - `"mongoose": "^7.4.0"`,
    - `"nodemon": "^3.0.1"`,
    - `"supertest": "^7.0.0"`
- Create tests following the [Notion](https://www.notion.so/A3-Casos-de-teste-d868ac3148b0448a963a56e7384fc978?pvs=4) test tables
- Run `npm test` to run the tests
- Run `npm start` to run nodemon development mode