import nock from "nock";
import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { getAuthenticatorFriendlyName } from "../src/connectors/github-passkey-authenticator-aaguids";

describe("getOrganizationInfo", () => {
  beforeEach(() => {
    nock("https://raw.githubusercontent.com")
      .get(
        "/passkeydeveloper/passkey-authenticator-aaguids/main/combined_aaguid.json",
      )
      .times(1)
      .reply(200, {
        "ea9b8d66-4d01-1d21-3ce4-b6b48cb575d4": {
          name: "Google Password Manager",
          icon_dark:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE5MiAxOTIiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDE5MiAxOTIiIHdpZHRoPSIyNHB4Ij48cmVjdCBmaWxsPSJub25lIiBoZWlnaHQ9IjE5MiIgd2lkdGg9IjE5MiIgeT0iMCIvPjxnPjxwYXRoIGQ9Ik02OS4yOSwxMDZjLTMuNDYsNS45Ny05LjkxLDEwLTE3LjI5LDEwYy0xMS4wMywwLTIwLTguOTctMjAtMjBzOC45Ny0yMCwyMC0yMCBjNy4zOCwwLDEzLjgzLDQuMDMsMTcuMjksMTBoMjUuNTVDOTAuMyw2Ni41NCw3Mi44Miw1Miw1Miw1MkMyNy43NCw1Miw4LDcxLjc0LDgsOTZzMTkuNzQsNDQsNDQsNDRjMjAuODIsMCwzOC4zLTE0LjU0LDQyLjg0LTM0IEg2OS4yOXoiIGZpbGw9IiM0Mjg1RjQiLz48cmVjdCBmaWxsPSIjRkJCQzA0IiBoZWlnaHQ9IjI0IiB3aWR0aD0iNDQiIHg9Ijk0IiB5PSI4NCIvPjxwYXRoIGQ9Ik05NC4zMiw4NEg2OHYwLjA1YzIuNSwzLjM0LDQsNy40Nyw0LDExLjk1cy0xLjUsOC42MS00LDExLjk1VjEwOGgyNi4zMiBjMS4wOC0zLjgyLDEuNjgtNy44NCwxLjY4LTEyUzk1LjQxLDg3LjgyLDk0LjMyLDg0eiIgZmlsbD0iI0VBNDMzNSIvPjxwYXRoIGQ9Ik0xODQsMTA2djI2aC0xNnYtOGMwLTQuNDItMy41OC04LTgtOHMtOCwzLjU4LTgsOHY4aC0xNnYtMjZIMTg0eiIgZmlsbD0iIzM0QTg1MyIvPjxyZWN0IGZpbGw9IiMxODgwMzgiIGhlaWdodD0iMjQiIHdpZHRoPSI0OCIgeD0iMTM2IiB5PSI4NCIvPjwvZz48L3N2Zz4=",
          icon_light:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE5MiAxOTIiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDE5MiAxOTIiIHdpZHRoPSIyNHB4Ij48cmVjdCBmaWxsPSJub25lIiBoZWlnaHQ9IjE5MiIgd2lkdGg9IjE5MiIgeT0iMCIvPjxnPjxwYXRoIGQ9Ik02OS4yOSwxMDZjLTMuNDYsNS45Ny05LjkxLDEwLTE3LjI5LDEwYy0xMS4wMywwLTIwLTguOTctMjAtMjBzOC45Ny0yMCwyMC0yMCBjNy4zOCwwLDEzLjgzLDQuMDMsMTcuMjksMTBoMjUuNTVDOTAuMyw2Ni41NCw3Mi44Miw1Miw1Miw1MkMyNy43NCw1Miw4LDcxLjc0LDgsOTZzMTkuNzQsNDQsNDQsNDRjMjAuODIsMCwzOC4zLTE0LjU0LDQyLjg0LTM0IEg2OS4yOXoiIGZpbGw9IiM0Mjg1RjQiLz48cmVjdCBmaWxsPSIjRkJCQzA0IiBoZWlnaHQ9IjI0IiB3aWR0aD0iNDQiIHg9Ijk0IiB5PSI4NCIvPjxwYXRoIGQ9Ik05NC4zMiw4NEg2OHYwLjA1YzIuNSwzLjM0LDQsNy40Nyw0LDExLjk1cy0xLjUsOC42MS00LDExLjk1VjEwOGgyNi4zMiBjMS4wOC0zLjgyLDEuNjgtNy44NCwxLjY4LTEyUzk1LjQxLDg3LjgyLDk0LjMyLDg0eiIgZmlsbD0iI0VBNDMzNSIvPjxwYXRoIGQ9Ik0xODQsMTA2djI2aC0xNnYtOGMwLTQuNDItMy41OC04LTgtOHMtOCwzLjU4LTgsOHY4aC0xNnYtMjZIMTg0eiIgZmlsbD0iIzM0QTg1MyIvPjxyZWN0IGZpbGw9IiMxODgwMzgiIGhlaWdodD0iMjQiIHdpZHRoPSI0OCIgeD0iMTM2IiB5PSI4NCIvPjwvZz48L3N2Zz4=",
        },
        "adce0002-35bc-c60a-648b-0b25f1f05503": {
          name: "Chrome on Mac",
          icon_dark:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNDggNDgiPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMy4yMTczIiB5MT0iMTUiIHgyPSI0NC43ODEyIiB5Mj0iMTUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZDkzMDI1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2VhNDMzNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9IjIwLjcyMTkiIHkxPSI0Ny42NzkxIiB4Mj0iNDEuNTAzOSIgeTI9IjExLjY4MzciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmNjOTM0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZiYmMwNCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYyIgeDE9IjI2LjU5ODEiIHkxPSI0Ni41MDE1IiB4Mj0iNS44MTYxIiB5Mj0iMTAuNTA2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzFlOGUzZSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMzNGE4NTMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAKICAgIDxwYXRoIGlkPSJwIiBkPSJNMTMuNjA4NiAzMC4wMDMxIDMuMjE4IDEyLjAwNkEyMy45OTQgMjMuOTk0IDAgMCAwIDI0LjAwMjUgNDhsMTAuMzkwNi0xNy45OTcxLS4wMDY3LS4wMDY4YTExLjk4NTIgMTEuOTg1MiAwIDAgMS0yMC43Nzc4LjAwN1oiLz4KICA8L2RlZnM+CiAgCiAgPHVzZSB4bGluazpocmVmPSIjcCIgZmlsbD0idXJsKCNhKSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDI0IDI0KSIvPgogIDx1c2UgeGxpbms6aHJlZj0iI3AiIGZpbGw9InVybCgjYikiIHRyYW5zZm9ybT0icm90YXRlKC0xMjAgMjQgMjQpIi8+CiAgPHVzZSB4bGluazpocmVmPSIjcCIgZmlsbD0idXJsKCNjKSIvPgogIAogIDxjaXJjbGUgY3g9IjI0IiBjeT0iMjQiIHI9IjEyIiBzdHlsZT0iZmlsbDojZmZmIi8+CiAgPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iOS41IiBzdHlsZT0iZmlsbDojMWE3M2U4Ii8+Cjwvc3ZnPg==",
          icon_light:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNDggNDgiPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMy4yMTczIiB5MT0iMTUiIHgyPSI0NC43ODEyIiB5Mj0iMTUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZDkzMDI1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2VhNDMzNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9IjIwLjcyMTkiIHkxPSI0Ny42NzkxIiB4Mj0iNDEuNTAzOSIgeTI9IjExLjY4MzciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmNjOTM0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZiYmMwNCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYyIgeDE9IjI2LjU5ODEiIHkxPSI0Ni41MDE1IiB4Mj0iNS44MTYxIiB5Mj0iMTAuNTA2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzFlOGUzZSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMzNGE4NTMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAKICAgIDxwYXRoIGlkPSJwIiBkPSJNMTMuNjA4NiAzMC4wMDMxIDMuMjE4IDEyLjAwNkEyMy45OTQgMjMuOTk0IDAgMCAwIDI0LjAwMjUgNDhsMTAuMzkwNi0xNy45OTcxLS4wMDY3LS4wMDY4YTExLjk4NTIgMTEuOTg1MiAwIDAgMS0yMC43Nzc4LjAwN1oiLz4KICA8L2RlZnM+CiAgCiAgPHVzZSB4bGluazpocmVmPSIjcCIgZmlsbD0idXJsKCNhKSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDI0IDI0KSIvPgogIDx1c2UgeGxpbms6aHJlZj0iI3AiIGZpbGw9InVybCgjYikiIHRyYW5zZm9ybT0icm90YXRlKC0xMjAgMjQgMjQpIi8+CiAgPHVzZSB4bGluazpocmVmPSIjcCIgZmlsbD0idXJsKCNjKSIvPgogIAogIDxjaXJjbGUgY3g9IjI0IiBjeT0iMjQiIHI9IjEyIiBzdHlsZT0iZmlsbDojZmZmIi8+CiAgPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iOS41IiBzdHlsZT0iZmlsbDojMWE3M2U4Ii8+Cjwvc3ZnPg==",
        },
      });
  });

  it("should return friendly name", async () => {
    assert.equal(
      await getAuthenticatorFriendlyName(
        "ea9b8d66-4d01-1d21-3ce4-b6b48cb575d4",
      ),
      "Google Password Manager",
    );
  });

  it("should return null", async () => {
    assert.equal(await getAuthenticatorFriendlyName("unknown_aaguid"), null);
  });

  it("should call github once", async () => {
    await getAuthenticatorFriendlyName("ea9b8d66-4d01-1d21-3ce4-b6b48cb575d4");

    assert.equal(
      await getAuthenticatorFriendlyName(
        "ea9b8d66-4d01-1d21-3ce4-b6b48cb575d4",
      ),
      "Google Password Manager",
    );
  });
});
