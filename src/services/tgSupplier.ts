/**
 * TG Supplier item lookup and mark-as-sent, used by the shipment-recovery flow.
 *
 * Set VITE_TG_SUPPLIER_LOOKUP_URL to a POST endpoint that accepts JSON
 * { barcode: string } and returns JSON
 * { record?: { barcode, itemName, orderId, supplier, supplierFacilityId, supplierFacilityName } | null }.
 *
 * Set VITE_TG_SUPPLIER_MARK_SENT_URL to a POST endpoint that accepts JSON
 * { barcode: string, actor: string } and returns JSON { ok: boolean }.
 */
import { findTgSupplierRecordForScenario } from "../recovery/recoveryFixtures";
import type { RecoveryScenario, TgSupplierItemRecord } from "../recovery/recoveryTypes";

function parseRecord(value: unknown): TgSupplierItemRecord | null {
  if (value == null || typeof value !== "object") return null;
  const r = value as Record<string, unknown>;
  if (
    typeof r.barcode !== "string" ||
    typeof r.itemName !== "string" ||
    typeof r.orderId !== "string" ||
    typeof r.supplier !== "string" ||
    typeof r.supplierFacilityId !== "string" ||
    typeof r.supplierFacilityName !== "string"
  ) {
    throw new Error("Invalid TG Supplier lookup response");
  }
  return {
    barcode: r.barcode,
    itemName: r.itemName,
    orderId: r.orderId,
    supplier: r.supplier,
    supplierFacilityId: r.supplierFacilityId,
    supplierFacilityName: r.supplierFacilityName,
  };
}

/**
 * Looks up a scanned item-label barcode in TG Supplier.
 * Resolves to `null` when the barcode has no record (i.e. not a TG Supplier item label).
 */
export async function lookupTgSupplierItemFromApi(
  barcode: string,
  scenario: RecoveryScenario,
): Promise<TgSupplierItemRecord | null> {
  const endpoint = import.meta.env.VITE_TG_SUPPLIER_LOOKUP_URL as string | undefined;

  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ barcode }),
    });
    if (!res.ok) {
      throw new Error(`TG Supplier lookup failed: ${res.status}`);
    }
    const data = (await res.json()) as { record?: unknown };
    return data.record == null ? null : parseRecord(data.record);
  }

  // TODO(backend): replace with the real TG Supplier lookup; scenario only drives the stub.
  await new Promise((r) => setTimeout(r, 500));
  return findTgSupplierRecordForScenario(scenario);
}

/** Records in TG Supplier that the item was sent, attributed to the acting user. */
export async function markItemSentInTgSupplierFromApi(
  barcode: string,
  actor: string,
): Promise<void> {
  const endpoint = import.meta.env.VITE_TG_SUPPLIER_MARK_SENT_URL as string | undefined;

  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ barcode, actor }),
    });
    if (!res.ok) {
      throw new Error(`TG Supplier mark-as-sent failed: ${res.status}`);
    }
    return;
  }

  // TODO(backend): replace with the real TG Supplier mark-as-sent call.
  await new Promise((r) => setTimeout(r, 450));
}
