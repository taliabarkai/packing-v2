/**
 * Shared types for the shipment-recovery flow.
 *
 * The packing screen reaches a dead end when a scan returns no shipment. Recovery
 * lets the packer verify the item against TG Supplier, retry the normal shipment
 * generation path, and — only if that fails — create a shipment by hand.
 */

/** Which outcome the prototype simulates; selected by the search keyword used to reach recovery. */
export type RecoveryScenario =
  /** `recovery` — lookup succeeds, mark-as-sent succeeds, shipment generates. */
  | "happyPath"
  /** `recovery-otherfacility` — item belongs to another facility; must be transferred first. */
  | "otherFacility"
  /** `recovery-fail` — mark-as-sent succeeds but generation fails, unlocking manual creation. */
  | "generationFailed"
  /** `recovery-notgsupplier` — the scanned barcode has no TG Supplier record at all. */
  | "noTgSupplierRecord";

/** A single item record as returned by the TG Supplier lookup. */
export type TgSupplierItemRecord = {
  barcode: string;
  itemName: string;
  orderId: string;
  supplier: string;
  /** Facility the item physically belongs to; compared against the current packing facility. */
  supplierFacilityId: string;
  supplierFacilityName: string;
};

/** Country-specific address rules returned by the localization service. */
export type CountryAddressRules = {
  countryCode: string;
  /** When true, state/province is mandatory for this country. */
  stateRequired: boolean;
  /** Serialized regex (no delimiters) the ZIP/postal code must match. */
  zipPattern: string;
  /** Human-readable example used in helper text. */
  zipExample: string;
  /** Empty when the country has no enumerated states/provinces. */
  stateOptions: readonly string[];
};

/** A carrier service available for a given facility + destination country pair. */
export type CarrierServiceOption = {
  id: string;
  carrier: string;
  service: string;
  facilityId: string;
  destinationCountries: readonly string[];
};

/** Read-only facility details pulled from facility config. */
export type FacilityConfig = {
  id: string;
  name: string;
  addressLine: string;
  city: string;
  country: string;
  countryCode: string;
};

/** Selectable country in the manual creation form. */
export type RecoveryCountryOption = { code: string; name: string };

/** One repeatable item block in the manual shipment form. */
export type ManualShipmentItemDraft = {
  /** Stable key for React list rendering; not sent to the backend. */
  key: string;
  itemName: string;
  material: string;
  hsCode: string;
  weight: string;
  declaredValue: string;
  quantity: string;
};

/** The full manual shipment payload. Currency is assigned at creation, so it is absent here. */
export type ManualShipmentDraft = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  countryCode: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  items: ManualShipmentItemDraft[];
  carrierServiceId: string;
  declaredShippingCost: string;
};
