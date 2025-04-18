//

import type { FindEmailDomainsByOrganizationIdHandler } from "#src/repositories/email-domain";
import type {
  GetByIdHandler as GetOrganizationByIdHandler,
  LinkUserToOrganizationHandler,
} from "#src/repositories/organization";
import type { GetByIdHandler as GetUserByIdHandler } from "#src/repositories/user";
import type { BaseUserOrganizationLink } from "#src/types";
import { getEmailDomain } from "@gouvfr-lasuite/proconnect.core/services/email";
import { some } from "lodash-es";

//

type FactoryDependencies = {
  findEmailDomainsByOrganizationId: FindEmailDomainsByOrganizationIdHandler;
  getById: GetOrganizationByIdHandler;
  getUserById: GetUserByIdHandler;
  linkUserToOrganization: LinkUserToOrganizationHandler;
};

//

export function forceJoinOrganizationFactory({
  findEmailDomainsByOrganizationId,
  getById,
  getUserById,
  linkUserToOrganization,
}: FactoryDependencies) {
  return async function forceJoinOrganization({
    organization_id,
    user_id,
    is_external = false,
  }: {
    organization_id: number;
    user_id: number;
    is_external?: boolean;
  }) {
    const user = await getUserById(user_id);

    // Ensure that the organization exists (Ceinture Bretelle)
    await getById(organization_id);

    const { email } = user;
    const domain = getEmailDomain(email);
    const organizationEmailDomains =
      await findEmailDomainsByOrganizationId(organization_id);

    let link_verification_type: BaseUserOrganizationLink["verification_type"];
    if (
      some(organizationEmailDomains, {
        domain,
        verification_type: "verified",
      }) ||
      some(organizationEmailDomains, {
        domain,
        verification_type: "trackdechets_postal_mail",
      }) ||
      some(organizationEmailDomains, { domain, verification_type: "external" })
    ) {
      link_verification_type = "domain";
    } else {
      link_verification_type = "no_validation_means_available";
    }

    return await linkUserToOrganization({
      organization_id,
      user_id,
      is_external,
      verification_type: link_verification_type,
    });
  };
}

export type ForceJoinOrganizationHandler = ReturnType<
  typeof forceJoinOrganizationFactory
>;
