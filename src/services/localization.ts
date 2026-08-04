/**
 * Localization service: per-country address rules for the manual shipment form.
 *
 * Set VITE_LOCALIZATION_ADDRESS_RULES_URL to a POST endpoint that accepts JSON
 * { countryCode: string } and returns JSON
 * { stateRequired: boolean, zipPattern: string, zipExample?: string, stateOptions?: string[] }.
 * `zipPattern` is a regex source string without delimiters.
 */
import { getCountryAddressRules } from "../recovery/recoveryFixtures";
import type { CountryAddressRules } from "../recovery/recoveryTypes";

/**
 * Loads whether state/province is mandatory for a country and the ZIP format to
 * validate against. Address fields stay disabled until this resolves.
 */
export async function loadCountryAddressRulesFromApi(
  countryCode: string,
): Promise<CountryAddressRules> {
  const endpoint = import.meta.env.VITE_LOCALIZATION_ADDRESS_RULES_URL as string | undefined;

  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countryCode }),
    });
    if (!res.ok) {
      throw new Error(`Address rules request failed: ${res.status}`);
    }
    const data = (await res.json()) as {
      stateRequired?: unknown;
      zipPattern?: unknown;
      zipExample?: unknown;
      stateOptions?: unknown;
    };
    if (typeof data.stateRequired !== "boolean" || typeof data.zipPattern !== "string") {
      throw new Error("Invalid address rules response");
    }
    return {
      countryCode,
      stateRequired: data.stateRequired,
      zipPattern: data.zipPattern,
      zipExample: typeof data.zipExample === "string" ? data.zipExample : "",
      stateOptions: Array.isArray(data.stateOptions)
        ? data.stateOptions.filter((s): s is string => typeof s === "string")
        : [],
    };
  }

  // TODO(backend): replace with the real localization service.
  await new Promise((r) => setTimeout(r, 550));
  const rules = getCountryAddressRules(countryCode);
  if (!rules) {
    throw new Error(`No address rules available for ${countryCode}`);
  }
  return rules;
}
