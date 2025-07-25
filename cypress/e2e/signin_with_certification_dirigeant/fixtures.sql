INSERT INTO users
(id, email, email_verified, email_verified_at, encrypted_password, created_at, updated_at,
 given_name, family_name, phone_number, job, encrypted_totp_key, totp_key_verified_at, force_2fa)
VALUES
  (1, 'certified-franceconnected+dirigeant@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'Un', '0123456789', 'Certified Single Dirigeant',
   null, null, false),
  (2, 'franceconnected+employee@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'Deux', '0123456789', 'FranceConnect-ed Single Dirigeant',
   null, null, false),
  (3, 'franceconnected+dirigeant@unipersonnelle.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'Trois', '0123456789', 'FranceConnect-ed Entreprise Unipersonnelle Dirigeant',
   null, null, false),
  (4, 'outdated-certified-franceconnected+dirigeant@unipersonnelle.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'Quatre', '0123456789', 'FranceConnect-ed Entreprise Unipersonnelle Dirigeant',
   null, null, false),
  (5, 'outdated-franceconnected+dirigeant@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Jean', 'Cinq', '0123456789', 'FranceConnect-ed Entreprise Unipersonnelle Dirigeant',
   null, null, false),
  (6, 'outdated-franceconnected+douglasduteil@mail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Douglas Outdated FranceConnect', 'Duteil', '0123456789', 'HyyyperProConnectDev4000',
   null, null, false),
  (7, 'karima.aknine@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Karima', 'Aknine', '0123456789', 'Grande cheffe de BATI-SEREIN',
   null, null, false),
  (8, 'ulysse.tosi@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Ulysse', 'Tosi', '0123456789', 'Grand chef de DANONE et PAPILLON',
   null, null, false),
  (9, 'stevens.cheron@yopmail.com', true, CURRENT_TIMESTAMP,
   '$2a$10$kzY3LINL6..50Fy9shWCcuNlRfYq0ft5lS.KCcJ5PzrhlWfKK4NIO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
   'Stevens', 'Cheron', '0123456789', 'Grand chef de HERISSON et SURICATE',
   null, null, false)
;

INSERT INTO franceconnect_userinfo
  (user_id, birthdate, birthplace, family_name, given_name, created_at, updated_at)
VALUES
  (1, '1990-06-01', '75000', 'Un', 'Jean', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, '1990-06-01', '75000', 'Deux', 'Jean', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, '1990-06-01', '75000', 'Trois', 'Jean', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, '1990-06-01', '75000', 'Quatre', 'Jean', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, '1980-06-01', '75000', 'Cinq', 'Jean', CURRENT_TIMESTAMP - INTERVAL '6 months', CURRENT_TIMESTAMP  - INTERVAL '4 months'),
  (6, '1980-06-01', '75000', 'DUTEIL', 'Douglas Le Gris', CURRENT_TIMESTAMP - INTERVAL '6 months', CURRENT_TIMESTAMP  - INTERVAL '4 months'),
  (8, '1992-09-07', 'Internet', 'Tosi', 'Ulysse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (9, '1979-11-12', 'Internet', 'Cheron', 'Stevens', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
;

INSERT INTO organizations
  (id, siret, created_at, updated_at)
VALUES
  (1, '45334017600024', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, '82869625200018', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, '55203253400646', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, '79271377800019', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, '52169091700021', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
;

INSERT INTO users_organizations
  (user_id, organization_id, is_external, verification_type, verified_at, has_been_greeted)
VALUES
  (1, 1, false, 'organization_dirigeant', CURRENT_TIMESTAMP, true),
  (2, 1, false, 'domain', CURRENT_TIMESTAMP, true),
  (4, 1, false, 'organization_dirigeant', CURRENT_TIMESTAMP - INTERVAL '1 day', true),
  (5, 1, false, 'organization_dirigeant', CURRENT_TIMESTAMP, true),
  (8, 3, false, 'organization_dirigeant', CURRENT_TIMESTAMP, true),
  (9, 4, false, 'organization_dirigeant', CURRENT_TIMESTAMP, true),
  (9, 5, false, 'domain', CURRENT_TIMESTAMP, true)
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
   ARRAY [
     'http://localhost:4000/'
    ],
   'openid email profile organization',
   'http://localhost:4000/',
   'ProConnect test client. More info: https://github.com/numerique-gouv/proconnect-test-client.',
   null, null, null, null);
