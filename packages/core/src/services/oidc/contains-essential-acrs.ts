//

import type { PromptDetail } from "oidc-provider";
import type { EssentialAcrPromptDetail } from "./prompt.js";

//

export function containsEssentialAcrs(
  prompt: PromptDetail,
): prompt is EssentialAcrPromptDetail {
  if (
    prompt.name === "login" &&
    (prompt.reasons.includes("essential_acr") ||
      prompt.reasons.includes("essential_acrs"))
  ) {
    return true;
  }

  return false;
}
