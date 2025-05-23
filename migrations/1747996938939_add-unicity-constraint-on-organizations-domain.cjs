/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
  await pgm.db.query(`
        ALTER TABLE email_domains
          DROP CONSTRAINT unique_organization_domain;
      `);

  const emailDomains = await pgm.db.query(`
        SELECT id, organization_id, domain, verification_type
        FROM email_domains`);
  const aggregatedEmailDomains = {};
  for (const emailDomain of emailDomains.rows) {
    const { id, domain, organization_id, verification_type } = emailDomain;
    const key = `${organization_id}-${domain}`;
    if (aggregatedEmailDomains[key]) {
      aggregatedEmailDomains[key].push({
        id,
        domain,
        verification_type,
      });
    } else {
      aggregatedEmailDomains[key] = [{ id, domain, verification_type }];
    }
  }

  for (const key of Object.keys(aggregatedEmailDomains)) {
    const emailDomains = aggregatedEmailDomains[key];
    if (emailDomains.length > 1) {
      console.log(
        `Multiple (${emailDomains.length}) email domains found for key ${key}`,
      );
      const emailDomainToKeep = emailDomains.find(
        (emailDomain) => emailDomain.verification_type !== null,
      );
      if (!emailDomainToKeep) {
        throw new Error(
          `No verification type found for domain ${domain} though it is present in multiple email domains (${verificationTypesForDomain.map((emailDomain) => emailDomain.id).join(", ")})`,
        );
      }
      const idsToDelete = emailDomains
        .filter((emailDomain) => emailDomain.id !== emailDomainToKeep.id)
        .map((emailDomain) => emailDomain.id);

      console.log("Deleting ids: ", idsToDelete.join(","));
      await pgm.db.query(`
                    DELETE FROM email_domains
                    WHERE id IN (${idsToDelete.join(", ")})
                `);
    }
  }

  await pgm.db.query(`
        ALTER TABLE email_domains
          ADD CONSTRAINT unique_organization_domain
            UNIQUE (organization_id, domain);
      `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {
  await pgm.db.query(`
        ALTER TABLE email_domains
          DROP CONSTRAINT unique_organization_domain;
      `);

  await pgm.db.query(`
        ALTER TABLE email_domains
          ADD CONSTRAINT unique_organization_domain
            UNIQUE (organization_id, domain, verification_type);
      `);
};
