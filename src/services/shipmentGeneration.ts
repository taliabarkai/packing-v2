/**
 * Shipment generation and manual shipment creation.
 *
 * `triggerShipmentGenerationFromApi` is the single generation path shared by every
 * caller that needs a shipment produced from a "sent" item — the QA sign-off event,
 * recovery's mark-as-sent, and the in-production "Item sent" release. Callers must
 * not reimplement generation; add a caller here instead.
 *
 * Set VITE_SHIPMENT_GENERATION_TRIGGER_URL to a POST endpoint that accepts JSON
 * { orderId: string } and returns JSON { shipmentId?: string, id?: string }.
 *
 * Set VITE_MANUAL_SHIPMENT_CREATE_URL to a POST endpoint that accepts the
 * ManualShipmentDraft payload as JSON and returns JSON { shipmentId?: string, id?: string }.
 * Currency is assigned server-side at creation, so the payload carries no currency field.
 */
import type { ManualShipmentDraft } from "../recovery/recoveryTypes";

/** Thrown when generation is reached but does not produce a shipment. Unlocks manual creation. */
export class ShipmentGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShipmentGenerationError";
  }
}

function parseShipmentId(data: { shipmentId?: unknown; id?: unknown }): string {
  const id =
    typeof data.shipmentId === "string"
      ? data.shipmentId
      : typeof data.id === "string"
        ? data.id
        : null;
  if (!id) {
    throw new Error("Invalid shipment response");
  }
  return id;
}

/**
 * Fires the standard shipment-generation trigger for an order.
 * `simulateFailure` only affects the unconfigured stub branch.
 */
export async function triggerShipmentGenerationFromApi(
  orderId: string,
  options?: { simulateFailure?: boolean },
): Promise<{ shipmentId: string }> {
  const endpoint = import.meta.env.VITE_SHIPMENT_GENERATION_TRIGGER_URL as string | undefined;

  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    if (!res.ok) {
      throw new ShipmentGenerationError(`Shipment generation failed: ${res.status}`);
    }
    const data = (await res.json()) as { shipmentId?: unknown; id?: unknown };
    return { shipmentId: parseShipmentId(data) };
  }

  // TODO(backend): replace with the real generation trigger.
  await new Promise((r) => setTimeout(r, 900));
  if (options?.simulateFailure) {
    throw new ShipmentGenerationError(
      "Shipment generation did not return a shipment for this order.",
    );
  }
  return { shipmentId: `SH-${Math.floor(10_000 + Math.random() * 90_000)}` };
}

/** Creates a shipment from hand-entered details; the last resort when generation fails. */
export async function createManualShipmentFromApi(
  draft: ManualShipmentDraft,
): Promise<{ shipmentId: string }> {
  const endpoint = import.meta.env.VITE_MANUAL_SHIPMENT_CREATE_URL as string | undefined;

  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) {
      throw new Error(`Manual shipment creation failed: ${res.status}`);
    }
    const data = (await res.json()) as { shipmentId?: unknown; id?: unknown };
    return { shipmentId: parseShipmentId(data) };
  }

  // TODO(backend): replace with the real manual shipment creation call.
  await new Promise((r) => setTimeout(r, 1100));
  return { shipmentId: `SH-${Math.floor(10_000 + Math.random() * 90_000)}` };
}
