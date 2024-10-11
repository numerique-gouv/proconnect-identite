import type { QueryResult } from "pg";
import { getDatabaseConnection } from "../connectors/postgres";

export const getClients = async () => {
  const connection = getDatabaseConnection();

  const { rows }: QueryResult<OidcClient> = await connection.query(`
SELECT
    *
FROM oidc_clients
`);

  return rows;
};

export const findByClientId = async (client_id: string) => {
  const connection = getDatabaseConnection();

  const { rows }: QueryResult<OidcClient> = await connection.query(
    `
SELECT
    *
FROM oidc_clients
WHERE client_id = $1
`,
    [client_id],
  );

  return rows.shift();
};

export const getByUserIdOrderedByConnectionCount = async (user_id: number) => {
  const connection = getDatabaseConnection();

  const { rows }: QueryResult<OidcClient> = await connection.query(
    `
SELECT
    oc.*
FROM (
    SELECT
        user_id,
        oidc_client_id,
        COUNT(*) as connection_count,
        MIN(created_at) as created_at,
        MAX(updated_at) as updated_at
    FROM users_oidc_clients
    WHERE user_id = $1
    GROUP BY user_id, oidc_client_id
) uoc
INNER JOIN oidc_clients oc ON oc.id = uoc.oidc_client_id
ORDER BY uoc.connection_count DESC, updated_at DESC
`,
    [user_id],
  );

  return rows;
};

export const addConnection = async ({
  user_id,
  oidc_client_id,
  organization_id,
}: BaseConnection) => {
  const connection = getDatabaseConnection();

  const { rows }: QueryResult<Connection> = await connection.query(
    `
INSERT INTO users_oidc_clients
  (user_id, oidc_client_id, organization_id, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5)
RETURNING user_id, oidc_client_id, organization_id, created_at, updated_at, id;
`,
    [user_id, oidc_client_id, organization_id, new Date(), new Date()],
  );

  return rows.shift()!;
};
