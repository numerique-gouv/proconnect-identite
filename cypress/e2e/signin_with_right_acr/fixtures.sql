INSERT INTO users
(id, email, email_verified, email_verified_at, encrypted_password, created_at, updated_at,
 given_name, family_name, phone_number, job, encrypted_totp_key, totp_key_verified_at, force_2fa)
VALUES
  (1, 'ial2-aal2@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'IAL2 AAL2', '0123456789', 'Sbire',
   'kuOSXGk68H2B3pYnph0uyXAHrmpbWaWyX/iX49xVaUc=.VMPBZSO+eAng7mjS.cI2kRY9rwhXchcKiiaMZIg==',
   CURRENT_TIMESTAMP, false
  ),
  (2, 'ial1-aal2@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'IAL1 AAL2', '0123456789', 'Sbire',
   'kuOSXGk68H2B3pYnph0uyXAHrmpbWaWyX/iX49xVaUc=.VMPBZSO+eAng7mjS.cI2kRY9rwhXchcKiiaMZIg==',
   CURRENT_TIMESTAMP, false
  ),
  (3, 'ial2-aal1@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'IAL2 AAL1', '0123456789', 'Sbire',
   null, null, false),
  (4, 'ial1-aal1@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'IAL1 AAL1', '0123456789', 'Sbire',
   null, null, false),
  (5, 'certification-dirigeant@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'Certification', '0123456789', 'Dirigeant',
   null, null, false),
  (6, 'certification-dirigeant-aal2@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'Certification AAL2', '0123456789', 'Dirigeant',
   'kuOSXGk68H2B3pYnph0uyXAHrmpbWaWyX/iX49xVaUc=.VMPBZSO+eAng7mjS.cI2kRY9rwhXchcKiiaMZIg==',
   CURRENT_TIMESTAMP, false);

INSERT INTO organizations
  (id, siret, created_at, updated_at)
VALUES
  (1, '21340126800130', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO users_organizations
  (user_id, organization_id, is_external, verified_at, verification_type, has_been_greeted)
VALUES
  (1, 1, false, null, 'domain', true),
  (2, 1, false, null, null, true),
  (3, 1, false, null, 'domain', true),
  (4, 1, false, null, null, true),
  (5, 1, false, CURRENT_TIMESTAMP, 'organization_dirigeant', true),
  (6, 1, false, CURRENT_TIMESTAMP, 'organization_dirigeant', true);

INSERT INTO oidc_clients
(client_name, client_id, client_secret, redirect_uris,
 post_logout_redirect_uris, scope, client_uri, client_description,
 userinfo_signed_response_alg, id_token_signed_response_alg,
 authorization_signed_response_alg, introspection_signed_response_alg)
VALUES
  ('Oidc Test Client',
   'standard_client_id',
   'standard_client_secret',
   ARRAY [
     'http://localhost:4000/login-callback'
     ],
   ARRAY []::varchar[],
   'openid email profile organization',
   'http://localhost:4000/',
   'ProConnect test client. More info: https://github.com/numerique-gouv/proconnect-test-client.',
   null, null, null, null);
