import {
  Delete2faProtection,
  DeleteFreeTotpMail,
} from "@numerique-gouv/moncomptepro.email";
import { isEmpty } from "lodash-es";
import {
  EmailUnavailableError,
  InvalidCredentialsError,
  InvalidEmailError,
  InvalidMagicLinkError,
  InvalidTokenError,
  LeakedPasswordError,
  NoNeedVerifyEmailAddressError,
  NotFoundError,
  UserNotFoundError,
  WeakPasswordError,
} from "../config/errors";
import { sendMail as legacySendMail } from "../connectors/brevo";
import { isEmailSafeToSendTransactional } from "../connectors/debounce";
import { sendMail } from "../connectors/mail";

import {
  MAGIC_LINK_TOKEN_EXPIRATION_DURATION_IN_MINUTES,
  MAX_DURATION_BETWEEN_TWO_EMAIL_ADDRESS_VERIFICATION_IN_MINUTES,
  MONCOMPTEPRO_HOST,
  RESET_PASSWORD_TOKEN_EXPIRATION_DURATION_IN_MINUTES,
  VERIFY_EMAIL_TOKEN_EXPIRATION_DURATION_IN_MINUTES,
} from "../config/env";
import { hasPasswordBeenPwned } from "../connectors/pwnedpasswords";
import {
  create,
  findByEmail,
  findById,
  findByMagicLinkToken,
  findByResetPasswordToken,
  update,
} from "../repositories/user";
import { getDidYouMeanSuggestion } from "../services/did-you-mean";
import { isExpired } from "../services/is-expired";
import {
  generatePinToken,
  generateToken,
  hashPassword,
  isPasswordSecure,
  validatePassword,
} from "../services/security";
import { isWebauthnConfiguredForUser } from "./webauthn";

export const startLogin = async (
  email: string,
): Promise<{
  email: string;
  userExists: boolean;
  hasAPassword: boolean;
  hasWebauthnConfigured: boolean;
  needsInclusionconnectWelcomePage: boolean;
}> => {
  const user = await findByEmail(email);
  const userExists = !isEmpty(user);

  if (userExists) {
    return {
      email,
      userExists: true,
      hasAPassword: !!user.encrypted_password,
      hasWebauthnConfigured: await isWebauthnConfiguredForUser(user.id),
      needsInclusionconnectWelcomePage:
        user?.needs_inclusionconnect_welcome_page,
    };
  }

  let { isEmailSafeToSend, didYouMean } =
    await isEmailSafeToSendTransactional(email);

  if (!isEmailSafeToSend) {
    if (!didYouMean) {
      didYouMean = getDidYouMeanSuggestion(email);
    }

    throw new InvalidEmailError(didYouMean);
  }

  return {
    email,
    userExists: false,
    hasAPassword: false,
    hasWebauthnConfigured: false,
    needsInclusionconnectWelcomePage: false,
  };
};

export const loginWithPassword = async (
  email: string,
  password: string,
): Promise<User> => {
  const user = await findByEmail(email);
  if (isEmpty(user)) {
    throw new NotFoundError();
  }

  const isMatch = await validatePassword(password, user.encrypted_password);

  if (!isMatch) {
    throw new InvalidCredentialsError();
  }

  return user;
};

export const signupWithPassword = async (
  email: string,
  password: string,
): Promise<User> => {
  const user = await findByEmail(email);

  if (!isEmpty(user) && !isEmpty(user.encrypted_password)) {
    throw new EmailUnavailableError();
  }

  if (!isPasswordSecure(password, email)) {
    throw new WeakPasswordError();
  }

  if (await hasPasswordBeenPwned(password)) {
    throw new LeakedPasswordError();
  }

  const hashedPassword = await hashPassword(password);

  if (!isEmpty(user)) {
    // force email verification after setting a password for the first time for an existing user
    return await update(user.id, {
      email_verified: false,
      encrypted_password: hashedPassword,
    });
  }

  return await create({
    email,
    encrypted_password: hashedPassword,
  });
};

/**
 * @return true if a new verify token was sent, false otherwise.
 */
export const sendEmailAddressVerificationEmail = async ({
  email,
  isBrowserTrusted,
  force = false,
}: {
  email: string;
  isBrowserTrusted: boolean;
  force?: boolean;
}): Promise<boolean> => {
  const user = await findByEmail(email);

  if (isEmpty(user)) {
    throw new UserNotFoundError();
  }

  const renewalNeeded = isExpired(
    user.email_verified_at,
    MAX_DURATION_BETWEEN_TWO_EMAIL_ADDRESS_VERIFICATION_IN_MINUTES,
  );

  if (isBrowserTrusted && user.email_verified && !renewalNeeded) {
    throw new NoNeedVerifyEmailAddressError();
  }

  const isTokenExpired = isExpired(
    user.verify_email_sent_at,
    VERIFY_EMAIL_TOKEN_EXPIRATION_DURATION_IN_MINUTES,
  );

  if (!(force || isTokenExpired)) {
    return false;
  }

  const verify_email_token = await generatePinToken();

  await update(user.id, {
    verify_email_token,
    verify_email_sent_at: new Date(),
  });

  await legacySendMail({
    to: [user.email],
    subject: "Vérification de votre adresse email",
    template: "verify-email",
    params: {
      verify_email_token,
    },
  });

  return true;
};

export const sendDeleteUserEmail = async ({ user_id }: { user_id: number }) => {
  const user = await findById(user_id);
  if (isEmpty(user)) {
    throw new UserNotFoundError();
  }
  const { given_name, family_name, email } = user;

  return legacySendMail({
    to: [email],
    subject: "Suppression de compte",
    template: "delete-account",
    params: { given_name, family_name },
  });
};

export const sendDeleteFreeTOTPApplicationEmail = async ({
  user_id,
}: {
  user_id: number;
}) => {
  const user = await findById(user_id);
  if (isEmpty(user)) {
    throw new UserNotFoundError();
  }
  const { given_name, family_name, email } = user;

  return sendMail({
    to: [email],
    subject:
      "Suppression d'une application d'authentification à double facteur",
    html: DeleteFreeTotpMail({
      baseurl: MONCOMPTEPRO_HOST,
      family_name: family_name ?? "",
      given_name: given_name ?? "",
      support_email: "contact@moncomptepro.beta.gouv.fr",
    }).toString(),
  });
};

export const sendDisable2faMail = async ({ user_id }: { user_id: number }) => {
  const user = await findById(user_id);
  if (isEmpty(user)) {
    throw new UserNotFoundError();
  }
  const { given_name, family_name, email } = user;

  return sendMail({
    to: [email],
    subject: "Désactivation de la validation en deux étapes",
    html: Delete2faProtection({
      baseurl: MONCOMPTEPRO_HOST,
      family_name: family_name ?? "",
      given_name: given_name ?? "",
    }).toString(),
  });
};

export const sendChangeAppliTotpEmail = async ({
  user_id,
}: {
  user_id: number;
}) => {
  const user = await findById(user_id);
  if (isEmpty(user)) {
    throw new UserNotFoundError();
  }
  const { given_name, family_name, email } = user;
  return legacySendMail({
    to: [email],
    subject: "Changement d'application d’authentification",
    template: "update-totp-application",
    params: { given_name, family_name },
  });
};

export const sendDeleteAccessKeyMail = async ({
  user_id,
}: {
  user_id: number;
}) => {
  const user = await findById(user_id);
  if (isEmpty(user)) {
    throw new UserNotFoundError();
  }
  const { given_name, family_name, email } = user;

  return legacySendMail({
    to: [email],
    subject: "Alerte de sécurité",
    template: "delete-access-key",
    params: { given_name, family_name },
  });
};

export const sendAddFreeTOTPEmail = async ({
  user_id,
}: {
  user_id: number;
}) => {
  const user = await findById(user_id);
  if (isEmpty(user)) {
    throw new UserNotFoundError();
  }
  const { given_name, family_name, email } = user;

  return legacySendMail({
    to: [email],
    subject: "Validation en deux étapes activée",
    template: "add-2fa",
    params: { given_name, family_name, email },
  });
};

export const sendActivateAccessKeyMail = async ({
  user_id,
}: {
  user_id: number;
}) => {
  const user = await findById(user_id);
  if (isEmpty(user)) {
    throw new UserNotFoundError();
  }
  const { given_name, family_name, email } = user;

  return legacySendMail({
    to: [email],
    subject: "Alerte de sécurité",
    template: "add-access-key",
    params: { given_name, family_name },
  });
};

const allowedUpdatedKeys = [
  "given_name",
  "family_name",
  "phone_number",
  "job",
] as const;

export const sendUpdatePersonalInformationEmail = async ({
  previousInformations,
  newInformation,
}: {
  previousInformations: User;
  newInformation: User;
}) => {
  const { given_name, family_name, email } = previousInformations;

  const updatedFields = allowedUpdatedKeys.reduce(
    (acc, key) => {
      if (previousInformations[key] === newInformation[key]) {
        return acc;
      }
      return {
        ...acc,
        [key]: { new: newInformation[key], old: previousInformations[key] },
      };
    },
    {} as {
      [$Key in (typeof allowedUpdatedKeys)[number]]: {
        new: User[$Key];
        old: User[$Key];
      };
    },
  );

  if (isEmpty(updatedFields)) {
    return;
  }

  if (previousInformations !== newInformation) {
    return legacySendMail({
      to: [email],
      subject: "Mise à jour de vos données personnelles",
      template: "update-personal-data",
      params: { given_name, family_name, updatedFields },
    });
  }
};

export const verifyEmail = async (
  email: string,
  token: string,
): Promise<User> => {
  const user = await findByEmail(email);

  if (isEmpty(user)) {
    throw new UserNotFoundError();
  }

  if (user.verify_email_token !== token) {
    throw new InvalidTokenError();
  }

  const isTokenExpired = isExpired(
    user.verify_email_sent_at,
    VERIFY_EMAIL_TOKEN_EXPIRATION_DURATION_IN_MINUTES,
  );

  if (isTokenExpired) {
    throw new InvalidTokenError();
  }

  return await update(user.id, {
    email_verified: true,
    email_verified_at: new Date(),
    verify_email_token: null,
    verify_email_sent_at: null,
  });
};

export const needsEmailVerificationRenewal = async (
  email: string,
): Promise<boolean> => {
  const user = await findByEmail(email);

  if (isEmpty(user)) {
    throw new UserNotFoundError();
  }

  return isExpired(
    user.email_verified_at,
    MAX_DURATION_BETWEEN_TWO_EMAIL_ADDRESS_VERIFICATION_IN_MINUTES,
  );
};

export const sendSendMagicLinkEmail = async (
  email: string,
  host: string,
): Promise<boolean> => {
  let user = await findByEmail(email);

  if (isEmpty(user)) {
    user = await create({
      email,
    });
  }

  const magicLinkToken = await generateToken();

  await update(user.id, {
    magic_link_token: magicLinkToken,
    magic_link_sent_at: new Date(),
  });

  await legacySendMail({
    to: [user.email],
    subject: "Lien de connexion à ProConnect",
    template: "magic-link",
    params: {
      magic_link: `${host}/users/sign-in-with-magic-link?magic_link_token=${magicLinkToken}`,
    },
  });

  return true;
};

export const loginWithMagicLink = async (token: string): Promise<User> => {
  // check that token as not the default empty value as it will match all users
  if (!token) {
    throw new InvalidMagicLinkError();
  }

  const user = await findByMagicLinkToken(token);

  if (isEmpty(user)) {
    throw new InvalidMagicLinkError();
  }

  const isTokenExpired = isExpired(
    user.magic_link_sent_at,
    MAGIC_LINK_TOKEN_EXPIRATION_DURATION_IN_MINUTES,
  );

  if (isTokenExpired) {
    throw new InvalidMagicLinkError();
  }

  return await update(user.id, {
    email_verified: true,
    email_verified_at: new Date(),
    magic_link_token: null,
    magic_link_sent_at: null,
  });
};

export const sendResetPasswordEmail = async (
  email: string,
  host: string,
): Promise<boolean> => {
  const user = await findByEmail(email);

  if (isEmpty(user)) {
    // failing silently as we do not want to give info on whether the user exists or not
    return true;
  }

  const resetPasswordToken = await generateToken();

  await update(user.id, {
    reset_password_token: resetPasswordToken,
    reset_password_sent_at: new Date(),
  });

  await legacySendMail({
    to: [user.email],
    subject: "Instructions pour la réinitialisation du mot de passe",
    template: "reset-password",
    params: {
      reset_password_link: `${host}/users/change-password?reset_password_token=${resetPasswordToken}`,
    },
  });

  return true;
};

export const changePassword = async (
  token: string,
  password: string,
): Promise<User> => {
  // check that token as not the default empty value as it will match all users
  if (!token) {
    throw new InvalidTokenError();
  }

  const user = await findByResetPasswordToken(token);

  if (isEmpty(user)) {
    throw new InvalidTokenError();
  }

  const isTokenExpired = isExpired(
    user.reset_password_sent_at,
    RESET_PASSWORD_TOKEN_EXPIRATION_DURATION_IN_MINUTES,
  );

  if (isTokenExpired) {
    throw new InvalidTokenError();
  }

  if (!isPasswordSecure(password, user.email)) {
    throw new WeakPasswordError();
  }

  if (await hasPasswordBeenPwned(password)) {
    throw new LeakedPasswordError();
  }

  const hashedPassword = await hashPassword(password);

  return await update(user.id, {
    encrypted_password: hashedPassword,
    email_verified: true,
    email_verified_at: new Date(),
    reset_password_token: null,
    reset_password_sent_at: null,
  });
};

export const updatePersonalInformations = async (
  userId: number,
  {
    given_name,
    family_name,
    phone_number,
    job,
  }: Pick<User, "given_name" | "family_name" | "phone_number" | "job">,
): Promise<User> => {
  return await update(userId, {
    given_name,
    family_name,
    phone_number,
    job,
  });
};
