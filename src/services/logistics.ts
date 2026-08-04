/**
 * Carrier services and facility config for the manual shipment form.
 *
 * Set VITE_CARRIER_SERVICES_URL to a POST endpoint that accepts JSON
 * { facilityId: string, destinationCountry: string } and returns JSON
 * { services: { id, carrier, service, facilityId, destinationCountries }[] }.
 * The endpoint is expected to return only services valid for that facility and
 * destination — the UI does not filter further.
 *
 * Set VITE_FACILITY_CONFIG_URL to a POST endpoint that accepts JSON
 * { facilityId: string } and returns JSON
 * { id, name, addressLine, city, country, countryCode }.
 */
import { findCarrierServices, getFacilityConfig } from "../recovery/recoveryFixtures";
import type { CarrierServiceOption, FacilityConfig } from "../recovery/recoveryTypes";

/** Carrier services available for the given facility and destination country. */
export async function loadCarrierServicesFromApi(
  facilityId: string,
  destinationCountry: string,
): Promise<CarrierServiceOption[]> {
  const endpoint = import.meta.env.VITE_CARRIER_SERVICES_URL as string | undefined;

  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ facilityId, destinationCountry }),
    });
    if (!res.ok) {
      throw new Error(`Carrier services request failed: ${res.status}`);
    }
    const data = (await res.json()) as { services?: unknown };
    if (!Array.isArray(data.services)) {
      throw new Error("Invalid carrier services response");
    }
    return data.services as CarrierServiceOption[];
  }

  // TODO(backend): replace with the real carrier services lookup.
  await new Promise((r) => setTimeout(r, 400));
  return findCarrierServices(facilityId, destinationCountry);
}

/** Read-only facility details shown on the manual shipment form. */
export async function loadFacilityConfigFromApi(facilityId: string): Promise<FacilityConfig> {
  const endpoint = import.meta.env.VITE_FACILITY_CONFIG_URL as string | undefined;

  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ facilityId }),
    });
    if (!res.ok) {
      throw new Error(`Facility config request failed: ${res.status}`);
    }
    const data = (await res.json()) as Partial<FacilityConfig>;
    if (typeof data.id !== "string" || typeof data.name !== "string") {
      throw new Error("Invalid facility config response");
    }
    return {
      id: data.id,
      name: data.name,
      addressLine: data.addressLine ?? "",
      city: data.city ?? "",
      country: data.country ?? "",
      countryCode: data.countryCode ?? "",
    };
  }

  // TODO(backend): replace with the real facility config lookup.
  await new Promise((r) => setTimeout(r, 350));
  return getFacilityConfig(facilityId);
}
