# Run cypress locally

## Usage

### `docker compose up --wait`

Starts all the required services and waits for them to be ready.

### `npm run e2e:dev <my_cypress_test_case>`

> [!TIP]  
> Running the script without argument (or with a wrong argument) will trigger a prompt to select the test case.
>
> ```bash
> $ npm run e2e:dev
> Could not resolve test case "undefined"
> They are 26 test cases in the cypress/e2e folder :
> 0) activate_totp        1) check_email_deliverability
> [...]
> ```
>
> This will allow you to quickly pick the test case you want to run.

This will open a server on `http://localhost:3000`

### `npm run e2e:studio`

> Alias for `npx cypress open`

Will load the Cypress configuration from `cypress.config.ts`.
Here we recommend to choose the `<my_cypress_test_case>` you launched to testing coerce.

## Additional commands

### `npm run e2e:run <my_cypress_test_case>`

On your host, run the tests

```bash
npm run e2e:run <my_cypress_test_case>
```

### `npm run e2e:setup <my_cypress_test_case>`

> [!CAUTION]  
> That this will delete your database.

Load the specific fixtures in the database using

```bash
ENABLE_DATABASE_DELETION=True npm run e2e:setup redirect_after_session_expiration
```

#### `--dev` mode (same as `npm run e2e:dev`)

If you want to run the app in development mode, you can use the `--dev` flag.

```bash
NODE_ENV=development ENABLE_DATABASE_DELETION=True npm run e2e:setup --dev redirect_after_session_expiration
```

## About test client used in e2e test

Some tests require a test client to be running.
By default, the Docker Compose file is configured to launch enough test clients to execute the end-to-end (E2E) tests.

## About cypress record video

To help support and the team better visualise the different ProConnect Identity paths, it is possible to film the paths via Cypress. The command to run is as follows:

```bash
CYPRESS_RECORD=true CYPRESS_RECORD_FOR_HUMANS=true npx dotenvx run -- npx cypress run --headed --spec "cypress/e2e/join_and_moderation/index.cy.ts"
```

The videos are listed on the following documentation page: https://documentation.beta.numerique.gouv.fr/doc/videos-des-differents-parcours-A3UJiqFLZn
If tests or visuals are added or modified, please update the videos in the documentation.
