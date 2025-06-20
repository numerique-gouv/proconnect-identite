# 📦 @gouvfr-lasuite/proconnect.insee

> ⚡ Typed entreprise.api.gouv.fr API for ProConnect

## ⚙️ Installation

```bash
npm install @gouvfr-lasuite/proconnect.insee
```

## 📖 Usage

### `@gouvfr-lasuite/proconnect.insee/client"

Get full fetch client from `@gouvfr-lasuite/proconnect.insee/client`

```ts
import { createInseeOpenApiClient } from "@gouvfr-lasuite/proconnect.insee/client";

const entrepriseOpenApiClient = createInseeOpenApiClient(
  "ENTREPRISE_API_TOKEN",
  { baseUrl: "https://staging.entreprise.api.gouv.fr" },
);
```

### `@gouvfr-lasuite/proconnect.insee/api"

Get use case api factory functions from `@gouvfr-lasuite/proconnect.insee/api`

```ts
import { findBySiretFactory } from "@gouvfr-lasuite/proconnect.insee/api/insee";

export const findBySiret = findBySiretFactory(entrepriseOpenApiClient, {
  context: "ProConnect",
  object: "findEstablishmentBySiret",
  recipient: "13002526500013",
});
```

### `@gouvfr-lasuite/proconnect.insee/types"

Get API Entreprise types and errors from `@gouvfr-lasuite/proconnect.insee/types`

```ts
import type { InseeSiretEstablishment } from "@gouvfr-lasuite/proconnect.insee/types";

const establishment: InseeSiretEstablishment;
```

### `@gouvfr-lasuite/proconnect.insee/formatters"

Get models formatters from `@gouvfr-lasuite/proconnect.insee/formatters`

```ts
import { formatMainActivity } from "@gouvfr-lasuite/proconnect.insee/formatters";

const libelleActivitePrincipale: formatMainActivity(activite_principale),
```

### `@gouvfr-lasuite/proconnect.insee/testing"

Used for internal tests

## 📖 License

[MIT](./LICENSE.md)
