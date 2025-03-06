INSERT INTO users
(id, email, email_verified, email_verified_at, encrypted_password, created_at, updated_at,
 given_name, family_name, phone_number, job, encrypted_totp_key, totp_key_verified_at, force_2fa)
VALUES
  (1, 'certified-single-organization+certification-dirigeant@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'Un', '0123456789', 'Certified Single Dirigeant',
   null, null, false),
  (2, 'franceconnected-single-organization+certification-dirigeant@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'Deux', '0123456789', 'FranceConnect-ed Single Dirigeant',
   null, null, false),
  (3, 'franceconnected-bi-organization+certification-dirigeant@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'Trois', '0123456789', 'FranceConnect-ed Two Dirigeant',
   null, null, false),
  (4, 'bi+certification-dirigeant@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'Deux', '0123456789', 'Two Dirigeant',
   null, null, false)
;

INSERT INTO franceconnect_userinfo
  (user_id)
VALUES
  (1),
  (2);

INSERT INTO organizations
  (id, siret, created_at, updated_at)
VALUES
  (1, '21340126800130', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, '21920023500014', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
;

INSERT INTO users_organizations
  (user_id, organization_id, is_external, is_executive, verification_type, has_been_greeted)
VALUES
  (1, 1, false, true, 'domain', true),
  (2, 1, false, false, 'domain', true),
  (3, 1, false, false, 'domain', true),
  (3, 2, false, false, 'domain', true);
;

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
