import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const defaultConsent = {
  necessary: true,
  measurement: false,
};

// Persist consent in localStorage with a clear key
// This ensures consent preferences survive page reloads and across sessions
export const consentAtom = atomWithStorage("rimubhai-consent", defaultConsent);

// Derived atom to check if user has made an explicit consent decision
// Used to determine whether to show the cookie banner
// A decision is made when measurement preference has been explicitly set (not undefined)
export const consentDecidedAtom = atom((get) => {
  const stored = get(consentAtom);
  // If measurement value is explicitly set (true or false), user has decided
  return stored.measurement !== undefined;
});
