/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TRACKING_LOAD_URL?: string;
  readonly VITE_SPLIT_SHIPMENT_NEW_ID_URL?: string;
  /** Shipment recovery — see src/services/. Each is optional; unset means the stub runs. */
  readonly VITE_TG_SUPPLIER_LOOKUP_URL?: string;
  readonly VITE_TG_SUPPLIER_MARK_SENT_URL?: string;
  readonly VITE_SHIPMENT_GENERATION_TRIGGER_URL?: string;
  readonly VITE_MANUAL_SHIPMENT_CREATE_URL?: string;
  readonly VITE_LOCALIZATION_ADDRESS_RULES_URL?: string;
  readonly VITE_CARRIER_SERVICES_URL?: string;
  readonly VITE_FACILITY_CONFIG_URL?: string;
}
