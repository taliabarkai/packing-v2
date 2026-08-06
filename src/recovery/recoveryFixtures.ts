/**
 * Prototype sample data for the shipment-recovery flow.
 *
 * Every service under `src/services/` falls back to this data while its endpoint
 * is unconfigured, so the UI is fully exercisable without a backend. Data lives
 * beside its `find*`/`get*` accessor, matching the `SHIPPING_ROUTE_ROWS` /
 * `findShippingRoute` convention in `screens/ReadyToPack.tsx`.
 */
import type {
  CarrierServiceOption,
  CountryAddressRules,
  FacilityConfig,
  RecoveryCountryOption,
  RecoveryScenario,
  TgSupplierItemRecord,
} from "./recoveryTypes";

/** The facility this packing station belongs to; mark-as-sent is blocked for items held elsewhere. */
export const CURRENT_PACKING_FACILITY_ID = "IL-KG";

/** Read-only facility details shown at the bottom of the manual creation form. */
const RECOVERY_FACILITY_CONFIGS: readonly FacilityConfig[] = [
  {
    id: "IL-KG",
    name: "Kiryat Gat",
    addressLine: "Ha-Melacha St 7",
    city: "Kiryat Gat",
    country: "Israel",
    countryCode: "IL",
  },
  {
    id: "HU-BP",
    name: "Budapest",
    addressLine: "Váci út 117",
    city: "Budapest",
    country: "Hungary",
    countryCode: "HU",
  },
  {
    id: "IL-NZ",
    name: "Nazareth",
    addressLine: "Paulus VI St 44",
    city: "Nazareth",
    country: "Israel",
    countryCode: "IL",
  },
];

export function getFacilityConfig(facilityId: string): FacilityConfig {
  return RECOVERY_FACILITY_CONFIGS.find((f) => f.id === facilityId) ?? RECOVERY_FACILITY_CONFIGS[0];
}

/**
 * TG Supplier records keyed by scenario. The prototype reaches recovery through a
 * search keyword rather than a real scan, so each keyword carries a plausible
 * item-label barcode for the dialogs to display.
 */
const RECOVERY_TG_SUPPLIER_RECORDS: Readonly<Record<RecoveryScenario, TgSupplierItemRecord | null>> = {
  happyPath: {
    barcode: "TG-4471-88203",
    itemName: "Custom Name Necklace — 18K Rose Gold Vermeil",
    descriptionLines: [
      "Material: 10k Solid Gold",
      "Diamond: No",
      "Inscriptions: 2 Inscriptions",
      "Inscription #1: Sloane",
      "Inscription #2: Charlotte",
      'Chain length: 18"',
      "Future engraving: No",
    ],
    orderId: "273905854",
    supplier: "Tenen Studio",
    supplierFacilityId: "IL-KG",
    supplierFacilityName: "Kiryat Gat",
  },
  otherFacility: {
    barcode: "TG-4471-99117",
    itemName: "Engraved Bar Bracelet — 925 Sterling Silver",
    descriptionLines: [
      "Material: 925 Sterling Silver",
      "Diamond: No",
      "Inscriptions: 1 Inscription",
      "Inscription #1: Nazareth",
      'Chain length: 7"',
      "Future engraving: Yes",
    ],
    orderId: "273906112",
    supplier: "Tenen Studio",
    supplierFacilityId: "IL-NZ",
    supplierFacilityName: "Nazareth",
  },
  generationFailed: {
    barcode: "TG-4471-70552",
    itemName: "Birthstone Ring — 14K Solid Gold",
    descriptionLines: [
      "Material: 14k Solid Gold",
      "Diamond: Yes",
      "Inscriptions: 1 Inscription",
      "Inscription #1: Ava",
      "Ring size: 6.5",
      "Future engraving: No",
    ],
    orderId: "273906470",
    supplier: "Tenen Studio",
    supplierFacilityId: "IL-KG",
    supplierFacilityName: "Kiryat Gat",
  },
  /** Not a TG Supplier item label — recovery is not applicable. */
  noTgSupplierRecord: null,
};

export function findTgSupplierRecordForScenario(
  scenario: RecoveryScenario,
): TgSupplierItemRecord | null {
  return RECOVERY_TG_SUPPLIER_RECORDS[scenario];
}

/** Barcode shown in the recovery dialogs for a scenario, even when no record exists. */
const RECOVERY_FALLBACK_BARCODES: Readonly<Record<RecoveryScenario, string>> = {
  happyPath: "TG-4471-88203",
  otherFacility: "TG-4471-99117",
  generationFailed: "TG-4471-70552",
  noTgSupplierRecord: "9900123456789",
};

export function getScenarioBarcode(scenario: RecoveryScenario): string {
  return RECOVERY_FALLBACK_BARCODES[scenario];
}

/** Destination countries offered by the manual creation form. */
export const RECOVERY_COUNTRY_OPTIONS: readonly RecoveryCountryOption[] = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "AU", name: "Australia" },
  { code: "IL", name: "Israel" },
  { code: "HU", name: "Hungary" },
];

export function findCountryName(countryCode: string): string {
  return RECOVERY_COUNTRY_OPTIONS.find((c) => c.code === countryCode)?.name ?? countryCode;
}

/**
 * Address rules per country, as the localization service would return them:
 * whether state/province is mandatory and the ZIP format to validate against.
 */
const RECOVERY_COUNTRY_ADDRESS_RULES: Readonly<Record<string, CountryAddressRules>> = {
  US: {
    countryCode: "US",
    stateRequired: true,
    zipPattern: "^\\d{5}(-\\d{4})?$",
    zipExample: "10001 or 10001-2345",
    stateOptions: [
      "New York",
      "California",
      "Texas",
      "Florida",
      "Washington",
      "Georgia",
      "Virginia",
      "New Jersey",
    ],
  },
  CA: {
    countryCode: "CA",
    stateRequired: true,
    zipPattern: "^[A-Za-z]\\d[A-Za-z] ?\\d[A-Za-z]\\d$",
    zipExample: "K1A 0B1",
    stateOptions: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
  },
  AU: {
    countryCode: "AU",
    stateRequired: true,
    zipPattern: "^\\d{4}$",
    zipExample: "2000",
    stateOptions: ["New South Wales", "Victoria", "Queensland", "Western Australia", "Tasmania"],
  },
  GB: {
    countryCode: "GB",
    stateRequired: false,
    zipPattern: "^[A-Za-z]{1,2}\\d[A-Za-z\\d]? ?\\d[A-Za-z]{2}$",
    zipExample: "SW1A 1AA",
    stateOptions: [],
  },
  DE: {
    countryCode: "DE",
    stateRequired: false,
    zipPattern: "^\\d{5}$",
    zipExample: "10115",
    stateOptions: [],
  },
  FR: {
    countryCode: "FR",
    stateRequired: false,
    zipPattern: "^\\d{5}$",
    zipExample: "75001",
    stateOptions: [],
  },
  IL: {
    countryCode: "IL",
    stateRequired: false,
    zipPattern: "^\\d{5,7}$",
    zipExample: "1234567",
    stateOptions: [],
  },
  HU: {
    countryCode: "HU",
    stateRequired: false,
    zipPattern: "^\\d{4}$",
    zipExample: "1051",
    stateOptions: [],
  },
};

export function getCountryAddressRules(countryCode: string): CountryAddressRules | null {
  return RECOVERY_COUNTRY_ADDRESS_RULES[countryCode] ?? null;
}

/** Predefined material list for manual item blocks. */
export const RECOVERY_MATERIAL_OPTIONS: readonly string[] = [
  "18K Rose Gold Vermeil",
  "925 Sterling Silver",
  "14K Solid Gold",
  "Stainless Steel",
  "Brass",
  "Gift Packaging",
];

/** Material → HS code mapping; the form auto-populates the field and leaves it editable. */
const RECOVERY_HS_CODE_BY_MATERIAL: Readonly<Record<string, string>> = {
  "18K Rose Gold Vermeil": "7113.19.00",
  "925 Sterling Silver": "7113.11.00",
  "14K Solid Gold": "7113.19.10",
  "Stainless Steel": "7117.19.00",
  Brass: "7117.19.90",
  "Gift Packaging": "4819.20.00",
};

export function getHsCodeForMaterial(material: string): string {
  return RECOVERY_HS_CODE_BY_MATERIAL[material] ?? "";
}

/**
 * Carrier services per facility. `destinationCountries` is what makes the manual
 * form's carrier dropdown narrow as the destination country changes.
 */
const RECOVERY_CARRIER_SERVICES: readonly CarrierServiceOption[] = [
  {
    id: "kg-fedex-express",
    carrier: "FedEx",
    service: "International Express",
    facilityId: "IL-KG",
    destinationCountries: ["US", "CA", "GB", "DE", "FR", "AU", "IL"],
  },
  {
    id: "kg-fedex-expedited",
    carrier: "FedEx",
    service: "Expedited",
    facilityId: "IL-KG",
    destinationCountries: ["US", "CA", "GB"],
  },
  {
    id: "kg-usps-expedited",
    carrier: "USPS",
    service: "Priority Expedited",
    facilityId: "IL-KG",
    destinationCountries: ["US"],
  },
  {
    id: "kg-ups-standard",
    carrier: "UPS",
    service: "Standard",
    facilityId: "IL-KG",
    destinationCountries: ["GB", "DE", "FR", "HU"],
  },
  {
    id: "kg-dhl-express",
    carrier: "DHL",
    service: "Express Worldwide",
    facilityId: "IL-KG",
    destinationCountries: ["DE", "FR", "GB", "HU", "AU", "IL"],
  },
  {
    id: "kg-colissimo-intl",
    carrier: "Colissimo",
    service: "International",
    facilityId: "IL-KG",
    destinationCountries: ["FR"],
  },
  {
    id: "bp-dhl-express",
    carrier: "DHL",
    service: "Express Worldwide",
    facilityId: "HU-BP",
    destinationCountries: ["DE", "FR", "GB", "HU"],
  },
];

export function findCarrierServices(
  facilityId: string,
  destinationCountryCode: string,
): CarrierServiceOption[] {
  return RECOVERY_CARRIER_SERVICES.filter(
    (s) => s.facilityId === facilityId && s.destinationCountries.includes(destinationCountryCode),
  );
}

export function formatCarrierServiceDisplay(option: CarrierServiceOption): string {
  return `${option.carrier} ${option.service}`;
}
